import fs from 'fs';

async function main() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.url?.includes('/collections/best-sellers') || (t.type === 'page' && t.webSocketDebuggerUrl));
  if (!pageTab) throw new Error('No CDP tab found');

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
  console.log('Connected to tab:', pageTab.url);

  // Navigate to best-sellers if not already there
  if (!pageTab.url.includes('/collections/best-sellers')) {
    await send('Page.navigate', { url: 'https://tryzavelyn.com/collections/best-sellers' });
    await new Promise(r => setTimeout(r, 3000));
  }

  const domAnalysis = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const h1 = document.querySelector('h1')?.innerText?.trim();
        const subtitle = document.querySelector('h1 + p, .collection-hero__description, [class*="desc"]')?.innerText?.trim();
        
        // Find product cards container
        const cardContainers = Array.from(document.querySelectorAll('[class*="collection"], [class*="product-grid"], [class*="grid"]'))
          .map(el => ({ tag: el.tagName, class: el.className, id: el.id }))
          .slice(0, 10);

        // Find sample product card HTML
        const sampleCard = document.querySelector('.card, [class*="card"], [class*="product-item"], [class*="grid-item"], li[class*="item"]');
        const cardHtml = sampleCard ? sampleCard.outerHTML.slice(0, 1500) : 'none';

        // Find all links in first 3 cards
        const sampleCardsData = Array.from(document.querySelectorAll('.card, [class*="card"], [class*="product-item"], [class*="grid__item"]')).slice(0, 3).map(c => ({
          classes: c.className,
          title: c.querySelector('h3, h2, a[href*="/products/"], [class*="title"]')?.innerText?.trim(),
          titleTag: c.querySelector('h3, h2, a[href*="/products/"], [class*="title"]')?.outerHTML?.slice(0, 300),
          price: c.querySelector('.price, [class*="price"]')?.innerText?.trim(),
          button: c.querySelector('button, [class*="btn"], [class*="atc"], a[href*="cart"]')?.outerHTML?.slice(0, 300),
          img: c.querySelector('img')?.src
        }));

        return { h1, subtitle, cardContainers, cardHtml, sampleCardsData };
      })()
    `,
    returnByValue: true
  });

  console.log('Live Collection DOM Analysis:');
  console.log(JSON.stringify(domAnalysis.result.value, null, 2));
  fs.writeFileSync('collection_dom_analysis.json', JSON.stringify(domAnalysis.result.value, null, 2));

  ws.close();
}

main().catch(console.error);
