import { spawn } from 'child_process';

const PORT = 9275;
const DRAFT_THEME_ID = '187708571833';
const URL = `https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=${DRAFT_THEME_ID}`;

async function main() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-overflow-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));
  const res = await fetch(`http://127.0.0.1:${PORT}/json`);
  const tabs = await res.json();
  const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = msgId++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await send('Page.navigate', { url: URL });
  await new Promise(r => setTimeout(r, 5000));

  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 500));

  const overflowElements = await send('Runtime.evaluate', {
    expression: `(() => {
      const docW = document.documentElement.clientWidth;
      const elements = Array.from(document.querySelectorAll('*')).filter(el => {
        const r = el.getBoundingClientRect();
        return r.right > docW + 0.5;
      }).map(el => ({
        tag: el.tagName,
        id: el.id,
        className: el.className,
        right: el.getBoundingClientRect().right,
        width: el.getBoundingClientRect().width,
        outerHTML: el.outerHTML.slice(0, 100)
      }));
      return elements;
    })()`,
    returnByValue: true
  });

  console.log('Overflowing elements at 375px:', overflowElements.result?.value);
  chromeProc.kill();
}

main().catch(console.error);
