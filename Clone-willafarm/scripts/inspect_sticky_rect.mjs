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

async function inspectSticky() {
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

  await call('Runtime.evaluate', { expression: 'window.scrollTo(0, 1500); window.dispatchEvent(new Event("scroll"));' });
  await new Promise(r => setTimeout(r, 1000));

  const debug = await call('Runtime.evaluate', {
    expression: `(() => {
      const s = document.getElementById("willaStickyAtc");
      if (!s) return "no sticky element";
      const style = window.getComputedStyle(s);
      const r = s.getBoundingClientRect();
      return {
        className: s.className,
        rect: { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height },
        position: style.position,
        bottom: style.bottom,
        zIndex: style.zIndex,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        transform: style.transform
      };
    })()`,
    returnByValue: true
  });
  console.log('Sticky element debug:', JSON.stringify(debug.result.value, null, 2));

  // Capture screenshot of the sticky element specifically
  const shotClip = await call('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: debug.result.value.rect.top, width: debug.result.value.rect.width, height: debug.result.value.rect.height, scale: 2 }
  });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\sticky_bar_clipped.png', Buffer.from(shotClip.data, 'base64'));
  console.log('Saved sticky_bar_clipped.png');

  await fetch('http://127.0.0.1:9222/json/close/' + target.id);
  ws.close();
}

inspectSticky().catch(console.error);
