import fs from 'fs';

const html = fs.readFileSync('kitty_pdp_full.html', 'utf-8');

const start = html.indexOf('<div class="shop-product');
if (start !== -1) {
  const snippet = html.substring(start, start + 25000);
  fs.writeFileSync('scripts/kitty_buybox_markup.html', snippet, 'utf-8');
  console.log('Saved kitty_buybox_markup.html');
}
