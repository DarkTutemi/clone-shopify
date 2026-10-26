import fs from 'fs';

const html = fs.readFileSync('kittycollective_full.html', 'utf-8');

// Find all elements with class containing 'section' or id containing 'shopify-section'
const secMatches = [...html.matchAll(/<(?:section|div)[^>]*id=["'](shopify-section-[^"']+)["'][^>]*>/gi)];
console.log(`Found ${secMatches.length} shopify section containers:`);
secMatches.forEach((m, idx) => {
  console.log(`${idx + 1}. ${m[1]}`);
});

// Let's also look for key structural headings and content
const headings = [...html.matchAll(/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi)]
  .map(m => ({ tag: m[1], text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() }))
  .filter(h => h.text.length > 0 && h.text.length < 150);

console.log('\nAll Headings on Page:');
headings.forEach((h, idx) => console.log(`${idx + 1}. [${h.tag}] ${h.text}`));

// Let's check social proof, trust icons, badges
const badges = [...html.matchAll(/<span[^>]*class=["'][^"']*(?:badge|tag|pill|guarantee)[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi)]
  .map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
  .filter(b => b.length > 0 && b.length < 80);
console.log('\nBadges/Tags:', badges.slice(0, 15));
