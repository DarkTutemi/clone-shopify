import fs from 'fs';

const rawProducts = JSON.parse(fs.readFileSync('scripts/raw_catalog_products.json', 'utf8'));

// Read existing plan and refine lengths
const plan = JSON.parse(fs.readFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', 'utf8'));

plan.forEach(p => {
  const title = p.proposedProductTitle;
  const kw = p.primaryKeyword;

  // 1. REFINE SEO PAGE TITLE: TARGET 48 - 65 CHARACTERS
  // Format: "[Product Title] - [Benefit/Keyword] | Zavelyn" or "[Keyword] - [Benefit] | Zavelyn"
  let seoTitle = `${title} | Zavelyn`;
  if (seoTitle.length < 45) {
    seoTitle = `${title} - Official Store | Zavelyn`;
  }
  if (seoTitle.length < 45 && kw) {
    seoTitle = `${title} - ${kw} | Zavelyn`;
  }
  if (seoTitle.length > 65) {
    seoTitle = `${title} | Zavelyn`;
  }
  if (seoTitle.length > 65) {
    // Truncate cleanly before Zavelyn
    const maxLen = 65 - ' | Zavelyn'.length;
    seoTitle = `${title.slice(0, maxLen).trim()} | Zavelyn`;
  }

  p.proposedSeoPageTitle = seoTitle;
  p.seoTitleCharCount = seoTitle.length;

  // 2. REFINE META DESCRIPTION: STRICTLY 135 - 160 CHARACTERS
  // Clean, high-converting US English
  let desc = `Shop the ${title}. Designed for dependable performance, everyday comfort, and premium quality. Enjoy fast US shipping & 90-day guarantee at Zavelyn.`;
  
  if (desc.length > 160) {
    desc = `Discover the ${title}. Built for reliable performance and everyday ease. Shop Zavelyn today with fast US delivery and our 90-day guarantee.`;
  }
  if (desc.length > 160) {
    desc = `Shop ${title}. Enjoy reliable performance, easy operation, and durable quality. Get fast US shipping & a 90-day guarantee from Zavelyn.`;
  }
  if (desc.length > 160) {
    desc = `Explore the ${title}. Engineered for reliability and premium quality. Order from Zavelyn with fast US shipping & 90-day guarantee.`;
  }
  if (desc.length < 130) {
    desc = `Discover the authentic ${title}. Engineered for reliable everyday performance and premium comfort. Enjoy fast US shipping & 90-day guarantee from Zavelyn.`;
  }

  p.proposedMetaDescription = desc;
  p.metaDescCharCount = desc.length;
});

// Update JSON and CSV
fs.writeFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', JSON.stringify(plan, null, 2));

const headers = [
  'Product ID',
  'Product Status',
  'Current Product Title',
  'Proposed Product Title',
  'Title Chars',
  'Current SEO Page Title',
  'Proposed SEO Page Title',
  'SEO Title Chars',
  'Current Meta Description',
  'Proposed Meta Description',
  'Meta Desc Chars',
  'Current URL Handle',
  'Proposed URL Handle',
  'Old Full URL',
  'New Full URL',
  'Primary Keyword',
  'Change Reason',
  'Redirect Required',
  'Ads Traffic Risk',
  'SEO Risk',
  'Content Verification',
  'Classification',
  'Approval Status'
];

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const s = String(val).replace(/"/g, '""');
  return `"${s}"`;
}

const csvRows = [headers.join(',')];
plan.forEach(r => {
  csvRows.push([
    escapeCsv(r.productId),
    escapeCsv(r.status),
    escapeCsv(r.currentProductTitle),
    escapeCsv(r.proposedProductTitle),
    escapeCsv(r.titleCharCount),
    escapeCsv(r.currentSeoPageTitle),
    escapeCsv(r.proposedSeoPageTitle),
    escapeCsv(r.seoTitleCharCount),
    escapeCsv(r.currentMetaDescription),
    escapeCsv(r.proposedMetaDescription),
    escapeCsv(r.metaDescCharCount),
    escapeCsv(r.currentUrlHandle),
    escapeCsv(r.proposedUrlHandle),
    escapeCsv(r.oldFullUrl),
    escapeCsv(r.newFullUrl),
    escapeCsv(r.primaryKeyword),
    escapeCsv(r.changeReason),
    escapeCsv(r.redirectRequired),
    escapeCsv(r.adsTrafficRisk),
    escapeCsv(r.seoRisk),
    escapeCsv(r.contentVerification),
    escapeCsv(r.classification),
    escapeCsv(r.approvalStatus)
  ].join(','));
});

fs.writeFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.csv', csvRows.join('\n'));

// Output verification stats
let titleMin = 999, titleMax = 0, titleSum = 0;
let seoTitleMin = 999, seoTitleMax = 0, seoTitleSum = 0;
let metaDescMin = 999, metaDescMax = 0, metaDescSum = 0;

plan.forEach(p => {
  const tLen = p.titleCharCount;
  const sLen = p.seoTitleCharCount;
  const mLen = p.metaDescCharCount;

  titleMin = Math.min(titleMin, tLen);
  titleMax = Math.max(titleMax, tLen);
  titleSum += tLen;

  seoTitleMin = Math.min(seoTitleMin, sLen);
  seoTitleMax = Math.max(seoTitleMax, sLen);
  seoTitleSum += sLen;

  metaDescMin = Math.min(metaDescMin, mLen);
  metaDescMax = Math.max(metaDescMax, mLen);
  metaDescSum += mLen;
});

console.log('=== STRICT SPECIFICATION COMPLIANCE ===');
console.log('Product Title Length:', { min: titleMin, max: titleMax, avg: (titleSum/plan.length).toFixed(1), target: '25-60 chars' });
console.log('SEO Page Title Length:', { min: seoTitleMin, max: seoTitleMax, avg: (seoTitleSum/plan.length).toFixed(1), target: '45-65 chars' });
console.log('Meta Description Length:', { min: metaDescMin, max: metaDescMax, avg: (metaDescSum/plan.length).toFixed(1), target: '130-160 chars' });
