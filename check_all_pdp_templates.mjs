async function checkProducts() {
  const products = [
    'bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort',
    'bronoir%E2%84%A2-limited-barefoot-shoes',
    'bronoir%E2%84%A2-force-barefoot-shoes',
    'bronoir%E2%84%A2-vista-barefoot-shoes',
    'hikers',
    'bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking',
    'bronoir%E2%84%A2-skin-pro-with-copper-grounding-allround-barefoot-shoes',
    'bronoir-ayelith-lightweight-arch-supportive-walking-sandals'
  ];

  for (const handle of products) {
    const res = await fetch(`https://trybronoir.com/products/${handle}`);
    const html = await res.text();
    const hasCustomInfo = html.includes('custom_info_block');
    const hasProductContent = html.includes('product-content');
    const hasDescription = html.includes('product.description') || html.includes('product-tabs__tab-item-content');
    
    // Check what section IDs exist
    const templateSections = [...html.matchAll(/id="shopify-section-(template--[^"]+)"/g)].map(m => m[1]);
    console.log(`\n--- ${handle} ---`);
    console.log('hasCustomInfo:', hasCustomInfo, '| hasProductContent:', hasProductContent, '| hasDescription:', hasDescription);
    console.log('Sections:', templateSections);
  }
}

checkProducts();
