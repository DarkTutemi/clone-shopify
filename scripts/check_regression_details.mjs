import { spawn } from 'child_process';

const PORT = 9268;
const DRAFT_THEME_ID = '187708571833';
const URL = `https://tryzavelyn.com/products/the-yeoman-sweep?preview_theme_id=${DRAFT_THEME_ID}`;

async function main() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-reg-check-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    'about:blank'
  ]);

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

  await send('Page.navigate', { url: URL });
  await new Promise(r => setTimeout(r, 5000));

  const pageInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        title: document.title,
        h1: document.querySelector('h1')?.innerText?.trim(),
        hasPrice: !!document.querySelector('.price, .kc-price, [id^="price-"]'),
        hasAtcBtn: !!document.querySelector('button[type="submit"], [name="add"], .kc-atc'),
        hasBotanaBundle: !!document.querySelector('#zvBotanaBundleComponent'),
        sections: Array.from(document.querySelectorAll('[id^="shopify-section-"]')).map(s => s.id)
      };
    })()`,
    returnByValue: true
  });

  console.log('Regression page info:', pageInfo.result?.value);
  chromeProc.kill();
}

main().catch(console.error);
