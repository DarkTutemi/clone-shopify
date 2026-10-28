import fs from 'fs';

async function main() {
  const res = await fetch('https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil');
  const html = await res.text();
  console.log('Live page status:', res.status, 'HTML length:', html.length);
  fs.writeFileSync('scripts/live_botana_scraped.html', html, 'utf8');

  // Find all sections in main content
  const sections = [...html.matchAll(/class="shopify-section[^"]*"\s*id="([^"]+)"/g)].map(m => m[1]);
  console.log('Shopify sections in live page:', sections);
}

main().catch(console.error);
