import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';

const sectionKeys = [
  'sections/zavelyn-pdp-ticker.liquid',
  'sections/zavelyn-pdp-value-prop.liquid',
  'sections/zavelyn-pdp-features.liquid',
  'sections/zavelyn-pdp-storytelling.liquid',
  'sections/zavelyn-pdp-steps.liquid',
  'sections/zavelyn-pdp-comparison.liquid',
  'sections/zavelyn-pdp-specs.liquid',
  'sections/zavelyn-pdp-included.liquid',
  'sections/zavelyn-pdp-faq.liquid',
  'sections/zavelyn-pdp-description-fallback.liquid',
  'sections/zavelyn-pdp-shipping.liquid'
];

async function main() {
  const token = await getAccessToken();

  for (const key of sectionKeys) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=${key}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    if (data.asset) {
      const val = data.asset.value;
      const mentionsProduct = val.includes('product.');
      const mentionsMetafields = val.includes('metafields');
      const mentionsHandle = val.includes('handle');
      console.log(`\n=== ${key} === (len: ${val.length})`);
      console.log(`mentions product: ${mentionsProduct}, metafields: ${mentionsMetafields}, handle: ${mentionsHandle}`);
      // Show first 5 lines
      console.log(val.split('\n').slice(0, 5).join('\n'));
    } else {
      console.log(`Not found: ${key}`);
    }
  }
}

main().catch(console.error);
