import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/extracted_article_body.html', 'utf8');

// Find all media URLs
const gifRegex = /https?:\/\/[^"'\s]+\.gif(?:\?[^"'\s]*)?/gi;
const gifs = Array.from(new Set(html.match(gifRegex) || []));
console.log('GIFs (' + gifs.length + '):');
gifs.forEach((g, i) => console.log(`  [${i+1}] ${g}`));

const imgRegex = /https:\/\/cdn\.myshopage\.com\/[^"'\s]+\.(?:jpg|png|webp)/gi;
const imgs = Array.from(new Set(html.match(imgRegex) || []));
console.log('\nImages (' + imgs.length + '):');
imgs.forEach((img, i) => console.log(`  [${i+1}] ${img}`));

// Search for the 7 reasons text
const reasons = html.match(/<strong>\d+\.\s*[^<]+<\/strong>/gi) || [];
console.log('\nReasons (' + reasons.length + '):');
reasons.forEach(r => console.log('  -', r.replace(/<[^>]+>/g, '').trim()));
