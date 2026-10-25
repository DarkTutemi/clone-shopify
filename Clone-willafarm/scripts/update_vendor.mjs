import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  return data.access_token;
}

async function getAllProducts(token) {
  let products = [];
  let sinceId = 0;
  while (true) {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?limit=250&since_id=${sinceId}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    if (!data.products || data.products.length === 0) break;
    products = products.concat(data.products);
    sinceId = data.products[data.products.length - 1].id;
    if (data.products.length < 250) break;
  }
  return products;
}

async function updateProductVendor(token, id) {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/${id}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      product: {
        id,
        vendor: 'Zavelyn'
      }
    })
  });
  return res.ok;
}

async function run() {
  const token = await getAccessToken();
  const products = await getAllProducts(token);
  const vendorToUpdate = products.filter(p => p.vendor === 'Zavelyn®' || p.vendor?.includes('®'));
  console.log(`Updating vendor for ${vendorToUpdate.length} products...`);
  for (const p of vendorToUpdate) {
    await updateProductVendor(token, p.id);
    await new Promise(r => setTimeout(r, 80));
  }
  console.log('✔ All product vendors updated to "Zavelyn"');
}

run().catch(console.error);
