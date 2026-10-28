import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';

function launchChrome(port) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_qa_snap_' + Date.now();
  return spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,900'
  ], { detached: true, stdio: 'ignore' });
}

async function captureProduct1() {
  const port = 9227;
  const proc = launchChrome(port);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((res, rej) => {
        const id = msgId++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === id) {
            ws.removeEventListener('message', handler);
            if (msg.error) rej(msg.error);
            else res(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');

    const url = 'https://tryzavelyn.com/products/zavelyn-sensory-floor-mats';

    // Desktop
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 4000));
    const snapDesk = await send('Page.captureScreenshot', { format: 'png' });
    const deskPath = path.join(ARTIFACTS_DIR, 'qa_batch1_zavelyn-sensory-floor-mats_desktop_1440.png');
    fs.writeFileSync(deskPath, Buffer.from(snapDesk.data, 'base64'));
    console.log('Saved Desktop screenshot to:', deskPath);

    // Mobile
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 2500));
    const snapMob = await send('Page.captureScreenshot', { format: 'png' });
    const mobPath = path.join(ARTIFACTS_DIR, 'qa_batch1_zavelyn-sensory-floor-mats_mobile_390.png');
    fs.writeFileSync(mobPath, Buffer.from(snapMob.data, 'base64'));
    console.log('Saved Mobile screenshot to:', mobPath);

    ws.close();
    proc.kill();
  } catch (err) {
    proc.kill();
    console.error('Error:', err.message);
  }
}

captureProduct1().catch(console.error);
