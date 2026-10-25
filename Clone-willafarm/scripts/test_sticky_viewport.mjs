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

async function testStickyWithInnerHeight() {
  const newTargetRes = await fetch('http://127.0.0.1:9222/json/new?https://tryzavelyn.com/products/sakerplus-fence-post-repair-kit', { method: 'PUT' });
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
  await call('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 3000));

  // Scroll down to 1600px
  await call('Runtime.evaluate', { expression: 'window.scrollTo(0, 1600); window.dispatchEvent(new Event("scroll"));' });
  await new Promise(r => setTimeout(r, 1000));

  const winSize = await call('Runtime.evaluate', {
    expression: '({ w: window.innerWidth, h: window.innerHeight, scrollY: window.scrollY })',
    returnByValue: true
  });
  console.log('Window metrics:', winSize.result.value);

  // Capture screenshot of the scrolled viewport
  const shot = await call('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: winSize.result.value.scrollY, width: winSize.result.value.w, height: winSize.result.value.h, scale: 2 }
  });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\sticky_perfect_shot.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved sticky_perfect_shot.png');

  await fetch('http://127.0.0.1:9222/json/close/' + target.id);
  ws.close();
}

testStickyWithInnerHeight().catch(console.error);
