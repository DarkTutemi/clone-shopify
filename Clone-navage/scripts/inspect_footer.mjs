import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');
const footerSectionStart = html.indexOf('id="shopify-section-sections--27702862315800__footer"');
const footerHtml = html.substring(footerSectionStart, footerSectionStart + 35000);

console.log('Footer snippet length:', footerHtml.length);
const footerTag = footerHtml.match(/<footer[\s\S]*?<\/footer>/i);
if (footerTag) {
  console.log('Footer tag length:', footerTag[0].length);
  console.log('Footer preview:\n', footerTag[0].substring(0, 800));
}
