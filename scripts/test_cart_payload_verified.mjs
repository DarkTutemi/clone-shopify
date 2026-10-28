import { spawn } from 'child_process';

const PORT = 9297;
const BOGO_PAGE_URL = 'https://tryzavelyn.com/pages/botanaroots-bogo-offer?preview_theme_id=187736654009';

async function testCart() {
  console.log('Testing Cart Insertion with Line-Item Properties & Order Note...');

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-cart-test-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,1000',
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

  // Navigate
  await send('Page.navigate', { url: BOGO_PAGE_URL });
  await new Promise(r => setTimeout(r, 4000));

  // Run in-page fetch test for cart/add.js with exact properties
  const cartResult = await send('Runtime.evaluate', {
    expression: `(async () => {
      // 1. Clear cart
      await fetch('/cart/clear.js', { method: 'POST' });

      // 2. Add Buy 4 Get 4 Free (60ml) - Variant 68035793158329 @ $159.96
      const payload = {
        id: 68035793158329,
        quantity: 1,
        properties: {
          'Offer': 'Buy 4 Get 4 FREE',
          'Formula': '100% Pure Raw Honduran Batana',
          'Bottle Size': '60ml',
          'Bottles to Ship': '8',
          'Paid Bottles': '4',
          'Free Bottles': '4',
          'Offer Source': 'BotanaRoots BOGO Test'
        }
      };

      const addRes = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ items: [payload] })
      });
      const addData = await addRes.json();

      // 3. Update order note
      const noteText = 'MANUAL FULFILLMENT — BOTANAROOTS BOGO. Deliver 8 bottles of 60ml Pure Raw Batana Oil. Paid 4, Free 4. Verify quantity and size before marking fulfilled.';
      await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ note: noteText })
      });

      // 4. Query cart
      const cartRes = await fetch('/cart.js');
      const cart = await cartRes.json();
      const item = cart.items?.[0];

      // Clean cart
      await fetch('/cart/clear.js', { method: 'POST' });

      return {
        addOk: addRes.ok,
        itemCount: cart.item_count,
        totalPrice: '$' + (cart.total_price / 100).toFixed(2),
        variantId: item?.id,
        sku: item?.sku,
        productTitle: item?.product_title,
        variantTitle: item?.variant_title,
        linePrice: '$' + (item?.final_price / 100).toFixed(2),
        properties: item?.properties,
        orderNote: cart.note
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('Cart Verification Result:', JSON.stringify(cartResult.result.value, null, 2));

  chromeProc.kill();
}

testCart().catch(console.error);
