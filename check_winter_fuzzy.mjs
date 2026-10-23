// check_winter_fuzzy.mjs
import fs from 'fs';

const storeProducts = JSON.parse(fs.readFileSync('all_store_products.json', 'utf8'));
const tryData = JSON.parse(fs.readFileSync('trybronoir_collections_extracted.json', 'utf8'));

const winterItems = tryData['winter-collection'];
console.log(`Trybronoir winter items count: ${winterItems.length}`);

for (const item of winterItems) {
  // Find in store
  const itemClean = item.handle.toLowerCase().replace(/[^a-z0-9]/g, '');
  const match = storeProducts.find(sp => {
    const spClean = sp.handle.toLowerCase().replace(/[^a-z0-9]/g, '');
    return itemClean === spClean || itemClean.includes(spClean) || spClean.includes(itemClean);
  });

  if (match) {
    console.log(`MATCH: [${item.handle}] => [${match.handle}] ("${match.title}")`);
  } else {
    // Try matching by first 2 distinctive words
    const words = item.title.toLowerCase().replace('bronoir', '').replace(/[^a-z0-9]/g, ' ').trim().split(/\s+/).filter(w => w.length > 3);
    const wordMatch = storeProducts.find(sp => {
      const spTitle = sp.title.toLowerCase();
      return words.length > 0 && words.filter(w => spTitle.includes(w)).length >= 2;
    });
    if (wordMatch) {
      console.log(`WORD MATCH: [${item.handle}] "${item.title}" => [${wordMatch.handle}] "${wordMatch.title}"`);
    } else {
      console.log(`MISSING: [${item.handle}] "${item.title}"`);
    }
  }
}
