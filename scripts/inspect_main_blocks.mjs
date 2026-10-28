import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();

  const tplRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=templates/product.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const tplData = await tplRes.json();
  const parsed = JSON.parse(tplData.asset.value);
  console.log('main section settings:', JSON.stringify(parsed.sections.main.settings, null, 2));
  console.log('main section blocks count:', Object.keys(parsed.sections.main.blocks).length);
  console.log('main section block order:', parsed.sections.main.block_order);
  console.log('main section blocks sample:');
  for (const [key, val] of Object.entries(parsed.sections.main.blocks)) {
    console.log(`- ${key}:`, val);
  }
}

main().catch(console.error);
