import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function fetchAllData() {
  const token = await getAccessToken();
  console.log('Got access token. Fetching all products via GraphQL...');

  const query = `
    query getCatalog($cursor: String) {
      products(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          legacyResourceId
          title
          handle
          status
          vendor
          productType
          description
          seo {
            title
            description
          }
          tags
          totalVariants
          variants(first: 10) {
            nodes {
              id
              title
              price
              sku
            }
          }
          createdAt
          updatedAt
          publishedAt
        }
      }
      urlRedirects(first: 100) {
        nodes {
          id
          path
          target
        }
      }
    }
  `;

  const gqlRes = await fetch(`https://${SHOP}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query })
  });

  const gqlData = await gqlRes.json();
  if (gqlData.errors) {
    console.error('GraphQL Errors:', JSON.stringify(gqlData.errors, null, 2));
    return;
  }

  const products = gqlData.data.products.nodes;
  const redirects = gqlData.data.urlRedirects.nodes;

  console.log(`Fetched ${products.length} products and ${redirects.length} existing redirects.`);

  fs.writeFileSync('scripts/raw_catalog_products.json', JSON.stringify(products, null, 2));
  fs.writeFileSync('scripts/raw_existing_redirects.json', JSON.stringify(redirects, null, 2));

  // Quick summary breakdown
  const statusCounts = {};
  const vendors = {};
  const types = {};
  let emptySeoTitleCount = 0;
  let emptySeoDescCount = 0;

  products.forEach(p => {
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
    vendors[p.vendor] = (vendors[p.vendor] || 0) + 1;
    types[p.productType] = (types[p.productType] || 0) + 1;
    if (!p.seo?.title) emptySeoTitleCount++;
    if (!p.seo?.description) emptySeoDescCount++;
  });

  console.log('\n--- STATUS BREAKDOWN ---', statusCounts);
  console.log('--- EMPTY SEO TITLE ---', emptySeoTitleCount);
  console.log('--- EMPTY SEO DESC ---', emptySeoDescCount);
  console.log('--- VENDORS ---', vendors);
  console.log('--- TOP PRODUCT TYPES ---', Object.entries(types).slice(0, 10));
}

fetchAllData().catch(console.error);
