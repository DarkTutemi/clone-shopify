import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();

  const cRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=assets/zavelyn-cart.js`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const cData = await cRes.json();
  console.log('=== assets/zavelyn-cart.js ===');
  console.log(cData.asset.value.slice(0, 2500));

  const wRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=sections/willa-cart-drawer.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const wData = await wRes.json();
  console.log('\n=== sections/willa-cart-drawer.liquid (script parts) ===');
  const scripts = wData.asset.value.match(/<script[\s\S]*?<\/script>/gi);
  console.log(scripts ? scripts.join('\n---\n') : 'No script tag');
}

main().catch(console.error);
