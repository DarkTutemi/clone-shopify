import fs from 'fs';

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const pages = await res.json();
  const page = pages.find(p => p.url.includes('sakerplus-fence-post-repair-kit') || (p.type === 'page' && !p.url.startsWith('chrome')));

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

  console.log('Reloading live PDP...');
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/sakerplus-fence-post-repair-kit' });
  await new Promise(r => setTimeout(r, 4000));

  const checkScript = `
    (() => {
      const trustItems = Array.from(document.querySelectorAll('.willa-pdp-trust-box .pdp-trust-item')).map(el => el.innerText.trim());
      const cards = Array.from(document.querySelectorAll('.wf-bundle-card')).map(card => {
        return {
          title: card.querySelector('.wf-card-title')?.innerText,
          tags: Array.from(card.querySelectorAll('.wf-card-tag')).map(t => t.innerText),
          desc: card.querySelector('.wf-card-desc')?.innerText,
          descHtml: card.querySelector('.wf-card-desc')?.innerHTML,
          price: card.querySelector('.wf-card-price')?.innerText,
          comp: card.querySelector('.wf-card-comp')?.innerText,
          unit: card.querySelector('.wf-unit-note')?.innerText,
          freeshipBadge: card.querySelector('.wf-card-freeship-badge')?.innerText
        };
      });
      return { trustItems, cards };
    })()
  `;

  const info = await send('Runtime.evaluate', {
    expression: checkScript,
    returnByValue: true
  });

  console.log('Evaluation:', JSON.stringify(info.result?.value, null, 2));

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('fence_freeship_highlight_screenshot.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved fence_freeship_highlight_screenshot.png');

  ws.close();
}

main().catch(console.error);
