import fs from 'fs';

async function run() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && t.url.includes('thoson-magtrack'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  ws.addEventListener('open', async () => {
    console.log('Reloading...');
    await send('Page.reload', { ignoreCache: true });
    await new Promise(r => setTimeout(r, 3500));
    await send('Runtime.evaluate', { expression: 'document.querySelector(".wf-delivery-section")?.scrollIntoView({ block: "center" });' });
    await new Promise(r => setTimeout(r, 800));
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3/magtrack_verified_delivery_section.png', Buffer.from(shot.data, 'base64'));
    console.log('✔ Captured magtrack_verified_delivery_section.png');
    ws.close();
  });
}
run().catch(console.error);
