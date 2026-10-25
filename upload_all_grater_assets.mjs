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

const FILES_TO_UPLOAD = [
  'grater_hero_banner.jpg',
  'pkg_white_1pc.jpg',
  'pkg_green_1pc.jpg',
  'pkg_white_2pcs.jpg',
  'pkg_green_2pcs.jpg',
  'grater_drum_slice.png',
  'grater_drum_coarse.png',
  'grater_drum_fine.png',
  'grater_drum_waffle.png',
  'grater_feat_safe_hopper.png',
  'grater_feat_rotary_power.png',
  'grater_feat_suction_lock.png',
  'grater_feat_easy_rinse.png',
  'grater_prep_holiday.png'
];

async function main() {
  const token = await getAccessToken();
  console.log('Got access token. Starting uploads to Shopify CDN...');

  const uploadedUrls = {};

  for (const filename of FILES_TO_UPLOAD) {
    const localPath = path.join('grater_media', filename);
    const assetKey = `assets/${filename}`;
    console.log(`Uploading ${filename}...`);
    try {
      const buf = fs.readFileSync(localPath);
      const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
          asset: {
            key: assetKey,
            attachment: buf.toString('base64')
          }
        })
      });
      const data = await res.json();
      if (data.asset && data.asset.public_url) {
        console.log(`  ✔ Uploaded: ${data.asset.public_url}`);
        uploadedUrls[filename] = data.asset.public_url;
      } else {
        console.error(`  ✗ Error uploading ${filename}:`, JSON.stringify(data));
      }
    } catch (e) {
      console.error(`  ✗ Exception uploading ${filename}:`, e.message);
    }
  }

  fs.writeFileSync('grater_media/uploaded_urls.json', JSON.stringify(uploadedUrls, null, 2));
  console.log('All uploaded URLs saved to grater_media/uploaded_urls.json');
}

main().catch(console.error);
