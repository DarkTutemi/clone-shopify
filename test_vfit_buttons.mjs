async function checkVfitBtns() {
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
        val: b.getAttribute('data-color-val'),
        img: b.getAttribute('data-color-img'),
        onclick: b.getAttribute('onclick')
      }));
      return btns;
    })()`
  });
  console.log('Buttons:', JSON.stringify(res.result.value, null, 2));

  // Now click the second button and see what happens to willaPdpMainImg
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = document.querySelectorAll('.willa-color-swatch-btn');
      if (btns.length > 1) btns[1].click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const afterClick = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const main = document.getElementById('willaPdpMainImg');
      return {
        mainSrc: main?.src,
        mainOpacity: main?.style.opacity,
        tierColor: willaCurrentTierColor,
        variantId: willaCurrentPdpVariantId
      };
    })()`
  });
  console.log('After click:', JSON.stringify(afterClick.result.value, null, 2));

  ws.close();
}
checkVfitBtns().catch(console.error);
