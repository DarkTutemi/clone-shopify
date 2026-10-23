async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();

  const id = 'template--27860728578148__text_with_icons_wMXk8L';
  const start = html.indexOf(id);
  if (start !== -1) {
    const end = html.indexOf('shopify-section-footer', start);
    console.log('--- TRUST ICONS SECTION (wMXk8L) ---');
    console.log(html.substring(start, end));
  }

  // Find the real HTML footer: look for <footer class="footer
  const fStart = html.indexOf('<footer\n  class="footer');
  const fStartAlt = fStart === -1 ? html.indexOf('<footer class="footer') : fStart;
  console.log('footer class="footer pos:', fStart, fStartAlt);
  const actualFooterPos = fStart !== -1 ? fStart : fStartAlt;
  if (actualFooterPos !== -1) {
    const fEnd = html.indexOf('</footer>', actualFooterPos);
    console.log('--- REAL BRONOIR FOOTER HTML ---');
    console.log(html.substring(actualFooterPos, fEnd + 9));
  }
}
test().catch(console.error);
