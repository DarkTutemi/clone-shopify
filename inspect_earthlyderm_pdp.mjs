import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/products_turmeric-glow-soap.html', 'utf8');

// check loox or reviews
const looxId = html.match(/data-product-id=['"](\d+)['"]/);
console.log('Product ID in HTML:', looxId ? looxId[1] : 'none');

// check all section IDs
const sectionIds = [];
const secRegex = /id=['"]shopify-section-([^'"]+)['"]/g;
let m;
while ((m = secRegex.exec(html)) !== null) {
  sectionIds.push(m[1]);
}
console.log('Sections on PDP:', sectionIds);

// check theme name or assets
const themeMatch = html.match(/Shopify\.theme\s*=\s*({[^}]+})/);
console.log('Shopify Theme info:', themeMatch ? themeMatch[1] : 'none');

// check cdn files / fonts
const cdnFiles = [...new Set([...html.matchAll(/https:\/\/cdn\.shopify\.com\/s\/files\/[^'"\s\)]+/g)].map(x => x[0]))];
console.log(`Discovered ${cdnFiles.length} CDN files on PDP`);
