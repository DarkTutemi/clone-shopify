import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3';
const PREVIEW_ROOT = 'https://tryzavelyn.com/?preview_theme_id=187597717689';
const PREVIEW_PDP = 'https://tryzavelyn.com/products/zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves?preview_theme_id=187597717689';
const PORT = 9224;

async function main() {
  const userDataDir = `${process.env.TEMP}\\chrome-qa-${Date.now()}`;
  console.log(`Launching dedicated Chrome instance with CDP on port ${PORT}...`);
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,1200',
    'about:blank'
  ]);

  // Wait for CDP port
  let tabs = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      tabs = await res.json();
      if (tabs && tabs.length > 0) break;
    } catch (e) {}
  }

  if (!tabs) {
    chromeProc.kill();
    throw new Error(`Could not connect to Chrome on port ${PORT}`);
  }

  const tab = tabs[0];
  console.log(`Connected to tab: ${tab.id} -> ${tab.webSocketDebuggerUrl}`);
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

  // 1. Establish Draft Theme preview session
  console.log(`Establishing Preview Session via: ${PREVIEW_ROOT}`);
  await send('Page.navigate', { url: PREVIEW_ROOT });
  await new Promise(r => setTimeout(r, 4000));

  // 2. Navigate to PDP
  console.log(`Navigating to Draft Preview PDP: ${PREVIEW_PDP}`);
  await send('Page.navigate', { url: PREVIEW_PDP });
  await new Promise(r => setTimeout(r, 4500));

  // =========================================================================
  // 1. DESKTOP 1440px
  // =========================================================================
  console.log("\n==================== DESKTOP 1440px QA ====================");
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll section into view to trigger lazy loading
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector("#zv-doorstep-delivery");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 2000));

  // Evaluate section metrics
  const desktopEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const section = document.querySelector('#zv-doorstep-delivery');
      if (!section) return { error: '#zv-doorstep-delivery section not found!' };

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
  console.log("Desktop Evaluation:", JSON.stringify(desktopEval.result.value, null, 2));

  // Position section exactly at top of viewport for clean screenshot
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector("#zv-doorstep-delivery");
      if (el) {
        const r = el.getBoundingClientRect();
        window.scrollTo(0, window.scrollY + r.top);
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));

  const deskRect = (await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector("#zv-doorstep-delivery");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: Math.max(0, Math.floor(r.left)),
        y: Math.max(0, Math.floor(r.top)),
        width: Math.min(1440, Math.ceil(r.width)),
        height: Math.ceil(r.height)
      };
    })()`,
    returnByValue: true
  })).result.value;

  console.log("Desktop Section Rect in Viewport:", deskRect);

  if (deskRect) {
    // Ensure viewport height fits the section
    const targetHeight = Math.max(1200, deskRect.height + 60);
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: targetHeight,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 800));

    const deskShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: deskRect.x,
        y: deskRect.y,
        width: deskRect.width,
        height: deskRect.height,
        scale: 1
      }
    });

    const deskDest = `${ARTIFACT_DIR}/doorstep_delivery_desktop_1440.png`;
    fs.writeFileSync(deskDest, Buffer.from(deskShot.data, 'base64'));
    console.log(`✔ Saved Desktop 1440px Screenshot: ${deskDest} (${fs.statSync(deskDest).size} bytes)`);
  }

  // =========================================================================
  // 2. MOBILE 390px
  // =========================================================================
  console.log("\n==================== MOBILE 390px QA ====================");
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll section into view
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector("#zv-doorstep-delivery");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));

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

      // Check section horizontal overflow
      const docWidth = document.documentElement.clientWidth;
      const sectionScrollWidth = section.scrollWidth;
      const noOverflow = sectionScrollWidth <= docWidth;

      return {
        viewportWidth: docWidth,
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
  console.log("Mobile Evaluation:", JSON.stringify(mobileEval.result.value, null, 2));

  // Position section exactly for full vertical capture
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector("#zv-doorstep-delivery");
      if (el) {
        const r = el.getBoundingClientRect();
        window.scrollTo(0, window.scrollY + r.top);
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));

  const mobRect = (await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector("#zv-doorstep-delivery");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: Math.max(0, Math.floor(r.left)),
        y: Math.max(0, Math.floor(r.top)),
        width: 390,
        height: Math.ceil(r.height)
      };
    })()`,
    returnByValue: true
  })).result.value;

  console.log("Mobile Section Rect in Viewport:", mobRect);

  if (mobRect) {
    // Set height to fit the whole section
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: mobRect.height + 40,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));

    const mobShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 0,
        y: 0,
        width: 390,
        height: mobRect.height,
        scale: 2
      }
    });

    const mobDest = `${ARTIFACT_DIR}/doorstep_delivery_mobile_390.png`;
    fs.writeFileSync(mobDest, Buffer.from(mobShot.data, 'base64'));
    console.log(`✔ Saved Mobile 390px Screenshot: ${mobDest} (${fs.statSync(mobDest).size} bytes)`);
  }

  // =========================================================================
  // 3. BUY BOX & ADD TO CART INTEGRITY
  // =========================================================================
  console.log("\n==================== BUY BOX INTEGRITY ====================");
  await send('Emulation.clearDeviceMetricsOverride');
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, 0);`
  });
  await new Promise(r => setTimeout(r, 1000));

  const buyBoxEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
        name: b.name,
        type: b.type,
        text: b.textContent.trim().replace(/\\s+/g, ' '),
        classes: b.className
      }));
      const atcButton = buttons.find(b => b.name === 'add' || b.text.toLowerCase().includes('add to cart') || b.classes.includes('atc') || b.classes.includes('btn-primary'));
      const buyNowButton = buttons.find(b => b.text.toLowerCase().includes('buy now') || b.classes.includes('shopify-payment-button'));
      const forms = Array.from(document.querySelectorAll('form')).map(f => f.action);

      return {
        atcButton,
        buyNowButton,
        cartForms: forms.filter(a => a && a.includes('/cart/add'))
      };
    })()`,
    returnByValue: true
  });
  console.log("Buy Box Evaluation:", JSON.stringify(buyBoxEval.result.value, null, 2));

  // Clean exit
  ws.close();
  chromeProc.kill();
  console.log("\n✔ ALL QA & SCREENSHOTS COMPLETED SUCCESSFULLY!");
}

main().catch(err => {
  console.error("Main failed:", err);
  process.exit(1);
});
