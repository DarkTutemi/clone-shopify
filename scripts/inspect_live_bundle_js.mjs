import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=assets/botanaroots-bundle.js`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('=== live assets/botanaroots-bundle.js (last 100 lines) ===');
  const lines = data.asset.value.split('\n');
  console.log(lines.slice(Math.max(0, lines.length - 100)).join('\n'));
}

main().catch(console.error);
