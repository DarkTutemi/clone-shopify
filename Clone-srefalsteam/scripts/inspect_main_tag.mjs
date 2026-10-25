import fs from 'fs';

const html = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');

const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (mainMatch) {
  console.log('Main content length:', mainMatch[1].length);
  const mainHtml = mainMatch[1];
  
  // Find all shopify-section divs inside main
  const re = /<div id="shopify-section-([^"]+)"/g;
  let m;
  while ((m = re.exec(mainHtml)) !== null) {
    console.log('Main Section ID:', m[1]);
  }
} else {
  console.log('No <main> tag found!');
}
