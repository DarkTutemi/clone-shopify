import fs from 'fs';

const html = fs.readFileSync('ackerman_page.html', 'utf8');

// Match image URLs in HTML
const regex = /(https:\/\/[^"'\s<>]+\.(?:png|jpg|jpeg|webp)(?:\?[^"'\s<>]*)?)/gi;
const matches = Array.from(new Set(html.match(regex) || []));

// Filter out icons, small tracking pixels, etc.
const productImages = matches.filter(url => {
  const u = url.toLowerCase();
  return !u.includes('favicon') && !u.includes('icon') && !u.includes('logo') && !u.includes('badge') && !u.includes('flag');
});

console.log('Total extracted image candidates:', productImages.length);
console.log('Sample images:', productImages.slice(0, 15));

fs.writeFileSync('ackerman_extracted_images.json', JSON.stringify(productImages, null, 2));
