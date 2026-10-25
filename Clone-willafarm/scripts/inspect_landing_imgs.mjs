import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/heating_lamp/landing.html', 'utf8');

const regex = /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
let match;
const results = [];
while ((match = regex.exec(html)) !== null) {
  const full = match[0];
  const src = match[1];
  const alt = (full.match(/alt=["']([^"']*)["']/) || [])[1] || '';
  results.push({ src, alt, tag: full.slice(0, 150) });
}

console.log('Images in landing.html:');
results.forEach((r, i) => console.log(`${i}: [${r.alt}] -> ${r.src}`));
