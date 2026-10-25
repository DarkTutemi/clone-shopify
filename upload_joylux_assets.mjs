import fs from 'fs';
import path from 'path';

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

async function uploadAll() {
  const token = await getAccessToken();
  console.log('Got access token. Uploading Joylux assets to Shopify Theme Asset API...');

  const mediaDir = './joylux_media';
  const files = fs.readdirSync(mediaDir).filter(f => !f.endsWith('.json'));

  const uploadedUrls = {};

  for (const f of files) {
    const filePath = path.join(mediaDir, f);
    const content = fs.readFileSync(filePath).toString('base64');
    const assetKey = `assets/${f}`;

    console.log(`Uploading ${assetKey}...`);
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        asset: {
          key: assetKey,
          attachment: content
        }
      })
    });

    const data = await res.json();
    if (data.asset && data.asset.public_url) {
      console.log(`  ✔ Uploaded: ${data.asset.public_url}`);
      uploadedUrls[f] = data.asset.public_url;
    } else {
      console.error(`  ❌ Failed to upload ${f}:`, JSON.stringify(data));
    }
  }

  fs.writeFileSync(path.join(mediaDir, 'uploaded_urls.json'), JSON.stringify(uploadedUrls, null, 2));
  console.log(`\n🎉 All ${Object.keys(uploadedUrls).length} assets uploaded and saved to joylux_media/uploaded_urls.json`);
}

uploadAll().catch(console.error);
