import fs from 'fs';

const html = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');
const idx = html.indexOf('"imports":');
if (idx !== -1) {
  const start = html.lastIndexOf('<script', idx);
  const end = html.indexOf('</script>', idx) + 9;
  const chunk = html.slice(start, end);
  fs.writeFileSync('Clone-srefalsteam/data/importmap.html', chunk);
  console.log('Saved importmap.html, length:', chunk.length);
} else {
  console.log('No "imports": found');
}
