import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/curl_ultrasonic_funnel.html', 'utf-8');

// Extract all text blocks
const textBlocks = [...html.matchAll(/>([^<]{4,})</g)]
  .map(m => m[1].trim())
  .filter(t => t.length > 5 && !t.includes('{') && !t.includes('function') && !t.includes('var '));

console.log('--- Sample text blocks ---');
console.log([...new Set(textBlocks)].slice(0, 30));

// Extract all images
const allImages = [...html.matchAll(/https:\/\/[^"'\s)]+\.(jpg|jpeg|png|webp|gif)/gi)].map(m => m[0]);
console.log('\n--- Images found (' + [...new Set(allImages)].length + ') ---');
console.log([...new Set(allImages)].slice(0, 15));
