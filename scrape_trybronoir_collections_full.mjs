// scrape_trybronoir_collections_full.mjs
import fs from 'fs';

const COLLECTIONS = [
  'winter-collection',
  'socks-and-insoles',
  'barefoot-shoes-bogo-volume',
  'bestsellers'
];

async function scrapeCollection(col) {
  let allProducts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 5) {
    const url = `https://trybronoir.com/collections/${col}?page=${page}`;
    console.log(`Fetching ${url}...`);
    const res = await fetch(url);
    const html = await res.text();

    // Match product cards
    // Each product card on trybronoir has:
    // <a href="/products/..." class="product-item__title">Title</a>
    // Or link in card: <a href="/products/xyz?...">
    const itemRegex = /<a[^>]*href=["']\/products\/([^"'?]+)[^"']*["'][^>]*class=["'][^"']*product-item__title[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    let countInPage = 0;
    while ((match = itemRegex.exec(html)) !== null) {
      const handle = decodeURIComponent(match[1]);
      const title = match[2].replace(/<[^>]*>/g, '').trim();
      if (!allProducts.some(p => p.handle === handle)) {
        allProducts.push({ handle, title });
        countInPage++;
      }
    }

    // If no product-item__title found, fallback to any /products/ link
    if (countInPage === 0) {
      const fallbackRegex = /<a[^>]*href=["']\/products\/([^"'?]+)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
      let fMatch;
      while ((fMatch = fallbackRegex.exec(html)) !== null) {
        const handle = decodeURIComponent(fMatch[1]);
        const text = fMatch[2].replace(/<[^>]*>/g, '').trim();
        if (text && text.length > 5 && !handle.includes('cdn') && !allProducts.some(p => p.handle === handle)) {
          allProducts.push({ handle, title: text });
          countInPage++;
        }
      }
    }

    console.log(`Page ${page}: found ${countInPage} products. Total so far: ${allProducts.length}`);
    if (countInPage === 0 || html.includes('aria-label="Next page"') === false && !html.includes('rel="next"')) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return allProducts;
}

async function main() {
  const result = {};
  for (const c of COLLECTIONS) {
    result[c] = await scrapeCollection(c);
    console.log(`\n✔ Collection ${c}: total ${result[c].length} products extracted.`);
  }
  fs.writeFileSync('trybronoir_collections_extracted.json', JSON.stringify(result, null, 2));
}

main();
