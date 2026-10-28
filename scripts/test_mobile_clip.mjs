import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 9246;
const URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';

async function testMobileClip() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-test-mob-${Date.now()}`,
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

    const coords = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.querySelector('.zv-benefits-block');
          const rect = el.getBoundingClientRect();
          const pageY = rect.top + window.scrollY;
          return {
            pageY,
            rectTop: rect.top,
            rectHeight: rect.height,
            scrollY: window.scrollY
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Mobile coords:', coords.result?.value);
    const { pageY, rectHeight } = coords.result.value;

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 0,
        y: pageY - 10,
        width: 375,
        height: rectHeight + 30,
        scale: 1
      },
      captureBeyondViewport: true
    });

    fs.writeFileSync('backups/botanaroots_before_benefits_mobile.png', Buffer.from(shot.data, 'base64'));
    console.log('✓ Saved accurate backups/botanaroots_before_benefits_mobile.png');

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

testMobileClip().catch(console.error);
