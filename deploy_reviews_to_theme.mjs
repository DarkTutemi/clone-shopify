import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

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
