import fs from 'fs';

async function reconClarifion() {
  console.log('Fetching Clarifion landing page info...');
  
  // Try direct fetch first
  try {
    const res = await fetch('https://about.clarifion.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    fs.writeFileSync('clarifion_page.html', html);
    console.log('Saved clarifion_page.html, size:', html.length);
  } catch (e) {
    console.warn('Direct fetch failed:', e.message);
  }

  // Also navigate in Chrome CDP to inspect dynamic elements & bundles
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

  console.log('Navigating Chrome to Clarifion advertorial...');
  await send('Page.navigate', { url: 'https://about.clarifion.com/' });
  await new Promise(r => setTimeout(r, 6000));

  const pageData = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const title = document.querySelector('h1')?.innerText?.trim() || document.title;
        const prices = Array.from(document.querySelectorAll('.price, [class*="price"], .package, [class*="bundle"]')).map(el => el.innerText.trim());
        const imgs = Array.from(document.querySelectorAll('img')).map(i => ({
          src: i.src,
          alt: i.alt,
          w: i.naturalWidth,
          h: i.naturalHeight
        })).filter(i => i.src && (i.src.includes('clarifion') || i.src.includes('cloudfront') || i.src.includes('shopify') || i.src.includes('.png') || i.src.includes('.jpg')));

        const textSnippets = Array.from(document.querySelectorAll('h2, h3, p')).map(el => el.innerText.trim()).filter(t => t.length > 20 && t.length < 300);

        return { title, prices: prices.slice(0, 10), imgs: imgs.slice(0, 30), textSnippets: textSnippets.slice(0, 20) };
      })()
    `,
    returnByValue: true
  });

  fs.writeFileSync('clarifion_cdp.json', JSON.stringify(pageData.result.value, null, 2));
  console.log('Clarifion Title:', pageData.result.value.title);
  console.log('Clarifion Images count:', pageData.result.value.imgs?.length);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('clarifion_recon.png', Buffer.from(shot.data, 'base64'));

  ws.close();
}

reconClarifion().catch(console.error);
