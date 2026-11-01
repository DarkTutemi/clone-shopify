import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function createV4DraftTheme() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  const liveThemeId = '187597717689';
  const targetThemeName = 'ZAVELYN — IMMERSIVE SHOWROOM V4.0 — DRAFT';

  console.log(`[SAFETY CHECK] Live Theme ID: ${liveThemeId} ('Zavelyn 2.0')`);
  console.log(`[ACTION] Duplicating Live Theme to create: "${targetThemeName}"...`);

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
        name: targetThemeName
      }
    })
  });

  const data = await res.json();
  console.log('Duplicate response:', JSON.stringify(data, null, 2));

  if (data.data?.themeDuplicate?.newTheme) {
    const rawId = data.data.themeDuplicate.newTheme.id;
    const numericId = rawId.split('/').pop();
    const role = data.data.themeDuplicate.newTheme.role;
    console.log(`\n======================================================`);
    console.log(`✅ SUCCESS! NEW UNPUBLISHED DRAFT THEME CREATED`);
    console.log(`Theme ID:   ${numericId}`);
    console.log(`Theme Name: ${targetThemeName}`);
    console.log(`Role:       ${role} (UNPUBLISHED)`);
    console.log(`Preview:    https://${SHOP}/?preview_theme_id=${numericId}`);
    console.log(`======================================================`);

    import('fs').then(fs => {
      fs.default.writeFileSync('scripts/v4_draft_theme_info.json', JSON.stringify({
        liveThemeId,
        newDraftThemeId: numericId,
        themeName: targetThemeName,
        role,
        createdAt: new Date().toISOString()
      }, null, 2));
    });
  } else {
    console.error('Failed to create theme:', data.errors || data.data?.themeDuplicate?.userErrors);
  }
}

createV4DraftTheme().catch(console.error);
