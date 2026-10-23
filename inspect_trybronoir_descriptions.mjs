async function inspectPage(handle) {
  const url = `https://trybronoir.com/products/${handle}`;
  const res = await fetch(url);
  const html = await res.text();
  console.log(`\n=================== ${handle} ===================`);
  
  // Find all section types
  const sections = [...html.matchAll(/id="shopify-section-([^"]+)"/g)].map(m => m[1]);
  console.log('Sections:', sections);

  // Check where description or custom text is rendered
  const hasDesc = html.includes('product-content') || html.includes('product__description');
  console.log('Has product-content or description class:', hasDesc);

  // Check custom info blocks or story blocks
  const infoBlocks = [...html.matchAll(/class="[^"]*custom-info-block[^"]*"/g)];
  console.log('Custom info blocks found:', infoBlocks.length);

  // Check headings
  const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  console.log('H2 headings:', h2s);
}

async function run() {
  await inspectPage('bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort');
  await inspectPage('bronoir%E2%84%A2-limited-barefoot-shoes');
  await inspectPage('bronoir%E2%84%A2-vista-barefoot-shoes');
  await inspectPage('bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking');
}
run();
