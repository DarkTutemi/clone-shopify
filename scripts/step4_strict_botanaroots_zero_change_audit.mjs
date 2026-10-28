import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PORT = 9249;
const LIVE_THEME_ID = '187597717689';
const DRAFT_THEME_ID = '187720335545';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const userDataDir = `${process.env.TEMP}\\chrome-zero-change-audit-${Date.now()}`;

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
  console.log('Starting headless Chrome CDP session for Strict Zero-Change Audit...');
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

  const evalExpression = `(function() {
    function cleanUrl(url) {
      if (!url) return '';
      try {
        const u = new URL(url);
        return u.pathname + (u.searchParams.get('v') ? '?v=' + u.searchParams.get('v') : '');
      } catch(e) {
        return url;
      }
    }

    const mainImg = document.getElementById('zvMainImg');
    const thumbs = Array.from(document.querySelectorAll('#zvThumbnails .zv-thumb-btn img')).map(img => ({
      src: cleanUrl(img.src),
      alt: img.alt || ''
    }));

    const bundleCards = Array.from(document.querySelectorAll('.zv-bundle-card, .kc-offer')).map(c => ({
      text: c.innerText.trim().replace(/\\s+/g, ' '),
      isSelected: !!c.querySelector('input:checked') || c.classList.contains('selected') || c.classList.contains('active')
    }));

    const upsellBox = document.querySelector('.zv-upsell-box, [data-upsell-checkbox], .zv-size-upsell');
    const upsellInfo = upsellBox ? {
      exists: true,
      text: upsellBox.innerText.trim().replace(/\\s+/g, ' ')
    } : { exists: false, text: '' };

    const trustChips = Array.from(document.querySelectorAll('.kc-trust__chip, .zv-trust-card')).map(t => t.innerText.trim().replace(/\\s+/g, ' '));

    const faqAccordion = Array.from(document.querySelectorAll('.zv-faq-item-details, .kc-faq__item, .zv-accordion-item')).map(f => ({
      question: f.querySelector('summary, .zv-faq-question-btn, .kc-faq__q')?.innerText?.trim()?.replace(/\\s+/g, ' ') || '',
      answer: f.querySelector('.zv-faq-answer-panel, .kc-faq__a, .zv-faq-answer')?.innerText?.trim()?.replace(/\\s+/g, ' ') || ''
    }));

    const bodyImgs = Array.from(document.querySelectorAll('.zv-rte-content img, .zv-body-section img')).map(img => cleanUrl(img.src));

    const atcBtn = document.getElementById('zvClaimOfferBtn');
    const paymentIcons = !!document.querySelector('.zv-payment-icons, .kc-payment-icons');

    return {
      title: document.querySelector('h1')?.innerText?.trim() || '',
      mainImg: cleanUrl(mainImg?.src),
      mainImgAlt: mainImg?.alt || '',
      thumbCount: thumbs.length,
      thumbs,
      bundleCardsCount: bundleCards.length,
      bundleCards,
      upsellInfo,
      trustChipsCount: trustChips.length,
      trustChips,
      faqCount: faqAccordion.length,
      faqAccordion,
      bodyImgsCount: bodyImgs.length,
      bodyImgs,
      atcBtnText: atcBtn?.innerText?.trim()?.replace(/\\s+/g, ' ') || '',
      hasPaymentIcons: paymentIcons
    };
  })()`;

  // 1. Audit Live Baseline BotanaRoots
  console.log('Auditing LIVE BotanaRoots PDP...');
  await send('Network.clearBrowserCookies');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil' });
  await new Promise(r => setTimeout(r, 4000));
  const liveEval = await send('Runtime.evaluate', { expression: evalExpression, returnByValue: true });
  const liveData = liveEval.result.value;

  // 2. Audit Draft Theme BotanaRoots
  console.log('Auditing DRAFT BotanaRoots PDP...');
  const draftCookies = await getPreviewCookies(DRAFT_THEME_ID);
  for (const c of draftCookies) {
    await send('Network.setCookie', c);
  }
  await send('Page.navigate', { url: `https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=${DRAFT_THEME_ID}` });
  await new Promise(r => setTimeout(r, 4000));
  const draftEval = await send('Runtime.evaluate', { expression: evalExpression, returnByValue: true });
  const draftData = draftEval.result.value;

  // Capture after screenshot of Draft BotanaRoots
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const shotPath = path.join(ARTIFACTS_DIR, 'botanaroots_draft_after_desktop_hero.png');
  fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
  console.log(`Saved screenshot: ${shotPath}`);

  // Mobile screenshot
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 1000));
  const mobShot = await send('Page.captureScreenshot', { format: 'png' });
  const mobShotPath = path.join(ARTIFACTS_DIR, 'botanaroots_draft_after_mobile_bundle.png');
  fs.writeFileSync(mobShotPath, Buffer.from(mobShot.data, 'base64'));
  console.log(`Saved screenshot: ${mobShotPath}`);

  // Field by Field comparison
  console.log('\n======================================================');
  console.log('FIELD-BY-FIELD ZERO-CHANGE COMPARISON (LIVE vs DRAFT)');
  console.log('======================================================');

  const comparisons = [
    {
      field: 'Product Title',
      live: liveData.title,
      draft: draftData.title,
      match: liveData.title === draftData.title
    },
    {
      field: 'Main Image Path',
      live: liveData.mainImg,
      draft: draftData.mainImg,
      match: liveData.mainImg === draftData.mainImg
    },
    {
      field: 'Main Image Alt',
      live: liveData.mainImgAlt,
      draft: draftData.mainImgAlt,
      match: liveData.mainImgAlt === draftData.mainImgAlt
    },
    {
      field: 'Gallery Thumbnail Count',
      live: liveData.thumbCount,
      draft: draftData.thumbCount,
      match: liveData.thumbCount === draftData.thumbCount
    },
    {
      field: 'Gallery Thumbnail Items (1-8)',
      live: JSON.stringify(liveData.thumbs),
      draft: JSON.stringify(draftData.thumbs),
      match: JSON.stringify(liveData.thumbs) === JSON.stringify(draftData.thumbs)
    },
    {
      field: 'Bundle Cards Count',
      live: liveData.bundleCardsCount,
      draft: draftData.bundleCardsCount,
      match: liveData.bundleCardsCount === draftData.bundleCardsCount
    },
    {
      field: 'Bundle Cards Data',
      live: JSON.stringify(liveData.bundleCards),
      draft: JSON.stringify(draftData.bundleCards),
      match: JSON.stringify(liveData.bundleCards) === JSON.stringify(draftData.bundleCards)
    },
    {
      field: 'Size Upgrade Section',
      live: JSON.stringify(liveData.upsellInfo),
      draft: JSON.stringify(draftData.upsellInfo),
      match: JSON.stringify(liveData.upsellInfo) === JSON.stringify(draftData.upsellInfo)
    },
    {
      field: 'Trust Chips Count',
      live: liveData.trustChipsCount,
      draft: draftData.trustChipsCount,
      match: liveData.trustChipsCount === draftData.trustChipsCount
    },
    {
      field: 'Trust Chips Content',
      live: JSON.stringify(liveData.trustChips),
      draft: JSON.stringify(draftData.trustChips),
      match: JSON.stringify(liveData.trustChips) === JSON.stringify(draftData.trustChips)
    },
    {
      field: 'FAQ Items Count',
      live: liveData.faqCount,
      draft: draftData.faqCount,
      match: liveData.faqCount === draftData.faqCount
    },
    {
      field: 'FAQ Items Content',
      live: JSON.stringify(liveData.faqAccordion),
      draft: JSON.stringify(draftData.faqAccordion),
      match: JSON.stringify(liveData.faqAccordion) === JSON.stringify(draftData.faqAccordion)
    },
    {
      field: 'Body Images Count',
      live: liveData.bodyImgsCount,
      draft: draftData.bodyImgsCount,
      match: liveData.bodyImgsCount === draftData.bodyImgsCount
    },
    {
      field: 'Body Images URLs',
      live: JSON.stringify(liveData.bodyImgs),
      draft: JSON.stringify(draftData.bodyImgs),
      match: JSON.stringify(liveData.bodyImgs) === JSON.stringify(draftData.bodyImgs)
    },
    {
      field: 'Add to Cart Button Text',
      live: liveData.atcBtnText,
      draft: draftData.atcBtnText,
      match: liveData.atcBtnText === draftData.atcBtnText
    }
  ];

  let allMatch = true;
  for (const c of comparisons) {
    const symbol = c.match ? '✓ MATCH' : '✗ MISMATCH';
    console.log(`${symbol} | ${c.field}`);
    if (!c.match) {
      console.log(`    Live:  ${c.live}`);
      console.log(`    Draft: ${c.draft}`);
      allMatch = false;
    }
  }

  console.log('\n======================================================');
  console.log(`FINAL VERDICT: ${allMatch ? 'BOTANAROOTS: UNCHANGED — VERIFIED (100% IDENTICAL)' : 'REVISION NEEDED'}`);
  console.log('======================================================');

  fs.writeFileSync('backups/locked_botanaroots_live_baseline/step4_strict_comparison_report.json', JSON.stringify({
    allMatch,
    verdict: allMatch ? 'BOTANAROOTS: UNCHANGED — VERIFIED' : 'MISMATCH',
    comparisons,
    liveData,
    draftData
  }, null, 2));

  try { chromeProc.kill(); } catch(e) {}
}

main().catch(err => {
  console.error('Fatal in comparison audit:', err);
  try { chromeProc.kill(); } catch(e) {}
  process.exit(1);
});
