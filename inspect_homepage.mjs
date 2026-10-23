import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/homepage.html', 'utf8');

const secRegex = /id=['"]shopify-section-([^'"]+)['"]/g;
const sectionIds = [];
let m;
while ((m = secRegex.exec(html)) !== null) {
  sectionIds.push(m[1]);
}
console.log('Homepage Sections:', sectionIds);

// check title and main banner
const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim();
console.log('Title:', title);
