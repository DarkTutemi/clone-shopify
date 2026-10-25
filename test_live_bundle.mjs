import fs from 'fs';

async function test() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!pageTab) {
    console.error('No page tab found on port 9222');
    return;
  }

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
  console.log('Connected to CDP. Navigating to CozyHeat PDP...');
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-cozyheat-heated-wearable-blanket-sweater' });
  await new Promise(r => setTimeout(r, 4000));

  const evalRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.wf-bundle-card')).map(c => ({
        text: c.innerText.replace(/\\n+/g, ' | '),
        active: c.classList.contains('active'),
        dataBundle: c.getAttribute('data-bundle-val')
      }));
      const colors = Array.from(document.querySelectorAll('.willa-color-swatch-btn')).map(b => ({
        text: b.innerText.trim(),
        active: b.classList.contains('active'),
        dataColor: b.getAttribute('data-color-val')
      }));
      return {
        cards,
        colors,
        currentVariantId: typeof willaCurrentPdpVariantId !== 'undefined' ? willaCurrentPdpVariantId : null,
        currentTierBundle: typeof willaCurrentTierBundle !== 'undefined' ? willaCurrentTierBundle : null,
        currentTierColor: typeof willaCurrentTierColor !== 'undefined' ? willaCurrentTierColor : null,
        priceText: document.getElementById('willaPdpPrice')?.innerText,
        colorLabel: document.getElementById('willaSelectedColorLabel')?.innerText
      };
    })()`
  });

  console.log('DOM & State Inspection:', JSON.stringify(evalRes.result.value, null, 2));

  // Now test clicking Buy 2:
  console.log('\n--- Testing Click on Buy 2 ---');
  const clickBuy2Res = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const cards = document.querySelectorAll('.wf-bundle-card');
      if (cards.length > 1) {
        cards[1].click();
      }
      return {
        newVariantId: willaCurrentPdpVariantId,
        newPrice: document.getElementById('willaPdpPrice')?.innerText,
        newTierBundle: willaCurrentTierBundle
      };
    })()`
  });
  console.log('After clicking Buy 2:', clickBuy2Res.result.value);

  // Now test clicking Green color swatch:
  console.log('\n--- Testing Click on Green color swatch ---');
  const clickGreenRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const swatches = Array.from(document.querySelectorAll('.willa-color-swatch-btn'));
      const greenBtn = swatches.find(b => b.innerText.includes('Green'));
      if (greenBtn) greenBtn.click();
      return {
        newVariantId: willaCurrentPdpVariantId,
        newColorLabel: document.getElementById('willaSelectedColorLabel')?.innerText,
        newTierColor: willaCurrentTierColor,
        mainImgSrc: document.getElementById('willaPdpMainImg')?.src
      };
    })()`
  });
  console.log('After clicking Green:', clickGreenRes.result.value);

  // Take screenshot of desktop
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1200,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('cozyheat_tiered_bundle_desktop.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved cozyheat_tiered_bundle_desktop.png');

  // Mobile screenshot
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 1000));
  const mobShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('cozyheat_tiered_bundle_mobile.png', Buffer.from(mobShot.data, 'base64'));
  console.log('Saved cozyheat_tiered_bundle_mobile.png');

  ws.close();
}

test().catch(console.error);
