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
  return (await tRes.json()).access_token;
}

async function run() {
  const token = await getAccessToken();
  const handles = ['zavelyn-handpan-master', 'zavelyn-drum-pro', 'zavelyn-drum-plus', 'zavelyn-drum-mini', 'zavelyn-rain-drum'];
  
  for (const h of handles) {
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?handle=${h}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    const p = data.products?.[0];
    console.log(`\nProduct ${h}:`);
    console.log('ID:', p?.id);
    console.log('Title:', p?.title);
    console.log('Images:', p?.images?.map(img => img.src));
  }
}

run().catch(console.error);
