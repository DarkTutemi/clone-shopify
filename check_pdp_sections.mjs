async function checkProductSections() {
  const res = await fetch('https://navage.com/products/navage-advanced-nose-cleaner');
  const html = await res.text();
  const sections = [...html.matchAll(/id=["']shopify-section-([^"']+)["']/g)].map(m => m[1]);
  console.log('Sections on Advanced Nose Cleaner PDP:');
  console.log(sections);
}

checkProductSections().catch(console.error);
