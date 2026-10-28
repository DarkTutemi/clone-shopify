import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const matched = data.assets.filter(a => a.key.includes('botana') || a.key.includes('bundle') || a.key.includes('upsell') || a.key.includes('zavelyn-pdp'));
  console.log('Matched live theme assets:');
  matched.forEach(a => console.log(a.key));
}

main().catch(console.error);
