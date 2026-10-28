import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function inspectHeaderGroup() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/187597717689/assets.json?asset[key]=sections/header-group.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('header-group.json value:\n', data.asset?.value);
}

inspectHeaderGroup().catch(console.error);
