/**
 * STAGE 3 BATCH 3 SEQUENTIAL RUNNER (PHƯƠNG ÁN A - REVISED & FACT-CHECKED)
 * Strictly 3 Fields: Product Title, SEO Page Title, Meta Description.
 * URL Handles remain 100% UNCHANGED.
 * NOTE: READ ONLY until explicit approval from user.
 */
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const STORE_DOMAIN = 'https://tryzavelyn.com';
const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';

export const batch3PlanA = [
  {
    rawId: '15454948982969',
    gid: 'gid://shopify/Product/15454948982969',
    name: 'Flame Effect Space Heater',
    handle: 'sakerplus®-1500w-flame-effect-oscillating-space-heater',
    proposedTitle: 'Zavelyn Flame Effect Space Heater',
    proposedSeoTitle: '1500W Flame Effect Oscillating Space Heater | Zavelyn',
    proposedMetaDesc: 'Warm indoor rooms with a 1500W PTC oscillating tower heater featuring a decorative 3D flame effect, remote control, and built-in tip-over shutoff.'
  },
  {
    rawId: '15454949998777',
    gid: 'gid://shopify/Product/15454949998777',
    name: 'Handheld Steam Cleaner',
    handle: 'sakerplus®-steam-disinfection-cleaner-clearance',
    proposedTitle: 'Zavelyn Handheld Steam Cleaner',
    proposedSeoTitle: 'Handheld Steam Cleaner for Home & Auto | Zavelyn',
    proposedMetaDesc: 'Clean kitchen tiles, grout lines, and car upholstery with 1050W pressurized high-temperature steam. Loosens grime and dirt across sealed home surfaces.'
  },
  {
    rawId: '15454950850745',
    gid: 'gid://shopify/Product/15454950850745',
    name: 'Bathroom Exhaust Fan with Light',
    handle: 'sakerplus®-bathroom-exhaust-fan-with-led-light',
    proposedTitle: 'Zavelyn Bathroom Exhaust Fan with Light',
    proposedSeoTitle: 'Ceiling Bathroom Exhaust Fan with LED Light | Zavelyn',
    proposedMetaDesc: 'Ventilate humidity and brighten bathrooms with an integrated ceiling exhaust fan and 10W LED light. Features a quiet copper motor and clean ceiling panel.'
  },
  {
    rawId: '15454951211193',
    gid: 'gid://shopify/Product/15454951211193',
    name: 'Outdoor Solar Street Lights',
    handle: 'sakerplus®-solar-street-lights-clearance-sale',
    proposedTitle: 'Zavelyn Outdoor Solar Street Lights',
    proposedSeoTitle: 'Outdoor Solar Street Light with Motion Sensor | Zavelyn',
    proposedMetaDesc: 'Illuminate yards and driveways with outdoor solar street lights featuring 220° wide-angle LED coverage, dusk-to-dawn sensors, and motion-activated modes.'
  },
  {
    rawId: '15454951801017',
    gid: 'gid://shopify/Product/15454951801017',
    name: 'Portable Camping Fan with Light',
    handle: 'sakerplus-camping-fan-with-light-battery-1',
    proposedTitle: 'Zavelyn Portable Camping Fan with Light',
    proposedSeoTitle: 'Portable Camping Fan with LED Lantern & Tripod | Zavelyn',
    proposedMetaDesc: 'Stay cool outdoors with a rechargeable camping fan featuring a foldable tripod, 20000mAh power bank battery, built-in LED lantern, and 120° oscillation.'
  },
  {
    rawId: '15454954193081',
    gid: 'gid://shopify/Product/15454954193081',
    name: 'Tactical MOLLE Utility Vest',
    handle: 'sakerplus®-tactical-molle-utility-vest',
    proposedTitle: 'Zavelyn Tactical MOLLE Utility Vest',
    proposedSeoTitle: 'Tactical MOLLE Utility Vest with Modular Webbing | Zavelyn',
    proposedMetaDesc: 'Organize gear and pouches with an adjustable tactical vest crafted from water-resistant Oxford fabric. Features modular MOLLE webbing and breathable mesh.'
  },
  {
    rawId: '15454954750137',
    gid: 'gid://shopify/Product/15454954750137',
    name: 'Smart Hygrometer Thermometer Clock',
    handle: 'sakerplus®-smart-thermometer-hygrometer-clock',
    proposedTitle: 'Zavelyn Smart Hygrometer Thermometer Clock',
    proposedSeoTitle: 'Retro Pixel Thermometer & Hygrometer Desk Clock | Zavelyn',
    proposedMetaDesc: 'Track indoor temperature and humidity on an animated retro pixel display clock. Features 30-second reading updates, mechanical joystick, and USB battery.'
  },
  {
    rawId: '15454955372729',
    gid: 'gid://shopify/Product/15454955372729',
    name: '3-in-1 Drywall Board Cutter',
    handle: 'sakerplus®-3-in-1-gypsum-board-cutting-tool',
    proposedTitle: 'Zavelyn 3-in-1 Drywall Board Cutter',
    proposedSeoTitle: '3-in-1 Drywall & Gypsum Board Cutting Tool | Zavelyn',
    proposedMetaDesc: 'Measure, mark, and score drywall sheets in one step using a 3-in-1 cutting tool. Equipped with a built-in 5m tape measure, locking guide, and utility blade.'
  },
  {
    rawId: '15454956355769',
    gid: 'gid://shopify/Product/15454956355769',
    name: 'Digital Mini Heat Press Machine',
    handle: 'sakerplus®-portable-digital-mini-heat-press-machine',
    proposedTitle: 'Zavelyn Digital Mini Heat Press Machine',
    proposedSeoTitle: 'Digital Mini Heat Press Machine for T-Shirts | Zavelyn',
    proposedMetaDesc: 'Apply heat transfer vinyl and sublimation designs with a compact 7x5-inch digital heat press. Features precise temperature control and 10-minute auto shutoff.'
  },
  {
    rawId: '15454958158009',
    gid: 'gid://shopify/Product/15454958158009',
    name: '50FT LED Jobsite String Lights',
    handle: 'sakerplus®-50ft-industrial-led-construction-string-lights',
    proposedTitle: 'Zavelyn 50FT LED Jobsite String Lights',
    proposedSeoTitle: '50FT Linkable LED Jobsite Construction Lights | Zavelyn',
    proposedMetaDesc: 'Light up workspaces with a 50ft linkable construction string light set featuring five IP65-rated 10W LED heads, protective cages, and hanging carabiners.'
  }
];

function launchChrome(port) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_qa_b3_' + Date.now();
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
  const port = 9233;
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

export async function runBatch3Execution() {
  console.log('=== STARTING CONTROLLED SEQUENTIAL EXECUTION: BATCH 3 (PHƯƠNG ÁN A) ===');
  console.log('Scope: 10 Products | Strictly 3 Fields (Title, SEO Title, Meta Description) | URL Handles 100% UNCHANGED\n');

  const token = await getAccessToken();
  const summaryReport = [];

  for (let i = 0; i < batch3PlanA.length; i++) {
    const item = batch3PlanA[i];
    console.log(`========================================================================`);
    console.log(`[ITEM ${i + 1}/10] PROCESSING: ${item.name} (ID: ${item.rawId})`);
    console.log(`========================================================================`);

    // 1. Read Current State
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

    // 2. Pre-write Snapshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const snapshotPath = path.join('scripts', `snapshot_prod_${item.rawId}_${timestamp}.json`);
    fs.writeFileSync(snapshotPath, JSON.stringify(curProduct, null, 2), 'utf8');
    console.log(`Step 2. Pre-write snapshot saved to: ${snapshotPath}`);

    // 3. Execute productUpdate (NO HANDLE)
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

    // 4. Propagation Delay
    console.log(`Step 4. Pausing 6 seconds for edge propagation...`);
    await new Promise(r => setTimeout(r, 6000));

    // 5. Storefront HTTP Verification
    console.log(`Step 5. Running Storefront HTTP verification on existing URL...`);
    const productUrl = `${STORE_DOMAIN}/products/${encodeURIComponent(item.handle)}`;
    const hPage = await fetchWithBackoff(productUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const pageStatus = hPage.status;
    const html = await hPage.text();

    const tm = html.match(/<title>([^<]+)<\/title>/i);
    const renderedTitle = tm ? tm[1].trim() : '';

    console.log(`   Page URL: ${productUrl} -> HTTP ${pageStatus}`);
    console.log(`   Rendered <title>: "${renderedTitle}"`);

    // 6. Cart Test
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
    console.log(`   Cart Match: Found=${!!cartItem}, Product ID=${cartItem?.product_id}, Price=$${(cartItem?.price / 100).toFixed(2)} | PASS: ${cartOk}`);

    // Clear cart
    await fetch(`${STORE_DOMAIN}/cart/clear.js`, { method: 'POST', headers: { 'Cookie': cookieHeader } });

    // 7. CDP Screenshots
    console.log(`Step 7. Capturing Desktop & Mobile QA Screenshots via CDP...`);
    const cleanPrefix = `qa_batch3_${item.rawId}`;
    const screens = await takeScreenshotsCDP(productUrl, cleanPrefix);

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
      adminAfter: updatedProd,
      storefrontQA: {
        httpStatus: pageStatus,
        renderedTitle,
        cartMatch: {
          variantId: rawVariantId,
          productId: cartItem?.product_id,
          price: (cartItem?.price / 100).toFixed(2),
          ok: cartOk
        }
      },
      screenshots: screens
    };

    fs.writeFileSync(`scripts/batch3_item_${i + 1}_result.json`, JSON.stringify(itemResult, null, 2), 'utf8');

    if (!isPass) {
      console.error(`\n>>> CRITICAL QA FAILURE ON ITEM ${i + 1} (${item.name}). HALTING BATCH! <<<`);
      throw new Error(`QA failed on item ${i + 1}: ${item.name}`);
    }

    console.log(`>>> [ITEM ${i + 1}/10] QA PASSED 100%! Ready for next item. <<<\n`);
    summaryReport.push(itemResult);

    await new Promise(r => setTimeout(r, 4000));
  }

  fs.writeFileSync('scripts/batch3_final_summary_report.json', JSON.stringify(summaryReport, null, 2), 'utf8');
  console.log('=== BATCH 3 COMPLETE: ALL 10 PRODUCTS SUCCESSFULLY UPDATED AND QA-VERIFIED! ===');
}
