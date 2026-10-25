import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');

const sectionIds = [];
const regex = /id=["']shopify-section-([^"']+)["']/g;
let match;
while ((match = regex.exec(html)) !== null) {
  sectionIds.push(match[1]);
}

console.log('Total Shopify Sections found:', sectionIds.length);
console.log('Section IDs:');
sectionIds.forEach((id, idx) => console.log(`  ${idx + 1}. ${id}`));

// Let's also check if there is a main template or page content
// Check for template name in shopify scripts
const tmplMatch = html.match(/template_suffix:\s*['"]([^'"]+)['"]/);
console.log('\nTemplate suffix:', tmplMatch ? tmplMatch[1] : 'none');

// Find sections belonging to the main content (excluding header and footer)
const contentSections = sectionIds.filter(id => !id.includes('header') && !id.includes('footer') && !id.includes('announcement') && !id.includes('overlay') && !id.includes('cart'));
console.log('\nContent sections count:', contentSections.length);
console.log('Content section IDs:', contentSections);
