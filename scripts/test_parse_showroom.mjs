async function test() {
  const res = await fetch('https://tryzavelyn.com/collections/all-products?view=showroom&preview_theme_id=187926020281');
  const html = await res.text();
  console.log('HTML size:', html.length);
  
  const idx = html.indexOf('data-product-json=');
  console.log('Index of data-product-json:', idx);
  if (idx !== -1) {
    const chunk = html.substring(idx, idx + 200);
    console.log('Chunk:', chunk);
  } else {
    console.log('data-product-json not found! Let us check what sections were rendered:');
    const sections = html.match(/id=\"[^\"]+\"/g) || [];
    console.log('Found IDs:', sections.slice(0, 20));
  }
}

test().catch(console.error);
