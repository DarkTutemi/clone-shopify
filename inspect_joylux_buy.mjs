import fs from 'fs';

async function inspectBuySection() {
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

  // Scroll to #jl-buy or evaluate its position
  const buyData = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const buyEl = document.querySelector('#jl-buy') || document.querySelector('[class*="buy"], [id*="buy"]');
      if (buyEl) {
        buyEl.scrollIntoView({ behavior: 'instant', block: 'start' });
        return {
          found: true,
          id: buyEl.id,
          className: buyEl.className,
          htmlSnippet: buyEl.innerHTML.substring(0, 2000),
          text: buyEl.innerText.replace(/\\n+/g, ' | ')
        };
      }
      return { found: false };
    })()`
  });
  console.log('Buy element evaluation:', JSON.stringify(buyData.result.value, null, 2));

  await new Promise(r => setTimeout(r, 1000));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('joylux_buy_section.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved joylux_buy_section.png');

  // Also extract all product cards or variant items on the page
  const cardsRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.product-card, .jl-product, [class*="product"], [class*="card"]')).filter(c => c.innerText.includes('$')).map(c => ({
        tag: c.tagName,
        className: c.className,
        text: c.innerText.replace(/\\n+/g, ' | ')
      }));
      return cards.slice(0, 10);
    })()`
  });
  console.log('Product cards found:', JSON.stringify(cardsRes.result.value, null, 2));

  ws.close();
}

inspectBuySection().catch(console.error);
