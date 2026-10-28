import fs from 'fs';

async function main() {
  const res = await fetch('https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil');
  const text = await res.text();
  console.log('Status:', res.status, 'Length:', text.length);

  // Check template
  const tmplMatch = text.match(/template-product[^\s"']*/);
  console.log('Template match:', tmplMatch ? tmplMatch[0] : 'None');

  // Check section rendering
  const sections = text.match(/id="shopify-section-[^"]+"/g);
  console.log('Sections found:', sections ? sections.slice(0, 10) : 'None');

  // Find where bundle or variant selector is
  const bundleIdx = text.indexOf('Buy 1');
  if (bundleIdx !== -1) {
    console.log('Snippet around "Buy 1":\n', text.substring(Math.max(0, bundleIdx - 200), Math.min(text.length, bundleIdx + 400)));
  }

  // Look for product json
  const jsonMatch = text.match(/<script type="application\/json" id="ProductJson-[^>]+>([\s\S]*?)<\/script>/);
  if (jsonMatch) {
    console.log('ProductJson found, length:', jsonMatch[1].length);
  }

  fs.writeFileSync('scripts/live_botanaroots_pdp_snippet.html', text.substring(Math.max(0, bundleIdx - 1000), Math.min(text.length, bundleIdx + 3000)));
  console.log('Wrote snippet to scripts/live_botanaroots_pdp_snippet.html');
}

main().catch(console.error);
