import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/curl_ultrasonic_funnel.html', 'utf-8');
const allImgs = [...html.matchAll(/https:\/\/[^"'\s)<>]+\.(jpg|jpeg|png|webp|gif)/gi)].map(m => m[0]);
const unique = [...new Set(allImgs)];
console.log('Total unique images:', unique.length);
unique.forEach((img, idx) => console.log(`[${idx}]: ${img}`));
