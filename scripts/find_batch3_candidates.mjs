import fs from 'fs';

const plan = JSON.parse(fs.readFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', 'utf8'));

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

console.log('Total completed items so far:', completedIds.length);

const remainingActive = plan.filter(p => {
  if (completedIds.includes(p.productId)) return false;
  if (p.status !== 'ACTIVE') return false;
  return true;
});

console.log('Remaining ACTIVE products count:', remainingActive.length);

remainingActive.slice(0, 25).forEach((p, idx) => {
  console.log(`[${idx + 1}] ID: ${p.productId} | Title: "${p.currentProductTitle}" -> "${p.proposedProductTitle}" | Handle: ${p.currentUrlHandle} | Verification: ${p.contentVerification} | AdsRisk: ${p.adsTrafficRisk}`);
});
