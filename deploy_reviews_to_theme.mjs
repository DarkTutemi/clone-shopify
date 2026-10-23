import fs from 'fs';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const THEME_ID = '189555966106';

async function uploadThemeAsset(key, localFilePath) {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const { access_token } = await tokenRes.json();
  const value = fs.readFileSync(localFilePath, 'utf8');

  console.log(`Uploading ${key} to theme ${THEME_ID}...`);
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': access_token
    },
    body: JSON.stringify({
      asset: {
        key,
        value
      }
    })
  });
  const result = await res.json();
  if (result.errors) {
    console.error('Upload error:', result.errors);
  } else {
    console.log('Upload success:', result.asset?.key, 'Updated at:', result.asset?.updated_at);
  }
}

async function run() {
  await uploadThemeAsset('sections/bronoir-reviews.liquid', 'Clone-trybronoir/sections/bronoir-reviews.liquid');
}

run();
