async function run() {
  const res = await fetch('https://trybronoir.com/products/bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort');
  const html = await res.text();
  const needle = 'block-template--27860726841444__product-content-cc24334c-2069-4523-ab0c-ab25f4a1ad1f';
  const start = html.lastIndexOf(needle);
  console.log(html.slice(start, start + 1500));
}
run();
