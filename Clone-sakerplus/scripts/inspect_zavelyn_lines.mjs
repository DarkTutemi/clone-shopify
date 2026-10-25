async function test() {
  const res = await fetch('https://dsdujr-vn.myshopify.com/pages/news-sakerplus-fence-post-repair-kit');
  const html = await res.text();
  const visibleHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/data-theme-name="[^"]*"/gi, '')
    .replace(/Shopify\.theme\s*=\s*\{[^}]*\}/gi, '')
    .replace(/zavelyn-[a-z0-9-]+/gi, '')
    .replace(/tryzavelyn\.com/gi, '');

  const lines = visibleHtml.split('\n');
  lines.forEach((l, i) => {
    if (l.toLowerCase().includes('zavelyn')) {
      console.log('Line ' + (i+1) + ': ' + l.trim().slice(0, 200));
    }
  });
}
test();
