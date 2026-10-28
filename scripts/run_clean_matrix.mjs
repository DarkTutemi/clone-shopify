import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 9262;
const URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';

async function runCleanMatrix() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-clean-matrix-${Date.now()}`,
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

    const combos = [
      { bundle: 1, upgrade: false, expectedPrice: 39.99, size: '60ml', bottles: 1 },
      { bundle: 2, upgrade: false, expectedPrice: 79.98, size: '60ml', bottles: 2 },
      { bundle: 3, upgrade: false, expectedPrice: 95.99, size: '60ml', bottles: 3 },
      { bundle: 1, upgrade: true,  expectedPrice: 49.99, size: '120ml', bottles: 1 },
      { bundle: 2, upgrade: true,  expectedPrice: 99.98, size: '120ml', bottles: 2 },
      { bundle: 3, upgrade: true,  expectedPrice: 125.99, size: '120ml', bottles: 3 }
    ];

    const matrix = [];

    for (const c of combos) {
      const evalRes = await send('Runtime.evaluate', {
        expression: `
          (async () => {
            // 1. Clear cart
            await fetch('/cart/clear.js', { method: 'POST' });
            await new Promise(r => setTimeout(r, 400));

            // 2. Click Bundle Card
            const card = document.querySelector(\`.zv-bundle-card[data-bundle="\${${c.bundle}}"]\`);
            if (card) card.click();
            await new Promise(r => setTimeout(r, 200));

            // 3. Set Upgrade Checkbox
            const check = document.getElementById('zvSizeUpgradeCheck');
            const targetUpgrade = ${c.upgrade};
            if (check && check.checked !== targetUpgrade) {
              document.getElementById('zvUpsellCard').click();
              await new Promise(r => setTimeout(r, 200));
            }

            const displayedPrice = document.getElementById('zvSummaryTotal')?.textContent?.trim();

            // 4. Click Claim Offer
            document.getElementById('zvBotanaCtaBtn').click();
            await new Promise(r => setTimeout(r, 1200));

            // 5. Inspect Cart
            const cart = await (await fetch('/cart.js')).json();
            const item = cart.items[0];

            return {
              displayedPrice,
              cartItemCount: cart.item_count,
              actualPrice: item ? (item.price / 100).toFixed(2) : null,
              variantId: item?.id,
              variantTitle: item?.title,
              properties: item?.properties,
              modalPresent: !!document.getElementById('zvPreviewModal')
            };
          })()
        `,
        awaitPromise: true,
        returnByValue: true
      });

      const data = evalRes.result?.value;
      const passPrice = parseFloat(data?.actualPrice) === c.expectedPrice;
      const passProps = data?.properties?.['Bottle Size'] === c.size &&
                        data?.properties?.['Bottles to Ship'] === String(c.bottles) &&
                        data?.properties?.['Manual Fulfillment'] === `SHIP ${c.bundle} × ${c.size.toUpperCase()} BOTTLES`;
      const passNoModal = !data?.modalPresent;

      matrix.push({
        selection: `Buy ${c.bundle} × ${c.size}`,
        expectedPrice: `$${c.expectedPrice.toFixed(2)}`,
        displayedPrice: data?.displayedPrice,
        checkoutPrice: `$${data?.actualPrice}`,
        variantId: data?.variantId,
        fulfillmentProperty: data?.properties?.['Manual Fulfillment'],
        noAdminModal: passNoModal ? 'YES (No Modal)' : 'FAIL',
        status: (passPrice && passProps && passNoModal) ? 'PASS' : 'FAIL'
      });
    }

    console.log('\n=== FINAL 6-COMBINATION QA MATRIX ===');
    console.table(matrix);
    fs.writeFileSync('backups/botanaroots_clean_qa_matrix.json', JSON.stringify(matrix, null, 2));

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

runCleanMatrix().catch(console.error);
