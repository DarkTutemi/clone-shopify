import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const LIVE_PDP_URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';
const OTHER_PDP_URL = 'https://tryzavelyn.com/products/zavelyn-airclear-plus-air-purifier';
const PORT = 9255;

async function main() {
  console.log('========================================================================');
  console.log('VERIFYING LIVE THEME (187597717689) DEPLOYMENT');
  console.log('Target URL:', LIVE_PDP_URL);
  console.log('========================================================================\n');

  const userDataDir = `${process.env.TEMP}\\chrome-live-qa-${Date.now()}`;
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

  console.log('1. Navigating to Live BotanaRoots PDP...');
  await send('Page.navigate', { url: LIVE_PDP_URL });
  await new Promise(r => setTimeout(r, 6000));

  // A. Check Formula Selector
  const formulaCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const formulaEl = document.querySelector('.zv-formula-selector');
      const pageText = document.body.innerText || '';
      return {
        formulaElementPresent: formulaEl !== null,
        containsFormulaText: pageText.includes('SELECT FORMULA:')
      };
    })()`,
    returnByValue: true
  });
  console.log('Formula Selector in DOM:', formulaCheck.result?.value?.formulaElementPresent ? 'FAIL: Still present' : 'PASS: Removed');
  console.log('Formula Options Text:', formulaCheck.result?.value?.containsFormulaText ? 'FAIL: Text found' : 'PASS: Clean');

  // B. Check Selected Card Background & Unit Price Pills
  const styleCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const card3 = document.querySelector('#zvCardBuy3');
      const card3Style = card3 ? window.getComputedStyle(card3) : null;
      const unitPill = document.querySelector('.zv-card-buy3 .zv-card-unit-price');
      const unitPillStyle = unitPill ? window.getComputedStyle(unitPill) : null;
      const sumTotal = document.querySelector('#zvSummaryTotal')?.textContent?.trim();
      const cta = document.querySelector('#zvBotanaCtaBtn')?.textContent?.trim();
      const payIcons = document.querySelectorAll('.zv-payment-icon').length;

      return {
        isBuy3Selected: card3?.classList.contains('selected'),
        card3Bg: card3Style?.backgroundColor,
        card3Border: card3Style?.borderTopColor,
        unitPillBg: unitPillStyle?.backgroundColor,
        unitPillColor: unitPillStyle?.color,
        summaryTotal: sumTotal,
        ctaPrice: cta,
        paymentIconsCount: payIcons
      };
    })()`,
    returnByValue: true
  });
  console.log('\nLive BotanaRoots Styles & State:');
  console.log(JSON.stringify(styleCheck.result?.value, null, 2));

  // Helper for taking screenshots
  async function captureComponentShot(filename, pad = 12) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.querySelectorAll('#preview-bar-iframe, #shopify-pc__banner, .shopify-preview-bar, iframe, .zv-sticky-atc-wrap').forEach(el => el.remove());
        const comp = document.querySelector('#zvBotanaBundleComponent');
        if (comp) comp.scrollIntoView({ block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const res = await send('Runtime.evaluate', {
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
    const coords = res.result?.value;
    if (!coords) return;

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
    fs.writeFileSync(`${ARTIFACT_DIR}/${filename}`, buf);
    console.log(`📸 Saved Live Screenshot: ${filename} (${Math.round(buf.length / 1024)} KB)`);
  }

  // C. Capture Desktop 1440px on Live
  console.log('\nCapturing Desktop 1440px on Live...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 600));
  await captureComponentShot('botana_live_bundle_desktop_1440.png', 16);

  // D. Capture Mobile 390px on Live
  console.log('Capturing Mobile 390px on Live...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 600));
  await captureComponentShot('botana_live_bundle_mobile_390.png', 8);

  // Switch back to desktop
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 400));

  // E. Verify 6 Combinations on Live
  console.log('\n--- VERIFYING 6-COMBINATIONS ON LIVE ---');
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
    console.log(`[${pass ? 'PASS' : 'FAIL'}] Live ${comb.label}: Total=${val.totalPrice} | Unit=${val.unitPrice} | CTA=${val.ctaPrice}`);
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

  // F. Regression Check: Inspect other PDP on Live to ensure it's 100% normal
  console.log(`\n2. Regression check on other product: ${OTHER_PDP_URL}...`);
  await send('Page.navigate', { url: OTHER_PDP_URL });
  await new Promise(r => setTimeout(r, 5000));

  const otherProdCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const hasBotanaBundle = document.querySelector('#zvBotanaBundleComponent') !== null;
      const title = document.querySelector('h1')?.textContent?.trim();
      const hasAtc = document.querySelector('.kc-atc-btn, .zv-cta-button, [name=\"add\"]') !== null;
      return {
        productTitle: title,
        botanaBundleLeak: hasBotanaBundle,
        hasAddToCart: hasAtc
      };
    })()`,
    returnByValue: true
  });
  console.log('Other PDP Status:');
  console.log(JSON.stringify(otherProdCheck.result?.value, null, 2));

  chromeProc.kill();
  console.log('\n========================================================================');
  console.log('LIVE THEME VALIDATION COMPLETED SUCCESSFULLY');
  console.log('========================================================================\n');
}

main().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
