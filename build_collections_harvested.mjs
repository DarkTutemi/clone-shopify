import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'h:/Shopify-Clone/Clone-earthlyderm/data';
const colData = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'raw_collections.json'), 'utf8'));

const collections = colData.collections.map(c => ({
  id: c.id,
  title: c.title,
  handle: c.handle,
  description: c.description || 'Earthly Derm Handcrafted Skincare Bars',
  products_count: c.products_count,
  has_countdown: false,
  layout_type: 'grid_2_column',
  product_handles: [
    'turmeric-glow-soap',
    'african-black-soap',
    'turmeric-fade-glow-bar'
  ]
}));

fs.writeFileSync(path.join(OUTPUT_DIR, 'collections_harvested.json'), JSON.stringify(collections, null, 2), 'utf8');
console.log('Saved collections_harvested.json:', collections);
