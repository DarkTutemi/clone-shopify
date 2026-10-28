import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187708571833';

async function main() {
  const token = await getAccessToken();

  async function uploadAsset(key, content) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ asset: { key, value: content } })
    });
    const data = await res.json();
    if (data.asset) {
      console.log(`✓ Uploaded to Draft Theme: ${key} (${content.length} chars)`);
      return true;
    } else {
      console.error(`✗ Failed to upload ${key}:`, data);
      return false;
    }
  }

  // 1. sections/zavelyn-pdp-description-fallback.liquid
  const descFallback = fs.readFileSync('draft_working/sections_zavelyn-pdp-description-fallback.liquid', 'utf8');
  await uploadAsset('sections/zavelyn-pdp-description-fallback.liquid', descFallback);

  // 2. sections/zavelyn-pdp-main.liquid
  const mainLiquid = fs.readFileSync('draft_working/sections_zavelyn-pdp-main-refactored.liquid', 'utf8');
  await uploadAsset('sections/zavelyn-pdp-main.liquid', mainLiquid);

  // 3. templates/product.json
  const productJson = fs.readFileSync('draft_working/templates_product_with_image_blocks.json', 'utf8');
  await uploadAsset('templates/product.json', productJson);

  console.log('\n======================================================');
  console.log(`✓ DEPLOYED IMAGE BLOCKS TO DRAFT THEME ${DRAFT_THEME_ID}`);
  console.log('======================================================\n');
}

main().catch(console.error);
