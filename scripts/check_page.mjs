import { spawn } from 'child_process';

async function check() {
  const initRes = await fetch('https://tryzavelyn.com/?preview_theme_id=187597717689', { redirect: 'manual' });
  const rawCookies = initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [initRes.headers.get('set-cookie')];
  const essentialCookie = rawCookies.find(c => c && c.startsWith('_shopify_essential='));
  const val = essentialCookie.split(';')[0].replace('_shopify_essential=', '');

  const p = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--remote-debugging-port=9227',
    '--user-data-dir=' + process.env.TEMP + '\\check-' + Date.now(),
    '--headless=new',
    '--disable-gpu',
    '--disable-extensions',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const tabs = await (await fetch('http://127.0.0.1:9227/json')).json();
  console.log('All tabs:', tabs.map(t => ({ id: t.id, type: t.type, url: t.url })));

  const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  let id = 1;
  const send = (m, params = {}) => new Promise(res => {
    const cur = id++;
    const h = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method: m, params }));
  });
  await new Promise(r => ws.addEventListener('open', r));
  await send('Network.enable');
  await send('Network.setCookie', {
    name: '_shopify_essential',
    value: val,
    domain: '.tryzavelyn.com',
    path: '/',
    secure: true,
    httpOnly: true
  });
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves?preview_theme_id=187597717689' });
  await new Promise(r => setTimeout(r, 5000));

  const fullEval = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        href: location.href,
        title: document.title,
        htmlLen: document.documentElement.outerHTML.length,
        hasZvDelivery: document.documentElement.outerHTML.includes('zv-doorstep-delivery'),
        has5555: document.documentElement.outerHTML.includes('5555.webp'),
        bodySnippet: document.body.innerText.slice(0, 300)
      };
    })()`,
    returnByValue: true
  });
  console.log('Result:', fullEval.result.value);
  ws.close();
  p.kill();
}
check().catch(console.error);
