import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';

async function inspectProductJson() {
  const token = await getAccessToken();

  const res = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${LIVE_THEME_ID}/assets.json?asset[key]=templates/product.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('=== templates/product.json on Live Theme ===');
  console.log(data.asset?.value);
}

inspectProductJson().catch(console.error);
