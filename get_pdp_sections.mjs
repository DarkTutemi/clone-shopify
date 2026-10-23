import fs from 'fs';

const content = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/products_turmeric-glow-soap.html', 'utf8');
const lines = content.split('\n');
const matched = [];
for (const line of lines) {
  if (line.includes('class="shopify-section') || line.includes('shopify-section-template--') || line.includes('data-section-type=')) {
    const m = line.match(/id="([^"]+)"/);
    if (m) matched.push(m[1]);
  }
}
console.log('Unique section IDs on original PDP:');
console.log(Array.from(new Set(matched)));
