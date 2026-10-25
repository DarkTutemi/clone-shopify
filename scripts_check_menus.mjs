import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function run() {
  const token = await getAccessToken();
  console.log('Got access token');

  // Check GraphQL menus
  const gqlQuery = `
    query {
      menus(first: 10) {
        edges {
          node {
            id
            handle
            title
            items {
              id
              title
              url
              items {
                id
                title
                url
              }
            }
          }
        }
      }
    }
  `;

  const gqlRes = await fetch(`https://${SHOP}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query: gqlQuery })
  });
  const gqlData = await gqlRes.json();
  console.log('Shopify Menus:', JSON.stringify(gqlData, null, 2));

  // Also check header theme sections / settings
  const themeRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=config/settings_data.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const themeData = await themeRes.json();
  if (themeData.asset && themeData.asset.value) {
    const settings = JSON.parse(themeData.asset.value);
    console.log('Header section settings in settings_data.json:');
    for (const [k, v] of Object.entries(settings.current.sections || {})) {
      if (k.includes('header')) {
        console.log(k, v);
      }
    }
  }
}

run().catch(console.error);
