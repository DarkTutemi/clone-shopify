import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

const compIdx = html.indexOf('Which instrument should you choose?');
console.log('compIdx:', compIdx);

if (compIdx !== -1) {
  const tableChunk = html.slice(compIdx - 200, compIdx + 6000);
  fs.writeFileSync('Clone-pandadrum/comparison_table_raw.html', tableChunk, 'utf8');
  console.log('Saved comparison_table_raw.html');
  
  // Find all text inside this chunk
  const lines = tableChunk.split('\n').filter(l => l.trim().length > 0);
  console.log('Total lines:', lines.length);
}
