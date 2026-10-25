import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

const heroSlice = html.slice(1600000, 1780000);
const cleanText = heroSlice.replace(/<[^>]+>/g, '\n')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0 && !l.includes('{') && !l.includes('var '));

fs.writeFileSync('Clone-pandadrum/hero_and_tabs_clean.txt', cleanText.join('\n'), 'utf8');
console.log('Clean lines in hero and tabs:', cleanText.length);
console.log(cleanText.slice(0, 120).join('\n'));
