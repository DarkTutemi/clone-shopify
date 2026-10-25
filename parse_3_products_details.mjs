import fs from 'fs';

console.log('=== PRODUCT 1: THOSON MAGTRACK ===');
if (fs.existsSync('Clone-thoson/data/product.json')) {
  const p1 = JSON.parse(fs.readFileSync('Clone-thoson/data/product.json', 'utf8'));
  console.log('Title:', p1.title);
  console.log('Variants:', p1.variants?.map(v => ({ title: v.title, price: v.price, compare: v.compare_at_price })));
  console.log('Images count:', p1.images?.length);
  console.log('First 3 images:', p1.images?.slice(0, 3).map(img => img.src || img));
}

console.log('\n=== PRODUCT 2: SREFALSTEAM ===');
if (fs.existsSync('Clone-srefalsteam/data/product.json')) {
  const p2 = JSON.parse(fs.readFileSync('Clone-srefalsteam/data/product.json', 'utf8'));
  console.log('Title:', p2.title);
  console.log('Variants:', p2.variants?.map(v => ({ title: v.title, price: v.price, compare: v.compare_at_price })));
  console.log('Images count:', p2.images?.length);
  console.log('First 3 images:', p2.images?.slice(0, 3).map(img => img.src || img));
}

console.log('\n=== PRODUCT 3: THE YEOMAN SWEEP ===');
if (fs.existsSync('Clone-yeoman/data/the-yeoman-sweep.json')) {
  const p3 = JSON.parse(fs.readFileSync('Clone-yeoman/data/the-yeoman-sweep.json', 'utf8'));
  console.log('Title:', p3.title);
  console.log('Variants:', p3.variants?.map(v => ({ title: v.title, price: v.price, compare: v.compare_at_price })));
  console.log('Images count:', p3.images?.length);
  console.log('First 3 images:', p3.images?.slice(0, 3).map(img => img.src || img));
}
