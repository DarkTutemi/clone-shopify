import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
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

async function run() {
  const token = await getAccessToken();
  const productIds = [
    { name: 'Thoson MagTrack', id: '15455481102521' },
    { name: 'Srefal Steam Pro', id: '15455242387641' },
    { name: 'Yeoman Sweep', id: '15455092572345' }
  ];

  for (const p of productIds) {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/${p.id}.json`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    console.log(`\n========================================`);
    console.log(`PRODUCT ASSETS: ${p.name} (${p.id})`);
    console.log(`========================================`);
    console.log(`Title: ${data.product.title}`);
    console.log(`Images (${data.product.images.length}):`);
    data.product.images.forEach((img, i) => {
      console.log(`  [${i+1}] ID: ${img.id} | SRC: ${img.src}`);
    });
    console.log(`Variants (${data.product.variants.length}):`);
    data.product.variants.forEach((v, i) => {
      console.log(`  [${i+1}] Title: ${v.title} | ID: ${v.id} | Price: $${v.price} | Compare: $${v.compare_at_price}`);
    });
  }
}

run().catch(console.error);
