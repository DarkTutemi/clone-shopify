import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/homepage.html', 'utf8');

const matches = [...html.matchAll(/class=['"][^'"]*s-hero-banner[^'"]*['"]/g)];
console.log('Matches for s-hero-banner:', matches.length);
if (matches.length > 0) {
  const idx = matches[0].index;
  console.log(html.substring(idx - 100, idx + 2500));
}
