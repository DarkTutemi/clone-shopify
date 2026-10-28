import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';

async function checkPdpData() {
  const token = await getAccessToken();
  const headers = { 'X-Shopify-Access-Token': token };

  const res = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${LIVE_THEME_ID}/assets.json?asset[key]=snippets/zavelyn-pdp-data.liquid`, { headers });
  const data = await res.json();
  const content = data.asset?.value || '';

  console.log(`snippets/zavelyn-pdp-data.liquid length: ${content.length}`);
  if (content.includes('botanaroots')) {
    console.log('Includes botanaroots in pdp data!');
  } else {
    console.log('Does NOT mention botanaroots in pdp data.');
  }

  // Look at how products are mapped in zavelyn-pdp-data.liquid
  const lines = content.split('\n');
  console.log('First 40 lines:');
  console.log(lines.slice(0, 40).join('\n'));
}

checkPdpData().catch(console.error);
