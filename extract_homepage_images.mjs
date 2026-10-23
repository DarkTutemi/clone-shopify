import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/homepage.html', 'utf8');

// Find all cdn.shopify.com or earthlyderm.com/cdn/shop/files images
const imgs = [...new Set([...html.matchAll(/(?:https?:)?\/\/(?:cdn\.shopify\.com|earthlyderm\.com)\/[^'"\s\)]+(?:jpg|jpeg|png|webp|svg)/gi)].map(m => m[0]))];
console.log(`Discovered ${imgs.length} image assets on Homepage!`);

// Let's categorize them
const heroImgs = imgs.filter(u => u.includes('hero') || u.includes('banner') || u.includes('home'));
const baImgs = imgs.filter(u => u.includes('before') || u.includes('after') || u.includes('Screenshot'));
const iconImgs = imgs.filter(u => u.includes('icon') || u.includes('svg'));

console.log('Hero / Banner images:', heroImgs);
console.log('Before & After images:', baImgs);
console.log('First 10 general images:', imgs.slice(0, 10));

fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/homepage_images.json', JSON.stringify({
  all: imgs,
  hero: heroImgs,
  beforeAfter: baImgs
}, null, 2));
