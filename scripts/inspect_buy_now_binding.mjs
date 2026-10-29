import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

async function checkBuyNowBinding() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/2026-10/themes/187597717689/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const lines = data.asset.value.split('\n');
  console.log(lines.slice(2110, 2160).join('\n'));
}

checkBuyNowBinding().catch(console.error);
