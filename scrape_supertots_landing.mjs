import fs from 'fs';

async function scrapeLanding() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!pageTab) throw new Error('No CDP tab found');

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

  console.log('Navigating to SuperTots live PDP...');
  await send('Page.navigate', { url: 'https://www.super-tots.com/products/supertots-food-pacifier' });
  await new Promise(r => setTimeout(r, 6000));

  const pageInfo = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const title = document.querySelector('h1')?.innerText?.trim();
        const allImages = Array.from(document.querySelectorAll('img')).map(i => ({
          src: i.src,
          alt: i.alt,
          naturalWidth: i.naturalWidth,
          naturalHeight: i.naturalHeight
        })).filter(i => i.src && i.src.includes('cdn.shopify.com'));

        const reviews = Array.from(document.querySelectorAll('.jdgm-rev, .review, [class*="review"]')).map(r => ({
          author: r.querySelector('[class*="author"], .jdgm-rev__author')?.innerText?.trim(),
          rating: r.querySelector('[class*="rating"], .jdgm-rev__rating')?.innerText?.trim(),
          title: r.querySelector('[class*="title"], .jdgm-rev__title')?.innerText?.trim(),
          body: r.querySelector('[class*="body"], .jdgm-rev__body')?.innerText?.trim()
        })).filter(r => r.body);

        const sections = Array.from(document.querySelectorAll('div, section')).filter(el => {
          const t = el.innerText || '';
          return t.includes('Choking') || t.includes('Teething') || t.includes('Silicone') || t.includes('Features') || t.includes('How to use');
        }).map(el => el.innerText.trim().substring(0, 500));

        return { title, allImages, reviews: reviews.slice(0, 10), sections: sections.slice(0, 5) };
      })()
    `,
    returnByValue: true
  });

  fs.writeFileSync('supertots_landing_scraped.json', JSON.stringify(pageInfo.result.value, null, 2));
  console.log('✔ Scraped landing info. Images found:', pageInfo.result.value.allImages?.length);

  ws.close();
}

scrapeLanding().catch(console.error);
