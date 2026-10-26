import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function fetchAllProducts() {
  const token = await getAccessToken();

  // Get total count
  const cRes = await fetch(`https://${SHOP}/admin/api/2024-10/products/count.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const countData = await cRes.json();
  const totalCount = countData.count;
  console.log(`Live Store Real Products Count: ${totalCount}`);

  let allProducts = [];
  let sinceId = 0;
  const limit = 250;

  while (true) {
    const pRes = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?limit=${limit}&since_id=${sinceId}&fields=id,title,handle,body_html,template_suffix,images,options,variants,status,created_at,updated_at`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const pData = await pRes.json();
    const prods = pData.products || [];
    if (prods.length === 0) break;
    allProducts = allProducts.concat(prods);
    sinceId = prods[prods.length - 1].id;
    console.log(`Fetched ${allProducts.length} / ${totalCount} products...`);
    if (prods.length < limit) break;
  }

  fs.writeFileSync('scripts/catalog_all_products.json', JSON.stringify(allProducts, null, 2), 'utf8');
  console.log(`✔ Saved all ${allProducts.length} products to scripts/catalog_all_products.json`);

  // Breakdown of template suffixes
  const templateBreakdown = {};
  for (const p of allProducts) {
    const tpl = p.template_suffix ? `product.${p.template_suffix}` : 'product (default)';
    templateBreakdown[tpl] = (templateBreakdown[tpl] || 0) + 1;
  }
  console.log('\nTemplate breakdown in store:');
  console.table(templateBreakdown);

  return allProducts;
}

fetchAllProducts().catch(err => {
  console.error("Error fetching products:", err);
  process.exit(1);
});
