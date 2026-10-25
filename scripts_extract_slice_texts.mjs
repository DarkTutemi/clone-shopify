import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

// Let's inspect the HTML from 1600000 to 2000000
const mainSlice = html.slice(1600000, 1950000);

// Let's write this slice out to a readable scratch file or inspect it
fs.writeFileSync('Clone-pandadrum/page_main_slice.html', mainSlice, 'utf8');
console.log('Saved page_main_slice.html, size:', mainSlice.length);

// Let's extract all significant text snippets (> 20 chars) in order
const textNodes = [];
const textRegex = />([^<]{20,})</g;
let m;
while ((m = textRegex.exec(mainSlice)) !== null) {
  const trimmed = m[1].replace(/\s+/g, ' ').trim();
  if (trimmed.length > 20 && !trimmed.includes('{') && !trimmed.includes('function') && !trimmed.includes('var ')) {
    textNodes.push(trimmed);
  }
}

console.log(`Found ${textNodes.length} text nodes`);
console.log('First 40 text nodes:');
textNodes.slice(0, 40).forEach((t, i) => console.log(`${i+1}: ${t}`));
