import fs from 'fs';
import path from 'path';

const OUTPUT_FILE = 'Clone-sakerplus/data/reviews_harvested.json';
const LOOX_APP_ID = '7GiGt8f0rB';

async function fetchPage(page) {
  const url = `https://loox.io/widget/${LOOX_APP_ID}/reviews?limit=50&page=${page}&language=en`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (e) {
    return null;
  }
}

function parseReviews(html) {
  const items = [];
  const cardRegex = /<div[^>]*data-id=["']([^"']+)["'][^>]*class=["'][^"']*grid-item-wrap[^"']*["'][\s\S]*?(?=(?:<div[^>]*data-id=|$))/gi;
  const cards = [...html.matchAll(cardRegex)];

  for (const card of cards) {
    const raw = card[0];
    const id = card[1];

    // Author
    const authorMatch = raw.match(/data-testid=["']review-[^"']*-title["'][^>]*>([^<]+)/i);
    const author = authorMatch ? authorMatch[1].trim() : 'Verified Customer';

    // Rating
    const ratingMatch = raw.match(/Rating icons:\s*(\d+)\s*\/\s*5\s*star/i);
    const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 5;

    // Date
    const timeMatch = raw.match(/data-time=['"](\d+)['"]/i);
    const timestamp = timeMatch ? parseInt(timeMatch[1], 10) : Date.now();
    const dateStr = new Date(timestamp).toISOString().split('T')[0];

    // Image
    const imgMatch = raw.match(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']/i);
    let photo = null;
    let productName = '';
    if (imgMatch) {
      photo = imgMatch[1].startsWith('//') ? 'https:' + imgMatch[1] : imgMatch[1];
      productName = imgMatch[2].replace(/^Customer photo review of\s*/i, '').trim();
    }

    // Body text
    const bodyMatch = raw.match(/class=["'][^"']*main-text[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
    let body = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    if (body || photo) {
      items.push({
        id,
        author,
        rating,
        date: dateStr,
        timestamp,
        body,
        photo,
        productName
      });
    }
  }

  return items;
}

async function main() {
  console.log('Harvesting Loox reviews...');
  const allReviews = [];
  const MAX_PAGES = 8; // Fetch 8 pages (up to 400 reviews)

  for (let page = 1; page <= MAX_PAGES; page++) {
    const html = await fetchPage(page);
    if (!html) break;
    const reviews = parseReviews(html);
    if (reviews.length === 0) break;
    allReviews.push(...reviews);
    console.log(`  Page ${page}: extracted ${reviews.length} reviews (Total: ${allReviews.length})`);
  }

  // De-duplicate by id
  const seen = new Set();
  const uniqueReviews = allReviews.filter(r => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueReviews, null, 2));
  console.log(`\nSuccessfully saved ${uniqueReviews.length} unique reviews to ${OUTPUT_FILE}`);
}

main();
