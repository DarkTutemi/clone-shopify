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

  const prodId = 'gid://shopify/Product/15459230482586';

  const query = `
    mutation bulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants) {
        userErrors {
          field
          message
        }
        productVariants {
          id
          title
          price
        }
      }
    }
  `;

  const variants = [
    {
      optionValues: [
        { optionName: "Color", name: "Black & White" },
        { optionName: "Size", name: "EU 39" }
      ],
      price: "2097000",
      compareAtPrice: "3146000"
    },
    {
      optionValues: [
        { optionName: "Color", name: "Pink" },
        { optionName: "Size", name: "EU 38" }
      ],
      price: "2097000",
      compareAtPrice: "3146000"
    }
  ];

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
        variants
      }
    })
  });

  const data = await res.json();
  console.log('Result:', JSON.stringify(data, null, 2));
}

main().catch(console.error);
