import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187708571833';

async function main() {
  const token = await getAccessToken();
  const keys = [
    'templates/product.json',
    'sections/zavelyn-pdp-main.liquid',
    'sections/zavelyn-pdp-faq.liquid',
    'snippets/botanaroots-bundle-upsell.liquid',
    'assets/botanaroots-bundle.css'
  ];
  if (!fs.existsSync('draft_working')) fs.mkdirSync('draft_working', { recursive: true });

  for (const k of keys) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(k)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    if (data.asset?.value) {
      const filename = k.replace(/\//g, '_');
      fs.writeFileSync(`draft_working/${filename}`, data.asset.value);
      console.log(`Saved draft asset ${k} (${data.asset.value.length} chars)`);
    } else {
      console.log(`Could not fetch ${k}:`, data);
    }
  }
}

main().catch(console.error);
