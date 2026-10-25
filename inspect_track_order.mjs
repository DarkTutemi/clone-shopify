import fs from 'fs';

async function main() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const trackTab = tabs.find(t => t.url?.includes('track-order') || (t.type === 'page' && t.webSocketDebuggerUrl));
  if (!trackTab) throw new Error('No tab found');

  const ws = new WebSocket(trackTab.webSocketDebuggerUrl);
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

  if (!trackTab.url.includes('track-order')) {
    await send('Page.navigate', { url: 'https://tryzavelyn.com/pages/track-order' });
    await new Promise(r => setTimeout(r, 3000));
  }

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('track_order_current.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved track_order_current.png');

  const dom = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const title = document.title;
        const h1 = document.querySelector('h1')?.innerText?.trim();
        const mainHtml = document.querySelector('main, #MainContent, article, .page-content')?.innerHTML?.slice(0, 2000) || '';
        return { title, h1, mainHtml };
      })()
    `,
    returnByValue: true
  });

  console.log('Track Order DOM details:');
  console.log('Title:', dom.result.value.title);
  console.log('H1:', dom.result.value.h1);
  console.log('Main snippet:\n', dom.result.value.mainHtml);

  ws.close();
}

main().catch(console.error);
