async function fetchAndCompare(handle) {
  const url = `https://trybronoir.com/products/${handle}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`Failed to fetch ${url} (${res.status})`);
    return;
  }
  const html = await res.text();
  console.log(`\n============================ ${handle} ============================`);

  // 1. Get raw description from product json in html
  const jsonMatch = html.match(/<script type="application\/json" id="ProductJson-[^"]*">([\s\S]*?)<\/script>/) ||
                    html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

  // 2. Extract product-content tab description
  const descMatch = html.match(/<div class="product-tabs__tab-item-content rte">([\s\S]*?)<\/div>\s*<\/div>/);
  if (descMatch) {
    console.log(`[Found product-tabs Description] Length: ${descMatch[1].length}`);
    console.log(descMatch[1].slice(0, 400).replace(/\s+/g, ' '));
  } else {
    console.log('[No product-tabs Description found directly]');
  }

  // 3. Extract all text sections between main product and footer
  const mainIdx = html.indexOf('class="shopify-section shopify-section--main-product"');
  const footerIdx = html.indexOf('class="shopify-section shopify-section--footer"');
  if (mainIdx !== -1 && footerIdx !== -1) {
    const middleHtml = html.slice(mainIdx, footerIdx);
    const sections = [...middleHtml.matchAll(/id="shopify-section-([^"]+)"/g)].map(m => m[1]);
    console.log('Sections present:', sections);
  }
}

async function run() {
  await fetchAndCompare('bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort');
  await fetchAndCompare('bronoir%E2%84%A2-limited-barefoot-shoes');
  await fetchAndCompare('bronoir%E2%84%A2-force-barefoot-shoes');
  await fetchAndCompare('bronoir%E2%84%A2-vista-barefoot-shoes');
}
run();
