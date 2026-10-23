async function dumpTabMarkup() {
  const res = await fetch('https://trybronoir.com/products/bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort');
  const html = await res.text();
  const start = html.indexOf('class="shopify-section shopify-section--product-content"');
  const end = html.indexOf('<!-- /shopify-section', start);
  console.log(html.slice(start, start + 3500));
}
dumpTabMarkup();
