import fs from 'fs';

const html = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');

const sIdx = html.indexOf('template--27870995579206__atlas_dependencies');
const nextIdx = html.indexOf('template--27870995579206__scrolling_images_UgXcTG');

const chunk = html.slice(sIdx - 30, nextIdx - 30);
console.log('Atlas dependencies section length:', chunk.length);

// Check if it contains the main product form and gallery
console.log('Has product form:', chunk.includes('form') && chunk.includes('/cart/add'));
console.log('Has media gallery:', chunk.includes('media-gallery') || chunk.includes('product__media'));
console.log('Has special deal:', chunk.includes('bundle') || chunk.includes('deal'));
console.log('Has testimonials / Keith R:', chunk.includes('Keith R'));
console.log('Has specifications:', chunk.includes('Specifications'));
console.log('Has shipping:', chunk.includes('Shipping'));
console.log('Has sticky ATC:', chunk.includes('sticky-atc'));

// Look for bundle-container
const bundleIdx = chunk.indexOf('bundle-container');
console.log('bundle-container index:', bundleIdx);
if (bundleIdx !== -1) {
  console.log('Around bundle-container:\n', chunk.slice(bundleIdx - 150, bundleIdx + 400));
}
