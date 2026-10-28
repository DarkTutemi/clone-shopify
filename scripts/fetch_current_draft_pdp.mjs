import { getAccessToken, SHOP } from './batch1_config.mjs';
import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

async function main() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/187720335545/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  fs.mkdirSync('draft_working', { recursive: true });
  fs.writeFileSync('draft_working/current_draft_pdp_main.liquid', data.asset.value);
  console.log('Saved current draft sections/zavelyn-pdp-main.liquid, length:', data.asset.value.length);
}

main().catch(console.error);
