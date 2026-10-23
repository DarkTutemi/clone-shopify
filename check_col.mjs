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

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token },
    body: JSON.stringify({
      query: `
        query {
          collection(id: "gid://shopify/Collection/493127663770") {
            id
            title
            products(first: 50) {
              edges {
                node {
                  id
                  title
                  handle
                  featuredImage {
                    url
                  }
                  variants(first: 1) {
                    edges {
                      node {
                        price
                        compareAtPrice
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
    })
  });
  const data = await res.json();
  const list = data.data.collection.products.edges.map(e => ({
    title: e.node.title,
    handle: e.node.handle,
    image: e.node.featuredImage?.url,
    price: e.node.variants.edges[0]?.node?.price,
    compareAtPrice: e.node.variants.edges[0]?.node?.compareAtPrice
  }));
  console.log(`[${data.data.collection.title}] Total products in collection: ${list.length}`);
  console.log(JSON.stringify(list, null, 2));
}

main();
