import fs from 'fs';

const catalog = JSON.parse(fs.readFileSync('Clone-sakerplus/data/catalog_harvested.json', 'utf8'));
const collections = JSON.parse(fs.readFileSync('Clone-sakerplus/data/collections_harvested.json', 'utf8'));

// Find best-sellers collection
const bestSellersColl = collections.find(c => c.handle === 'best-sellers') || collections.find(c => c.handle === 'all-products');
const bestSellerHandles = new Set(bestSellersColl ? bestSellersColl.productHandles : []);

// Ensure the priority product is ALWAYS included at position 0!
const PRIORITY_HANDLE = 'sakerplus-fence-post-repair-kit';

const top50 = [];
const priorityProd = catalog.find(p => p.handle === PRIORITY_HANDLE);
if (priorityProd) {
  top50.push(priorityProd);
}

// Add bestsellers
for (const p of catalog) {
  if (top50.length >= 50) break;
  if (p.handle === PRIORITY_HANDLE) continue;
  if (bestSellerHandles.has(p.handle)) {
    top50.push(p);
  }
}

// If less than 50, fill from catalog
for (const p of catalog) {
  if (top50.length >= 50) break;
  if (!top50.some(x => x.handle === p.handle)) {
    top50.push(p);
  }
}

console.log(`Selected ${top50.length} products for seeding.`);
console.log('Position 1:', top50[0].title, `(${top50[0].handle})`);
console.log('Sample handles in seed list:', top50.slice(0, 10).map(p => p.handle));

fs.writeFileSync('Clone-sakerplus/data/seed_50_products.json', JSON.stringify(top50, null, 2));
console.log('Saved to Clone-sakerplus/data/seed_50_products.json');
