import fs from 'fs';

const html = fs.readFileSync('product_info_clean.html', 'utf8');

const buyIdx = html.indexOf('product-form__buy-buttons');
console.log('Buy button chunk:');
console.log(html.slice(buyIdx - 100, buyIdx + 3000));
