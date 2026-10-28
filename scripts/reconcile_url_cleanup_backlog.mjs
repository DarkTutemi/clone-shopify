import fs from 'fs';

const plan = JSON.parse(fs.readFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', 'utf8'));

const batch1Ids = ['15454947901625', '15454948163769', '15454948556985'];

const dirtyPatterns = [
  /sakerplus/i,
  /saker/i,
  /®/,
  /%c2%ae/i,
  /clearance/i,
  /bogo/i
];

console.log('=== COMPLETE URL RECONCILIATION FOR 83 PRODUCTS ===\n');
console.log('Total catalog products in plan:', plan.length);

const batch1Cleaned = [];
const dirtyBacklog = [];
const alreadyCleanOrNative = [];

for (const p of plan) {
  const handle = p.currentUrlHandle || '';
  if (batch1Ids.includes(p.productId)) {
    batch1Cleaned.push({ id: p.productId, title: p.proposedProductTitle, handle: p.proposedUrlHandle });
    continue;
  }

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

    dirtyBacklog.push({
      productId: p.productId,
      title: p.proposedProductTitle || p.currentProductTitle,
      status: p.status,
      handle,
      proposedCleanHandle: p.proposedUrlHandle,
      adsTrafficStatus: p.adsTrafficRisk,
      priority
    });
  } else {
    alreadyCleanOrNative.push({
      productId: p.productId,
      title: p.proposedProductTitle || p.currentProductTitle,
      status: p.status,
      handle
    });
  }
}

console.log('1. Batch 1 Cleaned Handles count:', batch1Cleaned.length);
console.log('2. Backlog Dirty Handles count:', dirtyBacklog.length);
console.log('3. Clean / Native Handles count:', alreadyCleanOrNative.length);
console.log('Total sum:', batch1Cleaned.length + dirtyBacklog.length + alreadyCleanOrNative.length);

// Priority breakdown
const pMap = {};
dirtyBacklog.forEach(item => {
  pMap[item.priority] = (pMap[item.priority] || 0) + 1;
});
console.log('\nPriority Breakdown of 61 Backlog Items:');
console.log(JSON.stringify(pMap, null, 2));

console.log('\nClean/Native items (19 items):');
alreadyCleanOrNative.forEach(item => {
  console.log(` - ID: ${item.productId} | Status: ${item.status} | Handle: "${item.handle}" | Title: "${item.title}"`);
});
