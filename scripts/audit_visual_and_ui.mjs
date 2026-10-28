import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3';
const PREVIEW_ROOT = 'https://tryzavelyn.com/?preview_theme_id=187597717689';
const PORT = 9235;

const PAGES_TO_TEST = [
  { name: 'homepage', url: 'https://tryzavelyn.com/?preview_theme_id=187597717689' },
  { name: 'collection_all', url: 'https://tryzavelyn.com/collections/all?preview_theme_id=187597717689' },
  { name: 'pdp_thermoglove', url: 'https://tryzavelyn.com/products/zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves?preview_theme_id=187597717689' },
  { name: 'pdp_fallback', url: 'https://tryzavelyn.com/products/zavelyn-foot-sleeves-bogo-free?preview_theme_id=187597717689' },
  { name: 'pdp_custom_funnel', url: 'https://tryzavelyn.com/products/thoson-magtrack?preview_theme_id=187597717689' },
  { name: 'cart_page', url: 'https://tryzavelyn.com/cart?preview_theme_id=187597717689' },
  { name: 'track_order', url: 'https://tryzavelyn.com/pages/track-order?preview_theme_id=187597717689' }
];

async function getPreviewCookie() {
  const initRes = await fetch(PREVIEW_ROOT, { redirect: 'manual' });
  const rawCookies = initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [initRes.headers.get('set-cookie')];
  const essentialCookie = rawCookies.find(c => c && c.startsWith('_shopify_essential='));
  if (essentialCookie) {
    return essentialCookie.split(';')[0].replace('_shopify_essential=', '');
  }
  return null;
}

async function runVisualAudit() {
  const cookieVal = await getPreviewCookie();
  console.log("Got _shopify_essential cookie:", cookieVal ? "YES" : "NO");

  const userDataDir = `${process.env.TEMP}\\chrome-visual-audit-${Date.now()}`;
  console.log(`Launching dedicated Chrome on port ${PORT}...`);
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1440,900',
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
  const consoleErrors = [];
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = msgId++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
          consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
        }
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
  await send('Runtime.enable');

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

  const auditReport = [];

  for (const pageItem of PAGES_TO_TEST) {
    console.log(`\n======================================================`);
    console.log(`AUDITING: ${pageItem.name} (${pageItem.url})`);
    console.log(`======================================================`);

    await send('Page.navigate', { url: pageItem.url });
    await new Promise(r => setTimeout(r, 4500));

    // Dismiss banners
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.querySelectorAll('shopify-privacy-banner, #shopify-pc__banner, .shopify-policy__container, div[role="dialog"]').forEach(e => e.remove());
        const previewBar = document.querySelector('#preview-bar-iframe');
        if (previewBar) previewBar.remove();
      })()`
    });

    // 1. Desktop 1440px Evaluation
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 1000));

    const deskEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const brokenImgs = Array.from(document.querySelectorAll('img')).filter(img => img.complete && img.naturalWidth === 0).map(img => img.src);
        const title = document.title;
        const h1 = document.querySelector('h1')?.textContent?.trim();
        const forms = Array.from(document.querySelectorAll('form')).map(f => f.action);

        return {
          title,
          h1,
          docWidth,
          scrollWidth,
          overflow: scrollWidth > docWidth,
          brokenImgsCount: brokenImgs.length,
          brokenImgsSample: brokenImgs.slice(0, 5)
        };
      })()`,
      returnByValue: true
    });

    // Capture Desktop screenshot
    const deskShot = await send('Page.captureScreenshot', { format: 'png' });
    const deskPath = `${ARTIFACT_DIR}/audit_${pageItem.name}_desktop_1440.png`;
    fs.writeFileSync(deskPath, Buffer.from(deskShot.data, 'base64'));

    // 2. Mobile 390px Evaluation
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));

    const mobEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const overflowingElements = [];
        document.querySelectorAll('*').forEach(el => {
          if (el.clientWidth > docWidth + 2) {
            overflowingElements.push({
              tag: el.tagName,
              id: el.id,
              class: el.className,
              width: el.clientWidth
            });
          }
        });

        return {
          docWidth,
          scrollWidth,
          overflow: scrollWidth > docWidth,
          overflowingElements: overflowingElements.slice(0, 5)
        };
      })()`,
      returnByValue: true
    });

    // Capture Mobile screenshot
    const mobShot = await send('Page.captureScreenshot', { format: 'png' });
    const mobPath = `${ARTIFACT_DIR}/audit_${pageItem.name}_mobile_390.png`;
    fs.writeFileSync(mobPath, Buffer.from(mobShot.data, 'base64'));

    const pageResult = {
      name: pageItem.name,
      url: pageItem.url,
      desktop: deskEval.result.value,
      mobile: mobEval.result.value,
      desktopShot: deskPath,
      mobileShot: mobPath
    };

    console.log(`Results for ${pageItem.name}:`, JSON.stringify(pageResult, null, 2));
    auditReport.push(pageResult);
  }

  fs.writeFileSync('scripts/audit_visual_report.json', JSON.stringify({
    pages: auditReport,
    consoleErrors: consoleErrors.slice(0, 20)
  }, null, 2));

  ws.close();
  chromeProc.kill();
  console.log("\n✔ COMPLETED ALL VISUAL AUDITS ACROSS 7 KEY PAGES!");
}

runVisualAudit().catch(err => {
  console.error("Visual audit failed:", err);
  process.exit(1);
});
