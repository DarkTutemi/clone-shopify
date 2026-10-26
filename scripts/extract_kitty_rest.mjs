import fs from 'fs';

const html = fs.readFileSync('kitty_pdp_full.html', 'utf-8');

const start = html.indexOf('custom-text-block-container-custom_text_aKQmkQ');
if (start !== -1) {
  const snippet = html.substring(start, start + 35000);
  fs.writeFileSync('scripts/kitty_buybox_rest.html', snippet, 'utf-8');
  console.log('Saved kitty_buybox_rest.html');
}
