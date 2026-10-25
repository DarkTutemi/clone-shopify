async function inspectDOMCards() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && t.url.includes('checkout-sakerplus-5-in-1-rotary-cheese-grater'));
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
        (() => {
          // find all elements inside Step 1 or product bundle container
          const allText = document.body.innerText;
          // look for radio labels or package items
          const items = Array.from(document.querySelectorAll('*'))
            .filter(el => el.children.length === 0 && (el.innerText.includes('White') || el.innerText.includes('Green') || el.innerText.includes('1 pc') || el.innerText.includes('2 pcs')))
            .map(el => {
              let parent = el.parentElement;
              while (parent && parent.innerText.length < 300) {
                parent = parent.parentElement;
              }
              return parent ? parent.innerText.trim().replace(/\\s+/g, ' ') : el.innerText;
            });

          return { uniqueCards: Array.from(new Set(items)) };
        })()
      `,
      returnByValue: true
    });
    console.log('DOM Card Texts:', JSON.stringify(res.result.value, null, 2));
    ws.close();
  });
}
inspectDOMCards().catch(console.error);
