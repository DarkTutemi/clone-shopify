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

async function checkReviewsCoverage() {
  const results = [];
  for (let i = 0; i < 15; i++) {
    const url = PRODUCT_URLS[i];
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!res.ok) {
        results.push({ url, status: res.status });
        continue;
      }
      const html = await res.text();
      const hasJdgm = html.includes('judgeme_product_reviews');
      const hasReviewsSection = html.includes('Customer Reviews');
      const revMatches = [...html.matchAll(/class=['"]jdgm-rev /g)];
      const avgRating = html.match(/data-average-rating=['"]([^'"]+)['"]/)?.[1];
      const count = html.match(/data-number-of-reviews=['"]([^'"]+)['"]/)?.[1];

      results.push({
        url: url.replace('https://trybronoir.com/products/', ''),
        status: 200,
        hasJdgm,
        hasReviewsSection,
        revElements: revMatches.length,
        avgRating,
        count
      });
    } catch (e) {
      results.push({ url, error: e.message });
    }
  }
  console.table(results);
}

checkReviewsCoverage();
