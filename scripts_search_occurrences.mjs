import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

// Let's search for keywords case-insensitively
const queries = [
  'calmness',
  'pro',
  'plus',
  'mini',
  'what you\'ll get',
  'radhi',
  'buyer',
  'essential facts',
  'creativity',
  'family',
  'frequently',
  'faq',
  'question',
  'guarantee',
  'shipping'
];

for (const q of queries) {
  let pos = 0;
  const matches = [];
  while (true) {
    const idx = html.toLowerCase().indexOf(q.toLowerCase(), pos);
    if (idx === -1) break;
    matches.push(idx);
    pos = idx + q.length + 500; // jump a bit
    if (matches.length > 5) break;
  }
  console.log(`Query "${q}": count=${matches.length}, firstIdx=${matches[0]}`);
}
