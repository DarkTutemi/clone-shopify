import fs from 'fs';

const html = fs.readFileSync('Clone-thoson/data/product.html', 'utf8');

const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (!mainMatch) {
  console.log('No <main> tag found!');
  process.exit(1);
}

const mainContent = mainMatch[1];
console.log('Main content length:', mainContent.length);

const sections = [];
const regex = /<div id="shopify-section-([^"]+)"[^>]*>/g;
let m;
while ((m = regex.exec(mainContent)) !== null) {
  sections.push({ id: m[1], index: m.index });
}

console.log(`Found ${sections.length} sections in <main>:`);
sections.forEach((s, i) => {
  const nextIndex = i < sections.length - 1 ? sections[i + 1].index : mainContent.length;
  const chunk = mainContent.slice(s.index, nextIndex);
  console.log(`[${i + 1}] ID: ${s.id} | Size: ${chunk.length} bytes`);
});

// Check variant cards in main
console.log('\n--- VARIANT CARDS CHECK ---');
const qbMatches = mainContent.match(/<[^>]+class="[^"]*qb-[^"]*"[^>]*>[\s\S]{0,300}/gi) || [];
console.log('qb- matches count:', qbMatches.length);
qbMatches.slice(0, 5).forEach((q, idx) => console.log(`QB [${idx+1}]:\n`, q));

// Check form
const formMatch = mainContent.match(/<form[^>]+action=["'][^"']*\/cart\/add["'][^>]*>([\s\S]*?)<\/form>/i) || mainContent.match(/<product-form[^>]*>([\s\S]*?)<\/product-form>/i);
if (formMatch) {
  console.log('\nFound Product Form! Length:', formMatch[0].length);
}
