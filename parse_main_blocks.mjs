import fs from 'fs';

const html = fs.readFileSync('trybronoir_main_product_section.html', 'utf8');

// Find the product-info or product-form
const infoMatch = html.match(/<div class="product-info[^"]*">([\s\S]*?)<\/product-info>/) ||
                 html.match(/<div class="product__info[^"]*">([\s\S]*?)<\/div>/);

// Find blocks inside product-info
const blockMatches = Array.from(html.matchAll(/class="product-meta__[^"]*"|class="product-form__[^"]*"/g));
console.log('Matches:', blockMatches.map(m => m[0]));

// Let's search for rating, badges, etc.
const hasStars = html.includes('product-meta__reviews') || html.includes('rating');
console.log('hasStars:', hasStars);

// Find all elements under product-meta
const metaMatch = html.match(/<div class="product-meta">([\s\S]*?)<\/div>/);
if (metaMatch) {
  console.log('Product meta:', metaMatch[1].slice(0, 500));
}

// Find all blocks inside product-info
const blocks = Array.from(html.matchAll(/<(product-[a-z-]+|div class="product-form[^"]*")[^>]*>/g)).map(m => m[0]);
console.log('Blocks:', blocks);
