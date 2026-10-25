import fs from 'fs';

const html = fs.readFileSync('Clone-willafarm/data/willafarm_pdp_mobile.html', 'utf8');

function extractSection(id) {
  const match = html.match(new RegExp(`<div[^>]+id=['"]shopify-section-${id}['"][^>]*>([\\s\\S]*?)<\\/div>\\s*(?=<div[^>]+id=['"]shopify-section-|$)`, 'i'));
  if (match) {
    console.log(`Found ${id}, length: ${match[1].length}`);
    return match[1];
  } else {
    console.log(`Not found: ${id}`);
    return '';
  }
}

const ing = extractSection('template--19209843408957__fn_ingredients');
if (ing) fs.writeFileSync('Clone-willafarm/data/willa_fn_ingredients.html', ing.slice(0, 5000));

const edu = extractSection('template--19209843408957__fn_education_1');
if (edu) fs.writeFileSync('Clone-willafarm/data/willa_fn_education.html', edu.slice(0, 5000));

const comp = extractSection('template--19209843408957__fn_comparison');
if (comp) fs.writeFileSync('Clone-willafarm/data/willa_fn_comparison.html', comp.slice(0, 5000));

const prod = extractSection('template--19209843408957__product');
if (prod) fs.writeFileSync('Clone-willafarm/data/willa_product_box.html', prod.slice(0, 5000));

console.log('Done extracting samples');
