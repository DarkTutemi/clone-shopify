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
  { name: 'supertots_blue_hero.jpg', url: 'https://www.super-tots.com/cdn/shop/products/BlueM.jpg?v=1644403031' },
  { name: 'supertots_pink_hero.jpg', url: 'https://www.super-tots.com/cdn/shop/products/PinkM.jpg?v=1644403031' },
  { name: 'supertots_yellow_hero.jpg', url: 'https://www.super-tots.com/cdn/shop/products/YellowM.jpg?v=1644403031' },
  { name: 'supertots_green_hero.jpg', url: 'https://www.super-tots.com/cdn/shop/products/GreenM.jpg?v=1644403031' },
  { name: 'supertots_easy_to_use.png', url: 'https://www.super-tots.com/cdn/shop/files/Easy_to_use_9f95b28a-ca77-44cb-a58f-cfd264eeeac5.png?v=1783072029' },
  { name: 'supertots_perfect_teething.png', url: 'https://www.super-tots.com/cdn/shop/files/Perfect_For_Teething.png?v=1783071918' },
  { name: 'supertots_kickstart_taste.png', url: 'https://www.super-tots.com/cdn/shop/files/Kick_Start_baby_Stateus.png?v=1783071984' },
  { name: 'supertots_precious_gift.png', url: 'https://www.super-tots.com/cdn/shop/files/ThanX_Mom.png?v=1783071859' },
  { name: 'supertots_baby_safe.png', url: 'https://www.super-tots.com/cdn/shop/files/BABY_SAFE_Final.png?v=1783071804' },
  { name: 'supertots_nipple_sizes.png', url: 'https://www.super-tots.com/cdn/shop/files/Extra_silicone_nipple_sizes.png?v=1783600690' }
];

async function harvest() {
  const dir = path.join(process.cwd(), 'supertots_media');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  console.log('Downloading 10 key assets for SuperTots...');
  for (const item of assetsToHarvest) {
    const localPath = path.join(dir, item.name);
    console.log(`Downloading ${item.name}...`);
    const res = await fetch(item.url);
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
  console.log('\nAll assets uploaded and saved to supertots_media/uploaded_urls.json!');
}

harvest().catch(console.error);
