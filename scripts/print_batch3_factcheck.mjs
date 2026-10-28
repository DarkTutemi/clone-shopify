import fs from 'fs';

const audit = JSON.parse(fs.readFileSync('scripts/batch3_pre_audit_report.json', 'utf8'));

audit.forEach((item, idx) => {
  console.log('================================================================');
  console.log(`[${idx + 1}] ID: ${item.productId} | Live: "${item.currentLive.title}"`);
  console.log(`Proposed Title: "${item.proposedMetadata.title}" (${item.metrics.titleLength} chars)`);
  console.log(`Proposed SEO Title: "${item.proposedMetadata.seoTitle}" (${item.metrics.seoTitleLength} chars)`);
  console.log(`Proposed Meta Desc: "${item.proposedMetadata.metaDescription}" (${item.metrics.metaDescLength} chars)`);
  console.log('Handle (Unchanged):', item.currentLive.handle);
  console.log('Description Snippet:', item.currentLive.sourceDescriptionSnippet.replace(/\s+/g, ' ').slice(0, 250));
  console.log('Flags:', JSON.stringify(item.factChecking));
});
