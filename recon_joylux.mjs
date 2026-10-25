import fs from 'fs';

async function reconJoylux() {
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
  console.log('Connected to CDP. Navigating to Joylux vFit page...');

  const targetUrl = 'https://joylux.com/pages/vfit';
  await send('Page.navigate', { url: targetUrl });
  await new Promise(r => setTimeout(r, 6000));

  // Get basic details
  const pageDetails = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const title = document.title;
      const h1 = document.querySelector('h1')?.innerText;
      const buyBtns = Array.from(document.querySelectorAll('a, button')).filter(e => {
        const t = e.innerText.toLowerCase();
        return t.includes('shop') || t.includes('buy') || t.includes('order') || t.includes('get');
      }).map(e => ({ text: e.innerText.trim(), href: e.href || '' })).slice(0, 10);

      const prices = Array.from(document.querySelectorAll('.price, .money, [data-price]')).map(p => p.innerText.trim()).filter(Boolean);

      return { title, h1, buyBtns, prices };
    })()`
  });
  console.log('Joylux page details:', JSON.stringify(pageDetails.result.value, null, 2));

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('joylux_recon.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved joylux_recon.png');

  // Dump HTML
  const htmlRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: 'document.documentElement.outerHTML'
  });
  fs.writeFileSync('joylux_page.html', htmlRes.result.value);
  console.log('Saved joylux_page.html (length: ' + htmlRes.result.value.length + ')');

  ws.close();
}

reconJoylux().catch(console.error);
