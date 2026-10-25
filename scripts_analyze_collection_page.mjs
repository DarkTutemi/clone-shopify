import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

// Let's write an analysis script to dump each section's content and structure
console.log('HTML Length:', html.length);

// Let's find sections or blocks
const matches = [];
const regex = /<section[^>]*>([\s\S]*?)<\/section>/gi;
let m;
let count = 0;
while ((m = regex.exec(html)) !== null) {
  count++;
  const secContent = m[1];
  // extract text preview
  const text = secContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
  console.log(`\n=== Section ${count} ===`);
  console.log('Attributes:', m[0].slice(0, 150));
  console.log('Text preview:', text);
}
