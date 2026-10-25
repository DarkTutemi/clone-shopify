import fs from 'fs';

const text = fs.readFileSync('Clone-willafarm/data/willafarm_pdp_mobile.html', 'utf8');
console.log('Contains review:', text.includes('review') || text.includes('Review'));
const matches = [...text.matchAll(/class=["'][^"']*review[^"']*["']/gi)];
console.log('Review classes count:', matches.length);
matches.slice(0, 10).forEach(m => console.log(m[0]));

// Let's also search for images in reviews
const imgMatches = [...text.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']/gi)];
console.log('Total img tags in html:', imgMatches.length);
imgMatches.filter(m => m[0].includes('review') || m[0].includes('customer') || m[1].includes('loox') || m[1].includes('judgeme')).forEach(m => console.log('Review img:', m[1], m[2]));
