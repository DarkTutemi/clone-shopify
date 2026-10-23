import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/homepage.html', 'utf8');

const idx = html.indexOf('<div class="s-hero-banner"');
console.log('Hero banner DOM:');
console.log(html.substring(idx, idx + 3500));
