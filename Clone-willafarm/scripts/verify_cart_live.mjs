async function testCart() {
  const res = await fetch('https://tryzavelyn.com/cart', {
    redirect: 'manual'
  });
  console.log('Status:', res.status);
  console.log('Location header:', res.headers.get('location'));
  const text = await res.text();
  console.log('Contains redirect meta:', text.includes('http-equiv="refresh"'));
  console.log('Contains redirect-home section:', text.includes('redirect-home'));
  console.log('Contains main-cart section:', text.includes('section-main-cart') || text.includes('sections.cart.title') || text.includes('Your Shopping Cart') || text.includes('empty-state'));
  console.log('Contains willaCartDrawer:', text.includes('willaCartDrawer'));
}
testCart().catch(console.error);
