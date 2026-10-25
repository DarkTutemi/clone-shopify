async function check() {
  const res = await fetch('https://dsdujr-vn.myshopify.com/collections/best-sellers');
  const html = await res.text();
  console.log('HTTP Status:', res.status);
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  console.log('Page Title / H1:', h1 ? h1[1].trim() : 'N/A');
  const cards = (html.match(/class="product-card/g) || []).length;
  console.log('Product cards found:', cards);
  console.log('Contains Zavelyn Foot Sleeve:', html.toLowerCase().includes('foot sleeve'));
  console.log('Contains Sakerplus products:', html.includes('sakerplus') || html.includes('Sakerplus'));
}
check();
