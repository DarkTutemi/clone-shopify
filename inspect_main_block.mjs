import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/products_turmeric-glow-soap.html', 'utf8');

const startTag = '<div id="shopify-section-template--19526978371718__main"';
const startIdx = html.indexOf(startTag);
const endIdx = html.indexOf('</section>\n</div>', startIdx);
const mainHtml = html.substring(startIdx, endIdx !== -1 ? endIdx + 20 : startIdx + 50000);

// Check bundle offers or variant blocks
const bundleMatches = [...mainHtml.matchAll(/class=['"][^'"]*(bundle|variant|quantity|radio|swatch|selling-plan|subscription|atc|accordion|tab)[^'"]*['"]/gi)].map(m => m[0]);
console.log('Unique block classes in main:', [...new Set(bundleMatches)].slice(0, 30));

// Check titles / h1
const h1 = mainHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.trim();
console.log('H1:', h1);

// Check price
const prices = [...mainHtml.matchAll(/\$\d+(\.\d{2})?/g)].map(m => m[0]);
console.log('Price mentions in main:', [...new Set(prices)]);

// Check accordion headings
const accordionHeadings = [...mainHtml.matchAll(/<button[^>]*class=['"][^'"]*accordion[^'"]*['"][^>]*>([\s\S]*?)<\/button>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('Accordion headings:', accordionHeadings);

// Check images in product gallery
const galleryImgs = [...mainHtml.matchAll(/src=['"]([^'"]*(?:jpg|jpeg|png|webp)[^'"]*)['"]/gi)].map(m => m[1]);
console.log('Gallery image count:', galleryImgs.length);
console.log('First 5 images:', galleryImgs.slice(0, 5));
