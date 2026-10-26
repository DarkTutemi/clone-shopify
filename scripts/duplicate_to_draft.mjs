import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function tryOnlineStoreTheme() {
  const token = await getAccessToken();

  const dupRes = await fetch(`https://${SHOP}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
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
        id: 'gid://shopify/OnlineStoreTheme/186607567033',
        name: '[Draft] Zavelyn 2.0 (Elixir Redesign)'
      }
    })
  });

  const dupData = await dupRes.json();
  console.log('Result with OnlineStoreTheme:', JSON.stringify(dupData, null, 2));

  // Check themes list again
  const listRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const listData = await listRes.json();
  console.log('\nUpdated Themes List:');
  listData.themes.forEach(t => console.log(`${t.id} | ${t.role} | ${t.name}`));

  const newDraft = listData.themes.find(t => t.name.includes('Zavelyn 2.0'));
  if (newDraft) {
    console.log(`\n✔ TARGET DRAFT THEME CREATED:`);
    console.log(`  ID: ${newDraft.id}`);
    console.log(`  Name: ${newDraft.name}`);
    console.log(`  Preview URL: https://${SHOP}/?preview_theme_id=${newDraft.id}`);
    fs.writeFileSync('scripts/draft_theme_id.txt', String(newDraft.id), 'utf-8');
  }
}

tryOnlineStoreTheme();
