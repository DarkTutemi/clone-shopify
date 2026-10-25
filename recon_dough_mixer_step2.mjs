import fs from 'fs';

async function scrapeStep2() {
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
  console.log('Connected to CDP. Navigating to Step 2 Offer page...');

  const step2Url = 'https://m.sakerplus.com/funnel/landingpage-sakerplus-automatic-dough-mixer-with-ferment-function-cp-1780569081585?pageId=2084244154479583234';
  await send('Page.navigate', { url: step2Url });
  await new Promise(r => setTimeout(r, 7000));

  const pageInfo = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return {
        title: document.title,
        url: window.location.href,
        h1: document.querySelector('h1')?.innerText,
        prices: Array.from(document.querySelectorAll('.price, .current-price, [data-price], .money, .product-price')).map(e => e.innerText.trim()).filter(Boolean),
        cards: Array.from(document.querySelectorAll('.bundle-item, .card, .variant-item, [class*="bundle"], [class*="variant"], [class*="tier"]')).slice(0, 10).map(e => ({
          className: e.className,
          text: e.innerText.replace(/\\n+/g, ' | ')
        })),
        atcBtn: document.querySelector('button[type="submit"], .btn-buy, .atc-btn, [class*="checkout"]')?.innerText
      };
    })()`
  });
  console.log('Step 2 page info:', JSON.stringify(pageInfo.result.value, null, 2));

  // Take screenshot of step 2
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('target_dough_mixer_step2.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved target_dough_mixer_step2.png');

  // Dump Step 2 HTML
  const htmlRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: 'document.documentElement.outerHTML'
  });
  fs.writeFileSync('target_dough_mixer_step2.html', htmlRes.result.value);
  console.log('Saved target_dough_mixer_step2.html (length: ' + htmlRes.result.value.length + ')');

  ws.close();
}

scrapeStep2().catch(console.error);
