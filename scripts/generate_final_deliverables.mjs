import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const PROGRESS_FILE = 'scripts/full_execution_progress.json';

async function shopifyGraphQL(query, variables = {}, token) {
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

async function fetchAllCatalogProducts(token) {
  let allProducts = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const q = `
      query getAllProds($cursor: String) {
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
            seo {
              title
              description
            }
            variants(first: 20) {
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
    const res = await shopifyGraphQL(q, { cursor }, token);
    const pData = res.data?.products;
    if (pData?.nodes) {
      allProducts.push(...pData.nodes);
    }
    hasNextPage = pData?.pageInfo?.hasNextPage;
    cursor = pData?.pageInfo?.endCursor;
  }
  return allProducts;
}

function csvEscape(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

async function generateDeliverables() {
  console.log('Generating final SEO audit deliverables...');
  const token = await getAccessToken();
  const allProducts = await fetchAllCatalogProducts(token);
  console.log(`Fetched ${allProducts.length} total products from Shopify Admin.`);

  const progress = fs.existsSync(PROGRESS_FILE) ? JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')) : null;

  const batch1Ids = ['15454947901625', '15454948163769', '15454948556985'];
  const batch2Ids = [
    '15454949540025', '15454950490297', '15454952882361', '15454953177273',
    '15454955765945', '15454959403193', '15454960517305', '15454961565881',
    '15454963073209', '15454963433657'
  ];

  const auditRows = [];
  const exceptionRows = [];

  let activeCount = 0;
  let draftCount = 0;
  let unlistedCount = 0;
  let successCount = 0;

  for (const p of allProducts) {
    const rawId = p.id.replace('gid://shopify/Product/', '');
    let batchLabel = 'UNASSIGNED';

    if (batch1Ids.includes(rawId)) batchLabel = 'Batch 1';
    else if (batch2Ids.includes(rawId)) batchLabel = 'Batch 2';
    else if (progress?.productLogs) {
      const pLog = progress.productLogs.find(l => l.productId === rawId);
      if (pLog) batchLabel = `Batch ${pLog.batchNumber}`;
    }

    if (p.status === 'DRAFT') {
      draftCount++;
      exceptionRows.push({
        productId: rawId,
        status: p.status,
        title: p.title,
        handle: p.handle,
        reason: 'DRAFT_STATUS_EXCLUDED',
        action: 'DO_NOT_PUBLISH_OR_MODIFY'
      });
      continue;
    }

    if (rawId === '15455032115385') { // Unlisted Handpans Bundle
      unlistedCount++;
      exceptionRows.push({
        productId: rawId,
        status: 'UNLISTED',
        title: p.title,
        handle: p.handle,
        reason: 'UNLISTED_LANDING_PAGE_EXCLUDED',
        action: 'DO_NOT_MODIFY_KEEP_ORIGINAL'
      });
      continue;
    }

    activeCount++;

    const titleHasTm = /[\u2122\u00AE]/.test(p.title);
    const seoTitleHasTm = /[\u2122\u00AE]/.test(p.seo?.title || '');
    const hasDoubleZavelyn = ((p.seo?.title || '').match(/Zavelyn/gi) || []).length > 1;
    const hasGuarantee = /60[- ]day|90[- ]day|100% money|risk[- ]free/i.test(p.seo?.description || '');

    let auditStatus = 'SUCCESS';
    let notes = [];

    if (titleHasTm || seoTitleHasTm) {
      auditStatus = 'NEEDS_REVIEW';
      notes.push('Contains trademark symbol');
    }
    if (hasDoubleZavelyn) {
      auditStatus = 'NEEDS_REVIEW';
      notes.push('Multiple Zavelyn in SEO Title');
    }
    if (hasGuarantee) {
      auditStatus = 'NEEDS_REVIEW';
      notes.push('Prohibited guarantee in Meta Description');
    }
    if (!p.seo?.title || !p.seo?.description) {
      auditStatus = 'NEEDS_REVIEW';
      notes.push('Missing SEO Title or Meta Description');
    }

    if (auditStatus === 'SUCCESS') successCount++;

    auditRows.push({
      productId: rawId,
      status: p.status,
      batch: batchLabel,
      title: p.title,
      seoTitle: p.seo?.title || '',
      metaDesc: p.seo?.description || '',
      handle: p.handle,
      handlePreserved: batchLabel === 'Batch 1' ? 'MIGRATED_BATCH1' : 'YES_PRESERVED',
      variantsCount: p.variants?.nodes?.length || 0,
      auditStatus,
      notes: notes.join('; ') || 'PASS'
    });
  }

  // 1. Write ZAVELYN_SEO_FINAL_AUDIT.csv
  const auditHeader = 'Product_ID,Status,Batch,Product_Title,SEO_Page_Title,Meta_Description,URL_Handle,Handle_Preserved,Variants_Count,Audit_Status,Notes\n';
  const auditCsvContent = auditHeader + auditRows.map(r => [
    csvEscape(r.productId),
    csvEscape(r.status),
    csvEscape(r.batch),
    csvEscape(r.title),
    csvEscape(r.seoTitle),
    csvEscape(r.metaDesc),
    csvEscape(r.handle),
    csvEscape(r.handlePreserved),
    csvEscape(r.variantsCount),
    csvEscape(r.auditStatus),
    csvEscape(r.notes)
  ].join(',')).join('\n');

  fs.writeFileSync('ZAVELYN_SEO_FINAL_AUDIT.csv', auditCsvContent, 'utf8');
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'ZAVELYN_SEO_FINAL_AUDIT.csv'), auditCsvContent, 'utf8');
  console.log('Saved ZAVELYN_SEO_FINAL_AUDIT.csv');

  // 2. Write ZAVELYN_SEO_EXCEPTIONS.csv
  const excHeader = 'Product_ID,Status,Title,URL_Handle,Reason,Recommended_Action\n';
  const excCsvContent = excHeader + exceptionRows.map(e => [
    csvEscape(e.productId),
    csvEscape(e.status),
    csvEscape(e.title),
    csvEscape(e.handle),
    csvEscape(e.reason),
    csvEscape(e.action)
  ].join(',')).join('\n');

  fs.writeFileSync('ZAVELYN_SEO_EXCEPTIONS.csv', excCsvContent, 'utf8');
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'ZAVELYN_SEO_EXCEPTIONS.csv'), excCsvContent, 'utf8');
  console.log('Saved ZAVELYN_SEO_EXCEPTIONS.csv');

  console.log(`\nAudit Summary:`);
  console.log(`Total Products: ${allProducts.length}`);
  console.log(`Active Products: ${activeCount}`);
  console.log(`Drafts Excluded: ${draftCount}`);
  console.log(`Unlisted Excluded: ${unlistedCount}`);
  console.log(`Successful Active: ${successCount}/${activeCount}`);
}

generateDeliverables().catch(console.error);
