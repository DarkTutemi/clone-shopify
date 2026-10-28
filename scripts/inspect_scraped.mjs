import fs from 'fs';

const html = fs.readFileSync('scripts/bogo_preview_scraped.html', 'utf8');
console.log('Title:', html.match(/<title>[\s\S]*?<\/title>/i)?.[0]);
const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
if (mainMatch) {
  console.log('Found <main>, length:', mainMatch[0].length);
  console.log(mainMatch[0].slice(0, 1500));
} else {
  console.log('No <main> tag found. Searching for shopify-section:');
  const sections = html.match(/<div class="shopify-section[^"]*"[\s\S]*?<\/div>/g);
  console.log('Found sections count:', sections ? sections.length : 0);
  console.log('HTML sample:', html.slice(1000, 3000));
}
