const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

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
