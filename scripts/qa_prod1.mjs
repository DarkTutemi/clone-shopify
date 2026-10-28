import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const STORE_DOMAIN = 'https://tryzavelyn.com';

const prod1 = {
  rawId: '15454947901625',
  gid: 'gid://shopify/Product/15454947901625',
  name: 'Sensory Textured Floor Mats',
  oldHandle: 'sakerplus®-tpu-sensory-textured-floor-mats',
  proposedTitle: 'Zavelyn Sensory Textured Floor Mats',
  proposedSeoTitle: 'TPU Sensory Textured Floor Mats for Kids & Adults | Zavelyn',
  proposedMetaDesc: 'Engage tactile exploration with interlocking TPU textured floor mats featuring six raised patterns. Easy to assemble, clean, and arrange for kids or adults.',
  proposedHandle: 'zavelyn-sensory-floor-mats'
};

async function verifyProduct1() {
  console.log('=== VERIFYING PRODUCT 1 QA WITH CONTROLLED INTERVALS ===\n');
  const token = await getAccessToken();

  // 1. Check GraphQL Admin Product Data
  const qRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: `
        query {
          product(id: "${prod1.gid}") {
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

  await new Promise(r => setTimeout(r, 2500));

  // 2. Check 301 Redirect on Old URL
  const oldUrlEncoded = `${STORE_DOMAIN}/products/${encodeURIComponent(prod1.oldHandle)}`;
  const hOld = await fetch(oldUrlEncoded, {
    redirect: 'manual',
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const oldStatus = hOld.status;
  const locationHeader = hOld.headers.get('location') || '';
  console.log(`2. Old URL (${oldUrlEncoded}) -> HTTP ${oldStatus} | Location: ${locationHeader}`);

  await new Promise(r => setTimeout(r, 2500));

  // 3. Check Tracking Query Parameters
  const trackingUrl = `${oldUrlEncoded}?utm_source=facebook&utm_campaign=winter_promo&fbclid=AQ_test123`;
  const hTrack = await fetch(trackingUrl, {
    redirect: 'manual',
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const trackStatus = hTrack.status;
  const trackLocation = hTrack.headers.get('location') || '';
  const trackPreserved = trackLocation.includes('utm_source=facebook') && trackLocation.includes('fbclid=AQ_test123');
  console.log(`3. Tracking URL -> HTTP ${trackStatus} | Location: ${trackLocation} | Preserved: ${trackPreserved}`);

  await new Promise(r => setTimeout(r, 2500));

  // 4. Check New URL (HTTP 200) & Rendered DOM
  const newUrl = `${STORE_DOMAIN}/products/${prod1.proposedHandle}`;
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

  await new Promise(r => setTimeout(r, 2500));

  const cartRes = await fetch(`${STORE_DOMAIN}/cart.js`, {
    headers: { 'Cookie': cookieHeader, 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const cartJson = await cartRes.json();
  const cartItem = cartJson.items?.find(it => String(it.id) === String(rawVariantId) || String(it.variant_id) === String(rawVariantId));
  const cartOk = cartItem && String(cartItem.product_id) === String(prod1.rawId);
  console.log(`5. Cart Verification: Item Found=${!!cartItem}, Product ID=${cartItem?.product_id}, Variant ID=${cartItem?.id}, Price=$${(cartItem?.price / 100).toFixed(2)} | PASS: ${cartOk}`);

  // Clear cart
  await fetch(`${STORE_DOMAIN}/cart/clear.js`, { method: 'POST', headers: { 'Cookie': cookieHeader } });

  const deskPath = path.join(ARTIFACTS_DIR, `qa_batch1_${prod1.proposedHandle}_desktop_1440.png`);
  const mobPath = path.join(ARTIFACTS_DIR, `qa_batch1_${prod1.proposedHandle}_mobile_390.png`);

  // 7. Summary
  const isPass = (
    (oldStatus === 301 || oldStatus === 302) &&
    newStatus === 200 &&
    trackPreserved &&
    cartOk &&
    renderedTitle.includes('Zavelyn')
  );

  const finalReport = {
    productId: prod1.rawId,
    name: prod1.name,
    status: isPass ? 'PASS' : 'FAIL',
    mutationResult: prodData,
    redirectId: 'gid://shopify/UrlRedirect/604051898553',
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
    screenshots: {
      deskPath: fs.existsSync(deskPath) ? deskPath : null,
      mobPath: fs.existsSync(mobPath) ? mobPath : null
    }
  };

  fs.writeFileSync('scripts/batch1_item1_result.json', JSON.stringify(finalReport, null, 2), 'utf8');
  console.log(`\nPRODUCT 1 QA RESULT: ${finalReport.status}`);
}

verifyProduct1().catch(console.error);
