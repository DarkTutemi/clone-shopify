import fs from 'fs';
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
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_scroll_' + Date.now();
  return spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1440,1200'
  ], { detached: true, stdio: 'ignore' });
}

async function run() {
  const port = 9229;
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

  // 1. Inspect collection page sections
  console.log('Navigating to collection...');
  await sendCDP('Page.navigate', { url: `https://tryzavelyn.com/collections/zavelyn-handpans?preview_theme_id=${DRAFT_THEME_ID}` });
  await new Promise(r => setTimeout(r, 4000));

  // Dismiss cookie banner if present
  await sendCDP('Runtime.evaluate', {
    expression: `(() => {
      const b = document.querySelector('#shopify-pc__banner, .shopify-cookie-banner, [aria-label="Consent banner"]');
      if (b) b.remove();
    })()`
  });

  // Capture multiple scrolls of collection
  for (const scrollY of [0, 800, 1600, 2400, 3200, 4200]) {
    await sendCDP('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY})` });
    await new Promise(r => setTimeout(r, 500));
    const shot = await sendCDP('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(`scripts/col_scroll_${scrollY}.png`, Buffer.from(shot.data, 'base64'));
  }

  // 2. Inspect product handpan master body sections
  console.log('Navigating to product handpan master...');
  await sendCDP('Page.navigate', { url: `https://tryzavelyn.com/products/zavelyn-handpan-master?preview_theme_id=${DRAFT_THEME_ID}` });
  await new Promise(r => setTimeout(r, 4000));

  await sendCDP('Runtime.evaluate', {
    expression: `(() => {
      const b = document.querySelector('#shopify-pc__banner, .shopify-cookie-banner, [aria-label="Consent banner"]');
      if (b) b.remove();
    })()`
  });

  for (const scrollY of [1200, 2000, 2800, 3600]) {
    await sendCDP('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY})` });
    await new Promise(r => setTimeout(r, 500));
    const shot = await sendCDP('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(`scripts/prod_master_scroll_${scrollY}.png`, Buffer.from(shot.data, 'base64'));
  }

  ws.close();
  try { process.kill(chromeProc.pid); } catch (e) {}
  console.log('Scroll screenshots saved.');
}

run().catch(console.error);
