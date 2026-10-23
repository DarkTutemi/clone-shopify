async function test() {
  const res = await fetch('https://trybronoir.com/products/bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes.js');
  console.log('Product JS status:', res.status);
  const data = await res.json();
  console.log('Featured image:', data.featured_image);
  console.log('Images:', data.images);
}
test().catch(console.error);
