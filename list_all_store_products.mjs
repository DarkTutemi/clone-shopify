// list_all_store_products.mjs
import fs from 'fs';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';

async function main() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const { access_token } = await tokenRes.json();

  let hasNext = true;
  let cursor = null;
  const allProducts = [];

  while (hasNext) {
    const after = cursor ? `, after: "${cursor}"` : '';
    const query = `
      query {
        products(first: 50${after}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            handle
            featuredImage {
              url
            }
          }
        }
      }
    `;

    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': access_token
      },
      body: JSON.stringify({ query })
    });
    const json = await res.json();
    const data = json.data.products;
    allProducts.push(...data.nodes);
    hasNext = data.pageInfo.hasNextPage;
    cursor = data.pageInfo.endCursor;
  }

  console.log(`Fetched ${allProducts.length} store products.`);
  fs.writeFileSync('all_store_products.json', JSON.stringify(allProducts, null, 2));
}

main();
