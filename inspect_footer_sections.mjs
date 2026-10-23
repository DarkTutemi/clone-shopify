async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const secIdx = html.indexOf('shopify-section-template--27860728578148__text_with_icons_wMXk8L');
  if (secIdx !== -1) {
    console.log('--- TEXT WITH ICONS SECTION ---');
    console.log(html.substring(secIdx, secIdx + 6000));
  }
  const footerIdx = html.indexOf('shopify-section-footer');
  if (footerIdx !== -1) {
    console.log('--- FOOTER SECTION ---');
    console.log(html.substring(footerIdx, footerIdx + 6000));
  }
}
test().catch(console.error);
