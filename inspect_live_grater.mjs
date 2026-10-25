import fs from 'fs';

async function inspectLivePdp() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!pageTab) {
    console.error('No page tab found on 9222');
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
  console.log('Connected to CDP. Navigating to live PDP...');

  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-5-in-1-rotary-cheese-grater-shredder' });
  await new Promise(r => setTimeout(r, 4000));

  // Set viewport desktop
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1200,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));

  // Screenshot hero
  const heroShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('grater_pdp_desktop_hero.png', Buffer.from(heroShot.data, 'base64'));
  console.log('Saved grater_pdp_desktop_hero.png');

  // Click on "White (2 pcs) - Best Seller" variant chip
  console.log('Testing variant switch to 2 pcs...');
  const clickRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const labels = Array.from(document.querySelectorAll('label, button, input')).filter(el => 
          (el.innerText && el.innerText.includes('White (2 pcs)')) || (el.value && el.value.includes('White (2 pcs)'))
        );
        if (labels.length > 0) {
          labels[0].click();
          return 'Clicked: ' + (labels[0].innerText || labels[0].value);
        }
        return 'Not found';
      })()
    `,
    returnByValue: true
  });
  console.log('Variant click result:', clickRes.result.value);

  await new Promise(r => setTimeout(r, 1500));
  const variantShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('grater_pdp_desktop_variant_clicked.png', Buffer.from(variantShot.data, 'base64'));
  console.log('Saved grater_pdp_desktop_variant_clicked.png');

  // Scroll down to check advertorial description
  await send('Runtime.evaluate', {
    expression: 'window.scrollBy(0, 1100);'
  });
  await new Promise(r => setTimeout(r, 1500));
  const descShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('grater_pdp_desktop_description.png', Buffer.from(descShot.data, 'base64'));
  console.log('Saved grater_pdp_desktop_description.png');

  // Test mobile viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
  await new Promise(r => setTimeout(r, 1500));
  const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('grater_pdp_mobile_hero.png', Buffer.from(mobileShot.data, 'base64'));
  console.log('Saved grater_pdp_mobile_hero.png');

  ws.close();
  console.log('Inspection complete!');
}

inspectLivePdp().catch(console.error);
