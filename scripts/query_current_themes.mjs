import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('Themes on Shopify:');
  for (const t of data.themes) {
    console.log(`- ID: ${t.id} | Name: "${t.name}" | Role: ${t.role} | Updated: ${t.updated_at}`);
  }
}

main().catch(console.error);
