import fs from 'fs';

const prods = JSON.parse(fs.readFileSync('scripts/raw_catalog_products.json', 'utf8'));
const lines = prods.map((p, idx) => {
  const cleanDesc = (p.descriptionHtml || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
  return `${idx + 1}. [${p.status}] ID:${p.id.replace('gid://shopify/Product/', '')} | Title: ${p.title} | Handle: ${p.handle} | Type: ${p.productType || 'N/A'} | Desc: ${cleanDesc}`;
});

fs.writeFileSync('scripts/catalog_raw_list.txt', lines.join('\n'), 'utf8');
console.log('Saved 83 products to scripts/catalog_raw_list.txt');
