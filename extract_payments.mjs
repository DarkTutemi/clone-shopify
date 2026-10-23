import fs from 'fs';

const content = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/sec_sections--19526978470022__footer.html', 'utf8');
const start = content.indexOf('<ul class="payment-icon-list">');
const end = content.indexOf('</ul>', start) + 5;
if (start !== -1 && end > start) {
  const payHtml = content.slice(start, end);
  fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/payment_icons.html', payHtml);
  console.log('Saved payment_icons.html, length:', payHtml.length);
}
