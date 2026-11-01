import fs from 'fs';

const products = JSON.parse(fs.readFileSync('scripts/active_products_list.json', 'utf8'));

console.log(`Total active products: ${products.length}`);

// Group by template_suffix
const templates = {};
let outOfStockVariants = [];

for (const p of products) {
  const tpl = p.template_suffix || 'default (product)';
  templates[tpl] = (templates[tpl] || 0) + 1;

  for (const v of p.variants) {
    if (v.inventory_management && v.inventory_policy === 'deny' && v.inventory_quantity <= 0) {
      outOfStockVariants.push({
        productTitle: p.title,
        handle: p.handle,
        variantId: v.id,
        variantTitle: v.title,
        qty: v.inventory_quantity
      });
    }
  }
}

console.log('\nTemplate suffix breakdown:');
console.table(templates);

console.log(`\nVariants out of stock (policy=deny, qty<=0): ${outOfStockVariants.length}`);
if (outOfStockVariants.length > 0) {
  console.log(JSON.stringify(outOfStockVariants, null, 2));
}
