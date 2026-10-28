import { spawn } from 'child_process';
import fs from 'fs';

const PORT = 9293;
const DEV_PREVIEW_URL = 'https://tryzavelyn.com/pages/botanaroots-bogo-offer?preview_theme_id=187736654009';

const EXPECTED_COMBINATIONS = [
  { bundle: 'buy4get4', upgrade: false, variantId: '68035793158329', price: 159.96, bottles: 8, paid: 4, free: 4, size: '60ml' },
  { bundle: 'buy4get4', upgrade: true,  variantId: '68035795058873', price: 239.96, bottles: 8, paid: 4, free: 4, size: '120ml' },
  { bundle: 'buy2get2', upgrade: false, variantId: '68035795091641', price: 79.98,  bottles: 4, paid: 2, free: 2, size: '60ml' },
  { bundle: 'buy2get2', upgrade: true,  variantId: '68035795124409', price: 119.98, bottles: 4, paid: 2, free: 2, size: '120ml' },
  { bundle: 'buy1',     upgrade: false, variantId: '68035795157177', price: 39.99,  bottles: 1, paid: 1, free: 0, size: '60ml' },
  { bundle: 'buy1',     upgrade: true,  variantId: '68035795189945', price: 49.99,  bottles: 1, paid: 1, free: 0, size: '120ml' },
];

async function runTestSuite() {
  console.log('========================================================================');
  console.log('STARTING FULL AUTOMATED QA TEST SUITE ON DEV THEME');
  console.log('========================================================================\n');

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-full-qa-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,900',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch(`http://127.0.0.1:${PORT}/json`);
  const tabs = await res.json();
  const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let msgId = 1;
  const networkEvents = [];

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

  ws.addEventListener('message', (evt) => {
    const msg = JSON.parse(evt.data.toString());
    const now = Date.now();
    if (msg.method === 'Network.requestWillBeSent') {
      const req = msg.params.request;
      if (req.url.includes('/cart')) {
        networkEvents.push({ time: now, type: 'REQ', url: req.url, method: req.method, id: msg.params.requestId });
      }
    }
    if (msg.method === 'Network.responseReceived') {
      const resp = msg.params.response;
      if (resp.url.includes('/cart')) {
        networkEvents.push({ time: now, type: 'RESP', url: resp.url, status: resp.status, id: msg.params.requestId });
      }
    }
  });

  await send('Network.enable');
  await send('Runtime.enable');
  await send('Page.enable');

  const timingMeasurements = [];
  const testResults = [];

  // Helper to clear cart
  async function clearCart() {
    await send('Runtime.evaluate', {
      expression: `fetch('/cart/clear.js', { method: 'POST' })`,
      awaitPromise: true
    });
  }

  // --- PART 1: 6-COMBINATIONS TEST ---
  console.log('--- TEST 1: ALL 6 BUNDLE & SIZE COMBINATIONS ---');
  for (const combo of EXPECTED_COMBINATIONS) {
    console.log(`\nTesting combo: ${combo.bundle} | Size Upgrade: ${combo.upgrade} (${combo.size})...`);
    await send('Page.navigate', { url: DEV_PREVIEW_URL });
    await new Promise(r => setTimeout(r, 4000));
    await clearCart();

    // Select package and toggle upgrade if needed
    await send('Runtime.evaluate', {
      expression: `(() => {
        // Click bundle card
        const card = document.querySelector('.zv-bundle-card[data-bundle="${combo.bundle}"]');
        if (card) card.click();

        // Check or uncheck upgrade
        const check = document.getElementById('zvSizeUpgradeCheck');
        const cardUpsell = document.getElementById('zvUpsellCard');
        if (check && check.checked !== ${combo.upgrade}) {
          if (cardUpsell) cardUpsell.click();
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 300));

    // Clear network log
    networkEvents.length = 0;
    const tStart = Date.now();

    // Click Claim Offer
    await send('Runtime.evaluate', {
      expression: `document.getElementById('zvBotanaCtaBtn').click()`
    });

    // Wait for drawer to be active and items to appear
    let addDoneTime = null;
    let refreshDoneTime = null;
    let drawerVisibleTime = null;
    let cartData = null;

    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 100));
      const now = Date.now();

      // Check network logs for completion
      const addResp = networkEvents.find(e => e.type === 'RESP' && e.url.includes('/cart/add.js'));
      const getResp = networkEvents.find(e => e.type === 'RESP' && e.url.includes('/cart.js'));
      if (addResp && !addDoneTime) addDoneTime = addResp.time - tStart;
      if (getResp && !refreshDoneTime) refreshDoneTime = getResp.time - tStart;

      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const drawer = document.getElementById('willaCartDrawer');
          const isActive = drawer?.classList.contains('active');
          const itemsCount = document.querySelectorAll('.willa-cart-item').length;
          const subtotal = document.getElementById('willaDrawerSubtotal')?.innerText;
          return { isActive, itemsCount, subtotal };
        })()`,
        returnByValue: true
      });

      const dState = evalRes.result.value;
      if (dState && dState.isActive && dState.itemsCount > 0) {
        drawerVisibleTime = now - tStart;
        break;
      }
    }

    // Inspect actual cart state via /cart.js
    const cartRes = await send('Runtime.evaluate', {
      expression: `fetch('/cart.js').then(r => r.json())`,
      awaitPromise: true,
      returnByValue: true
    });
    cartData = cartRes.result.value;

    const item = cartData?.items?.[0];
    const totalInteractionTime = drawerVisibleTime || (Date.now() - tStart);

    timingMeasurements.push({
      combo: `${combo.bundle}-${combo.size}`,
      addTime: addDoneTime,
      refreshTime: refreshDoneTime,
      totalTime: totalInteractionTime
    });

    const passed = (
      cartData?.item_count === 1 &&
      String(item?.id) === combo.variantId &&
      Math.abs((cartData?.total_price / 100) - combo.price) < 0.01 &&
      item?.properties?.['Bottles to Ship'] === String(combo.bottles) &&
      item?.properties?.['Bottle Size'] === combo.size &&
      item?.properties?.['Paid Bottles'] === String(combo.paid) &&
      item?.properties?.['Free Bottles'] === String(combo.free)
    );

    testResults.push({
      combo: `${combo.bundle} ${combo.size}`,
      expectedVariant: combo.variantId,
      actualVariant: String(item?.id),
      expectedPrice: combo.price,
      actualPrice: cartData?.total_price / 100,
      itemCount: cartData?.item_count,
      properties: item?.properties,
      timing: totalInteractionTime,
      passed
    });

    console.log(`Result: ${passed ? '✓ PASSED' : '✗ FAILED'}`);
    console.log(`  Variant: ${item?.id} (Expected: ${combo.variantId})`);
    console.log(`  Subtotal: $${cartData?.total_price / 100} (Expected: $${combo.price})`);
    console.log(`  Properties:`, JSON.stringify(item?.properties));
    console.log(`  Timings: add.js: ${addDoneTime}ms | cart.js: ${refreshDoneTime}ms | Total perception: ${totalInteractionTime}ms`);
  }

  // --- PART 2: DOUBLE CLICK & DUPLICATE PREVENTION TEST ---
  console.log('\n--- TEST 2: DOUBLE-CLICK IN-FLIGHT GUARD TEST ---');
  await clearCart();
  await send('Page.navigate', { url: DEV_PREVIEW_URL });
  await new Promise(r => setTimeout(r, 4000));

  console.log('Simulating double click with 30ms interval...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.getElementById('zvBotanaCtaBtn');
      btn.click();
      setTimeout(() => btn.click(), 30);
      setTimeout(() => btn.click(), 60);
    })()`
  });

  await new Promise(r => setTimeout(r, 2000));
  const doubleClickCart = await send('Runtime.evaluate', {
    expression: `fetch('/cart.js').then(r => r.json())`,
    awaitPromise: true,
    returnByValue: true
  });
  const doubleClickCount = doubleClickCart.result.value?.item_count;
  console.log(`Double-click cart item count: ${doubleClickCount} (Expected: 1)`);
  const doubleClickPassed = (doubleClickCount === 1);
  console.log(`Double-click guard: ${doubleClickPassed ? '✓ PASSED (No duplicates)' : '✗ FAILED (Duplicates created)'}`);

  // --- PART 3: MOBILE 390px VIEWPORT TEST & SCREENSHOT ---
  console.log('\n--- TEST 3: MOBILE 390px VIEWPORT & SCREENSHOT ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });
  await clearCart();
  await send('Page.navigate', { url: DEV_PREVIEW_URL });
  await new Promise(r => setTimeout(r, 4000));

  // Click Claim Offer on mobile
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zvBotanaCtaBtn').click()`
  });
  await new Promise(r => setTimeout(r, 1800));

  // Capture Mobile Screenshot
  const ssRes = await send('Page.captureScreenshot', { format: 'png' });
  const ssBuffer = Buffer.from(ssRes.data, 'base64');
  fs.mkdirSync('./backups/screenshots', { recursive: true });
  fs.writeFileSync('./backups/screenshots/bogo_mobile_drawer_verified.png', ssBuffer);
  console.log('✓ Captured mobile screenshot: backups/screenshots/bogo_mobile_drawer_verified.png');

  // --- PART 4: EXISTING PRODUCTS IN CART PRESERVATION ---
  console.log('\n--- TEST 4: PRESERVE EXISTING CART ITEMS ---');
  await clearCart();
  // Add a non-BOGO product to cart (variant 67980643598521 from original winning product)
  const preAdd = await send('Runtime.evaluate', {
    expression: `fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: 67980643598521, quantity: 1 }] })
    }).then(r => r.json())`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('Pre-add non-BOGO item result:', preAdd.result.value?.title || JSON.stringify(preAdd.result.value));

  // Now claim BOGO offer
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zvBotanaCtaBtn').click()`
  });
  await new Promise(r => setTimeout(r, 2200));

  const multiItemCart = await send('Runtime.evaluate', {
    expression: `fetch('/cart.js').then(r => r.json())`,
    awaitPromise: true,
    returnByValue: true
  });
  const multiItems = multiItemCart.result.value?.items || [];
  console.log(`Cart total lines after adding BOGO to existing cart: ${multiItems.length} (Expected: 2)`);
  const preservePassed = (multiItems.length === 2);
  console.log(`Preserve existing items: ${preservePassed ? '✓ PASSED' : '✗ FAILED'}`);

  // --- PART 5: BUY NOW 1-CLICK CHECKOUT TEST ---
  console.log('\n--- TEST 5: BUY NOW 1-CLICK CHECKOUT FLOW ---');
  await clearCart();
  await send('Page.navigate', { url: DEV_PREVIEW_URL });
  await new Promise(r => setTimeout(r, 4000));

  // Select Buy 2 Get 2 Free 120ml
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelector('.zv-bundle-card[data-bundle="buy2get2"]')?.click();
      const check = document.getElementById('zvSizeUpgradeCheck');
      if (check && !check.checked) {
        document.getElementById('zvUpsellCard')?.click();
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 300));

  console.log('Clicking Buy Now...');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zvBotanaBuyNowBtn').click()`
  });

  // Track navigation to /checkout
  let checkoutReached = false;
  let finalUrl = '';
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 300));
    const urlEval = await send('Runtime.evaluate', {
      expression: `window.location.href`,
      returnByValue: true
    });
    finalUrl = urlEval.result.value || '';
    if (finalUrl.includes('checkout') || finalUrl.includes('checkouts')) {
      checkoutReached = true;
      break;
    }
  }
  console.log(`Buy Now navigated to: ${finalUrl}`);
  const buyNowPassed = checkoutReached;
  console.log(`Buy Now Flow: ${buyNowPassed ? '✓ PASSED' : '✗ FAILED'}`);

  // --- PART 6: TIMING ANALYSIS (MEDIAN & P95) ---
  console.log('\n========================================================================');
  console.log('TIMING SUMMARY & PERCENTILE CALCULATION');
  console.log('========================================================================');
  const totalTimes = timingMeasurements.map(t => t.totalTime).sort((a, b) => a - b);
  const addTimes = timingMeasurements.map(t => t.addTime).filter(Boolean).sort((a, b) => a - b);
  const refreshTimes = timingMeasurements.map(t => t.refreshTime).filter(Boolean).sort((a, b) => a - b);

  function getMedian(arr) {
    if (!arr.length) return 0;
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[mid] : Math.round((arr[mid - 1] + arr[mid]) / 2);
  }
  function getP95(arr) {
    if (!arr.length) return 0;
    const idx = Math.min(arr.length - 1, Math.ceil(0.95 * arr.length) - 1);
    return arr[idx];
  }

  const timingStats = {
    samples: totalTimes.length,
    addJs: { median: getMedian(addTimes), p95: getP95(addTimes) },
    cartJs: { median: getMedian(refreshTimes), p95: getP95(refreshTimes) },
    totalPerception: { median: getMedian(totalTimes), p95: getP95(totalTimes) }
  };

  console.log('Timing statistics:', JSON.stringify(timingStats, null, 2));

  fs.writeFileSync('./backups/qa_test_report.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    combinations: testResults,
    doubleClickPassed,
    preservePassed,
    timingStats
  }, null, 2));

  console.log('\n✓ Saved full QA report to backups/qa_test_report.json');

  chromeProc.kill();
}

runTestSuite().catch(console.error);
