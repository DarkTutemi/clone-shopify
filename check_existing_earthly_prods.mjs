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

async function checkExistingProducts() {
  const token = await getAccessToken();
  const query = `
    query {
      products(first: 250, query: "vendor:'Earthly Derm'") {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `;
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  console.log('Existing Earthly Derm products:', data.data?.products?.edges?.map(e => e.node));
}

checkExistingProducts().catch(console.error);
