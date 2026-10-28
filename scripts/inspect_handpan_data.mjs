import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/handpan_assets_inspected.json', 'utf8'));

console.log('=== COLLECTION PRODUCTS ===');
console.log(data.collection_products);

console.log('\n=== TEMPLATES/COLLECTION.ZAVELYN-HANDPANS.JSON ===');
const colTpl = JSON.parse(data['templates/collection.zavelyn-handpans.json']);
console.log('Order:', colTpl.order);
console.log('Sections summary:', Object.entries(colTpl.sections).map(([k, v]) => ({ id: k, type: v.type })));

console.log('\n=== TEMPLATES/PRODUCT.ZAVELYN-HANDPAN-MASTER.JSON ===');
const masterTpl = JSON.parse(data['templates/product.zavelyn-handpan-master.json']);
console.log('Order:', masterTpl.order);
console.log('Sections summary:', Object.entries(masterTpl.sections).map(([k, v]) => ({ id: k, type: v.type })));

console.log('\n=== TEMPLATES/PRODUCT.ZAVELYN-DRUM-PRO.JSON ===');
const proTpl = JSON.parse(data['templates/product.zavelyn-drum-pro.json']);
console.log('Order:', proTpl.order);
console.log('Sections summary:', Object.entries(proTpl.sections).map(([k, v]) => ({ id: k, type: v.type })));

// Let's check sections/zavelyn-handpans-collection.liquid preview
const zhc = data['sections/zavelyn-handpans-collection.liquid'];
console.log('\n=== SECTIONS/ZAVELYN-HANDPANS-COLLECTION.LIQUID PREVIEW ===');
console.log(zhc.slice(0, 1000));
