import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/handpan_assets_inspected.json', 'utf8'));

const drumTemplates = [
  'templates/product.zavelyn-handpan-master.json',
  'templates/product.zavelyn-drum-pro.json',
  'templates/product.zavelyn-drum-plus.json',
  'templates/product.zavelyn-drum-mini.json',
  'templates/product.zavelyn-rain-drum.json'
];

for (const t of drumTemplates) {
  const content = JSON.parse(data[t]);
  console.log(`\n=== ${t} ===`);
  console.log('Order:', content.order);
  console.log('Sections:', Object.entries(content.sections).map(([k, v]) => `${k} (${v.type})`));
}
