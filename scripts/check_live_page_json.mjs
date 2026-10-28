import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=templates/page.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Value:', data.asset?.value);
}

main().catch(console.error);
