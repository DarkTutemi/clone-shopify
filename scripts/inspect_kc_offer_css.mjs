import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

async function checkKcOfferCss() {
  const token = await getAccessToken();
  const liveThemeId = '187597717689';

  const pdpRes = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${liveThemeId}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pdpData = await pdpRes.json();
  const lines = pdpData.asset.value.split('\n');

  lines.forEach((l, idx) => {
    if (l.includes('.kc-offer') || l.includes('kc-offers') || l.includes('kc-offer__badge')) {
      console.log(`Line ${idx+1}: ${l}`);
    }
  });
}

checkKcOfferCss().catch(console.error);
