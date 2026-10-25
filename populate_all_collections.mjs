import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();

  // Fetch all active products
  console.log('Fetching all active products...');
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json?limit=250&fields=id,title`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const products = data.products || [];
  console.log(`Found ${products.length} products on store.`);

  // Target Collections to populate:
  // 510391353529 = All Products
  // 510391419065 = Deals of the Day
  // 510391386297 = Sale
  const allProductsColId = '510391353529';
  const dealsColId = '510391419065';
  const saleColId = '510391386297';

  // Get existing collects for all-products
  const existingCollectsRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/collects.json?collection_id=${allProductsColId}&limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const existingData = await existingCollectsRes.json();
  const existingProdIds = new Set((existingData.collects || []).map(c => c.product_id));

  console.log(`All Products already has ${existingProdIds.size} products.`);

  for (const p of products) {
    if (!existingProdIds.has(p.id)) {
      try {
        await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/collects.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
          body: JSON.stringify({ collect: { collection_id: allProductsColId, product_id: p.id } })
        });
        console.log(`✔ Added "${p.title}" to All Products`);
      } catch (e) {
        console.error(`Failed to add ${p.id}:`, e.message);
      }
    }
  }

  // Also populate deals of the day and sale with top 10 products
  for (let i = 0; i < Math.min(10, products.length); i++) {
    const p = products[i];
    try {
      await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/collects.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({ collect: { collection_id: dealsColId, product_id: p.id } })
      });
      await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/collects.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({ collect: { collection_id: saleColId, product_id: p.id } })
      });
    } catch (e) {}
  }
  console.log('✔ Populated Deals of the Day and Sale collections!');
}

main().catch(console.error);
