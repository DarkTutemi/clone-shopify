async function test() {
  const u = 'https://trybronoir.com/products/bronoir-streets-casual-everyday-barefoot-shoes-1-1-free';
  const res = await fetch(u);
  const html = await res.text();
  console.log('HTML length:', html.length);
  
  // Find all sections between main-product and footer
  const sections = [...html.matchAll(/id="shopify-section-([^"]+)"/g)].map(m => m[1]);
  console.log('Sections:', sections);

  // Check if there are headings
  const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  console.log('H2s:', h2s);
}
test();
