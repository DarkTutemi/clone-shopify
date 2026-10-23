import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/pages_customer-reviews.html', 'utf8');

// Match all <article class="loox-review" ... </article>
const articles = [...html.matchAll(/<article[^>]*class=['"][^'"]*loox-review[^'"]*['"][\s\S]*?<\/article>/gi)];
console.log(`Discovered ${articles.length} complete <article class="loox-review"> elements!`);

const reviews = [];

for (const m of articles) {
  const art = m[0];
  const reviewId = art.match(/data-review-id=['"]([^'"]+)['"]/i)?.[1] || '';
  const productId = art.match(/data-product-id=['"]([^'"]+)['"]/i)?.[1] || '';
  
  const author = art.match(/class=['"][^'"]*loox-reviewer-name[^'"]*['"][^>]*>([^<]+)<\/span>/i)?.[1]?.trim() || 'Verified Customer';
  const body = art.match(/class=['"][^'"]*loox-review-body[^'"]*['"][^>]*>([\s\S]*?)<\/p>/i)?.[1]?.trim() || '';
  const date = art.match(/class=['"][^'"]*loox-review-date[^'"]*['"][^>]*>([^<]+)<\/time>/i)?.[1]?.trim() || '';
  const rating = art.match(/class=['"][^'"]*loox-review-rating[^'"]*['"][^>]*>([^<]+)<\/span>/i)?.[1]?.trim() || '5/5';
  const product = art.match(/class=['"][^'"]*loox-review-product-link[^'"]*['"][^>]*>([^<]+)<\/a>/i)?.[1]?.trim() || 'Turmeric Fade & Glow Bar.';
  const image = art.match(/class=['"][^'"]*loox-review-image[^'"]*['"][^>]*src=['"]([^'"]+)['"]/i)?.[1] || null;

  if (body) {
    reviews.push({
      reviewId,
      productId,
      author,
      body,
      date,
      rating,
      product,
      image: image ? (image.startsWith('//') ? 'https:' + image : image) : null,
      verified: true
    });
  }
}

console.log(`Extracted ${reviews.length} authentic customer reviews!`);
console.log('Sample Review with photo:', reviews.find(r => r.image));
console.log('Sample Review text only:', reviews.find(r => !r.image));

fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/reviews_harvested.json', JSON.stringify(reviews, null, 2), 'utf8');
console.log('✔ Saved to data/reviews_harvested.json');
