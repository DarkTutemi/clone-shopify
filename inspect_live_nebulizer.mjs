import fs from 'fs';

async function inspectLiveNebulizer() {
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
  console.log('Connected to CDP. Navigating to live Zavelyn Nebulizer PDP...');

  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-portable-ultrasonic-mesh-nebulizer' });
  await new Promise(r => setTimeout(r, 4000));

  // Desktop view
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1200,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));

  const heroShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('nebulizer_pdp_desktop_hero.png', Buffer.from(heroShot.data, 'base64'));
  console.log('Saved nebulizer_pdp_desktop_hero.png');

  // Scroll down to check advertorial description
  await send('Runtime.evaluate', {
    expression: 'window.scrollBy(0, 1050);'
  });
  await new Promise(r => setTimeout(r, 1500));
  const descShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('nebulizer_pdp_desktop_description.png', Buffer.from(descShot.data, 'base64'));
  console.log('Saved nebulizer_pdp_desktop_description.png');

  // Mobile viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
  await new Promise(r => setTimeout(r, 1500));
  const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('nebulizer_pdp_mobile_hero.png', Buffer.from(mobileShot.data, 'base64'));
  console.log('Saved nebulizer_pdp_mobile_hero.png');

  ws.close();
  console.log('Inspection complete!');
}

inspectLiveNebulizer().catch(console.error);
