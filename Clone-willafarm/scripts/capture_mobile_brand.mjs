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
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/AF9C7C01907A48572E5169E34B27826D');
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const call = (method, params) => sendCdp(ws, method, params, ++id);

  await call('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  await call('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 2500));

  const shot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('Clone-willafarm/reports/tryzavelyn_mobile_brand.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved mobile screenshot to Clone-willafarm/reports/tryzavelyn_mobile_brand.png');

  // Reset back
  await call('Emulation.clearDeviceMetricsOverride');
  ws.close();
}

main().catch(console.error);
