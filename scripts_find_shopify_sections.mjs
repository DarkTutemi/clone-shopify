import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

// Find where main content begins
const mainIdx = html.indexOf('<main') !== -1 ? html.indexOf('<main') : html.indexOf('id="content"');
console.log('main index:', mainIdx);

// Look for id or class patterns like shopify-section
const sectionRegex = /id="shopify-section-([^"]+)"[^>]*class="([^"]+)"/gi;
let match;
while ((match = sectionRegex.exec(html)) !== null) {
  console.log(`Section ID: ${match[1]}, Class: ${match[2]}`);
}
