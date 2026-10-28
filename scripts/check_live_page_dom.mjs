import { spawn } from 'child_process';

const PORT = 9260;
const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${process.env.TEMP}\\chrome-check-${Date.now()}`,
  '--headless=new',
  '--disable-gpu',
  'about:blank'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1500));
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

  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil' });
  await new Promise(r => setTimeout(r, 6000));

  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const sections = Array.from(document.querySelectorAll('[id^="shopify-section-"]')).map(s => ({
        id: s.id,
        className: s.className,
        heading: s.querySelector('h1, h2, h3')?.innerText?.trim() || null,
        visible: s.offsetHeight > 0
      }));
      return { sections };
    })()`,
    returnByValue: true
  });

  console.log('DOM check:', evalRes.result?.value);
  chromeProc.kill();
}

run().catch(err => {
  console.error(err);
  chromeProc.kill();
});
