import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';

async function viewBenefitsSnippet() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  const res = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${LIVE_THEME_ID}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, { headers });
  const data = await res.json();
  const lines = data.asset.value.split('\n');

  console.log('--- LINES 470 TO 515 of sections/zavelyn-pdp-main.liquid ---');
  for (let i = 470; i < 515; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}

viewBenefitsSnippet().catch(console.error);
