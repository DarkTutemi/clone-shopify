import fs from 'fs';

const html = fs.readFileSync('draft_working/botanaroots_body_html.html', 'utf8');

const descParts = html.split('<!-- FAQ Section -->');
const topContent = descParts[0];
const bottomParts = descParts[1].split('<!-- Verified Customer Reviews Section -->');
const staticFaq = bottomParts[0];
const reviewsContent = bottomParts[1];

console.log('Top content length:', topContent.length);
console.log('Static FAQ length:', staticFaq.length);
console.log('Reviews content length:', reviewsContent.length);

console.log('Top content ends with:', JSON.stringify(topContent.slice(-100)));
console.log('Static FAQ starts with:', JSON.stringify(staticFaq.slice(0, 100)));
console.log('Reviews content starts with:', JSON.stringify(reviewsContent.slice(0, 100)));

// Verify that static FAQ is completely excluded
const reconstructed = topContent + '\n<!-- REPLACED WITH ACCORDION -->\n<!-- Verified Customer Reviews Section -->' + reviewsContent;
console.log('Reconstructed contains static FAQ strong tag?', reconstructed.includes('<strong style="font-size: 15px; color: #222;">Can I use this on color-treated'));
console.log('Reconstructed contains reviews header?', reconstructed.includes('Verified Customer Reviews'));
console.log('Reconstructed contains 3 Easy Ways?', reconstructed.includes('3 Easy Ways to Incorporate'));
