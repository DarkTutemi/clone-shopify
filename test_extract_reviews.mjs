import fs from 'fs';

async function extractProductReviews(handle) {
  const url = `https://trybronoir.com/products/${encodeURIComponent(handle)}`;
  console.log(`Fetching: ${url}`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  if (!res.ok) {
    console.log(`Failed to fetch ${url}: ${res.status}`);
    return null;
  }
  const text = await res.text();
  
  // Find judgeme review widget or customer reviews section
  const widgetStart = text.indexOf('id=\'judgeme_product_reviews\'') !== -1 ? text.indexOf('id=\'judgeme_product_reviews\'') : text.indexOf('id="judgeme_product_reviews"');
  if (widgetStart === -1) {
    console.log('No judgeme_product_reviews widget found');
    return null;
  }

  // Find enclosing container or section
  const sectionStart = text.lastIndexOf('<div id="shopify-section-', widgetStart);
  let sectionEnd = text.indexOf('<!-- END sections: apps -->', widgetStart);
  if (sectionEnd === -1) {
    sectionEnd = text.indexOf('</section>', widgetStart);
  }
  if (sectionEnd === -1) {
    sectionEnd = widgetStart + 15000;
  }

  const snippet = text.slice(Math.max(0, sectionStart), sectionEnd);

  // Extract review items
  const reviews = [];
  const revMatches = text.matchAll(/<div class=['"]jdgm-rev [^>]*>([\s\S]*?)<\/div><\/div><\/div>/g);
  for (const match of text.matchAll(/<div class=['"]jdgm-rev [^']*'([^>]*)>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g)) {
    const revContent = match[0];
    const author = revContent.match(/<span class=['"]jdgm-rev__author['"][^>]*>([^<]*)<\/span>/)?.[1] || '';
    const rating = revContent.match(/data-score=['"](\d+)['"]/)?.[1] || '5';
    const body = revContent.match(/<div class=['"]jdgm-rev__body['"]><p>([\s\S]*?)<\/p><\/div>/)?.[1] || '';
    const title = revContent.match(/<b class=['"]jdgm-rev__title['"]>([\s\S]*?)<\/b>/)?.[1] || '';
    const date = revContent.match(/datetime=['"]([^'"]+)['"]/)?.[1] || '';
    reviews.push({ author, rating, title, body, date });
  }

  // Extract summary
  const avgRating = text.match(/data-average-rating=['"]([^'"]+)['"]/)?.[1];
  const numReviews = text.match(/data-number-of-reviews=['"]([^'"]+)['"]/)?.[1];

  console.log(`Handle: ${handle}`);
  console.log(`Average rating: ${avgRating}, Number of reviews: ${numReviews}`);
  console.log(`Extracted reviews count: ${reviews.length}`);
  if (reviews.length > 0) {
    console.log('Sample review:', reviews[0]);
  }
  return { avgRating, numReviews, reviews, widgetStart };
}

async function run() {
  const handles = [
    'bronoir™-limited-barefoot-shoes',
    'bronoir™-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort',
    'bronoir-force-barefoot-shoes',
    'bronoir-vista-barefoot-shoes',
    'bronoir™-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking',
    'bronoir™-skin-pro-bogo-insoles-2',
    'bronoir-spring-pro-barefoot-shoes'
  ];

  for (const h of handles) {
    await extractProductReviews(h);
    console.log('--------------------------------------------------');
  }
}

run();
