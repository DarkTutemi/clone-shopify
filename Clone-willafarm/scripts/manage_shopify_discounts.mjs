import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  return data.access_token;
}

async function shopifyGraphQL(token, query, variables = {}) {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });
  return await res.json();
}

async function run() {
  const token = await getAccessToken();
  console.log('Testing GraphQL connection...');
  const testRes = await shopifyGraphQL(token, '{ shop { name email myshopifyDomain } }');
  console.log('Shop:', testRes.data?.shop);

  // List existing discounts
  const listQuery = `{
    discountNodes(first: 20) {
      edges {
        node {
          id
          discount {
            __typename
            ... on DiscountCodeBasic {
              title
              status
              codes(first: 5) { edges { node { code } } }
            }
            ... on DiscountAutomaticBasic {
              title
              status
            }
          }
        }
      }
    }
  }`;
  const listRes = await shopifyGraphQL(token, listQuery);
  console.log('Existing discounts:', JSON.stringify(listRes.data?.discountNodes?.edges, null, 2));
}

run().catch(console.error);
