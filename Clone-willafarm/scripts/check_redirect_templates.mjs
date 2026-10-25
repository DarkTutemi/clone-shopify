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
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const templates = data.assets.filter(a => a.key.startsWith('templates/'));
  for (const t of templates) {
    const assetRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(t.key)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const aData = await assetRes.json();
    if (aData.asset && aData.asset.value.includes('redirect-home')) {
      console.log('Template using redirect-home:', t.key);
    }
  }
}

run().catch(console.error);
