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
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/price_rules.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pr = await res.json();
  console.log('Price rules count:', pr.price_rules ? pr.price_rules.length : pr);
  if (pr.price_rules) {
    console.log(pr.price_rules.map(p => ({ title: p.title, value: p.value, target_type: p.target_type })));
  }

  // Also check GraphQL automatic discounts
  const gqlQuery = `
    query {
      discountNodes(first: 10) {
        edges {
          node {
            id
            discount {
              ... on DiscountAutomaticBxgy {
                title
                status
              }
              ... on DiscountAutomaticBasic {
                title
                status
              }
              ... on DiscountCodeBasic {
                title
                status
              }
            }
          }
        }
      }
    }
  `;
  const gqlRes = await fetch(`https://${SHOP}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query: gqlQuery })
  });
  const gqlData = await gqlRes.json();
  console.log('GraphQL Discounts:', JSON.stringify(gqlData, null, 2));
}

run();
