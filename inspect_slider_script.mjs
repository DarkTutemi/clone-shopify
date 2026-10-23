async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const idx = html.indexOf('class="before-after__cursor');
  if (idx !== -1) {
    console.log(html.substring(idx - 200, idx + 3000));
  }
}
test().catch(console.error);
