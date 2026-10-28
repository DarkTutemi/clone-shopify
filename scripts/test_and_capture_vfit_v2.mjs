import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8105;
const CDP_PORT = 9276;
const PROTO_DIR = path.resolve('prototypes/vfit-selfcare-upsell');
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const userDataDir = `${process.env.TEMP}\\chrome-vfit-v2-${Date.now()}`;

function startServer() {
  const server = http.createServer((req, res) => {
    let cleanPath = req.url.split('?')[0];
    if (cleanPath === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }
    let filePath = path.join(PROTO_DIR, cleanPath);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    if (fs.statSync(filePath).isDirectory()) {
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
      '.webp': 'image/webp',
      '.avif': 'image/avif'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise(resolve => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

async function connectCDP() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
      const tabs = await res.json();
      const tab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (tab) {
        const ws = new WebSocket(tab.webSocketDebuggerUrl);
        await new Promise(r => ws.addEventListener('open', r));
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
        return { ws, send };
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 400));
  }
  throw new Error('Could not connect to CDP on port ' + CDP_PORT);
}

async function captureShot(send, filename, fullPage = false) {
  const result = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: fullPage
  });
  const buf = Buffer.from(result.data, 'base64');
  const targetPath = path.join(ARTIFACTS_DIR, filename);
  fs.writeFileSync(targetPath, buf);
  console.log(`✓ Saved screenshot: ${filename} (${buf.length} bytes)`);
}

async function setViewport(send, width, height, scale = 1, isMobile = false) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: scale,
    mobile: isMobile
  });
  await new Promise(r => setTimeout(r, 600));
}

async function main() {
  const server = await startServer();
  console.log(`HTTP Server running at http://127.0.0.1:${PORT}`);

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  const { ws, send } = await connectCDP();
  console.log('Connected to CDP!');

  // Listen to console errors & network failures
  await send('Runtime.enable');
  await send('Log.enable');

  const pageErrors = [];
  ws.addEventListener('message', evt => {
    const msg = JSON.parse(evt.data.toString());
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      pageErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
    }
  });

  const testUrl = `http://127.0.0.1:${PORT}/`;
  await send('Page.navigate', { url: testUrl });
  await new Promise(r => setTimeout(r, 1500));

  console.log('\n--- 1. DESKTOP 1440PX INITIAL STATE (VERSION A) ---');
  await setViewport(send, 1440, 950);

  // Check initial calculation state
  const evalInitial = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return {
        qty: window.ZavelynUpsellProto.state.vfitQuantity,
        vfitPrice: document.getElementById('zvPriceCurrent')?.innerText,
        summaryTotal: document.getElementById('summaryTotalPrice')?.innerText,
        ctaText: document.getElementById('packageCtaText')?.innerText,
        eyeMaskActive: window.ZavelynUpsellProto.state.addons.eyeMask,
        faceMaskActive: window.ZavelynUpsellProto.state.addons.faceMask
      };
    })()`
  });
  console.log('Initial State:', evalInitial.result.value);

  // Scroll to Self-Care Upsell section
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zvSelfCareRoutine').scrollIntoView({ behavior: 'instant', block: 'center' });`
  });
  await new Promise(r => setTimeout(r, 800));
  await captureShot(send, 'vfit_v2_desktop_1440_versionA_initial.png');

  console.log('\n--- 2. TEST QUANTITY SELECTOR (vFit Qty 1 -> 2 -> 3) ---');
  // Click Plus button twice
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.ZavelynUpsellProto.changeQuantity(1); // Qty 2
      window.ZavelynUpsellProto.changeQuantity(1); // Qty 3
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  const evalQty3 = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return {
        qty: window.ZavelynUpsellProto.state.vfitQuantity,
        vfitPrice: document.getElementById('zvPriceCurrent')?.innerText,
        summaryVfitPrice: document.getElementById('summaryVfitPrice')?.innerText,
        summaryTotal: document.getElementById('summaryTotalPrice')?.innerText,
        ctaText: document.getElementById('packageCtaText')?.innerText
      };
    })()`
  });
  console.log('After Qty = 3:', evalQty3.result.value);

  // Scroll up to buy box to see quantity selector & price
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zv-pdp').scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 600));
  await captureShot(send, 'vfit_v2_desktop_1440_qty3_selected.png');

  console.log('\n--- 3. TEST SELECTING BOTH ADD-ONS (Eye Mask + Face Mask) ---');
  // Reset Qty to 1, then toggle both add-ons
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.ZavelynUpsellProto.changeQuantity(-2); // Qty 1
      window.ZavelynUpsellProto.toggleAddon('eyeMask');
      window.ZavelynUpsellProto.toggleAddon('faceMask');
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const evalBoth = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return {
        qty: window.ZavelynUpsellProto.state.vfitQuantity,
        summaryTotal: document.getElementById('summaryTotalPrice')?.innerText,
        summaryCompare: document.getElementById('summaryComparePrice')?.innerText,
        summarySavings: document.getElementById('summaryTotalSavings')?.innerText,
        tierBadge: document.getElementById('summaryTierBadge')?.innerText,
        ctaText: document.getElementById('packageCtaText')?.innerText
      };
    })()`
  });
  console.log('With Both Add-ons Selected:', evalBoth.result.value);

  // Scroll to upsell section and order summary
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zvSelfCareRoutine').scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));
  await captureShot(send, 'vfit_v2_desktop_1440_versionA_both_selected.png');

  console.log('\n--- 4. TEST INDEPENDENT GALLERY NAVIGATION & THUMBNAILS ---');
  // Next slide on Eye Mask
  await send('Runtime.evaluate', {
    expression: `window.ZavelynUpsellProto.nextSlide('eyeMask')`
  });
  await new Promise(r => setTimeout(r, 300));
  // Thumbnail 3 on Face Mask
  await send('Runtime.evaluate', {
    expression: `window.ZavelynUpsellProto.setSlide('faceMask', 2)`
  });
  await new Promise(r => setTimeout(r, 500));

  const galleryState = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `window.ZavelynUpsellProto.state.galleries`
  });
  console.log('Galleries active indices:', galleryState.result.value);

  console.log('\n--- 5. TEST LIGHTBOX MODAL ---');
  await send('Runtime.evaluate', {
    expression: `window.ZavelynUpsellProto.openLightbox('eyeMask')`
  });
  await new Promise(r => setTimeout(r, 600));
  await captureShot(send, 'vfit_v2_desktop_1440_lightbox_opened.png');

  // Close Lightbox
  await send('Runtime.evaluate', {
    expression: `window.ZavelynUpsellProto.closeLightbox()`
  });
  await new Promise(r => setTimeout(r, 400));

  console.log('\n--- 6. TEST CTA SIMULATION TOAST ---');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('packageCtaBtn').click()`
  });
  await new Promise(r => setTimeout(r, 600));
  await captureShot(send, 'vfit_v2_desktop_1440_toast_payload.png');

  console.log('\n--- 7. TEST VERSION B: COMPACT LUXURY ADD-ON CARDS ---');
  await send('Runtime.evaluate', {
    expression: `window.ZavelynUpsellProto.switchVersion('B')`
  });
  await new Promise(r => setTimeout(r, 600));
  await captureShot(send, 'vfit_v2_desktop_1440_versionB_both_selected.png');

  console.log('\n--- 8. TABLET 768PX QA ---');
  await setViewport(send, 768, 1024, 1, false);
  await send('Runtime.evaluate', {
    expression: `window.ZavelynUpsellProto.switchVersion('A'); document.getElementById('zvSelfCareRoutine').scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));
  await captureShot(send, 'vfit_v2_tablet_768.png');

  console.log('\n--- 9. MOBILE 390PX QA (iPhone 14) ---');
  await setViewport(send, 390, 844, 2, true);
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zvSelfCareRoutine').scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));
  await captureShot(send, 'vfit_v2_mobile_390_versionA.png');

  // Mobile Version B
  await send('Runtime.evaluate', {
    expression: `window.ZavelynUpsellProto.switchVersion('B'); document.getElementById('zvSelfCareRoutine').scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));
  await captureShot(send, 'vfit_v2_mobile_390_versionB.png');

  console.log('\n--- 10. MOBILE 375PX QA (iPhone SE) ---');
  await setViewport(send, 375, 667, 2, true);
  await send('Runtime.evaluate', {
    expression: `window.ZavelynUpsellProto.switchVersion('A'); document.getElementById('zvSelfCareRoutine').scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));
  await captureShot(send, 'vfit_v2_mobile_375.png');

  // Check for overflow on 375px
  const overflowCheck = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return {
        docScrollWidth: document.documentElement.scrollWidth,
        docClientWidth: document.documentElement.clientWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    })()`
  });
  console.log('Mobile 375px Overflow Check:', overflowCheck.result.value);

  console.log('\nPage Errors recorded:', pageErrors.length > 0 ? pageErrors : 'ZERO ERRORS ✓');

  ws.close();
  chrome.kill();
  server.close();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}

  console.log('\n✨ ALL QA TESTS AND SCREENSHOTS COMPLETED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Fatal in test_and_capture_vfit_v2:', err);
  process.exit(1);
});
