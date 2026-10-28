import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 9250;
const BOTANA_URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';
const OTHER_URL = 'https://tryzavelyn.com/products/the-yeoman-sweep';

async function verifyQA() {
  console.log('=== STARTING LIVE PDP VERIFICATION & SCREENSHOT CAPTURE ===');

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-qa-verify-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,1200',
    'about:blank'
  ]);

  try {
    await new Promise(r => setTimeout(r, 1500));
    const res = await fetch(`http://127.0.0.1:${PORT}/json`);
    const tabs = await res.json();
    const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
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

    await send('Page.enable');
    await send('DOM.enable');
    await send('Network.enable');

    // ==========================================
    // 1. DESKTOP VERIFICATION - BOTANAROOTS
    // ==========================================
    console.log('\n--- 1. Testing BotanaRoots on Desktop (1280px) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 1000,
      deviceScaleFactor: 2,
      mobile: false
    });

    await send('Page.navigate', { url: BOTANA_URL });
    await new Promise(r => setTimeout(r, 4000));

    // Extract rendered DOM text and metrics
    const desktopDOM = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const intro = document.querySelector('.zv-benefits-block .zv-lead-prop')?.textContent?.trim();
          const bullets = Array.from(document.querySelectorAll('.zv-benefits-block .zv-bullet-item')).map(item => {
            const icon = item.querySelector('.zv-bullet-icon')?.textContent?.trim();
            const text = item.querySelector('span:not(.zv-bullet-icon)')?.textContent?.trim();
            const strong = item.querySelector('strong')?.textContent?.trim();
            return { icon, text, strong };
          });

          // Check bundle cards & prices
          const bundleCards = Array.from(document.querySelectorAll('.zv-bundle-card')).map(card => {
            const title = card.querySelector('.zv-bundle-title')?.textContent?.trim();
            const price = card.querySelector('.zv-bundle-price')?.textContent?.trim();
            const tag = card.querySelector('.zv-bundle-badge')?.textContent?.trim();
            return { title, price, tag };
          });

          // Check size upgrade
          const upgradeCard = document.querySelector('#zvSizeUpgradeCard');
          const upgradeChecked = document.querySelector('#zvSizeUpgradeCheck')?.checked;

          // Check buttons
          const claimBtn = document.querySelector('#zvClaimOfferBtn')?.textContent?.trim();
          const buyNowBtn = document.querySelector('#zvBuyNowBtn')?.textContent?.trim();

          const block = document.querySelector('.zv-benefits-block');
          const rect = block ? block.getBoundingClientRect() : null;
          const pageY = rect ? rect.top + window.scrollY : 0;

          return {
            intro,
            bullets,
            bundleCards,
            upgradeCardExists: !!upgradeCard,
            upgradeChecked,
            claimBtn,
            buyNowBtn,
            rect: rect ? { x: rect.left + window.scrollX, y: pageY, width: rect.width, height: rect.height } : null
          };
        })()
      `,
      returnByValue: true
    });

    console.log('BotanaRoots Rendered DOM Summary:');
    console.log(JSON.stringify(desktopDOM.result?.value, null, 2));

    // Capture Desktop After Screenshot
    const dRect = desktopDOM.result?.value?.rect;
    const desktopShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.max(0, dRect.x - 20),
        y: Math.max(0, dRect.y - 70),
        width: dRect.width + 40,
        height: dRect.height + 140,
        scale: 1
      },
      captureBeyondViewport: true
    });
    fs.writeFileSync('backups/botanaroots_after_benefits_desktop.png', Buffer.from(desktopShot.data, 'base64'));
    console.log('✓ Saved backups/botanaroots_after_benefits_desktop.png');

    // ==========================================
    // 2. MOBILE VERIFICATION - BOTANAROOTS
    // ==========================================
    console.log('\n--- 2. Testing BotanaRoots on Mobile (375px) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));

    const mobileCoords = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.querySelector('.zv-benefits-block');
          const rect = el.getBoundingClientRect();
          const pageY = rect.top + window.scrollY;
          // Check for overflow
          const docWidth = document.documentElement.offsetWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          const hasOverflow = scrollWidth > docWidth;
          return {
            pageY,
            rectHeight: rect.height,
            docWidth,
            scrollWidth,
            hasOverflow
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Mobile coords and overflow check:', mobileCoords.result?.value);
    const mCoords = mobileCoords.result.value;

    const mobileShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 0,
        y: mCoords.pageY - 10,
        width: 375,
        height: mCoords.rectHeight + 30,
        scale: 1
      },
      captureBeyondViewport: true
    });
    fs.writeFileSync('backups/botanaroots_after_benefits_mobile.png', Buffer.from(mobileShot.data, 'base64'));
    console.log('✓ Saved backups/botanaroots_after_benefits_mobile.png');

    // ==========================================
    // 3. CONTROL VERIFICATION - OTHER PRODUCT PAGE
    // ==========================================
    console.log('\n--- 3. Testing Control Product (The Yeoman Sweep) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 1000,
      deviceScaleFactor: 2,
      mobile: false
    });

    await send('Page.navigate', { url: OTHER_URL });
    await new Promise(r => setTimeout(r, 4000));

    const otherDOM = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const title = document.querySelector('h1')?.textContent?.trim();
          const intro = document.querySelector('.zv-benefits-block .zv-lead-prop')?.textContent?.trim();
          const bullets = Array.from(document.querySelectorAll('.zv-benefits-block .zv-bullet-item')).map(item => item.textContent?.trim());
          return { title, intro, bullets };
        })()
      `,
      returnByValue: true
    });
    console.log('Control Product Rendered DOM:');
    console.log(JSON.stringify(otherDOM.result?.value, null, 2));

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

verifyQA().catch(console.error);
