const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function main() {
  const pageRes = await fetch(`https://${SHOP_DOMAIN}/products/livestock-heating-lamp`);
  const pageHtml = await pageRes.text();
  const match = pageHtml.match(/<ul class="wf-payment-list" role="list">([\s\S]*?)<\/ul>/);
  if (match) {
    const titles = [...match[1].matchAll(/<title id="[^"]+">([^<]+)<\/title>/g)].map(m => m[1]);
    console.log('Payment icons currently rendered in wf-payment-list:');
    console.log(titles);
  } else {
    console.log('wf-payment-list not found!');
  }
}

main().catch(console.error);
