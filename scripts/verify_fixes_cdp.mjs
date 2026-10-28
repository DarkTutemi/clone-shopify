import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3';
const DRAFT_THEME_ID = '187597717689';

async function getPreviewCookie() {
  const res = await fetch(`https://tryzavelyn.com/?preview_theme_id=${DRAFT_THEME_ID}`);
  const setCookie = res.headers.get('set-cookie') || '';
  const m = setCookie.match(/_shopify_essential=([^;]+)/);
  return m ? m[1] : null;
}

function launchChrome(port) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_audit_regression_' + Date.now();
  return spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1440,900'
  ], { detached: true, stdio: 'ignore' });
}

async function run() {
  console.log('=== STARTING REGRESSION VERIFICATION VIA CDP ===');
  const port = 9223;
  const chromeProc = launchChrome(port);
  await new Promise(r => setTimeout(r, 2500));

  const essentialCookie = await getPreviewCookie();
  console.log('Obtained preview cookie:', !!essentialCookie);

  // Get active tab
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
  const wsUrl = pageTab.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  function sendCDP(method, params = {}) {
    return new Promise((resolve, reject) => {
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
  }

  await sendCDP('Page.enable');
  await sendCDP('DOM.enable');
  await sendCDP('Network.enable');

  if (essentialCookie) {
    await sendCDP('Network.setCookie', {
      name: '_shopify_essential',
      value: essentialCookie,
      domain: 'tryzavelyn.com',
      path: '/'
    });
  }

  const testPages = [
    {
      name: 'pdp_thermoglove_fixed',
      url: `https://tryzavelyn.com/products/zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves?preview_theme_id=${DRAFT_THEME_ID}`
    },
    {
      name: 'pdp_custom_funnel_fixed',
      url: `https://tryzavelyn.com/products/thoson-magtrack?preview_theme_id=${DRAFT_THEME_ID}`
    },
    {
      name: 'collection_all_fixed',
      url: `https://tryzavelyn.com/collections/all?preview_theme_id=${DRAFT_THEME_ID}`
    },
    {
      name: 'homepage_fixed',
      url: `https://tryzavelyn.com/?preview_theme_id=${DRAFT_THEME_ID}`
    }
  ];

  const results = [];

  for (const p of testPages) {
    console.log(`\nNavigating to ${p.name}: ${p.url}`);
    await sendCDP('Page.navigate', { url: p.url });
    await new Promise(r => setTimeout(r, 4000));

    // 1. Mobile 390px Check
    await sendCDP('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));

    const mobileMetrics = await sendCDP('Runtime.evaluate', {
      expression: `({
        docWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        announcementText: document.querySelector('.willa-header-announcement, .announcement-bar')?.innerText || '',
        verifiedTagCount: document.querySelectorAll('.zv-verified-tag').length,
        hasModuloText: document.body.innerText.includes('reviews)')
      })`,
      returnByValue: true
    });

    const mShot = await sendCDP('Page.captureScreenshot', { format: 'png' });
    const mPath = path.join(ARTIFACT_DIR, `verify_${p.name}_mobile_390.png`);
    fs.writeFileSync(mPath, Buffer.from(mShot.data, 'base64'));

    // 2. Desktop 1440px Check
    await sendCDP('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 1000));

    const desktopMetrics = await sendCDP('Runtime.evaluate', {
      expression: `({
        docWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        announcementText: document.querySelector('.willa-header-announcement, .announcement-bar')?.innerText || ''
      })`,
      returnByValue: true
    });

    const dShot = await sendCDP('Page.captureScreenshot', { format: 'png' });
    const dPath = path.join(ARTIFACT_DIR, `verify_${p.name}_desktop_1440.png`);
    fs.writeFileSync(dPath, Buffer.from(dShot.data, 'base64'));

    const resObj = {
      page: p.name,
      mobile: mobileMetrics.result?.value,
      desktop: desktopMetrics.result?.value,
      mobileShot: mPath,
      desktopShot: dPath
    };
    results.push(resObj);
    console.log(`Results for ${p.name}:`);
    console.log(` - Mobile docWidth: ${resObj.mobile?.docWidth}px, scrollWidth: ${resObj.mobile?.scrollWidth}px, overflow: ${resObj.mobile?.overflow}`);
    console.log(` - Desktop docWidth: ${resObj.desktop?.docWidth}px, scrollWidth: ${resObj.desktop?.scrollWidth}px, overflow: ${resObj.desktop?.overflow}`);
    console.log(` - Announcement text: "${resObj.desktop?.announcementText?.slice(0, 70)}..."`);
  }

  console.log('\n=== ALL REGRESSION TESTS COMPLETE ===');
  fs.writeFileSync('scripts/audit_regression_results.json', JSON.stringify(results, null, 2), 'utf8');

  try {
    process.kill(chromeProc.pid);
  } catch (e) {}
}

run().catch(err => {
  console.error('Regression error:', err);
  process.exit(1);
});
