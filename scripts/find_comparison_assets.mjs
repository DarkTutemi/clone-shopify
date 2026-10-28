import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function listComparisonSections() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/187597717689/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const comparisonAssets = (data.assets || []).filter(a => a.key.includes('comp') || a.key.includes('table'));
  console.log('Matching assets:', comparisonAssets.map(a => a.key));
}
listComparisonSections();
