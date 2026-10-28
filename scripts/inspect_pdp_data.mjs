import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=snippets/zavelyn-pdp-data.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const val = data.asset.value;
  const whens = val.match(/when\s*['"][^'"]+['"]/g);
  console.log('Whens in snippets/zavelyn-pdp-data.liquid:', whens);
}

main().catch(console.error);
