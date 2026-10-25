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
  'blower_dry_car.gif',
  'blower_clear_leaves.gif',
  'blower_blast_pc.gif',
  'blower_fire_charcoal.gif',
  'blower_clear_snow.gif',
  'blower_power_test.gif',
  'blower_in_action.gif',
  'package_1_battery.png',
  'package_2_batteries_toolbox.jpg',
  'package_2_batteries_2_nozzles.jpg',
  'package_maxpower_pro_toolbox.jpg',
  'blower_hero_main.jpg',
  'blower_feat_car_dry.png',
  'blower_feat_multipurpose.png',
  'blower_feat_stepless.png',
  'blower_feat_battery.png',
  'blower_feat_air_blade.png'
];

async function main() {
  const token = await getAccessToken();
  console.log('Got access token. Starting uploads...');

  const uploadedUrls = {};

  for (const filename of FILES_TO_UPLOAD) {
    const localPath = path.join('blower_media', filename);
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

  fs.writeFileSync('blower_media/uploaded_urls.json', JSON.stringify(uploadedUrls, null, 2));
  console.log('All uploaded URLs saved to blower_media/uploaded_urls.json');
}

main().catch(console.error);
