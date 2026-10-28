import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const BASELINE_DIR = 'assets/botanaroots_baseline_v2';
const LIVE_PDP_URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';
const PORT = 9257;

if (!fs.existsSync(BASELINE_DIR)) fs.mkdirSync(BASELINE_DIR, { recursive: true });

async function main() {
  console.log('Capturing current Live baseline screenshots...');
  const userDataDir = `${process.env.TEMP}\\chrome-baseline-v2-${Date.now()}`;
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,1200',
    'about:blank'
  ]);

  let tabs = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      tabs = await res.json();
      if (tabs && tabs.length > 0) break;
    } catch (e) {}
  }

  const tab = tabs.find(t => t.type === 'page') || tabs[0];
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

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

  console.log(`Navigating to ${LIVE_PDP_URL}...`);
  await send('Page.navigate', { url: LIVE_PDP_URL });
  await new Promise(r => setTimeout(r, 6000));

  async function captureDocClip(filename, selector, pad = 12) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.querySelectorAll('#preview-bar-iframe, #shopify-pc__banner, .shopify-preview-bar, iframe, .zv-sticky-atc-wrap').forEach(el => el.remove());
        const comp = document.querySelector('${selector}');
        if (comp) comp.scrollIntoView({ block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${selector}');
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
    const coords = res.result?.value;
    if (!coords) {
      console.warn(`Element ${selector} not found`);
      return;
    }

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.max(0, coords.x - pad),
        y: Math.max(0, coords.y - pad),
        width: coords.width + pad * 2,
        height: coords.height + pad * 2,
        scale: 1
      },
      captureBeyondViewport: true
    });
    const buf = Buffer.from(shot.data, 'base64');
    fs.writeFileSync(`${BASELINE_DIR}/${filename}`, buf);
    fs.writeFileSync(`${ARTIFACT_DIR}/${filename}`, buf);
    console.log(`📸 Saved Baseline Shot: ${filename} (${Math.round(buf.length / 1024)} KB)`);
  }

  // 1. Desktop 1440px Baseline
  console.log('\n--- 1. Desktop 1440px Baseline ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 600));
  await captureDocClip('baseline_bundle_desktop_1440.png', '#zvBotanaBundleComponent', 16);

  // 2. Mobile 390px Baseline (iPhone)
  console.log('\n--- 2. Mobile 390px Baseline ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 600));
  await captureDocClip('baseline_bundle_mobile_390.png', '#zvBotanaBundleComponent', 8);

  // 3. Mobile 375px Baseline
  console.log('\n--- 3. Mobile 375px Baseline ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 600));
  await captureDocClip('baseline_bundle_mobile_375.png', '#zvBotanaBundleComponent', 8);

  // 4. Baseline Trust Cards on Mobile (showing the overflow issue)
  console.log('\n--- 4. Mobile Trust Cards Baseline ---');
  await captureDocClip('baseline_trust_cards_mobile.png', '.zv-trust-cards-row, .kc-trust, .zv-pdp-trust-grid', 8);

  // 5. Baseline FAQ on Mobile
  console.log('\n--- 5. Mobile FAQ Baseline ---');
  await captureDocClip('baseline_faq_mobile.png', '.zv-pdp-faq-wrap, #shopify-section-faq, .pdp-faq', 8);

  chromeProc.kill();
  console.log('\nBaseline capture complete.');
}

main().catch(console.error);
