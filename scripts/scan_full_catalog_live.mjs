import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const completedIds = [
  // Batch 1 (3 items)
  '15454947901625',
  '15454948163769',
  '15454948556985',
  // Batch 2 (10 items)
  '15454949540025',
  '15454950490297',
  '15454952882361',
  '15454953177273',
  '15454955765945',
  '15454959403193',
  '15454960517305',
  '15454961565881',
  '15454963073209',
  '15454963433657'
];

async function shopifyGQL(query, variables = {}, token) {
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });
  return await res.json();
}

async function scanFullCatalog() {
  console.log('=== SCANNING FULL SHOPIFY LIVE CATALOG VIA API 2026-10 ===\n');
  const token = await getAccessToken();

  let allProducts = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const q = `
      query getProducts($cursor: String) {
        products(first: 50, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
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
            variants(first: 10) {
              nodes {
                id
                title
                price
                sku
              }
            }
          }
        }
      }
    `;

    const res = await shopifyGQL(q, { cursor }, token);
    const data = res.data?.products;
    if (!data) {
      console.error('Error fetching products:', res);
      break;
    }

    allProducts.push(...data.nodes);
    hasNextPage = data.pageInfo.hasNextPage;
    cursor = data.pageInfo.endCursor;
  }

  console.log(`Total live products found in Shopify Admin: ${allProducts.length}`);

  const active = allProducts.filter(p => p.status === 'ACTIVE');
  const draft = allProducts.filter(p => p.status === 'DRAFT');
  const archived = allProducts.filter(p => p.status === 'ARCHIVED');

  console.log(`- ACTIVE: ${active.length}`);
  console.log(`- DRAFT: ${draft.length}`);
  console.log(`- ARCHIVED: ${archived.length}`);

  const activeCompleted = active.filter(p => completedIds.includes(p.id.replace('gid://shopify/Product/', '')));
  const activeRemaining = active.filter(p => !completedIds.includes(p.id.replace('gid://shopify/Product/', '')));

  console.log(`- Completed so far (Batch 1 + 2): ${activeCompleted.length}`);
  console.log(`- Remaining ACTIVE to process: ${activeRemaining.length}`);

  fs.writeFileSync('scripts/live_full_catalog_scan.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    total: allProducts.length,
    activeCount: active.length,
    draftCount: draft.length,
    archivedCount: archived.length,
    completedCount: activeCompleted.length,
    remainingCount: activeRemaining.length,
    remainingProducts: activeRemaining,
    completedProducts: activeCompleted,
    draftProducts: draft,
    archivedProducts: archived
  }, null, 2), 'utf8');

  console.log('\nSaved full live scan to scripts/live_full_catalog_scan.json');
}

scanFullCatalog().catch(console.error);
