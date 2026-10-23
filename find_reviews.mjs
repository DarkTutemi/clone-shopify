import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/pages_customer-reviews.html', 'utf8');

// Find all matches of loox-reviewer-name and print their surrounding context
const regex = /class=['"][^'"]*loox-reviewer-name[^'"]*['"][^>]*>([^<]+)<\/span>/gi;
let m;
let count = 0;
while ((m = regex.exec(html)) !== null && count < 5) {
  count++;
  console.log(`\n--- REVIEWER ${count}: ${m[1].trim()} ---`);
  const start = Math.max(0, m.index - 500);
  const end = Math.min(html.length, m.index + 800);
  const snippet = html.substring(start, end).replace(/[\t\r\n ]+/g, ' ');
  console.log(snippet);
}
console.log(`Total reviewers found: ${count}`);
