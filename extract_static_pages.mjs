import fs from 'fs';

const storyHtml = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/pages_our-story.html', 'utf8');
const contactHtml = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/pages_contact.html', 'utf8');

function extractMainPageContent(html) {
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  return mainMatch.replace(/<script[\s\S]*?<\/script>/gi, '').trim();
}

console.log('Our Story main length:', extractMainPageContent(storyHtml).length);
console.log('Contact Us main length:', extractMainPageContent(contactHtml).length);

fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/page_our_story_content.html', extractMainPageContent(storyHtml));
fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/page_contact_content.html', extractMainPageContent(contactHtml));
console.log('✔ Saved our story & contact content');
