import fs from 'fs';

const yeoman = JSON.parse(fs.readFileSync('Clone-yeoman/data/the-yeoman-sweep.json', 'utf8')).product;
console.log('--- YEOMAN IMAGES ---');
yeoman.images.forEach((img, i) => console.log(`[${i+1}] ${img.src}`));

const srefal = JSON.parse(fs.readFileSync('Clone-srefalsteam/data/product.json', 'utf8')).product;
console.log('\n--- SREFAL IMAGES ---');
srefal.images.forEach((img, i) => console.log(`[${i+1}] ${img.src}`));
