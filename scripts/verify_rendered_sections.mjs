import fs from 'fs';

async function checkProductHtml(handle) {
  const url = `https://tryzavelyn.com/products/${encodeURIComponent(handle)}?preview_theme_id=187597717689`;
  const res = await fetch(url);
  const html = await res.text();

  console.log(`\n======================================================`);
  console.log(`Product: ${handle}`);
  console.log(`Status: ${res.status}`);
  console.log(`zv-value-prop:`, html.includes('zv-value-prop'));
  console.log(`zv-features:`, html.includes('zv-features'));
  console.log(`zv-storytelling:`, html.includes('zv-storytelling'));
  console.log(`zv-how-it-works:`, html.includes('zv-how-it-works'));
  console.log(`zv-specs:`, html.includes('zv-specs'));
  console.log(`zv-comparison:`, html.includes('zv-comparison'));
  console.log(`zv-included:`, html.includes('zv-included'));
  console.log(`zv-extended-faq:`, html.includes('zv-extended-faq'));
}

async function main() {
  await checkProductHtml('sakerplus®-universal-diesel-injector-removal-kit-clearance-sale');
  await checkProductHtml('zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves');
  await checkProductHtml('zavelyn-5-in-1-rotary-cheese-grater-shredder');
}

main().catch(console.error);
