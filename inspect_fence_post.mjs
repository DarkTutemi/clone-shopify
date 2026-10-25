import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const PRODUCT_ID = '15454946951353';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  return (await res.json()).access_token;
}

async function run() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/products/${PRODUCT_ID}.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const p = data.product;
  console.log('Title:', p.title);
  console.log('Handle:', p.handle);
  console.log('Template Suffix:', p.template_suffix);
  console.log('Options:', JSON.stringify(p.options, null, 2));
  console.log('Variants:');
  p.variants.forEach(v => {
    console.log(`- ID: ${v.id} | Title: "${v.title}" | Price: $${v.price} | Compare: $${v.compare_at_price}`);
  });
  console.log('Images count:', p.images.length);
  p.images.forEach(img => console.log(`- Img: ${img.src}`));
  console.log('Body length:', p.body_html?.length || 0);
  console.log('Body preview:\n', p.body_html?.slice(0, 500));
}

run().catch(console.error);
