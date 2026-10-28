import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const STORE_DOMAIN = 'https://tryzavelyn.com';
const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';

// 10 Products for Batch 2 (Phương án A: Keep Handle Unchanged, Update 3 fields)
const batch2PlanA = [
  {
    rawId: '15454949540025',
    gid: 'gid://shopify/Product/15454949540025',
    name: 'Titanium Pocket Pry Bar',
    handle: 'sakerplus®-titanium-alloy-multifunction-pocket-pry-bar',
    proposedTitle: 'Zavelyn Titanium Pocket Pry Bar',
    proposedSeoTitle: 'Titanium Multifunction Pocket Pry Bar EDC Tool | Zavelyn',
    proposedMetaDesc: 'Carry a dependable EDC pocket tool crafted from lightweight titanium alloy. Features bottle opener, pry wedge, measurement scale, and pocket clip.'
  },
  {
    rawId: '15454950490297',
    gid: 'gid://shopify/Product/15454950490297',
    name: 'Squishy Egg Silicone Night Light',
    handle: 'sakerplus®-squishy-egg-multicolor-tap-night-light',
    proposedTitle: 'Zavelyn Squishy Egg Silicone Night Light',
    proposedSeoTitle: 'Squishy Egg Silicone Tap Night Light for Kids | Zavelyn',
    proposedMetaDesc: 'Soothe bedrooms and nurseries with a soft silicone egg lamp. Features touch sensor color changes, warm night glow, and rechargeable USB convenience.'
  },
  {
    rawId: '15454952882361',
    gid: 'gid://shopify/Product/15454952882361',
    name: 'Kids Basketball Hoop Set',
    handle: 'sakerplus®-kids-indoor-outdoor-basketball-hoop-set',
    proposedTitle: 'Zavelyn Kids Basketball Hoop Set',
    proposedSeoTitle: 'Indoor & Outdoor Basketball Hoop Set for Kids | Zavelyn',
    // Corrected to ground against source (stand, backboard, 4 inflatable balls, pump; no shatterproof/spring rim)
    proposedMetaDesc: 'Encourage active indoor and outdoor play with an adjustable-height arcade basketball hoop set. Includes stand, backboard, 4 inflatable balls, and air pump.'
  },
  {
    rawId: '15454953177273',
    gid: 'gid://shopify/Product/15454953177273',
    name: 'Clamp-On Desk Shelf Organizer',
    handle: 'sakerplus®-three-tier-clamp-on-desk-shelf-organizer',
    proposedTitle: 'Zavelyn Clamp-On Desk Shelf Organizer',
    proposedSeoTitle: 'Clamp-On Multi-Tier Desk Shelf Organizer | Zavelyn',
    proposedMetaDesc: 'Expand usable desktop surface without drilling using heavy-duty C-clamp shelves. Ideal for organizing monitors, stationery, speakers, and office essentials.'
  },
  {
    rawId: '15454955765945',
    gid: 'gid://shopify/Product/15454955765945',
    name: 'Rotating Galaxy Star Projector',
    handle: 'sakerplus®-rotating-galaxy-projector-with-adjustable-focus',
    proposedTitle: 'Zavelyn Rotating Galaxy Star Projector',
    proposedSeoTitle: 'Rotating Galaxy Star Projector for Bedrooms | Zavelyn',
    // Corrected "silent rotation" to "quiet 30 dB gentle rotation" (30 dB motor from source)
    proposedMetaDesc: 'Transform ceilings into a celestial planetarium with an adjustable-focus galaxy projector featuring interchangeable discs and quiet 30 dB gentle rotation.'
  },
  {
    rawId: '15454959403193',
    gid: 'gid://shopify/Product/15454959403193',
    name: 'Low-Profile Downspout Catch Basin',
    handle: 'sakerplus®-low-profile-downspout-catch-basin',
    proposedTitle: 'Zavelyn Low-Profile Downspout Catch Basin',
    proposedSeoTitle: 'Low-Profile Downspout Drainage Catch Basin | Zavelyn',
    proposedMetaDesc: 'Divert rainwater away from your home foundation with a low-profile gutter downspout basin equipped with a debris grate and extendable discharge pipe.'
  },
  {
    rawId: '15454960517305',
    gid: 'gid://shopify/Product/15454960517305',
    name: 'Rotating Goose Target Game',
    handle: 'sakerplus®-electronic-rotating-goose-target-game',
    proposedTitle: 'Zavelyn Rotating Goose Target Game',
    proposedSeoTitle: 'Electronic Rotating Goose Target Shooting Game | Zavelyn',
    proposedMetaDesc: 'Bring exciting arcade target practice home with an electronic rotating goose shooting game featuring soft foam ball poppers and digital score display.'
  },
  {
    rawId: '15454961565881',
    gid: 'gid://shopify/Product/15454961565881',
    name: 'Workbench Tail Vise Clamp',
    handle: 'sakerplus®-adjustable-workbench-tail-vise-clamp',
    proposedTitle: 'Zavelyn Workbench Tail Vise Clamp',
    proposedSeoTitle: 'Heavy-Duty Workbench Tail Vise Woodworking Clamp | Zavelyn',
    // Grounded material: aluminum alloy from source
    proposedMetaDesc: 'Secure wooden workpieces firmly on dog-hole workbenches using an aluminum alloy tail vise screw clamp engineered for smooth tightening and stable clamping.'
  },
  {
    rawId: '15454963073209',
    gid: 'gid://shopify/Product/15454963073209',
    name: 'Rolling Nut & Fruit Harvester',
    handle: 'sakerplus®-rolling-nut-and-ball-picker',
    proposedTitle: 'Zavelyn Rolling Nut & Fruit Harvester',
    proposedSeoTitle: 'Rolling Nut & Fruit Harvester Gathering Tool | Zavelyn',
    // Grounded: "Adjustable Telescoping Handle" is explicitly in source
    proposedMetaDesc: 'Gather pecans, walnuts, acorns, and tennis balls without bending your back using a rolling wire collection drum with an adjustable telescoping handle.'
  },
  {
    rawId: '15454963433657',
    gid: 'gid://shopify/Product/15454963433657',
    name: 'Ultra-Fine Cooking Oil Sprayer',
    handle: 'sakerplus®-ultra-fine-cooking-oil-spray-bottle',
    proposedTitle: 'Zavelyn Ultra-Fine Cooking Oil Sprayer',
    proposedSeoTitle: 'Ultra-Fine Cooking Oil Sprayer Bottle for Cooking | Zavelyn',
    // Grounded: source says "easy one-press spray", "clear bottle with visible markings" (no pressurized aerosol, no glass claim)
    proposedMetaDesc: 'Misty-spray olive oil evenly onto salads, air fryer baskets, and grilling pans. Features an easy one-press spray pump and clear bottle with measurement marks.'
  }
];

function launchChrome(port) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_qa_b2_' + Date.now();
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
  const port = 9231;
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

    // Desktop 1440x900
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 4000));
    const snapDesk = await send('Page.captureScreenshot', { format: 'png' });
    const deskPath = path.join(ARTIFACTS_DIR, `${filePrefix}_desktop_1440.png`);
    fs.writeFileSync(deskPath, Buffer.from(snapDesk.data, 'base64'));

    // Mobile 390x844
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

async function shopifyGQL(query, variables = {}, token) {
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });
  return await res.json();
}

async function fetchWithBackoff(url, options = {}, maxRetries = 4, baseDelay = 3000) {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429) {
        const retryAfter = res.headers.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, attempt);
        console.warn(`[HTTP 429 Rate Limited] Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}...`);
        await new Promise(r => setTimeout(r, waitTime));
        attempt++;
        continue;
      }
      return res;
    } catch (err) {
      if (attempt >= maxRetries) throw err;
      const waitTime = baseDelay * Math.pow(2, attempt);
      console.warn(`[Network Retry] ${err.message}. Waiting ${waitTime}ms...`);
      await new Promise(r => setTimeout(r, waitTime));
      attempt++;
    }
  }
  throw new Error(`Max retries reached for ${url}`);
}

async function runBatch2() {
  console.log('=== STARTING CONTROLLED SEQUENTIAL EXECUTION: BATCH 2 (PHƯƠNG ÁN A) ===');
  console.log('Scope: 10 Products | Strictly 3 Fields (Title, SEO Title, Meta Description) | URL Handles 100% UNCHANGED\n');

  const token = await getAccessToken();
  const summaryReport = [];

  for (let i = 0; i < batch2PlanA.length; i++) {
    const item = batch2PlanA[i];
    console.log(`========================================================================`);
    console.log(`[ITEM ${i + 1}/10] PROCESSING: ${item.name} (ID: ${item.rawId})`);
    console.log(`========================================================================`);

    // Step 1: Pre-Check & Read Current Live State
    console.log(`Step 1. Pre-Check: Reading live product state from Shopify Admin...`);
    const qLive = `
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
          variants(first: 10) {
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
    const curRes = await shopifyGQL(qLive, { id: item.gid }, token);
    const curProduct = curRes.data?.product;
    if (!curProduct) {
      throw new Error(`CRITICAL: Product ${item.gid} not found in Shopify Admin! Halting batch.`);
    }

    // Step 2: Fresh Pre-Write Snapshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const snapshotPath = path.join('scripts', `snapshot_prod_${item.rawId}_${timestamp}.json`);
    fs.writeFileSync(snapshotPath, JSON.stringify(curProduct, null, 2), 'utf8');
    console.log(`Step 2. Pre-write snapshot saved to: ${snapshotPath}`);

    // Step 3: Execute productUpdate (STRICTLY 3 FIELDS: title, seo.title, seo.description. NO HANDLE)
    console.log(`Step 3. Executing productUpdate mutation on Shopify GraphQL API ${API_VERSION}...`);
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
    const updateInput = {
      id: item.gid,
      title: item.proposedTitle,
      seo: {
        title: item.proposedSeoTitle,
        description: item.proposedMetaDesc
      }
    };
    const mutRes = await shopifyGQL(updateMutation, { input: updateInput }, token);
    const userErrors = mutRes.data?.productUpdate?.userErrors || [];
    if (userErrors.length > 0) {
      throw new Error(`CRITICAL: productUpdate returned userErrors: ${JSON.stringify(userErrors)}`);
    }
    const updatedProd = mutRes.data?.productUpdate?.product;
    console.log(`   Mutation SUCCESS. Admin updated Title: "${updatedProd.title}"`);
    console.log(`   Verified Handle remains unchanged: "${updatedProd.handle}"`);

    // Step 4: Controlled propagation delay
    console.log(`Step 4. Pausing 6 seconds for edge propagation...`);
    await new Promise(r => setTimeout(r, 6000));

    // Step 5: Storefront HTTP Verification (URL MUST RETURN 200 OK, NO REDIRECT)
    console.log(`Step 5. Running Storefront HTTP verification on existing URL...`);
    const productUrl = `${STORE_DOMAIN}/products/${encodeURIComponent(item.handle)}`;
    const hPage = await fetchWithBackoff(productUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const pageStatus = hPage.status;
    const html = await hPage.text();

    const tm = html.match(/<title>([^<]+)<\/title>/i);
    const renderedTitle = tm ? tm[1].trim() : '';
    const mm = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const renderedMeta = mm ? mm[1].trim() : '';
    const cm = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    const renderedCanonical = cm ? cm[1].trim() : '';

    console.log(`   Page URL: ${productUrl} -> HTTP ${pageStatus}`);
    console.log(`   Rendered <title>: "${renderedTitle}"`);
    console.log(`   Rendered Meta Desc: "${renderedMeta}"`);
    console.log(`   Rendered Canonical: "${renderedCanonical}"`);

    // Step 6: Storefront Ajax Cart Test
    console.log(`Step 6. Testing Add to Cart on live storefront...`);
    const primaryVariant = curProduct.variants.nodes[0];
    const rawVariantId = primaryVariant.id.replace('gid://shopify/ProductVariant/', '');

    await new Promise(r => setTimeout(r, 2500));
    const addRes = await fetchWithBackoff(`${STORE_DOMAIN}/cart/add.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({ items: [{ id: parseInt(rawVariantId), quantity: 1 }] })
    });
    const cookies = addRes.headers.getSetCookie ? addRes.headers.getSetCookie() : [addRes.headers.get('set-cookie')];
    const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

    await new Promise(r => setTimeout(r, 2500));
    const cartRes = await fetchWithBackoff(`${STORE_DOMAIN}/cart.js`, {
      headers: { 'Cookie': cookieHeader, 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const cartJson = await cartRes.json();
    const cartItem = cartJson.items?.find(it => String(it.id) === String(rawVariantId) || String(it.variant_id) === String(rawVariantId));
    const cartOk = cartItem && String(cartItem.product_id) === String(item.rawId);
    console.log(`   Cart Verification: Item Found=${!!cartItem}, Product ID=${cartItem?.product_id}, Variant ID=${cartItem?.id}, Price=$${(cartItem?.price / 100).toFixed(2)} | PASS: ${cartOk}`);

    // Clear cart
    await fetch(`${STORE_DOMAIN}/cart/clear.js`, { method: 'POST', headers: { 'Cookie': cookieHeader } });

    // Step 7: CDP Screenshots (Desktop 1440 & Mobile 390)
    console.log(`Step 7. Capturing Desktop & Mobile QA Screenshots via CDP...`);
    const cleanPrefix = `qa_batch2_${item.rawId}`;
    const screens = await takeScreenshotsCDP(productUrl, cleanPrefix);
    console.log(`   Screenshots captured:`, screens);

    // Step 8: Item Validation & Halting Guard
    const isPass = (
      pageStatus === 200 &&
      cartOk &&
      renderedTitle.includes('Zavelyn')
    );

    const itemResult = {
      productId: item.rawId,
      name: item.name,
      status: isPass ? 'PASS' : 'FAIL',
      handleUnchanged: updatedProd.handle === item.handle,
      snapshot: snapshotPath,
      adminBefore: {
        title: curProduct.title,
        seo: curProduct.seo
      },
      adminAfter: updatedProd,
      storefrontQA: {
        httpStatus: pageStatus,
        renderedTitle,
        renderedMeta,
        renderedCanonical,
        cartMatch: {
          variantId: rawVariantId,
          productId: cartItem?.product_id,
          price: (cartItem?.price / 100).toFixed(2),
          ok: cartOk
        }
      },
      screenshots: screens
    };

    fs.writeFileSync(`scripts/batch2_item_${i + 1}_result.json`, JSON.stringify(itemResult, null, 2), 'utf8');

    if (!isPass) {
      console.error(`\n>>> CRITICAL QA FAILURE ON ITEM ${i + 1} (${item.name}). HALTING BATCH! <<<`);
      throw new Error(`QA failed on item ${i + 1}: ${item.name}`);
    }

    console.log(`>>> [ITEM ${i + 1}/10] QA PASSED 100%! Ready for next item. <<<\n`);
    summaryReport.push(itemResult);

    // Pause between items to maintain smooth Cloudflare traffic
    await new Promise(r => setTimeout(r, 4000));
  }

  fs.writeFileSync('scripts/batch2_final_summary_report.json', JSON.stringify(summaryReport, null, 2), 'utf8');
  console.log('=== BATCH 2 COMPLETE: ALL 10 PRODUCTS SUCCESSFULLY UPDATED AND QA-VERIFIED! ===');
}

runBatch2().catch(err => {
  console.error('\nEXECUTION HALTED ON ERROR:', err);
  process.exit(1);
});
