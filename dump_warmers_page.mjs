async function dump() {
  const res = await fetch('https://trybronoir.com/products/bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking');
  const html = await res.text();
  
  // Find all sections
  const secRegex = /<!-- BEGIN sections: ([^>]+) -->|<section[^>]*id="([^"]+)"/gi;
  const sections = [];
  let m;
  while ((m = secRegex.exec(html)) !== null) {
    sections.push(m[1] || m[2]);
  }
  console.log('Sections found:', sections);

  // Check product template schema / settings
  const jsonMatch = html.match(/<script type="application\/json" id="ModelJson-[^"]+">([\s\S]*?)<\/script>/) ||
                    html.match(/<script type="application\/json" data-product-json>([\s\S]*?)<\/script>/);
  
  // Find section IDs
  const sectionIds = html.match(/id="shopify-section-([^"]+)"/g) || [];
  console.log('Shopify section IDs:\n', sectionIds);
}

dump().catch(console.error);
