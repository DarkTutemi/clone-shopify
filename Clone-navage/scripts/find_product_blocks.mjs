import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');

const secStart = html.indexOf('id="shopify-section-template--27702861398296__17884578899ace7cec"');
const secEnd = html.indexOf('id="shopify-section-template--27702861398296__rich_text_gMUtKb"', secStart);

const sectionHtml = html.substring(secStart, secEnd);
console.log('Section 19 length:', sectionHtml.length);
fs.writeFileSync('Clone-navage/data/section_featured_products.html', '<div ' + sectionHtml);
console.log('Saved to section_featured_products.html');
