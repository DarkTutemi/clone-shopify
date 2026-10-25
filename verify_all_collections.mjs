import fs from 'fs';

async function verifyAllCollections() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!pageTab) throw new Error('No CDP tab found');

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let idCounter = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      const handler = evt => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(r => ws.addEventListener('open', r));

  const collectionsToTest = [
    'best-sellers',
    'all-products',
    'deals-of-the-day',
    'home-and-workshop',
    'power-tools',
    'garden-and-outdoor',
    'sale'
  ];

  console.log('Auditing live collections across store...');
  const results = [];

  for (const c of collectionsToTest) {
    const url = `https://tryzavelyn.com/collections/${c}`;
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 2000));

    const check = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const h1 = document.querySelector('h1')?.innerText?.trim();
          const cardCount = document.querySelectorAll('.zv-prod-card').length;
          const hasCards = cardCount > 0;
          const firstCardTitle = document.querySelector('.zv-prod-card .zv-prod-title')?.innerText?.trim();
          const hasAtcBtn = Boolean(document.querySelector('.zv-atc-btn'));
          return { h1, cardCount, hasCards, firstCardTitle, hasAtcBtn };
        })()
      `,
      returnByValue: true
    });
    results.push({ collection: c, ...check.result.value });
    console.log(`✔ [${c}] -> H1: "${check.result.value.h1}", Cards: ${check.result.value.cardCount}, Has ATC: ${check.result.value.hasAtcBtn}`);
  }

  console.log('\nAll Collections Audit Results:');
  console.table(results);

  // Return to best-sellers
  await send('Page.navigate', { url: 'https://tryzavelyn.com/collections/best-sellers' });

  ws.close();
}

verifyAllCollections().catch(console.error);
