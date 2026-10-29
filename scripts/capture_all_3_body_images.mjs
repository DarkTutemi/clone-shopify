import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PORT = 9297;
const URL = 'https://tryzavelyn.com/products/zavelyn-custom-fit-home-dentures';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const BACKUP_DIR = './backups/screenshots';

async function main() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-dentures-shots-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,1200',
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
    console.log('Navigating to', URL);
    await send('Page.navigate', { url: URL });
    await new Promise(r => setTimeout(r, 5000));

    // Wait until all 3 body images are fully loaded
    console.log('Waiting for body images to be complete...');
    for (let i = 0; i < 20; i++) {
      const status = await send('Runtime.evaluate', {
        expression: `(() => {
          const imgs = Array.from(document.querySelectorAll('.zv-dentures-body-img'));
          return {
            total: imgs.length,
            loaded: imgs.filter(img => img.complete && img.naturalWidth > 0).length,
            details: imgs.map((img, idx) => ({
              idx: idx + 1,
              src: img.src,
              complete: img.complete,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight
            }))
          };
        })()`,
        returnByValue: true
      });
      const val = status.result.value;
      console.log(`Images loaded: ${val.loaded}/${val.total}`);
      if (val.loaded === val.total && val.total === 3) {
        console.log('All 3 body images confirmed loaded!');
        console.log(JSON.stringify(val.details, null, 2));
        break;
      }
      // Scroll down to help trigger any pending loads
      await send('Runtime.evaluate', { expression: `window.scrollBy(0, 500);` });
      await new Promise(r => setTimeout(r, 1000));
    }

    // 1. Capture Section 1
    console.log('Scrolling to Section 1...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s = document.querySelectorAll('.zv-dentures-section')[0];
        if (s) s.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    const p1 = path.join(BACKUP_DIR, 'dentures_body_section1.png');
    fs.writeFileSync(p1, Buffer.from(shot1.data, 'base64'));
    fs.copyFileSync(p1, path.join(ARTIFACT_DIR, 'dentures_body_section1.png'));
    console.log('Saved dentures_body_section1.png');

    // 2. Capture Section 2
    console.log('Scrolling to Section 2...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s = document.querySelectorAll('.zv-dentures-section')[1];
        if (s) s.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    const p2 = path.join(BACKUP_DIR, 'dentures_body_section2.png');
    fs.writeFileSync(p2, Buffer.from(shot2.data, 'base64'));
    fs.copyFileSync(p2, path.join(ARTIFACT_DIR, 'dentures_body_section2.png'));
    console.log('Saved dentures_body_section2.png');

    // 3. Capture Section 6
    console.log('Scrolling to Section 6...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const s = document.querySelectorAll('.zv-dentures-section')[5];
        if (s) s.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));
    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    const p3 = path.join(BACKUP_DIR, 'dentures_body_section6.png');
    fs.writeFileSync(p3, Buffer.from(shot3.data, 'base64'));
    fs.copyFileSync(p3, path.join(ARTIFACT_DIR, 'dentures_body_section6.png'));
    console.log('Saved dentures_body_section6.png');

    ws.close();
  } finally {
    try {
      chromeProc.kill('SIGTERM');
    } catch (e) {}
  }
}

main().catch(console.error);
