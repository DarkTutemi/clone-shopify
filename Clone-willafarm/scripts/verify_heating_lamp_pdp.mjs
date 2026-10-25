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

async function verifyWithCdp(viewport) {
  const url = 'https://tryzavelyn.com/products/sakerplus-livestock-heating-lamp';
  console.log(`Testing viewport ${viewport.name} (${viewport.width}x${viewport.height})...`);
  
  const newTargetRes = await fetch(`http://127.0.0.1:9222/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
  const target = await newTargetRes.json();

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  let msgId = 1;
  const call = (method, params) => sendCdp(ws, method, params, ++msgId);

  await call('Page.enable');
  await call('Runtime.enable');

  await call('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 2,
    mobile: viewport.mobile
  });

  if (viewport.mobile) {
    await call('Emulation.setUserAgentOverride', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
    });
  }

  await call('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 4500));

  // Check DOM elements and overflow
  const evalRes = await call('Runtime.evaluate', {
    expression: `(() => {
      const docWidth = document.documentElement.offsetWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const overflow = scrollWidth > docWidth;
      
      const title = document.querySelector('.wf-product-title')?.innerText || '';
      const bundles = document.querySelectorAll('.wf-bundle-card').length;
      const featCards = document.querySelectorAll('.wf-card-item').length;
      const splitSection = !!document.querySelector('.wf-split-story-section');
      const stepCards = document.querySelectorAll('.wf-step-card').length;
      const specCards = document.querySelectorAll('.wf-spec-card').length;
      const compRows = document.querySelectorAll('.wf-comparison-table tbody tr').length;
      const reviewCards = document.querySelectorAll('.wf-review-card').length;
      const faqItems = document.querySelectorAll('.wf-faq-item').length;
      const stickyBar = !!document.querySelector('.wf-sticky-buy-bar');

      return {
        docWidth,
        scrollWidth,
        overflow,
        title,
        bundles,
        featCards,
        splitSection,
        stepCards,
        specCards,
        compRows,
        reviewCards,
        faqItems,
        stickyBar
      };
    })()`,
    returnByValue: true
  });

  console.log(`  Report for ${viewport.name}:`, JSON.stringify(evalRes.result?.value, null, 2));

  // Capture screenshot of hero
  const shot1 = await call('Page.captureScreenshot', { format: 'png' });
  const outPath1 = `C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\pdp_${viewport.name}_hero.png`;
  fs.writeFileSync(outPath1, Buffer.from(shot1.data, 'base64'));

  // Scroll to feature section
  await call('Runtime.evaluate', { expression: `window.scrollBy(0, 1000)` });
  await new Promise(r => setTimeout(r, 800));
  const shot2 = await call('Page.captureScreenshot', { format: 'png' });
  const outPath2 = `C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\pdp_${viewport.name}_features.png`;
  fs.writeFileSync(outPath2, Buffer.from(shot2.data, 'base64'));

  await fetch(`http://127.0.0.1:9222/json/close/${target.id}`);
  ws.close();
}

async function main() {
  const viewports = [
    { name: 'mobile_390x844', width: 390, height: 844, mobile: true },
    { name: 'mobile_360x800', width: 360, height: 800, mobile: true },
    { name: 'desktop_1440x900', width: 1440, height: 900, mobile: false }
  ];

  for (const vp of viewports) {
    try {
      await verifyWithCdp(vp);
    } catch (e) {
      console.error(`Error on ${vp.name}:`, e.message);
    }
  }
  console.log('✔ Verification completed.');
}

main().catch(console.error);
