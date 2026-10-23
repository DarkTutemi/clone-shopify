import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch_black_soap_buybox.json', 'utf8'));
const html = data.innerHTML;

// Match each product__block product__accordions
const accordionRegex = /<div class="product__block product__accordions[^"]*"[^>]*>[\s\S]*?<button[^>]*class="product__accordion__title[^"]*"[^>]*>([\s\S]*?)<\/button>[\s\S]*?<div[^>]*class="product__accordion__content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;

const accordions = [];
let match;
while ((match = accordionRegex.exec(html)) !== null) {
  accordions.push({
    title: match[1].replace(/<[^>]+>/g, '').trim(),
    content: match[2].trim()
  });
}

console.log('Found accordions:', accordions.length);
accordions.forEach((a, i) => console.log(`${i + 1}. ${a.title}`));

fs.writeFileSync('black_soap_accordions.json', JSON.stringify(accordions, null, 2));

// Also let's check what USPs are on the page
const uspSection = html.slice(html.indexOf('pdp-happy-faces'), html.indexOf('kaching-bundles'));
console.log('Text between happy-faces and bundles:');
console.log(uspSection.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 500));
