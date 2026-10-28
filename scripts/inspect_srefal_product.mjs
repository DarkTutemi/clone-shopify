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

async function run() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?handle=srefalsteam`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const prod = data.products[0];
  console.log('Title:', prod.title);
  console.log('Options:', prod.options);
  console.log('Variants count:', prod.variants.length);
  prod.variants.forEach(v => {
    console.log(` - ID: ${v.id}, Title: "${v.title}", Price: ${v.price}, Compare: ${v.compare_at_price}, SKU: ${v.sku}`);
  });
}

run();
