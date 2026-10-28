import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3';
const PREVIEW_ROOT = 'https://tryzavelyn.com/?preview_theme_id=187597717689';
const PREVIEW_PDP = 'https://tryzavelyn.com/products/zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves?preview_theme_id=187597717689';
const PORT = 9230;

async function getPreviewCookie() {
  const initRes = await fetch(PREVIEW_ROOT, { redirect: 'manual' });
  const rawCookies = initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [initRes.headers.get('set-cookie')];
  const essentialCookie = rawCookies.find(c => c && c.startsWith('_shopify_essential='));
  if (essentialCookie) {
    return essentialCookie.split(';')[0].replace('_shopify_essential=', '');
  }
  return null;
}

async function main() {
  const cookieVal = await getPreviewCookie();

  const userDataDir = `${process.env.TEMP}\\chrome-qa-${Date.now()}`;
  console.log(`Launching dedicated Chrome on port ${PORT}...`);
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1440,960',
    'about:blank'
  ]);

  let tabs = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      tabs = await res.json();
      if (tabs && tabs.length > 0) break;
    } catch (e) {}
  }

  if (!tabs) {
    chromeProc.kill();
    throw new Error(`Could not connect to Chrome on port ${PORT}`);
  }

  const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

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

  await new Promise(r => ws.addEventListener('open', r));
  await send('Network.enable');

  if (cookieVal) {
    await send('Network.setCookie', {
      name: '_shopify_essential',
      value: cookieVal,
      domain: '.tryzavelyn.com',
      path: '/',
      secure: true,
      httpOnly: true
    });
  }

  await send('Page.navigate', { url: PREVIEW_PDP });
  await new Promise(r => setTimeout(r, 5000));

  // Dismiss cookie banner and floating bars
  await send('Runtime.evaluate', {
    expression: `(() => {
      // Find accept button
      const buttons = Array.from(document.querySelectorAll('button'));
      const acceptBtn = buttons.find(b => b.innerText.trim().toLowerCase() === 'accept');
      if (acceptBtn) acceptBtn.click();

      // Also remove any banner container
      document.querySelectorAll('shopify-privacy-banner, #shopify-pc__banner, .shopify-policy__container, div[role="dialog"]').forEach(el => el.remove());
      const previewBar = document.querySelector('#preview-bar-iframe');
      if (previewBar) previewBar.remove();
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  // =========================================================================
  // 1. DESKTOP 1440px SCREENSHOT (Unobstructed, full section)
  // =========================================================================
  console.log("\nCapturing clean Desktop 1440px screenshot...");
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 920,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 500));

  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector("#zv-doorstep-delivery");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      // Remove any lingering dialogs
      document.querySelectorAll('shopify-privacy-banner, #shopify-pc__banner, .shopify-policy__container, div[role="dialog"]').forEach(e => e.remove());
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));

  const deskShot = await send('Page.captureScreenshot', {
    format: 'png'
  });

  const deskDest = `${ARTIFACT_DIR}/doorstep_delivery_desktop_1440.png`;
  fs.writeFileSync(deskDest, Buffer.from(deskShot.data, 'base64'));
  console.log(`✔ Saved unobstructed Desktop 1440px Screenshot: ${deskDest} (${fs.statSync(deskDest).size} bytes)`);

  // =========================================================================
  // 2. MOBILE 390px SCREENSHOT (Unobstructed, full section)
  // =========================================================================
  console.log("\nCapturing clean Mobile 390px screenshot...");
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 1260,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));

  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector("#zv-doorstep-delivery");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      document.querySelectorAll('shopify-privacy-banner, #shopify-pc__banner, .shopify-policy__container, div[role="dialog"]').forEach(e => e.remove());
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));

  const mobShot = await send('Page.captureScreenshot', {
    format: 'png'
  });

  const mobDest = `${ARTIFACT_DIR}/doorstep_delivery_mobile_390.png`;
  fs.writeFileSync(mobDest, Buffer.from(mobShot.data, 'base64'));
  console.log(`✔ Saved unobstructed Mobile 390px Screenshot: ${mobDest} (${fs.statSync(mobDest).size} bytes)`);

  ws.close();
  chromeProc.kill();
  console.log("\n✔ COMPLETED CLEAN SCREENSHOTS!");
}

main().catch(err => {
  console.error("Failed:", err);
  process.exit(1);
});
