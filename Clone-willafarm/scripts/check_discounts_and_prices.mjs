import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  return data.access_token;
}

async function run() {
  const token = await getAccessToken();
  
  // 1. Get existing discounts via GraphQL
  const discountQuery = `{
    discountNodes(first: 20) {
      edges {
        node {
          id
          discount {
            __typename
            ... on DiscountCodeBasic {
              title
              codes(first: 5) { edges { node { code } } }
              customerGets { value { ... on DiscountPercentage { percentage } ... on DiscountAmount { amount { amount currencyCode } } } }
            }
            ... on DiscountAutomaticBasic {
              title
              customerGets { value { ... on DiscountPercentage { percentage } ... on DiscountAmount { amount { amount currencyCode } } } }
            }
            ... on DiscountCodeBxgy {
              title
            }
            ... on DiscountAutomaticBxgy {
              title
            }
            ... on DiscountCodeFreeShipping {
              title
            }
            ... on DiscountAutomaticFreeShipping {
              title
            }
          }
        }
      }
    }
  }`;

  const gqlRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query: discountQuery })
  });
  const gqlData = await gqlRes.json();
  console.log('=== DISCOUNTS ===');
  console.log(JSON.stringify(gqlData.data?.discountNodes?.edges || gqlData, null, 2));

  // 2. Check livestock heating lamp variants and prices
  const pRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/15455757336761.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pData = await pRes.json();
  console.log('\n=== LIVESTOCK HEATING LAMP VARIANTS ===');
  pData.product?.variants.forEach(v => {
    console.log(`ID: ${v.id} | Title: ${v.title} | Price: $${v.price} | CompareAt: $${v.compare_at_price}`);
  });

  // 3. Check what prices are displayed on the frontend of heating-lamp-funnel.liquid
  const funnelCode = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');
  // Find wfPackages or variant definitions
  const pkgMatches = funnelCode.match(/wfPackages\s*=\s*\[[\s\S]*?\];/);
  if (pkgMatches) {
    console.log('\n=== FUNNEL wfPackages ===');
    console.log(pkgMatches[0]);
  } else {
    // Search bundle cards
    const bundleMatches = funnelCode.match(/class="wf-bundle-option"[\s\S]*?<\/div>/g);
    console.log('\nBundle cards found:', bundleMatches ? bundleMatches.length : 0);
  }
}

run().catch(console.error);
