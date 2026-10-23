import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/pages_customer-reviews.html', 'utf8');

// Extract SSR reviews
const reviewBlocks = [...html.matchAll(/<div[^>]*class=['"][^'"]*loox-review[^'"]*['"][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi)];
console.log(`Found ${reviewBlocks.length} loox-review matches`);

// Let's parse reviewer name, rating, body, date, verified, image
const reviews = [];
const revBlockRegex = /<div[^>]*class=['"][^'"]*loox-review\b[^'"]*['"][\s\S]*?(?=<div[^>]*class=['"][^'"]*loox-review\b|<\/div>\s*<\/div>\s*<\/div>)/gi;
let match;

// simpler: find loox-reviewer-name and surrounding
const names = [...html.matchAll(/class=['"][^'"]*loox-reviewer-name[^'"]*['"][^>]*>([^<]+)/gi)].map(m => m[1].trim());
const bodies = [...html.matchAll(/class=['"][^'"]*loox-review-body[^'"]*['"][^>]*>([\s\S]*?)<\/div>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
const dates = [...html.matchAll(/class=['"][^'"]*loox-review-date[^'"]*['"][^>]*>([^<]+)/gi)].map(m => m[1].trim());
const ratings = [...html.matchAll(/class=['"][^'"]*loox-review-rating[^'"]*['"][^>]*aria-label=['"]([^'"]+)['"]/gi)].map(m => m[1].trim());

console.log(`Parsed count -> names: ${names.length}, bodies: ${bodies.length}, dates: ${dates.length}, ratings: ${ratings.length}`);

for (let i = 0; i < Math.min(names.length, bodies.length); i++) {
  reviews.push({
    author: names[i],
    body: bodies[i],
    date: dates[i] || '',
    rating: ratings[i] || '5 stars',
    verified: true
  });
}

console.log('Sample Review 1:', reviews[0]);
console.log('Sample Review 2:', reviews[1]);

fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/reviews_harvested.json', JSON.stringify(reviews, null, 2));
console.log(`Saved ${reviews.length} reviews to reviews_harvested.json`);
