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
  return data.asset?.value || null;
}

async function run() {
  const token = await getAccessToken();

  const keys = [
    'templates/collection.zavelyn-handpans.json',
    'sections/zavelyn-handpans-collection.liquid',
    'assets/zhp-collection.css',
    'templates/product.zavelyn-handpan-master.json',
    'templates/product.zavelyn-drum-pro.json',
    'templates/product.zavelyn-drum-plus.json',
    'templates/product.zavelyn-drum-mini.json',
    'templates/product.zavelyn-rain-drum.json',
    'sections/zavelyn-drum-pro-funnel.liquid',
    'sections/zavelyn-drum-plus-funnel.liquid',
    'sections/zavelyn-drum-mini-funnel.liquid'
  ];

  const results = {};
  for (const k of keys) {
    const val = await fetchAsset(token, k);
    results[k] = val;
    console.log(`Fetched ${k}: ${val ? val.length + ' chars' : 'NOT FOUND'}`);
  }

  // Also fetch products in zavelyn-handpans collection
  const colProdsRes = await fetch(`https://${SHOP}/admin/api/2024-10/collections/510448337081/products.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const colProds = await colProdsRes.json();
  results.collection_products = colProds.products?.map(p => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    template_suffix: p.template_suffix,
    images_count: p.images?.length,
    variants: p.variants?.map(v => ({ id: v.id, title: v.title, price: v.price, compare_at_price: v.compare_at_price }))
  }));

  fs.writeFileSync('scripts/handpan_assets_inspected.json', JSON.stringify(results, null, 2));
  console.log('Saved to scripts/handpan_assets_inspected.json');
}

run().catch(console.error);
