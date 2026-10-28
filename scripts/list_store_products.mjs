import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products.json?limit=15`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('Total products:', data.products.length);
  for (const p of data.products) {
    console.log(`ID: ${p.id} | Handle: ${p.handle} | Template: ${p.template_suffix}`);
  }
}

main().catch(console.error);
