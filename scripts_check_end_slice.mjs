import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

const endSlice = html.slice(1950000, 2135419);
console.log('endSlice length:', endSlice.length);

const textNodes = [];
const textRegex = />([^<]{20,})</g;
let m;
while ((m = textRegex.exec(endSlice)) !== null) {
  const trimmed = m[1].replace(/\s+/g, ' ').trim();
  if (trimmed.length > 20 && !trimmed.includes('{') && !trimmed.includes('function') && !trimmed.includes('var ')) {
    textNodes.push(trimmed);
  }
}

console.log(`Found ${textNodes.length} text nodes in endSlice:`);
textNodes.slice(0, 40).forEach((t, i) => console.log(`${i+1}: ${t}`));
