import fs from 'fs';

const drumTemplates = [
  'templates/product.zavelyn-handpan-master.json',
  'templates/product.zavelyn-drum-pro.json',
  'templates/product.zavelyn-drum-plus.json',
  'templates/product.zavelyn-drum-mini.json',
  'templates/product.zavelyn-rain-drum.json'
];

for (const t of drumTemplates) {
  const safeName = t.replace(/[\/\\]/g, '__');
  const path = `backup_handpans_phase/${safeName}`;
  if (!fs.existsSync(path)) continue;

  const data = JSON.parse(fs.readFileSync(path, 'utf8'));

  // Ensure reviews is removed from order if present
  data.order = data.order.filter(id => id !== 'reviews');

  // Ensure main is first and shipping is near bottom
  const newOrder = ['main', 'banner', 'experience', 'included', 'specs', 'shipping', 'faq'].filter(id => data.sections[id]);
  data.order = newOrder;

  // Make sure local templates dir exists
  fs.mkdirSync('templates', { recursive: true });
  fs.writeFileSync(t, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${t}: order =`, data.order);
}
