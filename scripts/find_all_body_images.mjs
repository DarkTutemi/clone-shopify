import fs from 'fs';

const html = fs.readFileSync('draft_working/botanaroots_body_html.html', 'utf8');

// Find all <img> tags
const imgRegex = /<img[^>]+>/g;
const matches = html.match(imgRegex) || [];

console.log('Total <img> tags in body_html:', matches.length);
matches.forEach((m, idx) => {
  const srcMatch = m.match(/src=["']([^"']+)["']/);
  const altMatch = m.match(/alt=["']([^"']+)["']/);
  console.log(`\n[Image ${idx + 1}]`);
  console.log('src:', srcMatch ? srcMatch[1] : 'none');
  console.log('alt:', altMatch ? altMatch[1] : 'none');
  console.log('tag:', m);
});
