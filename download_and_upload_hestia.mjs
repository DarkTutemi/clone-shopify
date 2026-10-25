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
  { name: 'hestia_hero_brush.jpg', url: 'https://cdn.shopify.com/s/files/1/0926/8772/9020/files/HESTIA_Photos_15_1f4ba992-0bda-463e-883a-7c3019d69fa8.webp?v=1790686440' },
  { name: 'hestia_swipe_blend.jpg', url: 'https://cdn.shopify.com/s/files/1/0926/8772/9020/files/HESTIA_Photos_10_bf0a8f9b-db50-4fe5-9815-b6d55310ec11.webp?v=1777375770' },
  { name: 'hestia_korean_ingredients.jpg', url: 'https://cdn.shopify.com/s/files/1/0926/8772/9020/files/HESTIA_Photos_12_0f9087a6-8b33-49b2-be5c-6e666d6bfca6.webp?v=1777375770' },
  { name: 'hestia_shade_adaptation.jpg', url: 'https://cdn.shopify.com/s/files/1/0926/8772/9020/files/HESTIA_Photos_11_b511a9d9-bf73-49a0-95ef-137c07e0fa0c.webp?v=1782902628' },
  { name: 'hestia_lineup_trio.jpg', url: 'https://cdn.shopify.com/s/files/1/0926/8772/9020/files/hf_20260417_142508_21efc0a9-6e04-45fa-9ce1-5b6d91b57b4a.webp?v=1777375769' },
  { name: 'hestia_before_after_light.jpg', url: 'https://cdn.shopify.com/s/files/1/0926/8772/9020/files/found9_530x_25a46616-0904-46d9-ad22-a816507ec434.webp?v=1774182520' },
  { name: 'hestia_before_after_medium.jpg', url: 'https://cdn.shopify.com/s/files/1/0926/8772/9020/files/found8_530x_6bda90f8-1f41-4ade-ae1a-c2e285a5a7ed.webp?v=1774182520' },
  { name: 'hestia_before_after_mature.jpg', url: 'https://cdn.shopify.com/s/files/1/0926/8772/9020/files/found10_530x_69bc2187-66bd-41a5-a34f-7124469d2bea.webp?v=1774182520' },
  { name: 'hestia_wrinkle_coverage.jpg', url: 'https://cdn.shopify.com/s/files/1/0926/8772/9020/files/found11_530x_1785c1ff-4766-47f5-b7bf-a672fa390905.webp?v=1774182520' },
  { name: 'hestia_customer_spotlight.jpg', url: 'https://cdn.shopify.com/s/files/1/0926/8772/9020/files/HESTIA_Photos_13_fbaab5d8-614e-432e-9538-ba0ebe37131f.webp?v=1777375770' }
];

async function harvest() {
  const dir = path.join(process.cwd(), 'hestia_media');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  console.log('Downloading 10 key assets for Hestia Foundation...');
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
  console.log('\nAll Hestia assets uploaded and saved to hestia_media/uploaded_urls.json!');
}

harvest().catch(console.error);
