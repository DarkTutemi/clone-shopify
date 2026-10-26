import fs from 'fs';

const html = fs.readFileSync('kitty_pdp_full.html', 'utf-8');

// Find all shopify-section blocks in HTML
const secMatches = [...html.matchAll(/id=["'](shopify-section-[^"']+)["'][^>]*>/gi)];
console.log(`Found ${secMatches.length} shopify sections on PDP:`);
secMatches.forEach((m, idx) => console.log(`${idx + 1}. ${m[1]}`));

// Extract headings on PDP
const headings = [...html.matchAll(/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi)]
  .map(m => ({ tag: m[1], text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() }))
  .filter(h => h.text.length > 0 && h.text.length < 150);

console.log('\nPDP Headings Structure:');
headings.forEach((h, idx) => console.log(`${idx + 1}. [${h.tag}] ${h.text}`));

// Extract BuyBox elements: bundles, tier discounts, badges, guarantees
const bundleMatches = [...html.matchAll(/<(?:div|span|label)[^>]*class=["']([^"']*(?:bundle|tier|save|package|discount|guarantee|upsell|badge)[^"']*)["'][^>]*>/gi)];
console.log(`\nFound ${bundleMatches.length} BuyBox / bundle class matches.`);
const uniqueBundleClasses = [...new Set(bundleMatches.map(m => m[1]))];
uniqueBundleClasses.slice(0, 20).forEach(c => console.log('  .', c));
