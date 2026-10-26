import fs from 'fs';
import path from 'path';

const OUT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3';
const DRAFT_THEME_ID = '187597717689';

const TEST_PRODUCTS = [
  // 5 Pilots
  {
    key: 'diesel',
    handle: 'sakerplus®-universal-diesel-injector-removal-kit-clearance-sale',
    name: 'Zavelyn Diesel Injector Removal Kit'
  },
  {
    key: 'thermoglove',
    handle: 'zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves',
    name: 'Zavelyn ThermoGlove'
  },
  {
    key: 'cheese_grater',
    handle: 'zavelyn-5-in-1-rotary-cheese-grater-shredder',
    name: 'Zavelyn 5-in-1 Rotary Cheese Grater'
  },
  {
    key: 'airclear',
    handle: 'zavelyn-airclear-plugin-negative-ion-air-purifier',
    name: 'Zavelyn AirClear Plugin Purifier'
  },
  {
    key: 'coop_door',
    handle: 'sakerplus®-battery-powered-automatic-chicken-coop-door',
    name: 'Zavelyn Automatic Chicken Coop Door'
  },
  // 3 Non-Pilots
  {
    key: 'fence_post',
    handle: 'sakerplus-fence-post-repair-kit',
    name: 'Zavelyn Fence Post Repair Kit'
  },
  {
    key: 'sensory_mats',
    handle: 'sakerplus®-tpu-sensory-textured-floor-mats',
    name: 'Zavelyn Sensory Floor Mats'
  },
  {
    key: 'foot_sleeve',
    handle: 'zavelyn-foot-sleeves-bogo-free',
    name: 'Zavelyn Foot Sleeve'
  }
];

async function getWsConnection() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.type === 'page' && t.url && !t.url.includes('sandbox') && !t.url.includes('preview-bar'));
  if (!tab) throw new Error('No suitable Chrome tab found on port 9222');
  console.log(`Connected to Chrome Tab: "${tab.title}" (${tab.url})`);

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const curId = id++;
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
  };

  await new Promise(r => ws.addEventListener('open', r));
  return { ws, send };
}

async function runQa() {
  console.log("=============================================================");
  console.log("🔍 COMPREHENSIVE VISUAL & FUNCTIONAL QA (DESKTOP / TABLET / MOBILE)");
  console.log(`Target Draft Theme ID: ${DRAFT_THEME_ID}`);
  console.log(`Output Directory: ${OUT_DIR}`);
  console.log("=============================================================");

  const { ws, send } = await getWsConnection();

  const qaReport = {
    timestamp: new Date().toISOString(),
    draft_theme_id: DRAFT_THEME_ID,
    products_tested: []
  };

  for (const prod of TEST_PRODUCTS) {
    console.log(`\n-------------------------------------------------------------`);
    console.log(`Testing Product: ${prod.name} (${prod.handle})`);
    console.log(`-------------------------------------------------------------`);

    const targetUrl = `https://tryzavelyn.com/products/${encodeURIComponent(prod.handle)}?preview_theme_id=${DRAFT_THEME_ID}`;
    await send('Page.navigate', { url: targetUrl });
    await new Promise(r => setTimeout(r, 5000));

    // Evaluate Page Metrics & Health
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const buyBox = document.querySelector('.zv-pdp-layout');
          const valueProp = document.getElementById('zv-value-prop');
          const features = document.getElementById('zv-features');
          const storytelling = document.getElementById('zv-storytelling');
          const steps = document.getElementById('zv-how-it-works');
          const specs = document.getElementById('zv-specs');
          const comparison = document.getElementById('zv-comparison');
          const included = document.getElementById('zv-included');
          const faq = document.getElementById('zv-extended-faq');
          const fallback = document.getElementById('zv-product-description');
          const claimBtn = document.getElementById('zvClaimOfferBtn');
          const buyNowBtn = document.getElementById('zvBuyNowBtn');
          const stickyBar = document.getElementById('zvStickyBar');
          const thumbs = document.querySelectorAll('.zv-thumb-btn');

          return {
            title: document.title,
            buy_box_rendered: Boolean(buyBox),
            claim_btn_present: Boolean(claimBtn),
            buy_now_btn_present: Boolean(buyNowBtn),
            sticky_bar_present: Boolean(stickyBar),
            thumbnail_count: thumbs.length,
            sections_rendered: {
              value_prop: Boolean(valueProp),
              features: Boolean(features),
              storytelling: Boolean(storytelling),
              steps: Boolean(steps),
              specs: Boolean(specs),
              comparison: Boolean(comparison),
              included: Boolean(included),
              faq: Boolean(faq),
              description_fallback: Boolean(fallback)
            },
            viewport_metrics: {
              scroll_width: document.documentElement.scrollWidth,
              client_width: document.documentElement.clientWidth,
              has_horizontal_overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
            }
          };
        })()
      `,
      returnByValue: true
    });

    const pageMetrics = evalRes.result?.value || {};
    console.log('Rendered Sections:', JSON.stringify(pageMetrics.sections_rendered, null, 2));

    // Hide preview iframe if blocking viewport
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('.shopify-preview-bar, .willa-cart-drawer').forEach(el => el.style.display = 'none');`
    });

    // 1. DESKTOP CAPTURE (1440x900)
    console.log(`Capturing Desktop 1440px for ${prod.key}...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    // Scroll down to Product Body to capture key storytelling / value prop / specs
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 1150);` });
    await new Promise(r => setTimeout(r, 1200));

    let shot = await send('Page.captureScreenshot', { format: 'png' });
    const desktopFile = path.join(OUT_DIR, `${prod.key}_desktop_1440.png`);
    fs.writeFileSync(desktopFile, Buffer.from(shot.data, 'base64'));
    console.log(`✔ Desktop screenshot saved: ${desktopFile}`);

    // Also capture full buy box on desktop
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
    await new Promise(r => setTimeout(r, 800));
    let shotHero = await send('Page.captureScreenshot', { format: 'png' });
    const heroFile = path.join(OUT_DIR, `${prod.key}_desktop_buybox.png`);
    fs.writeFileSync(heroFile, Buffer.from(shotHero.data, 'base64'));

    // 2. TABLET CAPTURE (768x1024)
    console.log(`Capturing Tablet 768px for ${prod.key}...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 1300);` });
    await new Promise(r => setTimeout(r, 1200));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    const tabletFile = path.join(OUT_DIR, `${prod.key}_tablet_768.png`);
    fs.writeFileSync(tabletFile, Buffer.from(shot.data, 'base64'));
    console.log(`✔ Tablet screenshot saved: ${tabletFile}`);

    // 3. MOBILE CAPTURE (390x844)
    console.log(`Capturing Mobile 390px for ${prod.key}...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 1500);` });
    await new Promise(r => setTimeout(r, 1200));

    // Check mobile horizontal scroll
    const mobileMetrics = await send('Runtime.evaluate', {
      expression: `({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth })`,
      returnByValue: true
    });
    const mobOverflow = mobileMetrics.result?.value?.overflow || false;
    console.log(`Mobile Horizontal Overflow Check: ${mobOverflow ? '❌ OVERFLOW DETECTED' : '✔ PASS (NO OVERFLOW)'}`);

    shot = await send('Page.captureScreenshot', { format: 'png' });
    const mobileFile = path.join(OUT_DIR, `${prod.key}_mobile_390.png`);
    fs.writeFileSync(mobileFile, Buffer.from(shot.data, 'base64'));
    console.log(`✔ Mobile screenshot saved: ${mobileFile}`);

    qaReport.products_tested.push({
      key: prod.key,
      name: prod.name,
      handle: prod.handle,
      metrics: pageMetrics,
      mobile_overflow: mobOverflow,
      screenshots: {
        desktop: `${prod.key}_desktop_1440.png`,
        tablet: `${prod.key}_tablet_768.png`,
        mobile: `${prod.key}_mobile_390.png`,
        buybox: `${prod.key}_desktop_buybox.png`
      }
    });
  }

  // Restore Desktop Viewport
  await send('Emulation.clearDeviceMetricsOverride');

  const reportOutPath = path.join(OUT_DIR, 'qa_inspection_results.json');
  fs.writeFileSync(reportOutPath, JSON.stringify(qaReport, null, 2), 'utf8');
  console.log(`\n=============================================================`);
  console.log(`✔ COMPREHENSIVE QA COMPLETE! Report saved to ${reportOutPath}`);
  console.log(`=============================================================`);

  ws.close();
}

runQa().catch(err => {
  console.error("QA execution failed:", err);
  process.exit(1);
});
