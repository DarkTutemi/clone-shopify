import fs from 'fs';

const html = fs.readFileSync('draft_working/botanaroots_body_html.html', 'utf8');

// Print sections or outline of body_html
const lines = html.split('\n');
console.log('Total lines:', lines.length);

// Find all headings, comments, and images
lines.forEach((l, idx) => {
  if (l.includes('<!--') || l.includes('<h') || l.includes('<img')) {
    console.log(`L${idx + 1}: ${l.trim().slice(0, 120)}`);
  }
});
