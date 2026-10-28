import { spawn } from 'child_process';

const PORT = 9299;
const URL = 'https://tryzavelyn.com/pages/botanaroots-bogo-offer';

async function main() {
  console.log('Launching Headless Chrome on port ' + PORT + '...');
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-perf-test-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,1000',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch(`http://127.0.0.1:${PORT}/json`);
  const tabs = await res.json();
  const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let msgId = 1;
  const networkLogs = [];
  const consoleLogs = [];

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
      if (req.url.includes('/cart') || req.url.includes('checkout') || req.url.includes('botana')) {
        networkLogs.push({ time: now, type: 'REQ_START', url: req.url, method: req.method, id: msg.params.requestId });
      }
    }
    if (msg.method === 'Network.responseReceived') {
      const resp = msg.params.response;
      if (resp.url.includes('/cart') || resp.url.includes('checkout') || resp.url.includes('botana')) {
        networkLogs.push({ time: now, type: 'RESP_RECV', url: resp.url, status: resp.status, id: msg.params.requestId });
      }
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push({ time: now, type: msg.params.type, args: msg.params.args.map(a => a.value || a.description) });
    }
  });

  await send('Network.enable');
  await send('Runtime.enable');
  await send('Page.enable');

  console.log(`Navigating to ${URL}...`);
  const navStart = Date.now();
  await send('Page.navigate', { url: URL });
  await new Promise(r => setTimeout(r, 4000));
  console.log(`Page loaded in ${Date.now() - navStart}ms`);

  // Check what cart drawer functions exist on window
  const envCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        hasWillaOpenCartDrawer: typeof window.willaOpenCartDrawer === 'function',
        hasOpenWillaCart: typeof window.openWillaCart === 'function',
        drawerElem: document.querySelector('cart-drawer, #cart-drawer, .cart-drawer, [data-cart-drawer], willa-cart-drawer, zavelyn-cart-drawer')?.tagName,
        ctaBtn: !!document.getElementById('zvBotanaCtaBtn'),
        btnText: document.getElementById('zvBotanaCtaBtn')?.innerText
      };
    })()`,
    returnByValue: true
  });
  console.log('Environment check on page:', JSON.stringify(envCheck.result.value, null, 2));

  // Now trigger CLAIM OFFER
  console.log('\n--- CLICKING CLAIM OFFER BUTTON ---');
  const clickStart = Date.now();
  networkLogs.length = 0; // reset logs to focus on click

  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.getElementById('zvBotanaCtaBtn');
      console.log('CDP: Clicking Claim Offer at t = 0ms');
      btn.click();
    })()`
  });

  // Wait 15 seconds and monitor state every 500ms
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 500));
    const elapsed = Date.now() - clickStart;
    const state = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.getElementById('zvBotanaCtaBtn');
        const text = btn?.innerText?.trim();
        const disabled = btn?.disabled;
        const currentUrl = window.location.href;
        return { text, disabled, currentUrl };
      })()`,
      returnByValue: true
    });
    console.log(`[t = ${elapsed}ms] Button text: "${state.result.value?.text}", disabled: ${state.result.value?.disabled}, URL: ${state.result.value?.currentUrl}`);

    // If URL changed or button restored, check cart
    if (state.result.value?.currentUrl !== URL && !state.result.value?.currentUrl.includes('botanaroots-bogo-offer')) {
      console.log(`Redirected to: ${state.result.value?.currentUrl} at ${elapsed}ms`);
      break;
    }
  }

  console.log('\n--- NETWORK ACTIVITY DURING CLAIM OFFER ---');
  networkLogs.forEach(l => {
    const rel = l.time - clickStart;
    console.log(`[t = +${rel}ms] ${l.type} - ${l.method || l.status} ${l.url}`);
  });

  console.log('\n--- CONSOLE LOGS ---');
  consoleLogs.forEach(l => {
    const rel = l.time - clickStart;
    console.log(`[t = +${rel}ms] [${l.type}]`, l.args.join(' '));
  });

  // Query final cart
  const cartEval = await send('Runtime.evaluate', {
    expression: `(async () => {
      try {
        const res = await fetch('/cart.js');
        const cart = await res.json();
        return {
          itemCount: cart.item_count,
          totalPrice: cart.total_price / 100,
          items: cart.items.map(it => ({ id: it.id, title: it.title, price: it.price / 100 }))
        };
      } catch (e) {
        return { error: e.message };
      }
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('\nFinal Cart State:', JSON.stringify(cartEval.result.value, null, 2));

  chromeProc.kill();
}

main().catch(console.error);
