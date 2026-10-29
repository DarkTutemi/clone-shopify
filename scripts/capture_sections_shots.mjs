import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PORT = 9294;
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
    await send('Page.navigate', { url: URL });
    await new Promise(r => setTimeout(r, 6000));

    // Scroll to Section 2 (Fake Dentures comparison image)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sections = document.querySelectorAll('.zv-dentures-section');
        if (sections[1]) sections[1].scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));
    const shotSec2 = await send('Page.captureScreenshot', { format: 'png' });
    const pathSec2 = path.join(BACKUP_DIR, 'dentures_desktop_section2_comparison.png');
    fs.writeFileSync(pathSec2, Buffer.from(shotSec2.data, 'base64'));
    fs.copyFileSync(pathSec2, path.join(ARTIFACT_DIR, 'dentures_desktop_section2_comparison.png'));
    console.log('Saved Section 2 shot');

    // Scroll to Section 6 (Customer survey image)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sections = document.querySelectorAll('.zv-dentures-section');
        if (sections[5]) sections[5].scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));
    const shotSec6 = await send('Page.captureScreenshot', { format: 'png' });
    const pathSec6 = path.join(BACKUP_DIR, 'dentures_desktop_section6_survey.png');
    fs.writeFileSync(pathSec6, Buffer.from(shotSec6.data, 'base64'));
    fs.copyFileSync(pathSec6, path.join(ARTIFACT_DIR, 'dentures_desktop_section6_survey.png'));
    console.log('Saved Section 6 shot');

    ws.close();
  } finally {
    try {
      chromeProc.kill('SIGTERM');
    } catch (e) {}
  }
}

main().catch(console.error);
