import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function fetchAsset(token, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.asset.value;
}

async function main() {
  const token = await getAccessToken();

  // 1. Inspect templates/product.json exactly
  const prodJson = await fetchAsset(token, 'templates/product.json');
  console.log('=== templates/product.json ===');
  console.log(prodJson);

  // 2. Inspect sections/willa-main-product.liquid
  const willaMain = await fetchAsset(token, 'sections/willa-main-product.liquid');
  if (willaMain) {
    fs.writeFileSync('scripts/draft_willa_main_product.liquid', willaMain, 'utf-8');
    console.log(`\nSaved sections/willa-main-product.liquid (${willaMain.length} bytes)`);
  }

  // 3. Inspect reviews setup (willa-reviews.liquid or snippets)
  const willaReviews = await fetchAsset(token, 'sections/willa-reviews.liquid');
  if (willaReviews) {
    console.log('\n=== sections/willa-reviews.liquid snippet (first 500 chars) ===');
    console.log(willaReviews.substring(0, 500));
  }

  // 4. Inspect cart-drawer & how cart works
  const willaCart = await fetchAsset(token, 'sections/willa-cart-drawer.liquid') || await fetchAsset(token, 'sections/cart-drawer.liquid');
  if (willaCart) {
    console.log('\n=== cart drawer snippet (first 500 chars) ===');
    console.log(willaCart.substring(0, 500));
  }

  // 5. Check if there are other products with bundles in variants
  const pRes = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?limit=50&fields=id,title,handle,options,variants`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pData = await pRes.json();
  const bundleProds = [];
  for (const p of pData.products) {
    const hasBundleOpt = p.options.some(o => o.name.toLowerCase().includes('bundle') || o.name.toLowerCase().includes('pack') || o.name.toLowerCase().includes('quantity') || o.name.toLowerCase().includes('set'));
    if (hasBundleOpt) {
      bundleProds.push({ title: p.title, handle: p.handle, options: p.options.map(o => o.name) });
    }
  }
  console.log('\nProducts with Bundle/Pack/Quantity options:', bundleProds);
}

main().catch(console.error);
