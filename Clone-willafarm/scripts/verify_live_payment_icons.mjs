const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function main() {
  const res = await fetch(`https://${SHOP_DOMAIN}/products/livestock-heating-lamp`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  console.log('HTTP Status:', res.status);
  const html = await res.text();
  
  const hasOldImg = html.includes('https://cdn.myshopage.com/32c690d7-b984-40d7-d6a0-62fe13714000.png');
  console.log('Old payment image still exists?', hasOldImg);

  const paymentListMatch = html.match(/<div class="wf-payment-icons">[\s\S]*?<\/div>/);
  if (paymentListMatch) {
    console.log('\nNew Payment Icons Markup:');
    console.log(paymentListMatch[0]);
  } else {
    console.log('Payment icons block not found!');
  }
}

main().catch(console.error);
