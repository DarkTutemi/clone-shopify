import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/loox_fence_post.html', 'utf8');

const cardRegex = /<div[^>]*data-id=["']([^"']+)["'][^>]*class=["'][^"']*grid-item-wrap[^"']*["'][\s\S]*?(?=(?:<div[^>]*data-id=|$))/gi;
const cards = [...html.matchAll(cardRegex)];
console.log('Cards found:', cards.length);

const parsed = [];
for (const card of cards) {
  const raw = card[0];
  const id = card[1];

  const authorMatch = raw.match(/data-testid=["']review-[^"']*-title["'][^>]*>([^<]+)/i);
  const author = authorMatch ? authorMatch[1].trim() : 'Verified Customer';

  const ratingMatch = raw.match(/Rating icons:\s*(\d+)\s*\/\s*5\s*star/i);
  const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 5;

  const timeMatch = raw.match(/data-time=['"](\d+)['"]/i);
  const timestamp = timeMatch ? parseInt(timeMatch[1], 10) : Date.now();
  const dateStr = new Date(timestamp).toISOString().split('T')[0];

  const imgMatch = raw.match(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']/i);
  let photo = null;
  let productName = '';
  if (imgMatch) {
    photo = imgMatch[1].startsWith('//') ? 'https:' + imgMatch[1] : imgMatch[1];
    productName = imgMatch[2].replace(/^Customer photo review of\s*/i, '').trim();
  }

  const bodyMatch = raw.match(/class=["'][^"']*main-text[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  let body = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  if (body || photo) {
    parsed.push({ id, author, rating, date: dateStr, body, photo, productName });
  }
}

console.log('Parsed valid reviews:', parsed.length);
console.log('Sample parsed reviews:');
parsed.slice(0, 5).forEach((r, i) => console.log(` ${i + 1}. [${r.rating}★] ${r.author} (${r.date}): "${r.body.slice(0, 80)}..."`));

fs.writeFileSync('Clone-sakerplus/data/fence_post_reviews.json', JSON.stringify(parsed, null, 2));
console.log('Saved to Clone-sakerplus/data/fence_post_reviews.json');
