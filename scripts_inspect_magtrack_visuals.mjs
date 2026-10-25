import fs from 'fs';

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const pages = await res.json();
  const page = pages.find(p => p.url.includes('thoson-magtrack') || (p.type === 'page' && !p.url.startsWith('chrome')));

  if (!page) {
    console.error('No page found');
    return;
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const i = id++;
    const h = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === i) {
        ws.removeEventListener('message', h);
        m.error ? reject(m.error) : resolve(m.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: i, method, params }));
  });

  // Make sure we're on the page
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/thoson-magtrack' });
  await new Promise(r => setTimeout(r, 3500));

  // Get general page metrics and elements
  const pageAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const title = document.querySelector('h1')?.innerText || document.title;
        const totalImages = document.querySelectorAll('img').length;
        const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => img.naturalWidth === 0).map(img => img.src);
        const sections = Array.from(document.querySelectorAll('section, [class*="section"], [id*="section"]')).map(s => ({
          tag: s.tagName,
          id: s.id,
          class: s.className,
          height: s.clientHeight
        })).filter(s => s.height > 50);

        return {
          title,
          totalImages,
          brokenImagesCount: brokenImages.length,
          brokenImages: brokenImages.slice(0, 10),
          sectionsCount: sections.length,
          sections: sections.slice(0, 15)
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Page Audit:', JSON.stringify(pageAudit.result.value, null, 2));

  // Capture 4 scroll viewpoints
  const scrollPositions = [
    { name: 'magtrack_1_hero.png', y: 0 },
    { name: 'magtrack_2_buybox.png', y: 800 },
    { name: 'magtrack_3_features.png', y: 2200 },
    { name: 'magtrack_4_specs_comp.png', y: 4000 },
    { name: 'magtrack_5_reviews.png', y: 6500 }
  ];

  for (const pos of scrollPositions) {
    await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${pos.y}, behavior: 'instant' });` });
    await new Promise(r => setTimeout(r, 800));
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(pos.name, Buffer.from(shot.data, 'base64'));
    console.log(`Saved ${pos.name}`);
  }

  ws.close();
}

main().catch(console.error);
