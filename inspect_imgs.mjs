async function inspectImgs() {
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
    const res = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('.z-product-img')).map(img => ({
          src: img.src,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          width: img.width,
          height: img.height,
          display: getComputedStyle(img).display
        }))
      `,
      returnByValue: true
    });
    console.log(JSON.stringify(res.result.value, null, 2));
    ws.close();
  });
}
inspectImgs().catch(console.error);
