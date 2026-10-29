import { spawn } from 'child_process';

const PORT = 9291;
const TARGETS = [
  { name: 'BotanaRoots Original', url: 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil' },
  { name: 'BotanaRoots BOGO Page', url: 'https://tryzavelyn.com/pages/botanaroots-bogo-offer' },
  { name: 'Yeoman Lawn Sweeper', url: 'https://tryzavelyn.com/products/the-yeoman-sweep' }
];

async function checkRegression() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-reg-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,900',
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
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  for (const target of TARGETS) {
    console.log(`Checking ${target.name} (${target.url})...`);
    await send('Page.navigate', { url: target.url });
    await new Promise(r => setTimeout(r, 4000));

    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const title = document.title;
        const h1 = document.querySelector('h1')?.innerText?.trim();
        const mainPrice = document.getElementById('zvPriceCurrent')?.innerText?.trim() ||
                          document.querySelector('.price, .product-price, .wf-price-current')?.innerText?.trim();
        const atcBtn = document.getElementById('zvClaimOfferBtn') ||
                       document.getElementById('bogoClaimBtn') ||
                       document.querySelector('button[type=\"submit\"], button[name=\"add\"]');
        return {
          status: 'OK',
          title,
          h1,
          mainPrice,
          atcAvailable: atcBtn !== null
        };
      })()`,
      returnByValue: true
    });
    console.log(`✓ Result for ${target.name}:`, JSON.stringify(check.result.value, null, 2));
  }

  chromeProc.kill();
}

checkRegression().catch(console.error);
