async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const secStart = html.indexOf('class="text-with-icons');
  if (secStart !== -1) {
    console.log('--- TEXT WITH ICONS FULL HTML ---');
    console.log(html.substring(secStart - 200, secStart + 3500));
  }

  const footerStart = html.indexOf('<footer');
  if (footerStart !== -1) {
    console.log('--- FOOTER FULL HTML ---');
    console.log(html.substring(footerStart, footerStart + 6000));
  }
}
test().catch(console.error);
