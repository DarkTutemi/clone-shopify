import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
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

async function main() {
  const token = await getAccessToken();

  const query = `
    mutation menuUpdate($id: ID!, $title: String!, $handle: String!, $items: [MenuItemUpdateInput!]!) {
      menuUpdate(id: $id, title: $title, handle: $handle, items: $items) {
        menu {
          id
          title
          items {
            title
            url
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    id: 'gid://shopify/Menu/272777740473',
    title: 'Main menu',
    handle: 'main-menu',
    items: [
      { title: 'Home', type: 'HTTP', url: '/' },
      { title: 'Best Sellers', type: 'HTTP', url: '/collections/best-sellers' },
      { title: 'Fence & Farm', type: 'HTTP', url: '/collections/fence-and-farm' },
      { title: 'Power Tools', type: 'HTTP', url: '/collections/power-tools' },
      { title: 'Garden & Outdoor', type: 'HTTP', url: '/collections/garden-and-outdoor' },
      { title: 'Track Order', type: 'HTTP', url: '/pages/track-order' }
    ]
  };

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });

  const data = await res.json();
  console.log('Menu update response:', JSON.stringify(data, null, 2));
}

main().catch(console.error);
