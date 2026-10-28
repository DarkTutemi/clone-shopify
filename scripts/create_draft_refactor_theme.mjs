import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  const newThemeName = '[Draft] Zavelyn - BotanaRoots Mobile & Modular Refactor';
  console.log(`Duplicating Current Live Theme ${LIVE_THEME_ID} to "${newThemeName}"...`);

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
        id: `gid://shopify/OnlineStoreTheme/${LIVE_THEME_ID}`,
        name: newThemeName
      }
    })
  });

  const data = await res.json();
  console.log('Duplicate response:', JSON.stringify(data, null, 2));

  if (data.data?.themeDuplicate?.newTheme) {
    const rawId = data.data.themeDuplicate.newTheme.id;
    const numericId = rawId.split('/').pop();
    console.log(`\n========================================================================`);
    console.log(`SUCCESS! Created isolated draft clone theme ID: ${numericId}`);
    console.log(`========================================================================\n`);
    return numericId;
  } else {
    throw new Error('Theme duplication failed: ' + JSON.stringify(data));
  }
}

main().catch(console.error);
