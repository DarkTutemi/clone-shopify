import fs from 'fs';

const content = fs.readFileSync('Clone-thoson/theme/snippets/thoson-hero.liquid', 'utf-8');
const mediaMatches = [...content.matchAll(/<li[^>]+id="(Slide-[^"]+)"[^>]*>([\s\S]*?)<\/li>/g)];

const slides = mediaMatches.map((m, i) => {
  const slideId = m[1];
  const inner = m[2];
  const isVideo = inner.includes('<video');
  const imgMatch = inner.match(/<img[^>]+src="([^"]+)"/);
  const videoMatch = inner.match(/<source[^>]+(?:data-src|src)="([^"]+)"/);
  const posterMatch = inner.match(/poster="([^"]+)"/) || inner.match(/<img[^>]+src="([^"]+)"/);

  return {
    index: i,
    slideId,
    type: isVideo ? 'video' : 'image',
    src: isVideo ? (videoMatch ? videoMatch[1].replace(/&amp;/g, '&') : '') : (imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : ''),
    poster: posterMatch ? posterMatch[1].replace(/&amp;/g, '&') : '',
    thumb: isVideo ? (posterMatch ? posterMatch[1].replace(/&amp;/g, '&') : '') : (imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : ''),
    alt: 'Zavelyn® MagTrack™'
  };
});

console.log(JSON.stringify(slides, null, 2));
fs.writeFileSync('Clone-thoson/data/extracted_slides.json', JSON.stringify(slides, null, 2));
