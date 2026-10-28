import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 9251;
const BOTANA_URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';

async function captureCleanMobile() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-qa-mob-clean-${Date.now()}`,
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

    await send('Page.navigate', { url: BOTANA_URL });
    await new Promise(r => setTimeout(r, 4000));

    // Hide sticky floating elements that might overlap when scrolled
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          document.querySelectorAll('.zv-sticky-bottom-bar, .sticky-atc-bar, [class*="sticky"]').forEach(el => {
            if (getComputedStyle(el).position === 'fixed') {
              el.style.display = 'none';
            }
          });
          window.scrollTo(0, 0);
        })()
      `
    });

    await new Promise(r => setTimeout(r, 600));

    const mCoords = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.querySelector('.zv-benefits-block');
          const rect = el.getBoundingClientRect();
          const pageY = rect.top + window.scrollY;
          return {
            x: 0,
            y: Math.max(0, pageY - 12),
            width: 375,
            height: rect.height + 24
          };
        })()
      `,
      returnByValue: true
    });

    const clip = mCoords.result.value;
    console.log('Clean mobile clip:', clip);

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: clip.x,
        y: clip.y,
        width: clip.width,
        height: clip.height,
        scale: 1
      },
      captureBeyondViewport: true
    });

    fs.writeFileSync('backups/botanaroots_after_benefits_mobile.png', Buffer.from(shot.data, 'base64'));
    console.log('✓ Saved clean backups/botanaroots_after_benefits_mobile.png');

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

captureCleanMobile().catch(console.error);
