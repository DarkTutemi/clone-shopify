import fs from 'fs';

async function run() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.type === 'page' && t.url && !t.url.includes('sandbox'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let id = 1;
  const send = (method, params = {}) => new Promise((res, rej) => {
    const cur = id++;
    const h = (e) => {
      const m = JSON.parse(e.data.toString());
      if (m.id === cur) { ws.removeEventListener('message', h); res(m.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method, params }));
  });

  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves?preview_theme_id=187597717689' });
  await new Promise(r => setTimeout(r, 4500));
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Runtime.evaluate', { expression: 'document.querySelectorAll(".shopify-preview-bar").forEach(el => el.style.display = "none"); window.scrollTo(0, 450);' });
  await new Promise(r => setTimeout(r, 1000));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3/thermoglove_buybox_verified.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved thermoglove_buybox_verified.png');
  ws.close();
}

run().catch(console.error);
