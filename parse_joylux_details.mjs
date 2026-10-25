import fs from 'fs';

const html = fs.readFileSync('joylux_page.html', 'utf-8');

// Find all product links
const productLinks = [...html.matchAll(/href=["'](\/products\/[^"']+)["']/gi)].map(m => m[1]);
console.log('Unique product links:', [...new Set(productLinks)]);

// Find all dollar prices
const prices = [...html.matchAll(/\$\d+(?:\.\d{2})?/g)].map(m => m[0]);
console.log('Prices found:', [...new Set(prices)]);

// Find all images
const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
const uniqueImgs = [...new Set(imgs)].filter(u => !u.includes('analytics') && !u.includes('clarity') && !u.includes('pixel'));
console.log('Unique images count:', uniqueImgs.length);
fs.writeFileSync('joylux_images.json', JSON.stringify(uniqueImgs, null, 2));

// Find sections and headings
const headings = [...html.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(h => h.length > 5);
console.log('Headings found:', headings.slice(0, 15));
