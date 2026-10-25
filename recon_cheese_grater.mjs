import fs from 'fs';

async function reconCheeseGrater() {
  const targetUrl = 'https://m.sakerplus.com/funnel/landing-sakerplus-5-in-1-rotary-cheese-grater-shredder-2-cp-1778220759128';
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
    console.log('Navigating to:', targetUrl);
    await send('Page.navigate', { url: targetUrl });
    await new Promise(r => setTimeout(r, 6000));

    // Get current URL (in case of redirect)
    const urlEval = await send('Runtime.evaluate', { expression: 'window.location.href' });
    console.log('Resolved URL:', urlEval.result.value);

    // Get full HTML
    const htmlEval = await send('Runtime.evaluate', { expression: 'document.documentElement.outerHTML' });
    const html = htmlEval.result.value;
    fs.writeFileSync('cheese_grater_raw.html', html, 'utf8');
    console.log(`Saved cheese_grater_raw.html (${html.length} bytes)`);

    // Extract all images, gifs, titles, pricing, CTA links
    const dataEval = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const title = document.title;
          const h1 = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim()).filter(Boolean);
          
          const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src || img.getAttribute('data-src') || img.getAttribute('lazy-src'),
            alt: img.alt,
            width: img.naturalWidth,
            height: img.naturalHeight
          })).filter(i => i.src && !i.src.includes('data:image'));

          const gifs = imgs.filter(i => i.src.toLowerCase().includes('.gif') || i.src.toLowerCase().includes('gif'));

          const links = Array.from(document.querySelectorAll('a')).map(a => ({
            text: a.innerText.trim().replace(/\\n/g, ' '),
            href: a.href
          })).filter(l => l.href && !l.href.startsWith('javascript'));

          const prices = Array.from(document.querySelectorAll('*'))
            .filter(el => el.children.length === 0 && /\\$\\s*\\d+(\\.\\d+)?/.test(el.innerText))
            .map(el => el.innerText.trim())
            .filter((v, i, arr) => arr.indexOf(v) === i);

          return { title, h1, imgsCount: imgs.length, gifs, links, prices, sampleImgs: imgs.slice(0, 20) };
        })()
      `,
      returnByValue: true
    });

    fs.writeFileSync('cheese_grater_extracted.json', JSON.stringify(dataEval.result.value, null, 2), 'utf8');
    console.log('Extraction results:');
    console.log('Title:', dataEval.result.value.title);
    console.log('Found GIFs:', dataEval.result.value.gifs.length);
    console.log('Prices found:', dataEval.result.value.prices);
    console.log('Links:', dataEval.result.value.links.slice(0, 10));

    ws.close();
  });
}

reconCheeseGrater().catch(console.error);
