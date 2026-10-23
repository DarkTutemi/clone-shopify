import fs from 'fs';

const SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN || 'vwpb1k-8z.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || process.env.SHOPIFY_CLIENT_SECRET || process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const THEME_ID = '189598367898';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function uploadSpecific(key, filePath) {
  const token = await getAccessToken();
  const value = fs.readFileSync(filePath, 'utf8');
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: { key, value }
    })
  });
  const data = await res.json();
  console.log(`Uploaded ${key}:`, data.asset?.key ? 'SUCCESS' : JSON.stringify(data.errors));
}

async function run() {
  await uploadSpecific('sections/header-group.json', 'h:/Shopify-Clone/Clone-navage/sections/header-group.json');
  await uploadSpecific('sections/footer-group.json', 'h:/Shopify-Clone/Clone-navage/sections/footer-group.json');
  await uploadSpecific('templates/index.json', 'h:/Shopify-Clone/Clone-navage/templates/index.json');
  await uploadSpecific('templates/product.json', 'h:/Shopify-Clone/Clone-navage/templates/product.json');
}

run().catch(console.error);
