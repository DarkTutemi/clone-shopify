import fs from 'fs';

let dom = fs.readFileSync('Clone-sakerplus/data/heating_lamp/extracted_news_dom.html', 'utf8');

// Find all hrefs
const hrefMatches = [...dom.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]);
console.log('Unique hrefs in DOM:', [...new Set(hrefMatches)]);

// Find all image srcs
const srcMatches = [...dom.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
console.log('Images count:', srcMatches.length);
console.log('Sample image srcs:', srcMatches.slice(0, 10));

// Check any lazy load attributes like data-src or srcset
const dataSrcMatches = [...dom.matchAll(/data-src=["']([^"']+)["']/g)].map(m => m[1]);
console.log('data-src count:', dataSrcMatches.length);

const srcsetMatches = [...dom.matchAll(/srcset=["']([^"']+)["']/g)].map(m => m[1]);
console.log('srcset count:', srcsetMatches.length);
