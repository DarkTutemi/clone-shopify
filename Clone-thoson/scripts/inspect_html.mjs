import fs from 'fs';

const html = fs.readFileSync('Clone-thoson/data/product.html', 'utf8');

console.log('HTML size:', html.length);

// Theme info
const themeMatch = html.match(/"theme_name":\s*"([^"]+)"/) || html.match(/Shopify\.theme\s*=\s*({[^}]+})/i);
if (themeMatch) console.log('Theme info:', themeMatch[0]);

// Sections
const sectionRegex = /id="shopify-section-([^"]+)"/g;
let match;
const sections = [];
while ((match = sectionRegex.exec(html)) !== null) {
  sections.push(match[1]);
}
console.log(`Found ${sections.length} sections:`);
sections.forEach((s, idx) => console.log(`  [${idx+1}] ${s}`));

// CSS Links
const cssRegex = /href=["']([^"']+\.css[^"']*)["']/gi;
const links = new Set();
let m;
while ((m = cssRegex.exec(html)) !== null) {
  links.add(m[1]);
}
console.log(`\nFound ${links.size} CSS links:`);
links.forEach(l => console.log('  ', l));
