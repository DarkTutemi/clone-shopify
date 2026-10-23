import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/pages_customer-reviews.html', 'utf8');
const rawBlocks = html.split(/class=['"][^'"]*\bloox-review\b[^'"]*['"]/i);
const s = rawBlocks[1];
const nonWhitespace = s.replace(/[\t\r\n ]+/g, ' ');
console.log('LENGTH:', nonWhitespace.length);
console.log('FIRST 500 CHARS:');
console.log(nonWhitespace.substring(0, 500));
