import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/pages_customer-reviews.html', 'utf8');

// Notice each review is inside <li class="loox-review ..."> or <div class="loox-review ...">
// Let's split by loox-review
const rawBlocks = html.split(/class=['"][^'"]*\bloox-review\b[^'"]*['"]/i);
console.log(`Found ${rawBlocks.length - 1} review block segments`);

const cleanReviews = [];

for (let i = 1; i < rawBlocks.length; i++) {
  const block = rawBlocks[i];
  
  // author
  const authorMatch = block.match(/class=['"][^'"]*loox-reviewer-name[^'"]*['"][^>]*>([^<]+)/i);
  const author = authorMatch ? authorMatch[1].trim() : 'Verified Customer';

  // body
  const bodyMatch = block.match(/class=['"][^'"]*loox-review-body[^'"]*['"][^>]*>([\s\S]*?)<\/div>/i);
  let body = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  // date
  const dateMatch = block.match(/class=['"][^'"]*loox-review-date[^'"]*['"][^>]*>([^<]+)/i);
  const date = dateMatch ? dateMatch[1].trim() : '';

  // rating
  const ratingMatch = block.match(/class=['"][^'"]*loox-review-rating[^'"]*['"][^>]*aria-label=['"]([^'"]+)['"]/i);
  const rating = ratingMatch ? ratingMatch[1].trim() : '5/5';

  // product name if any
  const prodMatch = block.match(/class=['"][^'"]*loox-review-product[^'"]*['"][^>]*>([\s\S]*?)<\/div>/i);
  const product = prodMatch ? prodMatch[1].replace(/<[^>]+>/g, '').trim() : 'Turmeric Fade & Glow Bar';

  // photo / image if any
  const imgMatch = block.match(/src=['"](https:\/\/[^'"]*loox[^'"]*(?:jpg|jpeg|png|webp)[^'"]*)['"]/i);
  const image = imgMatch ? imgMatch[1] : null;

  if (body) {
    cleanReviews.push({
      id: i,
      author,
      body,
      date,
      rating,
      product,
      image,
      verified: true
    });
  }
}

console.log(`Successfully parsed ${cleanReviews.length} unique Loox reviews!`);
console.log('Review 1:', cleanReviews[0]);
console.log('Review 2:', cleanReviews[1]);
console.log('Review 3:', cleanReviews[2]);

fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/reviews_harvested.json', JSON.stringify(cleanReviews, null, 2));
