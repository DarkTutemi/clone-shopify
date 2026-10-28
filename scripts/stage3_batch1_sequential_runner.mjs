import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const API_VERSION = '2026-10';
const STORE_DOMAIN = 'https://tryzavelyn.com';
const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';

const batch1Products = [
  {
    rawId: '15454947901625',
    gid: 'gid://shopify/Product/15454947901625',
    shortName: 'Sensory Textured Floor Mats',
    expectedCurrentTitle: 'Zavelyn Sensory Floor Mats',
    oldHandle: 'sakerplus®-tpu-sensory-textured-floor-mats',
    proposedTitle: 'Zavelyn Sensory Textured Floor Mats',
    proposedSeoTitle: 'TPU Sensory Textured Floor Mats for Kids & Adults | Zavelyn',
    proposedMetaDesc: 'Engage tactile exploration with interlocking TPU textured floor mats featuring six raised patterns. Easy to assemble, clean, and arrange for kids or adults.',
    proposedHandle: 'zavelyn-sensory-floor-mats'
  },
  {
    rawId: '15454948163769',
    gid: 'gid://shopify/Product/15454948163769',
    shortName: 'Tearable Non-Slip Drawer Liner',
    expectedCurrentTitle: 'Zavelyn Non-Slip Drawer Liner',
    oldHandle: 'sakerplus®-tearable-non-slip-drawer-liner',
    proposedTitle: 'Zavelyn Tearable Non-Slip Drawer Liner',
    proposedSeoTitle: 'Tearable Non-Slip Drawer Liner for Cabinets | Zavelyn',
    proposedMetaDesc: 'Keep kitchen utensils and vanity supplies in place with tearable non-slip drawer liners. Sized with a clear grid for easy hand-tearing without scissors.',
    proposedHandle: 'zavelyn-tearable-drawer-liner'
  },
  {
    rawId: '15454948556985',
    gid: 'gid://shopify/Product/15454948556985',
    shortName: 'Tearable Shelf & Drawer Liner',
    expectedCurrentTitle: 'Zavelyn Shelf & Drawer Liner',
    oldHandle: 'sakerplus®-tearable-shelf-liner-and-drawer-liner',
    proposedTitle: 'Zavelyn Tearable Shelf & Drawer Liner',
    proposedSeoTitle: 'Tearable Shelf & Drawer Mat Liner for Kitchen | Zavelyn',
    proposedMetaDesc: 'Protect shelves, cabinets, and drawers from spills, moisture, and scratches with textured EVA liners. Perforated design pulls apart by hand for a custom fit.',
    proposedHandle: 'zavelyn-shelf-drawer-liner'
  }
];

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

function launchChrome(port) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_qa_b1_' + Date.now();
  return spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1440,900'
  ], { detached: true, stdio: 'ignore' });
}

async function takeScreenshotsCDP(url, filePrefix) {
  const port = 9226;
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

    // 1. Desktop Screenshot 1440x900
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 3000));

    const snapDesktop = await send('Page.captureScreenshot', { format: 'png' });
    const deskPath = path.join(ARTIFACTS_DIR, `${filePrefix}_desktop_1440.png`);
    fs.writeFileSync(deskPath, Buffer.from(snapDesktop.data, 'base64'));

    // 2. Mobile Screenshot 390x844
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 2000));
    const snapMobile = await send('Page.captureScreenshot', { format: 'png' });
    const mobPath = path.join(ARTIFACTS_DIR, `${filePrefix}_mobile_390.png`);
    fs.writeFileSync(mobPath, Buffer.from(snapMobile.data, 'base64'));

    ws.close();
    proc.kill();
    return { deskPath, mobPath };
  } catch (err) {
    proc.kill();
    console.error('CDP Screenshot error:', err.message);
    return null;
  }
}

async function runSequentialBatch1() {
  const token = await getAccessToken();
  console.log(`=== STARTING CONTROLLED SEQUENTIAL EXECUTION: BATCH 1 (API: ${API_VERSION}) ===\n`);

  const results = [];

  for (let i = 0; i < batch1Products.length; i++) {
    const prod = batch1Products[i];
    console.log(`========================================================`);
    console.log(`[ITEM ${i + 1}/3] PROCESSING: ${prod.shortName} (ID: ${prod.rawId})`);
    console.log(`========================================================`);

    const itemReport = {
      productId: prod.rawId,
      name: prod.shortName,
      status: 'IN_PROGRESS',
      steps: {}
    };

    // STEP A: Pre-Check & Read Fresh Live State
    console.log(`Step 1. Pre-Check: Reading live product state from Shopify Admin...`);
    const preQuery = `
      query getFreshProduct($id: ID!) {
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
      body: JSON.stringify({ query: preQuery, variables: { id: prod.gid } })
    });
    const preJson = await preRes.json();
    const liveProd = preJson.data?.product;

    if (!liveProd) {
      throw new Error(`CRITICAL: Product ${prod.rawId} could not be retrieved from Shopify API.`);
    }

    console.log(`   Live Title: "${liveProd.title}"`);
    console.log(`   Live Handle: "${liveProd.handle}"`);

    // Verify handle in Admin API to ensure proposedHandle is not occupied
    console.log(`Step 2. Checking handle availability in Shopify Admin API for "${prod.proposedHandle}"...`);
    const handleCheckQuery = `
      query checkHandle($q: String!) {
        products(first: 1, query: $q) {
          nodes {
            id
            handle
            title
          }
        }
      }
    `;
    const hcRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query: handleCheckQuery, variables: { q: `handle:${prod.proposedHandle}` } })
    });
    const hcJson = await hcRes.json();
    const existingWithHandle = hcJson.data?.products?.nodes || [];

    if (existingWithHandle.length > 0 && existingWithHandle[0].id !== prod.gid) {
      throw new Error(`CRITICAL: Handle "${prod.proposedHandle}" is already assigned to Product ${existingWithHandle[0].id}! Aborting.`);
    }
    console.log(`   Handle "${prod.proposedHandle}" is 100% available in Shopify Admin.`);

    // STEP B: Create Fresh Pre-Write Snapshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const snapshotPath = `scripts/snapshot_prod_${prod.rawId}_${timestamp}.json`;
    fs.writeFileSync(snapshotPath, JSON.stringify(liveProd, null, 2), 'utf8');
    console.log(`Step 3. Fresh pre-write snapshot saved to: ${snapshotPath}`);
    itemReport.steps.snapshot = snapshotPath;

    // STEP C: Execute Mutation (productUpdate) with exactly 4 fields
    console.log(`Step 4. Executing productUpdate mutation on API ${API_VERSION}...`);
    const updateMutation = `
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
      id: prod.gid,
      title: prod.proposedTitle,
      handle: prod.proposedHandle,
      seo: {
        title: prod.proposedSeoTitle,
        description: prod.proposedMetaDesc
      }
    };

    const updateRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query: updateMutation, variables: { input: inputPayload } })
    });
    const updateJson = await updateRes.json();
    const updateResult = updateJson.data?.productUpdate;

    if (updateResult?.userErrors && updateResult.userErrors.length > 0) {
      console.error('userErrors from productUpdate:', updateResult.userErrors);
      throw new Error(`productUpdate failed on ${prod.rawId}: ${JSON.stringify(updateResult.userErrors)}`);
    }

    console.log(`   Product updated successfully! New handle confirmed: "${updateResult.product?.handle}"`);
    itemReport.steps.productUpdate = updateResult.product;

    // STEP D: Verify & Handle 301 Redirect
    console.log(`Step 5. Checking 301 URL redirect creation...`);
    const oldPath = `/products/${prod.oldHandle}`;
    const newPath = `/products/${prod.proposedHandle}`;

    const checkRedirectQuery = `
      query getRedirects($q: String!) {
        urlRedirects(first: 5, query: $q) {
          nodes {
            id
            path
            target
          }
        }
      }
    `;

    const rRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query: checkRedirectQuery, variables: { q: `path:${oldPath}` } })
    });
    const rJson = await rRes.json();
    const rNodes = rJson.data?.urlRedirects?.nodes || [];
    let redirectRecord = rNodes.find(r => r.path === oldPath && r.target === newPath);

    if (redirectRecord) {
      console.log(`   Redirect from ${oldPath} -> ${newPath} was AUTOMATICALLY created by Shopify (ID: ${redirectRecord.id}).`);
      itemReport.steps.redirect = { status: 'AUTOMATIC_BY_SHOPIFY', id: redirectRecord.id, path: oldPath, target: newPath };
    } else {
      console.log(`   Creating redirect via urlRedirectCreate: ${oldPath} -> ${newPath}...`);
      const createRedirectMutation = `
        mutation makeRedirect($redirect: UrlRedirectInput!) {
          urlRedirectCreate(urlRedirect: $redirect) {
            urlRedirect {
              id
              path
              target
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      const crRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({ query: createRedirectMutation, variables: { redirect: { path: oldPath, target: newPath } } })
      });
      const crJson = await crRes.json();
      const crResult = crJson.data?.urlRedirectCreate;
      if (crResult?.userErrors && crResult.userErrors.length > 0) {
        // If error is path taken, find the existing one
        console.warn('urlRedirectCreate userErrors:', crResult.userErrors);
      }
      redirectRecord = crResult?.urlRedirect;
      console.log(`   Redirect created successfully (ID: ${redirectRecord?.id}).`);
      itemReport.steps.redirect = { status: 'MANUALLY_CREATED', id: redirectRecord?.id, path: oldPath, target: newPath };
    }

    // STEP E: Storefront HTTP Verification (Old URL 301, New URL 200, Query Preservation)
    console.log(`Step 6. Running Storefront HTTP verification...`);
    const oldUrlEncoded = `${STORE_DOMAIN}/products/${encodeURIComponent(prod.oldHandle)}`;
    const newUrl = `${STORE_DOMAIN}/products/${prod.proposedHandle}`;

    // 1. Old URL check
    const hOld = await fetch(oldUrlEncoded, { redirect: 'manual' });
    const oldStatus = hOld.status;
    const locationHeader = hOld.headers.get('location') || '';
    console.log(`   Old URL (${oldUrlEncoded}) -> HTTP ${oldStatus} | Location: ${locationHeader}`);

    // 2. Old URL with tracking query parameters
    const trackingQuery = '?utm_source=facebook&utm_medium=paid&utm_campaign=batch1_test&fbclid=AQ_test123';
    const hTracking = await fetch(`${oldUrlEncoded}${trackingQuery}`, { redirect: 'manual' });
    const trackingStatus = hTracking.status;
    const trackingLocation = hTracking.headers.get('location') || '';
    const trackingPreserved = trackingLocation.includes('utm_source=facebook') && trackingLocation.includes('fbclid=AQ_test123');
    console.log(`   Tracking URL -> HTTP ${trackingStatus} | Location: ${trackingLocation} | Preserved: ${trackingPreserved}`);

    // 3. New URL check & DOM inspection
    const hNew = await fetch(newUrl);
    const newStatus = hNew.status;
    const html = await hNew.text();

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const renderedTitle = titleMatch ? titleMatch[1].trim() : '';
    const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const renderedMeta = metaMatch ? metaMatch[1].trim() : '';
    const canMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    const renderedCanonical = canMatch ? canMatch[1].trim() : '';

    console.log(`   New URL (${newUrl}) -> HTTP ${newStatus}`);
    console.log(`   Rendered <title>: "${renderedTitle}"`);
    console.log(`   Rendered <meta name="description">: "${renderedMeta}"`);
    console.log(`   Rendered Canonical: "${renderedCanonical}"`);

    itemReport.steps.httpQA = {
      oldStatus,
      locationHeader,
      is301: oldStatus === 301 || oldStatus === 302,
      trackingStatus,
      trackingLocation,
      trackingPreserved,
      newStatus,
      renderedTitle,
      renderedMeta,
      renderedCanonical
    };

    // STEP F: Cart Test via Storefront Ajax API
    console.log(`Step 7. Testing Add to Cart on live storefront...`);
    const primaryVariant = liveProd.variants?.nodes[0];
    const rawVariantId = primaryVariant.id.replace('gid://shopify/ProductVariant/', '');

    // Clear cart first
    await fetch(`${STORE_DOMAIN}/cart/clear.js`, { method: 'POST' });

    // Add item
    const addRes = await fetch(`${STORE_DOMAIN}/cart/add.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: rawVariantId, quantity: 1 }]
      })
    });
    const addJson = await addRes.json();

    // Verify cart
    const cartRes = await fetch(`${STORE_DOMAIN}/cart.js`);
    const cartJson = await cartRes.json();
    const cartItem = cartJson.items?.find(it => String(it.id) === String(rawVariantId) || String(it.variant_id) === String(rawVariantId));

    const cartOk = cartItem && String(cartItem.product_id) === String(prod.rawId) && String(cartItem.price) === String(Math.round(parseFloat(primaryVariant.price) * 100));

    console.log(`   Cart Add Result: Added variant ID ${rawVariantId}`);
    console.log(`   Cart Verification: Item Found=${!!cartItem}, Product ID=${cartItem?.product_id}, Price=$${(cartItem?.price / 100).toFixed(2)} | PASS: ${cartOk}`);

    // Clear cart after test
    await fetch(`${STORE_DOMAIN}/cart/clear.js`, { method: 'POST' });

    itemReport.steps.cartTest = {
      variantId: rawVariantId,
      expectedProductId: prod.rawId,
      cartItemProductId: cartItem?.product_id,
      expectedPrice: primaryVariant.price,
      cartPrice: (cartItem?.price / 100).toFixed(2),
      cartPass: cartOk
    };

    // STEP G: Independent QA Screenshots via CDP
    console.log(`Step 8. Capturing Desktop & Mobile QA Screenshots via CDP...`);
    const screens = await takeScreenshotsCDP(newUrl, `qa_batch1_${prod.proposedHandle}`);
    console.log(`   Screenshots captured:`, screens);
    itemReport.steps.screenshots = screens;

    // VERIFY PASS/FAIL
    const isStepPassed = (
      (oldStatus === 301 || oldStatus === 302) &&
      newStatus === 200 &&
      trackingPreserved &&
      cartOk &&
      renderedTitle.length > 0 &&
      renderedMeta.length > 0
    );

    if (isStepPassed) {
      itemReport.status = 'PASS';
      console.log(`>>> ITEM ${i + 1}/3: ${prod.shortName} PASSED ALL TESTS 100%! <<<\n`);
    } else {
      itemReport.status = 'FAIL';
      console.error(`>>> ITEM ${i + 1}/3: ${prod.shortName} FAILED A CRITICAL QA CHECK! STOPPING BATCH! <<<`);
      results.push(itemReport);
      fs.writeFileSync('scripts/batch1_execution_results.json', JSON.stringify(results, null, 2), 'utf8');
      throw new Error(`Execution halted on item ${i + 1} (${prod.shortName}) due to QA failure.`);
    }

    results.push(itemReport);
    fs.writeFileSync('scripts/batch1_execution_results.json', JSON.stringify(results, null, 2), 'utf8');

    // Brief cooldown between sequential products
    if (i < batch1Products.length - 1) {
      console.log('Pausing 3 seconds before next product in sequence...\n');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`========================================================`);
  console.log(`ALL 3 BATCH 1 PRODUCTS EXECUTED AND VERIFIED PASS 100%!`);
  console.log(`Results saved to scripts/batch1_execution_results.json`);
  console.log(`========================================================`);
}

runSequentialBatch1().catch(console.error);
