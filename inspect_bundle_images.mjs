async function inspectBundleImages() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && t.url.includes('order-saker'));
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
    const res = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('.product-item')).map(item => {
          const img = item.querySelector('img');
          const title = item.querySelector('[class*="title"], h3, h4, span')?.innerText;
          const text = item.innerText;
          return {
            imgSrc: img ? img.src : null,
            text: text.trim().replace(/\\s+/g, ' ')
          };
        })
      `,
      returnByValue: true
    });

    console.log(JSON.stringify(res.result.value, null, 2));
    ws.close();
  });
}
inspectBundleImages().catch(console.error);
