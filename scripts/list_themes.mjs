import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function listThemes() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('Themes on store:', data.themes?.map(t => ({
    id: t.id,
    name: t.name,
    role: t.role,
    updated_at: t.updated_at
  })));
}

listThemes().catch(console.error);
