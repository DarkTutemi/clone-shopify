import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const DRAFT_THEME_ID = '187597717689';

async function getPreviewCookie() {
  const res = await fetch(`https://tryzavelyn.com/?preview_theme_id=${DRAFT_THEME_ID}`);
  const setCookie = res.headers.get('set-cookie') || '';
  const m = setCookie.match(/_shopify_essential=([^;]+)/);
  return m ? m[1] : null;
}

function launchChrome(port) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_handpan_qa_' + Date.now();
  return spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1440,1000'
  ], { detached: true, stdio: 'ignore' });
}

async function run() {
  console.log('=== VERIFYING HANDPANS OVERHAUL ACROSS VIEWPORTS ===');
  const port = 9235;
  const chromeProc = launchChrome(port);
  await new Promise(r => setTimeout(r, 2500));

  const essentialCookie = await getPreviewCookie();

  const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
  const wsUrl = pageTab.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

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

  await sendCDP('Network.enable');
  await sendCDP('Page.enable');

  if (essentialCookie) {
    await sendCDP('Network.setCookie', {
      name: '_shopify_essential',
      value: essentialCookie,
      domain: 'tryzavelyn.com',
      path: '/'
    });
  }

  const viewports = [
    { name: 'desktop_1440', width: 1440, height: 1000, mobile: false, dsf: 1 },
    { name: 'laptop_1280', width: 1280, height: 900, mobile: false, dsf: 1 },
    { name: 'tablet_768', width: 768, height: 1024, mobile: true, dsf: 2 },
    { name: 'mobile_390', width: 390, height: 844, mobile: true, dsf: 2 },
    { name: 'mobile_375', width: 375, height: 812, mobile: true, dsf: 2 }
  ];

  const results = {
    collection: {},
    product_master: {},
    all_drums: {}
  };

  // 1. TEST COLLECTION PAGE
  console.log('\n--- 1. Testing Collection: /collections/zavelyn-handpans ---');
  await sendCDP('Page.navigate', { url: `https://tryzavelyn.com/collections/zavelyn-handpans?preview_theme_id=${DRAFT_THEME_ID}` });
  await new Promise(r => setTimeout(r, 4500));

  // Dismiss cookie banner
  await sendCDP('Runtime.evaluate', {
    expression: `(() => {
      const b = document.querySelector('#shopify-pc__banner, .shopify-cookie-banner, [aria-label="Consent banner"]');
      if (b) b.remove();
    })()`
  });

  for (const vp of viewports) {
    await sendCDP('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dsf,
      mobile: vp.mobile
    });
    await new Promise(r => setTimeout(r, 800));

    // Scroll to top
    await sendCDP('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await new Promise(r => setTimeout(r, 400));

    const shotTop = await sendCDP('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const topFilename = `qa_handpan_col_${vp.name}_top.png`;
    fs.writeFileSync(path.join(ARTIFACT_DIR, topFilename), Buffer.from(shotTop.data, 'base64'));

    // Check overflow & elements
    const metrics = await sendCDP('Runtime.evaluate', {
      expression: `(() => {
        const sw = document.documentElement.scrollWidth;
        const cw = document.documentElement.clientWidth;
        const cards = document.querySelectorAll('.zhp-card').length;
        const compareRows = document.querySelectorAll('.zhp-compare-table tbody tr').length;
        const benefits = document.querySelectorAll('.zhp-benefit-card').length;
        const accs = document.querySelectorAll('.zhp-acc-card').length;
        const faqs = document.querySelectorAll('.zhp-faq-item').length;
        const cardImages = Array.from(document.querySelectorAll('.zhp-card-media img')).map(img => ({
          src: img.src,
          naturalWidth: img.naturalWidth,
          loaded: img.complete && img.naturalWidth > 0
        }));
        return {
          scrollWidth: sw,
          clientWidth: cw,
          overflow: sw > cw,
          counts: { cards, compareRows, benefits, accs, faqs },
          cardImages
        };
      })()`,
      returnByValue: true
    });

    results.collection[vp.name] = metrics.result.value;
    console.log(`Collection @ ${vp.name}:`, metrics.result.value);
  }

  // Also capture scrolled views on Desktop 1440
  await sendCDP('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  for (const scrollY of [800, 1800, 2800, 3800]) {
    await sendCDP('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY})` });
    await new Promise(r => setTimeout(r, 500));
    const shot = await sendCDP('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(ARTIFACT_DIR, `qa_handpan_col_desktop_scroll_${scrollY}.png`), Buffer.from(shot.data, 'base64'));
  }

  // 2. TEST PRODUCT HANDPAN MASTER
  console.log('\n--- 2. Testing Product: /products/zavelyn-handpan-master ---');
  await sendCDP('Page.navigate', { url: `https://tryzavelyn.com/products/zavelyn-handpan-master?preview_theme_id=${DRAFT_THEME_ID}` });
  await new Promise(r => setTimeout(r, 4500));

  await sendCDP('Runtime.evaluate', {
    expression: `(() => {
      const b = document.querySelector('#shopify-pc__banner, .shopify-cookie-banner, [aria-label="Consent banner"]');
      if (b) b.remove();
    })()`
  });

  for (const vp of viewports) {
    await sendCDP('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dsf,
      mobile: vp.mobile
    });
    await new Promise(r => setTimeout(r, 800));

    await sendCDP('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await new Promise(r => setTimeout(r, 400));

    const shotTop = await sendCDP('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(ARTIFACT_DIR, `qa_handpan_master_${vp.name}_top.png`), Buffer.from(shotTop.data, 'base64'));

    const metrics = await sendCDP('Runtime.evaluate', {
      expression: `(() => {
        const sw = document.documentElement.scrollWidth;
        const cw = document.documentElement.clientWidth;
        const buyBox = !!document.querySelector('#zvPdpSection');
        const bannerImg = document.querySelector('.wf-banner-media img');
        const bannerImgWidth = bannerImg ? bannerImg.clientWidth : 0;
        const steps = document.querySelectorAll('.wf-step-card').length;
        const specs = document.querySelectorAll('.wf-spec-row').length;
        const doorstep = !!document.querySelector('#zv-doorstep-delivery, .zv-delivery-section');
        return {
          scrollWidth: sw,
          clientWidth: cw,
          overflow: sw > cw,
          buyBox,
          bannerImgWidth,
          steps,
          specs,
          doorstep
        };
      })()`,
      returnByValue: true
    });

    results.product_master[vp.name] = metrics.result.value;
    console.log(`Product Master @ ${vp.name}:`, metrics.result.value);
  }

  // Capture body scroll on Desktop 1440 (verifying the previously broken 1000px image and unstyled steps!)
  await sendCDP('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  for (const scrollY of [1300, 2200, 3100]) {
    await sendCDP('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY})` });
    await new Promise(r => setTimeout(r, 500));
    const shot = await sendCDP('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(ARTIFACT_DIR, `qa_handpan_master_desktop_scroll_${scrollY}.png`), Buffer.from(shot.data, 'base64'));
  }

  // Test Add to Cart & Cart Drawer
  console.log('\n--- Testing Add to Cart on zavelyn-handpan-master ---');
  await sendCDP('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
  await new Promise(r => setTimeout(r, 600));
  const atcResult = await sendCDP('Runtime.evaluate', {
    expression: `(() => {
      const atcBtn = document.querySelector('#zvClaimOfferBtn') || document.querySelector('.kc-claim-button') || document.querySelector('.zv-atc-btn') || document.querySelector('button[name="add"]');
      if (atcBtn) {
        atcBtn.click();
        return { clicked: true, id: atcBtn.id, className: atcBtn.className };
      }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 2500));
  const cartDrawerStatus = await sendCDP('Runtime.evaluate', {
    expression: `(() => {
      const drawer = document.querySelector('#willaCartDrawer, .willa-cart-drawer');
      const isOpen = drawer ? (drawer.classList.contains('active') || drawer.classList.contains('open') || getComputedStyle(drawer).display !== 'none') : false;
      return {
        hasDrawer: !!drawer,
        isOpen
      };
    })()`,
    returnByValue: true
  });
  console.log('ATC click result:', atcResult.result.value, 'Cart drawer status:', cartDrawerStatus.result.value);
  results.atc_test = { atcResult: atcResult.result.value, cartDrawerStatus: cartDrawerStatus.result.value };
  const cartShot = await sendCDP('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'qa_handpan_master_cart_drawer.png'), Buffer.from(cartShot.data, 'base64'));

  // Close drawer if open before continuing
  await sendCDP('Runtime.evaluate', {
    expression: `(() => {
      const closeBtn = document.querySelector('#willaCartClose, .willa-cart-drawer-close');
      if (closeBtn) closeBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  // 3. TEST REMAINING DRUM PRODUCTS
  const otherDrums = [
    { name: 'drum_pro', handle: 'zavelyn-drum-pro' },
    { name: 'drum_plus', handle: 'zavelyn-drum-plus' },
    { name: 'drum_mini', handle: 'zavelyn-drum-mini' },
    { name: 'rain_drum', handle: 'zavelyn-rain-drum' }
  ];

  for (const d of otherDrums) {
    console.log(`\n--- Testing ${d.name}: /products/${d.handle} ---`);
    await sendCDP('Page.navigate', { url: `https://tryzavelyn.com/products/${d.handle}?preview_theme_id=${DRAFT_THEME_ID}` });
    await new Promise(r => setTimeout(r, 4000));

    // Test mobile 390
    await sendCDP('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 800));

    const shotMobile = await sendCDP('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(ARTIFACT_DIR, `qa_${d.name}_mobile_390.png`), Buffer.from(shotMobile.data, 'base64'));

    const diagMobile = await sendCDP('Runtime.evaluate', {
      expression: `(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        buyBox: !!document.querySelector('#zvPdpSection'),
        doorstep: !!document.querySelector('#zv-doorstep-delivery, .zv-delivery-section')
      }))()`,
      returnByValue: true
    });

    results.all_drums[d.name] = diagMobile.result.value;
    console.log(`${d.name} @ mobile 390:`, diagMobile.result.value);
  }

  fs.writeFileSync('scripts/qa_handpans_overhaul_results.json', JSON.stringify(results, null, 2));

  ws.close();
  try { process.kill(chromeProc.pid); } catch (e) {}
  console.log('\n=== QA VERIFICATION COMPLETE ===');
}

run().catch(console.error);
