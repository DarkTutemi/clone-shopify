import fs from 'fs';

const html = fs.readFileSync('product_info_clean.html', 'utf8');

const custIdx = html.indexOf('62.000+ happy customers');
console.log('After happy customers:');
console.log(html.slice(custIdx, custIdx + 3000));
