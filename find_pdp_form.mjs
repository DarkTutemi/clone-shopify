import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/products_turmeric-glow-soap.html', 'utf8');

const startIdx = html.indexOf('product__form');
if (startIdx !== -1) {
  console.log('Found product__form:');
  console.log(html.substring(startIdx - 100, startIdx + 3000));
} else {
  // search for form[action="/cart/add"]
  const formIdx = html.indexOf('/cart/add');
  console.log('Found /cart/add:');
  console.log(html.substring(formIdx - 200, formIdx + 2000));
}
