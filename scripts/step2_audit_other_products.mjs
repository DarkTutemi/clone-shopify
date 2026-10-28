import { spawn } from 'child_process';
import fs from 'fs';

const PORT = 9296;
const OTHER_PRODUCTS = [
  'sakerplus®-3-in-1-gypsum-board-cutting-tool',
  'zavelyn-airclear-plugin-negative-ion-air-purifier',
  'zavelyn-automatic-dough-mixer-with-ferment-function',
  'zavelyn-cozyheat-heated-wearable-blanket-sweater'
];

async function main() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-audit-other-${Date.now()}`,
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

  const auditResults = [];

  for (const handle of OTHER_PRODUCTS) {
    const url = `https://tryzavelyn.com/products/${encodeURIComponent(handle)}`;
    console.log(`Auditing: ${url}`);
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 5000));

    const data = await send('Runtime.evaluate', {
      expression: `(() => {
        const mainImg = document.getElementById('zvMainImg')?.src;
        const thumbs = Array.from(document.querySelectorAll('.zv-thumb-btn img')).map(img => img.src);
        const hasBotanaMain = mainImg?.includes('zavelyn-botana');
        const botanaThumbsCount = thumbs.filter(t => t.includes('zavelyn-botana')).length;

        return {
          title: document.title,
          mainImg,
          hasBotanaMain,
          thumbCount: thumbs.length,
          botanaThumbsCount,
          firstThumb: thumbs[0]
        };
      })()`,
      returnByValue: true
    });

    auditResults.push({
      handle,
      ...data.result?.value
    });
  }

  console.log('\n--- OTHER PRODUCTS AUDIT ON LIVE ---');
  console.log(JSON.stringify(auditResults, null, 2));

  fs.writeFileSync('backups/locked_botanaroots_live_baseline/other_products_live_bug_audit.json', JSON.stringify(auditResults, null, 2));

  chromeProc.kill();
}

main().catch(console.error);
