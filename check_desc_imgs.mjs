async function checkDescImgs() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && t.url.includes('saker-cordless-turbo-leaf-blower'));
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
        Array.from(document.querySelectorAll('.zavelyn-blower-desc img')).map(img => ({
          src: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete
        }))
      `,
      returnByValue: true
    });
    console.log('Desc images count:', res.result.value?.length);
    console.log('Desc images:', res.result.value);
    ws.close();
  });
}
checkDescImgs().catch(console.error);
