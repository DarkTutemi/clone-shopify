import fs from 'fs';

fs.mkdirSync('Clone-thoson/reports', { recursive: true });

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
  console.log('Connecting to Chrome CDP...');
  const newTargetRes = await fetch('http://127.0.0.1:9222/json/new?https://tryzavelyn.com/products/thoson-magtrack', { method: 'PUT' });
  const target = await newTargetRes.json();

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const call = (method, params) => sendCdp(ws, method, params, ++id);

  await call('Page.enable');
  await call('Runtime.enable');
  await call('DOM.enable');

  await call('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 3500));

  // Check gallery elements
  const check = await call('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const gallery = document.querySelector('.thoson-gallery-container');
      const stage = document.querySelector('.thoson-main-stage');
      const prevBtn = document.querySelector('.thoson-prev-btn');
      const nextBtn = document.querySelector('.thoson-next-btn');
      const thumbs = document.querySelectorAll('.thoson-thumb-card');
      const badge = document.querySelector('.thoson-slide-badge');
      const activeImg = document.querySelector('#thosonActiveImg');

      return {
        galleryFound: !!gallery,
        stageFound: !!stage,
        prevBtnFound: !!prevBtn,
        nextBtnFound: !!nextBtn,
        thumbsCount: thumbs.length,
        currentBadge: badge ? badge.textContent : null,
        activeImgSrc: activeImg ? activeImg.src : null
      };
    })()`
  });
  console.log('Initial Gallery State:', check.result.value);

  // Test Next Slide click
  await call('Runtime.evaluate', { expression: `window.thosonNextSlide()` });
  await new Promise(r => setTimeout(r, 500));

  const afterNext = await call('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => ({
      badge: document.querySelector('.thoson-slide-badge') ? document.querySelector('.thoson-slide-badge').textContent : null,
      activeThumbIndex: Array.from(document.querySelectorAll('.thoson-thumb-card')).findIndex(t => t.classList.contains('active')),
      activeImgSrc: document.querySelector('#thosonActiveImg') ? document.querySelector('#thosonActiveImg').src : null
    }))()`
  });
  console.log('After Next Slide:', afterNext.result.value);

  // Capture Desktop Screenshot
  const shotDesktop = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('Clone-thoson/reports/gallery_desktop.png', Buffer.from(shotDesktop.data, 'base64'));
  console.log('✔ Saved desktop screenshot: Clone-thoson/reports/gallery_desktop.png');

  // Set Mobile View 390x844
  await call('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await call('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 3000));

  const shotMobile = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('Clone-thoson/reports/gallery_mobile.png', Buffer.from(shotMobile.data, 'base64'));
  console.log('✔ Saved mobile screenshot: Clone-thoson/reports/gallery_mobile.png');

  await call('Target.closeTarget', { targetId: target.id });
  ws.close();
}

main().catch(console.error);
