import fs from 'fs';

async function reconCheckout() {
  const targetUrl = 'https://m.sakerplus.com/funnel/checkout-sakerplus-5-in-1-rotary-cheese-grater-shredder-2-cp-1778220759128';
  console.log('Connecting to Chrome CDP on port 9222...');
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.id === 'F30B7C1DA4E05A408A1972D3BF949DB3') || tabs[0];
  console.log('Using tab:', tab.id, tab.url);

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
    console.log('Navigating to checkout funnel:', targetUrl);
    await send('Page.navigate', { url: targetUrl });
    await new Promise(r => setTimeout(r, 6000));

    const htmlEval = await send('Runtime.evaluate', { expression: 'document.documentElement.outerHTML' });
    const html = htmlEval.result.value;
    fs.writeFileSync('cheese_grater_checkout.html', html, 'utf8');
    console.log(`Saved cheese_grater_checkout.html (${html.length} bytes)`);

    // Parse options & prices
    const bundleEval = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const bodyText = document.body.innerText;
          
          // Look for package titles, radios, prices
          const cards = Array.from(document.querySelectorAll('.el-radio, .package-item, .bundle-item, [class*="radio"], [class*="bundle"], [class*="package"], [class*="variant"], .product-item'))
            .map(el => ({
              className: el.className,
              text: el.innerText.trim().replace(/\\s+/g, ' '),
              html: el.innerHTML
            })).filter(c => c.text.includes('$') || c.text.includes('Buy') || c.text.includes('OFF') || c.text.includes('Pack'));

          // All images
          const imgs = Array.from(document.querySelectorAll('img')).map(i => ({
            src: i.src || i.getAttribute('data-src'),
            alt: i.alt
          })).filter(i => i.src && !i.src.includes('data:image'));

          // Prices
          const rawPrices = Array.from(document.querySelectorAll('*'))
            .filter(el => el.children.length === 0 && /\\$\\s*\\d+(\\.\\d+)?/.test(el.innerText))
            .map(el => el.innerText.trim())
            .filter((v, i, arr) => arr.indexOf(v) === i);

          return { cards: cards.slice(0, 10), imgs: imgs.slice(0, 20), rawPrices };
        })()
      `,
      returnByValue: true
    });

    fs.writeFileSync('cheese_grater_packages.json', JSON.stringify(bundleEval.result.value, null, 2), 'utf8');
    console.log('Checkout packages result:', bundleEval.result.value.rawPrices);
    console.log('Cards found:', bundleEval.result.value.cards.length);
    bundleEval.result.value.cards.forEach(c => console.log('Card text:', c.text.substring(0, 100)));

    ws.close();
  });
}

reconCheckout().catch(console.error);
