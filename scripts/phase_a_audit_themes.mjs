import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';

async function auditThemes() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: `
        query {
          themes(first: 20) {
            nodes {
              id
              name
              role
              createdAt
              updatedAt
            }
          }
        }
      `
    })
  });
  const data = await res.json();
  console.log('THEMES AUDIT (GraphQL 2026-10):', JSON.stringify(data.data?.themes?.nodes, null, 2));
}

auditThemes().catch(console.error);
