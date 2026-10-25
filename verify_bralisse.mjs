import fs from 'fs';

async function verifyBralisse() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!pageTab) {
    console.error('No page tab found on port 9222');
    return;
  }

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
  console.log('Connected to CDP. Navigating to live Zavelyn SculptComfort Bra PDP...');

  const liveUrl = 'https://tryzavelyn.com/products/zavelyn-sculptcomfort-wirefree-breast-shapewear-bra';
  await send('Page.navigate', { url: liveUrl });
  await new Promise(r => setTimeout(r, 4500));

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1200,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const domData = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const title = document.querySelector('h1')?.innerText?.trim();
        const price = document.querySelector('.price, .product-price, .wf-card-price')?.innerText?.trim();
        const cards = Array.from(document.querySelectorAll('.wf-bundle-card')).map(c => ({
          title: c.querySelector('.wf-card-title')?.innerText?.trim(),
          badge: c.querySelector('.wf-card-badge')?.innerText?.trim(),
          price: c.querySelector('.wf-card-price')?.innerText?.trim(),
          desc: c.querySelector('.wf-card-desc')?.innerText?.trim(),
          active: c.classList.contains('active')
        }));
        const swatches = Array.from(document.querySelectorAll('.willa-color-swatch-btn, .willa-swatch-item, .wf-swatch-btn')).map(s => s.getAttribute('data-color-val') || s.innerText.trim());
        const atcBtn = document.querySelector('#AddToCart, button[name="add"], .add-to-cart')?.innerText?.trim();
        const heroImg = document.querySelector('.main-product-media img, .product__media img')?.src;
        return { title, price, cards, swatches, atcBtn, heroImg };
      })()
    `,
    returnByValue: true
  });

  console.log('DOM Evaluation Result:', JSON.stringify(domData.result.value, null, 2));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('bralisse_live_pdp.png', Buffer.from(screenshot.data, 'base64'));
  console.log('✔ Captured live screenshot: bralisse_live_pdp.png');

  ws.close();
}

verifyBralisse().catch(console.error);
