import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/pro.html', 'utf8');
const key = 'data-acc-pandadrum-product-49-accordian="true"';
const start = html.indexOf(key);
console.log('Found accordion at:', start);

if (start !== -1) {
  const chunk = html.slice(start - 50, start + 8000);
  fs.writeFileSync('Clone-pandadrum/extracted_buybox_accordions.html', chunk);
  console.log('Saved extracted_buybox_accordions.html');
}
