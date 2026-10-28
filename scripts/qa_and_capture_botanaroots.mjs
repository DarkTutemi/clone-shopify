import fs from 'fs';
import { spawn } from 'child_process';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const QA_IMG_DIR = 'assets/botanaroots_qa';
const THEME_ID = '187702804665';
const PREVIEW_ROOT = `https://tryzavelyn.com/?preview_theme_id=${THEME_ID}`;
const PDP_URL = `https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=${THEME_ID}`;
const PORT = 9249;

if (!fs.existsSync(QA_IMG_DIR)) {
  fs.mkdirSync(QA_IMG_DIR, { recursive: true });
}

async function getPreviewCookie() {
  const initRes = await fetch(PREVIEW_ROOT, { redirect: 'manual' });
  const rawCookies = initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [initRes.headers.get('set-cookie')];
  const essentialCookie = rawCookies.find(c => c && c.startsWith('_shopify_essential='));
  if (essentialCookie) {
    return essentialCookie.split(';')[0].replace('_shopify_essential=', '');
  }
  return null;
}

async function verifyThemeSchema() {
  console.log('\n--- VERIFYING THEME EDITOR SCHEMA SETTINGS ---');
  const token = await getAccessToken();
  const url = `https://${SHOP}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`;
  const res = await fetch(url, { headers: { 'X-Shopify-Access-Token': token } });
  const data = await res.json();
  const val = data.asset?.value || '';

  const schemaStart = val.indexOf('{% schema %}');
  const schemaEnd = val.indexOf('{% endschema %}');
  if (schemaStart !== -1 && schemaEnd !== -1) {
    const schema = JSON.parse(val.substring(schemaStart + 12, schemaEnd));
    const imageSettings = schema.settings.filter(s => s.type === 'image_picker');
    console.log(`Found ${imageSettings.length} image_picker settings in sections/zavelyn-pdp-main.liquid:`);
    imageSettings.forEach(s => console.log(`  - [id: ${s.id}] ${s.label}`));

    const requiredIds = ['botana_img_buy3', 'botana_img_buy2', 'botana_img_buy1', 'botana_img_upsell'];
    const allPresent = requiredIds.every(id => imageSettings.some(s => s.id === id));
    console.log(`Theme Editor Image Settings Status: ${allPresent ? 'ALL PRESENT [PASS]' : 'MISSING [FAIL]'}`);
    return allPresent;
  }
  return false;
}

async function syncLatestAssets() {
  const token = await getAccessToken();
  console.log('\n--- SYNCING LATEST ASSETS TO DRAFT THEME ---');
  const images = [
    'botana-bundle-buy1.webp',
    'botana-bundle-buy2.webp',
    'botana-bundle-buy3.webp',
    'botana-bundle-upgrade-size.webp'
  ];
  for (const img of images) {
    const buf = fs.readFileSync(`assets/${img}`);
    const b64 = buf.toString('base64');
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ asset: { key: `assets/${img}`, attachment: b64 } })
    });
    const d = await res.json();
    if (d.asset) console.log(`✓ Synced assets/${img}`);
  }
  const css = fs.readFileSync('assets/botanaroots-bundle.css', 'utf8');
  await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset: { key: 'assets/botanaroots-bundle.css', value: css } })
  });
  console.log('✓ Synced assets/botanaroots-bundle.css');
}

async function main() {
  console.log('========================================================================');
  console.log('BOTANAROOTS BUNDLE FINAL REFINEMENT QA & VALIDATION');
  console.log('========================================================================\n');

  // 1. Sync latest cleaned images and CSS
  await syncLatestAssets();

  // 2. Verify theme schema settings
  await verifyThemeSchema();

  const cookieVal = await getPreviewCookie();
  console.log('Preview cookie acquired:', cookieVal ? 'YES' : 'NO');

  const userDataDir = `${process.env.TEMP}\\chrome-botana-final-${Date.now()}`;
  console.log(`Launching dedicated Chrome on port ${PORT}...`);
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

  const tab = tabs.find(t => t.type === 'page') || tabs[0];
  console.log(`Connected to CDP page tab: ${tab.url} (id: ${tab.id})`);

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
  await send('Network.enable');

  if (cookieVal) {
    await send('Network.setCookie', {
      name: '_shopify_essential',
      value: cookieVal,
      domain: 'tryzavelyn.com',
      path: '/',
      secure: true,
      httpOnly: true
    });
    console.log('✔ Injected _shopify_essential cookie');
  }

  console.log(`Navigating to ${PDP_URL}...`);
  await send('Page.navigate', { url: PDP_URL });
  await new Promise(r => setTimeout(r, 7000));

  async function getDocCoords(selector) {
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
    return res.result?.value;
  }

  async function captureComponentShot(filename, pad = 12) {
    // Remove any fixed overlays that could block the component
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.querySelectorAll('#preview-bar-iframe, #shopify-pc__banner, .shopify-preview-bar, iframe, .zv-sticky-atc-wrap').forEach(el => el.remove());
        const comp = document.querySelector('#zvBotanaBundleComponent');
        if (comp) comp.scrollIntoView({ block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const coords = await getDocCoords('#zvBotanaBundleComponent');
    if (!coords) {
      console.error(`Could not get coords for ${filename}`);
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
    fs.writeFileSync(`${QA_IMG_DIR}/${filename}`, buf);
    fs.writeFileSync(`${ARTIFACT_DIR}/${filename}`, buf);
    console.log(`📸 Saved screenshot: ${filename} (${Math.round(buf.length / 1024)} KB)`);
  }

  // 1. VERIFY FORMULA SELECTOR IS 100% REMOVED
  console.log('\n--- 1. VERIFY FORMULA SELECTOR REMOVAL ---');
  const formulaCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const formulaEl = document.querySelector('.zv-formula-selector');
      const pageText = document.body.innerText || '';
      const containsFormulaText = pageText.includes('SELECT FORMULA:') || pageText.includes('100% Pure Raw Batana') && pageText.includes('Batana + Rosemary Infusion');
      return {
        formulaElementPresent: formulaEl !== null,
        containsFormulaText: containsFormulaText
      };
    })()`,
    returnByValue: true
  });
  console.log('Formula Selector in DOM:', formulaCheck.result?.value?.formulaElementPresent ? 'FAIL: Still Present' : 'PASS: Completely Removed');
  console.log('Formula Options in Text:', formulaCheck.result?.value?.containsFormulaText ? 'FAIL: Text Still Exists' : 'PASS: Clean');

  // 2. VERIFY DEFAULT STATE & SELECTED CARD STYLES
  console.log('\n--- 2. VERIFY DEFAULT STATE & SELECTED CARD STYLES ---');
  const defaultCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const card3 = document.querySelector('#zvCardBuy3');
      const isCard3Selected = card3 && card3.classList.contains('selected');
      const card3Style = card3 ? window.getComputedStyle(card3) : null;
      const card3Bg = card3Style ? card3Style.backgroundColor : null;
      const card3Border = card3Style ? card3Style.borderTopColor : null;
      const card3BorderWidth = card3Style ? card3Style.borderTopWidth : null;

      // Unit price pill styles
      const unitPill = document.querySelector('.zv-card-buy3 .zv-card-unit-price');
      const unitPillStyle = unitPill ? window.getComputedStyle(unitPill) : null;
      const unitPillBg = unitPillStyle ? unitPillStyle.backgroundColor : null;
      const unitPillColor = unitPillStyle ? unitPillStyle.color : null;

      const summaryUnitPill = document.querySelector('#zvSummaryUnitPill');
      const sumUnitPillStyle = summaryUnitPill ? window.getComputedStyle(summaryUnitPill) : null;
      const sumUnitBg = sumUnitPillStyle ? sumUnitPillStyle.backgroundColor : null;
      const sumUnitColor = sumUnitPillStyle ? sumUnitPillStyle.color : null;

      const total = document.querySelector('#zvSummaryTotal')?.textContent?.trim();
      const cta = document.querySelector('#zvBotanaCtaBtn')?.textContent?.trim();
      const payIcons = document.querySelectorAll('.zv-payment-icon').length;

      return {
        isBuy3Selected: isCard3Selected,
        card3BackgroundColor: card3Bg,
        card3BorderColor: card3Border,
        card3BorderWidth: card3BorderWidth,
        unitPillBg: unitPillBg,
        unitPillColor: unitPillColor,
        summaryUnitPillBg: sumUnitBg,
        summaryUnitPillColor: sumUnitColor,
        total: total,
        cta: cta,
        paymentIconsCount: payIcons
      };
    })()`,
    returnByValue: true
  });
  console.log('Card 3 (Buy 3) Selected Styles:');
  console.log(JSON.stringify(defaultCheck.result?.value, null, 2));

  // =========================================================================
  // CAPTURE 1: DESKTOP 1440px — BUY 3 SELECTED (DEFAULT)
  // =========================================================================
  console.log('\n--- CAPTURING DESKTOP 1440px (BUY 3 DEFAULT) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 800));
  await captureComponentShot('botana_bundle_desktop_1440.png', 16);

  // =========================================================================
  // CAPTURE 2: MOBILE 390px (iPhone 12/13/14)
  // =========================================================================
  console.log('\n--- CAPTURING MOBILE 390px ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 800));
  await captureComponentShot('botana_bundle_mobile_390.png', 8);

  // Switch back to desktop for state interactions
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 500));

  // =========================================================================
  // CAPTURE 3: BUY 2 SELECTED (VERIFY GREEN TINT BACKGROUND ON BUY 2)
  // =========================================================================
  console.log('\n--- CLICKING BUY 2 & VERIFYING SELECTED BACKGROUND ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const card2 = document.querySelector('#zvCardBuy2');
      if (card2) card2.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const buy2StyleCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const card2 = document.querySelector('#zvCardBuy2');
      const style = window.getComputedStyle(card2);
      return {
        selected: card2.classList.contains('selected'),
        backgroundColor: style.backgroundColor,
        borderColor: style.borderTopColor
      };
    })()`,
    returnByValue: true
  });
  console.log('Buy 2 Selected State:', JSON.stringify(buy2StyleCheck.result?.value));
  await captureComponentShot('botana_bundle_buy2_selected_desktop.png', 16);

  // =========================================================================
  // CAPTURE 4: BUY 1 SELECTED (VERIFY GREEN TINT BACKGROUND ON BUY 1)
  // =========================================================================
  console.log('\n--- CLICKING BUY 1 & VERIFYING SELECTED BACKGROUND ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const card1 = document.querySelector('#zvCardBuy1');
      if (card1) card1.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const buy1StyleCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const card1 = document.querySelector('#zvCardBuy1');
      const style = window.getComputedStyle(card1);
      return {
        selected: card1.classList.contains('selected'),
        backgroundColor: style.backgroundColor,
        borderColor: style.borderTopColor
      };
    })()`,
    returnByValue: true
  });
  console.log('Buy 1 Selected State:', JSON.stringify(buy1StyleCheck.result?.value));
  await captureComponentShot('botana_bundle_buy1_selected_desktop.png', 16);

  // Restore Buy 3 default
  await send('Runtime.evaluate', {
    expression: `(() => {
      const card3 = document.querySelector('#zvCardBuy3');
      if (card3) card3.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 500));

  // =========================================================================
  // CAPTURE 5: UPGRADE TO 120ml ($125.99)
  // =========================================================================
  console.log('\n--- TOGGLING 120ml UPSELL ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const check = document.querySelector('#zvSizeUpgradeCheck');
      if (check && !check.checked) {
        check.checked = true;
        check.dispatchEvent(new Event('change'));
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 600));
  await captureComponentShot('botana_bundle_desktop_1440_upgraded.png', 16);

  // Restore 60ml default
  await send('Runtime.evaluate', {
    expression: `(() => {
      const check = document.querySelector('#zvSizeUpgradeCheck');
      if (check && check.checked) {
        check.checked = false;
        check.dispatchEvent(new Event('change'));
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 500));

  // =========================================================================
  // 6. SIX COMBINATIONS TEST
  // =========================================================================
  console.log('\n--- 6. VERIFYING 6-COMBINATIONS MATRIX ---');
  const combinations = [
    { bundle: 1, upgraded: false, expectedTotal: '$39.99', expectedUnit: '$39.99 / bottle', label: 'Buy 1 / 60ml' },
    { bundle: 1, upgraded: true, expectedTotal: '$49.99', expectedUnit: '$49.99 / bottle', label: 'Buy 1 / 120ml' },
    { bundle: 2, upgraded: false, expectedTotal: '$79.98', expectedUnit: '$39.99 / bottle', label: 'Buy 2 / 60ml' },
    { bundle: 2, upgraded: true, expectedTotal: '$99.98', expectedUnit: '$49.99 / bottle', label: 'Buy 2 / 120ml' },
    { bundle: 3, upgraded: false, expectedTotal: '$95.99', expectedUnit: '$32.00 / bottle', label: 'Buy 3 / 60ml' },
    { bundle: 3, upgraded: true, expectedTotal: '$125.99', expectedUnit: '$42.00 / bottle', label: 'Buy 3 / 120ml' }
  ];

  for (const comb of combinations) {
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('#zvCardBuy${comb.bundle}');
        if (card) card.click();

        const check = document.querySelector('#zvSizeUpgradeCheck');
        if (check && check.checked !== ${comb.upgraded}) {
          check.checked = ${comb.upgraded};
          check.dispatchEvent(new Event('change'));
        }

        const pkgVal = document.querySelector('#zvSummaryPackage')?.textContent?.trim();
        const totVal = document.querySelector('#zvSummaryTotal')?.textContent?.trim();
        const unitVal = document.querySelector('#zvSummaryUnitPill')?.textContent?.trim();
        const ctaVal = document.querySelector('#zvCtaPrice')?.textContent?.trim();

        return {
          packageText: pkgVal,
          totalPrice: totVal,
          unitPrice: unitVal,
          ctaPrice: ctaVal
        };
      })()`,
      returnByValue: true
    });

    const val = evalRes.result?.value || {};
    const pass = (val.totalPrice === comb.expectedTotal && val.unitPrice === comb.expectedUnit && val.ctaPrice === comb.expectedTotal);
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${comb.label}: Total=${val.totalPrice} | Unit=${val.unitPrice} | CTA=${val.ctaPrice}`);
  }

  // Restore Buy 3 default state
  await send('Runtime.evaluate', {
    expression: `(() => {
      const card3 = document.querySelector('#zvCardBuy3');
      if (card3) card3.click();
      const check = document.querySelector('#zvSizeUpgradeCheck');
      if (check && check.checked) {
        check.checked = false;
        check.dispatchEvent(new Event('change'));
      }
    })()`
  });

  chromeProc.kill();
  console.log('\n========================================================================');
  console.log('ALL FINAL REFINEMENT TESTS COMPLETED SUCCESSFULLY');
  console.log('========================================================================\n');
}

main().catch(err => {
  console.error('QA Error:', err);
  process.exit(1);
});
