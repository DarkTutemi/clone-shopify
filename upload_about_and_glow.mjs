import fs from 'fs';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const THEME_ID = '189572219034';

async function uploadFile(key, localPath) {
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
  const value = fs.readFileSync(localPath, 'utf8');

  console.log(`Uploading ${key} (${value.length} bytes)...`);
  const putRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': access_token
    },
    body: JSON.stringify({
      asset: { key, value }
    })
  });
  const data = await putRes.json();
  if (data.errors) {
    console.error('Error:', data.errors);
  } else {
    console.log('Success:', data.asset?.key, 'updated at', data.asset?.updated_at);
  }
}

async function main() {
  await uploadFile('sections/earthly-about-us.liquid', 'Clone-earthlyderm/sections/earthly-about-us.liquid');
  await uploadFile('sections/earthly-glow-videos.liquid', 'Clone-earthlyderm/sections/earthly-glow-videos.liquid');
}

main();
