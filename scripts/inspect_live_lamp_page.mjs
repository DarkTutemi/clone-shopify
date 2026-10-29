import { spawn } from 'child_process';

const PORT = 9289;
const URL = 'https://tryzavelyn.com/products/livestock-heating-lamp';

async function inspectLiveLamp() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-lamp-check-${Date.now()}`,
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
  await send('Page.navigate', { url: URL });
  await new Promise(r => setTimeout(r, 4500));

  const pageInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      // Check which bundle container is visible
      const pdpMain = document.querySelector('.zv-pdp-main');
      const funnel = document.querySelector('.heating-lamp-funnel, [class*=\"heating-lamp\"], .wf-section');
      
      const kcOffers = Array.from(document.querySelectorAll('.kc-offer')).map(o => ({
        tier: o.getAttribute('data-tier'),
        val: o.getAttribute('data-bundle-val'),
        text: o.innerText.trim(),
        visible: o.offsetWidth > 0 && o.offsetHeight > 0
      }));

      const wfBundles = Array.from(document.querySelectorAll('.wf-bundle-card')).map(b => ({
        id: b.id,
        className: b.className,
        badge: b.querySelector('.wf-bundle-badge')?.innerText?.trim(),
        title: b.querySelector('.wf-bundle-name')?.innerText?.trim(),
        price: b.querySelector('.wf-bundle-pricing')?.innerText?.trim(),
        visible: b.offsetWidth > 0 && b.offsetHeight > 0
      }));

      // Check buybox buttons
      const ctaBtns = Array.from(document.querySelectorAll('button')).filter(b => {
        const txt = b.innerText?.toUpperCase();
        return txt.includes('CLAIM') || txt.includes('ADD TO CART') || txt.includes('BUY NOW');
      }).map(b => ({
        id: b.id,
        className: b.className,
        text: b.innerText.trim(),
        visible: b.offsetWidth > 0 && b.offsetHeight > 0
      }));

      return {
        pdpMainVisible: pdpMain ? (pdpMain.offsetWidth > 0 && pdpMain.offsetHeight > 0) : false,
        kcOffers,
        wfBundles,
        ctaBtns
      };
    })()`,
    returnByValue: true
  });

  console.log('Live Page Info:\n', JSON.stringify(pageInfo.result.value, null, 2));

  chromeProc.kill();
}

inspectLiveLamp().catch(console.error);
