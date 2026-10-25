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
  return (await res.json()).access_token;
}

async function run() {
  const token = await getAccessToken();
  const cRes = await fetch(`https://${SHOP}/admin/api/2024-10/custom_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const cData = await cRes.json();
  const targetCol = cData.custom_collections.find(c => c.handle === 'zavelyn-handpans');
  console.log('Target Custom Collection:', targetCol);

  if (targetCol) {
    const pRes = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?collection_id=${targetCol.id}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const pData = await pRes.json();
    console.log(`Products in collection (${pData.products.length}):`);
    pData.products.forEach(p => console.log(`- ID: ${p.id} | ${p.title} | ${p.handle}`));
  }
}

run().catch(console.error);
