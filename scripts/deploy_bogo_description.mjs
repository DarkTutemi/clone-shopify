import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const DEV_THEME_ID = '187736654009';
const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();

  // Fetch live zavelyn-pdp-description-fallback.liquid
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=sections/zavelyn-pdp-description-fallback.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  let content = data.asset.value;

  // Prepend product assignment so product object is present
  content = `{%- assign product = all_products['zavelyn-botanaroots-organic-batana-hair-growth-oil'] -%}\n` + content;
  content = content.replace('"name": "Product Details & Body"', '"name": "BOGO Details"');

  console.log(`Uploading sections/botanaroots-bogo-description.liquid to theme ${DEV_THEME_ID}...`);
  const upRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DEV_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/botanaroots-bogo-description.liquid',
        value: content
      }
    })
  });

  const upData = await upRes.json();
  if (upData.asset) {
    console.log('✓ Successfully uploaded sections/botanaroots-bogo-description.liquid to Dev Theme!');
  } else {
    console.error('Error uploading description section:', JSON.stringify(upData));
  }
}

main().catch(console.error);
