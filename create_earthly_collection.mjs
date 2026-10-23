import fs from 'fs';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

const createdProds = JSON.parse(fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/created_products.json', 'utf8'));

async function createAndLinkCollection() {
  const token = await getAccessToken();
  console.log('Got token. Creating collection: Earthly Derm (earthly-derm)...');

  // Check if collection already exists
  const listRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/custom_collections.json?handle=earthly-derm`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const listData = await listRes.json();
  let collectionId;

  if (listData.custom_collections && listData.custom_collections.length > 0) {
    collectionId = listData.custom_collections[0].id;
    console.log(`Collection already exists: ${collectionId}`);
  } else {
    const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/custom_collections.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        custom_collection: {
          title: 'Earthly Derm',
          handle: 'earthly-derm',
          body_html: '<p>Handcrafted Organic Skincare Bars made with raw, authentic ingredients.</p>',
          sort_order: 'manual'
        }
      })
    });
    const createData = await createRes.json();
    collectionId = createData.custom_collection?.id;
    console.log(`Created new custom collection: ${collectionId}`);
  }

  // Link products via GraphQL
  const collectionGid = `gid://shopify/Collection/${collectionId}`;
  const productGids = Object.values(createdProds).map(p => p.graphqlId);
  console.log(`Linking ${productGids.length} products to ${collectionGid}...`);

  const mutation = `
    mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
      collectionAddProducts(id: $id, productIds: $productIds) {
        collection {
          id
          title
          productsCount {
            count
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const gqlRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        id: collectionGid,
        productIds: productGids
      }
    })
  });

  const gqlData = await gqlRes.json();
  console.log('GraphQL collectionAddProducts result:', JSON.stringify(gqlData, null, 2));

  fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/collection_linked.json', JSON.stringify({
    collectionId,
    collectionGid,
    productGids,
    result: gqlData
  }, null, 2));
}

createAndLinkCollection().catch(console.error);
