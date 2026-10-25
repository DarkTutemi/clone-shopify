import fs from 'fs';

async function checkProductTemplate() {
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

  const result = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const bundleWrap = document.querySelector('[class*="bundle"], [class*="variant"]');
        const sections = Array.from(document.querySelectorAll('main section, [class*="shopify-section"]')).map(s => ({
          id: s.id,
          className: s.className,
          html: s.innerHTML.slice(0, 300)
        }));
        const bundleHtml = document.querySelector('.bundle-container, .willa-pdp-bundle-wrap, .product__info-container, .product-form')?.outerHTML?.slice(0, 1500);

        return {
          sections,
          bundleHtml
        };
      })()
    `,
    returnByValue: true
  });

  fs.writeFileSync('pdp_rendered_dom.json', JSON.stringify(result.result.value, null, 2));
  console.log('Saved pdp_rendered_dom.json');
  ws.close();
}

checkProductTemplate().catch(console.error);
