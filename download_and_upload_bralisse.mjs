import fs from 'fs';
import path from 'path';

const outDir = 'bralisse_media';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const mediaList = [
  { name: 'bralisse_hero_cloud.jpg', url: 'https://bralisse.com/cdn/shop/files/ShopifyMainImage_InWhiteCloud.jpg?v=1708146758&width=1200' },
  { name: 'bralisse_tan_front.jpg', url: 'https://cdn.shopify.com/s/files/1/0854/1172/5602/files/BRALISSE_tan_front_view_2.jpg?v=1707892677&width=1000' },
  { name: 'bralisse_brown_front.jpg', url: 'https://cdn.shopify.com/s/files/1/0854/1172/5602/files/BRALISSE_brown_front_view.jpg?v=1707892677&width=1000' },
  { name: 'bralisse_black_front.jpg', url: 'https://cdn.shopify.com/s/files/1/0854/1172/5602/files/BRALISSE_black_front_view.jpg?v=1708156413&width=1000' },
  { name: 'bralisse_white_front.jpg', url: 'https://cdn.shopify.com/s/files/1/0854/1172/5602/files/BRALISSE_White_front_side_view.jpg?v=1728446594&width=1000' },
  { name: 'bralisse_pink_front.jpg', url: 'https://cdn.shopify.com/s/files/1/0854/1172/5602/files/BRALISSE_pink_front_view.jpg?v=1791842390&width=1000' },
  { name: 'bralisse_red_front.jpg', url: 'https://cdn.shopify.com/s/files/1/0854/1172/5602/files/red_color_SHOPIFY_FrontView.jpg?v=1770519004&width=1000' },
  { name: 'bralisse_size_models.jpg', url: 'https://cdn.shopify.com/s/files/1/0854/1172/5602/files/size_large_models_square_comp.jpg?v=1708156413&width=1000' },
  { name: 'bralisse_side_view.jpg', url: 'https://cdn.shopify.com/s/files/1/0854/1172/5602/files/BRALISSE_tan_side_view_1.jpg?v=1707892677&width=1000' },
  { name: 'bralisse_back_view.jpg', url: 'https://cdn.shopify.com/s/files/1/0854/1172/5602/files/BRALISSE_tan_back_view_1.jpg?v=1707892677&width=1000' }
];

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

async function run() {
  console.log(`Downloading ${mediaList.length} Bralisse media files...`);
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };
  
  for (const item of mediaList) {
    const dest = path.join(outDir, item.name);
    const res = await fetch(item.url, { headers });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`✔ Downloaded: ${item.name} (${buf.length} bytes)`);
    } else {
      console.error(`❌ Failed: ${item.name}`);
    }
  }

  const token = await getAccessToken();
  console.log('Uploading to Shopify Theme Assets...');
  const uploadedUrls = {};

  const files = fs.readdirSync(outDir).filter(f => !f.endsWith('.json'));
  for (const f of files) {
    const filePath = path.join(outDir, f);
    const content = fs.readFileSync(filePath).toString('base64');
    const assetKey = `assets/${f}`;

    console.log(`Uploading ${assetKey}...`);
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ asset: { key: assetKey, attachment: content } })
    });
    const data = await res.json();
    if (data.asset && data.asset.public_url) {
      console.log(`  ✔ Uploaded: ${data.asset.public_url}`);
      uploadedUrls[f] = data.asset.public_url;
    } else {
      console.error(`  ❌ Failed: ${f}`);
    }
  }

  fs.writeFileSync(path.join(outDir, 'uploaded_urls.json'), JSON.stringify(uploadedUrls, null, 2));
  console.log('🎉 All Bralisse assets uploaded to Shopify CDN!');
}

run().catch(console.error);
