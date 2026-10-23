import fs from 'fs';

async function check4Products() {
  const products = [
    { name: 'Nola', url: 'https://trybronoir.com/products/bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort' },
    { name: 'Limited', url: 'https://trybronoir.com/products/bronoir%E2%84%A2-limited-barefoot-shoes' },
    { name: 'Force', url: 'https://trybronoir.com/products/bronoir%E2%84%A2-force-barefoot-shoes' },
    { name: 'Vista', url: 'https://trybronoir.com/products/bronoir%E2%84%A2-vista-barefoot-shoes' },
    { name: 'Warmers', url: 'https://trybronoir.com/products/bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking' }
  ];

  for (const p of products) {
    const res = await fetch(p.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const prodId = html.match(/"id":\s*(\d{10,})/)?.[1];
    const jdgmWidget = html.match(/id=['"]judgeme_product_reviews['"]/);
    const avgRating = html.match(/data-average-rating=['"]([^'"]+)['"]/)?.[1];
    const numReviews = html.match(/data-number-of-reviews=['"]([^'"]+)['"]/)?.[1];
    const revCount = (html.match(/class=['"]jdgm-rev /g) || []).length;
    
    console.log(`Product: ${p.name}`);
    console.log(`  URL: ${p.url}`);
    console.log(`  Shopify Product ID: ${prodId}`);
    console.log(`  Has JDGM widget: ${!!jdgmWidget}`);
    console.log(`  avgRating: ${avgRating}, numReviews: ${numReviews}, renderedReviews: ${revCount}`);
  }
}

check4Products();
