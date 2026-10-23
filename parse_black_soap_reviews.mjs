import fs from 'fs';

const html = fs.readFileSync('loox_black_soap.html', 'utf8');
const cards = html.split(/<div[^>]*class="[^"]*grid-item[^"]*"[^>]*>/);
const reviews = [];

for (let i = 1; i < cards.length; i++) {
  const card = cards[i];

  // Author
  const authorMatch = card.match(/<div class="title">([^<]+)/i);
  const author = authorMatch ? authorMatch[1].trim() : '';

  // Text via aria-label
  const ariaMatch = card.match(/data-testid="review-[^"]*-text"[^>]*aria-label="([^"]+)"/i);
  let body = ariaMatch ? ariaMatch[1].trim() : '';

  if (!body) {
    const textBlockMatch = card.match(/<div class="text-block">([\s\S]*?)<\/div>/i);
    if (textBlockMatch) {
      body = textBlockMatch[1].replace(/<[^>]+>/g, '').trim();
    }
  }

  // Image
  const imgMatch = card.match(/src="(\/\/images\.loox\.io\/uploads\/[^"]+)"/i) || card.match(/src="([^"]+loox[^"]+)"/i);
  let img = imgMatch ? imgMatch[1] : '';
  if (img.startsWith('//')) img = 'https:' + img;

  if (author && body) {
    reviews.push({
      author,
      body,
      img,
      rating: 5,
      verified: true
    });
  }
}

console.log('Total extracted reviews:', reviews.length);
console.log('Reviews with images:', reviews.filter(r => r.img).length);
if (reviews.length > 0) {
  console.log('Sample 1:', reviews[0]);
  console.log('Sample 2:', reviews[1]);
}

fs.writeFileSync('black_soap_parsed_reviews.json', JSON.stringify(reviews, null, 2));
