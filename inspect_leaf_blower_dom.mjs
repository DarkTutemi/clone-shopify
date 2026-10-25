async function inspectLiveDom() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && t.url.includes('saker'));
  console.log('Connecting to tab:', tab.id, tab.url);

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      const handler = (evt) => {
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

  ws.addEventListener('open', async () => {
    // Extract title, price, variants, bundles
    const result = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const data = {};
          // Title
          const titleEl = document.querySelector('.title, .product-title, h1, [class*="title"]');
          data.title = titleEl ? titleEl.innerText : document.title;

          // Buybox / options / variants
          data.offers = [];
          document.querySelectorAll('[class*="item"], [class*="card"], [class*="sku"], [class*="variant"], [class*="option"], [class*="tier"]').forEach(el => {
            const text = el.innerText;
            if (text && (text.includes('$') || text.includes('Buy') || text.includes('Off') || text.includes('PC'))) {
              if (text.length < 300) {
                data.offers.push({ class: el.className, text: text.trim().replace(/\\s+/g, ' ') });
              }
            }
          });

          // All images
          data.images = Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height
          }));

          // Body text blocks
          data.paragraphs = Array.from(document.querySelectorAll('p, h2, h3, h4, li')).map(p => p.innerText.trim()).filter(t => t.length > 20);

          return data;
        })()
      `,
      returnByValue: true
    });

    import('fs').then(fs => {
      fs.writeFileSync('saker_leaf_blower_extracted.json', JSON.stringify(result.result.value, null, 2));
      console.log('Saved extracted data to saker_leaf_blower_extracted.json');
    });

    ws.close();
  });
}

inspectLiveDom().catch(console.error);
