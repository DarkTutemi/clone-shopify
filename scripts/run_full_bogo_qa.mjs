import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 9298;
const PREVIEW_ENTRY = 'https://tryzavelyn.com/?preview_theme_id=187736654009';
const BOGO_PAGE_URL = 'https://tryzavelyn.com/pages/botanaroots-bogo-offer?preview_theme_id=187736654009';
const LIVE_PRODUCT_URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';

async function main() {
  console.log('========================================================================');
  console.log('ANTIGRAVITY — BOTANAROOTS BOGO COMPREHENSIVE QA HARNESS');
  console.log('========================================================================\n');

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-bogo-fullqa-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,3200',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch(`http://127.0.0.1:${PORT}/json`);
  const tabs = await res.json();
  const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

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

  // 1. Establish preview session
  console.log('Establishing unpublished theme preview session...');
  await send('Page.navigate', { url: PREVIEW_ENTRY });
  await new Promise(r => setTimeout(r, 3000));

  // 2. Navigate to BOGO Page
  console.log(`Navigating to BOGO Page: ${BOGO_PAGE_URL}...`);
  await send('Page.navigate', { url: BOGO_PAGE_URL });
  await new Promise(r => setTimeout(r, 4500));

  // Dismiss cookie/admin banners if any
  await send('Runtime.evaluate', {
    expression: `(() => {
      const banner = document.querySelector('#shopify-pc__banner, .shopify-policy-banner, [aria-label="Cookie consent"]');
      if (banner) banner.remove();
      const previewBar = document.querySelector('iframe#preview-bar-iframe');
      if (previewBar) previewBar.style.display = 'none';
    })()`
  });

  // 3. Desktop 1440px QA & 6 Combinations Test
  console.log('\n--- 1. TESTING ALL 6 BOGO COMBINATIONS ON DESKTOP 1440PX ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));

  const combinationsEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const results = [];
      const cards = {
        buy4: document.getElementById('zvCardBuy4'),
        buy2: document.getElementById('zvCardBuy2'),
        buy1: document.getElementById('zvCardBuy1')
      };
      const upsellCard = document.getElementById('zvUpsellCard');
      const upsellCheck = document.getElementById('zvSizeUpgradeCheck');

      const tests = [
        { id: 1, name: 'Buy 1 — 60ml', card: 'buy1', upgrade: false, expectedPrice: '$39.99', expectedUnit: '$39.99 / bottle', bottles: 1, size: '60ml', expectedVariant: '68035795157177', expectedSku: 'ZAV-BTR-BOGO-1X60-PURE' },
        { id: 2, name: 'Buy 1 — 120ml', card: 'buy1', upgrade: true, expectedPrice: '$49.99', expectedUnit: '$49.99 / bottle', bottles: 1, size: '120ml', expectedVariant: '68035795189945', expectedSku: 'ZAV-BTR-BOGO-1X120-PURE' },
        { id: 3, name: 'Buy 2 Get 2 — 60ml', card: 'buy2', upgrade: false, expectedPrice: '$79.98', expectedUnit: '$20.00 / bottle', bottles: 4, size: '60ml', expectedVariant: '68035795091641', expectedSku: 'ZAV-BTR-BOGO-4X60-PURE' },
        { id: 4, name: 'Buy 2 Get 2 — 120ml', card: 'buy2', upgrade: true, expectedPrice: '$119.98', expectedUnit: '$30.00 / bottle', bottles: 4, size: '120ml', expectedVariant: '68035795124409', expectedSku: 'ZAV-BTR-BOGO-4X120-PURE' },
        { id: 5, name: 'Buy 4 Get 4 — 60ml (Default)', card: 'buy4', upgrade: false, expectedPrice: '$159.96', expectedUnit: '$20.00 / bottle', bottles: 8, size: '60ml', expectedVariant: '68035793158329', expectedSku: 'ZAV-BTR-BOGO-8X60-PURE' },
        { id: 6, name: 'Buy 4 Get 4 — 120ml', card: 'buy4', upgrade: true, expectedPrice: '$239.96', expectedUnit: '$30.00 / bottle', bottles: 8, size: '120ml', expectedVariant: '68035795058873', expectedSku: 'ZAV-BTR-BOGO-8X120-PURE' }
      ];

      for (const t of tests) {
        cards[t.card].click();
        if (upsellCheck.checked !== t.upgrade) {
          upsellCard.click();
        }

        const summaryPackage = document.getElementById('zvSummaryPackage')?.textContent?.trim();
        const summaryTotal = document.getElementById('zvSummaryTotal')?.textContent?.trim();
        const summaryUnit = document.getElementById('zvSummaryUnitPill')?.textContent?.trim();
        const shippingText = document.getElementById('zvShippingText')?.textContent?.trim();
        const ctaPrice = document.getElementById('zvCtaPrice')?.textContent?.trim();
        const delta = document.getElementById('zvUpsellDelta')?.textContent?.trim();

        // Query active variant data
        const dataScript = JSON.parse(document.getElementById('zvBotanaBogoVariantData').textContent);
        const cardKey = (t.card === 'buy4') ? 'buy4get4' : (t.card === 'buy2') ? 'buy2get2' : 'buy1';
        const vInfo = dataScript.variants.pure[cardKey][t.size];

        results.push({
          combo: t.name,
          expectedPrice: t.expectedPrice,
          summaryTotal,
          ctaPrice,
          summaryPackage,
          summaryUnit,
          shippingText,
          delta,
          variantId: vInfo.id,
          sku: vInfo.sku,
          bottlesToShip: vInfo.bottles,
          paidBottles: vInfo.paid,
          freeBottles: vInfo.free,
          passPrice: (summaryTotal === t.expectedPrice && ctaPrice === t.expectedPrice),
          passVariant: (vInfo.id === t.expectedVariant)
        });
      }

      // Reset to default (Buy 4 Get 4, 60ml)
      cards.buy4.click();
      if (upsellCheck.checked) upsellCard.click();

      return results;
    })()`,
    returnByValue: true
  });

  const matrixResults = combinationsEval.result.value || [];
  console.log('\n--- SIX-COMBINATION AUDIT MATRIX ---');
  matrixResults.forEach(r => {
    console.log(`[${r.passPrice && r.passVariant ? 'PASS' : 'FAIL'}] ${r.combo}: Total = ${r.summaryTotal} | CTA = ${r.ctaPrice} | Unit = ${r.summaryUnit} | Variant = ${r.variantId} (${r.sku}) | Ship Bottles = ${r.bottlesToShip}`);
  });

  fs.writeFileSync('scripts/bogo_qa_matrix_results.json', JSON.stringify(matrixResults, null, 2), 'utf8');

  // 4. Capture Desktop 1440px Screenshot
  console.log('\nCapturing Desktop 1440px Full-Fold Screenshot...');
  const desktopShot = await send('Page.captureScreenshot', { format: 'png' });
  const desktopPath = `${ARTIFACT_DIR}/bogo_desktop_1440px_verified.png`;
  fs.writeFileSync(desktopPath, Buffer.from(desktopShot.data, 'base64'));
  console.log(`✓ Saved ${desktopPath}`);

  // 5. Mobile 390px Viewport QA (iPhone 12/13/14)
  console.log('\n--- 2. TESTING MOBILE 390PX VIEWPORT ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 1200));

  const mobileEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const overflow = scrollWidth > window.innerWidth;
      const ctaBtn = document.getElementById('zvBotanaCtaBtn');
      const buyNowBtn = document.getElementById('zvBotanaBuyNowBtn');
      const stickyBar = document.getElementById('zvStickyBar');

      return {
        viewportWidth: window.innerWidth,
        scrollWidth,
        clientWidth,
        horizontalOverflow: overflow,
        ctaBtnVisible: ctaBtn ? ctaBtn.offsetParent !== null : false,
        buyNowBtnVisible: buyNowBtn ? buyNowBtn.offsetParent !== null : false,
        stickyBarPresent: !!stickyBar
      };
    })()`,
    returnByValue: true
  });
  console.log('Mobile 390px Audit:', JSON.stringify(mobileEval.result.value, null, 2));

  // Capture Mobile 390px Screenshot
  console.log('Capturing Mobile 390px Hero & Buybox Screenshot...');
  const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
  const mobilePath = `${ARTIFACT_DIR}/bogo_mobile_390px_verified.png`;
  fs.writeFileSync(mobilePath, Buffer.from(mobileShot.data, 'base64'));
  console.log(`✓ Saved ${mobilePath}`);

  // 6. Capture Original Live Product for Comparison
  console.log(`\n--- 3. VERIFYING ORIGINAL LIVE PRODUCT: ${LIVE_PRODUCT_URL} ---`);
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Page.navigate', { url: LIVE_PRODUCT_URL });
  await new Promise(r => setTimeout(r, 3500));

  const liveShot = await send('Page.captureScreenshot', { format: 'png' });
  const livePath = `${ARTIFACT_DIR}/original_live_product_comparison.png`;
  fs.writeFileSync(livePath, Buffer.from(liveShot.data, 'base64'));
  console.log(`✓ Saved ${livePath}`);

  chromeProc.kill();
  console.log('\n✔ ALL QA RUNS & SCREENSHOTS COMPLETED.');
}

main().catch(console.error);
