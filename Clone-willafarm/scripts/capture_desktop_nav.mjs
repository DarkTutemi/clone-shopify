import fs from 'fs';

async function sendCdp(ws, method, params = {}, id = 1) {
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  const newTargetRes = await fetch('http://127.0.0.1:9222/json/new?https://tryzavelyn.com/', { method: 'PUT' });
  const target = await newTargetRes.json();

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const call = (method, params) => sendCdp(ws, method, params, ++id);

  await call('Page.enable');
  await call('Runtime.enable');
  await call('DOM.enable');

  await call('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await call('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 2500));

  const shot = await call('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 180, scale: 1 }
  });
  fs.writeFileSync('Clone-willafarm/reports/desktop_header_1440.png', Buffer.from(shot.data, 'base64'));
  console.log('✔ Saved 1440px desktop header: Clone-willafarm/reports/desktop_header_1440.png');

  await call('Target.closeTarget', { targetId: target.id });
  ws.close();
}

main().catch(console.error);
