import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const THEME_ID = '187708571833';

async function main() {
  const token = await getAccessToken();
  const keys = [
    'sections/zavelyn-pdp-description-fallback.liquid',
    'sections/zavelyn-pdp-faq.liquid',
    'templates/product.json'
  ];

  for (const key of keys) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    console.log('KEY:', key, 'SIZE:', data.asset?.value?.length);
    if (key.includes('description-fallback')) {
      console.log('--- FALLBACK CONTENT ---');
      console.log(data.asset?.value);
      fs.writeFileSync('draft_working/sections_zavelyn-pdp-description-fallback.liquid', data.asset?.value || '');
    } else if (key.includes('faq.liquid')) {
      fs.writeFileSync('draft_working/sections_zavelyn-pdp-faq.liquid', data.asset?.value || '');
    } else if (key.includes('product.json')) {
      fs.writeFileSync('draft_working/theme_187708571833_product.json', data.asset?.value || '');
    }
  }
}

main().catch(console.error);
