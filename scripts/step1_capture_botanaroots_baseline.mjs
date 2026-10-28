import fs from 'fs';
import { spawn } from 'child_process';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';
const BOTANAROOTS_URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';
const PORT = 9295;

async function main() {
  const token = await getAccessToken();

  // 1. Create baseline backup folder
  const backupDir = 'backups/locked_botanaroots_live_baseline';
  fs.mkdirSync(backupDir, { recursive: true });

  const assetsToSnapshot = [
    'templates/product.json',
    'sections/zavelyn-pdp-main.liquid',
    'sections/zavelyn-pdp-description-fallback.liquid',
    'sections/zavelyn-pdp-faq.liquid',
    'snippets/botanaroots-bundle-upsell.liquid',
    'snippets/botanaroots-faq-accordion.liquid',
    'assets/botanaroots-bundle.css',
    'assets/botanaroots-bundle.js'
  ];

  console.log('--- SAVING LIVE ASSETS SNAPSHOT ---');
  for (const key of assetsToSnapshot) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.asset?.value) {
        fs.writeFileSync(`${backupDir}/${key.replace(/\//g, '__')}`, data.asset.value);
        console.log(`✓ Snapshotted ${key} (${data.asset.value.length} chars)`);
      }
    }
    await new Promise(r => setTimeout(r, 200));
  }

  // 2. Launch Chrome to capture live baseline screenshots and DOM metrics
  console.log('\n--- CAPTURING LIVE BOTANAROOTS SCREENSHOTS & METRICS ---');
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-baseline-${Date.now()}`,
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

  await send('Page.navigate', { url: BOTANAROOTS_URL });
  await new Promise(r => setTimeout(r, 6500));

  // Extract baseline metrics
  const baselineMetrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const mainImg = document.getElementById('zvMainImg')?.src;
      const thumbs = Array.from(document.querySelectorAll('.zv-thumb-btn img')).map(img => img.src);
      const bundleCards = Array.from(document.querySelectorAll('.zv-bundle-card')).map(c => ({
        text: c.innerText.trim(),
        selected: c.classList.contains('selected') || c.classList.contains('is-selected')
      }));
      const upsellSection = document.querySelector('.zv-bottle-upsell-wrap')?.innerText.trim();
      const ctaBtn = document.getElementById('zvAddToCartBtn')?.innerText.trim();
      const faqHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).filter(h => h.innerText.toLowerCase().includes('frequently asked questions')).map(h => ({
        tag: h.tagName,
        text: h.innerText.trim(),
        section: h.closest('[id^="shopify-section-"]')?.id
      }));
      const faqItems = Array.from(document.querySelectorAll('.zv-botana-faq-item')).map(it => it.querySelector('.zv-botana-faq-qtext')?.innerText.trim());
      const bodyImages = Array.from(document.querySelectorAll('#zv-product-description img')).map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.offsetWidth,
        height: img.offsetHeight
      }));

      return {
        url: window.location.href,
        title: document.title,
        mainImg,
        thumbCount: thumbs.length,
        thumbs,
        bundleCardsCount: bundleCards.length,
        bundleCards,
        upsellSectionExists: !!document.querySelector('.zv-bottle-upsell-wrap'),
        ctaBtn,
        faqHeadings,
        faqItemsCount: faqItems.length,
        faqItems,
        bodyImageCount: bodyImages.length,
        bodyImages
      };
    })()`,
    returnByValue: true
  });

  fs.writeFileSync(`${backupDir}/botanaroots_live_baseline_metrics.json`, JSON.stringify(baselineMetrics.result?.value, null, 2));
  console.log('✓ Saved botanaroots_live_baseline_metrics.json');

  // Desktop screenshot 1: Hero & Buy Box
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  const shot1Path = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303\\botanaroots_live_before_desktop_hero.png';
  fs.writeFileSync(shot1Path, Buffer.from(shot1.data, 'base64'));
  console.log(`✓ Saved desktop hero screenshot: ${shot1Path}`);

  // Desktop screenshot 2: Body & FAQ
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zv-product-description')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await new Promise(r => setTimeout(r, 1000));
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  const shot2Path = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303\\botanaroots_live_before_desktop_body.png';
  fs.writeFileSync(shot2Path, Buffer.from(shot2.data, 'base64'));
  console.log(`✓ Saved desktop body screenshot: ${shot2Path}`);

  // Mobile screenshot: Hero & Bundle
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 350, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 1000));
  const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
  const shotMobilePath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303\\botanaroots_live_before_mobile_bundle.png';
  fs.writeFileSync(shotMobilePath, Buffer.from(shotMobile.data, 'base64'));
  console.log(`✓ Saved mobile screenshot: ${shotMobilePath}`);

  chromeProc.kill();
  console.log('\n======================================================');
  console.log('✓ STEP 1: BOTANAROOTS LIVE BASELINE CAPTURE COMPLETE');
  console.log('======================================================\n');
}

main().catch(console.error);
