import fs from 'fs';

const html = fs.readFileSync('Clone-yeoman/data/product_main_section.html', 'utf8');

const stickyPos = html.indexOf('class="sup-sticky"');
if (stickyPos !== -1) {
  console.log('Sticky bar snippet:\n', html.substring(stickyPos - 100, stickyPos + 800));
}
