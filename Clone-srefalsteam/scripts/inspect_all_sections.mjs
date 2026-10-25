import fs from 'fs';

const html = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');

// Find where main section starts and ends, or inspect each section
const sectionRegex = /<div id="shopify-section-([^"]+)" class="shopify-section([^"]*)">([\s\S]*?)(?=<div id="shopify-section-|<\/main>|<footer|$)/g;

let match;
let count = 0;
while ((match = sectionRegex.exec(html)) !== null) {
  count++;
  const sectionId = match[1];
  const sectionClass = match[2];
  const content = match[3];
  console.log(`\n=== Section [${count}] ${sectionId} ===`);
  console.log(`Classes: ${sectionClass}`);
  console.log(`Length: ${content.length}`);
  // Extract headings or snippet
  const headings = content.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi) || [];
  console.log('Headings:', headings.map(h => h.replace(/<[^>]+>/g, '').trim()));
}
