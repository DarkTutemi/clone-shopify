import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 9245;
const URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';

async function captureMobileBefore() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-before-mob-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=375,1000',
    'about:blank'
  ]);

  try {
    await new Promise(r => setTimeout(r, 1500));
    const res = await fetch(`http://127.0.0.1:${PORT}/json`);
    const tabs = await res.json();
    const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = msgId++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('DOM.enable');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });

    await send('Page.navigate', { url: URL });
    await new Promise(r => setTimeout(r, 4000));

    // Scroll block into view and get viewport coordinates
    const clipInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const block = document.querySelector('.zv-benefits-block');
          if (block) {
            block.scrollIntoView({ block: 'center' });
            const rect = block.getBoundingClientRect();
            return {
              x: 0,
              y: Math.max(0, rect.top - 40),
              width: 375,
              height: rect.height + 70,
              scale: 1
            };
          }
          return null;
        })()
      `,
      returnByValue: true
    });

    await new Promise(r => setTimeout(r, 500));

    console.log('Mobile clip info:', clipInfo.result?.value);
    const mClip = clipInfo.result?.value;

    const mobileShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: mClip
    });
    fs.writeFileSync('backups/botanaroots_before_benefits_mobile.png', Buffer.from(mobileShot.data, 'base64'));
    console.log('✓ Saved clean backups/botanaroots_before_benefits_mobile.png');

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

captureMobileBefore().catch(console.error);
