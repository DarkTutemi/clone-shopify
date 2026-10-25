import fs from 'fs';

const html = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');

console.log('Includes "Promo Clean":', html.includes('Promo Clean'));
console.log('Includes "Attachment Nozzles":', html.includes('Attachment Nozzles'));
console.log('Includes "CLAIM YOURS NOW":', html.includes('CLAIM YOURS NOW'));
console.log('Includes "Keith and 1,243":', html.includes('Keith and 1,243'));
console.log('Includes "40%OFF":', html.includes('40%OFF') || html.includes('40% OFF'));

// Search for where "CLAIM YOURS NOW" appears if any
const idx = html.indexOf('CLAIM YOURS NOW');
if (idx !== -1) {
  console.log('Context around CLAIM YOURS NOW:\n', html.slice(idx - 200, idx + 200));
}
