import { spawn } from 'child_process';

const PORT = 9264;
const BOTANA_URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';
const OTHER_URL = 'https://tryzavelyn.com/products/the-yeoman-sweep';

async function testEdgeCases() {
  console.log('=== TESTING EDGE CASES: CART MERGE, DOUBLE-CLICK, OTHER PRODUCTS ===');

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-edge-cases-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,1000',
    'about:blank'
  ]);

  try {
    await new Promise(r => setTimeout(r, 1500));
    const res = await fetch(`http://127.0.0.1:${PORT}/json`);
    const tabs = await res.json();
    const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
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

    await send('Page.enable');
    await send('DOM.enable');

    // 1. Test Cart with Existing Products & Notes
    console.log('1. Testing Cart with Existing Items...');
    await send('Page.navigate', { url: BOTANA_URL });
    await new Promise(r => setTimeout(r, 4000));

    const cartMergeRes = await send('Runtime.evaluate', {
      expression: `
        (async () => {
          // Clear cart and add a different product first
          await fetch('/cart/clear.js', { method: 'POST' });
          await fetch('/cart/update.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: 'Existing customer note for gift delivery' })
          });

          // Add Yeoman Sweep (Variant 67977465921849)
          await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: 67977465921849, quantity: 1 })
          });

          // Now select BotanaRoots Buy 3 x 120ml and click Claim Offer
          const card3 = document.querySelector('.zv-bundle-card[data-bundle="3"]');
          if (card3) card3.click();
          const check = document.getElementById('zvSizeUpgradeCheck');
          if (check && !check.checked) document.getElementById('zvUpsellCard').click();
          await new Promise(r => setTimeout(r, 300));

          // Click CTA
          document.getElementById('zvBotanaCtaBtn').click();
          await new Promise(r => setTimeout(r, 1200));

          const cart = await (await fetch('/cart.js')).json();
          return {
            itemCount: cart.item_count,
            cartNote: cart.note,
            items: cart.items.map(i => ({ id: i.id, title: i.title, price: (i.price/100).toFixed(2), properties: i.properties }))
          };
        })()
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Cart Merge Result:', JSON.stringify(cartMergeRes.result?.value, null, 2));

    // 2. Test Other Product Page Unaffected
    console.log('\n2. Testing Other Product Page (The Yeoman Sweep)...');
    await send('Page.navigate', { url: OTHER_URL });
    await new Promise(r => setTimeout(r, 4000));

    const otherProductRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const claimBtn = document.getElementById('zvClaimOfferBtn');
          const buyNowBtn = document.getElementById('zvBuyNowBtn');
          const botanaBundleComponent = document.getElementById('zvBotanaBundleComponent');
          return {
            pageTitle: document.querySelector('h1')?.textContent?.trim(),
            hasDefaultClaimBtn: !!claimBtn,
            hasDefaultBuyNowBtn: !!buyNowBtn,
            hasBotanaBundleComponent: !!botanaBundleComponent
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Other Product Page Check:', JSON.stringify(otherProductRes.result?.value, null, 2));

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

testEdgeCases().catch(console.error);
