import fs from 'fs';
import { spawn } from 'child_process';

const THEME_ID = '187702804665';
const PREVIEW_ROOT = `https://tryzavelyn.com/?preview_theme_id=${THEME_ID}`;
const PDP_URL = `https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=${THEME_ID}`;
const PORT = 9240;

async function main() {
  const initRes = await fetch(PREVIEW_ROOT, { redirect: 'manual' });
  const raw = initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [initRes.headers.get('set-cookie')];
  const cookie = raw[0]?.split(';')[0]?.replace('_shopify_essential=', '');

  const userDataDir = `${process.env.TEMP}\\chrome-test-shots-${Date.now()}`;
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const tabsRes = await fetch(`http://127.0.0.1:${PORT}/json`);
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page');
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

  if (cookie) {
    await send('Network.setCookie', {
      name: '_shopify_essential',
      value: cookie,
      domain: 'tryzavelyn.com',
      path: '/',
      secure: true,
      httpOnly: true
    });
  }

  console.log('Navigating to PDP...');
  await send('Page.navigate', { url: PDP_URL });
  await new Promise(r => setTimeout(r, 6000));

  // Test Mobile 390px
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 1000));

  // Enable 120ml upgrade
  await send('Runtime.evaluate', {
    expression: `(() => {
      const check = document.querySelector('#zvSizeUpgradeCheck');
      if (check && !check.checked) {
        check.checked = true;
        check.dispatchEvent(new Event('change'));
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 500));

  // Get document-relative coordinates
  const coordsRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('#zvBotanaBundleComponent');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.left + window.scrollX,
        y: r.top + window.scrollY,
        width: r.width,
        height: r.height
      };
    })()`,
    returnByValue: true
  });
  const coords = coordsRes.result.value;
  console.log('Mobile document coords:', coords);

  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: Math.max(0, coords.x - 8),
      y: Math.max(0, coords.y - 8),
      width: Math.min(390, coords.width + 16),
      height: coords.height + 16,
      scale: 1
    },
    captureBeyondViewport: true
  });

  const buf = Buffer.from(shot.data, 'base64');
  fs.writeFileSync('assets/botanaroots_qa/botana_bundle_mobile_390.png', buf);
  fs.writeFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303/botana_bundle_mobile_390.png', buf);
  console.log('Saved test mobile screenshot:', buf.length, 'bytes');

  chromeProc.kill();
}

main().catch(console.error);
