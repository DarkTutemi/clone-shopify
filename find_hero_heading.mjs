import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/homepage.html', 'utf8');

const idx = html.indexOf('s-hero-banner__heading');
console.log('Heading & CTA:');
console.log(html.substring(idx - 50, idx + 1500));
