import { spawn } from 'child_process';
import fs from 'fs';

const PORT = 9289;
const LIVE_URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';

async function main() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-verify-live-${Date.now()}`,
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

  console.log(`Navigating to LIVE URL: ${LIVE_URL}`);
  await send('Page.navigate', { url: LIVE_URL });
  await new Promise(r => setTimeout(r, 6500));

  const liveAudit = await send('Runtime.evaluate', {
    expression: `(() => {
      // 1. FAQ Audit
      const allFaqHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, .zv-section-title')).filter(h => h.innerText.toLowerCase().includes('frequently asked questions')).map(h => ({
        tag: h.tagName,
        text: h.innerText.trim(),
        sectionId: h.closest('[id^="shopify-section-"]')?.id,
        isInAccordion: !!h.closest('.zv-botana-faq-section')
      }));

      const accordion = document.querySelector('.zv-botana-faq-section');
      const items = accordion ? Array.from(accordion.querySelectorAll('.zv-botana-faq-item')).map(it => it.querySelector('.zv-botana-faq-qtext')?.innerText.trim()) : [];

      // 2. Static FAQ check
      const staticMatches = [];
      document.querySelectorAll('strong').forEach(s => {
        if (s.innerText.includes('Can I use this on color-treated') && !s.closest('.zv-botana-faq-section')) {
          staticMatches.push(s.outerHTML);
        }
      });

      // 3. Upsell image check
      const upsellImg = document.querySelector('.zv-bottle-upsell-image-box img, .zv-bottle-upsell-preview img');
      const upsellMetrics = upsellImg ? {
        src: upsellImg.src,
        renderedWidth: upsellImg.offsetWidth,
        renderedHeight: upsellImg.offsetHeight
      } : null;

      // 4. Bundle cards check
      const bundleCards = Array.from(document.querySelectorAll('.zv-bundle-card')).map(c => ({
        badge: c.querySelector('.zv-bundle-badge-pill, .zv-bundle-pill')?.innerText.trim(),
        title: c.querySelector('.zv-bundle-title')?.innerText.trim(),
        price: c.querySelector('.zv-bundle-price')?.innerText.trim(),
        selected: c.classList.contains('selected') || c.classList.contains('is-selected')
      }));

      return {
        allFaqHeadingsCount: allFaqHeadings.length,
        allFaqHeadings,
        accordionItemCount: items.length,
        accordionQuestions: items,
        staticMatchesCount: staticMatches.length,
        upsellMetrics,
        bundleCardsCount: bundleCards.length,
        bundleCards
      };
    })()`,
    returnByValue: true
  });

  console.log('\nLIVE STOREFRONT AUDIT RESULT:');
  console.log(JSON.stringify(liveAudit.result?.value, null, 2));

  // Capture Desktop Screenshot of live accordion
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.zv-botana-faq-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const desktopShot = await send('Page.captureScreenshot', { format: 'png' });
  const desktopShotPath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303\\live_storefront_faq_desktop.png';
  fs.writeFileSync(desktopShotPath, Buffer.from(desktopShot.data, 'base64'));
  console.log(`✓ Saved live desktop screenshot: ${desktopShotPath}`);

  // Capture Mobile Screenshot of live accordion & bundle
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 1000));

  const mobileFaqShot = await send('Page.captureScreenshot', { format: 'png' });
  const mobileShotPath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303\\live_storefront_faq_mobile.png';
  fs.writeFileSync(mobileShotPath, Buffer.from(mobileFaqShot.data, 'base64'));
  console.log(`✓ Saved live mobile FAQ screenshot: ${mobileShotPath}`);

  // Scroll to top on mobile to capture live bundle
  await send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 400, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 1000));

  const mobileBundleShot = await send('Page.captureScreenshot', { format: 'png' });
  const mobileBundleShotPath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303\\live_storefront_bundle_mobile.png';
  fs.writeFileSync(mobileBundleShotPath, Buffer.from(mobileBundleShot.data, 'base64'));
  console.log(`✓ Saved live mobile bundle screenshot: ${mobileBundleShotPath}`);

  chromeProc.kill();
}

main().catch(console.error);
