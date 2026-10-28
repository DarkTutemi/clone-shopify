import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';
const DEV_THEME_ID = '187736654009';

async function main() {
  const token = await getAccessToken();

  // 1. Fetch live templates/product.json
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=templates/product.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const prodTpl = JSON.parse(data.asset.value);

  // 2. Build page.botanaroots-bogo.json
  const pageTpl = {
    sections: {
      main: {
        type: 'botanaroots-bogo-pdp',
        blocks: prodTpl.sections.main.blocks,
        block_order: prodTpl.sections.main.block_order,
        settings: prodTpl.sections.main.settings
      },
      ticker: {
        type: 'zavelyn-pdp-ticker',
        settings: {}
      },
      description: {
        type: 'botanaroots-bogo-description',
        blocks: prodTpl.sections.description_fallback.blocks,
        block_order: prodTpl.sections.description_fallback.block_order,
        settings: prodTpl.sections.description_fallback.settings || {}
      },
      shipping: {
        type: 'zavelyn-pdp-shipping',
        settings: prodTpl.sections.shipping.settings
      }
    },
    order: [
      'main',
      'ticker',
      'description',
      'shipping'
    ]
  };

  const jsonStr = JSON.stringify(pageTpl, null, 2);

  // 3. Upload to Dev Theme
  console.log(`Uploading templates/page.botanaroots-bogo.json to theme ${DEV_THEME_ID}...`);
  const upRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DEV_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key: 'templates/page.botanaroots-bogo.json',
        value: jsonStr
      }
    })
  });

  const upData = await upRes.json();
  if (upData.asset) {
    console.log('✓ Successfully uploaded templates/page.botanaroots-bogo.json to Dev Theme!');
  } else {
    console.error('Error uploading template:', JSON.stringify(upData));
  }
}

main().catch(console.error);
