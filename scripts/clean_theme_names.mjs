import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function renameThemes() {
  const token = await getAccessToken();
  const headers = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' };

  // Rename new main to "Zavelyn 2.0"
  await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/187597717689.json`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ theme: { name: 'Zavelyn 2.0' } })
  });

  // Rename old main to "Zavelyn (Pre-Publish Backup)"
  await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/186607567033.json`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ theme: { name: 'Zavelyn (Pre-Publish Backup)' } })
  });

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes.json`, { headers });
  const data = await res.json();
  console.log('Updated Themes in Shopify Admin:');
  for (const t of data.themes) {
    console.log(`- ID: ${t.id} | Name: "${t.name}" | Role: "${t.role}"`);
  }
}

renameThemes();
