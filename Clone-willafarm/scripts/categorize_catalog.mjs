import fs from 'fs';

const audit = JSON.parse(fs.readFileSync('Clone-willafarm/data/zavelyn_catalog_audit.json', 'utf8'));
const active = audit.productInventory.filter(p => p.status === 'active');

console.log(`Analyzing ${active.length} active products...`);

// Group products by functional category
const categories = {
  'Fence & Farm Repair': [],
  'Precision & Power Tools': [],
  'Lawn, Garden & Outdoor': [],
  'Home Improvement & Workshop': [],
  'Health, Wellness & Specialty': []
};

active.forEach(p => {
  const t = (p.title + ' ' + p.product_type + ' ' + p.tags).toLowerCase();
  
  if (t.includes('fence') || t.includes('heating lamp') || t.includes('livestock') || t.includes('tiller')) {
    categories['Fence & Farm Repair'].push(p);
  } else if (t.includes('ultrasonic') || t.includes('laser') || t.includes('crimping') || t.includes('welding') || t.includes('chaser') || t.includes('thermal imaging') || t.includes('wheel alignment')) {
    categories['Precision & Power Tools'].push(p);
  } else if (t.includes('sweeper') || t.includes('sweep') || t.includes('garden') || t.includes('solar') || t.includes('downspout') || t.includes('nut and ball') || t.includes('flashlight')) {
    categories['Lawn, Garden & Outdoor'].push(p);
  } else if (t.includes('steam') || t.includes('vacuum') || t.includes('shelf') || t.includes('liner') || t.includes('spray bottle') || t.includes('pry bar') || t.includes('clock') || t.includes('heat press') || t.includes('hub')) {
    categories['Home Improvement & Workshop'].push(p);
  } else {
    categories['Health, Wellness & Specialty'].push(p);
  }
});

for (const [cat, prods] of Object.entries(categories)) {
  console.log(`\n=== ${cat} (${prods.length} products) ===`);
  prods.forEach(p => console.log(`  - [ID: ${p.id}] ${p.title} ($${p.priceRange.min} - $${p.priceRange.max})`));
}
