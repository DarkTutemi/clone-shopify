import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

const query = 'Mini • 8 Tones';
let idx = 0;
while (true) {
  const found = html.indexOf(query, idx);
  if (found === -1) break;
  console.log(`Found "${query}" at ${found}`);
  const snippet = html.slice(found - 100, found + 1500).replace(/<[^>]+>/g, '\n').split('\n').map(l => l.trim()).filter(l => l.length > 0);
  console.log('Snippet:\n', snippet.slice(0, 30));
  idx = found + query.length;
}
