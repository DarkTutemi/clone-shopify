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
  { name: 'selenepets_hero_fountain.jpg', url: 'https://cdn.shopify.com/s/files/1/0576/7869/2434/files/HealthBundle_Wired7L_7d7ee0f9-b067-4fca-8245-ec5f023b5f2f.jpg?v=1777658962' },
  { name: 'selenepets_stainless_exploded.jpg', url: 'https://cdn.shopify.com/s/files/1/0576/7869/2434/files/5_ca2cca36-ef80-4e36-894d-810e5b4b8376.jpg?v=1777268929' },
  { name: 'selenepets_dog_drinking_clean.png', url: 'https://cdn.shopify.com/s/files/1/0576/7869/2434/files/1_8e2b5381-fb3f-457a-9d79-a0a3a4a6f374.png?v=1780898950' },
  { name: 'selenepets_sensor_flow.jpg', url: 'https://cdn.shopify.com/s/files/1/0576/7869/2434/files/2_0fabce70-a8ea-478b-a4d1-27e40f1ce5e6.jpg?v=1777268930' },
  { name: 'selenepets_triple_filtration.jpg', url: 'https://cdn.shopify.com/s/files/1/0576/7869/2434/files/3_2f254baa-40be-44ff-b57f-f909c73248e5.jpg?v=1777268930' },
  { name: 'selenepets_4l_capacity.jpg', url: 'https://cdn.shopify.com/s/files/1/0576/7869/2434/files/HealthBundle_Wired4L_f96d2a32-6a08-4654-8877-904e7448a50e.jpg?v=1777658962' },
  { name: 'selenepets_dirty_bowl_hazard.png', url: 'https://selenepets.com/cdn/shop/files/Frame_3_1.png?v=1790702870&width=1200' },
  { name: 'selenepets_three_systems.png', url: 'https://selenepets.com/cdn/shop/files/Frame_4.png?v=1790703077&width=1200' },
  { name: 'selenepets_ugc_dog_happy.jpg', url: 'https://selenepets.com/cdn/shop/files/wireless_ugc_1-Cover.jpg?v=1776928585&width=900' },
  { name: 'selenepets_cat_dog_shared.jpg', url: 'https://selenepets.com/cdn/shop/files/wireless_ugc_4-Cover.jpg?v=1776928604&width=900' }
];

async function harvest() {
  const dir = path.join(process.cwd(), 'selenepets_media');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  console.log('Downloading 10 key assets for SelenePets Fountain...');
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
  console.log('\nAll SelenePets assets uploaded and saved to selenepets_media/uploaded_urls.json!');
}

harvest().catch(console.error);
