import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PORT = 9298;
const URL = 'https://tryzavelyn.com/products/zavelyn-custom-fit-home-dentures';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const BACKUP_DIR = './backups/screenshots';

async function main() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-dentures-mob-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=390,844',
    'about:blank'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const tabRes = await fetch(`http://127.0.0.1:${PORT}/json`);
    const tabs = await tabRes.json();
    const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const curId = msgId++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data.toString());
          if (msg.id === curId) {
            ws.removeEventListener('message', handler);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    console.log('Navigating mobile to', URL);
    await send('Page.navigate', { url: URL });
    await new Promise(r => setTimeout(r, 5000));

    // Scroll to Section 2 on Mobile
    console.log('Mobile scroll to Section 2...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s = document.querySelectorAll('.zv-dentures-section')[1];
        if (s) s.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));
    const shotMob2 = await send('Page.captureScreenshot', { format: 'png' });
    const pMob2 = path.join(BACKUP_DIR, 'dentures_mobile_section2.png');
    fs.writeFileSync(pMob2, Buffer.from(shotMob2.data, 'base64'));
    fs.copyFileSync(pMob2, path.join(ARTIFACT_DIR, 'dentures_mobile_section2.png'));
    console.log('Saved dentures_mobile_section2.png');

    // Scroll to Section 6 on Mobile
    console.log('Mobile scroll to Section 6...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s = document.querySelectorAll('.zv-dentures-section')[5];
        if (s) s.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));
    const shotMob6 = await send('Page.captureScreenshot', { format: 'png' });
    const pMob6 = path.join(BACKUP_DIR, 'dentures_mobile_section6.png');
    fs.writeFileSync(pMob6, Buffer.from(shotMob6.data, 'base64'));
    fs.copyFileSync(pMob6, path.join(ARTIFACT_DIR, 'dentures_mobile_section6.png'));
    console.log('Saved dentures_mobile_section6.png');

    ws.close();
  } finally {
    try {
      chromeProc.kill('SIGTERM');
    } catch (e) {}
  }
}

main().catch(console.error);
