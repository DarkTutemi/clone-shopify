import { spawn } from 'child_process';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3';
const PREVIEW_ROOT = 'https://tryzavelyn.com/?preview_theme_id=187597717689';
const TEST_URL = 'https://tryzavelyn.com/products/sakerplus-fence-post-repair-kit?preview_theme_id=187597717689';

async function testActiveFallback() {
  const initRes = await fetch(PREVIEW_ROOT, { redirect: 'manual' });
  const rawCookies = initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [initRes.headers.get('set-cookie')];
  const essentialCookie = rawCookies.find(c => c && c.startsWith('_shopify_essential='));
  const val = essentialCookie.split(';')[0].replace('_shopify_essential=', '');

  const p = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--remote-debugging-port=9238',
    '--user-data-dir=' + process.env.TEMP + '\\fallback-test-' + Date.now(),
    '--headless=new',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1440,900',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const tabs = await (await fetch('http://127.0.0.1:9238/json')).json();
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
  await send('Page.navigate', { url: TEST_URL });
  await new Promise(r => setTimeout(r, 5000));

  const info = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        title: document.title,
        h1: document.querySelector('h1')?.textContent?.trim(),
        sections: Array.from(document.querySelectorAll('section')).map(s => s.id || s.className),
        hasDescFallback: !!document.querySelector('#zv-product-description'),
        hasFeatures: !!document.querySelector('#zv-features'),
        hasStorytelling: !!document.querySelector('#zv-storytelling'),
        hasDoorstepShipping: !!document.querySelector('#zv-doorstep-delivery'),
        descSnippet: document.querySelector('#zv-product-description')?.textContent?.trim().slice(0, 200)
      };
    })()`,
    returnByValue: true
  });
  console.log('Active fallback product render result:', info.result.value);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const shotPath = `${ARTIFACT_DIR}/audit_active_fallback_fence_post.png`;
  fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
  console.log(`Saved screenshot: ${shotPath}`);

  ws.close();
  p.kill();
}
testActiveFallback().catch(console.error);
