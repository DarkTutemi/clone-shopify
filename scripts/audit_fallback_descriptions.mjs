import fs from 'fs';

const products = JSON.parse(fs.readFileSync('scripts/audit_products_summary.json', 'utf8'));
const configuredHandles = [
  'sakerplus®-universal-diesel-injector-removal-kit-clearance-sale',
  'sakerplus®-battery-powered-automatic-chicken-coop-door',
  'zavelyn-5-in-1-rotary-cheese-grater-shredder',
  'zavelyn-airclear-plugin-negative-ion-air-purifier',
  'zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves'
];

const fallbackProducts = products.filter(p => !p.template_suffix && !configuredHandles.includes(p.handle));

console.log(`Total Fallback Products: ${fallbackProducts.length}`);

const emptyDesc = [];
const shortDesc = []; // < 200 chars
const containsAliExpress = [];
const containsBrokenImgs = [];
const containsForeignBrands = [];

for (const p of fallbackProducts) {
  const html = p.has_body_html ? p.body_html || '' : '';
  if (!p.has_body_html || p.body_html_length === 0) {
    emptyDesc.push({ id: p.id, title: p.title, handle: p.handle });
  } else if (p.body_html_length < 200) {
    shortDesc.push({ id: p.id, title: p.title, handle: p.handle, length: p.body_html_length });
  }
}

console.log(`Empty descriptions: ${emptyDesc.length}`);
console.log(`Short descriptions (<200 chars): ${shortDesc.length}`);

fs.writeFileSync('scripts/audit_fallback_products.json', JSON.stringify({
  totalFallback: fallbackProducts.length,
  emptyDesc,
  shortDesc,
  fallbackProducts: fallbackProducts.map(p => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    body_length: p.body_html_length,
    status: p.status
  }))
}, null, 2));

console.log("Saved audit_fallback_products.json");
