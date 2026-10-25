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

const assetsToHarvest = [
  { name: 'clarifion_hero_white.jpg', url: 'https://cdn.shopify.com/s/files/1/0268/0638/6772/products/clarifion1.webp?v=1660782359' },
  { name: 'clarifion_angle_view.jpg', url: 'https://cdn.shopify.com/s/files/1/0268/0638/6772/products/clarifion2.webp?v=1660782359' },
  { name: 'clarifion_outlet_plug.jpg', url: 'https://cdn.shopify.com/s/files/1/0268/0638/6772/products/clarifion3.webp?v=1660782359' },
  { name: 'clarifion_hand_scale.jpg', url: 'https://cdn.shopify.com/s/files/1/0268/0638/6772/products/clarifion4.webp?v=1660782359' },
  { name: 'clarifion_pack_set.jpg', url: 'https://cdn.shopify.com/s/files/1/0268/0638/6772/products/clarifion5.webp?v=1660782360' },
  { name: 'clarifion_bedroom_outlet.jpg', url: 'https://about.clarifion.com/clarifion-contentblocks/ionizer/template/a4-video-rehash/assets/images/ionizer_img2.jpg' },
  { name: 'clarifion_ion_physics.jpg', url: 'https://about.clarifion.com/clarifion-contentblocks/ionizer/template/a4-video-rehash/assets/images/ionizer_img6-v2.jpg' },
  { name: 'clarifion_comparison_chart.jpg', url: 'https://about.clarifion.com/clarifion-contentblocks/ionizer/template/a4-video-rehash/assets/images/ionizer_img7.jpg' },
  { name: 'clarifion_nightlight_sidebar.jpg', url: 'https://about.clarifion.com/clarifion-contentblocks/ionizer/template/a4-video-rehash/assets/images/ionizer_sidebarimg.jpg' }
];

async function harvest() {
  const dir = path.join(process.cwd(), 'clarifion_media');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  console.log('Downloading 9 key assets for Clarifion Air Purifier...');
  for (const item of assetsToHarvest) {
    const localPath = path.join(dir, item.name);
    console.log(`Downloading ${item.name}...`);
    const res = await fetch(item.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (!res.ok) throw new Error(`Failed to download ${item.url}: ${res.status}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(localPath, Buffer.from(buffer));
    console.log(`  Saved ${item.name} (${buffer.byteLength} bytes)`);
  }

  const token = await getAccessToken();
  console.log('\nGot token. Uploading assets to Shopify Theme Assets...');
  const uploadedUrls = {};

  for (const item of assetsToHarvest) {
    const localPath = path.join(dir, item.name);
    const base64 = fs.readFileSync(localPath).toString('base64');
    const assetKey = `assets/${item.name}`;

    console.log(`Uploading ${assetKey}...`);
    const putRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        asset: {
          key: assetKey,
          attachment: base64
        }
      })
    });

    const putData = await putRes.json();
    if (putData.asset && putData.asset.public_url) {
      uploadedUrls[item.name] = putData.asset.public_url;
      console.log(`  ✔ Uploaded: ${putData.asset.public_url}`);
    } else {
      console.error(`  ❌ Failed to upload ${item.name}:`, putData);
    }
  }

  fs.writeFileSync(path.join(dir, 'uploaded_urls.json'), JSON.stringify(uploadedUrls, null, 2));
  console.log('\nAll Clarifion assets uploaded and saved to clarifion_media/uploaded_urls.json!');
}

harvest().catch(console.error);
