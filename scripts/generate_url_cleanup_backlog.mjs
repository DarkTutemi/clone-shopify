import fs from 'fs';

const plan = JSON.parse(fs.readFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', 'utf8'));

// Batch 1 products that already had their handles cleaned
const batch1CleanedIds = ['15454947901625', '15454948163769', '15454948556985'];

const dirtyPatterns = [
  /sakerplus/i,
  /saker/i,
  /®/,
  /%c2%ae/i,
  /clearance/i,
  /bogo/i
];

const backlogItems = [];

for (const p of plan) {
  // If already migrated handle in Batch 1, skip
  if (batch1CleanedIds.includes(p.productId)) continue;

  const handle = p.currentUrlHandle || '';
  const isDirty = dirtyPatterns.some(pat => pat.test(handle)) || handle.length > 45;

  if (isDirty) {
    let priority = 'MEDIUM';
    if (p.adsTrafficRisk?.toUpperCase().includes('HIGH')) {
      priority = 'HIGH (PAID ADS FUNNEL)';
    } else if (handle.includes('®') || handle.includes('sakerplus')) {
      priority = 'HIGH (TRADEMARK IN URL)';
    } else if (handle.includes('clearance') || handle.includes('bogo')) {
      priority = 'LOW (PROMO TAG)';
    }

    backlogItems.push({
      productId: p.productId,
      title: p.proposedProductTitle || p.currentProductTitle,
      status: p.status,
      currentHandle: handle,
      proposedCleanHandle: p.proposedUrlHandle,
      adsTrafficStatus: p.adsTrafficRisk || 'ADS TRAFFIC UNKNOWN',
      redirectRequirement: '301 REDIRECT REQUIRED ON HANDLE CHANGE',
      priority,
      approvalStatus: 'PENDING_APPROVAL_HOLD_IN_BATCH_3'
    });
  }
}

console.log('Total items in URL Cleanup Backlog:', backlogItems.length);

// Generate CSV
const headers = [
  'Product ID',
  'Product Title',
  'Status',
  'Current Handle',
  'Proposed Clean Handle',
  'Ads Traffic Status',
  'Redirect Requirement',
  'Priority',
  'Approval Status'
];

const csvRows = [headers.join(',')];

for (const item of backlogItems) {
  const row = [
    `"${item.productId}"`,
    `"${item.title.replace(/"/g, '""')}"`,
    `"${item.status}"`,
    `"${item.currentHandle}"`,
    `"${item.proposedCleanHandle}"`,
    `"${item.adsTrafficStatus}"`,
    `"${item.redirectRequirement}"`,
    `"${item.priority}"`,
    `"${item.approvalStatus}"`
  ];
  csvRows.push(row.join(','));
}

fs.writeFileSync('scripts/ZAVELYN_URL_CLEANUP_BACKLOG.csv', csvRows.join('\n'), 'utf8');
fs.writeFileSync('ZAVELYN_URL_CLEANUP_BACKLOG.csv', csvRows.join('\n'), 'utf8');
fs.writeFileSync('scripts/ZAVELYN_URL_CLEANUP_BACKLOG.json', JSON.stringify(backlogItems, null, 2), 'utf8');

console.log('Saved to ZAVELYN_URL_CLEANUP_BACKLOG.csv and scripts/ZAVELYN_URL_CLEANUP_BACKLOG.csv');
