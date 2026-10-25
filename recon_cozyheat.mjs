import fs from 'fs';

async function reconCozyHeat() {
  const targetUrl = 'https://everlittlekid.store/products/cozyheat%E2%84%A2-heated-sweater';
  console.log('Testing direct fetch on product JSON / JS...');
  
  const testUrls = [
    'https://everlittlekid.store/products/cozyheat%E2%84%A2-heated-sweater.js',
    'https://everlittlekid.store/products/cozyheat-heated-sweater.js',
    'https://everlittlekid.store/products.json'
  ];

  for (const u of testUrls) {
    try {
      const res = await fetch(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      console.log(`Fetch ${u} status: ${res.status}`);
      if (res.ok) {
        const text = await res.text();
        fs.writeFileSync('cozyheat_fetched.json', text.slice(0, 50000));
        console.log(`Saved sample from ${u} (${text.length} bytes)`);
        break;
      }
    } catch (e) {
      console.log(`Error ${u}:`, e.message);
    }
  }

  // Also navigate Chrome CDP on port 9222
  console.log('\nConnecting to Chrome CDP on 9222 to inspect rendered page...');
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!pageTab) {
    console.error('No page tab on 9222');
    return;
  }

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      const handler = evt => {
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

  await new Promise(r => ws.addEventListener('open', r));
  console.log('Navigating Chrome to:', targetUrl);
  await send('Page.navigate', { url: targetUrl });
  await new Promise(r => setTimeout(r, 6000));

  const pageInfo = await send('Runtime.evaluate', {
    expression: `
      (() => {
        return {
          title: document.title,
          url: window.location.href,
          h1: document.querySelector('h1')?.innerText?.trim(),
          priceText: document.querySelector('.price, [class*="price"]')?.innerText?.trim(),
          images: Array.from(document.querySelectorAll('img')).map(i => i.src).filter(s => s && s.includes('http')),
          options: Array.from(document.querySelectorAll('fieldset, select, [class*="variant"], [class*="option"]')).map(el => el.innerText?.trim()).filter(Boolean),
          buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean)
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Rendered Page Info:', JSON.stringify(pageInfo.result.value, null, 2));

  // Get full HTML
  const htmlEval = await send('Runtime.evaluate', { expression: 'document.documentElement.outerHTML' });
  fs.writeFileSync('cozyheat_raw.html', htmlEval.result.value);
  console.log('Saved cozyheat_raw.html (' + htmlEval.result.value.length + ' bytes)');

  // Screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('cozyheat_page_screenshot.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved cozyheat_page_screenshot.png');

  ws.close();
}

reconCozyHeat().catch(console.error);
