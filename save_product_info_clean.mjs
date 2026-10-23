import fs from 'fs';

const html = fs.readFileSync('trybronoir_main_product_section.html', 'utf8');
const infoStart = html.indexOf('<div class="product__info');
const infoEnd = html.indexOf('</product-meta>') + 10000;
const chunk = html.slice(infoStart, html.indexOf('</section>', infoStart));

fs.writeFileSync('product_info_clean.html', chunk);
console.log('Saved product info chunk, length:', chunk.length);
