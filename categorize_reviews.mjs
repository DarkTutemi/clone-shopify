import fs from 'fs';

const data = JSON.parse(fs.readFileSync('all_scraped_reviews.json', 'utf8'));

// 1. Group reviews by product
const productReviews = {};
const shopFallbackReviews = [];

for (const [handle, item] of Object.entries(data)) {
  if (item.numReviews === '12951') {
    // This is shop fallback
    if (shopFallbackReviews.length === 0) {
      shopFallbackReviews.push(...item.reviews);
    }
  } else if (item.reviews && item.reviews.length > 0) {
    productReviews[handle] = {
      title: item.title,
      numReviews: item.numReviews,
      avgRating: item.avgRating,
      reviews: item.reviews
    };
  }
}

console.log('Products with dedicated reviews:', Object.keys(productReviews));
console.log('Shop fallback reviews count:', shopFallbackReviews.length);

// Print samples of product reviews
for (const [h, p] of Object.entries(productReviews)) {
  console.log(`\n=== ${h} (${p.title}) === [Total: ${p.numReviews}]`);
  p.reviews.forEach((r, idx) => {
    console.log(`  [${idx+1}] ${r.author} (${r.rating}★): "${r.body.replace(/\n/g, ' ').slice(0, 70)}"`);
  });
}
