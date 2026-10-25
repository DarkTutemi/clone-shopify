async function findGlobalOverflow() {
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
    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 500));
    const res = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('*'))
          .filter(el => {
            const r = el.getBoundingClientRect();
            return r.right > 376;
          })
          .map(el => ({
            tag: el.tagName,
            cls: typeof el.className === 'string' ? el.className.substring(0, 50) : '',
            id: el.id,
            scrollWidth: el.scrollWidth,
            right: el.getBoundingClientRect().right
          })).slice(0, 15)
      `,
      returnByValue: true
    });
    console.log(JSON.stringify(res.result.value, null, 2));
    await send('Emulation.clearDeviceMetricsOverride');
    ws.close();
  });
}
findGlobalOverflow().catch(console.error);
