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

async function captureWillaRef() {
  console.log('Capturing Willa Farms mobile reference at 390x844...');
  const newTargetRes = await fetch('http://127.0.0.1:9222/json/new?https://willafarm.com/', { method: 'PUT' });
  const target = await newTargetRes.json();

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  let msgId = 1;
  const call = (method, params) => sendCdp(ws, method, params, ++msgId);

  await call('Page.enable');
  await call('Runtime.enable');

  await call('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await call('Emulation.setUserAgentOverride', {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });

  await call('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 4000));

  // Take screenshot of Willa Farms homepage
  const shotHome = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\willa_home_390x844.png', Buffer.from(shotHome.data, 'base64'));
  console.log('Saved willa_home_390x844.png');

  // Check metrics on Willa Farms
  const evalWilla = await call('Runtime.evaluate', {
    expression: `(() => {
      return {
        announcementText: document.querySelector('.announcement-bar, [class*="announcement"]')?.innerText?.trim(),
        headerHeight: document.querySelector('header, .header')?.offsetHeight,
        h1Text: document.querySelector('h1')?.innerText?.trim(),
        primaryCtaText: document.querySelector('a.button, a.btn, [class*="cta"], [class*="button"]')?.innerText?.trim()
      };
    })()`,
    returnByValue: true
  });
  console.log('Willa Farms metrics:', evalWilla.result.value);

  // Navigate to Willa collection / PDP
  console.log('Navigating to Willa collections/all...');
  await call('Page.navigate', { url: 'https://willafarm.com/collections/all' });
  await new Promise(r => setTimeout(r, 4000));
  const shotCol = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\willa_col_390x844.png', Buffer.from(shotCol.data, 'base64'));
  console.log('Saved willa_col_390x844.png');

  // Navigate to Willa first product
  const firstProdUrl = await call('Runtime.evaluate', {
    expression: `document.querySelector('a[href*="/products/"]')?.href`,
    returnByValue: true
  });
  console.log('First Willa product URL:', firstProdUrl.result.value);
  if (firstProdUrl.result.value) {
    await call('Page.navigate', { url: firstProdUrl.result.value });
    await new Promise(r => setTimeout(r, 4000));
    const shotPdp = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\willa_pdp_390x844.png', Buffer.from(shotPdp.data, 'base64'));
    console.log('Saved willa_pdp_390x844.png');
  }

  await fetch(`http://127.0.0.1:9222/json/close/${target.id}`);
  ws.close();
}

captureWillaRef().catch(console.error);
