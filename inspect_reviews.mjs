import fs from 'fs';

const pRevHtml = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/pages_customer-reviews.html', 'utf8');

// check loox widget or data
const looxMatches = [...pRevHtml.matchAll(/class=['"][^'"]*loox[^'"]*['"]/gi)].map(m => m[0]);
console.log('Loox classes on reviews page:', [...new Set(looxMatches)]);

// check if there is an iframe or API call
const looxScripts = [...pRevHtml.matchAll(/https?:\/\/[^'"]*loox[^'"]*/gi)].map(m => m[0]);
console.log('Loox URLs found:', [...new Set(looxScripts)]);

// check if reviews are embedded in HTML
const reviewAuthors = [...pRevHtml.matchAll(/class=['"][^'"]*author[^'"]*['"][^>]*>([^<]+)/gi)].map(m => m[1].trim());
console.log('Review authors if embedded:', reviewAuthors.slice(0, 10));
