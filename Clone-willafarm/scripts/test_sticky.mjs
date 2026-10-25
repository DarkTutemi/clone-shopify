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

async function testSticky() {
  const newTargetRes = await fetch('http://127.0.0.1:9222/json/new?https://tryzavelyn.com/products/sakerplus-fence-post-repair-kit', { method: 'PUT' });
  const target = await newTargetRes.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  let msgId = 1;
  const call = (method, params) => sendCdp(ws, method, params, ++msgId);

  await call('Page.enable');
  await call('Runtime.enable');
  await call('DOM.enable');

  await call('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await call('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 3000));

  const atcPosBefore = await call('Runtime.evaluate', {
    expression: `(() => {
      const b = document.getElementById("willaPdpAtcBtn");
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, scrollY: window.scrollY };
    })()`,
    returnByValue: true
  });
  console.log('Main ATC position before scroll:', atcPosBefore.result.value);

  // Scroll down by 1500px
  console.log('Scrolling down by 1500px...');
  await call('Runtime.evaluate', { expression: `window.scrollBy(0, 1500); window.dispatchEvent(new Event('scroll'));` });
  await new Promise(r => setTimeout(r, 1000));

  const atcPosAfter = await call('Runtime.evaluate', {
    expression: `(() => {
      const b = document.getElementById("willaPdpAtcBtn");
      if (!b) return null;
      const r = b.getBoundingClientRect();
      const s = document.getElementById("willaStickyAtc");
      return {
        top: r.top,
        bottom: r.bottom,
        scrollY: window.scrollY,
        isStickyVisible: s ? s.classList.contains('visible') : false,
        stickyTransform: s ? window.getComputedStyle(s).transform : null,
        stickyOpacity: s ? window.getComputedStyle(s).opacity : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Main ATC & Sticky Bar position after scroll:', atcPosAfter.result.value);

  const shot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\test_sticky_revealed.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_sticky_revealed.png');

  await fetch('http://127.0.0.1:9222/json/close/' + target.id);
  ws.close();
}

testSticky().catch(console.error);
