async function test() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && t.url.includes('thoson-magtrack'));
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
    // 1. Check default values
    let evalRes = await send('Runtime.evaluate', {
      expression: '({ variantId: wfSelectedVariantId, price: wfSelectedPrice, qty: wfCurrentQty, subtotal: document.getElementById("wf-total-display").textContent })',
      returnByValue: true
    });
    console.log('Default state:', evalRes.result.value);

    // 2. Click PRO bundle
    await send('Runtime.evaluate', { expression: 'document.getElementById("wf-bundle-2").click();' });
    evalRes = await send('Runtime.evaluate', {
      expression: '({ variantId: wfSelectedVariantId, price: wfSelectedPrice, subtotal: document.getElementById("wf-total-display").textContent, stickyPrice: document.getElementById("wf-sticky-price-val").textContent })',
      returnByValue: true
    });
    console.log('After selecting PRO bundle:', evalRes.result.value);

    // 3. Click Rookie bundle
    await send('Runtime.evaluate', { expression: 'document.getElementById("wf-bundle-1").click();' });
    evalRes = await send('Runtime.evaluate', {
      expression: '({ variantId: wfSelectedVariantId, price: wfSelectedPrice, subtotal: document.getElementById("wf-total-display").textContent, stickyPrice: document.getElementById("wf-sticky-price-val").textContent })',
      returnByValue: true
    });
    console.log('After selecting Rookie bundle:', evalRes.result.value);

    // 4. Change Qty to 2
    await send('Runtime.evaluate', { expression: 'changeWfQty(1);' });
    evalRes = await send('Runtime.evaluate', {
      expression: '({ qty: wfCurrentQty, subtotal: document.getElementById("wf-total-display").textContent })',
      returnByValue: true
    });
    console.log('After Qty + 1:', evalRes.result.value);

    // 5. Select Master kit back
    await send('Runtime.evaluate', { expression: 'document.getElementById("wf-bundle-3").click();' });
    evalRes = await send('Runtime.evaluate', {
      expression: '({ variantId: wfSelectedVariantId, price: wfSelectedPrice, subtotal: document.getElementById("wf-total-display").textContent })',
      returnByValue: true
    });
    console.log('After resetting to Master kit:', evalRes.result.value);

    ws.close();
  });
}
test().catch(console.error);
