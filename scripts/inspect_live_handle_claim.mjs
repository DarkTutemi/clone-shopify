import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=assets/botanaroots-bogo.js`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const val = data.asset.value;
  const match = val.match(/async function handleClaimOffer[\s\S]*?async function handleBuyNow/);
  console.log('handleClaimOffer code:');
  console.log(match ? match[0] : 'not found');
}

main().catch(console.error);
