import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const PRODUCT_ID = '15461545935033';

async function main() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/${PRODUCT_ID}.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('Product title:', data.product.title);
  console.log('Template suffix:', data.product.template_suffix);
}

main().catch(console.error);
