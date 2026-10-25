import fs from 'fs';

async function reconSuperTots() {
  console.log('Fetching SuperTots product JSON...');
  const jsonUrl = 'https://www.super-tots.com/products/supertots-food-pacifier.json';
  
  try {
    const res = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (res.ok) {
      const data = await res.json();
      fs.writeFileSync('supertots_product.json', JSON.stringify(data, null, 2));
      console.log('✔ Fetched product JSON successfully:');
      console.log('Title:', data.product.title);
      console.log('Images count:', data.product.images?.length);
      console.log('Variants count:', data.product.variants?.length);
      console.log('Options:', data.product.options);
      return;
    } else {
      console.warn('JSON endpoint returned status:', res.status);
    }
  } catch (e) {
    console.warn('Could not fetch JSON directly:', e.message);
  }

  // Fallback to fetching HTML via CDP
  console.log('Attempting CDP recon for supertots...');
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!pageTab) throw new Error('No CDP tab available');

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

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

  await send('Page.navigate', { url: 'https://www.super-tots.com/products/supertots-food-pacifier' });
  await new Promise(r => setTimeout(r, 6000));

  const pageData = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const title = document.querySelector('h1')?.innerText?.trim();
        const price = document.querySelector('.price, [data-product-price]')?.innerText?.trim();
        const desc = document.querySelector('.product__description, .product-description, #description, .description')?.innerHTML || document.body.innerHTML;
        const imgs = Array.from(document.querySelectorAll('img')).map(i => i.src).filter(s => s && s.includes('cdn.shopify.com'));
        return { title, price, imgs: [...new Set(imgs)], descSample: desc.substring(0, 1000) };
      })()
    `,
    returnByValue: true
  });

  fs.writeFileSync('supertots_cdp.json', JSON.stringify(pageData.result.value, null, 2));
  console.log('✔ Fetched via CDP:', pageData.result.value.title);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('supertots_recon.png', Buffer.from(shot.data, 'base64'));

  ws.close();
}

reconSuperTots().catch(console.error);
