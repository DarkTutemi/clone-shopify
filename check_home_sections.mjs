async function checkHomeSections() {
  const res = await fetch('https://navage.com/');
  const html = await res.text();
  const sections = [...html.matchAll(/id=["']shopify-section-([^"']+)["']/g)].map(m => m[1]);
  console.log('Homepage Sections:');
  console.log(sections);
}

checkHomeSections().catch(console.error);
