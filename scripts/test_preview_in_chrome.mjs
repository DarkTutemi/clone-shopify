import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 9297;
const PREVIEW_ENTRY = 'https://tryzavelyn.com/?preview_theme_id=187736654009';
const BOGO_PAGE_URL = 'https://tryzavelyn.com/pages/botanaroots-bogo-offer?preview_theme_id=187736654009';
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';

async function main() {
  console.log('Launching Headless Chrome on port ' + PORT + '...');
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-bogo-test-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,2500',
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

  // 1. Visit root with preview_theme_id to establish preview session
  console.log('Navigating to preview entry URL...');
  await send('Page.navigate', { url: PREVIEW_ENTRY });
  await new Promise(r => setTimeout(r, 3000));

  // 2. Navigate to BOGO Page
  console.log('Navigating to BOGO Page...');
  await send('Page.navigate', { url: BOGO_PAGE_URL });
  await new Promise(r => setTimeout(r, 4500));

  // 3. Evaluate page contents
  const evalResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const title = document.title;
      const bogoComponent = !!document.getElementById('zvBotanaBogoComponent');
      const cards = document.querySelectorAll('.zv-bundle-card').length;
      const benefits = document.querySelector('.zv-benefits-block')?.textContent?.trim() || '';
      const galleryThumbs = document.querySelectorAll('.zv-thumb-btn').length;
      const mainImg = document.getElementById('zvMainImg')?.src;
      const currentUrl = window.location.href;
      const ctaBtn = !!document.getElementById('zvBotanaCtaBtn');
      const buyNowBtn = !!document.getElementById('zvBotanaBuyNowBtn');
      const descOverview = !!document.getElementById('zv-product-description');
      const doorstep = !!document.getElementById('zv-doorstep-delivery');

      return {
        title,
        currentUrl,
        bogoComponent,
        cardsCount: cards,
        benefitsPreview: benefits.slice(0, 150),
        galleryThumbs,
        mainImg,
        ctaBtn,
        buyNowBtn,
        descOverview,
        doorstep
      };
    })()`,
    returnByValue: true
  });

  console.log('Chrome Evaluation Result:', JSON.stringify(evalResult.result.value, null, 2));

  // 4. Capture screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACT_DIR}/bogo_chrome_test.png`, Buffer.from(shot.data, 'base64'));
  console.log('Screenshot saved to bogo_chrome_test.png');

  chromeProc.kill();
}

main().catch(console.error);
