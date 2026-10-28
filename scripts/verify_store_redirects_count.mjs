import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function checkRedirects() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query: '{ urlRedirects(first: 50) { nodes { id path target } } }' })
  });
  const data = await res.json();
  const redirects = data.data?.urlRedirects?.nodes || [];
  console.log('Total store redirects:', redirects.length);
  redirects.forEach(r => console.log(` - ID: ${r.id} | Path: ${r.path} -> Target: ${r.target}`));
}

checkRedirects().catch(console.error);
