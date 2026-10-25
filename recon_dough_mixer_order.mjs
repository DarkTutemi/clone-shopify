import fs from 'fs';

async function scrapeOrderPage() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);

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
  console.log('Connected to CDP. Navigating to the actual Order / Checkout page...');

  const orderUrl = 'https://m.sakerplus.com/funnel/order-sakerplus-automatic-dough-mixer-with-ferment-function-cp-1780569081585?pageId=2084223398811049986';
  await send('Page.navigate', { url: orderUrl });
  await new Promise(r => setTimeout(r, 7000));

  const orderInfo = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      // Find all bundle/tier cards or variant selectors
      const cards = Array.from(document.querySelectorAll('.bundle-item, .variant-item, [class*="card"], [class*="bundle"], [class*="tier"], [class*="sku"]')).map(c => ({
        tag: c.tagName,
        className: c.className,
        text: c.innerText.replace(/\\n+/g, ' | ')
      })).filter(c => c.text.includes('$') || c.text.toLowerCase().includes('off') || c.text.toLowerCase().includes('pack'));

      const prices = Array.from(document.querySelectorAll('.price, .current-price, [data-price], .money, [class*="price"]')).map(p => p.innerText.trim()).filter(Boolean);

      const allInputs = Array.from(document.querySelectorAll('input[type="radio"], input[type="checkbox"], select')).map(i => ({
        type: i.type,
        name: i.name,
        value: i.value,
        checked: i.checked,
        label: i.closest('label')?.innerText.replace(/\\n+/g, ' | ') || i.parentElement?.innerText.replace(/\\n+/g, ' | ')
      }));

      return {
        title: document.title,
        url: window.location.href,
        h1: document.querySelector('h1')?.innerText,
        cards: cards.slice(0, 15),
        prices: [...new Set(prices)].slice(0, 20),
        inputs: allInputs.slice(0, 20)
      };
    })()`
  });
  console.log('Order page inspection:', JSON.stringify(orderInfo.result.value, null, 2));

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('target_dough_mixer_order.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved target_dough_mixer_order.png');

  // Dump HTML
  const htmlRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: 'document.documentElement.outerHTML'
  });
  fs.writeFileSync('target_dough_mixer_order.html', htmlRes.result.value);
  console.log('Saved target_dough_mixer_order.html (length: ' + htmlRes.result.value.length + ')');

  ws.close();
}

scrapeOrderPage().catch(console.error);
