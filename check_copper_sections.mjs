async function extractSections(url) {
  const res = await fetch(url);
  const html = await res.text();
  const sectionIds = [...html.matchAll(/id=\"shopify-section-([^\"]+)\"/g)].map(m => m[1]);
  console.log('--- URL:', url);
  console.log('Sections:', sectionIds);
}

async function run() {
  await extractSections('https://trybronoir.com/products/bronoir%E2%84%A2-skin-pro-with-copper-grounding-allround-barefoot-shoes');
}
run();
