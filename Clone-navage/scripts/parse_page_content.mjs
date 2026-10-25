import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');

// Find all template section blocks
const templateSectionRegex = /<!-- BEGIN sections: (template--27702861398296__[a-zA-Z0-9_\-]+) -->([\s\S]*?)<!-- END sections: \1 -->/g;
const templateDivRegex = /<div id=["'](shopify-section-template--27702861398296__[a-zA-Z0-9_\-]+)["'][\s\S]*?<\/div>\s*<!-- \/?shopify-section/g;

let matches = [];
let m;
// Let's search for divs with id="shopify-section-template--"
const divRegex = /<div id=["'](shopify-section-template--27702861398296__[^"']+)["']\s+class=["']([^"']*)["']>([\s\S]*?)(?=(?:<div id=["']shopify-section-template--|<div id=["']shopify-section-sections--|<footer|<\/body))/gi;

let contentBlocks = [];
while ((m = divRegex.exec(html)) !== null) {
  contentBlocks.push({
    id: m[1],
    classes: m[2],
    rawHtml: m[0]
  });
}

console.log('Extracted content blocks count:', contentBlocks.length);
contentBlocks.forEach((b, i) => {
  console.log(`\n[Block ${i + 1}] ID: ${b.id}`);
  console.log(`Classes: ${b.classes}`);
  console.log(`HTML length: ${b.rawHtml.length}`);
  // Sample headline or text
  const text = b.rawHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`Text excerpt: ${text.substring(0, 150)}...`);
});

// Let's also check stylesheets and global CSS
console.log('\nChecking theme.css link...');
const themeCssUrlMatch = html.match(/(https?:)?\/\/navage\.com\/cdn\/shop\/t\/[0-9]+\/assets\/theme\.css\?[^"']+/i);
if (themeCssUrlMatch) {
  console.log('Found theme.css URL:', themeCssUrlMatch[0]);
}
