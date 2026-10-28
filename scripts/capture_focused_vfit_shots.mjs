import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8094;
const CDP_PORT = 9270;
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const PROTO_DIR = path.resolve('prototypes/vfit-selfcare-upsell');
const userDataDir = `${process.env.TEMP}\\chrome-vfit-focus-${Date.now()}`;

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
      '.avif': 'image/avif'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise(resolve => {
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

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

  const url = `http://127.0.0.1:${PORT}/index.html`;
  await send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 2500));

  async function captureElement(elementSelector, filename, width, height, dpr = 1) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: dpr,
      mobile: width < 600
    });
    await new Promise(r => setTimeout(r, 800));

    await send('Runtime.evaluate', {
      expression: `document.querySelector('${elementSelector}').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 800));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(ARTIFACTS_DIR, filename);
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log(`✓ Focused screenshot: ${filename} (${width}x${height})`);
  }

  // 1. Version A Focused View (Desktop 1440)
  await send('Runtime.evaluate', { expression: `window.ZavelynUpsellProto.switchVersion('A');` });
  await captureElement('#zvSelfCareRoutine', 'vfit_focused_versionA_desktop_1440.png', 1440, 1100);

  // 2. Version A Focused View (Mobile 390)
  await captureElement('#zvSelfCareRoutine', 'vfit_focused_versionA_mobile_390.png', 390, 844, 2);

  // 3. Version B Focused View (Desktop 1440)
  await send('Runtime.evaluate', { expression: `window.ZavelynUpsellProto.switchVersion('B');` });
  await captureElement('#zvSelfCareRoutine', 'vfit_focused_versionB_desktop_1440.png', 1440, 950);

  // 4. Version B Focused View (Mobile 390)
  await captureElement('#zvSelfCareRoutine', 'vfit_focused_versionB_mobile_390.png', 390, 844, 2);

  // 5. Version A with Both Selected (Full Package View Desktop 1440)
  await send('Runtime.evaluate', {
    expression: `
      window.ZavelynUpsellProto.switchVersion('A');
      if (!window.ZavelynUpsellProto.state.addons.eyeMask) window.ZavelynUpsellProto.toggleAddon('eyeMask');
      if (!window.ZavelynUpsellProto.state.addons.faceMask) window.ZavelynUpsellProto.toggleAddon('faceMask');
    `
  });
  await captureElement('#zvSelfCareRoutine', 'vfit_focused_suite_selected_desktop_1440.png', 1440, 1100);

  // 6. Version B with Both Selected (Full Package View Mobile 390)
  await send('Runtime.evaluate', { expression: `window.ZavelynUpsellProto.switchVersion('B');` });
  await captureElement('#zvOrderSummaryCard', 'vfit_focused_summary_card_mobile_390.png', 390, 844, 2);

  try {
    chromeProc.kill();
    server.close();
  } catch(e) {}

  console.log('✓ All focused screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
