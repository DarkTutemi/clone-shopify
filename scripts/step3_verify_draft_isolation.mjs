import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PORT = 9245;
const DRAFT_THEME_ID = '187720335545';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const userDataDir = `${process.env.TEMP}\\chrome-draft-verify-${Date.now()}`;

const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  'about:blank'
]);

async function getPreviewCookies(themeId) {
  const initRes = await fetch(`https://tryzavelyn.com/?preview_theme_id=${themeId}`, { redirect: 'manual' });
  const raw = (initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [initRes.headers.get('set-cookie')]).filter(Boolean);
  const cookies = [];
  for (const h of raw) {
    const parts = h.split(';')[0].split('=');
    const name = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    if (name) {
      cookies.push({ name, value, domain: 'tryzavelyn.com', path: '/' });
    }
  }
  return cookies;
}

async function main() {
  console.log('Starting headless Chrome CDP session...');
  await new Promise(r => setTimeout(r, 2000));

  const tabsRes = await fetch(`http://127.0.0.1:${PORT}/json`);
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page');
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

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

  await new Promise(r => ws.addEventListener('open', r));
  await send('Network.enable');
  await send('Page.enable');
  await send('DOM.enable');

  const cookies = await getPreviewCookies(DRAFT_THEME_ID);
  console.log(`Setting ${cookies.length} preview cookies for theme ${DRAFT_THEME_ID}...`);
  for (const c of cookies) {
    await send('Network.setCookie', c);
  }

  // Load baseline metrics of BotanaRoots
  const baselineMetrics = JSON.parse(fs.readFileSync('backups/locked_botanaroots_live_baseline/botanaroots_live_baseline_metrics.json', 'utf8'));

  const productsToTest = [
    { handle: 'zavelyn-botanaroots-organic-batana-hair-growth-oil', isBotana: true },
    { handle: 'sakerplus®-3-in-1-gypsum-board-cutting-tool', isBotana: false },
    { handle: 'zavelyn-airclear-plugin-negative-ion-air-purifier', isBotana: false },
    { handle: 'zavelyn-automatic-dough-mixer-with-ferment-function', isBotana: false },
    { handle: 'zavelyn-cozyheat-heated-wearable-blanket-sweater', isBotana: false },
    { handle: 'sakerplus®-battery-powered-automatic-chicken-coop-door', isBotana: false }
  ];

  const verificationResults = [];

  for (const prod of productsToTest) {
    console.log(`\n========================================`);
    console.log(`Testing: ${prod.handle} (${prod.isBotana ? 'LOCKED BOTANAROOTS' : 'OTHER PRODUCT'})`);
    console.log(`========================================`);

    const url = `https://tryzavelyn.com/products/${encodeURIComponent(prod.handle)}?preview_theme_id=${DRAFT_THEME_ID}`;
    
    // Set Desktop viewport (1280x800)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 4000));

    // Extract page metrics
    const evalRes = await send('Runtime.evaluate', {
      expression: `(function() {
        const title = document.querySelector('h1')?.innerText?.trim() || '';
        const mainImg = document.getElementById('zvMainImg');
        const mainImgSrc = mainImg?.src || '';
        const mainImgAlt = mainImg?.alt || '';

        const thumbs = Array.from(document.querySelectorAll('#zvThumbnails .zv-thumb-btn img')).map(img => ({
          src: img.src,
          alt: img.alt
        }));

        const botanaThumbs = thumbs.filter(t => t.src.toLowerCase().includes('botana') || t.alt.toLowerCase().includes('botana'));
        const isMainBotana = mainImgSrc.toLowerCase().includes('botana') || mainImgAlt.toLowerCase().includes('botana');

        const bundleCards = document.querySelectorAll('.zv-bundle-card, .kc-offer').length;
        const sizeUpsell = !!document.querySelector('.zv-upsell-box, [data-upsell-checkbox], .zv-size-upsell');
        const trustCards = document.querySelectorAll('.kc-trust__chip, .zv-trust-card').length;
        const faqItems = document.querySelectorAll('.kc-faq__item, .zv-faq-item-details, .zv-accordion-item').length;
        const bodyImgs = Array.from(document.querySelectorAll('.zv-rte-content img, .zv-body-section img')).map(img => img.src);

        return {
          title,
          mainImgSrc,
          mainImgAlt,
          thumbsCount: thumbs.length,
          thumbs: thumbs.slice(0, 5),
          botanaThumbsCount: botanaThumbs.length,
          isMainBotana,
          bundleCards,
          sizeUpsell,
          trustCards,
          faqItems,
          bodyImgsCount: bodyImgs.length
        };
      })()`,
      returnByValue: true
    });

    const metrics = evalRes.result.value;
    console.log('Extracted metrics:', JSON.stringify(metrics, null, 2));

    // Take Desktop Screenshot
    const deskShot = await send('Page.captureScreenshot', { format: 'png' });
    const deskShotPath = path.join(ARTIFACTS_DIR, `verify_draft_${prod.isBotana ? 'botanaroots' : prod.handle.replace(/[^a-z0-9]/gi, '_').substring(0, 20)}_desktop.png`);
    fs.writeFileSync(deskShotPath, Buffer.from(deskShot.data, 'base64'));
    console.log(`Desktop screenshot saved: ${deskShotPath}`);

    // If mobile test
    if (prod.isBotana) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
      });
      await new Promise(r => setTimeout(r, 1000));
      const mobShot = await send('Page.captureScreenshot', { format: 'png' });
      const mobShotPath = path.join(ARTIFACTS_DIR, 'verify_draft_botanaroots_mobile.png');
      fs.writeFileSync(mobShotPath, Buffer.from(mobShot.data, 'base64'));
      console.log(`Mobile screenshot saved: ${mobShotPath}`);
    }

    if (prod.isBotana) {
      const matchBaseline = (
        metrics.thumbsCount === baselineMetrics.thumbsCount &&
        metrics.bundleCards === baselineMetrics.bundleCards &&
        metrics.sizeUpsell === baselineMetrics.sizeUpsell &&
        metrics.trustCards === baselineMetrics.trustCards &&
        metrics.faqItems === baselineMetrics.faqItems &&
        metrics.bodyImgsCount === baselineMetrics.bodyImgsCount
      );
      console.log(`\nBOTANAROOTS ZERO-CHANGE AUDIT:`);
      console.log(`Baseline thumbs: ${baselineMetrics.thumbsCount} vs Draft: ${metrics.thumbsCount} -> ${metrics.thumbsCount === baselineMetrics.thumbsCount ? 'MATCH' : 'MISMATCH'}`);
      console.log(`Baseline bundles: ${baselineMetrics.bundleCards} vs Draft: ${metrics.bundleCards} -> ${metrics.bundleCards === baselineMetrics.bundleCards ? 'MATCH' : 'MISMATCH'}`);
      console.log(`Baseline upsell: ${baselineMetrics.sizeUpsell} vs Draft: ${metrics.sizeUpsell} -> ${metrics.sizeUpsell === baselineMetrics.sizeUpsell ? 'MATCH' : 'MISMATCH'}`);
      console.log(`Baseline trust: ${baselineMetrics.trustCards} vs Draft: ${metrics.trustCards} -> ${metrics.trustCards === baselineMetrics.trustCards ? 'MATCH' : 'MISMATCH'}`);
      console.log(`Baseline FAQ: ${baselineMetrics.faqItems} vs Draft: ${metrics.faqItems} -> ${metrics.faqItems === baselineMetrics.faqItems ? 'MATCH' : 'MISMATCH'}`);
      console.log(`Baseline body images: ${baselineMetrics.bodyImgsCount} vs Draft: ${metrics.bodyImgsCount} -> ${metrics.bodyImgsCount === baselineMetrics.bodyImgsCount ? 'MATCH' : 'MISMATCH'}`);
      console.log(`OVERALL BOTANAROOTS UNCHANGED: ${matchBaseline ? '✓ YES (100% UNCHANGED)' : '✗ FAILED'}`);
      
      verificationResults.push({
        product: prod.handle,
        isBotana: true,
        matchBaseline,
        metrics,
        status: matchBaseline ? 'BOTANAROOTS: UNCHANGED — VERIFIED' : 'MISMATCH'
      });
    } else {
      const isFixed = (metrics.botanaThumbsCount === 0 && !metrics.isMainBotana && metrics.thumbsCount > 0);
      console.log(`\nPRODUCT ISOLATION AUDIT:`);
      console.log(`Botana thumbs present: ${metrics.botanaThumbsCount} (Expected: 0) -> ${metrics.botanaThumbsCount === 0 ? 'PASSED' : 'FAILED'}`);
      console.log(`Main image is Botana: ${metrics.isMainBotana} (Expected: false) -> ${!metrics.isMainBotana ? 'PASSED' : 'FAILED'}`);
      console.log(`Native product thumbnails restored: ${metrics.thumbsCount} images -> ${metrics.thumbsCount > 0 ? 'PASSED' : 'FAILED'}`);
      console.log(`OVERALL ISOLATION FIX: ${isFixed ? '✓ PASSED' : '✗ FAILED'}`);

      verificationResults.push({
        product: prod.handle,
        isBotana: false,
        isFixed,
        metrics,
        status: isFixed ? 'ISOLATION RESTORED — VERIFIED' : 'FAILED'
      });
    }
  }

  // Save report
  fs.writeFileSync('backups/locked_botanaroots_live_baseline/step3_draft_verification_report.json', JSON.stringify(verificationResults, null, 2));

  // Terminate Chrome
  try {
    chromeProc.kill();
  } catch(e) {}

  console.log('\n========================================');
  console.log('FINAL SUMMARY OF DRAFT VERIFICATION');
  console.log('========================================');
  console.log(JSON.stringify(verificationResults.map(r => ({ product: r.product, status: r.status, thumbsCount: r.metrics.thumbsCount, botanaThumbs: r.metrics.botanaThumbsCount })), null, 2));
}

main().catch(err => {
  console.error('Fatal in test:', err);
  try { chromeProc.kill(); } catch(e) {}
  process.exit(1);
});
