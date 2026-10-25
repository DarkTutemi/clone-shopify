async function check() {
  const res = await fetch('https://dsdujr-vn.myshopify.com/products/sakerplus-fence-post-repair-kit', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  const lines = html.split('\n');
  lines.forEach((l, i) => {
    // Only check user-visible text (exclude script, link, and tag names like <zavelyn-)
    if (l.includes('Zavelyn') && !l.includes('zavelyn-') && !l.includes('tryzavelyn') && !l.includes('Shopify.theme')) {
      console.log(`L${i+1}: ${l.trim().slice(0, 150)}`);
    }
  });
}
check();
