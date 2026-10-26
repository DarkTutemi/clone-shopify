import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function fetchAsset(key, token) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const json = await res.json();
  return json.asset?.value || '';
}

async function main() {
  const token = await getAccessToken();
  console.log('--- INSPECTING INDEX.JSON CONTENT ---');
  const indexVal = await fetchAsset('templates/index.json', token);
  console.log(indexVal);

  console.log('\n--- INSPECTING WILLA-HERO.LIQUID ---');
  const heroVal = await fetchAsset('sections/willa-hero.liquid', token);
  console.log(heroVal.substring(0, 1500));

  console.log('\n--- INSPECTING WILLA-FOOTER.LIQUID ---');
  const footerVal = await fetchAsset('sections/willa-footer.liquid', token);
  console.log(footerVal.substring(0, 1500));
}

main().catch(console.error);
