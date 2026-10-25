import fs from 'fs';

const content = fs.readFileSync('Clone-thoson/theme/snippets/thoson-hero.liquid', 'utf-8');
const mediaMatches = [...content.matchAll(/<li[^>]+id="Slide-[^"]+"[^>]*>([\s\S]*?)<\/li>/g)];
console.log('Total media slides found:', mediaMatches.length);
mediaMatches.forEach((m, i) => {
  const isVideo = m[1].includes('<video');
  const imgMatch = m[1].match(/<img[^>]+src="([^"]+)"/);
  const videoMatch = m[1].match(/<source[^>]+(?:data-src|src)="([^"]+)"/);
  console.log(`Slide ${i + 1}: ${isVideo ? 'VIDEO' : 'IMAGE'} - ${imgMatch ? imgMatch[1] : (videoMatch ? videoMatch[1] : 'none')}`);
});
