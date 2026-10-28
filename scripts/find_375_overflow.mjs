import { spawn } from 'child_process';

const DRAFT_THEME_ID = '187597717689';

async function getPreviewCookie() {
  const res = await fetch(`https://tryzavelyn.com/?preview_theme_id=${DRAFT_THEME_ID}`);
  const setCookie = res.headers.get('set-cookie') || '';
  const m = setCookie.match(/_shopify_essential=([^;]+)/);
  return m ? m[1] : null;
}

function launchChrome(port) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_find_375_' + Date.now();
  return spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=375,812'
  ], { detached: true, stdio: 'ignore' });
}

async function run() {
  const port = 9238;
  const chromeProc = launchChrome(port);
  await new Promise(r => setTimeout(r, 2500));

  const essentialCookie = await getPreviewCookie();
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

  let msgId = 1;
  function sendCDP(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
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

  await sendCDP('Network.enable');
  await sendCDP('Page.enable');
  if (essentialCookie) {
    await sendCDP('Network.setCookie', {
      name: '_shopify_essential',
      value: essentialCookie,
      domain: 'tryzavelyn.com',
      path: '/'
    });
  }

  await sendCDP('Page.navigate', { url: `https://tryzavelyn.com/collections/zavelyn-handpans?preview_theme_id=${DRAFT_THEME_ID}` });
  await new Promise(r => setTimeout(r, 4500));

  await sendCDP('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 800));

  const elements = await sendCDP('Runtime.evaluate', {
    expression: `(() => {
      const docW = document.documentElement.clientWidth;
      const all = Array.from(document.querySelectorAll('*'));
      const overflowing = [];
      for (const el of all) {
        const rect = el.getBoundingClientRect();
        if (rect.right > docW + 1) {
          overflowing.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            right: rect.right,
            width: rect.width,
            parent: el.parentElement ? el.parentElement.tagName + '.' + el.parentElement.className : null
          });
        }
      }
      return overflowing.slice(0, 10);
    })()`,
    returnByValue: true
  });

  console.log('Elements overflowing 375px on Collection:', JSON.stringify(elements.result.value, null, 2));

  ws.close();
  try { process.kill(chromeProc.pid); } catch (e) {}
}

run().catch(console.error);
