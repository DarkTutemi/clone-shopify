async function test() {
  const res = await fetch('https://trybronoir.com/products/bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes');
  console.log('Product page status:', res.status);
  const html = await res.text();
  const matches = [...html.matchAll(/\/\/trybronoir\.com\/cdn\/shop\/files\/[^"'`\s>]+\.(?:jpg|jpeg|png|webp)/gi)];
  const urls = [...new Set(matches.map(m => 'https:' + m[0]))];
  console.log('Found product images:', urls.length);
  for (const u of urls.slice(0, 10)) {
    const chk = await fetch(u, { method: 'HEAD' });
    console.log(chk.status, u);
  }
}
test().catch(console.error);
