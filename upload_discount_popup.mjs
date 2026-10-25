import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

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
  await uploadFile('snippets/earthly-discount-popup.liquid', 'Clone-earthlyderm/snippets/earthly-discount-popup.liquid');
  await uploadFile('layout/theme.liquid', 'Clone-earthlyderm/layout/theme.liquid');
}

main();
