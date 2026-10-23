import fs from 'fs';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const THEME_ID = '189572219034';

const allReviews = JSON.parse(fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/reviews_harvested.json', 'utf8'));

// Clean unescaped entities
allReviews.forEach(r => {
  r.body = r.body.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
});

const row1 = allReviews.slice(0, 8);
const row2 = allReviews.slice(8, 16);

function cleanText(str) {
  if (!str) return '';
  return str.replace(/"/g, '&quot;').slice(0, 190) + (str.length > 190 ? '...' : '');
}

function renderCard(rev) {
  return `
    <div class="rev-marquee-card">
      <div class="rev-card-photo-wrap">
        <img src="${rev.image}" alt="${rev.author}" loading="lazy" class="rev-card-img" />
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
          <span class="rev-card-author">${rev.author}</span>
          <span class="rev-card-date">${rev.date}</span>
        </div>
        <p class="rev-card-quote">"${cleanText(rev.body)}"</p>
      </div>
    </div>
  `;
}

const track1 = row1.map(renderCard).join('\n');
const track2 = row2.map(renderCard).join('\n');

const liquid = `{% schema %}
{
  "name": "Reviews Marquee (2 Rows)",
  "settings": []
}
{% endschema %}

<section id="earthly-reviews-marquee-section" class="earthly-reviews-marquee-section">
  <div class="rev-marquee-header">
    <span class="rev-marquee-eyebrow">REAL REVIEWS FROM REAL PEOPLE</span>
    <h2 class="rev-marquee-title">Loved by 100,000+ Happy Customers</h2>
    <div class="rev-marquee-rating-badge">
      <div class="rev-badge-stars">
        <svg width="90" height="16" viewBox="0 0 80 14" fill="none">
          <path fill="#F1B948" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/>
          <path fill="#F1B948" transform="translate(16,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/>
          <path fill="#F1B948" transform="translate(32,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/>
          <path fill="#F1B948" transform="translate(48,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/>
          <path fill="#F1B948" transform="translate(64,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/>
        </svg>
      </div>
      <span class="rev-badge-score"><strong>4.9 / 5.0</strong> (based on 30,000+ verified buyers)</span>
    </div>
  </div>

  <div class="rev-marquee-container">
    <!-- Row 1: 8 Reviews scrolling left-to-right -->
    <div class="rev-marquee-row rev-marquee-ltr">
      <div class="rev-marquee-track">
        ${track1}
      </div>
      <div class="rev-marquee-track" aria-hidden="true">
        ${track1}
      </div>
    </div>

    <!-- Row 2: 8 Reviews scrolling left-to-right -->
    <div class="rev-marquee-row rev-marquee-ltr" style="margin-top: 18px;">
      <div class="rev-marquee-track" style="animation-delay: -15s;">
        ${track2}
      </div>
      <div class="rev-marquee-track" aria-hidden="true" style="animation-delay: -15s;">
        ${track2}
      </div>
    </div>
  </div>
</section>

<style>
  .earthly-reviews-marquee-section {
    background-color: #fcfbf7;
    padding: 60px 0 70px;
    overflow: hidden;
    position: relative;
    border-top: 1px solid #edf4eb;
    border-bottom: 1px solid #edf4eb;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .rev-marquee-header {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 36px;
    padding: 0 20px;
  }

  .rev-marquee-eyebrow {
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: #2c5801;
    text-transform: uppercase;
    display: block;
    margin-bottom: 8px;
  }

  .rev-marquee-title {
    font-size: 34px;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.25;
    margin: 0 0 14px;
  }

  .rev-marquee-rating-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #ffffff;
    padding: 8px 18px;
    border-radius: 999px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border: 1px solid #e5ecd2;
  }

  .rev-badge-score {
    font-size: 13.5px;
    color: #333333;
  }

  .rev-badge-score strong {
    color: #2c5801;
    font-weight: 700;
  }

  .rev-marquee-container {
    width: 100%;
    overflow: hidden;
    position: relative;
    mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
  }

  .rev-marquee-row {
    display: flex;
    overflow: hidden;
    user-select: none;
    width: 100%;
  }

  .rev-marquee-row:hover .rev-marquee-track {
    animation-play-state: paused;
  }

  /* Left-to-Right Animation */
  .rev-marquee-ltr .rev-marquee-track {
    display: flex;
    gap: 16px;
    animation: marquee-scroll-ltr 38s linear infinite;
    flex-shrink: 0;
    padding-left: 16px;
  }

  @keyframes marquee-scroll-ltr {
    0% {
      transform: translateX(-50%);
    }
    100% {
      transform: translateX(0%);
    }
  }

  .rev-marquee-card {
    width: 320px;
    flex-shrink: 0;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e8efe4;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .rev-marquee-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(44, 88, 1, 0.12);
    border-color: #2c5801;
  }

  .rev-card-photo-wrap {
    position: relative;
    width: 100%;
    height: 190px;
    background: #f4f6f0;
    overflow: hidden;
  }

  .rev-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .rev-verified-pill {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(44, 88, 1, 0.92);
    color: #ffffff;
    font-size: 10.5px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 20px;
    letter-spacing: 0.3px;
    backdrop-filter: blur(4px);
  }

  .rev-card-details {
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .rev-card-stars svg {
    display: block;
    margin-bottom: 8px;
  }

  .rev-card-author-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .rev-card-author {
    font-size: 13.5px;
    font-weight: 700;
    color: #1a1a1a;
  }

  .rev-card-date {
    font-size: 11px;
    color: #888888;
  }

  .rev-card-quote {
    font-size: 12.5px;
    color: #444444;
    line-height: 1.5;
    margin: 0;
    font-style: normal;
  }

  @media (max-width: 768px) {
    .earthly-reviews-marquee-section {
      padding: 40px 0 50px;
    }
    .rev-marquee-title {
      font-size: 25px;
    }
    .rev-marquee-card {
      width: 270px;
    }
    .rev-card-photo-wrap {
      height: 160px;
    }
  }
</style>
`;

fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-reviews.liquid', liquid);

async function getAccessToken() {
  const tokenRes = await fetch('https://' + SHOP_DOMAIN + '/admin/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function uploadFile(token, relPath, content) {
  const uploadRes = await fetch('https://' + SHOP_DOMAIN + '/admin/api/2024-01/themes/' + THEME_ID + '/assets.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: relPath,
        value: content
      }
    })
  });
  const uploadData = await uploadRes.json();
  console.log('Uploaded ' + relPath + ':', uploadData.asset ? 'SUCCESS' : uploadData);
}

async function run() {
  const token = await getAccessToken();
  await uploadFile(token, 'sections/earthly-reviews.liquid', fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-reviews.liquid', 'utf8'));
}

run();
