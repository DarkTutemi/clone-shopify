import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 9260;
const URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';

async function runQA() {
  console.log('=== STARTING 6-COMBINATION LIVE QA TEST ===');

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-qa-6combos-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,1200',
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
    await send('Network.enable');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 1000,
      deviceScaleFactor: 2,
      mobile: false
    });

    console.log('Navigating to live PDP...');
    await send('Page.navigate', { url: URL });
    await new Promise(r => setTimeout(r, 4000));

    // Clear cart first via page script
    await send('Runtime.evaluate', {
      expression: `fetch('/cart/clear.js', { method: 'POST' })`,
      awaitPromise: true
    });
    console.log('Cart cleared for fresh testing.');

    const combinations = [
      { bundle: 1, upgrade: false, expectedPrice: 39.99, size: '60ml', bottles: 1 },
      { bundle: 2, upgrade: false, expectedPrice: 79.98, size: '60ml', bottles: 2 },
      { bundle: 3, upgrade: false, expectedPrice: 95.99, size: '60ml', bottles: 3 },
      { bundle: 1, upgrade: true,  expectedPrice: 49.99, size: '120ml', bottles: 1 },
      { bundle: 2, upgrade: true,  expectedPrice: 99.98, size: '120ml', bottles: 2 },
      { bundle: 3, upgrade: true,  expectedPrice: 125.99, size: '120ml', bottles: 3 }
    ];

    const results = [];

    for (const combo of combinations) {
      console.log(`\n--- Testing Combo: Buy ${combo.bundle} × ${combo.size} ($${combo.expectedPrice}) ---`);

      // 1. Select the combo in UI
      const selectResult = await send('Runtime.evaluate', {
        expression: `
          (() => {
            // Click bundle card
            const card = document.querySelector(\`.zv-bundle-card[data-bundle="\${${combo.bundle}}"]\`);
            if (card) card.click();

            // Set upgrade checkbox state
            const check = document.getElementById('zvSizeUpgradeCheck');
            const cardUpsell = document.getElementById('zvUpsellCard');
            const targetUpgrade = ${combo.upgrade};
            
            if (cardUpsell && check && check.checked !== targetUpgrade) {
              cardUpsell.click();
            }

            // Read displayed total
            const totalDisplay = document.getElementById('zvSummaryTotal')?.textContent?.trim();
            const ctaPriceDisplay = document.getElementById('zvCtaPrice')?.textContent?.trim();
            const modalVisible = document.getElementById('zvPreviewModal') && document.getElementById('zvPreviewModal').style.display !== 'none';

            return { totalDisplay, ctaPriceDisplay, modalVisible };
          })()
        `,
        returnByValue: true
      });

      await new Promise(r => setTimeout(r, 300));
      console.log('UI state:', selectResult.result?.value);

      // 2. Clear cart and add to cart via Claim Offer CTA
      const addResult = await send('Runtime.evaluate', {
        expression: `
          (async () => {
            await fetch('/cart/clear.js', { method: 'POST' });
            
            // Click Claim Offer button
            const btn = document.getElementById('zvBotanaCtaBtn');
            btn.click();

            // Wait a moment for network call
            await new Promise(r => setTimeout(r, 1200));

            // Fetch cart state
            const cartRes = await fetch('/cart.js');
            const cart = await cartRes.json();

            const modalAfterClick = document.getElementById('zvPreviewModal') && document.getElementById('zvPreviewModal').style.display !== 'none';

            return {
              cartItemCount: cart.item_count,
              cartTotal: (cart.total_price / 100).toFixed(2),
              items: cart.items.map(item => ({
                id: item.id,
                title: item.title,
                price: (item.price / 100).toFixed(2),
                properties: item.properties
              })),
              modalAfterClick
            };
          })()
        `,
        awaitPromise: true,
        returnByValue: true
      });

      const resVal = addResult.result?.value;
      console.log('Cart add result:', JSON.stringify(resVal, null, 2));

      const item = resVal?.items?.[0];
      const passPrice = parseFloat(item?.price) === combo.expectedPrice;
      const passProps = item?.properties?.['Bottle Size'] === combo.size &&
                        item?.properties?.['Bottles to Ship'] === String(combo.bottles) &&
                        item?.properties?.['Manual Fulfillment'] === `SHIP ${combo.bundle} × ${combo.size.toUpperCase()} BOTTLES`;
      const passNoModal = !resVal?.modalAfterClick;

      results.push({
        combo: `Buy ${combo.bundle} × ${combo.size}`,
        expectedPrice: `$${combo.expectedPrice.toFixed(2)}`,
        actualPrice: `$${item?.price}`,
        variantId: item?.id,
        variantTitle: item?.title,
        fulfillmentProp: item?.properties?.['Manual Fulfillment'],
        passPrice,
        passProps,
        passNoModal,
        overallStatus: (passPrice && passProps && passNoModal) ? 'PASS' : 'FAIL'
      });
    }

    console.log('\n========================================');
    console.log('6-COMBINATION TEST MATRIX RESULTS:');
    console.table(results);
    console.log('========================================');

    fs.writeFileSync('backups/botanaroots_qa_matrix_results.json', JSON.stringify(results, null, 2));

    // Capture After Screenshots for Report
    // 1. Desktop 3x120ml Selected (The original problem state)
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('.zv-bundle-card[data-bundle="3"]');
          if (card) card.click();
          const check = document.getElementById('zvSizeUpgradeCheck');
          const cardUpsell = document.getElementById('zvUpsellCard');
          if (cardUpsell && check && !check.checked) cardUpsell.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const blockRect = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const block = document.getElementById('zvBotanaBundleComponent');
          const rect = block.getBoundingClientRect();
          return {
            x: Math.max(0, rect.left + window.scrollX - 20),
            y: Math.max(0, rect.top + window.scrollY - 20),
            width: rect.width + 40,
            height: rect.height + 40
          };
        })()
      `,
      returnByValue: true
    });

    const clip = blockRect.result.value;
    const desktopShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height, scale: 1 },
      captureBeyondViewport: true
    });
    fs.writeFileSync('backups/botanaroots_fixed_bundle_desktop.png', Buffer.from(desktopShot.data, 'base64'));
    console.log('✓ Saved backups/botanaroots_fixed_bundle_desktop.png');

    // 2. Mobile 3x120ml Selected
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 800));

    const mBlockRect = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const block = document.getElementById('zvBotanaBundleComponent');
          const rect = block.getBoundingClientRect();
          const pageY = rect.top + window.scrollY;
          return {
            x: 0,
            y: Math.max(0, pageY - 10),
            width: 375,
            height: rect.height + 20
          };
        })()
      `,
      returnByValue: true
    });

    const mClip = mBlockRect.result.value;
    const mobileShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: mClip.x, y: mClip.y, width: mClip.width, height: mClip.height, scale: 1 },
      captureBeyondViewport: true
    });
    fs.writeFileSync('backups/botanaroots_fixed_bundle_mobile.png', Buffer.from(mobileShot.data, 'base64'));
    console.log('✓ Saved backups/botanaroots_fixed_bundle_mobile.png');

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

runQA().catch(console.error);
