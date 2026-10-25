import fs from 'fs';

const data = JSON.parse(fs.readFileSync('Clone-yeoman/data/the-yeoman-sweep.json', 'utf8')).product;
console.log('Images count:', data.images.length);
data.images.forEach((img, i) => {
  console.log(`Image ${i + 1}: ${img.src}`);
});
