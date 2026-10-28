import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const STORE_DOMAIN = 'https://tryzavelyn.com';

const prod3 = {
  rawId: '15454948556985',
  gid: 'gid://shopify/Product/15454948556985',
  name: 'Tearable Shelf & Drawer Liner',
  oldHandle: 'sakerplus®-tearable-shelf-liner-and-drawer-liner',
  proposedTitle: 'Zavelyn Tearable Shelf & Drawer Liner',
  proposedSeoTitle: 'Tearable Shelf & Drawer Mat Liner for Kitchen | Zavelyn',
  proposedMetaDesc: 'Protect shelves, cabinets, and drawers from spills, moisture, and scratches with textured EVA liners. Perforated design pulls apart by hand for a custom fit.',
  proposedHandle: 'zavelyn-shelf-drawer-liner'
};

function launchChrome(port) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_qa_p3_snap_' + Date.now();
  return spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,900'
  ], { detached: true, stdio: 'ignore' });
}

async function takeScreenshotsCDP(url, filePrefix) {
  const port = 9230;
  const proc = launchChrome(port);
  await new Promise(r => setTimeout(r, 2000));

  try {
    const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((res, rej) => {
        const id = msgId++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === id) {
            ws.removeEventListener('message', handler);
            if (msg.error) rej(msg.error);
            else res(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');

    // Desktop
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 4000));
    const snapDesk = await send('Page.captureScreenshot', { format: 'png' });
    const deskPath = path.join(ARTIFACTS_DIR, `${filePrefix}_desktop_1440.png`);
    fs.writeFileSync(deskPath, Buffer.from(snapDesk.data, 'base64'));

    // Mobile
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 2500));
    const snapMob = await send('Page.captureScreenshot', { format: 'png' });
    const mobPath = path.join(ARTIFACTS_DIR, `${filePrefix}_mobile_390.png`);
    fs.writeFileSync(mobPath, Buffer.from(snapMob.data, 'base64'));

    ws.close();
    proc.kill();
    return { deskPath, mobPath };
  } catch (err) {
    proc.kill();
    console.error('CDP error:', err.message);
    return null;
  }
}

async function verifyProduct3() {
  console.log('=== VERIFYING PRODUCT 3 QA WITH CONTROLLED INTERVALS ===\n');
  const token = await getAccessToken();

  // 1. Check GraphQL Admin Product Data
  const qRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: `
        query {
          product(id: "${prod3.gid}") {
            id
            title
            handle
            status
            seo {
              title
              description
            }
            variants(first: 5) {
              nodes {
                id
                title
                price
              }
            }
          }
        }
      `
    })
  });
  const qData = await qRes.json();
  const prodData = qData.data?.product;
  console.log('1. Admin Data:', JSON.stringify(prodData, null, 2));

  // 2. Check 301 Redirect on Old URL
  const oldUrlEncoded = `${STORE_DOMAIN}/products/${encodeURIComponent(prod3.oldHandle)}`;
  const hOld = await fetch(oldUrlEncoded, {
    redirect: 'manual',
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const oldStatus = hOld.status;
  const locationHeader = hOld.headers.get('location') || '';
  console.log(`2. Old URL (${oldUrlEncoded}) -> HTTP ${oldStatus} | Location: ${locationHeader}`);

  await new Promise(r => setTimeout(r, 2500));

  // 3. Check Tracking Query Parameters
  const trackingUrl = `${oldUrlEncoded}?utm_source=facebook&utm_campaign=shelf_liner_promo&fbclid=AQ_fbclid_p3_success`;
  const hTrack = await fetch(trackingUrl, {
    redirect: 'manual',
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const trackStatus = hTrack.status;
  const trackLocation = hTrack.headers.get('location') || '';
  const trackPreserved = trackLocation.includes('utm_source=facebook') && trackLocation.includes('fbclid=AQ_fbclid_p3_success');
  console.log(`3. Tracking URL -> HTTP ${trackStatus} | Location: ${trackLocation} | Preserved: ${trackPreserved}`);

  await new Promise(r => setTimeout(r, 2500));

  // 4. Check New URL (HTTP 200) & Rendered DOM
  const newUrl = `${STORE_DOMAIN}/products/${prod3.proposedHandle}`;
  const hNew = await fetch(newUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const newStatus = hNew.status;
  const html = await hNew.text();

  const tm = html.match(/<title>([^<]+)<\/title>/i);
  const renderedTitle = tm ? tm[1].trim() : '';
  const mm = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const renderedMeta = mm ? mm[1].trim() : '';
  const cm = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  const renderedCanonical = cm ? cm[1].trim() : '';

  console.log(`4. New URL (${newUrl}) -> HTTP ${newStatus}`);
  console.log(`   Rendered <title>: "${renderedTitle}"`);
  console.log(`   Rendered <meta name="description">: "${renderedMeta}"`);
  console.log(`   Rendered Canonical: "${renderedCanonical}"`);

  await new Promise(r => setTimeout(r, 2500));

  // 5. Storefront Cart Test with Cookies
  const primaryVariant = prodData.variants?.nodes[0];
  const rawVariantId = primaryVariant.id.replace('gid://shopify/ProductVariant/', '');

  const addRes = await fetch(`${STORE_DOMAIN}/cart/add.js`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: JSON.stringify({ items: [{ id: parseInt(rawVariantId), quantity: 1 }] })
  });

  const cookies = addRes.headers.getSetCookie ? addRes.headers.getSetCookie() : [addRes.headers.get('set-cookie')];
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const cartRes = await fetch(`${STORE_DOMAIN}/cart.js`, {
    headers: { 'Cookie': cookieHeader, 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const cartJson = await cartRes.json();
  const cartItem = cartJson.items?.find(it => String(it.id) === String(rawVariantId) || String(it.variant_id) === String(rawVariantId));
  const cartOk = cartItem && String(cartItem.product_id) === String(prod3.rawId);
  console.log(`5. Cart Verification: Item Found=${!!cartItem}, Product ID=${cartItem?.product_id}, Variant ID=${cartItem?.id}, Price=$${(cartItem?.price / 100).toFixed(2)} | PASS: ${cartOk}`);

  // Clear cart
  await fetch(`${STORE_DOMAIN}/cart/clear.js`, { method: 'POST', headers: { 'Cookie': cookieHeader } });

  // 6. Capture Screenshots via CDP
  console.log(`6. Capturing Desktop & Mobile Screenshots via CDP...`);
  const screens = await takeScreenshotsCDP(newUrl, `qa_batch1_${prod3.proposedHandle}`);
  console.log(`   Screenshots saved:`, screens);

  // 7. Summary
  const isPass = (
    (oldStatus === 301 || oldStatus === 302) &&
    newStatus === 200 &&
    trackPreserved &&
    cartOk &&
    renderedTitle.includes('Zavelyn')
  );

  const finalReport = {
    productId: prod3.rawId,
    name: prod3.name,
    status: isPass ? 'PASS' : 'FAIL',
    mutationResult: prodData,
    redirectId: 'gid://shopify/UrlRedirect/604052357305',
    oldUrl: oldUrlEncoded,
    newUrl,
    httpQA: {
      oldStatus,
      locationHeader,
      trackStatus,
      trackLocation,
      trackPreserved,
      newStatus,
      renderedTitle,
      renderedMeta,
      renderedCanonical
    },
    cartQA: {
      variantId: rawVariantId,
      productId: cartItem?.product_id,
      price: (cartItem?.price / 100).toFixed(2),
      cartOk
    },
    screenshots: screens
  };

  fs.writeFileSync('scripts/batch1_item3_result.json', JSON.stringify(finalReport, null, 2), 'utf8');
  console.log(`\nPRODUCT 3 QA RESULT: ${finalReport.status}`);
}

verifyProduct3().catch(console.error);
