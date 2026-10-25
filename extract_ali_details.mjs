import fs from 'fs';

const html = fs.readFileSync('ali_item.html', 'utf8');

// og:title
const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/i);
console.log('OG Title:', ogTitle ? ogTitle[1] : 'None');

// Extract all image URLs
const imgRegex = /https:\/\/[^"'\s]+\.aliexpress-media\.com\/kf\/[A-Za-z0-9_-]+(?:\/[^"'\s]+)?\.(?:jpg|png|webp)/g;
const urls = Array.from(new Set(html.match(imgRegex) || []));
console.log('\n--- EXTRACTED IMAGES (count: ' + urls.length + ') ---');
urls.forEach((u, i) => console.log(`[${i+1}] ${u}`));

// Save extracted info
fs.writeFileSync('extracted_ali_info.json', JSON.stringify({
  title: ogTitle ? ogTitle[1] : '',
  images: urls
}, null, 2));
