import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PORT = 9286;
const userDataDir = `${process.env.TEMP}\\chrome-diag-${Date.now()}`;
const prototypePath = path.resolve('prototypes/botanaroots-bogo-test/index.html');
const prototypeUrl = `file:///${prototypePath.replace(/\\/g, '/')}`;

async function main() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));

  const tabsRes = await fetch(`http://127.0.0.1:${PORT}/json`);
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.type === 'page');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      const handler = (evt) => {
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

  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url: prototypeUrl });
  await new Promise(r => setTimeout(r, 1500));

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const overflowElements = [];
      document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth + 1) {
          overflowElements.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          });
        }
      });
      return overflowElements;
    })()`,
    returnByValue: true
  });

  console.log('Overflow Elements:', JSON.stringify(res.result.value, null, 2));
  await ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
}

main().catch(console.error);
