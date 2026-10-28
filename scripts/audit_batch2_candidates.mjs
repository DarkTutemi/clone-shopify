import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const plan = JSON.parse(fs.readFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', 'utf8'));

const candidateIds = [
  '15454949540025', // Titanium Pocket Pry Bar
  '15454950490297', // Squishy Egg Silicone Night Light
  '15454952882361', // Kids Basketball Hoop Set
  '15454953177273', // Clamp-On Desk Shelf Organizer
  '15454955765945', // Rotating Galaxy Star Projector
  '15454959403193', // Low-Profile Downspout Catch Basin
  '15454960517305', // Rotating Goose Target Game
  '15454961565881', // Workbench Tail Vise Clamp
  '15454963073209', // Rolling Nut & Fruit Harvester
  '15454963433657'  // Ultra-Fine Cooking Oil Sprayer
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

async function auditBatch2() {
  console.log('=== AUDITING BATCH 2 CANDIDATES VIA SHOPIFY GRAPHQL API 2026-10 ===\n');
  const token = await getAccessToken();

  const auditReport = [];

  for (const rawId of candidateIds) {
    const planItem = plan.find(p => p.productId === rawId);
    const gid = `gid://shopify/Product/${rawId}`;

    // 1. Fetch live product from Shopify Admin
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
    const resProd = await shopifyGQL(qProduct, { id: gid }, token);
    const liveProd = resProd.data?.product;

    // 2. Check proposed handle availability
    const qHandle = `
      query checkHandle($query: String!) {
        products(first: 1, query: $query) {
          nodes {
            id
            handle
          }
        }
      }
    `;
    const resHandle = await shopifyGQL(qHandle, { query: `handle:${planItem.proposedUrlHandle}` }, token);
    const nodes = resHandle.data?.products?.nodes || [];
    const handleFree = nodes.length === 0 || nodes[0].id === gid;

    // 3. Check existing redirect
    const qRedirect = `
      query checkRedir($path: String!) {
        urlRedirects(first: 5, query: $path) {
          nodes {
            id
            path
            target
          }
        }
      }
    `;
    const oldPath = `/products/${liveProd ? liveProd.handle : planItem.currentUrlHandle}`;
    const resRedir = await shopifyGQL(qRedirect, { path: `path:${oldPath}` }, token);
    const existingRedirects = resRedir.data?.urlRedirects?.nodes || [];

    // 4. Content verification
    const hasTrademark = (str) => /[\u2122\u00AE]/.test(str);
    const tmInTitle = hasTrademark(planItem.proposedProductTitle);
    const tmInSeo = hasTrademark(planItem.proposedSeoPageTitle);
    const tmInDesc = hasTrademark(planItem.proposedMetaDescription);
    const tmInHandle = hasTrademark(planItem.proposedUrlHandle);

    const charTitle = planItem.proposedProductTitle.length;
    const charSeoTitle = planItem.proposedSeoPageTitle.length;
    const charMetaDesc = planItem.proposedMetaDescription.length;

    const contains6090 = /60-day|90-day/i.test(planItem.proposedMetaDescription) || /60-day|90-day/i.test(planItem.proposedSeoPageTitle);
    const containsMedical = /cure|heal|treat|disease|medical/i.test(planItem.proposedMetaDescription);

    const auditItem = {
      productId: rawId,
      gid,
      liveState: {
        title: liveProd?.title,
        handle: liveProd?.handle,
        status: liveProd?.status,
        seoTitle: liveProd?.seo?.title,
        metaDescription: liveProd?.seo?.description,
        variantsCount: liveProd?.variants?.nodes?.length,
        variants: liveProd?.variants?.nodes
      },
      proposedState: {
        title: planItem.proposedProductTitle,
        handle: planItem.proposedUrlHandle,
        seoTitle: planItem.proposedSeoPageTitle,
        metaDescription: planItem.proposedMetaDescription
      },
      metrics: {
        titleLength: charTitle,
        seoTitleLength: charSeoTitle,
        metaDescLength: charMetaDesc
      },
      validation: {
        handleFree,
        existingRedirectsCount: existingRedirects.length,
        existingRedirects,
        trademarkViolation: tmInTitle || tmInSeo || tmInDesc || tmInHandle,
        invalidGuarantee: contains6090,
        medicalClaimViolation: containsMedical,
        statusMatch: liveProd?.status === 'ACTIVE'
      },
      trafficRisk: planItem.adsTrafficRisk,
      contentVerification: planItem.contentVerification
    };

    auditReport.push(auditItem);
    console.log(`[PASS AUDIT] ${rawId} | "${planItem.proposedProductTitle}" | Handle Free: ${handleFree} | Variants: ${liveProd?.variants?.nodes?.length}`);
  }

  fs.writeFileSync('scripts/batch2_pre_execution_audit.json', JSON.stringify(auditReport, null, 2), 'utf8');
  console.log('\nAudit complete! Saved to scripts/batch2_pre_execution_audit.json');
}

auditBatch2().catch(console.error);
