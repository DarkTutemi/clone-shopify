import fs from 'fs';

async function reconAckerman() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!pageTab) throw new Error('No CDP tab found on port 9222');

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
  console.log('Navigating to Ackerman heated gloves via CDP...');

  const targetUrl = 'https://www.ackermanshop.com/products/smart-thermostatic-heated-fingerless-gloves';
  await send('Page.navigate', { url: targetUrl });
  await new Promise(r => setTimeout(r, 6000));

  const pageDetails = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const title = document.querySelector('h1')?.innerText?.trim() || document.title;
        const prices = Array.from(document.querySelectorAll('.price, [class*="price"]')).map(el => el.innerText.trim()).filter(Boolean);
        const options = Array.from(document.querySelectorAll('select, fieldset, [class*="variant"], [class*="option"]')).map(el => el.innerText.trim()).filter(Boolean);
        const images = Array.from(document.querySelectorAll('img')).map(img => img.src).filter(src => src && (src.includes('cdn') || src.includes('shop') || src.includes('product')));
        const desc = document.querySelector('.product__description, .product-description, [class*="description"], article, main')?.innerText?.substring(0, 1500) || '';
        return { title, prices: prices.slice(0, 5), options: options.slice(0, 5), images: Array.from(new Set(images)), descSnippet: desc };
      })()
    `,
    returnByValue: true
  });

  console.log('Ackerman details:', JSON.stringify(pageDetails.result.value, null, 2));
  fs.writeFileSync('ackerman_recon.json', JSON.stringify(pageDetails.result.value, null, 2));

  // Also grab outerHTML
  const htmlRes = await send('Runtime.evaluate', {
    expression: 'document.documentElement.outerHTML',
    returnByValue: true
  });
  if (htmlRes?.result?.value) {
    fs.writeFileSync('ackerman_page.html', htmlRes.result.value);
    console.log('Saved ackerman_page.html, size:', htmlRes.result.value.length);
  }

  ws.close();
}

reconAckerman().catch(console.error);
