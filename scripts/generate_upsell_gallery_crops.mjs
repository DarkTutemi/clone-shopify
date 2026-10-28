import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8100;
const CDP_PORT = 9275;
const PROTO_DIR = path.resolve('prototypes/vfit-selfcare-upsell');
const MEDIA_DIR = path.join(PROTO_DIR, 'media');
const userDataDir = `${process.env.TEMP}\\chrome-crop4-${Date.now()}`;

function startServer() {
  const server = http.createServer((req, res) => {
    let cleanPath = req.url.split('?')[0];
    let filePath = path.join(PROTO_DIR, cleanPath);
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
      '.webp': 'image/webp'
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
  throw new Error('Could not connect to CDP');
}

async function main() {
  const cropHtml = `
<!DOCTYPE html>
<html>
<body>
<canvas id="canvas" width="800" height="800"></canvas>
<script>
window.cropImage = function(src, sx, sy, sw, sh) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 800, 800);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 800, 800);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.onerror = reject;
    img.src = src;
  });
};
</script>
</body>
</html>
  `;
  fs.writeFileSync(path.join(PROTO_DIR, 'crop.html'), cropHtml);

  const server = await startServer();
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  const { ws, send } = await connectCDP();
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/crop.html` });
  await new Promise(r => setTimeout(r, 1000));

  // 7 Color Spectrum: sx: 0, sy: 700, sw: 500, sh: 300
  const faceSpectrum = await send('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `window.cropImage('/media/facemask_source_hd.jpg', 0, 700, 480, 290)`
  });
  if (faceSpectrum.result?.value) {
    fs.writeFileSync(path.join(MEDIA_DIR, 'facemask_slide_3.jpg'), Buffer.from(faceSpectrum.result.value.split(',')[1], 'base64'));
    console.log('✓ Re-generated facemask_slide_3.jpg (7 Color Spectrum)');
  }

  ws.close();
  chrome.kill();
  server.close();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
  try { fs.unlinkSync(path.join(PROTO_DIR, 'crop.html')); } catch (e) {}
}

main().catch(console.error);
