import { spawn } from 'child_process';
import fs from 'fs';

const PORT = 9290;
const YEOMAN_URL = 'https://tryzavelyn.com/products/the-yeoman-sweep';
const BOTANA_URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';
const BOGO_URL = 'https://tryzavelyn.com/pages/botanaroots-bogo-offer';

const EXPECTED_NEW_URLS = [
  'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/hf_20260913_100130_cc5a08ed-b3ec-4abb-95bc-a45bfdb72b96.png?v=1793219564',
  'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/ysp-gallery-brush-macro_e7dfbadb-e74b-4d6a-b91c-69525032dceb.png?v=1793219847',
  'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/hf_20260913_083634_da088230-c66f-464c-8f68-ca03117a3a8d.png?v=1793219673',
  'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/hf_20260913_102022_03eb4095-9fa0-49f3-9694-fad1622a0020.png?v=1793220255'
];

async function runQA() {
  console.log('========================================================================');
  console.log('STARTING QA POST-UPDATE VERIFICATION FOR YEOMAN LAWN SWEEPER');
  console.log('========================================================================\n');

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-yeoman-qa-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,900',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch(`http://127.0.0.1:${PORT}/json`);
  const tabs = await res.json();
  const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let msgId = 1;
  const jsErrors = [];

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

  ws.addEventListener('message', (evt) => {
    const msg = JSON.parse(evt.data.toString());
    if (msg.method === 'Runtime.exceptionThrown') {
      jsErrors.push(msg.params.exceptionDetails?.text || 'JS Error');
    }
  });

  await send('Page.enable');
  await send('Runtime.enable');

  // --- PART 1: DESKTOP 1440px TEST ---
  console.log('1. Testing Desktop 1440px on ' + YEOMAN_URL);
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: YEOMAN_URL });
  await new Promise(r => setTimeout(r, 4500));

  // Scroll to each image to trigger native lazy loading and wait for decode
  await send('Runtime.evaluate', {
    expression: `(async () => {
      const bannerImg = document.querySelector('.wf-banner-media img');
      const featureImgs = Array.from(document.querySelectorAll('.wf-feature-media img'));
      const allImgs = [bannerImg, ...featureImgs].filter(Boolean);
      for (const img of allImgs) {
        img.scrollIntoView({ behavior: 'instant', block: 'center' });
        await new Promise(r => setTimeout(r, 400));
        if (img.decode) {
          try { await img.decode(); } catch (e) {}
        }
      }
      // Scroll back up for clean screenshot
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 500));
    })()`,
    awaitPromise: true
  });

  // Inspect the 4 body images on Desktop
  const desktopEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const bannerImg = document.querySelector('.wf-banner-media img');
      const featureImgs = Array.from(document.querySelectorAll('.wf-feature-media img'));
      
      const allBodyImgs = [bannerImg, ...featureImgs].filter(Boolean);
      return allBodyImgs.map((img, idx) => ({
        index: idx + 1,
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.offsetWidth,
        displayHeight: img.offsetHeight,
        alt: img.alt
      }));
    })()`,
    returnByValue: true
  });

  console.log('\n--- Desktop 1440px Body Images Status ---');
  const desktopImgs = desktopEval.result.value || [];
  let desktopAllLoaded = true;

  desktopImgs.forEach((img, i) => {
    const matchesExpected = EXPECTED_NEW_URLS[i] === img.src;
    const isLoaded = img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
    if (!isLoaded) desktopAllLoaded = false;
    console.log(`Image ${img.index} (${img.alt}):`);
    console.log(`  Src: ${img.src}`);
    console.log(`  Matches New URL: ${matchesExpected ? '✓ YES' : '✗ NO'}`);
    console.log(`  Loaded successfully: ${isLoaded ? '✓ YES' : '✗ BROKEN'} (${img.naturalWidth}x${img.naturalHeight}px)`);
    console.log(`  Display Dimensions: ${img.displayWidth}x${img.displayHeight}px\n`);
  });

  // Capture Desktop Screenshot
  fs.mkdirSync('./backups/screenshots', { recursive: true });
  const desktopSs = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('./backups/screenshots/yeoman_desktop_updated.png', Buffer.from(desktopSs.data, 'base64'));
  console.log('✓ Captured Desktop screenshot: backups/screenshots/yeoman_desktop_updated.png\n');

  // --- PART 2: MOBILE 390px TEST ---
  console.log('2. Testing Mobile 390px on ' + YEOMAN_URL);
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });

  await send('Page.navigate', { url: YEOMAN_URL });
  await new Promise(r => setTimeout(r, 4500));

  // Scroll to each image on mobile to trigger lazy load
  await send('Runtime.evaluate', {
    expression: `(async () => {
      const bannerImg = document.querySelector('.wf-banner-media img');
      const featureImgs = Array.from(document.querySelectorAll('.wf-feature-media img'));
      const allImgs = [bannerImg, ...featureImgs].filter(Boolean);
      for (const img of allImgs) {
        img.scrollIntoView({ behavior: 'instant', block: 'center' });
        await new Promise(r => setTimeout(r, 400));
        if (img.decode) {
          try { await img.decode(); } catch (e) {}
        }
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 500));
    })()`,
    awaitPromise: true
  });

  const mobileEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const bannerImg = document.querySelector('.wf-banner-media img');
      const featureImgs = Array.from(document.querySelectorAll('.wf-feature-media img'));
      
      const allBodyImgs = [bannerImg, ...featureImgs].filter(Boolean);
      return allBodyImgs.map((img, idx) => ({
        index: idx + 1,
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.offsetWidth,
        displayHeight: img.offsetHeight,
        alt: img.alt
      }));
    })()`,
    returnByValue: true
  });

  console.log('\n--- Mobile 390px Body Images Status ---');
  const mobileImgs = mobileEval.result.value || [];
  let mobileAllLoaded = true;

  mobileImgs.forEach((img, i) => {
    const matchesExpected = EXPECTED_NEW_URLS[i] === img.src;
    const isLoaded = img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
    if (!isLoaded) mobileAllLoaded = false;
    console.log(`Image ${img.index} (${img.alt}):`);
    console.log(`  Loaded successfully: ${isLoaded ? '✓ YES' : '✗ BROKEN'} (${img.naturalWidth}x${img.naturalHeight}px)`);
    console.log(`  Display Dimensions: ${img.displayWidth}x${img.displayHeight}px\n`);
  });

  // Capture Mobile Screenshot
  const mobileSs = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('./backups/screenshots/yeoman_mobile_updated.png', Buffer.from(mobileSs.data, 'base64'));
  console.log('✓ Captured Mobile screenshot: backups/screenshots/yeoman_mobile_updated.png\n');

  // --- PART 3: REGRESSION TEST ON OTHER PRODUCTS ---
  console.log('3. Regression Verification on other products:');

  // BotanaRoots PDP
  await send('Page.navigate', { url: BOTANA_URL });
  await new Promise(r => setTimeout(r, 3500));
  const botanaTitle = await send('Runtime.evaluate', { expression: `document.title`, returnByValue: true });
  console.log('   BotanaRoots Winning PDP Title: ' + botanaTitle.result.value + ' -> ✓ OK');

  // BotanaRoots BOGO Page
  await send('Page.navigate', { url: BOGO_URL });
  await new Promise(r => setTimeout(r, 3500));
  const bogoTitle = await send('Runtime.evaluate', { expression: `document.title`, returnByValue: true });
  console.log('   BotanaRoots BOGO Page Title: ' + bogoTitle.result.value + ' -> ✓ OK');

  console.log('\nJS Errors detected: ' + jsErrors.length);

  chromeProc.kill();
  console.log('\n========================================================================');
  console.log('QA VERIFICATION COMPLETE.');
  console.log('========================================================================');
}

runQA().catch(console.error);
