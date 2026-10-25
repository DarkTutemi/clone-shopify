import fs from 'fs';

const html = fs.readFileSync('botana_page.html', 'utf8');
const p = JSON.parse(fs.readFileSync('botana_product.json')).product;

const regex = /https:\/\/cdn\.shopify\.com\/s\/files\/[^\s"'<>)]+/g;
const matches = Array.from(new Set(html.match(regex) || []));

// Filter out js/css, keep png/jpg/jpeg/webp
const imageMatches = matches.filter(url => {
  const clean = url.split('?')[0].toLowerCase();
  return clean.endsWith('.png') || clean.endsWith('.jpg') || clean.endsWith('.jpeg') || clean.endsWith('.webp');
});

console.log('Product images count:', p.images.length);
console.log('HTML images count:', imageMatches.length);

const allImages = Array.from(new Set([
  ...p.images.map(i => i.src),
  ...imageMatches
]));

console.log('Total unique images:', allImages.length);
fs.writeFileSync('botana_extracted_images.json', JSON.stringify(allImages, null, 2));
console.log('Saved botana_extracted_images.json');
