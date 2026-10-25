import fs from 'fs';

const nuxtCode = fs.readFileSync('Clone-sakerplus/data/heating_lamp/checkout_nuxt.js', 'utf8');

// Find prices, product titles, variant names, image urls
const imgRegex = /https:\/\/[^"'\s)]+\.(png|jpg|jpeg|webp)/gi;
const imgs = [...new Set(nuxtCode.match(imgRegex) || [])];
console.log(`Found ${imgs.length} images:`);
imgs.slice(0, 15).forEach((img, i) => console.log(`  [${i+1}] ${img}`));

// Search for product titles or names
const nameMatches = nuxtCode.match(/"name":\s*"([^"]+)"/g) || nuxtCode.match(/title:\s*"([^"]+)"/g) || [];
console.log('\nName matches:', nameMatches);

// Search for package/quantity offers (e.g. 1 PC, 2 PCS, 3 PCS, etc.)
const pkgMatches = nuxtCode.match(/\b\d+\s*(PC|PCS|Pack|Set)\b/gi) || [];
console.log('Package matches:', [...new Set(pkgMatches)]);
