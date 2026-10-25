import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const THEME_ID = '186607567033';

async function main() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/themes/${THEME_ID}/assets.json?asset[key]=sections/willa-main-collection.liquid`, {
    headers: { 'X-Shopify-Access-Token': access_token }
  });
  const data = await res.json();
  if (data.asset?.value) {
    fs.writeFileSync('willa-main-collection.liquid', data.asset.value);
    console.log('Saved willa-main-collection.liquid, length:', data.asset.value.length);
  } else {
    console.log('Error fetching asset:', data);
  }
}

main().catch(console.error);
