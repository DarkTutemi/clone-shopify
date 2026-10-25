import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');
  
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('Current products count on dsdujr-vn:', data.products ? data.products.length : 0);
  if (data.products && data.products.length > 0) {
    console.log('Sample existing products:');
    data.products.slice(0, 5).forEach(p => console.log(' -', p.title, `(${p.handle})`));
  }
}

main();
