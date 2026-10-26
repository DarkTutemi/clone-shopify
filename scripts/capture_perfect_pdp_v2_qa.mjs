import fs from 'fs';

const OUT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3';

async function getWsConnection() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.type === 'page' && t.url && !t.url.includes('sandbox') && !t.url.includes('preview-bar'));
  if (!tab) throw new Error('No suitable tab found');
  console.log(`Using tab: ${tab.title} (${tab.url})`);

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) => {
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
  };

  await new Promise(r => ws.addEventListener('open', r));
  return { ws, send };
}

async function captureProductViewports(send, handle, namePrefix, hasTablet = false) {
  const targetUrl = `https://tryzavelyn.com/products/${encodeURIComponent(handle)}?preview_theme_id=187597717689`;
  console.log(`\n======================================================`);
  console.log(`Navigating to ${handle}...`);
  await send('Page.navigate', { url: targetUrl });
  await new Promise(r => setTimeout(r, 4500));

  // Hide cart drawer and sticky preview bar if blocking
  await send('Runtime.evaluate', {
    expression: `
      document.querySelectorAll('.willa-cart-drawer, .shopify-preview-bar').forEach(el => el.style.display = 'none');
    `
  });

  // 1. DESKTOP 1440px
  console.log(`Capturing Desktop 1440px for ${namePrefix}...`);
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  // Scroll to show body sections
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 1100);` });
  await new Promise(r => setTimeout(r, 1000));
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  const desktopFile = `${OUT_DIR}/${namePrefix}_desktop_1440.png`;
  fs.writeFileSync(desktopFile, Buffer.from(shot.data, 'base64'));
  console.log(`✔ Saved: ${desktopFile}`);

  // 2. TABLET 768px (optional)
  if (hasTablet) {
    console.log(`Capturing Tablet 768px for ${namePrefix}...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 1200);` });
    await new Promise(r => setTimeout(r, 1000));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    const tabletFile = `${OUT_DIR}/${namePrefix}_tablet_768.png`;
    fs.writeFileSync(tabletFile, Buffer.from(shot.data, 'base64'));
    console.log(`✔ Saved: ${tabletFile}`);
  }

  // 3. MOBILE 390px
  console.log(`Capturing Mobile 390px for ${namePrefix}...`);
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 1600);` });
  await new Promise(r => setTimeout(r, 1000));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  const mobileFile = `${OUT_DIR}/${namePrefix}_mobile_390.png`;
  fs.writeFileSync(mobileFile, Buffer.from(shot.data, 'base64'));
  console.log(`✔ Saved: ${mobileFile}`);
}

async function main() {
  const { ws, send } = await getWsConnection();

  try {
    // Product 1: Diesel Injector Removal Kit
    await captureProductViewports(send, 'sakerplus®-universal-diesel-injector-removal-kit-clearance-sale', 'diesel_pdp_v2');

    // Product 2: ThermoGlove
    await captureProductViewports(send, 'zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves', 'thermoglove_pdp_v2');

    // Product 3: 5-in-1 Rotary Cheese Grater (with tablet)
    await captureProductViewports(send, 'zavelyn-5-in-1-rotary-cheese-grater-shredder', 'cheese_grater_pdp_v2', true);

    console.log(`\n======================================================`);
    console.log(`🎉 ALL VISUAL QA SCREENSHOTS CAPTURED SUCCESSFULLY!`);
    console.log(`======================================================`);
  } finally {
    // Reset emulation
    await send('Emulation.clearDeviceMetricsOverride');
    ws.close();
  }
}

main().catch(err => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
