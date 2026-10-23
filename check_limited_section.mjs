async function run() {
  const res = await fetch('https://trybronoir.com/products/bronoir%E2%84%A2-limited-barefoot-shoes');
  const html = await res.text();
  const needle = '74a19ff9-cf6d-463a-9fa4-ddc5265b4c57';
  const start = html.indexOf(needle);
  console.log(html.slice(start - 40, start + 2500));
}
run();
