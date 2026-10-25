import fs from 'fs';

const html = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');

// Find all sections between <main> and </main>
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (!mainMatch) {
  console.log('No main tag found!');
  process.exit(1);
}

const mainContent = mainMatch[1];
console.log('Main content length:', mainContent.length);

// Let's inspect each section tag inside main
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
