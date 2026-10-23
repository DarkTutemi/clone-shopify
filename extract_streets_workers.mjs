async function extractPageDescription(url) {
  const res = await fetch(url);
  const html = await res.text();
  // Extract custom_info_block content
  const start = html.indexOf('class="shopify-section shopify-section--custom-info-block"');
  if (start !== -1) {
    const end = html.indexOf('<!-- /shopify-section', start);
    return html.slice(start, end !== -1 ? end : start + 10000);
  }
  return '';
}

async function run() {
  const streetsHtml = await extractPageDescription('https://trybronoir.com/products/bronoir-streets-casual-everyday-barefoot-shoes-1-1-free');
  const workersHtml = await extractPageDescription('https://trybronoir.com/products/bronoir-workers-casual-everyday-barefoot-shoes-1-1-free');
  console.log('Streets custom info block length:', streetsHtml.length);
  console.log('Workers custom info block length:', workersHtml.length);
}
run();
