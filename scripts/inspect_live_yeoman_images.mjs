import { spawn } from 'child_process';

const PORT = 9291;
const URL = 'https://tryzavelyn.com/products/the-yeoman-sweep';

async function inspectLive() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-yeoman-check-${Date.now()}`,
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

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: URL });
  await new Promise(r => setTimeout(r, 4500));

  const pageImages = await send('Runtime.evaluate', {
    expression: `(() => {
      const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt,
        visible: img.offsetWidth > 0 && img.offsetHeight > 0,
        parentClass: img.parentElement?.className,
        width: img.offsetWidth,
        height: img.offsetHeight
      }));
      return imgs;
    })()`,
    returnByValue: true
  });

  console.log('Total img tags in DOM:', pageImages.result.value.length);
  const oldCdnImages = pageImages.result.value.filter(i => i.src.includes('0651/8299/0379') || i.src.includes('hf_') || i.src.includes('ysp-'));
  console.log('Yeoman custom body images found in live DOM:');
  oldCdnImages.forEach(i => console.log(' - Visible: ' + i.visible + ' | Size: ' + i.width + 'x' + i.height + ' | Parent: ' + i.parentClass + '\n   Src: ' + i.src));

  chromeProc.kill();
}

inspectLive().catch(console.error);
