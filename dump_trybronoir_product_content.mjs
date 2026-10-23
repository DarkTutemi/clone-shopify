async function dumpProductContent() {
  const res = await fetch('https://trybronoir.com/products/bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort');
  const html = await res.text();
  const start = html.indexOf('class="shopify-section shopify-section--product-content"');
  if (start === -1) {
    console.log('Not found');
    return;
  }
  const sectionHtml = html.slice(start - 50, start + 8000);
  console.log(sectionHtml.slice(0, 3000));
}
dumpProductContent();
