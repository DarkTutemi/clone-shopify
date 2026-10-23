import fs from 'fs';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';

async function main() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();

  // Query all products currently in socks-and-insoles
  const query = `
    query {
      collection(id: "gid://shopify/Collection/493127729306") {
        id
        products(first: 20) {
          nodes {
            id
            title
            handle
          }
        }
      }
    }
  `;

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  const prods = data.data.collection.products.nodes;

  console.log('Current products in socks:');
  prods.forEach((p, idx) => console.log(`${idx}: [${p.handle}] ${p.title} (${p.id})`));

  // Set collection sort_order to manual
  await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/collections/493127729306.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token },
    body: JSON.stringify({
      collection: {
        id: 493127729306,
        sort_order: 'manual'
      }
    })
  });
  const desiredOrder = [
    'bronoir-ortho-clouds-orthopedic-insoles',
    'bronoir-connect-orthopedic-fleece-conductive-insoles',
    'bronoir-air-barefoot-shoes-1-1-free',
    'bronoir-feel-barefoot-shoes',
    'bronoir-feel-barefoot-shoes-1-1-free',
    'bronoir-sports-barefoot-shoes',
    'bronoir-sports-barefoot-shoes-1-1-free',
    'bronoir-workers-casual-everyday-barefoot-shoes-1-1-free',
    'bronoir-streets-casual-everyday-barefoot-shoes-1-1-free',
    'hikers',
    'bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes-kopie',
    'bronoir-barefoot-recovery-socks-3-pack'
  ];

  const orderedMoves = [];
  desiredOrder.forEach((handle, targetIndex) => {
    const p = prods.find(item => item.handle === handle);
    if (p) {
      orderedMoves.push({
        id: p.id,
        newPosition: `${targetIndex}`
      });
    }
  });

  const reorderMutation = `
    mutation collectionReorderProducts($id: ID!, $moves: [MoveInput!]!) {
      collectionReorderProducts(id: $id, moves: $moves) {
        job {
          id
          done
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const reorderRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token },
    body: JSON.stringify({
      query: reorderMutation,
      variables: {
        id: 'gid://shopify/Collection/493127729306',
        moves: orderedMoves
      }
    })
  });
  const reorderData = await reorderRes.json();
  console.log('Reorder result:', JSON.stringify(reorderData, null, 2));
}

main();
