import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/heating_lamp/landing.html', 'utf8');

// Find all images in landing.html
const imgs = [...html.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
console.log('Total images in landing:', imgs.length);

const uniqueImgs = [...new Set(imgs)];
console.log('Unique images in landing:', uniqueImgs.length);
console.log('Images list:\n', JSON.stringify(uniqueImgs, null, 2));

// Find sections or headings
const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
const h3s = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());

console.log('H1:', h1s);
console.log('H2:', h2s);
console.log('H3:', h3s);
