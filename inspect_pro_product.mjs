import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
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

async function run() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/products/15459315220665.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const p = data.product;
  console.log('Title:', p.title);
  console.log('Options:', JSON.stringify(p.options, null, 2));
  console.log('Variants:');
  p.variants.forEach(v => {
    console.log(`- ID: ${v.id} | Title: "${v.title}" | Price: ${v.price} | CompareAt: ${v.compare_at_price} | Opt1: ${v.option1} | image_id: ${v.image_id}`);
  });
  console.log('Images total:', p.images.length);
  p.images.forEach(img => {
    console.log(`- ID: ${img.id} | Alt: "${img.alt}" | Src: ${img.src}`);
  });
}

run().catch(console.error);
