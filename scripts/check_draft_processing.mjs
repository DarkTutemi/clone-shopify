import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function check() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/187702804665.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log(`Theme 187702804665 status: processing=${data.theme.processing}, previewable=${data.theme.previewable}`);
}

check().catch(console.error);
