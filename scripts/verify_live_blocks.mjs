import { spawn } from 'child_process';
import fs from 'fs';

const PORT = 9293;
const LIVE_URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';

async function main() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-live-blocks-${Date.now()}`,
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

  await send('Page.navigate', { url: LIVE_URL });
  await new Promise(r => setTimeout(r, 6500));

  const result = await send('Runtime.evaluate', {
    expression: `(() => {
      // 1. Gallery
      const mainImg = document.getElementById('zvMainImg')?.src;
      const thumbs = Array.from(document.querySelectorAll('.zv-thumb-btn img')).map(img => img.src);

      // 2. Body images
      const bodyImages = Array.from(document.querySelectorAll('#zv-product-description img')).map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.offsetWidth,
        height: img.offsetHeight
      }));

      // 3. FAQ check
      const faqTitle = document.querySelector('.zv-botana-faq-title')?.innerText.trim();
      const faqItemCount = document.querySelectorAll('.zv-botana-faq-item').length;

      return {
        mainImg,
        thumbCount: thumbs.length,
        thumbsPreview: thumbs.slice(0, 4),
        bodyImageCount: bodyImages.length,
        bodyImages,
        faqTitle,
        faqItemCount
      };
    })()`,
    returnByValue: true
  });

  console.log('LIVE STOREFRONT VERIFICATION RESULT:\n', JSON.stringify(result.result?.value, null, 2));

  // Take screenshot of gallery
  const galleryShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303\\live_gallery_blocks_verified.png', Buffer.from(galleryShot.data, 'base64'));

  // Scroll to body images and take screenshot
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zv-product-description').scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await new Promise(r => setTimeout(r, 1000));

  const bodyShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303\\live_body_images_blocks_verified.png', Buffer.from(bodyShot.data, 'base64'));

  console.log('✓ Captured live screenshots successfully.');
  chromeProc.kill();
}

main().catch(console.error);
