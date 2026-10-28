import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const STORE_DOMAIN = 'https://tryzavelyn.com';

const batch2Items = [
  { rawId: '15454949540025', name: 'Titanium Pocket Pry Bar', handle: 'sakerplus®-titanium-alloy-multifunction-pocket-pry-bar' },
  { rawId: '15454950490297', name: 'Squishy Egg Silicone Night Light', handle: 'sakerplus®-squishy-egg-multicolor-tap-night-light' },
  { rawId: '15454952882361', name: 'Kids Basketball Hoop Set', handle: 'sakerplus®-kids-indoor-outdoor-basketball-hoop-set' },
  { rawId: '15454953177273', name: 'Clamp-On Desk Shelf Organizer', handle: 'sakerplus®-three-tier-clamp-on-desk-shelf-organizer' },
  { rawId: '15454955765945', name: 'Rotating Galaxy Star Projector', handle: 'sakerplus®-rotating-galaxy-projector-with-adjustable-focus' },
  { rawId: '15454959403193', name: 'Low-Profile Downspout Catch Basin', handle: 'sakerplus®-low-profile-downspout-catch-basin' },
  { rawId: '15454960517305', name: 'Rotating Goose Target Game', handle: 'sakerplus®-electronic-rotating-goose-target-game' },
  { rawId: '15454961565881', name: 'Workbench Tail Vise Clamp', handle: 'sakerplus®-adjustable-workbench-tail-vise-clamp' },
  { rawId: '15454963073209', name: 'Rolling Nut & Fruit Harvester', handle: 'sakerplus®-rolling-nut-and-ball-picker' },
  { rawId: '15454963433657', name: 'Ultra-Fine Cooking Oil Sprayer', handle: 'sakerplus®-ultra-fine-cooking-oil-spray-bottle' }
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

async function verifyBatch2Live() {
  console.log('=== VERIFYING BATCH 2 LIVE STATE VIA SHOPIFY GRAPHQL API 2026-10 ===\n');
  const token = await getAccessToken();

  // 1. Check Redirects on Store
  console.log('1. Checking URL Redirect records in Shopify Admin...');
  const redirQuery = `
    query getRedirs {
      urlRedirects(first: 20) {
        nodes {
          id
          path
          target
        }
      }
    }
  `;
  const redirRes = await shopifyGQL(redirQuery, {}, token);
  const totalRedirects = redirRes.data?.urlRedirects?.nodes || [];
  console.log(`   Total URL Redirects in store: ${totalRedirects.length}`);
  totalRedirects.forEach(r => console.log(`   - ID: ${r.id} | Path: ${r.path} -> Target: ${r.target}`));

  const batch1RedirectIds = [
    'gid://shopify/UrlRedirect/604051898553',
    'gid://shopify/UrlRedirect/604052095161',
    'gid://shopify/UrlRedirect/604052357305'
  ];
  const newRedirectsCreatedForBatch2 = totalRedirects.filter(r => !batch1RedirectIds.includes(r.id));
  console.log(`   New Redirects created for Batch 2: ${newRedirectsCreatedForBatch2.length} (Expected: 0)\n`);

  // 2. Audit each Batch 2 product against snapshot
  console.log('2. Auditing 10 Batch 2 products live on Admin and Storefront...');
  const results = [];

  for (const item of batch2Items) {
    const gid = `gid://shopify/Product/${item.rawId}`;

    // Read live state
    const qProduct = `
      query getProd($id: ID!) {
        product(id: $id) {
          id
          title
          handle
          status
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
    `;
    const prodRes = await shopifyGQL(qProduct, { id: gid }, token);
    const liveProd = prodRes.data?.product;

    // Load pre-write snapshot
    const snapshotFiles = fs.readdirSync('scripts').filter(f => f.startsWith(`snapshot_prod_${item.rawId}_`));
    const latestSnapshotFile = snapshotFiles.sort().reverse()[0];
    const snapshotData = JSON.parse(fs.readFileSync(path.join('scripts', latestSnapshotFile), 'utf8'));

    // Compare variants, prices, inventory IDs
    const origVariants = snapshotData.variants?.nodes || [];
    const liveVariants = liveProd?.variants?.nodes || [];
    const variantsMatch = (
      origVariants.length === liveVariants.length &&
      origVariants.every((ov, idx) => {
        const lv = liveVariants[idx];
        return ov.id === lv.id && ov.price === lv.price && ov.sku === lv.sku;
      })
    );

    // Verify handle unchanged
    const handleUnchanged = liveProd?.handle === snapshotData.handle;

    // Storefront HTTP Check
    await new Promise(r => setTimeout(r, 2000));
    const storefrontUrl = `${STORE_DOMAIN}/products/${encodeURIComponent(liveProd.handle)}`;
    const sfRes = await fetch(storefrontUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const sfStatus = sfRes.status;
    const html = await sfRes.text();

    const tm = html.match(/<title>([^<]+)<\/title>/i);
    const renderedTitle = tm ? tm[1].trim() : '';
    const mm = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const renderedMeta = mm ? mm[1].trim() : '';

    const titleMatches = renderedTitle.includes('Zavelyn');
    const metaMatches = renderedMeta.length >= 100;

    const isAllPass = (
      handleUnchanged &&
      variantsMatch &&
      sfStatus === 200 &&
      liveProd?.seo?.title &&
      liveProd?.seo?.description
    );

    const auditRow = {
      productId: item.rawId,
      name: item.name,
      status: isAllPass ? 'PASS' : 'FAIL',
      handleUnchanged,
      currentHandle: liveProd?.handle,
      adminTitle: liveProd?.title,
      adminSeoTitle: liveProd?.seo?.title,
      adminMetaDesc: liveProd?.seo?.description,
      variantsCount: liveVariants.length,
      variantsMatch,
      storefrontHttp: sfStatus,
      renderedTitle,
      renderedMetaSnippet: renderedMeta.slice(0, 80) + '...'
    };

    console.log(`[ITEM] ${item.rawId} | Status: ${auditRow.status} | HTTP: ${sfStatus} | Handle: ${auditRow.currentHandle} (Unchanged: ${handleUnchanged}) | Variants Match: ${variantsMatch}`);
    results.push(auditRow);
  }

  const report = {
    auditTimestamp: new Date().toISOString(),
    totalProductsChecked: results.length,
    allPassed: results.every(r => r.status === 'PASS'),
    redirectsAudit: {
      totalInStore: totalRedirects.length,
      newBatch2Redirects: newRedirectsCreatedForBatch2.length,
      isClean: newRedirectsCreatedForBatch2.length === 0
    },
    products: results
  };

  fs.writeFileSync('scripts/batch2_post_execution_verified.json', JSON.stringify(report, null, 2), 'utf8');
  console.log('\nVerification completed. Saved to scripts/batch2_post_execution_verified.json');
}

verifyBatch2Live().catch(console.error);
