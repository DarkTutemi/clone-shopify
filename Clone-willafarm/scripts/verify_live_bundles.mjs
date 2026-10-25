const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function main() {
  const res = await fetch(`https://${SHOP_DOMAIN}/products/livestock-heating-lamp`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  const html = await res.text();

  const bundlesMatch = [...html.matchAll(/<div class="wf-bundle-card[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g)];
  console.log('Total bundle cards rendered on live page:', bundlesMatch.length);

  bundlesMatch.forEach((b, i) => {
    const badge = b[1].match(/class="wf-bundle-badge[^"]*">([^<]+)<\/div>/);
    const title = b[1].match(/class="wf-bundle-name">([^<]+)<\/div>/);
    const currentPrice = b[1].match(/class="wf-price-current">([^<]+)<\/span>/);
    const comparePrice = b[1].match(/class="wf-price-compare">([^<]+)<\/span>/);
    console.log(`Bundle ${i + 1}:`);
    console.log(`  Title: ${title ? title[1] : 'N/A'}`);
    console.log(`  Badge: ${badge ? badge[1] : 'N/A'}`);
    console.log(`  Current Price: ${currentPrice ? currentPrice[1] : 'N/A'}`);
    console.log(`  Compare Price: ${comparePrice ? comparePrice[1] : 'None'}`);
  });
}

main().catch(console.error);
