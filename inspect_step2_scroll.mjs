import fs from 'fs';

async function inspectStep2Sections() {
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

  // Get total height of step 2
  const heightRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: 'document.body.scrollHeight'
  });
  const totalHeight = heightRes.result.value;
  console.log('Total height of Step 2 page:', totalHeight);

  // Take multiple scroll screenshots down the page to find where the checkout / offer box is
  for (let scrollY = 1000; scrollY < totalHeight; scrollY += 2000) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY})` });
    await new Promise(r => setTimeout(r, 600));
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`step2_scroll_${scrollY}.png`, Buffer.from(shot.data, 'base64'));
    console.log(`Saved step2_scroll_${scrollY}.png`);
  }

  // Find all buttons, links, form inputs on the page
  const buyElements = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const buttons = Array.from(document.querySelectorAll('button, a.btn, a[href*="checkout"], a[href*="cart"], .button')).map(b => ({
        tag: b.tagName,
        text: b.innerText.trim(),
        href: b.href || '',
        class: b.className
      })).filter(b => b.text.length > 0 && b.text.length < 100);

      const forms = Array.from(document.querySelectorAll('form')).map(f => ({
        action: f.action,
        method: f.method,
        inputs: Array.from(f.querySelectorAll('input, select')).map(i => ({ name: i.name, value: i.value, type: i.type }))
      }));

      return { buttons, forms };
    })()`
  });
  console.log('Buy elements found:', JSON.stringify(buyElements.result.value, null, 2));

  ws.close();
}

inspectStep2Sections().catch(console.error);
