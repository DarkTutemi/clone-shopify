import fs from 'fs';

async function shotMobile() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && t.url.includes('sinus-relief'));
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
    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 500));
    await send('Runtime.evaluate', {
      expression: `
        const p = document.getElementById('product-selection');
        if (p) p.scrollIntoView({ behavior: 'instant', block: 'start' });
      `
    });
    await new Promise(r => setTimeout(r, 1200));
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3/sinus_relief_mobile_products_actual.png', Buffer.from(shot.data, 'base64'));
    await send('Emulation.clearDeviceMetricsOverride');
    ws.close();
    console.log('✔ Done mobile products shot');
  });
}
shotMobile().catch(console.error);
