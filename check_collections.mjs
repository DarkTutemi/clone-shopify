const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";

async function main() {
  const tokenRes = await fetch('https://' + SHOP_DOMAIN + '/admin/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();
  const res = await fetch('https://' + SHOP_DOMAIN + '/admin/api/2024-10/graphql.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token },
    body: JSON.stringify({
      query: `query {
        collections(first: 10) {
          nodes {
            id
            title
            handle
            productsCount { count }
            ruleSet {
              rules {
                column
                relation
                condition
              }
            }
          }
        }
      }`
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data.data.collections.nodes, null, 2));
}
main();
