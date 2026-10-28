import { spawn } from 'child_process';

const PORT = 9295;
const URL = 'https://tryzavelyn.com/pages/botanaroots-bogo-offer';

async function main() {
  console.log('Testing mobile interaction on ' + URL + '...');
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-mobile-test-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=390,844',
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });

  await send('Page.navigate', { url: URL });
  await new Promise(r => setTimeout(r, 4500));

  // Clear cart first
  await send('Runtime.evaluate', {
    expression: `fetch('/cart/clear.js', { method: 'POST' })`,
    awaitPromise: true
  });

  console.log('Clicking Claim Offer on Mobile...');
  const t0 = Date.now();
  const clickRes = await send('Runtime.evaluate', {
    expression: `(async () => {
      const btn = document.getElementById('zvBotanaCtaBtn');
      btn.click();
    })()`,
    awaitPromise: true
  });

  // Track what happens every 300ms
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 300));
    const state = await send('Runtime.evaluate', {
      expression: `(() => {
        const drawer = document.getElementById('willaCartDrawer');
        const isActive = drawer ? drawer.classList.contains('active') : false;
        const items = document.querySelectorAll('.willa-cart-item').length;
        const emptyText = document.querySelector('.willa-empty-cart')?.innerText;
        const btnText = document.getElementById('zvBotanaCtaBtn')?.innerText?.trim();
        const headerCount = document.getElementById('willaCartCount')?.innerText;
        const drawerSubtotal = document.getElementById('willaDrawerSubtotal')?.innerText;
        return {
          elapsed: Date.now() - ${t0},
          drawerActive: isActive,
          drawerItemsCount: items,
          hasEmptyText: !!emptyText,
          btnText,
          headerCount,
          drawerSubtotal
        };
      })()`,
      returnByValue: true
    });
    console.log(`[t = ${state.result.value.elapsed}ms] Drawer active: ${state.result.value.drawerActive} | Items in drawer: ${state.result.value.drawerItemsCount} | Empty msg: ${state.result.value.hasEmptyText} | Header count: ${state.result.value.headerCount} | Subtotal: ${state.result.value.drawerSubtotal}`);
    if (state.result.value.drawerActive && state.result.value.drawerItemsCount > 0) {
      console.log('✓ Cart drawer successfully showing new item!');
      break;
    }
  }

  chromeProc.kill();
}

main().catch(console.error);
