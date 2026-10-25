import fs from 'fs';

const html = fs.readFileSync('Clone-yeoman/data/product_main_section.html', 'utf8');

const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
if (styleMatch) {
  console.log('Style length:', styleMatch[1].length);
  fs.writeFileSync('Clone-yeoman/data/sup_style.css', styleMatch[1]);
  console.log('Saved to sup_style.css');
  
  // Sample rules
  const rules = [...styleMatch[1].matchAll(/(\.[a-zA-Z0-9_\-]+[^{]*\{)/g)].map(m => m[1]);
  console.log('Class selectors sample:', [...new Set(rules)].slice(0, 15));
}
