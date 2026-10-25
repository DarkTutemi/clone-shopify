import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

const buyerSlice = html.slice(1835000, 1870000);
const cleanText = buyerSlice.replace(/<[^>]+>/g, '\n')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0 && !l.includes('{') && !l.includes('var '));

fs.writeFileSync('Clone-pandadrum/buyer_guide_clean.txt', cleanText.join('\n'), 'utf8');
console.log('Clean lines:', cleanText.length);
console.log(cleanText.slice(0, 100).join('\n'));
