import fs from 'fs';

async function findWhere() {
  const url = 'https://trybronoir.com/products/bronoir%E2%84%A2-vista-barefoot-shoes';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();

  // Find all matches of judgeme or review
  let idx = 0;
  while ((idx = html.indexOf('judge', idx)) !== -1) {
    console.log('Snippet around judge:');
    console.log(html.slice(Math.max(0, idx - 50), idx + 150));
    console.log('---');
    idx += 100;
  }
}

findWhere();
