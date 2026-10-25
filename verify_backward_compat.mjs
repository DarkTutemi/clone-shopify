async function test() {
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

  // Nebulizer
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-portable-ultrasonic-mesh-nebulizer' });
  await new Promise(r => setTimeout(r, 3000));
  const nebRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: "Array.from(document.querySelectorAll('.wf-bundle-card')).map(c => c.innerText.replace(/\\n+/g, ' | '))"
  });
  console.log('Nebulizer bundle cards:', nebRes.result.value);

  // Leaf blower
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/saker-cordless-turbo-leaf-blower' });
  await new Promise(r => setTimeout(r, 3000));
  const blowerRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: "Array.from(document.querySelectorAll('.wf-bundle-card')).map(c => c.innerText.replace(/\\n+/g, ' | '))"
  });
  console.log('Leaf Blower bundle cards:', blowerRes.result.value);

  ws.close();
}
test().catch(console.error);
