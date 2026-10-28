import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8108;
const CDP_PORT = 9278;
const PROTO_DIR = path.resolve('prototypes/vfit-selfcare-upsell');
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const userDataDir = `${process.env.TEMP}\\chrome-vfit-final-${Date.now()}`;

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

async function captureElement(send, selector, filename) {
  // Ensure toast is hidden
  await send('Runtime.evaluate', {
    expression: `(() => {
      const t = document.getElementById('zvCheckoutToast');
      if (t) t.classList.remove('active');
    })()`
  });
  await new Promise(r => setTimeout(r, 200));

  // Get element bounding box
  const boxRes = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const el = document.querySelector('${selector}');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.x + window.scrollX,
        y: r.y + window.scrollY,
        width: r.width,
        height: r.height
      };
    })()`
  });

  const rect = boxRes.result.value;
  if (!rect) throw new Error('Element not found: ' + selector);

  // Take screenshot with clip
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      scale: 1
    },
    captureBeyondViewport: true
  });

  const buf = Buffer.from(shot.data, 'base64');
  const targetPath = path.join(ARTIFACTS_DIR, filename);
  fs.writeFileSync(targetPath, buf);
  console.log(`✓ Saved screenshot: ${filename} (${rect.width}x${rect.height}px, ${buf.length} bytes)`);
}

async function setViewport(send, width, height, scale = 1, isMobile = false) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: scale,
    mobile: isMobile
  });
  await new Promise(r => setTimeout(r, 500));
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

  await send('Runtime.enable');
  await send('Page.enable');

  const testUrl = `http://127.0.0.1:${PORT}/`;
  await send('Page.navigate', { url: testUrl });
  await new Promise(r => setTimeout(r, 1200));

  // Enable both add-ons for full showcase of selected states, price calculations & CTA
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.ZavelynUpsellProto.toggleAddon('eyeMask');
      window.ZavelynUpsellProto.toggleAddon('faceMask');
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  console.log('\n--- 1. CAPTURE VERSION A — DESKTOP 1440PX ---');
  await setViewport(send, 1440, 1100, 1, false);
  await send('Runtime.evaluate', {
    expression: `window.ZavelynUpsellProto.switchVersion('A')`
  });
  await new Promise(r => setTimeout(r, 500));
  await captureElement(send, '#zvSelfCareRoutine', 'vfit_v2_versionA_desktop_1440.png');

  console.log('\n--- 2. CAPTURE VERSION B — DESKTOP 1440PX ---');
  await send('Runtime.evaluate', {
    expression: `window.ZavelynUpsellProto.switchVersion('B')`
  });
  await new Promise(r => setTimeout(r, 500));
  await captureElement(send, '#zvSelfCareRoutine', 'vfit_v2_versionB_desktop_1440.png');

  console.log('\n--- 3. CAPTURE VERSION A — MOBILE 390PX ---');
  await setViewport(send, 390, 844, 2, true);
  await send('Runtime.evaluate', {
    expression: `window.ZavelynUpsellProto.switchVersion('A')`
  });
  await new Promise(r => setTimeout(r, 600));
  await captureElement(send, '#zvSelfCareRoutine', 'vfit_v2_versionA_mobile_390.png');

  console.log('\n--- 4. CAPTURE VERSION B — MOBILE 390PX ---');
  await send('Runtime.evaluate', {
    expression: `window.ZavelynUpsellProto.switchVersion('B')`
  });
  await new Promise(r => setTimeout(r, 600));
  await captureElement(send, '#zvSelfCareRoutine', 'vfit_v2_versionB_mobile_390.png');

  ws.close();
  chrome.kill();
  server.close();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}

  console.log('\n🎉 ALL 4 FINAL REVIEW IMAGES CAPTURED PERFECTLY!');
}

main().catch(err => {
  console.error('Fatal in capture_final_review_images:', err);
  process.exit(1);
});
