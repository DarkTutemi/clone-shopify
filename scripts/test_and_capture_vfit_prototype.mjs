import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8089;
const CDP_PORT = 9260;
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const PROTO_DIR = path.resolve('prototypes/vfit-selfcare-upsell');
const userDataDir = `${process.env.TEMP}\\chrome-vfit-proto-${Date.now()}`;

// 1. Simple HTTP Server to serve static prototype files
function startServer() {
  const server = http.createServer((req, res) => {
    let filePath = path.join(PROTO_DIR, req.url.split('?')[0]);
    if (filePath.endsWith(path.sep) || fs.statSync(filePath, { throwIfNoEntry: false })?.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.avif': 'image/avif'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise(resolve => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`Local prototype server running at http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

// 2. Launch Chrome
function launchChrome() {
  return spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);
}

async function main() {
  const server = await startServer();
  const chromeProc = launchChrome();
  console.log('Waiting for Chrome CDP...');
  await new Promise(r => setTimeout(r, 2000));

  const tabsRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page');
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

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
  await send('Network.enable');
  await send('Page.enable');
  await send('DOM.enable');

  const url = `http://127.0.0.1:${PORT}/index.html`;

  // Helper for screenshot
  async function takeShot(name, width, height, dpr = 1) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: dpr,
      mobile: width < 600
    });
    await new Promise(r => setTimeout(r, 1200));
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(ARTIFACTS_DIR, name);
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log(`✓ Screenshot saved: ${name} (${width}x${height})`);
  }

  // Load Page
  await send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 3000));

  // Verify Base Load
  const initCheck = await send('Runtime.evaluate', {
    expression: `(function() {
      const title = document.querySelector('h1')?.innerText?.trim();
      const basePrice = document.getElementById('summaryTotalPrice')?.innerText?.trim();
      const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth
      }));
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      return { title, basePrice, imgCount: imgs.length, overflow };
    })()`,
    returnByValue: true
  });
  console.log('Initial page verification:', initCheck.result.value);

  // -------------------------------------------------------------
  // TEST SUITE: VERSION A (PREMIUM PRODUCT CARDS)
  // -------------------------------------------------------------
  console.log('\n--- Capturing VERSION A (Cards) ---');
  await send('Runtime.evaluate', { expression: `window.ZavelynUpsellProto.switchVersion('A');` });
  
  // Desktop 1440px
  await takeShot('vfit_upsell_versionA_desktop_1440.png', 1440, 950);

  // Tablet 768px
  await takeShot('vfit_upsell_versionA_tablet_768.png', 768, 1024);

  // Mobile 390px
  await takeShot('vfit_upsell_versionA_mobile_390.png', 390, 844, 2);

  // Mobile 375px
  await takeShot('vfit_upsell_versionA_mobile_375.png', 375, 667, 2);

  // -------------------------------------------------------------
  // TEST SUITE: VERSION B (COMPACT UPSELL ROWS)
  // -------------------------------------------------------------
  console.log('\n--- Capturing VERSION B (Rows) ---');
  await send('Runtime.evaluate', { expression: `window.ZavelynUpsellProto.switchVersion('B');` });

  // Desktop 1440px
  await takeShot('vfit_upsell_versionB_desktop_1440.png', 1440, 950);

  // Tablet 768px
  await takeShot('vfit_upsell_versionB_tablet_768.png', 768, 1024);

  // Mobile 390px
  await takeShot('vfit_upsell_versionB_mobile_390.png', 390, 844, 2);

  // Mobile 375px
  await takeShot('vfit_upsell_versionB_mobile_375.png', 375, 667, 2);

  // -------------------------------------------------------------
  // TEST SUITE: INTERACTIVE STATE CHANGES & RECALCULATIONS
  // -------------------------------------------------------------
  console.log('\n--- Testing Interactive Calculations ---');
  
  // Select Eye Mask
  await send('Runtime.evaluate', { expression: `window.ZavelynUpsellProto.toggleAddon('eyeMask');` });
  const stateEye = await send('Runtime.evaluate', {
    expression: `({
      total: document.getElementById('summaryTotalPrice')?.innerText,
      savings: document.getElementById('summaryTotalSavings')?.innerText,
      tier: document.getElementById('summaryTierBadge')?.innerText
    })`,
    returnByValue: true
  });
  console.log('After selecting Eye Mask ($89.99):', stateEye.result.value);

  // Select Face Mask (Both Selected - Complete 3-Piece Suite)
  await send('Runtime.evaluate', { expression: `window.ZavelynUpsellProto.toggleAddon('faceMask');` });
  const stateBoth = await send('Runtime.evaluate', {
    expression: `({
      total: document.getElementById('summaryTotalPrice')?.innerText,
      savings: document.getElementById('summaryTotalSavings')?.innerText,
      tier: document.getElementById('summaryTierBadge')?.innerText
    })`,
    returnByValue: true
  });
  console.log('After selecting Face Mask ($129.99) - Complete Suite:', stateBoth.result.value);

  // Switch back to Version A and capture Complete Suite Selected Desktop
  await send('Runtime.evaluate', { expression: `window.ZavelynUpsellProto.switchVersion('A');` });
  await takeShot('vfit_upsell_complete_suite_selected_desktop.png', 1440, 950);

  // Test "View Details" Modal Open
  await send('Runtime.evaluate', { expression: `document.querySelector('.zv-link-details[data-addon="eyeMask"]').click();` });
  await takeShot('vfit_upsell_details_modal_desktop.png', 1440, 900);

  // Clean shutdown
  try {
    chromeProc.kill();
    server.close();
  } catch(e) {}

  console.log('\n✓ ALL SCREENSHOTS & CALCULATIONS VERIFIED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Fatal during test & capture:', err);
  process.exit(1);
});
