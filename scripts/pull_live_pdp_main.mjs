import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${LIVE_THEME_ID}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  if (data.asset?.value) {
    fs.mkdirSync('./sections', { recursive: true });
    fs.writeFileSync('./sections/zavelyn-pdp-main.liquid', data.asset.value);
    console.log(`Saved sections/zavelyn-pdp-main.liquid (${data.asset.value.length} chars)`);
  } else {
    console.error('Failed to fetch asset:', data);
  }
}
main();
