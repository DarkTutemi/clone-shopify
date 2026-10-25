import fs from 'fs';

const html = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');

// Check Specifications and Shipping accordion markup
const specsMatch = html.match(/<details[^>]*>[\s\S]*?Specifications[\s\S]*?<\/details>/i);
if (specsMatch) {
  console.log('Specifications details tag found:\n', specsMatch[0].slice(0, 300));
} else {
  console.log('Specifications is not <details>, checking for class accordion');
  const specDiv = html.match(/<[^>]+class="[^"]*accordion[^"]*"[^>]*>[\s\S]*?Specifications[\s\S]*?<\/[^>]+>/i);
  if (specDiv) console.log(specDiv[0].slice(0, 300));
}

// Check FAQ section markup
const faqIdx = html.indexOf('template--27870995579206__section_DNxHUC');
if (faqIdx !== -1) {
  console.log('\nFAQ snippet:\n', html.slice(faqIdx, faqIdx + 600));
}
