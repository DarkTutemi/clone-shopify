import fs from 'fs';

const html = fs.readFileSync('Clone-yeoman/data/product_main_section.html', 'utf8');

const lastScript = html.lastIndexOf('<script');
if (lastScript !== -1) {
  console.log('Script lines 4000 to end:\n', html.substring(lastScript + 4000));
}
