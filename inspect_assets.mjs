import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/homepage.html', 'utf8');

// Stylesheets
const cssUrls = [...new Set([...html.matchAll(/<link[^>]*rel=['"]stylesheet['"][^>]*href=['"]([^'"]+)['"]/gi)].map(m => m[1]))];
console.log('Stylesheets count:', cssUrls.length);
console.log(cssUrls);

// Scripts
const jsUrls = [...new Set([...html.matchAll(/<script[^>]*src=['"]([^'"]+)['"]/gi)].map(m => m[1]))];
console.log('\nScripts count:', jsUrls.length);
console.log(jsUrls.slice(0, 10));

// Fonts
const fontUrls = [...new Set([...html.matchAll(/https:\/\/[^'"]*(?:woff2|woff|ttf)/gi)].map(m => m[0]))];
console.log('\nFonts count:', fontUrls.length);
console.log(fontUrls);
