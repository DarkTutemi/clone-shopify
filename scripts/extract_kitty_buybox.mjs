import fs from 'fs';

const html = fs.readFileSync('kitty_pdp_full.html', 'utf-8');

// Find shop_product_details section
const start = html.indexOf('shopify-section-template--21121800667180__shop_product_details_JbqzwH');
if (start !== -1) {
  const snippet = html.substring(start - 50, start + 8000);
  fs.writeFileSync('scripts/kitty_buybox_sample.html', snippet, 'utf-8');
  console.log('Saved kitty_buybox_sample.html');
} else {
  console.log('Not found');
}
