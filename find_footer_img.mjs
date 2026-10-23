async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const idx = html.indexOf('footer__image');
  if (idx !== -1) {
    console.log(html.substring(idx - 50, idx + 300));
  }
}
test().catch(console.error);
