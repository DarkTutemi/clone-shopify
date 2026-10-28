import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const DEV_THEME_ID = '187736654009';

async function main() {
  const token = await getAccessToken();

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DEV_THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const bogoAssets = data.assets.filter(a => a.key.includes('bogo') || a.key.includes('botana'));
  console.log('=== BOGO / BOTANA ASSETS ON DEV THEME ===');
  bogoAssets.forEach(a => console.log(a.key));

  // Check templates/page.botanaroots-bogo.json
  const tplRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DEV_THEME_ID}/assets.json?asset[key]=templates/page.botanaroots-bogo.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const tplData = await tplRes.json();
  if (tplData.asset) {
    console.log('\n=== CURRENT templates/page.botanaroots-bogo.json ===');
    console.log(tplData.asset.value);
  } else {
    console.log('\nNo templates/page.botanaroots-bogo.json found on dev theme.');
  }
}

main().catch(console.error);
