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

  // 1. Fetch current sections/header-group.json
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=sections/header-group.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const headerGroup = JSON.parse(data.asset.value);

  // Backup locally
  fs.writeFileSync('Clone-willafarm/backup_header-group.json', data.asset.value, 'utf8');
  console.log('Backed up header-group.json');

  const willaHeader = headerGroup.sections['willa-header'];
  if (!willaHeader) {
    throw new Error('willa-header section not found in header-group.json');
  }

  // Add nav_handpans block
  willaHeader.blocks['nav_handpans'] = {
    type: 'nav_link',
    settings: {
      title: 'Handpans',
      link: '/collections/zavelyn-handpans',
      icon: '🎵',
      badge: 'NEW',
      show_desktop: true,
      show_mobile: true
    }
  };

  // Insert into block_order right after nav_best
  const currentOrder = willaHeader.block_order.filter(id => id !== 'nav_handpans');
  const bestIdx = currentOrder.indexOf('nav_best');
  if (bestIdx !== -1) {
    currentOrder.splice(bestIdx + 1, 0, 'nav_handpans');
  } else {
    currentOrder.push('nav_handpans');
  }
  willaHeader.block_order = currentOrder;

  console.log('Updated block order:', willaHeader.block_order);

  // Upload back to Shopify theme
  const putRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/header-group.json',
        value: JSON.stringify(headerGroup, null, 2)
      }
    })
  });
  const putData = await putRes.json();
  console.log('Uploaded sections/header-group.json:', putData.asset ? 'SUCCESS' : putData);

  // 2. Also update Shopify Menu (main-menu) via GraphQL
  const menuQuery = `
    mutation updateMenu($id: ID!, $title: String!, $items: [MenuItemUpdateInput!]!) {
      menuUpdate(id: $id, title: $title, items: $items) {
        menu {
          id
          title
          items {
            id
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

  const newItems = [
    { title: 'Home', type: 'HTTP', url: '/' },
    { title: 'Best Sellers', type: 'HTTP', url: '/collections/best-sellers' },
    { title: 'Handpans', type: 'HTTP', url: '/collections/zavelyn-handpans' },
    { title: 'Fence & Farm', type: 'HTTP', url: '/collections/fence-and-farm' },
    { title: 'Power Tools', type: 'HTTP', url: '/collections/power-tools' },
    { title: 'Garden & Outdoor', type: 'HTTP', url: '/collections/garden-and-outdoor' },
    { title: 'Track Order', type: 'HTTP', url: '/pages/track-order' }
  ];

  const gqlRes = await fetch(`https://${SHOP}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      query: menuQuery,
      variables: {
        id: 'gid://shopify/Menu/272777740473',
        title: 'Main menu',
        items: newItems
      }
    })
  });
  const gqlData = await gqlRes.json();
  console.log('Shopify main-menu update result:', JSON.stringify(gqlData, null, 2));
}

run().catch(console.error);
