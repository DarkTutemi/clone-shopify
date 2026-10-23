async function main() {
  const res = await fetch('https://trybronoir.com/collections/bestsellers');
  const html = await res.text();
  console.log('Bestsellers status:', res.status);
  
  // Find all product links in bestsellers collection
  const prods = [...html.matchAll(/href=["'](\/products\/[^"']+)["']/gi)];
  const urls = [...new Set(prods.map(p => p[1]))];
  console.log('Product URLs in bestsellers:', urls);
}
main();
