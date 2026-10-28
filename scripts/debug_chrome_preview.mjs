import { spawn } from 'child_process';

const PORT = 9237;
const userDataDir = `${process.env.TEMP}\\chrome-test-${Date.now()}`;
const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  'about:blank'
]);

async function main() {
  await new Promise(r => setTimeout(r, 1500));
  const tabsRes = await fetch(`http://127.0.0.1:${PORT}/json`);
  const tabs = await tabsRes.json();
  console.log('All tabs:', tabs.map(t => ({ type: t.type, url: t.url })));

  const pageTab = tabs.find(t => t.type === 'page');
  console.log('Target page tab:', pageTab?.url);

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

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

  await new Promise(r => ws.addEventListener('open', r));
  await send('Network.enable');

  // get preview cookie
  const initRes = await fetch('https://tryzavelyn.com/?preview_theme_id=187702804665', { redirect: 'manual' });
  const raw = (initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [initRes.headers.get('set-cookie')]);
  const cookieHeader = raw.find(c => c && c.startsWith('_shopify_essential='));
  const cookieVal = cookieHeader ? cookieHeader.split(';')[0].replace('_shopify_essential=', '') : null;

  if (cookieVal) {
    await send('Network.setCookie', {
      name: '_shopify_essential',
      value: cookieVal,
      domain: 'tryzavelyn.com',
      path: '/',
      secure: true,
      httpOnly: true
    });
    console.log('Set _shopify_essential cookie');
  }

  console.log('Navigating to BotanaRoots PDP...');
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil' });
  await new Promise(r => setTimeout(r, 6000));

  const check = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        url: window.location.href,
        hasContainer: !!document.getElementById('zvBotanaBundleComponent'),
        title: document.title,
        bodyLen: document.body.innerHTML.length
      };
    })()`,
    returnByValue: true
  });
  console.log('Page check result:', check.result?.value);

  chromeProc.kill();
}

main().catch(err => {
  console.error(err);
  chromeProc.kill();
});
