async function inspectOrderPage() {
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
    console.log('Navigating to order page...');
    await send('Page.navigate', { url: 'https://m.sakerplus.com/funnel/order-saker-cordless-turbo-leaf-blower-51-1' });
    await new Promise(r => setTimeout(r, 6000));

    const htmlRes = await send('Runtime.evaluate', { expression: 'document.documentElement.outerHTML' });
    const titleRes = await send('Runtime.evaluate', { expression: 'document.title' });
    console.log('Order Title:', titleRes.result.value);
    console.log('Order HTML Length:', htmlRes.result.value.length);

    import('fs').then(fs => {
      fs.writeFileSync('saker_leaf_blower_order.html', htmlRes.result.value);
      console.log('Saved to saker_leaf_blower_order.html');
    });

    // Also extract all text in buybox / package options
    const bundleData = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const res = {};
          res.title = document.querySelector('h1, [class*="title"]')?.innerText;
          
          res.bundles = Array.from(document.querySelectorAll('[class*="item"], [class*="card"], [class*="bundle"], [class*="tier"], [class*="package"], [class*="option"]')).map(el => {
            const t = el.innerText.trim().replace(/\\s+/g, ' ');
            return { class: el.className, text: t };
          }).filter(x => x.text.includes('$') && x.text.length < 200 && x.text.length > 10);

          res.prices = Array.from(document.querySelectorAll('[class*="price"]')).map(el => el.innerText.trim());

          res.images = Array.from(document.querySelectorAll('img')).map(img => img.src).filter(u => u.includes('cdn') || u.includes('myshopage'));

          return res;
        })()
      `,
      returnByValue: true
    });

    import('fs').then(fs => {
      fs.writeFileSync('order_extracted.json', JSON.stringify(bundleData.result.value, null, 2));
      console.log('Saved extracted bundle data to order_extracted.json');
    });

    ws.close();
  });
}
inspectOrderPage().catch(console.error);
