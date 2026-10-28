import { spawn } from 'child_process';

const PORT = 9294;
const URL = 'https://tryzavelyn.com/pages/botanaroots-bogo-offer?preview_theme_id=187736654009';

async function main() {
  console.log('Testing Patched BOGO Controller on Dev Theme (' + URL + ')...');
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-dev-patch-test-${Date.now()}`,
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
  const networkEvents = [];

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

  ws.addEventListener('message', (evt) => {
    const msg = JSON.parse(evt.data.toString());
    const now = Date.now();
    if (msg.method === 'Network.requestWillBeSent') {
      const req = msg.params.request;
      if (req.url.includes('/cart')) {
        networkEvents.push({ time: now, type: 'REQ', url: req.url, method: req.method, id: msg.params.requestId });
      }
    }
    if (msg.method === 'Network.responseReceived') {
      const resp = msg.params.response;
      if (resp.url.includes('/cart')) {
        networkEvents.push({ time: now, type: 'RESP', url: resp.url, status: resp.status, id: msg.params.requestId });
      }
    }
  });

  await send('Network.enable');
  await send('Runtime.enable');
  await send('Page.enable');

  console.log('Navigating to preview page...');
  await send('Page.navigate', { url: URL });
  await new Promise(r => setTimeout(r, 4500));

  // Clear cart first
  await send('Runtime.evaluate', {
    expression: `fetch('/cart/clear.js', { method: 'POST' })`,
    awaitPromise: true
  });

  // Check script contents loaded
  const scriptCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const bogoScript = Array.from(document.querySelectorAll('script')).find(s => s.src && s.src.includes('botanaroots-bogo.js'));
      return {
        src: bogoScript?.src,
        hasCta: !!document.getElementById('zvBotanaCtaBtn'),
        btnText: document.getElementById('zvBotanaCtaBtn')?.innerText
      };
    })()`,
    returnByValue: true
  });
  console.log('Page JS status:', JSON.stringify(scriptCheck.result.value, null, 2));

  console.log('\n--- CLICKING CLAIM OFFER ON DEV THEME ---');
  networkEvents.length = 0;
  const clickStart = Date.now();

  await send('Runtime.evaluate', {
    expression: `(() => {
      document.getElementById('zvBotanaCtaBtn').click();
    })()`
  });

  let drawerRenderedAt = null;

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 200));
    const now = Date.now();
    const elapsed = now - clickStart;

    const state = await send('Runtime.evaluate', {
      expression: `(() => {
        const drawer = document.getElementById('willaCartDrawer');
        const isActive = drawer?.classList.contains('active');
        const items = document.querySelectorAll('.willa-cart-item').length;
        const subtotal = document.getElementById('willaDrawerSubtotal')?.innerText;
        const headerCount = document.getElementById('willaCartCount')?.innerText;
        return { isActive, items, subtotal, headerCount };
      })()`,
      returnByValue: true
    });

    const v = state.result.value;
    console.log(`[+${elapsed}ms] Drawer active: ${v.isActive} | Items count: ${v.items} | Subtotal: ${v.subtotal} | Count: ${v.headerCount}`);

    if (v.isActive && v.items > 0 && !drawerRenderedAt) {
      drawerRenderedAt = elapsed;
      console.log(`\n🎉 SUCCESS! Cart drawer opened and item rendered in ${drawerRenderedAt}ms!`);
      break;
    }
  }

  console.log('\n--- NETWORK REQUEST SEQUENCE ---');
  networkEvents.forEach(e => {
    console.log(`[+${e.time - clickStart}ms] ${e.type}: ${e.method || e.status} ${e.url}`);
  });

  chromeProc.kill();
}

main().catch(console.error);
