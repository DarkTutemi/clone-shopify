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
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_diag_' + Date.now();
  return spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1440,900'
  ], { detached: true, stdio: 'ignore' });
}

async function run() {
  const port = 9228;
  const chromeProc = launchChrome(port);
  await new Promise(r => setTimeout(r, 2500));

  const essentialCookie = await getPreviewCookie();

  const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
  const wsUrl = pageTab.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

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

  const items = [
    { name: 'collection_handpans', url: `https://tryzavelyn.com/collections/zavelyn-handpans?preview_theme_id=${DRAFT_THEME_ID}` },
    { name: 'product_handpan_master', url: `https://tryzavelyn.com/products/zavelyn-handpan-master?preview_theme_id=${DRAFT_THEME_ID}` }
  ];

  for (const item of items) {
    console.log(`\n=== Testing ${item.name}: ${item.url} ===`);
    await sendCDP('Page.navigate', { url: item.url });
    await new Promise(r => setTimeout(r, 4500));

    // Capture desktop 1440
    await sendCDP('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 1000));

    const shotDesktop = await sendCDP('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(`scripts/diagnose_${item.name}_desktop_1440.png`, Buffer.from(shotDesktop.data, 'base64'));

    // Capture full page top scroll / hero
    const diagDesktop = await sendCDP('Runtime.evaluate', {
      expression: `(() => {
        const stylesheets = Array.from(document.styleSheets).map(s => s.href).filter(Boolean);
        const images = Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          naturalWidth: img.naturalWidth,
          clientWidth: img.clientWidth,
          clientHeight: img.clientHeight,
          parentClass: img.parentElement?.className,
          parentElementTag: img.parentElement?.tagName
        })).filter(i => i.clientWidth > 500);
        
        const sections = Array.from(document.querySelectorAll('[id^="shopify-section-"]')).map(s => ({
          id: s.id,
          offsetHeight: s.offsetHeight,
          headings: Array.from(s.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim()).filter(Boolean)
        }));

        return {
          title: document.title,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          stylesheets: stylesheets.filter(s => s.includes('zhp') || s.includes('elixir') || s.includes('theme') || s.includes('custom')),
          oversizedImages: images.slice(0, 6),
          sections: sections
        };
      })()`,
      returnByValue: true
    });
    console.log('Desktop Diagnostic:', JSON.stringify(diagDesktop.result?.value, null, 2));

    // Capture mobile 390
    await sendCDP('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));

    const shotMobile = await sendCDP('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(`scripts/diagnose_${item.name}_mobile_390.png`, Buffer.from(shotMobile.data, 'base64'));

    const diagMobile = await sendCDP('Runtime.evaluate', {
      expression: `(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      }))()`,
      returnByValue: true
    });
    console.log('Mobile Diagnostic:', JSON.stringify(diagMobile.result?.value, null, 2));
  }

  ws.close();
  try { process.kill(chromeProc.pid); } catch (e) {}
  console.log('Diagnostic completed.');
}

run().catch(console.error);
