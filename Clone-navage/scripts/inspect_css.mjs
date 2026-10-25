import fs from 'fs';

const css = fs.readFileSync('Clone-navage/data/navage-theme.css', 'utf8');

// Check font-family definitions
const fonts = [...css.matchAll(/font-family:\s*([^;}]+)/gi)].map(m => m[1].trim());
console.log('Fonts in CSS:', [...new Set(fonts)].slice(0, 10));

// Check url(...) imports or fonts in CSS
const urls = [...css.matchAll(/url\(([^)]+)\)/gi)].map(m => m[1].replace(/['"]/g, '').trim());
console.log('Total URLs in theme.css:', urls.length);
console.log('Sample URLs:', urls.slice(0, 5));
