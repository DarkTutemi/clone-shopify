import fs from 'fs';

const html = fs.readFileSync('ali_item.html', 'utf8');
console.log('File size:', html.length);

const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'No title');

const ogImg = html.match(/<meta property="og:image" content="([^"]+)"/i);
console.log('OG Image:', ogImg ? ogImg[1] : 'No og:image');

const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/i);
console.log('OG Desc:', ogDesc ? ogDesc[1] : 'No og:desc');

// Let's search for any strings mentioning 432 or 12 notes or Handpan or D Kurd or D Minor
const matches = html.match(/.{0,50}(?:432|12\s*notes?|handpan|Handpan).{0,50}/gi) || [];
console.log('Keyword matches count:', matches.length);
matches.slice(0, 10).forEach(m => console.log('Match:', m.trim()));
