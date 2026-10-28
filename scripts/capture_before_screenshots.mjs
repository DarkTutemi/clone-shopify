import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 9244;
const URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';

async function captureBefore() {
  console.log('--- Launching Chrome for BEFORE Screenshots ---');
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-before-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,1200',
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
    await send('Network.enable');

    // 1. Desktop Before
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 1000,
      deviceScaleFactor: 2,
      mobile: false
    });

    console.log('Navigating to live PDP...');
    await send('Page.navigate', { url: URL });
    await new Promise(r => setTimeout(r, 4000));

    // Capture clip of product info / benefits
    const clipInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const block = document.querySelector('.zv-benefits-block') || document.querySelector('.zv-right-column');
          if (block) {
            const rect = block.getBoundingClientRect();
            return {
              x: Math.max(0, rect.left + window.scrollX - 20),
              y: Math.max(0, rect.top + window.scrollY - 80),
              width: rect.width + 40,
              height: rect.height + 140,
              scale: 1
            };
          }
          return null;
        })()
      `,
      returnByValue: true
    });

    console.log('Desktop clip bounding box:', clipInfo.result?.value);
    const clip = clipInfo.result?.value || { x: 600, y: 100, width: 650, height: 800, scale: 1 };

    const desktopShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: clip
    });
    fs.writeFileSync('backups/botanaroots_before_benefits_desktop.png', Buffer.from(desktopShot.data, 'base64'));
    console.log('✓ Saved backups/botanaroots_before_benefits_desktop.png');

    // 2. Mobile Before
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));

    const mobileClipInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const block = document.querySelector('.zv-benefits-block');
          if (block) {
            const rect = block.getBoundingClientRect();
            return {
              x: 0,
              y: Math.max(0, rect.top + window.scrollY - 60),
              width: 375,
              height: rect.height + 120,
              scale: 1
            };
          }
          return null;
        })()
      `,
      returnByValue: true
    });

    console.log('Mobile clip bounding box:', mobileClipInfo.result?.value);
    const mClip = mobileClipInfo.result?.value || { x: 0, y: 300, width: 375, height: 600, scale: 1 };

    const mobileShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: mClip
    });
    fs.writeFileSync('backups/botanaroots_before_benefits_mobile.png', Buffer.from(mobileShot.data, 'base64'));
    console.log('✓ Saved backups/botanaroots_before_benefits_mobile.png');

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

captureBefore().catch(console.error);
