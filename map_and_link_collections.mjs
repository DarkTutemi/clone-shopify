// map_and_link_collections.mjs
import fs from 'fs';

const storeProducts = JSON.parse(fs.readFileSync('all_store_products.json', 'utf8'));
const tryData = JSON.parse(fs.readFileSync('trybronoir_collections_extracted.json', 'utf8'));

// Helper to normalize strings for fuzzy matching
function norm(str) {
  return str.toLowerCase()
    .replace(/bronoir/g, '')
    .replace(/barefoot/g, '')
    .replace(/shoes/g, '')
    .replace(/boots/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findBestMatch(tryItem, storeProducts) {
  // 1. Exact handle match
  let p = storeProducts.find(sp => sp.handle === tryItem.handle);
  if (p) return { product: p, method: 'exact_handle' };

  // 2. Normalized title match
  const nTry = norm(tryItem.title);
  p = storeProducts.find(sp => norm(sp.title) === nTry);
  if (p) return { product: p, method: 'norm_title' };

  // 3. Keyword / partial handle match
  const handleKey = tryItem.handle.split('-').filter(w => w.length > 3 && !['bronoir', 'shoes', 'barefoot', 'winter', 'boots', 'free'].includes(w));
  if (handleKey.length > 0) {
    p = storeProducts.find(sp => handleKey.every(k => sp.handle.includes(k) || sp.title.toLowerCase().includes(k)));
    if (p) return { product: p, method: 'keyword_handle' };
  }

  // 4. Score by common words
  let bestScore = 0;
  let bestProd = null;
  const tryWords = nTry.split(' ').filter(w => w.length > 2);
  for (const sp of storeProducts) {
    const spWords = norm(sp.title).split(' ').filter(w => w.length > 2);
    let common = 0;
    for (const tw of tryWords) {
      if (spWords.includes(tw)) common++;
    }
    if (common > bestScore) {
      bestScore = common;
      bestProd = sp;
    }
  }

  if (bestScore >= 2 && bestProd) {
    return { product: bestProd, method: 'word_overlap_' + bestScore };
  }

  return null;
}

const mappingResults = {};

for (const [colName, items] of Object.entries(tryData)) {
  console.log(`\n=================== Mapping: ${colName} (${items.length} items) ===================`);
  const matchedList = [];
  const unmatchedList = [];

  for (const item of items) {
    const match = findBestMatch(item, storeProducts);
    if (match) {
      matchedList.push({
        tryHandle: item.handle,
        tryTitle: item.title,
        storeId: match.product.id,
        storeHandle: match.product.handle,
        storeTitle: match.product.title,
        method: match.method
      });
    } else {
      unmatchedList.push(item);
    }
  }

  // Deduplicate product IDs to keep unique store products
  const uniqueStoreIds = [...new Set(matchedList.map(m => m.storeId))];
  console.log(`Matched ${matchedList.length} items -> ${uniqueStoreIds.length} unique store products.`);
  if (unmatchedList.length > 0) {
    console.log(`Unmatched (${unmatchedList.length}):`);
    unmatchedList.forEach(u => console.log(`  - [${u.handle}] "${u.title}"`));
  }
  mappingResults[colName] = {
    matchedList,
    uniqueStoreIds,
    unmatchedList
  };
}

fs.writeFileSync('collections_mapping_result.json', JSON.stringify(mappingResults, null, 2));
