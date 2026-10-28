import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const themeId = process.argv[2] || '187597717689';
const assetKey = process.argv[3] || 'snippets/zavelyn-pdp-data.liquid';

async function main() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(assetKey)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  if (data.asset?.value) {
    console.log(`Fetched ${assetKey} (${data.asset.value.length} chars)`);
    console.log(data.asset.value.slice(0, 1000));
  } else {
    console.log('Asset not found or empty:', data);
  }
}

main().catch(console.error);
