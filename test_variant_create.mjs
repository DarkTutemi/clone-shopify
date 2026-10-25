const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

async function main() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const { access_token } = await tokenRes.json();

  // Test creating options on one product using productOptionsCreate or productUpdate
  const query = `
    mutation createOptions($productId: ID!, $options: [OptionCreateInput!]!) {
      productOptionsCreate(productId: $productId, options: $options) {
        userErrors {
          field
          message
        }
        product {
          id
          options {
            id
            name
            values
          }
        }
      }
    }
  `;

  // Pick first product
  const getProduct = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': access_token
    },
    body: JSON.stringify({
      query: `query { products(first: 1) { nodes { id title } } }`
    })
  }).then(r => r.json());

  const prodId = getProduct.data.products.nodes[0].id;
  console.log('Testing on product:', prodId);

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': access_token
    },
    body: JSON.stringify({
      query,
      variables: {
        productId: prodId,
        options: [
          { name: "Color", values: [{ name: "All Black" }, { name: "Black & White" }, { name: "Pink" }] },
          { name: "Size", values: [{ name: "EU 38" }, { name: "EU 39" }, { name: "EU 40" }] }
        ]
      }
    })
  });

  const data = await res.json();
  console.log('Response:', JSON.stringify(data, null, 2));
}

main().catch(console.error);
