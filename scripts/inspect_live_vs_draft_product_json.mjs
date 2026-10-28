import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();
  const liveThemeId = '187597717689';
  const draftThemeId = '187708571833';

  // Fetch Live product.json
  const liveRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${liveThemeId}/assets.json?asset[key]=templates/product.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const liveData = await liveRes.json();
  const liveJson = JSON.parse(liveData.asset.value);

  // Fetch Draft product.json
  const draftRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${draftThemeId}/assets.json?asset[key]=templates/product.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const draftData = await draftRes.json();
  const draftJson = JSON.parse(draftData.asset.value);

  console.log('Live product.json order:', liveJson.order);
  console.log('Draft product.json order:', draftJson.order);
  console.log('Live sections keys:', Object.keys(liveJson.sections));
  console.log('Draft sections keys:', Object.keys(draftJson.sections));

  // Save Live backup before anything
  fs.writeFileSync('draft_working/live_backup_product.json', liveData.asset.value);
  console.log('✓ Saved draft_working/live_backup_product.json');
}

main().catch(console.error);
