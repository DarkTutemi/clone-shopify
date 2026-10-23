async function test() {
  const res = await fetch('https://trybronoir.com/products/bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes');
  const html = await res.text();
  const mediaMatches = [...html.matchAll(/<img[^>]+src=["'](\/\/trybronoir\.com\/cdn\/shop\/files\/[^"']+)["'][^>]*>/gi)];
  console.log('Total img tags matching:', mediaMatches.length);
  for (const m of mediaMatches.slice(0, 15)) {
    const src = 'https:' + m[1];
    const chk = await fetch(src, { method: 'HEAD' });
    if (chk.status === 200) {
      console.log('200:', src);
    }
  }
}
test().catch(console.error);
