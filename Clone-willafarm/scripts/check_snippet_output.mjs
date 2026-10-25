const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function main() {
  const res = await fetch(`https://${SHOP_DOMAIN}/products/livestock-heating-lamp`);
  const html = await res.text();
  console.log('Page has test snippet?', html.includes('test-payment-container'));
}
main();
