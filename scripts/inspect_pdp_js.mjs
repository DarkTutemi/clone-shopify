import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

async function checkPdpJs() {
  const token = await getAccessToken();
  const liveThemeId = '187597717689';

  const pdpRes = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${liveThemeId}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pdpData = await pdpRes.json();
  const lines = pdpData.asset.value.split('\n');

  console.log('--- Lines 1920 to 2030 of zavelyn-pdp-main.liquid ---');
  console.log(lines.slice(1920, 2030).join('\n'));
}

checkPdpJs().catch(console.error);
