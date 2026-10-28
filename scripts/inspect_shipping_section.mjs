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

async function inspectSections() {
  const token = await getAccessToken();

  const aRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { assets } = await aRes.json();
  const shippingSections = assets.filter(a => a.key.includes('shipping') || a.key.includes('delivery') || a.key.includes('tracking') || a.key.includes('guarantee'));
  console.log('Relevant sections/assets:', shippingSections);

  const tplRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=templates/product.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const tplData = await tplRes.json();
  console.log('\ntemplates/product.json:\n', tplData.asset.value);

  // Fetch each shipping section content if found
  for (const s of shippingSections) {
    const sRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(s.key)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const sData = await sRes.json();
    console.log(`\n================== ${s.key} ==================`);
    console.log(sData.asset.value);
  }
}

inspectSections().catch(console.error);
