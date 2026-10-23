async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const idx = html.indexOf('4 Weeks with Bronoir');
  if (idx !== -1) {
    console.log('--- 4 WEEKS SLIDER HTML ---');
    console.log(html.substring(idx - 300, idx + 4000));
  }
}
test().catch(console.error);
