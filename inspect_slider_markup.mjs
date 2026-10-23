async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const idx = html.indexOf('before-after-image-wrapper');
  if (idx !== -1) {
    console.log(html.substring(idx, idx + 4000));
  }
}
test().catch(console.error);
