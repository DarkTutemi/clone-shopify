import fs from 'fs';

const html = fs.readFileSync('Clone-yeoman/data/the-yeoman-sweep.html', 'utf8');

const mainStart = html.indexOf('id="shopify-section-template--27754055925803__main"');
const nextSection = html.indexOf('id="shopify-section-', mainStart + 30);

console.log('mainStart:', mainStart, 'nextSection:', nextSection);
const mainHtml = html.substring(mainStart, nextSection);
console.log('Main section length:', mainHtml.length);
fs.writeFileSync('Clone-yeoman/data/product_main_section.html', mainHtml);
console.log('Saved to Clone-yeoman/data/product_main_section.html');

// Let's inspect the text and blocks in mainHtml
const blocks = [...mainHtml.matchAll(/class=["']([^"']*(?:product|benefit|feature|spec|detail|accordion|tab|review|badge|info)[^"']*)["']/gi)].map(m => m[1]);
console.log('\nMain section class patterns:', [...new Set(blocks)].slice(0, 20));
