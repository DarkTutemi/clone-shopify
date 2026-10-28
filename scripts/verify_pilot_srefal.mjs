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
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_pilot_2_' + Date.now();
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
  console.log('=== VERIFYING PILOT MIGRATION WITH EXACT SELECTORS ===');
  const port = 9225;
  const chromeProc = launchChrome(port);
  await new Promise(r => setTimeout(r, 2500));

  const essentialCookie = await getPreviewCookie();

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

  const pilotPages = [
    {
      name: 'pilot_srefalsteam',
      url: `https://tryzavelyn.com/products/srefalsteam?preview_theme_id=${DRAFT_THEME_ID}`
    },
    {
      name: 'pilot_megalifters',
      url: `https://tryzavelyn.com/products/zavelyn-megalifters-heavy-duty-alloy-rc-construction-fleet?preview_theme_id=${DRAFT_THEME_ID}`
    }
  ];

  for (const p of pilotPages) {
    console.log(`\nNavigating to ${p.name}: ${p.url}`);
    await sendCDP('Page.navigate', { url: p.url });
    await new Promise(r => setTimeout(r, 4500));

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
        hasUniversalBuyBox: !!document.querySelector('#zvPdpSection, .zv-pdp-section-wrap'),
        hasCustomContent: !!document.querySelector('.wf-banner-section') || !!document.querySelector('.zv-pdp-desc-container'),
        hasDoorstepShipping: !!document.querySelector('#zv-doorstep-delivery, .zv-delivery-section'),
        title: document.querySelector('.zv-pdp-title')?.innerText || document.querySelector('h1')?.innerText || '',
        price: document.querySelector('#zvPriceCurrent, .kc-price-current')?.innerText || '',
        atcBtnText: document.querySelector('#zvClaimOfferBtn, .zv-claim-btn')?.innerText || '',
        buyNowBtnText: document.querySelector('#zvBuyNowBtn')?.innerText || ''
      })`,
      returnByValue: true
    });

    const mShot = await sendCDP('Page.captureScreenshot', { format: 'png' });
    const mPath = path.join(ARTIFACT_DIR, `${p.name}_mobile_390.png`);
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
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
      })`,
      returnByValue: true
    });

    const dShot = await sendCDP('Page.captureScreenshot', { format: 'png' });
    const dPath = path.join(ARTIFACT_DIR, `${p.name}_desktop_1440.png`);
    fs.writeFileSync(dPath, Buffer.from(dShot.data, 'base64'));

    console.log(`Results for ${p.name}:`);
    console.log(` - Title: "${mobileMetrics.result?.value?.title}"`);
    console.log(` - Price: "${mobileMetrics.result?.value?.price}"`);
    console.log(` - Has Universal BuyBox (#zvPdpSection): ${mobileMetrics.result?.value?.hasUniversalBuyBox}`);
    console.log(` - Has Custom Body Content: ${mobileMetrics.result?.value?.hasCustomContent}`);
    console.log(` - Has Doorstep Shipping (#zv-doorstep-delivery): ${mobileMetrics.result?.value?.hasDoorstepShipping}`);
    console.log(` - ATC Button Text: "${mobileMetrics.result?.value?.atcBtnText}"`);
    console.log(` - Buy Now Button Text: "${mobileMetrics.result?.value?.buyNowBtnText}"`);
    console.log(` - Mobile scrollWidth: ${mobileMetrics.result?.value?.scrollWidth}px (overflow: ${mobileMetrics.result?.value?.overflow})`);
    console.log(` - Desktop scrollWidth: ${desktopMetrics.result?.value?.scrollWidth}px (overflow: ${desktopMetrics.result?.value?.overflow})`);
  }

  console.log('\n=== PILOT VERIFICATION COMPLETE ===');
  try {
    process.kill(chromeProc.pid);
  } catch (e) {}
}

run().catch(err => {
  console.error('Pilot verification error:', err);
  process.exit(1);
});
