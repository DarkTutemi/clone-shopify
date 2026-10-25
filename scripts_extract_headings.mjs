import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

const headerEnd = html.indexOf('class="shopify-section shopify-section--header"');
const footerStart = html.indexOf('class="shopify-section shopify-section--footer"');

console.log('Header End:', headerEnd, 'Footer Start:', footerStart);

const pageBody = html.slice(headerEnd, footerStart);

// Let's search for top-level divs or elements with class or id in pageBody
// Let's find headings like <h1>, <h2>, <h3>
const headingRegex = /<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi;
let hm;
console.log('\n--- Headings in Page Body ---');
while ((hm = headingRegex.exec(pageBody)) !== null) {
  const clean = hm[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`${hm[1].toUpperCase()}: ${clean}`);
}
