import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

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

  const keys = [
    'templates/product.zavelyn-drum-pro.json',
    'templates/product.zavelyn-drum-plus.json',
    'templates/product.zavelyn-drum-mini.json'
  ];

  for (const k of keys) {
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${k}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const d = await res.json();
    console.log(`\n=== ${k} ===`);
    console.log(d.asset ? d.asset.value : d);
  }
}

run().catch(console.error);
