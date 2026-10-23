import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/homepage.html', 'utf8');

const idx = html.indexOf('s-hero-banner__content-wrapper');
console.log('Hero banner content:');
console.log(html.substring(idx, idx + 4500));
