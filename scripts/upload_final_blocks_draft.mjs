import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187708571833';

async function main() {
  const token = await getAccessToken();

  async function upload(key, content) {
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
      console.log(`✓ Uploaded ${key}`);
      return true;
    } else {
      console.error(`✗ Failed to upload ${key}:`, data);
      return false;
    }
  }

  await upload('sections/zavelyn-pdp-main.liquid', fs.readFileSync('draft_working/sections_zavelyn-pdp-main-refactored.liquid', 'utf8'));
  await upload('sections/zavelyn-pdp-description-fallback.liquid', fs.readFileSync('draft_working/sections_zavelyn-pdp-description-fallback.liquid', 'utf8'));
  await upload('templates/product.json', fs.readFileSync('draft_working/templates_product_final_blocks.json', 'utf8'));
}

main().catch(console.error);
