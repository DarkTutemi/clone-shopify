import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();

  const themesRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await themesRes.json();
  console.log('Themes:');
  data.themes.forEach(t => {
    console.log(`- ID: ${t.id} | Name: "${t.name}" | Role: ${t.role}`);
  });
}

main().catch(console.error);
