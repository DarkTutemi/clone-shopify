import fs from 'fs';

const hero = fs.readFileSync('Clone-srefalsteam/theme/snippets/srefalsteam-hero.liquid', 'utf8');
const sections = fs.readFileSync('Clone-srefalsteam/theme/snippets/srefalsteam-sections.liquid', 'utf8');

// Find specs
const specIdx = hero.indexOf('Specifications');
if (specIdx !== -1) {
  console.log('--- SPECS SNIPPET ---');
  console.log(hero.slice(specIdx, specIdx + 1200));
}

// Find FAQ items
console.log('--- FAQ SNIPPET ---');
const faqIdx = sections.indexOf('FAQ');
if (faqIdx !== -1) {
  console.log(sections.slice(faqIdx, faqIdx + 3000));
}
