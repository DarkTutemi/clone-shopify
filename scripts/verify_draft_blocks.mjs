import { spawn } from 'child_process';
import fs from 'fs';

const PORT = 9291;
const DRAFT_THEME_ID = '187708571833';
const URL = `https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=${DRAFT_THEME_ID}`;

async function main() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-draft-blocks-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,2400',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));
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
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await send('Page.navigate', { url: URL });
  await new Promise(r => setTimeout(r, 6500));

  const result = await send('Runtime.evaluate', {
    expression: `(() => {
      // 1. Check Gallery images
      const mainImg = document.getElementById('zvMainImg');
      const thumbs = Array.from(document.querySelectorAll('.zv-thumb-btn img')).map(img => img.src);

      // 2. Check Body images
      const bodyImages = Array.from(document.querySelectorAll('#zv-product-description img')).map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.offsetWidth,
        height: img.offsetHeight
      }));

      return {
        mainImgSrc: mainImg?.src,
        thumbCount: thumbs.length,
        thumbs: thumbs.slice(0, 4),
        bodyImageCount: bodyImages.length,
        bodyImages
      };
    })()`,
    returnByValue: true
  });

  console.log('Draft Result:\n', JSON.stringify(result.result?.value, null, 2));
  chromeProc.kill();
}

main().catch(console.error);
