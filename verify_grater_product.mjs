import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function verify() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/15460886315193.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const p = data.product;
  console.log('Verified Product:');
  console.log(' Title:', p.title);
  console.log(' Handle:', p.handle);
  console.log(' Vendor:', p.vendor);
  console.log(' Images:', p.images.length);
  console.log(' Variants:');
  for (const v of p.variants) {
    console.log(`  - Option: "${v.title}" | Price: $${v.price} | Compare: $${v.compare_at_price} | Policy: "${v.inventory_policy}" | ImageID: ${v.image_id}`);
  }
}

verify().catch(console.error);
