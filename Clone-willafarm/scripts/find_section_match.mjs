import fs from 'fs';

const html = fs.readFileSync('Clone-willafarm/data/willafarm_pdp_mobile.html', 'utf8');

const idx = html.indexOf('template--19209843408957__fn_ingredients');
console.log('Index of fn_ingredients:', idx);
if (idx !== -1) {
  console.log(html.slice(idx - 50, idx + 400));
}

const compIdx = html.indexOf('template--19209843408957__fn_comparison');
console.log('Index of fn_comparison:', compIdx);
if (compIdx !== -1) {
  console.log(html.slice(compIdx - 50, compIdx + 400));
}
