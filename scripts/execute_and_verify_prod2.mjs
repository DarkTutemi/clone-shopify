import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const STORE_DOMAIN = 'https://tryzavelyn.com';

const prod2 = {
  rawId: '15454948163769',
  gid: 'gid://shopify/Product/15454948163769',
  name: 'Tearable Non-Slip Drawer Liner',
  oldHandle: 'sakerplus®-tearable-non-slip-drawer-liner',
  proposedTitle: 'Zavelyn Tearable Non-Slip Drawer Liner',
  proposedSeoTitle: 'Tearable Non-Slip Drawer Liner for Cabinets | Zavelyn',
  proposedMetaDesc: 'Keep kitchen utensils and vanity supplies in place with tearable non-slip drawer liners. Sized with a clear grid for easy hand-tearing without scissors.',
  proposedHandle: 'zavelyn-tearable-drawer-liner'
};

function launchChrome(port) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_qa_p2_' + Date.now();
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
  const port = 9228;
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

async function runProduct2() {
  const token = await getAccessToken();
  console.log(`=== EXECUTING ITEM 2/3: ${prod2.name} (ID: ${prod2.rawId}) ===\n`);

  // 1. Pre-Check Live Product
  const preQuery = `
    query getProd($id: ID!) {
      product(id: $id) {
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
            sku
          }
        }
      }
    }
  `;

  const preRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query: preQuery, variables: { id: prod2.gid } })
  });
  const preJson = await preRes.json();
  const liveProd = preJson.data?.product;

  console.log(`Step 1. Live Title: "${liveProd.title}" | Live Handle: "${liveProd.handle}"`);

  // Verify handle availability in Admin API
  const hcRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: `query { products(first: 1, query: "handle:${prod2.proposedHandle}") { nodes { id handle } } }`
    })
  });
  const hcJson = await hcRes.json();
  const nodes = hcJson.data?.products?.nodes || [];
  if (nodes.length > 0 && nodes[0].id !== prod2.gid) {
    throw new Error(`CRITICAL: Handle ${prod2.proposedHandle} occupied by ${nodes[0].id}! Aborting.`);
  }
  console.log(`Step 2. Handle "${prod2.proposedHandle}" verified 100% available in Shopify Admin.`);

  // 2. Snapshot
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const snapshotPath = `scripts/snapshot_prod_${prod2.rawId}_${timestamp}.json`;
  fs.writeFileSync(snapshotPath, JSON.stringify(liveProd, null, 2), 'utf8');
  console.log(`Step 3. Pre-write snapshot saved to: ${snapshotPath}`);

  // 3. Mutation productUpdate
  console.log(`Step 4. Executing productUpdate mutation on API ${API_VERSION}...`);
  const mutation = `
    mutation updateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          handle
          seo {
            title
            description
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const inputPayload = {
    id: prod2.gid,
    title: prod2.proposedTitle,
    handle: prod2.proposedHandle,
    seo: {
      title: prod2.proposedSeoTitle,
      description: prod2.proposedMetaDesc
    }
  };

  const uRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query: mutation, variables: { input: inputPayload } })
  });
  const uJson = await uRes.json();
  const uResult = uJson.data?.productUpdate;

  if (uResult?.userErrors && uResult.userErrors.length > 0) {
    throw new Error(`Mutation userErrors: ${JSON.stringify(uResult.userErrors)}`);
  }
  console.log(`   Product updated successfully! New handle: "${uResult.product?.handle}"`);

  // 4. Check or Create 301 Redirect
  console.log(`Step 5. Checking 301 Redirect...`);
  const oldPath = `/products/${prod2.oldHandle}`;
  const newPath = `/products/${prod2.proposedHandle}`;

  const rRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: `query { urlRedirects(first: 5, query: "path:${oldPath}") { nodes { id path target } } }`
    })
  });
  const rJson = await rRes.json();
  const existingMatches = rJson.data?.urlRedirects?.nodes || [];
  let redirectRecord = existingMatches.find(r => r.path === oldPath && r.target === newPath);

  if (redirectRecord) {
    console.log(`   301 Redirect automatically created by Shopify: ID ${redirectRecord.id}`);
  } else {
    console.log(`   Creating 301 Redirect via urlRedirectCreate: ${oldPath} -> ${newPath}...`);
    const crRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: `mutation makeRedirect($redirect: UrlRedirectInput!) { urlRedirectCreate(urlRedirect: $redirect) { urlRedirect { id path target } userErrors { field message } } }`,
        variables: { redirect: { path: oldPath, target: newPath } }
      })
    });
    const crJson = await crRes.json();
    redirectRecord = crJson.data?.urlRedirectCreate?.urlRedirect;
    console.log(`   Redirect created: ID ${redirectRecord?.id}`);
  }

  // 5. Allow Edge Propagation
  console.log(`Waiting 12 seconds for edge CDN cache propagation...`);
  await new Promise(r => setTimeout(r, 12000));

  // 6. Storefront HTTP Verification
  console.log(`Step 6. Running Storefront HTTP verification...`);
  const oldUrlEncoded = `${STORE_DOMAIN}/products/${encodeURIComponent(prod2.oldHandle)}`;
  const newUrl = `${STORE_DOMAIN}/products/${prod2.proposedHandle}`;

  // Check Old URL
  const hOld = await fetch(oldUrlEncoded, { redirect: 'manual' });
  const oldStatus = hOld.status;
  const locationHeader = hOld.headers.get('location') || '';
  console.log(`   Old URL (${oldUrlEncoded}) -> HTTP ${oldStatus} | Location: ${locationHeader}`);

  // Check Tracking URL
  const trackingQuery = '?utm_source=facebook&utm_campaign=drawer_promo&fbclid=AQ_fbclid_p2';
  const hTrack = await fetch(`${oldUrlEncoded}${trackingQuery}`, { redirect: 'manual' });
  const trackStatus = hTrack.status;
  const trackLocation = hTrack.headers.get('location') || '';
  const trackPreserved = trackLocation.includes('utm_source=facebook') && trackLocation.includes('fbclid=AQ_fbclid_p2');
  console.log(`   Tracking URL -> HTTP ${trackStatus} | Location: ${trackLocation} | Preserved: ${trackPreserved}`);

  // Check New URL & Rendered DOM
  const hNew = await fetch(newUrl);
  const newStatus = hNew.status;
  const html = await hNew.text();

  const tm = html.match(/<title>([^<]+)<\/title>/i);
  const renderedTitle = tm ? tm[1].trim() : '';
  const mm = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const renderedMeta = mm ? mm[1].trim() : '';
  const cm = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  const renderedCanonical = cm ? cm[1].trim() : '';

  console.log(`   New URL (${newUrl}) -> HTTP ${newStatus}`);
  console.log(`   Rendered <title>: "${renderedTitle}"`);
  console.log(`   Rendered <meta name="description">: "${renderedMeta}"`);
  console.log(`   Rendered Canonical: "${renderedCanonical}"`);

  // 7. Storefront Cart Test with Cookies
  console.log(`Step 7. Testing Add to Cart on live storefront...`);
  const primaryVariant = liveProd.variants?.nodes[0];
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

  const cartOk = cartItem && String(cartItem.product_id) === String(prod2.rawId);
  console.log(`   Cart Verification: Item Found=${!!cartItem}, Product ID=${cartItem?.product_id}, Price=$${(cartItem?.price / 100).toFixed(2)} | PASS: ${cartOk}`);

  // Clear cart
  await fetch(`${STORE_DOMAIN}/cart/clear.js`, { method: 'POST', headers: { 'Cookie': cookieHeader } });

  // 8. Capture Screenshots via CDP
  console.log(`Step 8. Capturing Desktop & Mobile Screenshots via CDP...`);
  const screens = await takeScreenshotsCDP(newUrl, `qa_batch1_${prod2.proposedHandle}`);
  console.log(`   Screenshots saved:`, screens);

  // 9. Validation
  const isPass = (
    (oldStatus === 301 || oldStatus === 302) &&
    newStatus === 200 &&
    trackPreserved &&
    cartOk &&
    renderedTitle.length > 0 &&
    renderedMeta.length > 0
  );

  const report = {
    productId: prod2.rawId,
    name: prod2.name,
    status: isPass ? 'PASS' : 'FAIL',
    mutationResult: uResult.product,
    redirectRecord,
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

  fs.writeFileSync('scripts/batch1_item2_result.json', JSON.stringify(report, null, 2), 'utf8');

  if (isPass) {
    console.log(`\n>>> ITEM 2/3: ${prod2.name} PASSED ALL TESTS 100%! <<<\n`);
  } else {
    throw new Error(`QA Check failed on Product 2 (${prod2.name})`);
  }
}

runProduct2().catch(console.error);
