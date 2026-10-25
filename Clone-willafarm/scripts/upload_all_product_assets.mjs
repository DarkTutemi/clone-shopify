import fs from 'fs';
import path from 'path';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';
const artifactsDir = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OAuth error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function uploadAsset(token, assetKey, localFilePath) {
  const fileBuffer = fs.readFileSync(localFilePath);
  const base64 = fileBuffer.toString('base64');

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: `assets/${assetKey}`,
        attachment: base64
      }
    })
  });
  const data = await res.json();
  if (res.ok) {
    console.log(`✔ Uploaded ${assetKey} -> ${data.asset.public_url}`);
    return data.asset.public_url;
  } else {
    console.error(`✗ Failed ${assetKey}:`, JSON.stringify(data.errors || data));
    return null;
  }
}

async function main() {
  console.log('--- Uploading Brand New Product Image Suite to Shopify CDN ---');
  const token = await getAccessToken();

  const uploads = [
    { key: 'zavelyn-3pack-bundle.jpg', file: path.join(artifactsDir, 'zavelyn_3pack_bundle_1792853172340.jpg') },
    { key: 'zavelyn-hero-main.png', file: path.join(artifactsDir, 'orig_slide_1.png') },
    { key: 'zavelyn-fireproof-safety.jpg', file: path.join(artifactsDir, 'gallery_fireproof_safety_1792853216731.jpg') },
    { key: 'zavelyn-smart-thermostat.jpg', file: path.join(artifactsDir, 'gallery_smart_thermostat_1792853235579.jpg') },
    { key: 'zavelyn-livestock-warmth.jpg', file: path.join(artifactsDir, 'orig_feat_1.jpg') },
    { key: 'zavelyn-split-comparison.jpg', file: path.join(artifactsDir, 'orig_split_compare.jpg') },
    { key: 'zavelyn-card-temp.jpg', file: path.join(artifactsDir, 'orig_feat_3.jpg') },
    { key: 'zavelyn-card-monitor.jpg', file: path.join(artifactsDir, 'orig_feat_2.jpg') },
    { key: 'zavelyn-card-setup.jpg', file: path.join(artifactsDir, 'orig_feat_4.jpg') },
    { key: 'zavelyn-card-versatile.jpg', file: path.join(artifactsDir, 'orig_feat_1.jpg') }
  ];

  const cdnUrls = {};
  for (const item of uploads) {
    if (fs.existsSync(item.file)) {
      const url = await uploadAsset(token, item.key, item.file);
      cdnUrls[item.key] = url;
    } else {
      console.warn(`File not found: ${item.file}`);
    }
  }

  console.log('\n--- CDN URLs Result ---');
  console.log(JSON.stringify(cdnUrls, null, 2));

  fs.writeFileSync('Clone-willafarm/theme/assets/zavelyn_cdn_urls.json', JSON.stringify(cdnUrls, null, 2));
}

main().catch(console.error);
