import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const SUMMER_COLLECTION_ID = 'gid://shopify/Collection/493127663770';

async function fetchWithRetry(url, options, maxRetries = 5, delay = 1000) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      console.warn(`[Retry ${i}/${maxRetries}] ${err.message}. Retrying in ${delay}ms...`);
      if (i === maxRetries) throw err;
      await new Promise(r => setTimeout(r, delay));
      delay *= 1.5;
    }
  }
}

async function main() {
  console.log('1. Authenticating...');
  const tokenRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();

  // 2. Fetch all products in store
  console.log('2. Fetching store products...');
  const prodRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token },
    body: JSON.stringify({
      query: `
        query {
          products(first: 100) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
        }
      `
    })
  });
  const prodData = await prodRes.json();
  const allProducts = prodData.data.products.edges.map(e => e.node);
  console.log(`Found ${allProducts.length} total products in store.`);

  // 3. Filter products matching summer barefoot shoes
  // Products that belong to summer collection based on trybronoir:
  const summerKeywords = [
    'air', 'feel', 'sport pro', 'sports', 'hike', 'drifters', 'limited',
    'military', 'fly', 'force', 'youngsters', 'funk', 'flex', 'skin pro',
    'streets', 'sandals', 'ayelith', 'sky'
  ];

  const matchedProductIds = allProducts.filter(p => {
    const t = p.title.toLowerCase();
    const h = p.handle.toLowerCase();
    return summerKeywords.some(kw => t.includes(kw) || h.includes(kw));
  }).map(p => p.id);

  console.log(`Matched ${matchedProductIds.length} products for Barefoot Shoes for Summer.`);

  // If not enough matched, add all barefoot products
  const finalProductIds = matchedProductIds.length >= 8 ? matchedProductIds : allProducts.map(p => p.id).slice(0, 25);

  console.log(`Adding ${finalProductIds.length} products to collection ${SUMMER_COLLECTION_ID}...`);

  const addRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token },
    body: JSON.stringify({
      query: `
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
      `,
      variables: {
        id: SUMMER_COLLECTION_ID,
        productIds: finalProductIds
      }
    })
  });

  const addData = await addRes.json();
  console.log('Result:', JSON.stringify(addData, null, 2));
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
