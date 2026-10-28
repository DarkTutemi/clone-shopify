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
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_qa_full_' + Date.now();
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
  console.log('=== PHASE E: FULL STOREWIDE REGRESSION QA ===');
  const port = 9226;
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

  const testProducts = [
    { key: 'megalifters', url: 'https://tryzavelyn.com/products/zavelyn-megalifters-heavy-duty-alloy-rc-construction-fleet?preview_theme_id=' + DRAFT_THEME_ID },
    { key: 'srefalsteam', url: 'https://tryzavelyn.com/products/srefalsteam?preview_theme_id=' + DRAFT_THEME_ID },
    { key: 'thermoglove', url: 'https://tryzavelyn.com/products/zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves?preview_theme_id=' + DRAFT_THEME_ID },
    { key: 'magtrack', url: 'https://tryzavelyn.com/products/thoson-magtrack?preview_theme_id=' + DRAFT_THEME_ID },
    { key: 'yeoman_sweep', url: 'https://tryzavelyn.com/products/the-yeoman-sweep?preview_theme_id=' + DRAFT_THEME_ID },
    { key: 'heating_lamp', url: 'https://tryzavelyn.com/products/livestock-heating-lamp?preview_theme_id=' + DRAFT_THEME_ID },
    { key: 'drum_pro', url: 'https://tryzavelyn.com/products/zavelyn-drum-pro?preview_theme_id=' + DRAFT_THEME_ID },
    { key: 'fence_post', url: 'https://tryzavelyn.com/products/sakerplus-fence-post-repair-kit?preview_theme_id=' + DRAFT_THEME_ID }
  ];

  const qaReport = [];

  for (const p of testProducts) {
    console.log(`\nTesting ${p.key}: ${p.url}`);
    await sendCDP('Page.navigate', { url: p.url });
    await new Promise(r => setTimeout(r, 4500));

    // 1. Mobile 390px
    await sendCDP('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 800));
    const mEval = await sendCDP('Runtime.evaluate', {
      expression: `({
        docWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        hasUniversalBuyBox: !!document.querySelector('#zvPdpSection'),
        hasGallery: !!document.querySelector('#zvMainImg'),
        hasTitle: !!document.querySelector('.zv-pdp-title'),
        hasPrice: !!document.querySelector('#zvPriceCurrent'),
        hasATC: !!document.querySelector('#zvClaimOfferBtn'),
        hasBuyNow: !!document.querySelector('#zvBuyNowBtn'),
        hasPaymentIcons: !!document.querySelector('.zv-payment-icons'),
        hasTrustBadges: !!document.querySelector('.zv-trust-badges'),
        hasDoorstepShipping: !!document.querySelector('#zv-doorstep-delivery'),
        title: document.querySelector('.zv-pdp-title')?.innerText || '',
        price: document.querySelector('#zvPriceCurrent')?.innerText || ''
      })`,
      returnByValue: true
    });
    const mShot = await sendCDP('Page.captureScreenshot', { format: 'png' });
    const mPath = path.join(ARTIFACT_DIR, `qa_unified_${p.key}_mobile_390.png`);
    fs.writeFileSync(mPath, Buffer.from(mShot.data, 'base64'));

    // 2. Tablet 768px
    await sendCDP('Emulation.setDeviceMetricsOverride', { width: 768, height: 1024, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 600));
    const tEval = await sendCDP('Runtime.evaluate', {
      expression: `({
        docWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
      })`,
      returnByValue: true
    });
    const tShot = await sendCDP('Page.captureScreenshot', { format: 'png' });
    const tPath = path.join(ARTIFACT_DIR, `qa_unified_${p.key}_tablet_768.png`);
    fs.writeFileSync(tPath, Buffer.from(tShot.data, 'base64'));

    // 3. Desktop 1440px
    await sendCDP('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 800));
    const dEval = await sendCDP('Runtime.evaluate', {
      expression: `({
        docWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
      })`,
      returnByValue: true
    });
    const dShot = await sendCDP('Page.captureScreenshot', { format: 'png' });
    const dPath = path.join(ARTIFACT_DIR, `qa_unified_${p.key}_desktop_1440.png`);
    fs.writeFileSync(dPath, Buffer.from(dShot.data, 'base64'));

    const item = {
      product: p.key,
      title: mEval.result?.value?.title,
      price: mEval.result?.value?.price,
      universalBuyBox: mEval.result?.value?.hasUniversalBuyBox,
      gallery: mEval.result?.value?.hasGallery,
      atc: mEval.result?.value?.hasATC,
      buyNow: mEval.result?.value?.hasBuyNow,
      payments: mEval.result?.value?.hasPaymentIcons,
      trustBadges: mEval.result?.value?.hasTrustBadges,
      doorstepShipping: mEval.result?.value?.hasDoorstepShipping,
      mobileOverflow: mEval.result?.value?.overflow,
      tabletOverflow: tEval.result?.value?.overflow,
      desktopOverflow: dEval.result?.value?.overflow,
      mobileScrollWidth: mEval.result?.value?.scrollWidth,
      tabletScrollWidth: tEval.result?.value?.scrollWidth,
      desktopScrollWidth: dEval.result?.value?.scrollWidth,
      shots: { mobile: mPath, tablet: tPath, desktop: dPath }
    };

    qaReport.push(item);
    console.log(` -> Title: "${item.title}" | Price: ${item.price}`);
    console.log(` -> BuyBox: ${item.universalBuyBox} | Gallery: ${item.gallery} | Doorstep: ${item.doorstepShipping}`);
    console.log(` -> Overflow: Mobile: ${item.mobileOverflow} (${item.mobileScrollWidth}px) | Tablet: ${item.tabletOverflow} | Desktop: ${item.desktopOverflow}`);
  }

  console.log('\n=== QA REPORT SUMMARY ===');
  console.log(JSON.stringify(qaReport, null, 2));

  fs.writeFileSync('scripts/qa_full_regression_report.json', JSON.stringify(qaReport, null, 2), 'utf8');

  try {
    process.kill(chromeProc.pid);
  } catch (e) {}
}

run().catch(err => {
  console.error('QA Execution Error:', err);
  process.exit(1);
});
