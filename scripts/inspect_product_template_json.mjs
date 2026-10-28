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
  console.log('=== TEMPLATES/PRODUCT.JSON CONTENT ===');
  console.log(tplData.asset.value);
}

main().catch(console.error);
