import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch_black_soap_buybox.json', 'utf8'));
const html = data.innerHTML;

// Find all accordion details
const accordionMatches = [...html.matchAll(/<button[^>]*class="[^"]*accordion__title[^"]*"[^>]*>([\s\S]*?)<\/button>[\s\S]*?<div[^>]*class="accordion__body"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi)];

console.log('Accordions found:', accordionMatches.length);
const accordions = accordionMatches.map(m => ({
  title: m[1].replace(/<[^>]+>/g, '').trim(),
  body: m[2].trim()
}));

// Find USPs
const uspMatches = [...html.matchAll(/<div class="product__block[^"]*">([\s\S]*?)<\/div>/gi)];
console.log('Blocks found:', uspMatches.length);

fs.writeFileSync('black_soap_buybox_parsed.json', JSON.stringify({
  accordions,
  blocksCount: uspMatches.length
}, null, 2));

console.log('Done parsing buybox.');
