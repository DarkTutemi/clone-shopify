import { spawn } from 'child_process';

const PORT = 9261;
const URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';

async function testCombo1and2() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-test-c12-${Date.now()}`,
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
    await send('Page.navigate', { url: URL });
    await new Promise(r => setTimeout(r, 4000));

    // Test 1: Buy 1 x 60ml
    console.log('\n--- TESTING BUY 1 x 60ml ---');
    const res1 = await send('Runtime.evaluate', {
      expression: `
        (async () => {
          await fetch('/cart/clear.js', { method: 'POST' });
          await new Promise(r => setTimeout(r, 500));

          // Click Buy 1 card
          document.querySelector('.zv-bundle-card[data-bundle="1"]').click();
          await new Promise(r => setTimeout(r, 300));

          // Ensure upgrade is unchecked
          const check = document.getElementById('zvSizeUpgradeCheck');
          if (check && check.checked) {
            document.getElementById('zvUpsellCard').click();
            await new Promise(r => setTimeout(r, 300));
          }

          const priceText = document.getElementById('zvSummaryTotal')?.textContent?.trim();
          console.log('UI Price for Buy 1:', priceText);

          // Click Claim Offer
          document.getElementById('zvBotanaCtaBtn').click();
          await new Promise(r => setTimeout(r, 1500));

          const cart = await (await fetch('/cart.js')).json();
          return { priceText, cartItems: cart.items };
        })()
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Result 1 (Buy 1 x 60ml):', JSON.stringify(res1.result?.value, null, 2));

    // Test 2: Buy 2 x 60ml
    console.log('\n--- TESTING BUY 2 x 60ml ---');
    const res2 = await send('Runtime.evaluate', {
      expression: `
        (async () => {
          await fetch('/cart/clear.js', { method: 'POST' });
          await new Promise(r => setTimeout(r, 500));

          // Click Buy 2 card
          document.querySelector('.zv-bundle-card[data-bundle="2"]').click();
          await new Promise(r => setTimeout(r, 300));

          const priceText = document.getElementById('zvSummaryTotal')?.textContent?.trim();
          console.log('UI Price for Buy 2:', priceText);

          // Click Claim Offer
          document.getElementById('zvBotanaCtaBtn').click();
          await new Promise(r => setTimeout(r, 1500));

          const cart = await (await fetch('/cart.js')).json();
          return { priceText, cartItems: cart.items };
        })()
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Result 2 (Buy 2 x 60ml):', JSON.stringify(res2.result?.value, null, 2));

    // Test 3: Buy Now CTA (Direct Checkout)
    console.log('\n--- TESTING BUY NOW (Direct Checkout) ---');
    const res3 = await send('Runtime.evaluate', {
      expression: `
        (async () => {
          await fetch('/cart/clear.js', { method: 'POST' });
          await new Promise(r => setTimeout(r, 500));

          // Select Buy 3 x 120ml
          document.querySelector('.zv-bundle-card[data-bundle="3"]').click();
          const check = document.getElementById('zvSizeUpgradeCheck');
          if (check && !check.checked) {
            document.getElementById('zvUpsellCard').click();
          }
          await new Promise(r => setTimeout(r, 300));

          // Intercept window.location.href assignment or check href before redirect
          let interceptedUrl = null;
          // Click Buy Now
          const buyNowBtn = document.getElementById('zvBotanaBuyNowBtn');
          const originalAssign = window.location.assign;
          
          buyNowBtn.click();
          await new Promise(r => setTimeout(r, 1500));

          const cart = await (await fetch('/cart.js')).json();
          return {
            buyNowBtnExists: !!buyNowBtn,
            cartItems: cart.items
          };
        })()
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Result 3 (Buy Now CTA):', JSON.stringify(res3.result?.value, null, 2));

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

testCombo1and2().catch(console.error);
