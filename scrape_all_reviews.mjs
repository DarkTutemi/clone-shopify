import fs from 'fs';

const PRODUCT_URLS = [
  "https://trybronoir.com/products/bronoir%E2%84%A2-skin-pro-with-copper-grounding-allround-barefoot-shoes-kopie",
  "https://trybronoir.com/products/bronoir-cosycloud-boot-warm-comfy-winter-barefoot-boot-bogo",
  "https://trybronoir.com/products/hikers-bogo",
  "https://trybronoir.com/products/bronoir%E2%84%A2-flex-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-lift",
  "https://trybronoir.com/products/bronoir%E2%84%A2-freestride-winter-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-arctic-2-0-winter-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-high-pro-winter-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-hike-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-sport-pro-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-fleece-winter-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir-streets-casual-everyday-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-sport-pro-barefoot-shoes-1",
  "https://trybronoir.com/products/bronoir%E2%84%A2-military-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-runner-pro-barefoot-shoes-big-sizes-1-1-gratis",
  "https://trybronoir.com/products/bronoir%E2%84%A2-autumn-2-0-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking",
  "https://trybronoir.com/products/bronoir-air-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir-workers-casual-everyday-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-sports-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-sky-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-snowpiercer-winter-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir-ayelith-lightweight-arch-supportive-walking-sandals",
  "https://trybronoir.com/products/bronoir%E2%84%A2-drifters-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-insulated-winter-barefoot-shoes-1",
  "https://trybronoir.com/products/bronoir%E2%84%A2-limited-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-sports-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-feel-barefoot-shoes",
  "https://trybronoir.com/products/hiking-footwear-high-pro-winter-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-drifters-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-limited-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking-1",
  "https://trybronoir.com/products/bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort",
  "https://trybronoir.com/products/bronoir%E2%84%A2-arctic-2-0-winter-barefoot-shoes-1",
  "https://trybronoir.com/products/bronoir%E2%84%A2-ergo-streets-orthopedic-sneakers-for-pain-free-walking-1",
  "https://trybronoir.com/products/bronoir%E2%84%A2-feel-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-arctic-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-force-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-insulated-winter-barefoot-shoes-2",
  "https://trybronoir.com/products/bronoir%E2%84%A2-vista-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-arctic-2-0-winter-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-insulated-winter-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-lift-elegant-supportive-ballerinas-for-daily-comfort",
  "https://trybronoir.com/products/bronoir%E2%84%A2-flex-barefoot-shoes-limited-spring-offer",
  "https://trybronoir.com/products/bronoir%E2%84%A2-myava-lightweight-arch-supportive-walking-sandals",
  "https://trybronoir.com/products/bronoir%E2%84%A2-stridea-lightweight-arch-supportive-walking-sandals",
  "https://trybronoir.com/products/bronoir%E2%84%A2-skin-pro-with-copper-grounding-allround-barefoot-shoes-buy-2-get-1-free",
  "https://trybronoir.com/products/hikers",
  "https://trybronoir.com/products/bronoir%E2%84%A2-runner-pro-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-military-barefoot-shoes"
];

async function scanAllReviews() {
  const allReviewsData = {};
  console.log(`Starting scan of ${PRODUCT_URLS.length} products...`);

  for (let i = 0; i < PRODUCT_URLS.length; i++) {
    const url = PRODUCT_URLS[i];
    const rawHandle = url.replace('https://trybronoir.com/products/', '');
    const cleanHandle = decodeURIComponent(rawHandle).toLowerCase();

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!res.ok) {
        console.log(`[${i+1}/${PRODUCT_URLS.length}] 404/Error: ${cleanHandle}`);
        continue;
      }
      const html = await res.text();

      // Check for Judge.me widget
      const widgetMatch = html.match(/id=['"]judgeme_product_reviews['"][\s\S]*?>/);
      const avgRating = html.match(/data-average-rating=['"]([^'"]+)['"]/)?.[1] || '4.8';
      const numReviews = html.match(/data-number-of-reviews=['"]([^'"]+)['"]/)?.[1] || '0';
      const prodTitle = html.match(/data-product-title=['"]([^'"]+)['"]/)?.[1] || '';

      // Extract reviews
      const reviews = [];
      const revBlocks = [...html.matchAll(/<div class=['"]jdgm-rev [^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g)];

      for (const m of revBlocks) {
        const block = m[0];
        const author = block.match(/<span class=['"]jdgm-rev__author['"][^>]*>([^<]*)<\/span>/)?.[1]?.trim() || 'Customer';
        const rating = block.match(/data-score=['"](\d+)['"]/)?.[1] || '5';
        const title = block.match(/<b class=['"]jdgm-rev__title['"]>([\s\S]*?)<\/b>/)?.[1]?.trim() || '';
        const body = block.match(/<div class=['"]jdgm-rev__body['"]><p>([\s\S]*?)<\/p><\/div>/)?.[1]?.trim() || '';
        const timestamp = block.match(/datetime=['"]([^'"]+)['"]/)?.[1] || '';
        const verified = block.includes('data-verified-buyer="true"') || block.includes("data-verified-buyer='true'");

        // Photos if any
        const pics = [...block.matchAll(/data-image-url=['"]([^'"]+)['"]/g)].map(p => p[1]);

        if (body || title) {
          reviews.push({
            author,
            rating: parseInt(rating, 10),
            title,
            body,
            timestamp,
            verified,
            pics
          });
        }
      }

      console.log(`[${i+1}/${PRODUCT_URLS.length}] ${cleanHandle} -> Title: "${prodTitle}", Reviews: ${reviews.length}, Count: ${numReviews}`);

      allReviewsData[cleanHandle] = {
        url,
        title: prodTitle,
        avgRating,
        numReviews,
        reviews
      };
    } catch (err) {
      console.error(`Error on ${cleanHandle}:`, err.message);
    }
  }

  fs.writeFileSync('all_scraped_reviews.json', JSON.stringify(allReviewsData, null, 2), 'utf8');
  console.log('Saved all reviews to all_scraped_reviews.json');
}

scanAllReviews();
