import fs from 'fs';

const html = fs.readFileSync('Clone-yeoman/data/the-yeoman-sweep.html', 'utf8');

// Find product description, tabs, collapsibles
console.log('Searching for description / accordion / details...');

// Check product__description
const descMatch = html.match(/<div[^>]*class=["'][^"']*product__description[^"']*["'][\s\S]*?<\/div>/i);
if (descMatch) {
  console.log('Found product__description:\n', descMatch[0].substring(0, 500));
}

// Check collapsibles / accordions
const collapsibles = [...html.matchAll(/<details[\s\S]*?<\/details>/gi)].map(m => m[0]);
console.log('\nFound collapsibles count:', collapsibles.length);
collapsibles.forEach((c, i) => {
  const summary = c.match(/<summary[\s\S]*?<\/summary>/i);
  console.log(`[Collapsible ${i + 1}] Summary:`, summary ? summary[0].replace(/<[^>]+>/g, '').trim() : 'N/A');
  console.log(`Content sample:`, c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 150));
});

// Check sections on the product page
const sectionIds = [...html.matchAll(/id=["']shopify-section-([^"']+)["']/g)].map(m => m[1]);
console.log('\nShopify sections on product page:', sectionIds);

// Check all image URLs in the page
const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('\nTotal images found:', imgs.length);
const cdnImgs = imgs.filter(src => src.includes('cdn.shopify.com') || src.includes('files/'));
console.log('Shopify CDN images found:', cdnImgs.length);
console.log('Sample CDN images:', [...new Set(cdnImgs)].slice(0, 10));
