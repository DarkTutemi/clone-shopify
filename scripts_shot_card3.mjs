import fs from 'fs';

async function shot3() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const pages = await res.json();
  const page = pages.find(p => p.url.includes('sakerplus-fence-post-repair-kit'));
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

  await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll(".wf-bundle-card")[2].click();'
  });
  await new Promise(r => setTimeout(r, 600));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('fence_card3_active_screenshot.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved fence_card3_active_screenshot.png');
  ws.close();
}
shot3().catch(console.error);
