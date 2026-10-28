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

async function run() {
  const token = await getAccessToken();
  console.log('Fetching all 83 products with description and descriptionHtml...');

  let allProducts = [];
  let cursor = null;
  let hasNext = true;

  while (hasNext) {
    const query = `
      query getProducts($cursor: String) {
        products(first: 100, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            handle
            status
            vendor
            productType
            description
            descriptionHtml
            tags
            variants(first: 20) {
              nodes {
                id
                title
                sku
                barcode
                price
              }
            }
          }
        }
      }
    `;

    const res = await fetch(`https://${SHOP}/admin/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({ query, variables: { cursor } })
    });

    const json = await res.json();
    const data = json.data?.products;
    if (data?.nodes) {
      allProducts = allProducts.concat(data.nodes);
    }
    hasNext = data?.pageInfo?.hasNextPage || false;
    cursor = data?.pageInfo?.endCursor || null;
  }

  console.log(`Fetched ${allProducts.length} products total.`);
  fs.writeFileSync('scripts/full_catalog_with_html_descriptions.json', JSON.stringify(allProducts, null, 2), 'utf8');
}

run().catch(console.error);
