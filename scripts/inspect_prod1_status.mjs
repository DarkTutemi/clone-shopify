import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function checkAdmin() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: `
        query {
          product(id: "gid://shopify/Product/15454947901625") {
            id
            title
            handle
            status
            publishedAt
            seo {
              title
              description
            }
            variants(first: 5) {
              nodes {
                id
                title
                price
                availableForSale
              }
            }
          }
        }
      `
    })
  });
  const data = await res.json();
  console.log('Product in Admin API:', JSON.stringify(data, null, 2));
}

checkAdmin().catch(console.error);
