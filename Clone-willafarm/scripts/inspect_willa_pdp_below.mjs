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

async function inspectWillaPdpBelow() {
  const newTargetRes = await fetch('http://127.0.0.1:9222/json/new?https://willafarm.com/products/bonebroth', { method: 'PUT' });
  const target = await newTargetRes.json();

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  let msgId = 1;
  const call = (method, params) => sendCdp(ws, method, params, ++msgId);

  await call('Page.enable');
  await call('Runtime.enable');

  await call('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await call('Emulation.setUserAgentOverride', {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });

  await call('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 4000));

  // Scroll down by 500px to see bundle selector & ATC
  await call('Runtime.evaluate', { expression: `window.scrollBy(0, 500)` });
  await new Promise(r => setTimeout(r, 1000));
  const shot1 = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\willa_pdp_buybox_390x844.png', Buffer.from(shot1.data, 'base64'));

  // Scroll down further by 600px to see if sticky bar appears
  await call('Runtime.evaluate', { expression: `window.scrollBy(0, 800)` });
  await new Promise(r => setTimeout(r, 1000));
  const shot2 = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\willa_pdp_sticky_390x844.png', Buffer.from(shot2.data, 'base64'));

  await fetch(`http://127.0.0.1:9222/json/close/${target.id}`);
  ws.close();
  console.log('Saved willa_pdp_buybox_390x844.png and willa_pdp_sticky_390x844.png');
}

inspectWillaPdpBelow().catch(console.error);
