import fs from 'fs';

const blackSoapReviews = JSON.parse(fs.readFileSync('black_soap_parsed_reviews.json', 'utf8'));

// Format reviews for marquee
// Take first 16 photo reviews: 8 for row 1, 8 for row 2
const row1 = blackSoapReviews.slice(0, 8);
const row2 = blackSoapReviews.slice(8, 16);

function renderReviewCards(reviewsList) {
  return reviewsList.map(r => `
    <div class="rev-marquee-card">
      <div class="rev-card-photo-wrap">
        <img src="${r.img}" alt="${r.author}" loading="lazy" class="rev-card-img" />
        <span class="rev-verified-pill">✓ Verified</span>
      </div>
      <div class="rev-card-details">
        <div class="rev-card-stars">
          <svg width="74" height="13" viewBox="0 0 80 14" fill="none">
            <path fill="#F1B948" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/>
            <path fill="#F1B948" transform="translate(16,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/>
            <path fill="#F1B948" transform="translate(32,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/>
            <path fill="#F1B948" transform="translate(48,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/>
            <path fill="#F1B948" transform="translate(64,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/>
          </svg>
        </div>
        <div class="rev-card-author-row">
          <span class="rev-card-author">${r.author}</span>
          <span class="rev-card-date">Verified Buyer</span>
        </div>
        <p class="rev-card-quote">"${r.body.replace(/"/g, '&quot;').slice(0, 180)}..."</p>
      </div>
    </div>
  `).join('\n');
}

console.log('Row 1 reviews:', row1.length, 'Row 2 reviews:', row2.length);

// -------------------------------------------------------------
// 1. UPDATE earthly-reviews.liquid with Black Soap conditionals
// -------------------------------------------------------------
let earthlyReviewsContent = fs.readFileSync('Clone-earthlyderm/sections/earthly-reviews.liquid', 'utf8');

// We can wrap the rows with handle checks
const row1BlackHtml = renderReviewCards(row1);
const row2BlackHtml = renderReviewCards(row2);

// In earthly-reviews.liquid, find row 1 track content
// Instead of replacing raw html, let's create dynamic liquid snippets or conditionals
console.log('Reviews file length before:', earthlyReviewsContent.length);

fs.writeFileSync('black_soap_row1.html', row1BlackHtml);
fs.writeFileSync('black_soap_row2.html', row2BlackHtml);
console.log('Saved row1 and row2 snippets');
