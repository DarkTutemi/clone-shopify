import fs from 'fs';

async function extractMainSection() {
  const res = await fetch('https://trybronoir.com/products/bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking');
  const html = await res.text();

  const id = 'shopify-section-template--27860727070820__main';
  const startIdx = html.indexOf(`id="${id}"`);
  if (startIdx === -1) {
    console.log('Not found:', id);
    return;
  }
  const nextIdx = html.indexOf('id="shopify-section-template--27860727070820__text_with_icons_i8AehM"');
  const content = html.slice(html.lastIndexOf('<', startIdx), html.lastIndexOf('<', nextIdx));
  fs.writeFileSync('trybronoir_main_product_section.html', content);
  console.log('Saved main product section:', content.length, 'bytes');
}

extractMainSection().catch(console.error);
