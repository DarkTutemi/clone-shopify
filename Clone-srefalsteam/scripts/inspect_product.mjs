import fs from 'fs';

const raw = fs.readFileSync('Clone-srefalsteam/data/product.json', 'utf8');
const p = JSON.parse(raw).product;

console.log('=== PRODUCT SUMMARY ===');
console.log('Title:', p.title);
console.log('Handle:', p.handle);
console.log('Vendor:', p.vendor);
console.log('Product Type:', p.product_type);
console.log('Tags:', p.tags);
console.log('Variants:');
p.variants.forEach(v => {
  console.log(`  - ID: ${v.id} | Title: ${v.title} | Price: ${v.price} | CompareAt: ${v.compare_at_price} | SKU: ${v.sku}`);
});

console.log(`Total Images: ${p.images.length}`);
p.images.forEach((img, i) => {
  console.log(`  [${i+1}] ${img.src}`);
});

console.log('Body HTML length:', p.body_html ? p.body_html.length : 0);
if (p.body_html) {
  console.log('Body HTML snippet:\n', p.body_html.slice(0, 500));
}
