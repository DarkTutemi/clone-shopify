import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3';

async function captureDesktop() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  let tab = tabs.find(t => t.url && t.url.includes('tryzavelyn.com/products/')) || tabs.find(t => t.url && t.url.includes('tryzavelyn.com'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = msgId++;
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

  await new Promise(r => ws.addEventListener('open', r));

  console.log('Setting desktop 1440x1600...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1600,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll section exactly to top of viewport using window.scrollY + getBoundingClientRect().top
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector("#zv-doorstep-delivery");
      const box = el.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + box.top);
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));

  // Get viewport bounding rect
  const rEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector("#zv-doorstep-delivery");
      const r = el.getBoundingClientRect();
      return {
        x: Math.max(0, Math.floor(r.left)),
        y: Math.max(0, Math.floor(r.top)),
        width: Math.min(1440, Math.ceil(r.width)),
        height: Math.ceil(r.height)
      };
    })()`,
    returnByValue: true
  });
  console.log('Rect in viewport:', rEval.result.value);
  const r = rEval.result.value;

  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height,
      scale: 1
    }
  });

  const dest = `${ARTIFACT_DIR}/doorstep_delivery_desktop_1440.png`;
  fs.writeFileSync(dest, Buffer.from(shot.data, 'base64'));
  console.log(`Saved: ${dest} (${fs.statSync(dest).size} bytes)`);

  ws.close();
}
captureDesktop().catch(console.error);
