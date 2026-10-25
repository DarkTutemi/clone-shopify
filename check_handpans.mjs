import fs from 'fs';

async function checkHp() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const hpTab = tabs.find(t => t.url?.includes('zavelyn-handpans') || (t.type === 'page' && t.webSocketDebuggerUrl));
  const ws = new WebSocket(hpTab.webSocketDebuggerUrl);
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

  await send('Page.navigate', { url: 'https://tryzavelyn.com/collections/zavelyn-handpans' });
  await new Promise(r => setTimeout(r, 4000));

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  });

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('handpans_view.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved handpans_view.png');

  const dom = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const title = document.title;
        const h1 = document.querySelector('h1')?.innerText?.trim();
        const cards = document.querySelectorAll('.zhp-card, [class*="card"], [class*="product"]').length;
        return { title, h1, cards };
      })()
    `,
    returnByValue: true
  });
  console.log('DOM info:', dom.result.value);

  ws.close();
}

checkHp().catch(console.error);
