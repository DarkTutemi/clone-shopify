import fs from 'fs';

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const pages = await res.json();
  const page = pages.find(p => p.url.includes('thoson-magtrack'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (m, p = {}) => new Promise((resolve) => {
    const i = id++;
    const h = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === i) { ws.removeEventListener('message', h); resolve(msg.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: i, method: m, params: p }));
  });

  const positions = [
    { name: 'magtrack_6_specs.png', y: 8000 },
    { name: 'magtrack_7_comp.png', y: 9500 },
    { name: 'magtrack_8_faq.png', y: 11000 },
    { name: 'magtrack_9_reviews.png', y: 12500 }
  ];

  for (const pos of positions) {
    await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${pos.y}, behavior: 'instant' });` });
    await new Promise(r => setTimeout(r, 800));
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(pos.name, Buffer.from(shot.data, 'base64'));
    console.log(`Saved ${pos.name}`);
  }

  ws.close();
}

main().catch(console.error);
