import fs from 'fs';

async function sendCdp(ws, method, params = {}, id = 1) {
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  const newTargetRes = await fetch('http://127.0.0.1:9222/json/new?https://tryzavelyn.com/', { method: 'PUT' });
  const target = await newTargetRes.json();

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const call = (method, params) => sendCdp(ws, method, params, ++id);

  await call('Page.enable');
  await call('Runtime.enable');
  await call('DOM.enable');

  await call('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 3000));

  // Check desktop nav links
  const desktopLinks = await call('Runtime.evaluate', {
    returnByValue: true,
    expression: `Array.from(document.querySelectorAll('.willa-desktop-nav a')).map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))`
  });
  console.log('Desktop Nav Links:', desktopLinks.result.value);

  // Check drawer menu links
  const drawerLinks = await call('Runtime.evaluate', {
    returnByValue: true,
    expression: `Array.from(document.querySelectorAll('.willa-drawer-menu a')).map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))`
  });
  console.log('Mobile Drawer Menu Links:', drawerLinks.result.value);

  // Capture desktop header screenshot
  const headerShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('Clone-willafarm/reports/menu_desktop_verified.png', Buffer.from(headerShot.data, 'base64'));
  console.log('✔ Saved header screenshot: Clone-willafarm/reports/menu_desktop_verified.png');

  // Open drawer menu on mobile
  await call('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await call('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 2500));

  // Click hamburger button to open drawer
  await call('Runtime.evaluate', { expression: `window.toggleWillaDrawer()` });
  await new Promise(r => setTimeout(r, 800));

  const drawerShot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('Clone-willafarm/reports/menu_drawer_mobile_verified.png', Buffer.from(drawerShot.data, 'base64'));
  console.log('✔ Saved mobile drawer screenshot: Clone-willafarm/reports/menu_drawer_mobile_verified.png');

  await call('Target.closeTarget', { targetId: target.id });
  ws.close();
}

main().catch(console.error);
