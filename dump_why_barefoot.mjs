async function run() {
  const res = await fetch('https://trybronoir.com/products/bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort');
  const html = await res.text();
  const needle = 'Why Barefoot Shoes?';
  const start = html.indexOf(needle);
  const end = html.indexOf('shopify-section-template--27860726841444__169865549878c62209');
  console.log(html.slice(start, end));
}
run();
