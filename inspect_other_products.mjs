async function inspectOtherProducts() {
  const urls = [
    'https://trybronoir.com/products/bronoir%E2%84%A2-skin-pro-with-copper-grounding-allround-barefoot-shoes-kopie',
    'https://trybronoir.com/products/bronoir-cosycloud-boot-warm-comfy-winter-barefoot-boot-bogo',
    'https://trybronoir.com/products/hikers-bogo',
    'https://trybronoir.com/products/bronoir%E2%84%A2-flex-barefoot-shoes-1-1-free',
    'https://trybronoir.com/products/bronoir%E2%84%A2-lift'
  ];

  for (const url of urls) {
    const res = await fetch(url);
    const html = await res.text();
    const handle = url.split('/products/')[1];
    
    // Find section IDs
    const sectionIds = Array.from(html.matchAll(/id="shopify-section-(template--[^"]+)"/g)).map(m => m[1]);
    console.log(`\n=== ${handle} ===`);
    console.log('Sections:', sectionIds);
  }
}

inspectOtherProducts().catch(console.error);
