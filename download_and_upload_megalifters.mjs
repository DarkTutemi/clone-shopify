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
  { name: 'megalifters_hero_excavator.png', url: 'https://cdn.shopify.com/s/files/1/0736/2871/3146/files/Halloween_Sale_Excavator_Toy_Promo.png?v=1790812135' },
  { name: 'megalifters_excavator_model.webp', url: 'https://cdn.shopify.com/s/files/1/0736/2871/3146/files/S2b32623ebe0942ea8f34aef70262e118a.webp?v=1765785243' },
  { name: 'megalifters_dumptruck_model.webp', url: 'https://cdn.shopify.com/s/files/1/0736/2871/3146/files/S6c2a3cf774b942edaf58fef1c29cb5aaI.webp?v=1765785243' },
  { name: 'megalifters_bulldozer_model.webp', url: 'https://cdn.shopify.com/s/files/1/0736/2871/3146/files/Sdda328dd0ecc45868aace68e134418das.webp?v=1765785243' },
  { name: 'megalifters_loader_model.png', url: 'https://cdn.shopify.com/s/files/1/0736/2871/3146/files/ChatGPT_Image_Aug_22_2026_08_34_46_AM.png?v=1787351701' },
  { name: 'megalifters_kid_outdoor_play.png', url: 'https://cdn.shopify.com/s/files/1/0736/2871/3146/files/ChatGPT_Image_Dec_15_2025_06_46_29_PM.png?v=1765785027' },
  { name: 'megalifters_digging_sand.png', url: 'https://cdn.shopify.com/s/files/1/0736/2871/3146/files/ChatGPT_Image_Dec_15_2025_06_48_09_PM.png?v=1765785027' },
  { name: 'megalifters_fleet_lineup.png', url: 'https://cdn.shopify.com/s/files/1/0736/2871/3146/files/ChatGPT_Image_Aug_22_2026_08_27_46_AM.png?v=1787351443' },
  { name: 'megalifters_scale_specs.png', url: 'https://cdn.shopify.com/s/files/1/0736/2871/3146/files/2025-12-15_18_48_49-4WD_Remote_Control_Excavator_Toy_Radio_Controlled_RC_Dump_Truck_Vehicle_Crawler.png?v=1765785243' },
  { name: 'megalifters_father_son_play.png', url: 'https://cdn.shopify.com/s/files/1/0736/2871/3146/files/ChatGPT_Image_Dec_15_2025_06_45_39_PM.png?v=1765785027' }
];

async function harvest() {
  const dir = path.join(process.cwd(), 'megalifters_media');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  console.log('Downloading 10 key assets for Mega Lifters...');
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
  console.log('\nAll Mega Lifters assets uploaded and saved to megalifters_media/uploaded_urls.json!');
}

harvest().catch(console.error);
