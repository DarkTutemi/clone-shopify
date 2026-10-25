async function parseLanding() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && t.url.includes('saker'));
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
    const data = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const res = {};
          // Title
          const title = document.querySelector('h1, .product-title, [class*="title"]');
          res.title = title ? title.innerText.trim() : document.title;

          // Variants / Bundles
          res.cards = [];
          document.querySelectorAll('[class*="tier"], [class*="card"], [class*="bundle"], [class*="sku"], [class*="item"], [class*="package"]').forEach(el => {
            const txt = el.innerText;
            if (txt && (txt.includes('$') || txt.includes('Battery') || txt.includes('Kit') || txt.includes('Pack'))) {
              if (txt.length < 250 && txt.length > 15) {
                res.cards.push({
                  class: el.className,
                  text: txt.trim().replace(/\\s+/g, ' ')
                });
              }
            }
          });

          // Product Images / Gallery
          res.gallery = [];
          document.querySelectorAll('img').forEach(img => {
            if (img.src && (img.src.includes('myshopage') || img.src.includes('saker') || img.src.includes('cdn')) && !img.src.includes('svg')) {
              res.gallery.push({
                src: img.src,
                alt: img.alt,
                w: img.naturalWidth || img.width,
                h: img.naturalHeight || img.height
              });
            }
          });

          // Text blocks
          res.sections = [];
          document.querySelectorAll('h2, h3, [class*="heading"]').forEach(h => {
            res.sections.push(h.innerText.trim());
          });

          return res;
        })()
      `,
      returnByValue: true
    });

    import('fs').then(fs => {
      fs.writeFileSync('landing_extracted.json', JSON.stringify(data.result.value, null, 2));
      console.log('Saved extracted data to landing_extracted.json');
    });

    ws.close();
  });
}
parseLanding().catch(console.error);
