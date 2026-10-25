import fs from 'fs';

const html = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');

console.log('HTML size:', html.length);

// Check theme name or shopify object
const themeMatch = html.match(/theme\s*=\s*({[^}]+})/i) || html.match(/"theme":\s*({[^}]+})/i);
if (themeMatch) console.log('Theme info:', themeMatch[1]);

// Check section IDs
const sectionRegex = /id="shopify-section-([^"]+)"/g;
let match;
const sections = [];
while ((match = sectionRegex.exec(html)) !== null) {
  sections.push(match[1]);
}
console.log('Found sections:', sections.length);
sections.forEach((s, idx) => console.log(`  [${idx+1}] ${s}`));

// Check stylesheet links
const cssRegex = /<link[^>]+rel=["']stylesheet["'][^>]*>/gi;
const cssLinks = html.match(cssRegex) || [];
console.log('\nStylesheet links count:', cssLinks.length);
cssLinks.forEach(l => console.log('  ', l));

// Check template name
const templateMatch = html.match(/"template":\s*"([^"]+)"/) || html.match(/template-([a-zA-Z0-9_-]+)/);
console.log('\nTemplate match:', templateMatch ? templateMatch[0] : 'None');

// Check price, add to cart, bundles, etc.
const hasAtc = html.includes('name="add"') || html.includes('add-to-cart') || html.includes('AddToCart');
console.log('Has ATC button:', hasAtc);

// Search for unique headings or sales copy in HTML
const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
console.log('\nH1 tags:', h1Match);
