import fs from 'fs';

const html = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');

// Look for bundle container
const bundleMatches = html.match(/<[^>]+class="[^"]*bundle[^"]*"[^>]*>[\s\S]{0,1000}/gi) || [];
console.log('Bundle class matches:', bundleMatches.length);
bundleMatches.slice(0, 5).forEach((b, i) => console.log(`\nMatch [${i+1}]:\n`, b));

// Look for quantity selector or tier options
const tierMatch = html.match(/class="[^"]*(tier|bundle|pack-item|quantity-box|deal)[^"]*"[\s\S]{0,500}/gi) || [];
console.log('\nTier/bundle matches:', tierMatch.length);
tierMatch.slice(0, 5).forEach((t, i) => console.log(`\nTier [${i+1}]:\n`, t));
