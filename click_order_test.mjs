async function clickOrder() {
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

  const clickRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const allEls = Array.from(document.querySelectorAll('*'));
      const btn = allEls.find(e => e.innerText && e.innerText.trim() === 'Order Now & Save 50%');
      if (btn) {
        const tag = btn.tagName;
        const href = btn.getAttribute('href') || btn.closest('a')?.getAttribute('href');
        const onclick = btn.getAttribute('onclick');
        btn.click();
        return { found: true, tag, href, onclick };
      }
      return { found: false };
    })()`
  });
  console.log('Click result:', clickRes.result.value);

  // Wait 4 seconds to see if URL changes
  await new Promise(r => setTimeout(r, 4000));
  const newUrlRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: 'window.location.href'
  });
  console.log('Current URL after click:', newUrlRes.result.value);

  const titleRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: 'document.title'
  });
  console.log('Page title after click:', titleRes.result.value);

  ws.close();
}
clickOrder().catch(console.error);
