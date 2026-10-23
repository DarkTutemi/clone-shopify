// print_all_store_products.mjs
import fs from 'fs';

const storeProducts = JSON.parse(fs.readFileSync('all_store_products.json', 'utf8'));
storeProducts.forEach((p, idx) => {
  console.log(`${idx + 1}. [${p.handle}] -> ${p.title} (${p.id})`);
});
