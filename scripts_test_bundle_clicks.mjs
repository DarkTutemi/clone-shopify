async function testClick() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const pages = await res.json();
  const page = pages.find(p => p.url.includes('sakerplus-fence-post-repair-kit'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const i = id++;
    const h = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === i) {
        ws.removeEventListener('message', h);
        m.error ? reject(m.error) : resolve(m.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: i, method, params }));
  });

  // Click card 2
  await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll(".wf-bundle-card")[1].click();'
  });
  await new Promise(r => setTimeout(r, 500));
  const p2 = await send('Runtime.evaluate', {
    expression: '({ price: document.getElementById("willaPdpPrice").innerText, comp: document.getElementById("willaPdpComparePrice").innerText, variantId: willaCurrentPdpVariantId })',
    returnByValue: true
  });
  console.log('After clicking Card 2 (Buy 4):', p2.result.value);

  // Click card 3
  await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll(".wf-bundle-card")[2].click();'
  });
  await new Promise(r => setTimeout(r, 500));
  const p3 = await send('Runtime.evaluate', {
    expression: '({ price: document.getElementById("willaPdpPrice").innerText, comp: document.getElementById("willaPdpComparePrice").innerText, variantId: willaCurrentPdpVariantId })',
    returnByValue: true
  });
  console.log('After clicking Card 3 (Buy 6):', p3.result.value);

  // Click back to card 1
  await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll(".wf-bundle-card")[0].click();'
  });
  await new Promise(r => setTimeout(r, 500));
  const p1 = await send('Runtime.evaluate', {
    expression: '({ price: document.getElementById("willaPdpPrice").innerText, comp: document.getElementById("willaPdpComparePrice").innerText, variantId: willaCurrentPdpVariantId })',
    returnByValue: true
  });
  console.log('After clicking back to Card 1 (Buy 2):', p1.result.value);

  ws.close();
}
testClick().catch(console.error);
