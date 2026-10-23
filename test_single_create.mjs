import fs from 'fs';

const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";

async function testSingle() {
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

  const createQuery = `
    mutation CreateProduct($input: ProductInput!, $media: [CreateMediaInput!]) {
      productCreate(input: $input, media: $media) {
        product {
          id
          title
          handle
          variants(first: 5) {
            edges {
              node {
                id
                price
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': access_token
    },
    body: JSON.stringify({
      query: createQuery,
      variables: {
        input: {
          title: 'Naväge Advanced Nose Cleaner',
          handle: 'navage-advanced-nose-cleaner',
          descriptionHtml: '<p>Naväge Advanced Nose Cleaner</p>',
          vendor: 'Naväge',
          productType: 'Nasal Care',
          status: 'ACTIVE'
        }
      }
    })
  });
  const createData = await createRes.json();
  console.log('Create result:', JSON.stringify(createData, null, 2));
}

testSingle().catch(console.error);
