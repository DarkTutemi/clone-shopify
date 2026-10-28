import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 9263;
const URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';

async function recaptureScreenshots() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-recapture-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,1000',
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
    await send('Page.navigate', { url: URL });
    await new Promise(r => setTimeout(r, 4000));

    // Clear cart and close drawer
    await send('Runtime.evaluate', {
      expression: `
        (async () => {
          await fetch('/cart/clear.js', { method: 'POST' });
          if (typeof window.willaCloseCartDrawer === 'function') window.willaCloseCartDrawer();
          const drawer = document.querySelector('zavelyn-cart-drawer');
          if (drawer && typeof drawer.close === 'function') drawer.close();
          const modalBackdrop = document.querySelector('.cart-drawer-backdrop');
          if (modalBackdrop) modalBackdrop.click();

          // Select Buy 3 and Size Upgrade
          const card3 = document.querySelector('.zv-bundle-card[data-bundle="3"]');
          if (card3) card3.click();
          const check = document.getElementById('zvSizeUpgradeCheck');
          if (check && !check.checked) {
            document.getElementById('zvUpsellCard').click();
          }
        })()
      `,
      awaitPromise: true
    });

    await new Promise(r => setTimeout(r, 800));

    // 1. Capture Desktop
    const dBlockRect = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const block = document.getElementById('zvBotanaBundleComponent');
          const rect = block.getBoundingClientRect();
          return {
            x: Math.max(0, rect.left + window.scrollX - 15),
            y: Math.max(0, rect.top + window.scrollY - 15),
            width: rect.width + 30,
            height: rect.height + 30
          };
        })()
      `,
      returnByValue: true
    });

    const dClip = dBlockRect.result.value;
    const desktopShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: dClip.x, y: dClip.y, width: dClip.width, height: dClip.height, scale: 1 },
      captureBeyondViewport: true
    });
    fs.writeFileSync('backups/botanaroots_fixed_bundle_desktop.png', Buffer.from(desktopShot.data, 'base64'));
    fs.writeFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303/botanaroots_fixed_bundle_desktop.png', Buffer.from(desktopShot.data, 'base64'));
    console.log('✓ Recaptured botanaroots_fixed_bundle_desktop.png');

    // 2. Capture Mobile
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 800));

    // Hide fixed sticky bar for clear screenshot
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          document.querySelectorAll('.zv-sticky-atc-bar, .sticky-atc-bar').forEach(el => el.style.display = 'none');
          window.scrollTo(0, 0);
        })()
      `
    });
    await new Promise(r => setTimeout(r, 400));

    const mBlockRect = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const block = document.getElementById('zvBotanaBundleComponent');
          const rect = block.getBoundingClientRect();
          const pageY = rect.top + window.scrollY;
          return {
            x: 0,
            y: Math.max(0, pageY - 10),
            width: 375,
            height: rect.height + 20
          };
        })()
      `,
      returnByValue: true
    });

    const mClip = mBlockRect.result.value;
    const mobileShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: mClip.x, y: mClip.y, width: mClip.width, height: mClip.height, scale: 1 },
      captureBeyondViewport: true
    });
    fs.writeFileSync('backups/botanaroots_fixed_bundle_mobile.png', Buffer.from(mobileShot.data, 'base64'));
    fs.writeFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303/botanaroots_fixed_bundle_mobile.png', Buffer.from(mobileShot.data, 'base64'));
    console.log('✓ Recaptured botanaroots_fixed_bundle_mobile.png');

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

recaptureScreenshots().catch(console.error);
