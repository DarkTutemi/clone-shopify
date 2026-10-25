const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

async function main() {
  const tokenRes = await globalThis.fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const { access_token } = await tokenRes.json();
  const res = await globalThis.fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': access_token
    },
    body: JSON.stringify({
      query: `{
        products(first: 100) {
          nodes {
            id
            title
            handle
            productType
            options {
              name
              values
            }
          }
        }
      }`
    })
  });
  const data = await res.json();
  console.log('Total store products:', data.data.products.nodes.length);
  data.data.products.nodes.forEach(p => {
    console.log(`${p.handle} | ${p.title} | ${p.options.map(o => o.name + '(' + o.values.length + ')').join(', ')}`);
  });
}
main().catch(console.error);
