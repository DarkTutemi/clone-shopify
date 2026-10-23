async function inspectFullPdp() {
  const res = await fetch('https://trybronoir.com/products/bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking');
  const html = await res.text();
  
  // Extract all sections in main container
  const mainMatch = html.match(/<div class="icartShopifyCartContent">([\s\S]*?)<\/div>\s*<style>\.icartShopifyCartContent/i);
  if (!mainMatch) {
    console.log('No icartShopifyCartContent match');
    return;
  }
  
  const mainContent = mainMatch[1];
  const sectionIds = Array.from(mainContent.matchAll(/id="(shopify-section-[^"]+)"/g)).map(m => m[1]);
  console.log('Main content sections:', sectionIds);

  // Look for text_with_icons
  // Look for custom_info_block
  // Look for slideshow
  // Look for video_review
  // Look for faq
  // Look for logo_list
}

inspectFullPdp().catch(console.error);
