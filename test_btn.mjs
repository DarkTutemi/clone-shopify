async function checkBtn() {
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
  const res = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.willa-color-swatch-btn')).map(b => ({
        text: b.innerText.trim(),
        colorVal: b.getAttribute('data-color-val'),
        colorImg: b.getAttribute('data-color-img')
      }));
      const variants = typeof willaProductVariantsData !== 'undefined' ? willaProductVariantsData.map(v => ({
        id: v.id,
        opt1: v.option1,
        opt2: v.option2,
        featImg: v.featured_image
      })) : [];
      return { btns, variants };
    })()`
  });
  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
}
checkBtn().catch(console.error);
