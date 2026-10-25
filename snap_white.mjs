import fs from 'fs';

async function snap() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let idCounter = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      const handler = evt => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }
  await new Promise(r => ws.addEventListener('open', r));

  await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await new Promise(r => setTimeout(r, 600));

  // Click white button
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.willa-color-swatch-btn'));
      const whiteBtn = btns.find(b => b.innerText.includes('White'));
      if (whiteBtn) whiteBtn.click();
    })()`
  });

  await new Promise(r => setTimeout(r, 1200));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('live_white_check.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved live_white_check.png');

  const src = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: 'document.getElementById("willaPdpMainImg")?.src'
  });
  console.log('Current src:', src.result.value);

  ws.close();
}

snap().catch(console.error);
