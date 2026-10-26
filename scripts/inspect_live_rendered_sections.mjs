import fs from 'fs';

async function inspectLiveHtml() {
  const res = await fetch('https://tryzavelyn.com/products/sakerplus%C2%AE-universal-diesel-injector-removal-kit-clearance-sale?preview_theme_id=187597717689');
  const html = await res.text();
  // Find all shopify-section occurrences
  const sections = [...html.matchAll(/id=["']shopify-section-([^"']+)["']/g)].map(m => m[1]);
  console.log('Rendered shopify sections on preview page:\n', sections);
}

inspectLiveHtml().catch(console.error);
