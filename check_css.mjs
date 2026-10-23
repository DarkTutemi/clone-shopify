import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/homepage.html', 'utf8');

const themeAssets = [...html.matchAll(/href=['"]([^'"]*\/assets\/[^'"]*\.css[^'"]*)['"]/gi)].map(m => m[1]);
console.log('Theme CSS assets:', themeAssets);

const allStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
console.log(`Inline style tags count: ${allStyles.length}`);
let totalStyleLen = 0;
for (const s of allStyles) totalStyleLen += s[1].length;
console.log(`Total inline CSS length: ${totalStyleLen} bytes (~${Math.round(totalStyleLen / 1024)} KB)`);

// Check if theme.css or style.css is mentioned
const anyCss = [...new Set([...html.matchAll(/https?:\/\/[^'"\s\)]+\.css[^'"\s\)]*/gi)].map(m => m[0]))];
console.log('All CSS links found:', anyCss);
