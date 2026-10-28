import fs from 'fs';

const plan = JSON.parse(fs.readFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', 'utf8'));

plan.forEach(p => {
  const title = p.proposedProductTitle;

  // Template crafted to stay between 135 and 158 chars for titles of length 32-50:
  // "Shop the [Title]. Built for dependable performance and everyday comfort. Enjoy fast US shipping & 90-day guarantee from Zavelyn."
  let desc = `Shop the ${title}. Built for dependable performance and everyday comfort. Enjoy fast US shipping & 90-day guarantee from Zavelyn.`;

  if (desc.length > 160) {
    desc = `Shop ${title}. Built for reliable performance and daily comfort. Fast US shipping & 90-day guarantee from Zavelyn.`;
  }
  if (desc.length > 160) {
    desc = `Discover ${title}. Engineered for reliable everyday performance. Fast US shipping & 90-day guarantee at Zavelyn.`;
  }
  if (desc.length < 130) {
    desc = `Discover the authentic ${title}. Engineered for reliable performance and everyday comfort. Fast US shipping & 90-day guarantee from Zavelyn.`;
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

let metaDescMin = 999, metaDescMax = 0, metaDescSum = 0;
plan.forEach(p => {
  const mLen = p.metaDescCharCount;
  metaDescMin = Math.min(metaDescMin, mLen);
  metaDescMax = Math.max(metaDescMax, mLen);
  metaDescSum += mLen;
});

console.log('Meta Description Length Verified:', { min: metaDescMin, max: metaDescMax, avg: (metaDescSum/plan.length).toFixed(1), target: '130-160 chars' });
