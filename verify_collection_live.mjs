import fs from 'fs';

async function verifyCollection() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.url?.includes('/collections/best-sellers') || (t.type === 'page' && t.webSocketDebuggerUrl));
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
  console.log('Connected to CDP. Navigating and reloading https://tryzavelyn.com/collections/best-sellers ...');

  await send('Page.navigate', { url: 'https://tryzavelyn.com/collections/best-sellers' });
  await new Promise(r => setTimeout(r, 4500));

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  });

  const domData = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const title = document.querySelector('h1')?.innerText?.trim();
        const subtitle = document.querySelector('.zv-collection-desc')?.innerText?.trim();
        const cardsCount = document.querySelectorAll('.zv-prod-card').length;
        const firstCard = {
          title: document.querySelector('.zv-prod-card .zv-prod-title')?.innerText?.trim(),
          price: document.querySelector('.zv-prod-card .zv-price-current')?.innerText?.trim(),
          badge: document.querySelector('.zv-prod-card .zv-badge-sale')?.innerText?.trim(),
          rating: document.querySelector('.zv-prod-card .zv-rating-row')?.innerText?.trim(),
          btn: document.querySelector('.zv-prod-card .zv-atc-btn')?.innerText?.trim()
        };
        return { title, subtitle, cardsCount, firstCard };
      })()
    `,
    returnByValue: true
  });

  console.log('DOM Evaluation Result:', JSON.stringify(domData.result.value, null, 2));

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('collection_best_sellers_fixed.png', Buffer.from(shot.data, 'base64'));
  console.log('✔ Saved screenshot to collection_best_sellers_fixed.png');

  ws.close();
}

verifyCollection().catch(console.error);
