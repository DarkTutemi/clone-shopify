import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function run() {
  const token = await getAccessToken();

  const assetsRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const assetsData = await assetsRes.json();
  const allAssets = assetsData.assets || [];

  const zhpSections = allAssets.filter(a => a.key.includes('zhp') || a.key.includes('handpan'));
  console.log('ZHP related assets on Draft Theme:');
  zhpSections.forEach(a => console.log(a.key));
}

run().catch(console.error);
