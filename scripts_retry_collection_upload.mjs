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

  // Fetch templates/page.zavelyn-handpans.json which succeeded
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=templates/page.zavelyn-handpans.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const d = await res.json();
  const pageJson = d.asset.value;

  console.log('Now uploading to templates/collection.zavelyn-handpans.json...');
  const putRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'templates/collection.zavelyn-handpans.json',
        value: pageJson
      }
    })
  });
  const putData = await putRes.json();
  console.log('Result:', putData.asset ? 'SUCCESS' : putData);
}

run().catch(console.error);
