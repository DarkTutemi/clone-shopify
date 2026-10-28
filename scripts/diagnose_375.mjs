import { spawn } from 'child_process';


async function diagnose() {
  const port = 9245;
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_diag_' + Date.now();
  const proc = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=375,800'
  ], { detached: true, stdio: 'ignore' });

  await new Promise(r => setTimeout(r, 2000));
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((res, rej) => {
    const curId = id++;
    const handler = evt => {
      const msg = JSON.parse(evt.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        if (msg.error) rej(msg.error);
        else res(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  // Test collection
  console.log('Testing collection at 375px...');
  await send('Page.navigate', { url: 'https://tryzavelyn.com/collections/zavelyn-handpans?preview_theme_id=187597717689' });
  await new Promise(r => setTimeout(r, 4000));
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 800, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 1200));

  const diagCol = await send('Runtime.evaluate', {
    expression: `(() => {
      const sw = document.documentElement.scrollWidth;
      const cw = document.documentElement.clientWidth;
      const list = [];
      document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > 375.5 || el.scrollWidth > 375.5) {
          list.push({
            tag: el.tagName,
            cls: el.className,
            id: el.id,
            scrollW: el.scrollWidth,
            rectRight: Math.round(rect.right),
            rectW: Math.round(rect.width)
          });
        }
      });
      return { sw, cw, list: list.slice(0, 15) };
    })()`,
    returnByValue: true
  });
  console.log('Collection 375px results:\n', JSON.stringify(diagCol.result.value, null, 2));

  // Test product master
  console.log('Testing product master at 375px...');
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-handpan-master?preview_theme_id=187597717689' });
  await new Promise(r => setTimeout(r, 4000));
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 800, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 1200));

  const diagProd = await send('Runtime.evaluate', {
    expression: `(() => {
      const sw = document.documentElement.scrollWidth;
      const cw = document.documentElement.clientWidth;
      const list = [];
      document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > 375.5 || el.scrollWidth > 375.5) {
          list.push({
            tag: el.tagName,
            cls: el.className,
            id: el.id,
            scrollW: el.scrollWidth,
            rectRight: Math.round(rect.right),
            rectW: Math.round(rect.width)
          });
        }
      });
      return { sw, cw, list: list.slice(0, 15) };
    })()`,
    returnByValue: true
  });
  console.log('Product 375px results:\n', JSON.stringify(diagProd.result.value, null, 2));

  ws.close();
  try { proc.kill(); } catch (e) {}
}

diagnose().catch(console.error);
