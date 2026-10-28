import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function test() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/187597717689/assets.json?asset[key]=templates/product.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('Value length:', data.asset?.value?.length);
  console.log(data.asset?.value);
}
test();
