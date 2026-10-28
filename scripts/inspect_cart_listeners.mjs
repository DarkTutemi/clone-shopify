import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();

  const cRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=assets/zavelyn-cart.js`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const cData = await cRes.json();
  const val = cData.asset.value;
  const lines = val.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('cart:open') || l.includes('cart:refresh') || l.includes('addEventListener')) {
      console.log(`Line ${idx+1}: ${l}`);
    }
  });
}

main().catch(console.error);
