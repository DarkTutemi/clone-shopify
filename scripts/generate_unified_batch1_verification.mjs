import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const STORE_DOMAIN = 'https://tryzavelyn.com';
const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';

const batch1 = [
  {
    rawId: '15454947901625',
    gid: 'gid://shopify/Product/15454947901625',
    name: 'Sensory Textured Floor Mats',
    oldHandle: 'sakerplus®-tpu-sensory-textured-floor-mats',
    newHandle: 'zavelyn-sensory-floor-mats',
    redirectId: 'gid://shopify/UrlRedirect/604051898553',
    trackingQuery: 'utm_source=facebook&utm_campaign=winter_promo&fbclid=AQ_test123'
  },
  {
    rawId: '15454948163769',
    gid: 'gid://shopify/Product/15454948163769',
    name: 'Tearable Non-Slip Drawer Liner',
    oldHandle: 'sakerplus®-tearable-non-slip-drawer-liner',
    newHandle: 'zavelyn-tearable-drawer-liner',
    redirectId: 'gid://shopify/UrlRedirect/604052095161',
    trackingQuery: 'utm_source=facebook&utm_campaign=drawer_liner_winter&fbclid=AQ_fbclid_p2_success'
  },
  {
    rawId: '15454948556985',
    gid: 'gid://shopify/Product/15454948556985',
    name: 'Tearable Shelf & Drawer Liner',
    oldHandle: 'sakerplus®-tearable-shelf-liner-and-drawer-liner',
    newHandle: 'zavelyn-shelf-drawer-liner',
    redirectId: 'gid://shopify/UrlRedirect/604052357305',
    trackingQuery: 'utm_source=facebook&utm_campaign=shelf_liner_promo&fbclid=AQ_fbclid_p3_success'
  }
];

async function run() {
  console.log('=== AUDITING ALL 3 PRODUCTS LIVE POST-MIGRATION ===\n');
  const token = await getAccessToken();
  const results = [];

  for (const item of batch1) {
    console.log(`Checking ${item.name} (${item.rawId})...`);

    // 1. Admin Query
    const qRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: `
          query {
            product(id: "${item.gid}") {
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
    const adminProd = qData.data?.product;

    await new Promise(r => setTimeout(r, 2000));

    // 2. Old URL Redirect
    const oldUrlEncoded = `${STORE_DOMAIN}/products/${encodeURIComponent(item.oldHandle)}`;
    const hOld = await fetch(oldUrlEncoded, {
      redirect: 'manual',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const oldStatus = hOld.status;
    const locationHeader = hOld.headers.get('location') || '';

    await new Promise(r => setTimeout(r, 2000));

    // 3. Tracking Redirect
    const trackUrl = `${oldUrlEncoded}?${item.trackingQuery}`;
    const hTrack = await fetch(trackUrl, {
      redirect: 'manual',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const trackStatus = hTrack.status;
    const trackLoc = hTrack.headers.get('location') || '';
    const trackPreserved = item.trackingQuery.split('&').every(q => trackLoc.includes(q.split('=')[0]));

    await new Promise(r => setTimeout(r, 2000));

    // 4. New URL DOM
    const newUrl = `${STORE_DOMAIN}/products/${item.newHandle}`;
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

    await new Promise(r => setTimeout(r, 2000));

    // 5. Cart Test
    const primaryVariant = adminProd.variants?.nodes[0];
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
    const cartOk = cartItem && String(cartItem.product_id) === String(item.rawId);

    // Clear cart
    await fetch(`${STORE_DOMAIN}/cart/clear.js`, { method: 'POST', headers: { 'Cookie': cookieHeader } });

    const deskScreenshot = path.join(ARTIFACTS_DIR, `qa_batch1_${item.newHandle}_desktop_1440.png`);
    const mobScreenshot = path.join(ARTIFACTS_DIR, `qa_batch1_${item.newHandle}_mobile_390.png`);

    const itemReport = {
      productId: item.rawId,
      name: item.name,
      status: (oldStatus === 301 && newStatus === 200 && trackPreserved && cartOk) ? 'PASS' : 'FAIL',
      admin: adminProd,
      redirectId: item.redirectId,
      oldUrl: oldUrlEncoded,
      newUrl,
      httpQA: {
        oldStatus,
        locationHeader,
        trackStatus,
        trackLocation: trackLoc,
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
        cartOk: !!cartOk
      },
      screenshots: {
        desktop: fs.existsSync(deskScreenshot) ? deskScreenshot : null,
        mobile: fs.existsSync(mobScreenshot) ? mobScreenshot : null
      }
    };

    console.log(`   -> Status: ${itemReport.status} (301: ${oldStatus}, 200: ${newStatus}, Track: ${trackPreserved}, Cart: ${cartOk})\n`);
    results.push(itemReport);
    await new Promise(r => setTimeout(r, 2000));
  }

  fs.writeFileSync('scripts/final_batch1_verified_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('ALL 3 VERIFICATIONS COMPLETE AND SAVED TO scripts/final_batch1_verified_results.json');
}

run().catch(console.error);
