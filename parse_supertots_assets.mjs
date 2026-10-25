import fs from 'fs';

const html = fs.readFileSync('supertots_page.html', 'utf-8');
const matches = [...html.matchAll(/(?:https?:)?\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^"'<>\s]*)?/gi)].map(m => {
  let url = m[0];
  if (url.startsWith('//')) url = 'https:' + url;
  return url.replace(/&amp;/g, '&');
});

const unique = [...new Set(matches)].filter(u => 
  u.includes('cdn/shop') || u.includes('files/') || u.includes('products/')
);

console.log('Total shopify image URLs:', unique.length);
fs.writeFileSync('supertots_found_images.json', JSON.stringify(unique, null, 2));

// Also let's extract sections or headings in html
const headings = [...html.matchAll(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
console.log('Headings found:', headings);
