import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/homepage.html', 'utf8');

const idx = html.indexOf('block--heading_YmWzfw');
console.log('Heading block DOM:');
console.log(html.substring(idx - 50, idx + 800));
