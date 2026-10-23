async function inspect() {
  const res = await fetch('https://trybronoir.com/products/bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking');
  const html = await res.text();
  
  const tag = 'id="shopify-section-template--27860727070820__text_with_icons_i8AehM"';
  const idx = html.indexOf(tag);
  if (idx !== -1) {
    console.log('=== text_with_icons HTML ===');
    console.log(html.slice(idx, idx + 2000));
  }

  const videoTag = 'id="shopify-section-template--27860727070820__video_review_Mg4ttx"';
  const vIdx = html.indexOf(videoTag);
  if (vIdx !== -1) {
    console.log('\n=== video_review HTML ===');
    console.log(html.slice(vIdx, vIdx + 1500));
  }
}

inspect().catch(console.error);
