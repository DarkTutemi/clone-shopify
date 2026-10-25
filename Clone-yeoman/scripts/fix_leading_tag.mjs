import fs from 'fs';

let liquid = fs.readFileSync('Clone-yeoman/theme/templates/product.yeoman-sweep.liquid', 'utf8');

const needle = 'id="shopify-section-template--27754055925803__main"';
const pos = liquid.indexOf(needle);
console.log('Pos:', pos);
console.log('Snippet before pos:', liquid.substring(pos - 30, pos + 60));

// If before pos it does not have '<div ', fix it!
if (pos !== -1 && !liquid.substring(pos - 10, pos).includes('<div')) {
  liquid = liquid.replace(needle, '<div ' + needle);
  // Also check if closing </div> exists at the end
  fs.writeFileSync('Clone-yeoman/theme/templates/product.yeoman-sweep.liquid', liquid, 'utf8');
  console.log('✔ Fixed leading <div for main section!');
}
