import fs from 'fs';

const html = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');

console.log('--- REVIEWS CHECK ---');
['judge.me', 'loox', 'yotpo', 'spr-badge', 'review', 'rating'].forEach(k => {
  const count = (html.match(new RegExp(k, 'gi')) || []).length;
  console.log(`${k}: ${count} occurrences`);
});

// Look for review count and average rating
const ratingSnippet = html.match(/class="[^"]*rating[^"]*"[\s\S]{0,300}/gi);
if (ratingSnippet) {
  console.log('\nRating snippets:');
  ratingSnippet.slice(0, 3).forEach(s => console.log(s.slice(0, 150)));
}

// Look for bundle quantity options (e.g. 1 unit, 2 units, etc.)
const bundleMatches = html.match(/bundle|pack|quantity|save \d+%/gi);
console.log('\nBundle keyword occurrences:', bundleMatches ? bundleMatches.length : 0);

// Look for form tag
const formMatch = html.match(/<form[^>]+action=["'][^"']*\/cart\/add["'][^>]*>([\s\S]*?)<\/form>/i);
if (formMatch) {
  console.log('\nFound Cart Form! Length:', formMatch[0].length);
  // look for inputs
  const inputs = formMatch[0].match(/<input[^>]+>/gi) || [];
  console.log('Form inputs:', inputs);
} else {
  console.log('\nCart form with action="/cart/add" not found directly, checking for any form');
  const allForms = html.match(/<form[^>]*>([\s\S]*?)<\/form>/gi) || [];
  console.log('Total forms:', allForms.length);
  allForms.forEach((f, idx) => console.log(`Form [${idx+1}]:`, f.slice(0, 200)));
}
