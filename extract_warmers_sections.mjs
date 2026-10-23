import fs from 'fs';

async function extractSectionHtml() {
  const res = await fetch('https://trybronoir.com/products/bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking');
  const html = await res.text();

  const sectionsToExtract = [
    'shopify-section-template--27860727070820__text_with_icons_i8AehM',
    'shopify-section-template--27860727070820__logo_list_QMc44x',
    'shopify-section-template--27860727070820__custom_info_block_cJKcnQ',
    'shopify-section-template--27860727070820__video_review_Mg4ttx',
    'shopify-section-template--27860727070820__faq_GyjhfF',
    'shopify-section-template--27860727070820__slideshow_4XippD',
    'shopify-section-template--27860727070820__custom_liquid_EcpyDi',
    'shopify-section-template--27860727070820__loox-product-reviews-app-section'
  ];

  for (const id of sectionsToExtract) {
    const startIdx = html.indexOf(`id="${id}"`);
    if (startIdx === -1) {
      console.log('Not found:', id);
      continue;
    }
    // Find opening <div or <section
    const tagStart = html.lastIndexOf('<', startIdx);
    // Find next section id
    let nextIdx = html.length;
    for (const nextId of sectionsToExtract) {
      if (nextId === id) continue;
      const idx = html.indexOf(`id="${nextId}"`, startIdx + id.length);
      if (idx !== -1 && idx < nextIdx) {
        nextIdx = idx;
      }
    }
    const endIdx = nextIdx === html.length ? html.indexOf('id="shopify-section-footer"', startIdx) : html.lastIndexOf('<', nextIdx);
    const content = html.slice(tagStart, endIdx);
    fs.writeFileSync(`section_${id.replace(/[^a-zA-Z0-9_-]/g, '_')}.html`, content);
    console.log(`Saved ${id} (${content.length} bytes)`);
  }
}

extractSectionHtml().catch(console.error);
