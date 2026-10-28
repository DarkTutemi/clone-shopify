import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  const liveThemeId = '187597717689';
  console.log(`Duplicating Live Theme ${liveThemeId} to create isolated draft preview theme...`);

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: `
        mutation duplicate($id: ID!, $name: String!) {
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
        id: `gid://shopify/OnlineStoreTheme/${liveThemeId}`,
        name: '[Draft Preview] Zavelyn - BotanaRoots Bundle'
      }
    })
  });

  const data = await res.json();
  console.log('Duplicate response:', JSON.stringify(data, null, 2));

  if (data.data?.themeDuplicate?.newTheme) {
    const rawId = data.data.themeDuplicate.newTheme.id;
    const numericId = rawId.split('/').pop();
    console.log(`\nSUCCESS! Created isolated draft preview theme ID: ${numericId}`);
  }
}

main().catch(console.error);
