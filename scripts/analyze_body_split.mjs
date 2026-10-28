import fs from 'fs';

const html = fs.readFileSync('draft_working/botanaroots_body_html.html', 'utf8');

const markerFaq = '<!-- FAQ Section -->';
const markerReviews = '<!-- Verified Customer Reviews Section -->';

const parts = html.split(markerFaq);
console.log('Part 1 exists:', !!parts[0], 'Length:', parts[0]?.length);

if (parts[1]) {
  const subparts = parts[1].split(markerReviews);
  console.log('Static FAQ part length:', subparts[0]?.length);
  console.log('Reviews part length:', subparts[1]?.length);

  console.log('\n--- END OF PART 1 (last 300 chars) ---');
  console.log(parts[0].slice(-300));

  console.log('\n--- STATIC FAQ PART ---');
  console.log(subparts[0]);

  console.log('\n--- START OF REVIEWS PART (first 300 chars) ---');
  console.log(subparts[1]?.slice(0, 300));
}
