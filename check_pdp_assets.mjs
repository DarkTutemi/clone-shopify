import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/products_turmeric-glow-soap.html', 'utf8');

const themeAssets = [...new Set([...html.matchAll(/(?:\/\/earthlyderm\.com\/cdn\/shop\/t\/18\/assets\/[^'"\s\)]+\.css[^'"\s\)]*)/gi)].map(m => m[0]))];
console.log('PDP CSS assets:', themeAssets);

const themeJs = [...new Set([...html.matchAll(/(?:\/\/earthlyderm\.com\/cdn\/shop\/t\/18\/assets\/[^'"\s\)]+\.js[^'"\s\)]*)/gi)].map(m => m[0]))];
console.log('PDP JS assets:', themeJs);
