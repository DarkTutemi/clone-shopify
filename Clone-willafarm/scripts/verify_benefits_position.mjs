const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function main() {
  const res = await fetch(`https://${SHOP_DOMAIN}/products/livestock-heating-lamp`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  console.log('HTTP Status:', res.status);
  const html = await res.text();

  // Check gallery column
  const galleryColMatch = html.match(/<div class="wf-gallery-col">([\s\S]*?)<\/div>\s*<!-- Buy Box/);
  if (galleryColMatch) {
    const hasBenefitsInGallery = galleryColMatch[1].includes('wf-benefits-card');
    console.log('Gallery column has wf-benefits-card?', hasBenefitsInGallery);
  }

  // Check buybox column order
  const paymentIdx = html.indexOf('class="wf-payment-icons"');
  const benefitsIdx = html.indexOf('class="wf-benefits-card"');
  console.log('Payment index:', paymentIdx, 'Benefits index:', benefitsIdx);
  if (benefitsIdx > paymentIdx && paymentIdx !== -1) {
    console.log('✔ SUCCESS: wf-benefits-card is positioned AFTER wf-payment-icons!');
  } else {
    console.log('✖ ERROR: Incorrect position!');
  }
}

main().catch(console.error);
