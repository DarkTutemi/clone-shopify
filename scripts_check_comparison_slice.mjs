import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

const compSlice = html.slice(1810000, 1836000);
const cleanText = compSlice.replace(/<[^>]+>/g, '\n')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0 && !l.includes('{') && !l.includes('var '));

fs.writeFileSync('Clone-pandadrum/comparison_clean.txt', cleanText.join('\n'), 'utf8');
console.log('Clean lines in comparison slice:', cleanText.length);
console.log(cleanText.join('\n'));
