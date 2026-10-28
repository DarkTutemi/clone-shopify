import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=snippets/botanaroots-bundle-upsell.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('=== live snippets/botanaroots-bundle-upsell.liquid (first 100 lines) ===');
  console.log(data.asset.value.split('\n').slice(0, 100).join('\n'));
}

main().catch(console.error);
