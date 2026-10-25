import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

const GIF_FILES = [
  { local: 'fence_gifs/gif_1_no_dig_hammer.gif', assetKey: 'assets/fence_gif_1_no_dig_hammer.gif' },
  { local: 'fence_gifs/gif_2_stop_wobble.gif', assetKey: 'assets/fence_gif_2_stop_wobble.gif' },
  { local: 'fence_gifs/gif_3_tighten_bolts.gif', assetKey: 'assets/fence_gif_3_tighten_bolts.gif' },
  { local: 'fence_gifs/gif_4_stability_storm.gif', assetKey: 'assets/fence_gif_4_stability_storm.gif' }
];

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');

  const uploadedUrls = {};

  for (const item of GIF_FILES) {
    console.log(`Uploading ${item.local} -> ${item.assetKey}...`);
    const buf = fs.readFileSync(item.local);
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        asset: {
          key: item.assetKey,
          attachment: buf.toString('base64')
        }
      })
    });
    const data = await res.json();
    if (data.asset && data.asset.public_url) {
      console.log(`✔ Uploaded! URL: ${data.asset.public_url}`);
      uploadedUrls[item.assetKey] = data.asset.public_url;
    } else {
      console.error(`✗ Error uploading ${item.assetKey}:`, data);
    }
  }

  fs.writeFileSync('fence_gifs/uploaded_urls.json', JSON.stringify(uploadedUrls, null, 2));
  console.log('Saved all uploaded URLs to fence_gifs/uploaded_urls.json');
}

main().catch(console.error);
