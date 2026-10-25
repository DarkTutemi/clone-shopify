import fs from 'fs';

async function scrapeDoughMixer() {
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
  console.log('Connected to CDP. Navigating to target funnel...');

  const targetUrl = 'https://m.sakerplus.com/funnel/news-sakerplus-automatic-dough-mixer-with-ferment-function-yn';
  await send('Page.navigate', { url: targetUrl });

  // Wait 7 seconds for Cloudflare and dynamic JS to settle
  await new Promise(r => setTimeout(r, 7000));

  // Extract page title, HTML, and data
  const evalData = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return {
        title: document.title,
        url: window.location.href,
        h1: document.querySelector('h1')?.innerText,
        price: document.querySelector('.price, .product-price, [data-price], .current-price')?.innerText,
        bodyTextSnippet: document.body.innerText.substring(0, 1500)
      };
    })()`
  });
  console.log('Page initial state:', evalData.result.value);

  // Take screenshot of target page
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('target_dough_mixer_recon.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved target_dough_mixer_recon.png');

  // Dump full HTML to file
  const htmlRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: 'document.documentElement.outerHTML'
  });
  fs.writeFileSync('target_dough_mixer.html', htmlRes.result.value);
  console.log('Saved target_dough_mixer.html (length: ' + htmlRes.result.value.length + ')');

  ws.close();
}

scrapeDoughMixer().catch(console.error);
