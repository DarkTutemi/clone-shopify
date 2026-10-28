import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3';
const PREVIEW_URL = 'https://tryzavelyn.com/products/zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves?preview_theme_id=187597717689';

async function runQA() {
  console.log("Connecting to Chrome CDP on port 9222...");
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  let tab = tabs.find(t => t.url && t.url.includes('tryzavelyn.com/products/'));
  if (!tab) {
    tab = tabs.find(t => t.url && t.url.includes('tryzavelyn.com'));
  }
  if (!tab) {
    throw new Error("No tryzavelyn tab found in Chrome!");
  }

  console.log(`Using tab [${tab.id}]: ${tab.title} (${tab.url})`);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = msgId++;
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
  }

  await new Promise(r => ws.addEventListener('open', r));
  console.log("✔ Connected to WebSocket debugger");

  // 1. Navigate to Draft Preview PDP
  console.log(`Navigating to Draft Preview URL: ${PREVIEW_URL}`);
  await send('Page.navigate', { url: PREVIEW_URL });
  await new Promise(r => setTimeout(r, 4500));

  // =========================================================================
  // 2. DESKTOP 1440px QA
  // =========================================================================
  console.log("\n--- DESKTOP 1440px QA ---");
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));

  const desktopEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const section = document.querySelector('#zv-doorstep-delivery');
      if (!section) return { error: '#zv-doorstep-delivery section not found!' };

      const rect = section.getBoundingClientRect();
      const imgs = Array.from(section.querySelectorAll('.zv-delivery-img'));
      const header = section.querySelector('.zv-delivery-header');
      const media = section.querySelector('.zv-delivery-media-col');
      const cardsGrid = section.querySelector('.zv-delivery-cards-grid');
      const cards = Array.from(section.querySelectorAll('.zv-trust-card'));
      const badge = section.querySelector('.zv-badge');
      const title = section.querySelector('.zv-delivery-title');
      const desc = section.querySelector('.zv-delivery-desc');

      const imgData = imgs.map(img => ({
        src: img.currentSrc || img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        clientWidth: img.clientWidth,
        clientHeight: img.clientHeight
      }));

      const layout = section.querySelector('.zv-delivery-layout');
      const layoutStyle = window.getComputedStyle(layout);

      const cardsData = cards.map(c => ({
        title: c.querySelector('.zv-trust-card-title')?.textContent?.trim(),
        desc: c.querySelector('.zv-trust-card-desc')?.textContent?.trim(),
        icon: c.querySelector('.zv-trust-card-icon')?.textContent?.trim()
      }));

      return {
        sectionExists: true,
        rect: { top: rect.top + window.scrollY, height: rect.height, width: rect.width },
        layoutDisplay: layoutStyle.display,
        layoutGridCols: layoutStyle.gridTemplateColumns,
        badgeText: badge?.textContent?.trim(),
        titleText: title?.textContent?.trim(),
        descText: desc?.textContent?.trim(),
        imagesCount: imgs.length,
        imgData,
        cardsCount: cards.length,
        cardsData,
        has60DayPolicy: JSON.stringify(cardsData).includes('60-day')
      };
    })()`,
    returnByValue: true
  });

  console.log("Desktop Evaluation Result:", JSON.stringify(desktopEval.result.value, null, 2));

  // Scroll section into view for screenshot
  await send('Runtime.evaluate', {
    expression: `document.querySelector('#zv-doorstep-delivery')?.scrollIntoView({ behavior: 'instant', block: 'center' });`
  });
  await new Promise(r => setTimeout(r, 1200));

  // Capture desktop screenshot of the section with clip
  const clipEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('#zv-doorstep-delivery');
      const r = el.getBoundingClientRect();
      return { x: 0, y: Math.max(0, r.top + window.scrollY - 30), width: 1440, height: r.height + 60 };
    })()`,
    returnByValue: true
  });
  const clip = clipEval.result.value;

  const desktopShot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: clip.x,
      y: clip.y,
      width: clip.width,
      height: clip.height,
      scale: 1
    }
  });

  const desktopImgPath = `${ARTIFACT_DIR}/doorstep_delivery_desktop_1440.png`;
  fs.writeFileSync(desktopImgPath, Buffer.from(desktopShot.data, 'base64'));
  console.log(`✔ Saved Desktop 1440px screenshot: ${desktopImgPath}`);

  // =========================================================================
  // 3. MOBILE 390px QA (iPhone 14/15/16 metrics)
  // =========================================================================
  console.log("\n--- MOBILE 390px QA ---");
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 1000));

  const mobileEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const section = document.querySelector('#zv-doorstep-delivery');
      if (!section) return { error: 'Section not found' };

      const header = section.querySelector('.zv-delivery-header');
      const media = section.querySelector('.zv-delivery-media-col');
      const cards = section.querySelector('.zv-delivery-cards-grid');

      const headerRect = header.getBoundingClientRect();
      const mediaRect = media.getBoundingClientRect();
      const cardsRect = cards.getBoundingClientRect();

      // Check vertical ordering: header above media, media above cards
      const correctOrder = (headerRect.top < mediaRect.top) && (mediaRect.top < cardsRect.top);

      // Check horizontal overflow
      const docWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const sectionScrollWidth = section.scrollWidth;
      const noOverflow = scrollWidth <= docWidth && sectionScrollWidth <= docWidth;

      return {
        viewportWidth: docWidth,
        scrollWidth,
        sectionScrollWidth,
        noHorizontalOverflow: noOverflow,
        orderCorrect: correctOrder,
        headerTop: headerRect.top + window.scrollY,
        mediaTop: mediaRect.top + window.scrollY,
        cardsTop: cardsRect.top + window.scrollY
      };
    })()`,
    returnByValue: true
  });

  console.log("Mobile Evaluation Result:", JSON.stringify(mobileEval.result.value, null, 2));

  // Scroll section into view for mobile screenshot
  await send('Runtime.evaluate', {
    expression: `document.querySelector('#zv-doorstep-delivery')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 1200));

  const mobileClipEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('#zv-doorstep-delivery');
      const r = el.getBoundingClientRect();
      return { x: 0, y: Math.max(0, r.top + window.scrollY), width: 390, height: r.height };
    })()`,
    returnByValue: true
  });
  const mClip = mobileClipEval.result.value;

  const mobileShot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: mClip.x,
      y: mClip.y,
      width: mClip.width,
      height: mClip.height,
      scale: 2
    }
  });

  const mobileImgPath = `${ARTIFACT_DIR}/doorstep_delivery_mobile_390.png`;
  fs.writeFileSync(mobileImgPath, Buffer.from(mobileShot.data, 'base64'));
  console.log(`✔ Saved Mobile 390px screenshot: ${mobileImgPath}`);

  // =========================================================================
  // 4. BUY BOX / ADD TO CART & BUY NOW VERIFICATION
  // =========================================================================
  console.log("\n--- BUY BOX INTEGRITY VERIFICATION ---");
  const buyBoxEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const atcBtn = document.querySelector('button[name=\"add\"], .zv-atc-btn, form[action*=\"/cart/add\"] button[type=\"submit\"]');
      const buyNowBtn = document.querySelector('.shopify-payment-button, [data-testid=\"Checkout-button\"], .shopify-payment-button__button');
      const form = document.querySelector('form[action*=\"/cart/add\"]');
      const variantInput = document.querySelector('input[name=\"id\"], select[name=\"id\"]');

      return {
        formExists: !!form,
        atcBtnExists: !!atcBtn,
        atcDisabled: atcBtn ? atcBtn.disabled : null,
        atcText: atcBtn ? atcBtn.textContent.trim().replace(/\\s+/g, ' ') : null,
        buyNowExists: !!buyNowBtn,
        variantInputExists: !!variantInput,
        variantId: variantInput ? variantInput.value : null
      };
    })()`,
    returnByValue: true
  });

  console.log("Buy Box Verification Result:", JSON.stringify(buyBoxEval.result.value, null, 2));

  // Reset metrics
  await send('Emulation.clearDeviceMetricsOverride');
  ws.close();
  console.log("\n✔ QA COMPLETED SUCCESSFULLY!");
}

runQA().catch(err => {
  console.error("QA failed:", err);
  process.exit(1);
});
