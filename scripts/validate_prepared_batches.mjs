import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/prepared_batches_3_to_9.json', 'utf8'));
console.log('Total batches:', data.batches.length);
console.log('Total products:', data.totalProducts);

const issues = [];
const allSeoTitles = new Set();
const allMetaDescs = new Set();

data.batches.forEach((b, bIdx) => {
  b.forEach((p, pIdx) => {
    const batchNum = bIdx + 3;
    // 1. Trademark check
    if (/[\u2122\u00AE]/i.test(p.proposedTitle) || /[\u2122\u00AE]/i.test(p.proposedSeoTitle) || /[\u2122\u00AE]/i.test(p.proposedMetaDesc)) {
      issues.push(`Batch ${batchNum} Item ${p.productId}: Contains trademark symbol`);
    }
    // 2. Double Zavelyn
    const zMatches = (p.proposedSeoTitle.match(/Zavelyn/gi) || []).length;
    if (zMatches > 1) {
      issues.push(`Batch ${batchNum} Item ${p.productId}: Multiple Zavelyn in SEO Title (${p.proposedSeoTitle})`);
    }
    // 3. Prohibited guarantee claims
    if (/60[- ]day|90[- ]day|100% money|risk[- ]free/i.test(p.proposedMetaDesc)) {
      issues.push(`Batch ${batchNum} Item ${p.productId}: Prohibited guarantee claims in Meta Desc`);
    }
    // 4. Unique SEO Title
    if (allSeoTitles.has(p.proposedSeoTitle)) {
      issues.push(`Batch ${batchNum} Item ${p.productId}: Duplicate SEO Title (${p.proposedSeoTitle})`);
    }
    allSeoTitles.add(p.proposedSeoTitle);

    // 5. Unique Meta Desc
    if (allMetaDescs.has(p.proposedMetaDesc)) {
      issues.push(`Batch ${batchNum} Item ${p.productId}: Duplicate Meta Desc (${p.proposedMetaDesc.slice(0, 30)}...)`);
    }
    allMetaDescs.add(p.proposedMetaDesc);

    // 6. Medical claims check
    if (/\b(cure|heals?|disease|treats?|medical)\b/i.test(p.proposedTitle) ||
        /\b(cure|heals?|disease|treats?|medical)\b/i.test(p.proposedSeoTitle) ||
        /\b(cure|heals?|disease|treats?|medical)\b/i.test(p.proposedMetaDesc)) {
      issues.push(`Batch ${batchNum} Item ${p.productId}: Potential medical claim flag`);
    }
  });
});

console.log('Issues found:', issues.length);
if (issues.length > 0) {
  console.log('Issues details:');
  issues.forEach(iss => console.log(' - ' + iss));
} else {
  console.log('ALL 63 PREPARED PRODUCTS PASSED PRE-WRITE RULES VALIDATION!');
}
