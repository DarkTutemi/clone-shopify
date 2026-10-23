import fs from 'fs';

const data = JSON.parse(fs.readFileSync('all_scraped_reviews.json', 'utf8'));

console.log('--- DETAILED REVIEW SUMMARY BY PRODUCT ---');
const report = {};

for (const [handle, item] of Object.entries(data)) {
  if (item.reviews && item.reviews.length > 0) {
    report[handle] = {
      title: item.title,
      numReviews: item.numReviews,
      extractedCount: item.reviews.length,
      reviews: item.reviews.map(r => ({
        author: r.author,
        rating: r.rating,
        title: r.title,
        body: r.body.slice(0, 80) + '...'
      }))
    };
  }
}

fs.writeFileSync('extracted_reviews_report.json', JSON.stringify(report, null, 2), 'utf8');
console.log('Saved to extracted_reviews_report.json');
console.log('Total handles with extracted reviews:', Object.keys(report).length);
