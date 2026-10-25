import fs from 'fs';
import path from 'path';

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

async function testCdpMobile() {
  console.log('Connecting to Chrome CDP on 127.0.0.1:9222...');
  const newTargetRes = await fetch('http://127.0.0.1:9222/json/new?https://tryzavelyn.com/', { method: 'PUT' });
  const target = await newTargetRes.json();
  console.log('Created tab:', target.id, target.webSocketDebuggerUrl);

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  let msgId = 1;
  const call = (method, params) => sendCdp(ws, method, params, ++msgId);

  await call('Page.enable');
  await call('Runtime.enable');
  await call('DOM.enable');

  // Set iPhone 13/14 390x844 mobile emulation
  console.log('Setting device metrics override: 390x844, mobile=true...');
  await call('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await call('Emulation.setUserAgentOverride', {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });

  // Reload to ensure mobile rendering
  await call('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 3000));

  // Check metrics in DOM
  const evalRes = await call('Runtime.evaluate', {
    expression: `(() => {
      const header = document.querySelector('.willa-header-wrap');
      const ann = document.querySelector('.willa-announcement-bar');
      const title = document.querySelector('.willa-hero-title');
      const cta = document.querySelector('.willa-btn-primary');
      const menuBtn = document.querySelector('.willa-menu-btn');
      const desktopNav = document.querySelector('.willa-desktop-nav');
      
      const getB = el => el ? el.getBoundingClientRect() : null;
      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        headerHeight: header ? header.offsetHeight : null,
        annHeight: ann ? ann.offsetHeight : null,
        titleTop: title ? getB(title).top : null,
        ctaTop: cta ? getB(cta).top : null,
        ctaBottom: cta ? getB(cta).bottom : null,
        menuBtnVisible: menuBtn ? window.getComputedStyle(menuBtn).display !== 'none' : false,
        desktopNavVisible: desktopNav ? window.getComputedStyle(desktopNav).display !== 'none' : false,
        isCtaAboveFold: cta ? getB(cta).bottom <= 844 : false
      };
    })()`,
    returnByValue: true
  });

  console.log('DOM Evaluation Result at 390x844:');
  console.log(JSON.stringify(evalRes.result.value, null, 2));

  // Take screenshot
  const shot = await call('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\test_mobile_390x844.png';
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log(`Saved screenshot to ${outPath}`);

  // Close tab
  await fetch(`http://127.0.0.1:9222/json/close/${target.id}`);
  ws.close();
}

testCdpMobile().catch(console.error);
