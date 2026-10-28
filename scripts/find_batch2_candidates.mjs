import fs from 'fs';

const plan = JSON.parse(fs.readFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', 'utf8'));
const batch1Ids = ['15454947901625', '15454948163769', '15454948556985'];

const activeItems = plan.filter(p => p.status === 'ACTIVE');
console.log('Total ACTIVE items in plan:', activeItems.length);

const eligible = activeItems.filter(p => {
  if (batch1Ids.includes(p.productId)) return false;
  if (p.redirectRequired === 'NO' || p.proposedUrlHandle === p.currentUrlHandle) return false;
  if (p.adsTrafficRisk && p.adsTrafficRisk.toUpperCase().includes('HIGH')) return false;
  if (p.existingRedirectConflict && p.existingRedirectConflict !== 'NONE') return false;
  if (p.contentVerification !== 'VERIFIED_AGAINST_SOURCE') return false;
  return true;
});

console.log('Eligible Batch 2 candidates count:', eligible.length);
eligible.slice(0, 15).forEach((p, idx) => {
  console.log(`[${idx + 1}] ID: ${p.productId} | Title: "${p.proposedProductTitle}" | AdsRisk: ${p.adsTrafficRisk} | Old: ${p.currentUrlHandle} -> New: ${p.proposedUrlHandle}`);
});
