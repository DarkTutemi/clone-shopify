import fs from 'fs';

const html = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');

// Check before <main>
const beforeMain = html.slice(0, html.indexOf('<main'));
console.log('Before main length:', beforeMain.length);

// Check sticky ATC or floating elements
const stickyMatch = html.match(/<[^>]+class="[^"]*sticky[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi) || [];
console.log('Sticky matches count:', stickyMatch.length);
stickyMatch.forEach((s, idx) => console.log(`Sticky [${idx+1}] preview:`, s.slice(0, 200)));

// Check after </main>
const afterMain = html.slice(html.indexOf('</main>'));
console.log('\nAfter main length:', afterMain.length);

// Look for sections after main
const afterSections = afterMain.match(/<div id="shopify-section-[^"]+"[^>]*>/g) || [];
console.log('After main sections:', afterSections);

// Look for sticky ATC in afterMain
const stickyInAfter = afterMain.match(/sticky-atc|quick-add|cart-drawer/gi) || [];
console.log('Sticky/cart keywords in after main:', stickyInAfter);
