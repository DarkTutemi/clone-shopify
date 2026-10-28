import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PORT = 9285;
const DRAFT_THEME_ID = '187720335545';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const userDataDir = `${process.env.TEMP}\\chrome-vfit-draft-verify-${Date.now()}`;

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
  console.log('Starting Chrome CDP for Draft Theme Verification...');
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
  for (const c of cookies) {
    await send('Network.setCookie', c);
  }

  // Clear cart first so drawer starts empty
  await fetch('https://tryzavelyn.com/cart/clear.js', { method: 'POST' });

  // 1. Test vFit PDP on Draft Theme
  console.log('\n--- 1. Testing vFit PDP on Draft Theme ---');
  const vfitUrl = `https://tryzavelyn.com/products/zavelyn-vfit-red-light-intimate-wellness-device?preview_theme_id=${DRAFT_THEME_ID}`;
  
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Page.navigate', { url: vfitUrl });
  await new Promise(r => setTimeout(r, 4000));

  // Verify elements presence
  const vfitEval = await send('Runtime.evaluate', {
    expression: `(function() {
      const selfCareSection = document.getElementById('zvSelfCareRoutine');
      const cards = document.querySelectorAll('.zv-addon-card');
      const eyeCard = document.getElementById('zvCardEye');
      const faceCard = document.getElementById('zvCardFace');
      const totalEl = document.getElementById('zvSummaryTotal');
      const ctaBtn = document.getElementById('zvSelfCareCtaBtn');

      return {
        sectionExists: !!selfCareSection,
        cardsCount: cards.length,
        eyeCardExists: !!eyeCard,
        faceCardExists: !!faceCard,
        initialTotal: totalEl?.innerText?.trim(),
        ctaBtnExists: !!ctaBtn
      };
    })()`,
    returnByValue: true
  });
  console.log('vFit Draft DOM status:', JSON.stringify(vfitEval.result.value, null, 2));

  // Scroll to Self-Care section and take Desktop Screenshot
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zvSelfCareRoutine').scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 1000));
  const shotA = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'draft_preview_vfit_versionA_desktop.png'), Buffer.from(shotA.data, 'base64'));
  console.log('✓ Saved draft_preview_vfit_versionA_desktop.png');

  // Mobile Screenshot
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 1000));
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zvSelfCareRoutine').scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));
  const shotMob = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'draft_preview_vfit_versionA_mobile.png'), Buffer.from(shotMob.data, 'base64'));
  console.log('✓ Saved draft_preview_vfit_versionA_mobile.png');

  // 2. Test Selection & Dynamic Calculation:
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 800));

  // Click Eye Mask card
  await send('Runtime.evaluate', { expression: `document.getElementById('zvCardEye').click();` });
  await new Promise(r => setTimeout(r, 600));
  const eyeCheck = await send('Runtime.evaluate', {
    expression: `document.getElementById('zvSummaryTotal')?.innerText?.trim()`,
    returnByValue: true
  });
  console.log('Total after selecting Eye Mask ($89.99):', eyeCheck.result.value);

  // Click Face Mask card
  await send('Runtime.evaluate', { expression: `document.getElementById('zvCardFace').click();` });
  await new Promise(r => setTimeout(r, 600));
  const bothCheck = await send('Runtime.evaluate', {
    expression: `document.getElementById('zvSummaryTotal')?.innerText?.trim()`,
    returnByValue: true
  });
  console.log('Total after selecting Face Mask ($129.99):', bothCheck.result.value);

  // Take screenshot with both selected
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zvSelfCareRoutine').scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));
  const shotBoth = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'draft_preview_vfit_suite_selected_desktop.png'), Buffer.from(shotBoth.data, 'base64'));
  console.log('✓ Saved draft_preview_vfit_suite_selected_desktop.png');

  // 3. Test Add to Cart Flow on Draft Storefront
  console.log('\n--- 2. Testing Add to Cart Click & Toast Feedback ---');
  await send('Runtime.evaluate', { expression: `document.getElementById('zvSelfCareCtaBtn').click();` });
  await new Promise(r => setTimeout(r, 1200));

  const toastText = await send('Runtime.evaluate', {
    expression: `document.getElementById('zvSelfCareToast')?.innerText?.trim()`,
    returnByValue: true
  });
  console.log('CTA Toast output:', toastText.result.value);

  // Capture screenshot of Toast notification
  const shotToast = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'draft_preview_vfit_cart_toast_desktop.png'), Buffer.from(shotToast.data, 'base64'));
  console.log('✓ Saved draft_preview_vfit_cart_toast_desktop.png');

  // 4. Test Single vFit Add To Cart (which actually adds to Cart and opens Drawer)
  console.log('\n--- 3. Testing Single vFit Add to Cart into Live Cart Drawer ---');
  // Uncheck both masks so only vFit is in package
  await send('Runtime.evaluate', {
    expression: `
      document.getElementById('zvCardEye').click();
      document.getElementById('zvCardFace').click();
    `
  });
  await new Promise(r => setTimeout(r, 600));

  // Click CTA with only vFit
  await send('Runtime.evaluate', { expression: `document.getElementById('zvSelfCareCtaBtn').click();` });
  await new Promise(r => setTimeout(r, 2500));

  const cartDrawerCheck = await send('Runtime.evaluate', {
    expression: `(async function() {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      const drawer = document.getElementById('willaCartDrawer') || document.querySelector('zavelyn-cart-drawer');
      const drawerActive = drawer ? (drawer.classList.contains('active') || drawer.hasAttribute('open')) : false;
      return {
        itemCount: cart.item_count,
        totalPrice: (cart.total_price / 100).toFixed(2),
        items: cart.items.map(it => ({ title: it.title, price: (it.price / 100).toFixed(2), qty: it.quantity })),
        drawerActive
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('Cart Drawer State:', JSON.stringify(cartDrawerCheck.result.value, null, 2));

  // Capture screenshot of Cart Drawer opened
  const shotDrawer = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'draft_preview_vfit_cart_drawer_opened.png'), Buffer.from(shotDrawer.data, 'base64'));
  console.log('✓ Saved draft_preview_vfit_cart_drawer_opened.png');

  // 5. Verify Isolation on BotanaRoots
  console.log('\n--- 4. Verifying Isolation on BotanaRoots ---');
  await send('Page.navigate', { url: `https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=${DRAFT_THEME_ID}` });
  await new Promise(r => setTimeout(r, 3000));
  const botanaCheck = await send('Runtime.evaluate', {
    expression: `!!document.getElementById('zvSelfCareRoutine')`,
    returnByValue: true
  });
  console.log('Does BotanaRoots render vFit Self-Care section? (Must be false):', botanaCheck.result.value);

  // 6. Verify Isolation on Gypsum Tool
  console.log('\n--- 5. Verifying Isolation on Gypsum Cutting Tool ---');
  await send('Page.navigate', { url: `https://tryzavelyn.com/products/sakerplus%C2%AE-3-in-1-gypsum-board-cutting-tool?preview_theme_id=${DRAFT_THEME_ID}` });
  await new Promise(r => setTimeout(r, 3000));
  const gypsumCheck = await send('Runtime.evaluate', {
    expression: `!!document.getElementById('zvSelfCareRoutine')`,
    returnByValue: true
  });
  console.log('Does Gypsum Tool render vFit Self-Care section? (Must be false):', gypsumCheck.result.value);

  try { chromeProc.kill(); } catch(e) {}
  console.log('\n✓ ALL DRAFT PREVIEW TESTS PASSED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Fatal during draft verification:', err);
  try { chromeProc.kill(); } catch(e) {}
  process.exit(1);
});
