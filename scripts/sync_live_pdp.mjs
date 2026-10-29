import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';

async function fetchLivePdp() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${LIVE_THEME_ID}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  if (!data.asset?.value) {
    console.error('Failed:', data);
    process.exit(1);
  }
  fs.writeFileSync('sections/zavelyn-pdp-main.liquid', data.asset.value, 'utf8');
  console.log('Saved live zavelyn-pdp-main.liquid to local file. Total bytes:', data.asset.value.length);
}

fetchLivePdp();
