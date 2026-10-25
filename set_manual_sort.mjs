import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function main() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();

  const mutation = `
    mutation updateCol($input: CollectionInput!) {
      collectionUpdate(input: $input) {
        collection {
          id
          sortOrder
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          id: 'gid://shopify/Collection/493127729306',
          sortOrder: 'MANUAL'
        }
      }
    })
  });
  const data = await res.json();
  console.log('Update sortOrder result:', JSON.stringify(data, null, 2));

  // Now run reorder
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

  // Fetch products
  const q2 = `
    query {
      collection(id: "gid://shopify/Collection/493127729306") {
        products(first: 20) {
          nodes {
            id
            handle
          }
        }
      }
    }
  `;
  const r2 = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token },
    body: JSON.stringify({ query: q2 })
  });
  const d2 = await r2.json();
  const prods = d2.data.collection.products.nodes;

  const moves = [];
  desiredOrder.forEach((handle, idx) => {
    const p = prods.find(item => item.handle === handle);
    if (p) {
      moves.push({
        id: p.id,
        newPosition: `${idx}`
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
        moves
      }
    })
  });
  const reorderData = await reorderRes.json();
  console.log('Reorder result:', JSON.stringify(reorderData, null, 2));
}

main();
