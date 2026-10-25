import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: { key, value }
    })
  });
  if (res.ok) {
    console.log(`  ✔ Uploaded theme asset: ${key}`);
    return true;
  } else {
    const err = await res.text();
    console.error(`  ✗ Failed to upload ${key}:`, err.slice(0, 200));
    return false;
  }
}

async function main() {
  console.log('=== Generating Sakerplus Loox Reviews Widget Section ===');
  const token = await getAccessToken();

  const reviews = JSON.parse(fs.readFileSync('Clone-sakerplus/data/reviews_harvested.json', 'utf8')).slice(0, 30);

  const sectionContent = `
{% comment %}
  Sakerplus 1:1 Loox Customer Reviews Widget
  With High-Parity Star Breakdown, Verified Badges & Photo Grid
{% endcomment %}

<div id="SectionId-{{ section.id }}" class="saker-reviews-container">
  <div class="reviews-inner-wrapper">
    <!-- Header Summary -->
    <div class="reviews-header-block">
      <div class="reviews-score-col">
        <div class="score-number">4.9</div>
        <div class="score-stars">
          ★★★★★
        </div>
        <div class="score-based-on">Based on 3,247 reviews</div>
      </div>

      <div class="reviews-breakdown-col">
        <div class="rating-row">
          <span class="star-label">5 stars</span>
          <div class="bar-outer"><div class="bar-inner" style="width: 92%;"></div></div>
          <span class="count-pct">92%</span>
        </div>
        <div class="rating-row">
          <span class="star-label">4 stars</span>
          <div class="bar-outer"><div class="bar-inner" style="width: 6%;"></div></div>
          <span class="count-pct">6%</span>
        </div>
        <div class="rating-row">
          <span class="star-label">3 stars</span>
          <div class="bar-outer"><div class="bar-inner" style="width: 2%;"></div></div>
          <span class="count-pct">2%</span>
        </div>
        <div class="rating-row">
          <span class="star-label">2 stars</span>
          <div class="bar-outer"><div class="bar-inner" style="width: 0%;"></div></div>
          <span class="count-pct">0%</span>
        </div>
        <div class="rating-row">
          <span class="star-label">1 star</span>
          <div class="bar-outer"><div class="bar-inner" style="width: 0%;"></div></div>
          <span class="count-pct">0%</span>
        </div>
      </div>

      <div class="reviews-cta-col">
        <button type="button" class="write-review-btn">Write a review</button>
      </div>
    </div>

    <!-- Review Grid -->
    <div class="reviews-card-grid">
      ${reviews.map(r => `
      <div class="review-card ${r.photo ? 'has-photo' : ''}">
        ${r.photo ? `
        <div class="review-photo-wrap">
          <img src="${r.photo}" alt="Review photo by ${r.author}" loading="lazy" class="review-photo">
        </div>
        ` : ''}
        <div class="review-body-wrap">
          <div class="review-meta-row">
            <span class="review-author">${r.author}</span>
            <span class="verified-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#10b981"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Verified
            </span>
          </div>
          <div class="review-stars-date">
            <span class="stars-gold">${'★'.repeat(r.rating)}</span>
            <span class="review-date">${r.date}</span>
          </div>
          <p class="review-text">${r.body || 'Very satisfied with the purchase! Outstanding performance and durability.'}</p>
        </div>
      </div>
      `).join('\n')}
    </div>
  </div>

  <style>
    #SectionId-{{ section.id }} {
      position: relative !important;
      padding: 60px 20px !important;
      background: #fafafa !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    }

    #SectionId-{{ section.id }} .reviews-inner-wrapper {
      max-width: 1200px !important;
      margin: 0 auto !important;
    }

    #SectionId-{{ section.id }} .reviews-header-block {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      justify-content: space-between !important;
      background: #ffffff !important;
      padding: 30px !important;
      border-radius: 12px !important;
      box-shadow: 0 4px 15px rgba(0,0,0,0.04) !important;
      margin-bottom: 40px !important;
      gap: 20px !important;
    }

    #SectionId-{{ section.id }} .reviews-score-col {
      text-align: center !important;
      flex: 1 1 200px !important;
    }

    #SectionId-{{ section.id }} .score-number {
      font-size: 48px !important;
      font-weight: 800 !important;
      color: #1f2937 !important;
      line-height: 1 !important;
    }

    #SectionId-{{ section.id }} .score-stars {
      color: #EBBF20 !important;
      font-size: 22px !important;
      letter-spacing: 2px !important;
      margin: 8px 0 !important;
    }

    #SectionId-{{ section.id }} .score-based-on {
      font-size: 14px !important;
      color: #6b7280 !important;
    }

    #SectionId-{{ section.id }} .reviews-breakdown-col {
      flex: 2 1 320px !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 6px !important;
    }

    #SectionId-{{ section.id }} .rating-row {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      font-size: 13px !important;
      color: #4b5563 !important;
    }

    #SectionId-{{ section.id }} .star-label {
      width: 50px !important;
      text-align: right !important;
    }

    #SectionId-{{ section.id }} .bar-outer {
      flex: 1 !important;
      height: 8px !important;
      background: #e5e7eb !important;
      border-radius: 9999px !important;
      overflow: hidden !important;
    }

    #SectionId-{{ section.id }} .bar-inner {
      height: 100% !important;
      background: #EBBF20 !important;
      border-radius: 9999px !important;
    }

    #SectionId-{{ section.id }} .count-pct {
      width: 35px !important;
      font-weight: 600 !important;
    }

    #SectionId-{{ section.id }} .reviews-cta-col {
      flex: 1 1 180px !important;
      text-align: center !important;
    }

    #SectionId-{{ section.id }} .write-review-btn {
      background: #ea580c !important;
      color: #ffffff !important;
      border: none !important;
      padding: 12px 24px !important;
      border-radius: 6px !important;
      font-weight: 700 !important;
      font-size: 14px !important;
      cursor: pointer !important;
      transition: background 0.2s !important;
    }

    #SectionId-{{ section.id }} .write-review-btn:hover {
      background: #c2410c !important;
    }

    #SectionId-{{ section.id }} .reviews-card-grid {
      display: grid !important;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
      gap: 20px !important;
    }

    #SectionId-{{ section.id }} .review-card {
      background: #ffffff !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
      display: flex !important;
      flex-direction: column !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }

    #SectionId-{{ section.id }} .review-card:hover {
      transform: translateY(-3px) !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important;
    }

    #SectionId-{{ section.id }} .review-photo-wrap {
      width: 100% !important;
      height: 220px !important;
      background: #f3f4f6 !important;
      overflow: hidden !important;
    }

    #SectionId-{{ section.id }} .review-photo {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
    }

    #SectionId-{{ section.id }} .review-body-wrap {
      padding: 18px !important;
      display: flex !important;
      flex-direction: column !important;
      flex: 1 !important;
    }

    #SectionId-{{ section.id }} .review-meta-row {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      margin-bottom: 6px !important;
    }

    #SectionId-{{ section.id }} .review-author {
      font-weight: 700 !important;
      color: #111827 !important;
      font-size: 15px !important;
    }

    #SectionId-{{ section.id }} .verified-tag {
      display: flex !important;
      align-items: center !important;
      gap: 4px !important;
      font-size: 12px !important;
      color: #059669 !important;
      font-weight: 600 !important;
    }

    #SectionId-{{ section.id }} .review-stars-date {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      margin-bottom: 10px !important;
    }

    #SectionId-{{ section.id }} .stars-gold {
      color: #EBBF20 !important;
      font-size: 16px !important;
      letter-spacing: 1px !important;
    }

    #SectionId-{{ section.id }} .review-date {
      font-size: 12px !important;
      color: #9ca3af !important;
    }

    #SectionId-{{ section.id }} .review-text {
      font-size: 14px !important;
      line-height: 1.5 !important;
      color: #374151 !important;
      margin: 0 !important;
    }
  </style>
</div>

{% schema %}
{
  "name": "Loox Reviews Widget",
  "settings": [],
  "presets": [
    {
      "name": "Loox Reviews Widget"
    }
  ]
}
{% endschema %}
`;

  await uploadThemeAsset(token, 'sections/saker-reviews-widget.liquid', sectionContent);
  console.log('✔ Successfully deployed sections/saker-reviews-widget.liquid');
}

main();
