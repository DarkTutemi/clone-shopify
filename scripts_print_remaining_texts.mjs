import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/page_main_slice.html', 'utf8');

const textNodes = [];
const textRegex = />([^<]{20,})</g;
let m;
while ((m = textRegex.exec(html)) !== null) {
  const trimmed = m[1].replace(/\s+/g, ' ').trim();
  if (trimmed.length > 20 && !trimmed.includes('{') && !trimmed.includes('function') && !trimmed.includes('var ')) {
    textNodes.push(trimmed);
  }
}

textNodes.slice(40).forEach((t, i) => console.log(`${i+41}: ${t}`));
