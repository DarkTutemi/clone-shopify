import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function inspectString() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=sections/willa-main-product.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  let content = data.asset.value;

  const targetPatternStart = '<!-- Variants / Bundle Selector -->';
  const targetPatternEnd = '<!-- Quantity & ATC -->';

  const startIndex = content.indexOf(targetPatternStart);
  const endIndex = content.indexOf(targetPatternEnd);

  // Read replacement from update_theme_tiered_bundle.mjs
  // Let's see what content is created
  console.log('startIndex:', startIndex, 'endIndex:', endIndex);
}

inspectString().catch(console.error);
