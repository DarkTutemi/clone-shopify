import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 9296;
const BOGO_PAGE_URL = 'https://tryzavelyn.com/pages/botanaroots-bogo-offer?preview_theme_id=187736654009';
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';

async function runQA() {
  console.log('========================================================================');
  console.log('PHASE E: NON-PAYMENT QA & SCREENSHOT CAPTURE');
  console.log('========================================================================\n');

  console.log('Launching Headless Chrome on port ' + PORT + '...');
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-bogo-qa-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,2800',
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

  // 1. Navigate to BOGO Page Preview
  console.log(`Navigating to BOGO Page: ${BOGO_PAGE_URL}...`);
  await send('Page.navigate', { url: BOGO_PAGE_URL });
  await new Promise(r => setTimeout(r, 4500));

  // 2. Desktop 1440px QA
  console.log('Evaluating Desktop 1440px layout & default state...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));

  const desktopEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const page = document.getElementById('zvBogoLandingPage');
      const comp = document.getElementById('zvBotanaBogoComponent');
      const title = document.querySelector('.product-title')?.textContent?.trim();
      const defaultCard = document.querySelector('.zv-bundle-card.selected')?.getAttribute('data-bundle');
      const summaryPackage = document.getElementById('zvSummaryPackage')?.textContent?.trim();
      const summaryTotal = document.getElementById('zvSummaryTotal')?.textContent?.trim();
      const summaryShipping = document.getElementById('zvSummaryShipping')?.textContent?.trim();
      const ctaClaim = document.getElementById('zvCtaClaimOffer')?.textContent?.trim();
      const ctaBuyNow = document.getElementById('zvCtaBuyNow')?.textContent?.trim();
      const overflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        exists: !!page,
        compExists: !!comp,
        title,
        defaultCard,
        summaryPackage,
        summaryTotal,
        summaryShipping,
        ctaClaim,
        ctaBuyNow,
        horizontalOverflow: overflow
      };
    })()`,
    returnByValue: true
  });
  console.log('Desktop 1440px State:', JSON.stringify(desktopEval.result.value, null, 2));

  // Capture Desktop Screenshot
  console.log('Capturing Desktop Hero & Buybox Screenshot...');
  const desktopShot = await send('Page.captureScreenshot', { format: 'png' });
  const desktopPath = `${ARTIFACT_DIR}/bogo_page_desktop_preview.png`;
  fs.writeFileSync(desktopPath, Buffer.from(desktopShot.data, 'base64'));
  console.log(`✓ Saved ${desktopPath}`);

  // 3. Test All 6 Combinations via JavaScript simulation
  console.log('\n--- TESTING ALL 6 BOGO COMBINATIONS INTERACTION ---');
  const combinationsEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const results = [];
      const cards = {
        buy4: document.getElementById('zvCardBuy4'),
        buy2: document.getElementById('zvCardBuy2'),
        buy1: document.getElementById('zvCardBuy1')
      };
      const check = document.getElementById('zvSizeUpgradeCheck');

      const tests = [
        { name: 'Buy 4 Get 4 Free (60ml)', card: 'buy4', upgrade: false, expectedPrice: '$159.96', expectedBottles: 8 },
        { name: 'Buy 4 Get 4 Free (120ml)', card: 'buy4', upgrade: true, expectedPrice: '$239.96', expectedBottles: 8 },
        { name: 'Buy 2 Get 2 Free (60ml)', card: 'buy2', upgrade: false, expectedPrice: '$79.98', expectedBottles: 4 },
        { name: 'Buy 2 Get 2 Free (120ml)', card: 'buy2', upgrade: true, expectedPrice: '$119.98', expectedBottles: 4 },
        { name: 'Buy 1 (60ml)', card: 'buy1', upgrade: false, expectedPrice: '$39.99', expectedBottles: 1 },
        { name: 'Buy 1 (120ml)', card: 'buy1', upgrade: true, expectedPrice: '$49.99', expectedBottles: 1 }
      ];

      for (const t of tests) {
        cards[t.card].click();
        if (check.checked !== t.upgrade) {
          check.click();
        }

        const total = document.getElementById('zvSummaryTotal')?.textContent?.trim();
        const pkg = document.getElementById('zvSummaryPackage')?.textContent?.trim();
        const shipping = document.getElementById('zvSummaryShipping')?.textContent?.trim();
        const ctaPrice = document.getElementById('zvCtaPrice')?.textContent?.trim();

        results.push({
          test: t.name,
          displayedTotal: total,
          ctaPrice: ctaPrice,
          packageText: pkg,
          shippingText: shipping,
          matchesPrice: (total === t.expectedPrice),
          ctaMatches: (ctaPrice === t.expectedPrice)
        });
      }

      // Reset to default
      cards.buy4.click();
      if (check.checked) check.click();

      return results;
    })()`,
    returnByValue: true
  });
  console.log('All 6 Combinations Test Results:');
  for (const r of combinationsEval.result.value || []) {
    console.log(`- [${r.matchesPrice ? 'PASS' : 'FAIL'}] ${r.test} => Total: ${r.displayedTotal} | CTA: ${r.ctaPrice} | Shipping: "${r.shippingText}"`);
  }

  // 4. Mobile 390px Viewport QA
  console.log('\n--- TESTING MOBILE 390px (iPhone 12/13/14) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 1200));

  const mobileEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const ctaClaimVisible = document.getElementById('zvCtaClaimOffer')?.offsetParent !== null;
      const ctaBuyNowVisible = document.getElementById('zvCtaBuyNow')?.offsetParent !== null;

      return {
        viewportWidth: window.innerWidth,
        scrollWidth,
        clientWidth,
        horizontalOverflow: overflow,
        ctaClaimVisible,
        ctaBuyNowVisible
      };
    })()`,
    returnByValue: true
  });
  console.log('Mobile 390px Metrics:', JSON.stringify(mobileEval.result.value, null, 2));

  // Capture Mobile Screenshot
  console.log('Capturing Mobile Screenshot...');
  const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
  const mobilePath = `${ARTIFACT_DIR}/bogo_page_mobile_preview.png`;
  fs.writeFileSync(mobilePath, Buffer.from(mobileShot.data, 'base64'));
  console.log(`✓ Saved ${mobilePath}`);

  // 5. Test Cart Insertion with Payload Verification
  console.log('\n--- TESTING CLAIM OFFER & BUY NOW PAYLOAD EXECUTION ---');
  const cartTestEval = await send('Runtime.evaluate', {
    expression: `(async () => {
      try {
        // Clear cart first
        await fetch('/cart/clear.js', { method: 'POST' });

        // Click Claim Offer (Default Buy 4 Get 4 Free 60ml: Variant 68035793158329 @ $159.96)
        document.getElementById('zvCtaClaimOffer').click();
        await new Promise(r => setTimeout(r, 1500));

        // Query cart
        const cartRes = await fetch('/cart.js');
        const cart = await cartRes.json();
        const item = cart.items?.[0];

        // Clean cart again
        await fetch('/cart/clear.js', { method: 'POST' });

        return {
          success: true,
          itemCount: cart.item_count,
          totalPrice: (cart.total_price / 100).toFixed(2),
          variantId: item?.id,
          sku: item?.sku,
          title: item?.title,
          properties: item?.properties,
          orderNote: cart.note
        };
      } catch (err) {
        return { success: false, error: err.message };
      }
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('Cart Insertion QA Result:', JSON.stringify(cartTestEval.result.value, null, 2));

  chromeProc.kill();
  console.log('\n✔ PHASE E QA COMPLETED SUCCESSFULLY.');
}

runQA().catch(console.error);
