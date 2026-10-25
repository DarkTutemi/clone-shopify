import fs from 'fs';

const html = fs.readFileSync('saker_leaf_blower_live.html', 'utf8');

// Find images and gifs
const imgMatches = Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)).map(m => m[1]);
console.log('Total img tags:', imgMatches.length);
const gifs = Array.from(new Set(imgMatches.filter(u => u.toLowerCase().includes('.gif'))));
console.log('Unique GIFs found:', gifs.length);
gifs.forEach(g => console.log('  GIF:', g));

// Unique webp/png/jpg
const photos = Array.from(new Set(imgMatches.filter(u => !u.includes('.gif') && !u.includes('svg'))));
console.log('Unique photos found:', photos.length);
photos.slice(0, 15).forEach(p => console.log('  Photo:', p));

// Headings
const h1s = Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('H1:', h1s);

const h2s = Array.from(html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('H2s:', h2s);

// Look for price or package bundles
const prices = Array.from(html.matchAll(/\$\s*(\d+(\.\d{2})?)/g)).map(m => m[0]);
console.log('Sample Prices found:', Array.from(new Set(prices)).slice(0, 20));
