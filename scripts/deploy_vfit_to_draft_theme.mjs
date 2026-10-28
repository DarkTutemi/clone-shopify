import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const DRAFT_THEME_ID = 187720335545; // Strictly Draft Theme only!

async function uploadAsset(token, key, value, isBinary = false) {
  const payload = { asset: { key } };
  if (isBinary) {
    payload.asset.attachment = value.toString('base64');
  } else {
    payload.asset.value = value;
  }

  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${DRAFT_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (res.ok && data.asset) {
    console.log(`✓ Uploaded ${key} (${data.asset.size || value.length} bytes)`);
    return true;
  } else {
    console.error(`✗ Failed to upload ${key}:`, data);
    return false;
  }
}

async function main() {
  console.log(`=== DEPLOYING VERSION A TO DRAFT THEME ${DRAFT_THEME_ID} ===`);
  const token = await getAccessToken();

  // 1. Upload Gallery Images
  const mediaFiles = [
    'eyemask_source_hd.jpg',
    'eyemask_slide_2.jpg',
    'eyemask_slide_3.jpg',
    'eyemask_slide_4.jpg',
    'facemask_source_hd.jpg',
    'facemask_slide_2.jpg',
    'facemask_slide_3.jpg',
    'facemask_slide_4.jpg'
  ];

  console.log('\n1. Uploading gallery image assets...');
  for (const filename of mediaFiles) {
    const filePath = path.resolve('prototypes/vfit-selfcare-upsell/media', filename);
    if (fs.existsSync(filePath)) {
      const buf = fs.readFileSync(filePath);
      await uploadAsset(token, `assets/${filename}`, buf, true);
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  }

  // 2. Upload snippets/vfit-selfcare-upsell.liquid
  console.log('\n2. Uploading snippets/vfit-selfcare-upsell.liquid...');
  const snippetPath = path.resolve('snippets/vfit-selfcare-upsell.liquid');
  const snippetContent = fs.readFileSync(snippetPath, 'utf8');
  await uploadAsset(token, 'snippets/vfit-selfcare-upsell.liquid', snippetContent, false);

  console.log('\n✨ DRAFT THEME INTEGRATION COMPLETED SUCCESSFULLY!');
  console.log(`Preview URL: https://${SHOP}/products/zavelyn-vfit-red-light-intimate-wellness-device?preview_theme_id=${DRAFT_THEME_ID}`);
}

main().catch(err => {
  console.error('Fatal deployment error:', err);
  process.exit(1);
});
