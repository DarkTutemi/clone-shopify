import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PORT = 9255;
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const userDataDir = `${process.env.TEMP}\\chrome-live-post-sync-${Date.now()}`;

const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  'about:blank'
]);

async function main() {
  console.log('Starting headless Chrome CDP session for LIVE STOREFRONT VERIFICATION...');
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
  await send('Network.clearBrowserCookies');

  const baselineMetrics = JSON.parse(fs.readFileSync('backups/locked_botanaroots_live_baseline/botanaroots_live_baseline_metrics.json', 'utf8'));

  const productsToTest = [
    { handle: 'zavelyn-botanaroots-organic-batana-hair-growth-oil', isBotana: true },
    { handle: 'sakerplus®-3-in-1-gypsum-board-cutting-tool', isBotana: false },
    { handle: 'zavelyn-airclear-plugin-negative-ion-air-purifier', isBotana: false },
    { handle: 'zavelyn-automatic-dough-mixer-with-ferment-function', isBotana: false },
    { handle: 'zavelyn-cozyheat-heated-wearable-blanket-sweater', isBotana: false },
    { handle: 'sakerplus®-battery-powered-automatic-chicken-coop-door', isBotana: false }
  ];

  const liveResults = [];

  for (const prod of productsToTest) {
    console.log(`\n========================================`);
    console.log(`LIVE AUDIT: ${prod.handle} (${prod.isBotana ? 'LOCKED BOTANAROOTS' : 'OTHER PRODUCT'})`);
    console.log(`========================================`);

    const liveUrl = `https://tryzavelyn.com/products/${encodeURIComponent(prod.handle)}`;

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url: liveUrl });
    await new Promise(r => setTimeout(r, 4000));

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
    console.log('Live extracted metrics:', JSON.stringify(metrics, null, 2));

    // Capture Desktop Live Screenshot
    const deskShot = await send('Page.captureScreenshot', { format: 'png' });
    const deskShotPath = path.join(ARTIFACTS_DIR, `live_verified_${prod.isBotana ? 'botanaroots' : prod.handle.replace(/[^a-z0-9]/gi, '_').substring(0, 20)}_desktop.png`);
    fs.writeFileSync(deskShotPath, Buffer.from(deskShot.data, 'base64'));
    console.log(`Live desktop screenshot saved: ${deskShotPath}`);

    if (prod.isBotana) {
      // Mobile screenshot for BotanaRoots
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
      });
      await new Promise(r => setTimeout(r, 1000));
      const mobShot = await send('Page.captureScreenshot', { format: 'png' });
      const mobShotPath = path.join(ARTIFACTS_DIR, 'live_verified_botanaroots_mobile.png');
      fs.writeFileSync(mobShotPath, Buffer.from(mobShot.data, 'base64'));
      console.log(`Live mobile screenshot saved: ${mobShotPath}`);

      const matchBaseline = (
        metrics.thumbsCount === baselineMetrics.thumbCount &&
        metrics.bundleCards === baselineMetrics.bundleCardsCount &&
        metrics.bodyImgsCount === baselineMetrics.bodyImageCount
      );

      console.log(`\nLIVE BOTANAROOTS AUDIT RESULT:`);
      console.log(`Thumbs: ${metrics.thumbsCount} (Baseline: ${baselineMetrics.thumbCount}) -> ${metrics.thumbsCount === baselineMetrics.thumbCount ? 'MATCH' : 'MISMATCH'}`);
      console.log(`Bundles: ${metrics.bundleCards} (Baseline: ${baselineMetrics.bundleCardsCount}) -> ${metrics.bundleCards === baselineMetrics.bundleCardsCount ? 'MATCH' : 'MISMATCH'}`);
      console.log(`Body Images: ${metrics.bodyImgsCount} (Baseline: ${baselineMetrics.bodyImageCount}) -> ${metrics.bodyImgsCount === baselineMetrics.bodyImageCount ? 'MATCH' : 'MISMATCH'}`);
      console.log(`OVERALL BOTANAROOTS: ${matchBaseline ? 'BOTANAROOTS: UNCHANGED — VERIFIED' : 'MISMATCH'}`);

      liveResults.push({
        product: prod.handle,
        isBotana: true,
        matchBaseline,
        metrics,
        status: matchBaseline ? 'BOTANAROOTS: UNCHANGED — VERIFIED' : 'MISMATCH'
      });
    } else {
      const isFixed = (metrics.botanaThumbsCount === 0 && !metrics.isMainBotana && metrics.thumbsCount > 0);
      console.log(`\nLIVE NON-BOTANA AUDIT RESULT:`);
      console.log(`Botana thumbs on live: ${metrics.botanaThumbsCount} (Expected: 0) -> ${metrics.botanaThumbsCount === 0 ? 'PASSED' : 'FAILED'}`);
      console.log(`Main img is Botana on live: ${metrics.isMainBotana} (Expected: false) -> ${!metrics.isMainBotana ? 'PASSED' : 'FAILED'}`);
      console.log(`Native thumbnails restored: ${metrics.thumbsCount} images -> ${metrics.thumbsCount > 0 ? 'PASSED' : 'FAILED'}`);
      console.log(`OVERALL ISOLATION: ${isFixed ? 'ISOLATION RESTORED — VERIFIED' : 'FAILED'}`);

      liveResults.push({
        product: prod.handle,
        isBotana: false,
        isFixed,
        metrics,
        status: isFixed ? 'ISOLATION RESTORED — VERIFIED' : 'FAILED'
      });
    }
  }

  fs.writeFileSync('backups/pre_sync_live_backup/live_storefront_final_verification.json', JSON.stringify(liveResults, null, 2));

  try { chromeProc.kill(); } catch(e) {}

  console.log('\n========================================');
  console.log('FINAL LIVE STOREFRONT VERIFICATION SUMMARY');
  console.log('========================================');
  console.log(JSON.stringify(liveResults.map(r => ({ product: r.product, status: r.status, thumbsCount: r.metrics.thumbsCount, botanaThumbs: r.metrics.botanaThumbsCount })), null, 2));
}

main().catch(err => {
  console.error('Fatal in live verification:', err);
  try { chromeProc.kill(); } catch(e) {}
  process.exit(1);
});
