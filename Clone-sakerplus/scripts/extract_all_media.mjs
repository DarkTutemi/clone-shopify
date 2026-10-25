import fs from 'fs';

const newsHtml = fs.readFileSync('Clone-sakerplus/data/heating_lamp/curl_news.html', 'utf8');
const landingHtml = fs.readFileSync('Clone-sakerplus/data/heating_lamp/landing.html', 'utf8');

const imgRegex = /https:\/\/[^"'\s)]+\.(png|jpg|jpeg|webp|gif)/gi;

const newsImgs = [...new Set(newsHtml.match(imgRegex) || [])];
const landingImgs = [...new Set(landingHtml.match(imgRegex) || [])];

console.log(`News images: ${newsImgs.length}`);
newsImgs.forEach((img, i) => console.log(`  [${i+1}] ${img}`));

console.log(`\nLanding images: ${landingImgs.length}`);
landingImgs.forEach((img, i) => console.log(`  [${i+1}] ${img}`));
