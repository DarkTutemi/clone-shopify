import fs from 'fs';

const content = fs.readFileSync('Clone-sakerplus/data/nuxt_ultrasonic.js', 'utf-8');

const titles = content.match(/"([^"]*Ultrasonic[^"]*)"/gi) || [];
console.log('Titles matched:', [...new Set(titles)].slice(0, 5));

const imgs = content.match(/https:\/\/cdn\.myshopage\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+/gi) || [];
console.log('Images matched:', [...new Set(imgs)].length);
console.log('First 5 images:', [...new Set(imgs)].slice(0, 5));

// Find any variant names, options, or product titles
const matches = content.match(/title:"([^"]+)"/g) || [];
console.log('Title matches:', [...new Set(matches)]);

const nameMatches = content.match(/name:"([^"]+)"/g) || [];
console.log('Name matches:', [...new Set(nameMatches)].slice(0, 10));

const priceMatches = content.match(/price:"?(\d+(\.\d+)?)"?/g) || [];
console.log('Price matches:', [...new Set(priceMatches)]);
