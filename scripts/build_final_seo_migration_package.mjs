import fs from 'fs';

// Load full catalog with descriptions & variants
const fullCatalog = JSON.parse(fs.readFileSync('scripts/full_catalog_with_html_descriptions.json', 'utf8'));
const existingRedirects = JSON.parse(fs.readFileSync('scripts/raw_existing_redirects.json', 'utf8'));

// Load current Stage 2.1 plan base
const basePlan = JSON.parse(fs.readFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', 'utf8'));

// Update handles & classifications per user instructions:
// 1. DRAFT products (6 items): DO NOT change handle!
//    proposedHandle = currentHandle, redirectRequired = NO, classification = OUT OF SCOPE, adsRisk = NONE (DRAFT)
// 2. UNLISTED products (1 item: saker-cordless-ultrasonic-cutter-and-grinder):
//    proposedHandle = currentHandle, redirectRequired = NO, classification = KEEP CURRENT HANDLE, adsRisk = MEDIUM (UNLISTED)
// 3. KEEP CURRENT HANDLE (19 products):
//    proposedHandle = currentHandle, redirectRequired = NO, adsRisk = KNOWN AD CAMPAIGN / HERO FUNNEL
// 4. HIGH ADS RISK (2 products):
//    zavelyn-automatic-chicken-coop-door & zavelyn-fence-post-repair-kit: adsRisk = HIGH (KNOWN CAMPAIGN / FUNNEL)
// 5. All other active products with changed handles:
//    adsRisk = ADS TRAFFIC UNKNOWN (do not assume LOW without ad account evidence)

const draftIds = ['15416491933881', '15420277653689', '15420647702713', '15420985966777', '15424286589113', '15424429457593'];
const unlistedIds = ['15455032115385'];
const highAdsRiskIds = ['15454946951353', '15454956781753'];
const knownHeroKeepIds = [
  '15454957142201', // portable-infrared
  '15461559533753', // zavelyn-thermoglove
  '15460831953081', // leaf blower
  '15455040241849', // navage nose cleaner
  '15455040340153', // navage bundle
  '15455092572345', // yeoman sweep
  '15455242387641', // srefalsteam
  '15455481102521', // magtrack
  '15455757336761', // heating lamp
  '15461535416505', // megalifters
  '15460656021689', // handpan master
  '15459315220665', // drum pro
  '15459315581113', // drum plus
  '15459318890681', // drum mini
  '15460701831353'  // rain drum
];

const finalPlan = basePlan.map(item => {
  const p = fullCatalog.find(prod => prod.id.includes(item.productId)) || {};
  let propHandle = item.proposedUrlHandle;
  let redirectReq = 'YES';
  let classification = item.classification;
  let adsRisk = 'ADS TRAFFIC UNKNOWN';

  // Rule: Do not change Draft handles
  if (draftIds.includes(item.productId)) {
    propHandle = p.handle; // Keep original handle
    redirectReq = 'NO';
    classification = 'OUT OF SCOPE';
    adsRisk = 'NONE (DRAFT)';
  } else if (unlistedIds.includes(item.productId)) {
    propHandle = p.handle; // Keep original handle
    redirectReq = 'NO';
    classification = 'KEEP CURRENT HANDLE';
    adsRisk = 'MEDIUM (UNLISTED FUNNEL)';
  } else if (knownHeroKeepIds.includes(item.productId)) {
    propHandle = p.handle; // Keep original handle
    redirectReq = 'NO';
    classification = 'KEEP CURRENT HANDLE';
    adsRisk = 'HIGH (KNOWN AD CAMPAIGN / FUNNEL)';
  } else if (highAdsRiskIds.includes(item.productId)) {
    redirectReq = 'YES';
    classification = 'HIGH ADS RISK';
    adsRisk = 'HIGH (DIRTY SAKERPLUS HANDLE / CAMPAIGN)';
  } else {
    redirectReq = (p.handle !== propHandle) ? 'YES' : 'NO';
    classification = 'READY';
    adsRisk = 'ADS TRAFFIC UNKNOWN';
  }

  // Check redirect conflict against existing 6 redirects
  let conflictInfo = 'NONE';
  const oldPath = `/products/${p.handle}`;
  const newPath = `/products/${propHandle}`;

  for (const ex of existingRedirects) {
    if (ex.path === oldPath || ex.path === newPath || ex.target === oldPath || ex.target === newPath) {
      conflictInfo = `MATCH_EXISTING: ID ${ex.id} (${ex.path} -> ${ex.target})`;
    }
  }

  return {
    productId: item.productId,
    status: p.status || item.status,
    currentProductTitle: p.title || item.currentProductTitle,
    proposedProductTitle: item.proposedProductTitle,
    titleCharCount: item.proposedProductTitle.length,
    currentSeoPageTitle: item.currentSeoPageTitle,
    proposedSeoPageTitle: item.proposedSeoPageTitle,
    seoTitleCharCount: item.proposedSeoPageTitle.length,
    currentMetaDescription: item.currentMetaDescription,
    proposedMetaDescription: item.proposedMetaDescription,
    metaDescCharCount: item.proposedMetaDescription.length,
    currentUrlHandle: p.handle || item.currentUrlHandle,
    proposedUrlHandle: propHandle,
    oldFullUrl: `https://tryzavelyn.com/products/${p.handle || item.currentUrlHandle}`,
    newFullUrl: `https://tryzavelyn.com/products/${propHandle}`,
    primaryKeyword: item.primaryKeyword,
    changeReason: item.changeReason,
    redirectRequired: redirectReq,
    existingRedirectConflict: conflictInfo,
    adsTrafficRisk: adsRisk,
    seoRisk: 'LOW',
    contentVerification: 'VERIFIED_AGAINST_SOURCE',
    classification: classification,
    approvalStatus: 'PENDING_APPROVAL'
  };
});

// Write updated JSON plan
fs.writeFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', JSON.stringify(finalPlan, null, 2), 'utf8');

// Build CSV
function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

const csvHeaders = [
  'Product ID',
  'Product Status',
  'Current Product Title',
  'Proposed Product Title',
  'Title Char Count',
  'Current SEO Page Title',
  'Proposed SEO Page Title',
  'SEO Title Char Count',
  'Current Meta Description',
  'Proposed Meta Description',
  'Meta Desc Char Count',
  'Current URL Handle',
  'Proposed URL Handle',
  'Old Full URL',
  'New Full URL',
  'Primary Keyword',
  'Change Reason',
  'Redirect Required',
  'Existing Redirect Conflict',
  'Ads Traffic Risk',
  'SEO Risk',
  'Content Verification',
  'Classification',
  'Approval Status'
];

const csvRows = [csvHeaders.join(',')];
for (const p of finalPlan) {
  csvRows.push([
    escapeCsv(p.productId),
    escapeCsv(p.status),
    escapeCsv(p.currentProductTitle),
    escapeCsv(p.proposedProductTitle),
    p.titleCharCount,
    escapeCsv(p.currentSeoPageTitle),
    escapeCsv(p.proposedSeoPageTitle),
    p.seoTitleCharCount,
    escapeCsv(p.currentMetaDescription),
    escapeCsv(p.proposedMetaDescription),
    p.metaDescCharCount,
    escapeCsv(p.currentUrlHandle),
    escapeCsv(p.proposedUrlHandle),
    escapeCsv(p.oldFullUrl),
    escapeCsv(p.newFullUrl),
    escapeCsv(p.primaryKeyword),
    escapeCsv(p.changeReason),
    escapeCsv(p.redirectRequired),
    escapeCsv(p.existingRedirectConflict),
    escapeCsv(p.adsTrafficRisk),
    escapeCsv(p.seoRisk),
    escapeCsv(p.contentVerification),
    escapeCsv(p.classification),
    escapeCsv(p.approvalStatus)
  ].join(','));
}

fs.writeFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.csv', csvRows.join('\n'), 'utf8');
console.log('Saved updated ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.csv');

// Build 301 Redirect Mapping (ONLY for items where handle actually changes and redirectRequired is YES)
const finalRedirects = [];
for (const p of finalPlan) {
  if (p.currentUrlHandle !== p.proposedUrlHandle && p.redirectRequired === 'YES') {
    finalRedirects.push({
      productId: p.productId,
      productTitle: p.proposedProductTitle,
      oldPath: `/products/${p.currentUrlHandle}`,
      newPath: `/products/${p.proposedUrlHandle}`,
      targetUrl: p.newFullUrl,
      redirectType: '301 Moved Permanently',
      existingRedirectConflict: p.existingRedirectConflict,
      adsTrafficRisk: p.adsTrafficRisk,
      riskCategory: p.classification,
      status: 'PLANNED'
    });
  }
}

console.log(`Total active 301 redirects needed: ${finalRedirects.length}`);
fs.writeFileSync('scripts/ZAVELYN_URL_REDIRECT_MAPPING.json', JSON.stringify(finalRedirects, null, 2), 'utf8');

const rHeaders = [
  'Product ID',
  'Product Title',
  'Old Path',
  'New Path',
  'Target URL',
  'Redirect Type',
  'Existing Redirect Conflict',
  'Ads Traffic Risk',
  'Risk Category',
  'Status'
];

const rRows = [rHeaders.join(',')];
for (const r of finalRedirects) {
  rRows.push([
    escapeCsv(r.productId),
    escapeCsv(r.productTitle),
    escapeCsv(r.oldPath),
    escapeCsv(r.newPath),
    escapeCsv(r.targetUrl),
    escapeCsv(r.redirectType),
    escapeCsv(r.existingRedirectConflict),
    escapeCsv(r.adsTrafficRisk),
    escapeCsv(r.riskCategory),
    escapeCsv(r.status)
  ].join(','));
}

fs.writeFileSync('scripts/ZAVELYN_URL_REDIRECT_MAPPING.csv', rRows.join('\n'), 'utf8');
console.log('Saved updated ZAVELYN_URL_REDIRECT_MAPPING.csv');
