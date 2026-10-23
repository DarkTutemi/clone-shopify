async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();

  function dumpSection(id, label) {
    const start = html.indexOf(id);
    if (start === -1) {
      console.log('Not found:', id);
      return;
    }
    const end = html.indexOf('shopify-section-', start + id.length);
    const chunk = end !== -1 ? html.substring(start, end) : html.substring(start, start + 10000);
    console.log(`\n=================== ${label} ===================`);
    console.log(chunk.substring(0, 4000));
  }

  dumpSection('template--27860728578148__text_with_icons_8JtTK7', 'TEXT_WITH_ICONS_1 (Guarantees/Features)');
  dumpSection('template--27860728578148__custom_newsletter_faq_3NQika', 'FAQ & ACCORDION SECTION');
  dumpSection('template--27860728578148__text_with_icons_wMXk8L', 'TEXT_WITH_ICONS_2 (Trust badges)');
  dumpSection('shopify-section-footer', 'REAL FOOTER');
}
test().catch(console.error);
