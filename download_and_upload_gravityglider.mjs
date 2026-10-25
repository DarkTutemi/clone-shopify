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
  { name: 'glider_hero_flight.webp', url: 'https://cdn.shopify.com/s/files/1/0549/5626/1451/files/Gravity_Glider_-_Yellow_3.webp?v=1728994707' },
  { name: 'glider_blue_fighter.webp', url: 'https://cdn.shopify.com/s/files/1/0549/5626/1451/files/Gravity_Glider_-_Yellow_2.webp?v=1763716296' },
  { name: 'glider_red_fighter.webp', url: 'https://cdn.shopify.com/s/files/1/0549/5626/1451/files/Gravity_Glider_-_Yellow_1.webp?v=1763716296' },
  { name: 'glider_yellow_fighter.webp', url: 'https://cdn.shopify.com/s/files/1/0549/5626/1451/files/Gravity_Glider_-_Yellow.webp?v=1763716296' },
  { name: 'glider_hand_toss.webp', url: 'https://cdn.shopify.com/s/files/1/0549/5626/1451/files/Hand_Toss_1_-1.webp?v=1763716296' },
  { name: 'glider_stunt_loop.webp', url: 'https://cdn.shopify.com/s/files/1/0549/5626/1451/files/ezgif.com-video-to-gif-2023-06-17T161516.733_480x480_cbac48aa-1bc2-43e7-8de9-7c9c43b71fce_480x480.webp?v=1697287001' },
  { name: 'glider_dimensions_specs.webp', url: 'https://cdn.shopify.com/s/files/1/0549/5626/1451/files/s-l1600_5.webp?v=1728995157' },
  { name: 'glider_box_packaging.png', url: 'https://cdn.shopify.com/s/files/1/0549/5626/1451/files/Indestructible_Jet_toy_packaging.png?v=1791276137' }
];

async function harvest() {
  const dir = path.join(process.cwd(), 'gravityglider_media');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  console.log('Downloading 8 key assets for Gravity Glider...');
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
  console.log('\nAll Gravity Glider assets uploaded and saved to gravityglider_media/uploaded_urls.json!');
}

harvest().catch(console.error);
