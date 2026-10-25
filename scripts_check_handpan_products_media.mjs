import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

async function run() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const token = (await tRes.json()).access_token;

  const handles = ['zavelyn-drum-pro', 'zavelyn-drum-plus', 'zavelyn-drum-mini'];
  for (const h of handles) {
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?handle=${h}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    const p = data.products[0];
    console.log(`\nProduct ${p.title} (${p.handle}):`);
    console.log('ID:', p.id);
    console.log('Images:', p.images.slice(0, 4).map(img => img.src));
    console.log('Variants count:', p.variants.length, 'First variant ID:', p.variants[0].id, 'Price:', p.variants[0].price);
  }
}

run().catch(console.error);
