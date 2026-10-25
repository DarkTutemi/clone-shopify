import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');
const headerSectionStart = html.indexOf('id="shopify-section-sections--27702862348568__header"');
const nextSection = html.indexOf('id="shopify-section-', headerSectionStart + 20);
const headerHtml = html.substring(headerSectionStart, nextSection);

// Find elements with class starting with header__
const matches = [...headerHtml.matchAll(/class=["'](header__[^"']+)["']/g)].map(m => m[1]);
console.log('Header class patterns:', [...new Set(matches)]);

// Let's print the top header container
const storeHeaderMatch = headerHtml.match(/<store-header[\s\S]*?<\/store-header>/i) || headerHtml.match(/<div class="header[\s\S]*?<\/div>\s*<\/div>/i);
if (storeHeaderMatch) {
  console.log('Store header element snippet:\n', storeHeaderMatch[0].substring(0, 1000));
}
