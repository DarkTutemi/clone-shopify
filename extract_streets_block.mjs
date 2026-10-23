async function getInfo(url) {
  const res = await fetch(url);
  const html = await res.text();
  const needle = 'custom_info_block_cJKcnQ';
  const idx = html.indexOf(needle);
  if (idx !== -1) {
    const chunk = html.slice(idx - 50, idx + 8000);
    // Find text inside
    console.log(url, 'found length', chunk.length);
    // Extract inner content of custom-info-block
    const startDiv = chunk.indexOf('<div class="custom-info-block');
    const endSec = chunk.indexOf('</div><!-- /shopify-section');
    return chunk.slice(startDiv, endSec);
  }
  return '';
}

async function run() {
  const s = await getInfo('https://trybronoir.com/products/bronoir-streets-casual-everyday-barefoot-shoes-1-1-free');
  console.log('Streets block preview:', s.slice(0, 300));
}
run();
