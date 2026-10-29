import { getAccessToken, SHOP } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();
  const query = `{
    productVariants(first: 10, query: "sku:ZAV-DENTURE*") {
      edges {
        node {
          id
          sku
          title
          product {
            title
            handle
          }
        }
      }
    }
  }`;

  const res = await fetch(`https://${SHOP}/admin/api/2026-10/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  const data = await res.json();
  console.log('Matching variants:', JSON.stringify(data.data?.productVariants?.edges || [], null, 2));
}

main().catch(console.error);
