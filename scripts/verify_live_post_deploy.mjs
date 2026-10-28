import { spawn } from 'child_process';
import fs from 'fs';

const PORT = 9292;
const LIVE_BOGO_URL = 'https://tryzavelyn.com/pages/botanaroots-bogo-offer';
const ORIGINAL_PDP_URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';

async function verifyLive() {
  console.log('========================================================================');
  console.log('VERIFYING PRODUCTION DEPLOYMENT ON LIVE THEME 187597717689');
  console.log('========================================================================\n');

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-live-verify-${Date.now()}`,
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

  await send('Network.enable');
  await send('Runtime.enable');
  await send('Page.enable');

  async function clearCart() {
    await send('Runtime.evaluate', {
      expression: `fetch('/cart/clear.js', { method: 'POST' })`,
      awaitPromise: true
    });
  }

  // 1. TEST LIVE BOGO LANDING PAGE
  console.log('1. Testing Live BOGO Offer page: ' + LIVE_BOGO_URL);
  await send('Page.navigate', { url: LIVE_BOGO_URL });
  await new Promise(r => setTimeout(r, 4500));
  await clearCart();

  const tStart = Date.now();
  console.log('   Clicking Claim Offer on live page...');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zvBotanaCtaBtn').click()`
  });

  let liveDrawerPassed = false;
  let liveDrawerTime = null;
  let liveCart = null;

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 150));
    const now = Date.now();
    const state = await send('Runtime.evaluate', {
      expression: `(() => {
        const drawer = document.getElementById('willaCartDrawer');
        const isActive = drawer?.classList.contains('active');
        const items = document.querySelectorAll('.willa-cart-item').length;
        const subtotal = document.getElementById('willaDrawerSubtotal')?.innerText;
        return { isActive, items, subtotal };
      })()`,
      returnByValue: true
    });

    if (state.result.value?.isActive && state.result.value?.items > 0) {
      liveDrawerTime = now - tStart;
      liveDrawerPassed = true;
      console.log(`   ✓ Drawer opened & rendered on LIVE page in ${liveDrawerTime}ms! Subtotal: ${state.result.value.subtotal}`);
      break;
    }
  }

  // Capture live drawer screenshot
  const ss = await send('Page.captureScreenshot', { format: 'png' });
  fs.mkdirSync('./backups/screenshots', { recursive: true });
  fs.writeFileSync('./backups/screenshots/live_bogo_cart_drawer.png', Buffer.from(ss.data, 'base64'));
  console.log('   ✓ Saved live drawer screenshot: backups/screenshots/live_bogo_cart_drawer.png');

  // Check live cart details
  const cartRes = await send('Runtime.evaluate', {
    expression: `fetch('/cart.js').then(r => r.json())`,
    awaitPromise: true,
    returnByValue: true
  });
  liveCart = cartRes.result.value;
  console.log('   Live Cart items count:', liveCart?.item_count);
  console.log('   Live Cart total price:', '$' + (liveCart?.total_price / 100));

  // 2. TEST ORIGINAL WINNING PRODUCT REGRESSION
  console.log('\n2. Testing Original Winning Product (Regression Check): ' + ORIGINAL_PDP_URL);
  await clearCart();
  await send('Page.navigate', { url: ORIGINAL_PDP_URL });
  await new Promise(r => setTimeout(r, 4500));

  // Check if original bundle is present
  const origCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const bundle = document.getElementById('zvBotanaBundleComponent') || document.querySelector('.zv-bundle-container');
      const atcBtn = document.getElementById('zvBotanaCtaBtn') || document.querySelector('.zv-cta-button');
      return {
        hasBundle: !!bundle,
        hasAtcBtn: !!atcBtn,
        atcText: atcBtn?.innerText?.trim()
      };
    })()`,
    returnByValue: true
  });
  console.log('   Original page bundle presence:', JSON.stringify(origCheck.result.value, null, 2));

  // Click ATC on original PDP
  console.log('   Clicking CTA on original product...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const atcBtn = document.getElementById('zvBotanaCtaBtn') || document.querySelector('.zv-cta-button');
      if (atcBtn) atcBtn.click();
    })()`
  });

  await new Promise(r => setTimeout(r, 2000));
  const origCart = await send('Runtime.evaluate', {
    expression: `fetch('/cart.js').then(r => r.json())`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('   Original product cart add status: count =', origCart.result.value?.item_count, 'title =', origCart.result.value?.items?.[0]?.title);
  const origPassed = (origCart.result.value?.item_count === 1);
  console.log('   Original Winning Product regression test:', origPassed ? '✓ PASSED (Unchanged & fully working)' : '✗ FAILED');

  // 3. TEST UNRELATED PRODUCT PAGES
  console.log('\n3. Testing Unrelated Store Pages...');
  await clearCart();
  // Check Collections / Best Sellers page
  await send('Page.navigate', { url: 'https://tryzavelyn.com/collections/all' });
  await new Promise(r => setTimeout(r, 3500));
  const collCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        title: document.title,
        hasDrawer: !!document.getElementById('willaCartDrawer'),
        productCards: document.querySelectorAll('.product-card, .grid-item, a[href*="/products/"]').length
      };
    })()`,
    returnByValue: true
  });
  console.log('   Catalog page check:', JSON.stringify(collCheck.result.value, null, 2));

  chromeProc.kill();
  console.log('\n========================================================================');
  console.log('LIVE POST-DEPLOYMENT VERIFICATION COMPLETE.');
  console.log('========================================================================');
}

verifyLive().catch(console.error);
