import fs from 'fs';

async function reconBralisse() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!pageTab) {
    console.error('No page tab found on port 9222');
    return;
  }

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
  console.log('Connected to CDP. Navigating to Bralisse...');

  const targetUrl = 'https://bralisse.com/';
  await send('Page.navigate', { url: targetUrl });
  await new Promise(r => setTimeout(r, 6000));

  const pageDetails = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const title = document.title;
      const h1 = document.querySelector('h1')?.innerText;
      const prices = Array.from(document.querySelectorAll('.price, .money, [data-price], [class*="price"]')).map(p => p.innerText.trim()).filter(Boolean);
      const btns = Array.from(document.querySelectorAll('button, a[href*="products"], a[href*="cart"], .btn')).map(b => ({
        text: b.innerText.replace(/\\n+/g, ' | ').trim(),
        href: b.href || ''
      })).filter(b => b.text.length > 0 && b.text.length < 80).slice(0, 15);

      const imgs = Array.from(document.querySelectorAll('img')).map(i => i.src).filter(u => u && !u.includes('analytics') && !u.includes('pixel'));

      return { title, h1, prices: [...new Set(prices)].slice(0, 15), btns, imgCount: imgs.length, sampleImgs: imgs.slice(0, 10) };
    })()`
  });
  console.log('Bralisse details:', JSON.stringify(pageDetails.result.value, null, 2));

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('bralisse_recon.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved bralisse_recon.png');

  // Dump HTML
  const htmlRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: 'document.documentElement.outerHTML'
  });
  fs.writeFileSync('bralisse_page.html', htmlRes.result.value);
  console.log('Saved bralisse_page.html (length: ' + htmlRes.result.value.length + ')');

  ws.close();
}

reconBralisse().catch(console.error);
