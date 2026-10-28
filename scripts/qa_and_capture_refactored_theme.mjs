import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const OUTPUT_DIR = 'assets/botanaroots_qa_after_refactor';
const DRAFT_THEME_ID = '187708571833';
const PDP_URL = `https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=${DRAFT_THEME_ID}`;
const REGRESSION_URL = `https://tryzavelyn.com/products/the-yeoman-sweep?preview_theme_id=${DRAFT_THEME_ID}`;
const PORT = 9265;

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function main() {
  console.log('========================================================================');
  console.log(`EXECUTING FULL QA & SCREENSHOT CAPTURE ON DRAFT THEME ${DRAFT_THEME_ID}`);
  console.log('========================================================================\n');

  const userDataDir = `${process.env.TEMP}\\chrome-qa-refactor-${Date.now()}`;
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,1200',
    'about:blank'
  ]);

  let tabs = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      tabs = await res.json();
      if (tabs && tabs.length > 0) break;
    } catch (e) {}
  }

  const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

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

  console.log(`Navigating to Draft Preview: ${PDP_URL}...`);
  await send('Page.navigate', { url: PDP_URL });
  await new Promise(r => setTimeout(r, 6000));

  async function captureDocClip(filename, selector, pad = 12) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.querySelectorAll('#preview-bar-iframe, #shopify-pc__banner, .shopify-preview-bar, iframe, .zv-sticky-atc-wrap').forEach(el => el.remove());
        const comp = document.querySelector('${selector}');
        if (comp) comp.scrollIntoView({ block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left + window.scrollX,
          y: r.top + window.scrollY,
          width: r.width,
          height: r.height
        };
      })()`,
      returnByValue: true
    });
    const coords = res.result?.value;
    if (!coords) {
      console.warn(`Element ${selector} not found for screenshot ${filename}`);
      return;
    }

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.max(0, coords.x - pad),
        y: Math.max(0, coords.y - pad),
        width: coords.width + pad * 2,
        height: coords.height + pad * 2,
        scale: 1
      },
      captureBeyondViewport: true
    });
    const buf = Buffer.from(shot.data, 'base64');
    fs.writeFileSync(`${OUTPUT_DIR}/${filename}`, buf);
    fs.writeFileSync(`${ARTIFACT_DIR}/${filename}`, buf);
    console.log(`📸 Saved QA Screenshot: ${filename} (${Math.round(buf.length / 1024)} KB)`);
  }

  // Viewport QA Results Object
  const qaResults = {
    viewports: {},
    functionalMatrix: {},
    faqTests: {},
    trustCardsTest: {},
    regressionTest: {}
  };

  const testViewports = [
    { name: 'desktop_1440', width: 1440, height: 1000, mobile: false, scale: 1 },
    { name: 'desktop_1280', width: 1280, height: 900, mobile: false, scale: 1 },
    { name: 'tablet_768', width: 768, height: 1024, mobile: false, scale: 1 },
    { name: 'mobile_430', width: 430, height: 932, mobile: true, scale: 2 },
    { name: 'mobile_390', width: 390, height: 844, mobile: true, scale: 2 },
    { name: 'mobile_375', width: 375, height: 812, mobile: true, scale: 2 },
    { name: 'mobile_320', width: 320, height: 640, mobile: true, scale: 2 }
  ];

  for (const vp of testViewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.scale,
      mobile: vp.mobile
    });
    await new Promise(r => setTimeout(r, 600));

    const checkRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const root = document.documentElement;
        const body = document.body;
        const scrollW = root.scrollWidth;
        const innerW = window.innerWidth;
        const hasHorizontalOverflow = scrollW > innerW + 1;

        const bundle = document.querySelector('#zvBotanaBundleComponent');
        const buy3 = document.querySelector('#zvCardBuy3');
        const upsellImg = document.querySelector('.zv-upsell-img-wrap');
        const trustCards = Array.from(document.querySelectorAll('.zv-botana-trust .kc-trust__chip, .kc-trust .kc-trust__chip'));
        const faqs = Array.from(document.querySelectorAll('.zv-botana-faq details, .kc-faq details'));

        return {
          viewport: ${vp.width},
          scrollWidth: scrollW,
          innerWidth: innerW,
          hasHorizontalOverflow,
          bundleWidth: bundle ? bundle.offsetWidth : null,
          buy3Height: buy3 ? buy3.offsetHeight : null,
          upsellImgWidth: upsellImg ? upsellImg.offsetWidth : null,
          upsellImgHeight: upsellImg ? upsellImg.offsetHeight : null,
          trustCardCount: trustCards.length,
          trustCardsVisible: trustCards.filter(c => c.offsetHeight > 0).length,
          trustCardsHeadings: trustCards.map(c => c.querySelector('.kc-trust__title')?.innerText?.trim()),
          faqCount: faqs.length,
          faqOpenOnLoad: faqs.filter(f => f.hasAttribute('open')).length
        };
      })()`,
      returnByValue: true
    });

    qaResults.viewports[vp.name] = checkRes.result?.value;
    console.log(`- Overflow: ${qaResults.viewports[vp.name]?.hasHorizontalOverflow ? 'FAIL (OVERFLOW)' : 'PASS (NO OVERFLOW)'}`);
    console.log(`- Upsell Img Dimensions: ${qaResults.viewports[vp.name]?.upsellImgWidth}x${qaResults.viewports[vp.name]?.upsellImgHeight}px`);
    console.log(`- Trust Cards: ${qaResults.viewports[vp.name]?.trustCardsVisible}/${qaResults.viewports[vp.name]?.trustCardCount} visible`);
    console.log(`- FAQ Open On Load: ${qaResults.viewports[vp.name]?.faqOpenOnLoad}/${qaResults.viewports[vp.name]?.faqCount}`);

    // Capture screenshots for representative sizes
    if (vp.name === 'desktop_1440') {
      await captureDocClip('after_bundle_desktop_1440.png', '#zvBotanaBundleComponent', 16);
    } else if (vp.name === 'mobile_390') {
      await captureDocClip('after_bundle_mobile_390.png', '#zvBotanaBundleComponent', 8);
      await captureDocClip('after_trust_cards_mobile_390.png', '.zv-botana-trust, .kc-trust', 8);
      await captureDocClip('after_short_faq_mobile_390.png', '.zv-botana-faq, .kc-faq', 8);
    } else if (vp.name === 'mobile_375') {
      await captureDocClip('after_bundle_mobile_375.png', '#zvBotanaBundleComponent', 8);
    } else if (vp.name === 'mobile_430') {
      await captureDocClip('after_bundle_mobile_430.png', '#zvBotanaBundleComponent', 8);
    } else if (vp.name === 'mobile_320') {
      await captureDocClip('after_bundle_mobile_320.png', '#zvBotanaBundleComponent', 6);
    }
  }

  // --- Functional Matrix QA: Test all 6 Bundle x Bottle Size combinations ---
  console.log('\n--- Testing Functional Matrix (6 Bundle x Bottle Size Combinations) ---');
  // Reset to 390px mobile
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 400));

  const combinations = [
    { bundle: 3, cardId: '#zvCardBuy3', upgrade: false, expectedTotal: '$95.99', expectedUnit: '$32.00 / bottle' },
    { bundle: 3, cardId: '#zvCardBuy3', upgrade: true, expectedTotal: '$125.99', expectedUnit: '$42.00 / bottle' },
    { bundle: 2, cardId: '#zvCardBuy2', upgrade: false, expectedTotal: '$79.98', expectedUnit: '$39.99 / bottle' },
    { bundle: 2, cardId: '#zvCardBuy2', upgrade: true, expectedTotal: '$99.98', expectedUnit: '$49.99 / bottle' },
    { bundle: 1, cardId: '#zvCardBuy1', upgrade: false, expectedTotal: '$39.99', expectedUnit: '$39.99 / bottle' },
    { bundle: 1, cardId: '#zvCardBuy1', upgrade: true, expectedTotal: '$49.99', expectedUnit: '$49.99 / bottle' }
  ];

  for (const c of combinations) {
    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('${c.cardId}');
        if (card) card.click();
        const chk = document.querySelector('#zvSizeUpgradeCheck');
        if (chk && chk.checked !== ${c.upgrade}) {
          chk.checked = ${c.upgrade};
          chk.dispatchEvent(new Event('change', { bubbles: true }));
        }
        const total = document.querySelector('#zvSummaryTotal')?.innerText?.trim();
        const unit = document.querySelector('#zvSummaryUnitPill')?.innerText?.trim();
        const ctaPrice = document.querySelector('#zvCtaPrice')?.innerText?.trim();
        const cardActive = card?.classList.contains('selected');
        const pkg = document.querySelector('#zvSummaryPackage')?.innerText?.trim();
        return { total, unit, ctaPrice, cardActive, pkg };
      })()`,
      returnByValue: true
    });
    await new Promise(r => setTimeout(r, 200));

    const val = res.result?.value;
    const key = `Buy ${c.bundle} - ${c.upgrade ? '120ml Upgrade' : '60ml Standard'}`;
    const pass = val?.total === c.expectedTotal && val?.unit === c.expectedUnit;
    qaResults.functionalMatrix[key] = {
      expected: `${c.expectedTotal} (${c.expectedUnit})`,
      actual: `${val?.total} (${val?.unit})`,
      ctaPrice: val?.ctaPrice,
      packageText: val?.pkg,
      pass
    };
    console.log(`- ${key}: ${pass ? 'PASS' : 'FAIL'} => Total: ${val?.total}, Unit: ${val?.unit}`);
  }

  // --- FAQ Accordion Interactive QA ---
  console.log('\n--- Testing FAQ Accordion Toggle Interaction ---');
  const faqInteractionRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const detailsList = Array.from(document.querySelectorAll('.zv-botana-faq details, .kc-faq details'));
      const initialOpenCount = detailsList.filter(d => d.hasAttribute('open')).length;

      // Click first item to open
      const firstSummary = detailsList[0]?.querySelector('summary');
      if (firstSummary) firstSummary.click();
      const openAfterFirstClick = detailsList[0]?.hasAttribute('open');

      // Click first item again to close
      if (firstSummary) firstSummary.click();
      const closedAfterSecondClick = !detailsList[0]?.hasAttribute('open');

      return {
        totalFaqs: detailsList.length,
        initialOpenCount,
        openAfterFirstClick,
        closedAfterSecondClick
      };
    })()`,
    returnByValue: true
  });
  qaResults.faqTests = faqInteractionRes.result?.value;
  console.log('- Default Closed on Load:', qaResults.faqTests?.initialOpenCount === 0 ? 'PASS (0 open)' : 'FAIL');
  console.log('- Opens on Click:', qaResults.faqTests?.openAfterFirstClick ? 'PASS' : 'FAIL');
  console.log('- Closes on Second Click:', qaResults.faqTests?.closedAfterSecondClick ? 'PASS' : 'FAIL');

  // Capture FAQ open state screenshot
  await send('Runtime.evaluate', {
    expression: `(() => {
      const firstSummary = document.querySelector('.zv-botana-faq details summary, .kc-faq details summary');
      if (firstSummary) firstSummary.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 400));
  await captureDocClip('after_faq_interactive_open_mobile.png', '.zv-botana-faq, .kc-faq', 8);

  // --- Extended FAQ Section Check ---
  console.log('\n--- Checking Extended FAQ in Body ---');
  const extFaqRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const extSection = document.querySelector('#zv-extended-faq');
      if (!extSection) return { present: false };
      const items = Array.from(extSection.querySelectorAll('.zv-faq-item-details, .zv-faq-item'));
      return {
        present: true,
        itemCount: items.length,
        questions: Array.from(extSection.querySelectorAll('summary, button')).map(el => el.innerText.trim())
      };
    })()`,
    returnByValue: true
  });
  console.log('Extended FAQ status:', extFaqRes.result?.value);
  if (extFaqRes.result?.value?.present) {
    await captureDocClip('after_extended_faq_body.png', '#zv-extended-faq', 12);
  }

  // --- Regression Test on Another PDP ---
  console.log(`\n--- Regression Test on Another PDP (${REGRESSION_URL}) ---`);
  await send('Page.navigate', { url: REGRESSION_URL });
  await new Promise(r => setTimeout(r, 5000));

  const regRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const title = document.querySelector('h1')?.innerText?.trim();
      const hasBotanaBundle = !!document.querySelector('#zvBotanaBundleComponent');
      const hasStandardPdp = !!document.querySelector('.product__info-wrapper, .kc-pdp, form[action*="/cart/add"]');
      return {
        title,
        hasBotanaBundle,
        hasStandardPdp,
        url: window.location.href
      };
    })()`,
    returnByValue: true
  });

  qaResults.regressionTest = regRes.result?.value;
  console.log(`- Page Title: "${qaResults.regressionTest?.title}"`);
  console.log(`- BotanaBundle leaked: ${qaResults.regressionTest?.hasBotanaBundle ? 'YES (REGRESSION LEAK!)' : 'NO (SCOPED PERFECTLY)'}`);
  console.log(`- Standard PDP intact: ${qaResults.regressionTest?.hasStandardPdp ? 'YES (INTACT)' : 'NO'}`);

  // Save full QA Matrix json
  fs.writeFileSync('draft_working/qa_verification_results.json', JSON.stringify(qaResults, null, 2));
  fs.writeFileSync(`${ARTIFACT_DIR}/qa_verification_results.json`, JSON.stringify(qaResults, null, 2));
  console.log('\n✓ Saved full QA matrix to draft_working/qa_verification_results.json');

  chromeProc.kill();
  console.log('\n========================================================================');
  console.log('QA & SCREENSHOT CAPTURE PROCESS COMPLETED SUCCESSFULLY');
  console.log('========================================================================\n');
}

main().catch(err => {
  console.error('QA script error:', err);
  process.exit(1);
});
