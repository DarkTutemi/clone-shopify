import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8106;
const CDP_PORT = 9277;
const PROTO_DIR = path.resolve('prototypes/vfit-selfcare-upsell');
const userDataDir = `${process.env.TEMP}\\chrome-vfit-overflow-${Date.now()}`;

function startServer() {
  const server = http.createServer((req, res) => {
    let cleanPath = req.url.split('?')[0];
    let filePath = path.join(PROTO_DIR, cleanPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
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
      '.jpg': 'image/jpeg'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
  });
  return new Promise(resolve => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

async function main() {
  const server = await startServer();
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  let ws;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
      const tabs = await res.json();
      const tab = tabs.find(t => t.type === 'page');
      if (tab) {
        ws = new WebSocket(tab.webSocketDebuggerUrl);
        await new Promise(r => ws.addEventListener('open', r));
        break;
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 300));
  }

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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 1000));

  const overflowReport = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const docW = document.documentElement.clientWidth;
      const elements = Array.from(document.querySelectorAll('*'));
      const overflowing = [];
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.right > docW + 1) {
          overflowing.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          });
        }
      }
      return overflowing.slice(0, 10);
    })()`
  });

  console.log('Overflowing elements on 375px:', overflowReport.result.value);

  ws.close();
  chrome.kill();
  server.close();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
}

main().catch(console.error);
