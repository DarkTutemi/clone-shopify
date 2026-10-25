import fs from 'fs';

const html = fs.readFileSync('Clone-thoson/data/product.html', 'utf8');

const sIdx = html.indexOf('template--32757201404241__main');
const nextIdx = html.indexOf('template--32757201404241__horizontal_ticker_KLdqwG');
const mainChunk = html.slice(sIdx, nextIdx);

console.log('Main section chunk length:', mainChunk.length);

// Search for variant terms: Rookie, PRO, Master
['Rookie', 'PRO', 'Master', '52382835933521', '52382835966289', '52382836031825'].forEach(term => {
  const count = (mainChunk.match(new RegExp(term, 'gi')) || []).length;
  console.log(`Term "${term}": ${count} occurrences`);
});

// Extract where Rookie appears
const rIdx = mainChunk.indexOf('Rookie');
if (rIdx !== -1) {
  console.log('\nContext around Rookie:\n', mainChunk.slice(rIdx - 200, rIdx + 600));
}
