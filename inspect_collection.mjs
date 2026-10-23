import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/collections_earthly-derm.html', 'utf8');

const secRegex = /id=['"]shopify-section-([^'"]+)['"]/g;
const sectionIds = [];
let m;
while ((m = secRegex.exec(html)) !== null) {
  sectionIds.push(m[1]);
}
console.log('Collection Sections:', sectionIds);

// check product cards in collection
const prodLinks = [...new Set([...html.matchAll(/\/products\/[^'"\s\?]+/g)].map(x => x[0]))];
console.log('Product links in collection:', prodLinks);
