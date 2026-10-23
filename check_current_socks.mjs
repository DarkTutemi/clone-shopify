import fs from 'fs';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';

async function main() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();

  const query = `
    query {
      collection(id: "gid://shopify/Collection/493127729306") {
        title
        products(first: 20) {
          nodes {
            id
            title
            handle
          }
        }
      }
    }
  `;

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  const prods = data.data.collection.products.nodes;
  console.log('Collection has', prods.length, 'products:');
  prods.forEach(p => console.log(' -', p.title, `(${p.handle})`));
}

main();
