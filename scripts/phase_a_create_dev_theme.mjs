import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';

async function createDevTheme() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  const themeName = '[Dev Test] Zavelyn - BotanaRoots BOGO Page';

  console.log(`Checking if "${themeName}" already exists...`);
  const checkRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
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
            }
          }
        }
      `
    })
  });
  const checkData = await checkRes.json();
  const existing = checkData.data?.themes?.nodes?.find(t => t.name === themeName);
  if (existing) {
    const rawId = existing.id.split('/').pop();
    console.log(`Theme already exists! ID: ${existing.id} (Raw: ${rawId})`);
    return rawId;
  }

  console.log('Duplicating Live Theme gid://shopify/OnlineStoreTheme/187597717689...');
  const dupRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: `
        mutation duplicateTheme($id: ID!, $name: String!) {
          themeDuplicate(id: $id, name: $name) {
            newTheme {
              id
              name
              role
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        id: 'gid://shopify/OnlineStoreTheme/187597717689',
        name: themeName
      }
    })
  });
  const dupData = await dupRes.json();
  console.log('Duplicate Result:', JSON.stringify(dupData, null, 2));

  const newTheme = dupData.data?.themeDuplicate?.newTheme;
  if (!newTheme) {
    throw new Error('Failed to duplicate theme: ' + JSON.stringify(dupData.data?.themeDuplicate?.userErrors));
  }

  const rawId = newTheme.id.split('/').pop();
  console.log(`✔ Dev Theme Created Successfully! Raw ID: ${rawId}`);
  return rawId;
}

createDevTheme().catch(console.error);
