import fs from 'fs';

const products = JSON.parse(fs.readFileSync('scripts/raw_catalog_products.json', 'utf8'));
console.log(`Total Products: ${products.length}\n`);

const list = products.map((p, i) => {
  return {
    index: i + 1,
    id: p.legacyResourceId,
    status: p.status,
    handle: p.handle,
    title: p.title,
    titleLen: p.title.length,
    productType: p.productType || '',
    variants: p.totalVariants,
    seoTitle: p.seo?.title || null,
    seoDesc: p.seo?.description || null
  };
});

console.log(JSON.stringify(list, null, 2));
