import fs from 'fs';

async function inspectDoughMixer() {
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
  console.log('Connected to CDP. Navigating to live Zavelyn Dough Mixer PDP...');

  const liveUrl = 'https://tryzavelyn.com/products/zavelyn-automatic-dough-mixer-with-ferment-function';
  await send('Page.navigate', { url: liveUrl });
  await new Promise(r => setTimeout(r, 4500));

  // Set desktop viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1200,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Initial State inspection
  const initialState = await send('Runtime.evaluate', {
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
        title: document.querySelector('h1')?.innerText,
        price: document.getElementById('willaPdpPrice')?.innerText,
        comparePrice: document.getElementById('willaPdpComparePrice')?.innerText,
        cards,
        colors,
        currentVariantId: typeof willaCurrentPdpVariantId !== 'undefined' ? willaCurrentPdpVariantId : null,
        currentTierBundle: typeof willaCurrentTierBundle !== 'undefined' ? willaCurrentTierBundle : null,
        currentTierColor: typeof willaCurrentTierColor !== 'undefined' ? willaCurrentTierColor : null,
        mainImgSrc: document.getElementById('willaPdpMainImg')?.src
      };
    })()`
  });
  console.log('--- Initial State ---');
  console.log(JSON.stringify(initialState.result.value, null, 2));

  // Capture Desktop Hero
  const heroShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('dough_mixer_desktop_hero.png', Buffer.from(heroShot.data, 'base64'));
  console.log('Saved dough_mixer_desktop_hero.png');

  // 2. Test Clicking Buy 2
  console.log('\n--- Testing Click on Buy 2 ---');
  const clickBuy2Res = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const cards = document.querySelectorAll('.wf-bundle-card');
      if (cards.length > 1) cards[1].click();
      return {
        price: document.getElementById('willaPdpPrice')?.innerText,
        comparePrice: document.getElementById('willaPdpComparePrice')?.innerText,
        variantId: willaCurrentPdpVariantId,
        tierBundle: willaCurrentTierBundle
      };
    })()`
  });
  console.log('After clicking Buy 2:', clickBuy2Res.result.value);

  // 3. Test Clicking Modern White Swatch
  console.log('\n--- Testing Click on Modern White Color Swatch ---');
  const clickWhiteRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.willa-color-swatch-btn'));
      const whiteBtn = btns.find(b => b.innerText.includes('White'));
      if (whiteBtn) whiteBtn.click();
      return {
        colorLabel: document.getElementById('willaSelectedColorLabel')?.innerText,
        variantId: willaCurrentPdpVariantId,
        tierColor: willaCurrentTierColor
      };
    })()`
  });
  console.log('After clicking Modern White:', clickWhiteRes.result.value);

  // Wait 400ms for image opacity transition
  await new Promise(r => setTimeout(r, 600));
  const whiteImgSrcRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: "document.getElementById('willaPdpMainImg')?.src"
  });
  console.log('Updated Hero Main Image Src:', whiteImgSrcRes.result.value);

  const whiteSelectShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('dough_mixer_white_selected.png', Buffer.from(whiteSelectShot.data, 'base64'));
  console.log('Saved dough_mixer_white_selected.png');

  // 4. Scroll down to capture Advertorial Description
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 1150);' });
  await new Promise(r => setTimeout(r, 1200));
  const descShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('dough_mixer_desktop_advertorial.png', Buffer.from(descShot.data, 'base64'));
  console.log('Saved dough_mixer_desktop_advertorial.png');

  // Scroll down more to capture Tech Specs & Reviews
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 1600);' });
  await new Promise(r => setTimeout(r, 1200));
  const specsShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('dough_mixer_desktop_specs_reviews.png', Buffer.from(specsShot.data, 'base64'));
  console.log('Saved dough_mixer_desktop_specs_reviews.png');

  // 5. Mobile Viewport (iPhone 14 / 390x844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
  await new Promise(r => setTimeout(r, 1000));
  const mobHeroShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('dough_mixer_mobile_hero.png', Buffer.from(mobHeroShot.data, 'base64'));
  console.log('Saved dough_mixer_mobile_hero.png');

  // Scroll mobile to bundle selector
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 650);' });
  await new Promise(r => setTimeout(r, 800));
  const mobBundleShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('dough_mixer_mobile_bundle.png', Buffer.from(mobBundleShot.data, 'base64'));
  console.log('Saved dough_mixer_mobile_bundle.png');

  ws.close();
  console.log('✨ All inspections and screenshot captures complete!');
}

inspectDoughMixer().catch(console.error);
