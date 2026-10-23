async function inspectSections() {
  const res = await fetch('https://trybronoir.com/products/bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking');
  const html = await res.text();
  
  const sectionIds = [
    'shopify-section-template--27860727070820__main',
    'shopify-section-template--27860727070820__text_with_icons_i8AehM',
    'shopify-section-template--27860727070820__logo_list_QMc44x',
    'shopify-section-template--27860727070820__custom_info_block_cJKcnQ',
    'shopify-section-template--27860727070820__video_review_Mg4ttx',
    'shopify-section-template--27860727070820__faq_GyjhfF',
    'shopify-section-template--27860727070820__slideshow_4XippD',
    'shopify-section-template--27860727070820__custom_liquid_EcpyDi',
    'shopify-section-template--27860727070820__loox-product-reviews-app-section'
  ];

  for (const sId of sectionIds) {
    const startTag = `id="${sId}"`;
    const startIdx = html.indexOf(startTag);
    if (startIdx !== -1) {
      const sectionHtml = html.slice(startIdx, startIdx + 1500);
      console.log(`\n================== ${sId} ==================`);
      console.log(sectionHtml.slice(0, 500).replace(/\s+/g, ' '));
    }
  }
}

inspectSections().catch(console.error);
