import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

async function checkDrawerThreshold() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/2026-10/themes/187597717689/assets.json?asset[key]=sections/willa-cart-drawer.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const lines = data.asset.value.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('threshold') || l.includes('49') || l.includes('60') || l.includes('FREE')) {
      if (l.includes('threshold') || l.includes('shipping') || l.includes('Shipping')) {
        console.log(`Line ${idx+1}: ${l.trim()}`);
      }
    }
  });
}

checkDrawerThreshold().catch(console.error);
