// match_collections_products.mjs
import fs from 'fs';

const storeProducts = JSON.parse(fs.readFileSync('all_store_products.json', 'utf8'));
const collectionsData = JSON.parse(fs.readFileSync('collections_inspection_result.json', 'utf8'));

console.log(`Store has ${storeProducts.length} products.`);

// Create lookup maps
const byHandle = new Map();
const byCleanTitle = new Map();

function cleanStr(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

for (const p of storeProducts) {
  byHandle.set(p.handle, p);
  byCleanTitle.set(cleanStr(p.title), p);
}

for (const [colHandle, col] of Object.entries(collectionsData)) {
  console.log(`\n=================== Collection: ${colHandle} ===================`);
  console.log(`Trybronoir has ${col.handles.length} products listed.`);
  
  const matched = [];
  const unmatched = [];

  for (const h of col.handles) {
    let match = byHandle.get(h);
    if (!match) {
      // Try partial match on handle or matching key words
      for (const sp of storeProducts) {
        const cleanSp = cleanStr(sp.handle);
        const cleanH = cleanStr(h);
        if (cleanSp === cleanH || cleanSp.includes(cleanH) || cleanH.includes(cleanSp)) {
          match = sp;
          break;
        }
      }
    }
    if (match) {
      matched.push({ tryHandle: h, storeId: match.id, storeTitle: match.title, storeHandle: match.handle });
    } else {
      unmatched.push(h);
    }
  }

  // Deduplicate matched by storeId
  const uniqueMatched = [];
  const seenIds = new Set();
  for (const m of matched) {
    if (!seenIds.has(m.storeId)) {
      seenIds.add(m.storeId);
      uniqueMatched.push(m);
    }
  }

  console.log(`✔ Matched ${uniqueMatched.length} unique products out of ${col.handles.length}`);
  if (unmatched.length > 0) {
    console.log(`Unmatched handles (${unmatched.length}):`, unmatched.slice(0, 5));
  }
}
