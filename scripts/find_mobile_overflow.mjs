const tabsRes = await fetch('http://localhost:9222/json');
const tabs = await tabsRes.json();
const tab = tabs.find(t => t.type === 'page' && t.url && !t.url.includes('sandbox'));
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));

let id = 1;
const send = (method, params = {}) => new Promise((res, rej) => {
  const cur = id++;
  const h = (e) => {
    const m = JSON.parse(e.data.toString());
    if (m.id === cur) { ws.removeEventListener('message', h); res(m.result); }
  };
  ws.addEventListener('message', h);
  ws.send(JSON.stringify({ id: cur, method, params }));
});

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
const res = await send('Runtime.evaluate', {
  expression: `
    (() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const overflowing = [];
      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > winW + 5 || el.scrollWidth > winW + 5) {
          overflowing.push({
            tag: el.tagName,
            id: el.id,
            className: typeof el.className === 'string' ? el.className : '',
            right: Math.round(r.right),
            scrollWidth: el.scrollWidth,
            outerHTML: el.outerHTML.slice(0, 150)
          });
        }
      });
      return { docW, winW, count: overflowing.length, samples: overflowing.slice(0, 15) };
    })()
  `,
  returnByValue: true
});
console.log(JSON.stringify(res.result.value, null, 2));
ws.close();
