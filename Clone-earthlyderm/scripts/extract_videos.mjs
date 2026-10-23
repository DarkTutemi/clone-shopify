import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/pdp_videos_block.html', 'utf8');

const videoSrcs = [];
const vMatches = html.matchAll(/data-sources="([^"]+)"/g);
for (const m of vMatches) {
  videoSrcs.push(m[1]);
}

const posterSrcs = [];
const pMatches = html.matchAll(/class="s-main-product__preview-image[^"]*"[\s\S]*?<img[^>]*src="([^"]+)"/g);
for (const m of pMatches) {
  posterSrcs.push(m[1]);
}

console.log('Videos:', videoSrcs);
console.log('Posters:', posterSrcs);
