import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();

  for (const name of ['sections/zavelyn-pdp-storytelling.liquid', 'sections/zavelyn-pdp-description-fallback.liquid', 'sections/zavelyn-pdp-faq.liquid']) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=${name}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    console.log(`\n=================== ${name} ===================`);
    console.log(data.asset.value.slice(0, 1500));
  }
}

main().catch(console.error);
