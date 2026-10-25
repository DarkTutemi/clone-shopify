import fs from 'fs';

async function reconNroome() {
  const targetUrl = 'https://www.nroome.com/products/nroome';
  console.log('Testing direct fetch on nroome product...');
  try {
    const res = await fetch('https://www.nroome.com/products/nroome.js');
    if (res.ok) {
      const data = await res.json();
      console.log('Shopify products.js endpoint returned OK!');
      fs.writeFileSync('nroome_product.json', JSON.stringify(data, null, 2));
      console.log('Title:', data.title);
      console.log('Variants:', data.variants.length);
      console.log('Images:', data.images.length);
    } else {
      console.log('Direct fetch returned status:', res.status);
    }
  } catch (e) {
    console.log('Direct fetch error:', e.message);
  }

  // Also connect to Chrome CDP to inspect actual page DOM, review widgets, and bundles
  console.log('\nConnecting to Chrome CDP on 9222 to inspect rendered DOM...');
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!pageTab) {
    console.error('No page tab on 9222');
    return;
  }

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      const handler = evt => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await new Promise(r => ws.addEventListener('open', r));
  console.log('Navigating Chrome to:', targetUrl);
  await send('Page.navigate', { url: targetUrl });
  await new Promise(r => setTimeout(r, 6000));

  const pageInfo = await send('Runtime.evaluate', {
    expression: `
      (() => {
        return {
          title: document.title,
          url: window.location.href,
          h1: document.querySelector('h1')?.innerText?.trim(),
          priceText: document.querySelector('.price, [class*="price"]')?.innerText?.trim(),
          descriptionHtmlLength: document.querySelector('.product__description, .product-description, [class*="description"]')?.innerHTML?.length || 0,
          images: Array.from(document.querySelectorAll('img')).map(i => i.src).filter(s => s && s.includes('http')),
          allButtons: Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean)
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Rendered Page Info:', JSON.stringify(pageInfo.result.value, null, 2));

  // Capture full HTML for analysis
  const htmlEval = await send('Runtime.evaluate', { expression: 'document.documentElement.outerHTML' });
  fs.writeFileSync('nroome_raw.html', htmlEval.result.value);
  console.log('Saved nroome_raw.html (' + htmlEval.result.value.length + ' bytes)');

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('nroome_page_screenshot.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved nroome_page_screenshot.png');

  ws.close();
}

reconNroome().catch(console.error);
