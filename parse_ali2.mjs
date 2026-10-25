import fs from 'fs';

const html = fs.readFileSync('ali_item2.html', 'utf8');
console.log('File size:', html.length);

const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/i);
console.log('OG Title:', ogTitle ? ogTitle[1] : 'None');

const ogImg = html.match(/<meta property="og:image" content="([^"]+)"/i);
console.log('OG Image:', ogImg ? ogImg[1] : 'No og:image');

const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/i);
console.log('OG Desc:', ogDesc ? ogDesc[1] : 'No og:desc');

// Extract all image URLs
const imgRegex = /https:\/\/[^"'\s]+\.aliexpress-media\.com\/kf\/[A-Za-z0-9_-]+(?:\/[^"'\s]+)?\.(?:jpg|png|webp)/g;
const urls = Array.from(new Set(html.match(imgRegex) || []));
console.log('\n--- EXTRACTED IMAGES (count: ' + urls.length + ') ---');
urls.forEach((u, i) => console.log(`[${i+1}] ${u}`));

// Keyword scan
const matches = html.match(/.{0,50}(?:drum|tongue|handpan|steel|inch|3-inch|mini|pocket).{0,50}/gi) || [];
console.log('\nKeyword matches count:', matches.length);
matches.slice(0, 10).forEach(m => console.log('Match:', m.trim()));
