import fs from 'fs';

const drumTemplates = [
  'templates/product.zavelyn-handpan-master.json',
  'templates/product.zavelyn-drum-pro.json',
  'templates/product.zavelyn-drum-plus.json',
  'templates/product.zavelyn-drum-mini.json',
  'templates/product.zavelyn-rain-drum.json'
];

for (const t of drumTemplates) {
  const content = JSON.parse(fs.readFileSync(t, 'utf8'));

  // Delete 'reviews' from sections if present
  if (content.sections.reviews) {
    delete content.sections.reviews;
  }

  // Ensure order matches exactly the remaining sections
  content.order = content.order.filter(id => content.sections[id]);

  fs.writeFileSync(t, JSON.stringify(content, null, 2), 'utf8');
  console.log(`${t}: sections =`, Object.keys(content.sections), 'order =', content.order);
}
