import fs from 'fs';

const html = fs.readFileSync('Clone-yeoman/data/product_main_section.html', 'utf8');

const pos = html.indexOf('data-pack="21 in"');
if (pos !== -1) {
  const start = html.lastIndexOf('<div', pos);
  const end = html.indexOf('</form>', pos);
  console.log('Tier block excerpt:\n', html.substring(start - 200, end));
}
