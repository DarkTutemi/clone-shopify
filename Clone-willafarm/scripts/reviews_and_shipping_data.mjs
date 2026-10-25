import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (res.ok) console.log(`  ✔ Uploaded: ${key}`);
  else console.error(`  ✗ Failed: ${key}`, JSON.stringify(data.errors || data));
}

// 10 Detailed reviews for Livestock Heating Lamp
const HEATING_LAMP_REVIEWS = [
  {
    author: "Kimberly D.",
    location: "Texas",
    verified: true,
    date: "Verified 3 days ago",
    headline: "First winter season with 100% chick survival rate!",
    review: "I installed this heating lamp in our brooder shed for the winter hatch. With it, all 24 chicks are warm, active, and thriving. The digital temperature display makes it effortless to monitor, and I love that it shuts off automatically once the target 90°F warmth is reached.",
    photo_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-livestock-warmth.jpg?v=1792853604"
  },
  {
    author: "Marcus V.",
    location: "Ohio",
    verified: true,
    date: "Verified 5 days ago",
    headline: "No more sleepless nights worrying about coop fires",
    review: "Had a terrifying scare last winter when an old clamp heat lamp slipped into dry pine shavings. Thank God I caught it in time. Swapped everything to Zavelyn® immediately. Cool to the touch exterior, zero fire risk, and the chicks sleep peacefully without pecking.",
    photo_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-fireproof-safety.jpg?v=1792853601"
  },
  {
    author: "Sarah L.",
    location: "Missouri",
    verified: true,
    date: "Verified 1 week ago",
    headline: "The built-in digital thermostat is worth its weight in gold",
    review: "I set it to 32°C (90°F) and go to bed with complete peace of mind. No more getting up at 2 AM in freezing weather to check the brooder. It maintains the heat accurately within 1 degree. Highly recommend the 2-pack or 3-pack!",
    photo_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-card-temp.jpg?v=1792853606"
  },
  {
    author: "Jason B.",
    location: "Oregon",
    verified: true,
    date: "Verified 1 week ago",
    headline: "Great for ducklings and small animals",
    review: "Raised two batches of ducklings under this lamp this year. The gentle ambient light lets them sleep normally without the blinding red glare that causes aggression and cannibalism. Super simple screw-in installation and excellent build quality.",
    photo_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-card-setup.jpg?v=1792853608"
  },
  {
    author: "Tyler R.",
    location: "Pennsylvania",
    verified: true,
    date: "Verified 2 weeks ago",
    headline: "Unbelievable difference in our brooder barn",
    review: "Standard heat bulbs keep burning out or get too hot in the center. The Zavelyn spreads an even, gentle thermal cone. The heavy-duty switch cord made hanging it over our pen extremely easy and secure.",
    photo_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-card-monitor.jpg?v=1792853607"
  },
  {
    author: "Eleanor P.",
    location: "Kentucky",
    verified: true,
    date: "Verified 2 weeks ago",
    headline: "Saved our baby chicks during an unexpected frost",
    review: "Temperatures dropped to 18°F outside overnight. This lamp held the brooder temperature rock solid. The chicks were huddled contently right under the warmth, not panting and not shivering. An absolute must-have homestead tool.",
    photo_url: ""
  },
  {
    author: "Brandon K.",
    location: "Iowa",
    verified: true,
    date: "Verified 3 weeks ago",
    headline: "Replaced 4 old red clamp lamps — energy bill dropped noticeably",
    review: "Because it only draws power when heating and auto-cycles off, our barn electricity bill dropped by over $40 in the first month alone. Plus, my wife doesn't worry every night about the barn burning down.",
    photo_url: ""
  },
  {
    author: "Hannah & David M.",
    location: "Wisconsin",
    verified: true,
    date: "Verified 3 weeks ago",
    headline: "Perfect for our newborn goat kids & nursery pen",
    review: "We used this in our kidding stall when our Nigerian Dwarf had triplets in mid-January. It gave them a warm, safe corner to dry off and sleep without being so hot that they couldn't touch it. Sturdy build and very well sealed against dust.",
    photo_url: ""
  },
  {
    author: "Rachel T.",
    location: "Tennessee",
    verified: true,
    date: "Verified 1 month ago",
    headline: "Soft amber glow eliminates pecking completely",
    review: "With traditional 250W red heat lamps, our chicks were always hyperactive and picking at each other's wings. Under this gentle soft glow, they settled into a natural sleep cycle within 24 hours. They look healthier and feathering out much better.",
    photo_url: ""
  },
  {
    author: "Wayne S.",
    location: "Montana",
    verified: true,
    date: "Verified 1 month ago",
    headline: "Fast FedEx delivery, well packaged, ordered 3 more",
    review: "Ordered the 3-Pack with switch cords. FedEx brought them in 3 business days in heavy duty bubble protection. Screwed them right into our fixtures, set the thermostat, and walked away. Outstanding product and service.",
    photo_url: ""
  }
];

// Shipping & Delivery HTML Block (with both user-specified images)
const SHIPPING_HTML = `
  <!-- SHIPPING & DELIVERY GUARANTEE SECTION (Directly before Customer Reviews) -->
  <section class="wf-section wf-shipping-section">
    <div class="wf-container">
      <div class="wf-shipping-trust-card">
        <div class="wf-shipping-badge-pill">
          <span class="wf-shipping-pill-icon">🚚</span>
          <span>FAST &amp; INSURED WORLDWIDE EXPRESS SHIPPING</span>
        </div>
        <h3 class="wf-shipping-card-heading">Doorstep Delivery Guarantee &amp; Real-Time Tracking</h3>
        
        <div class="wf-shipping-card-body">
          <div class="wf-shipping-media-col">
            <div class="wf-shipping-img-frame top-frame">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/5555.webp?v=1792856415" alt="FedEx Courier Dispatch and Safe Package Handling" loading="lazy">
              <div class="wf-shipping-img-tag">⚡ Handled with Care &bull; Direct Carrier Dispatch</div>
            </div>
            <div class="wf-shipping-img-frame bottom-frame">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/44444.webp?v=1792856415" alt="Express Worldwide Delivery &amp; Tracked Shipping" loading="lazy">
            </div>
          </div>
          
          <div class="wf-shipping-text-col">
            <div class="wf-shipping-summary-text">
              <p>
                Every Zavelyn® order is meticulously inspected, cushioned in heavy-duty protective packaging, and dispatched directly from our regional fulfillment centers within <strong>24–48 business hours</strong>. We partner directly with trusted premier carriers including <strong>FedEx, USPS, and DHL Express</strong> to guarantee rapid, dependable, door-to-door transit across the United States and worldwide.
              </p>
              <p>
                The moment your shipment leaves our facility, you will automatically receive an instant tracking link via email and SMS with live, step-by-step delivery updates. Backed by our <strong>100% In-Transit Protection Guarantee</strong> — if your parcel experiences any transit delay or packaging damage, our dedicated 24/7 support team will arrange an immediate zero-cost replacement without delay.
              </p>
            </div>
            
            <div class="wf-shipping-features-grid">
              <div class="wf-shipping-feature-box">
                <span class="wf-feat-icon">⏱️</span>
                <div>
                  <strong>24–48h Dispatch</strong>
                  <span>Swift domestic fulfillment from regional hubs</span>
                </div>
              </div>
              <div class="wf-shipping-feature-box">
                <span class="wf-feat-icon">📦</span>
                <div>
                  <strong>100% Insured Transit</strong>
                  <span>Full coverage against lost or transit-damaged items</span>
                </div>
              </div>
              <div class="wf-shipping-feature-box">
                <span class="wf-feat-icon">🔍</span>
                <div>
                  <strong>Live Real-Time Tracking</strong>
                  <span>Doorstep progress notifications via SMS &amp; email</span>
                </div>
              </div>
              <div class="wf-shipping-feature-box">
                <span class="wf-feat-icon">🛡️</span>
                <div>
                  <strong>90-Day Money-Back</strong>
                  <span>Total risk-free satisfaction guarantee on all orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

const SHIPPING_AND_REVIEW_CSS = `
  /* --- SHIPPING & DELIVERY SECTION STYLES --- */
  .wf-shipping-section {
    background: #faf7f4;
    padding: 50px 0 30px 0;
    border-top: 1px solid var(--wf-border, #e6ded6);
  }
  .wf-shipping-trust-card {
    background: #ffffff;
    border: 1px solid var(--wf-border, #e6ded6);
    border-radius: 20px;
    padding: 36px 32px;
    box-shadow: 0 8px 30px rgba(59, 43, 47, 0.05);
  }
  .wf-shipping-badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #f4ece4;
    color: #8a2c13;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.8px;
    padding: 6px 14px;
    border-radius: 9999px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .wf-shipping-card-heading {
    font-family: var(--wf-font-heading, inherit);
    font-size: 26px;
    font-weight: 800;
    color: #231f20;
    margin: 0 0 24px 0;
    line-height: 1.25;
  }
  .wf-shipping-card-body {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: 32px;
    align-items: center;
  }
  .wf-shipping-media-col {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .wf-shipping-img-frame {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid #e7e4df;
    background: #f7f5f2;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  }
  .wf-shipping-img-frame img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }
  .wf-shipping-img-frame.top-frame img {
    aspect-ratio: 16 / 10;
  }
  .wf-shipping-img-frame.bottom-frame img {
    aspect-ratio: 21 / 9;
  }
  .wf-shipping-img-tag {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: rgba(31, 27, 28, 0.85);
    color: #ffffff;
    backdrop-filter: blur(4px);
    font-size: 11px;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 6px;
    letter-spacing: 0.3px;
  }
  .wf-shipping-summary-text p {
    font-size: 14.5px;
    line-height: 1.65;
    color: #4a3e3d;
    margin: 0 0 14px 0;
  }
  .wf-shipping-features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f0eae4;
  }
  .wf-shipping-feature-box {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #faf7f4;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid #eee8e2;
  }
  .wf-feat-icon {
    font-size: 20px;
    line-height: 1;
  }
  .wf-shipping-feature-box strong {
    display: block;
    font-size: 13px;
    color: #231f20;
    font-weight: 700;
    margin-bottom: 2px;
  }
  .wf-shipping-feature-box span {
    font-size: 11.5px;
    color: #6d6260;
    line-height: 1.4;
  }

  /* --- REVIEWS SECTION ENHANCEMENTS --- */
  .wf-reviews-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 20px !important;
  }
  .wf-review-card {
    background: #ffffff;
    border: 1px solid #e7e4df;
    border-radius: 16px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 4px 16px rgba(59, 43, 47, 0.04);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .wf-review-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59, 43, 47, 0.08);
  }
  .wf-rev-author-wrap {
    display: flex;
    flex-direction: column;
  }
  .wf-rev-date {
    font-size: 11px;
    color: #8c827a;
    font-weight: 500;
    margin-top: 2px;
  }
  .wf-rev-location {
    font-size: 11px;
    color: #a39992;
    font-weight: 500;
  }
  .wf-rev-photo {
    margin-top: 14px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #eae5e0;
    background: #f7f5f2;
    aspect-ratio: 4 / 3;
    max-height: 190px;
  }
  .wf-rev-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }
  .wf-rev-photo:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 991px) {
    .wf-shipping-card-body {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .wf-reviews-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
  @media (max-width: 640px) {
    .wf-shipping-trust-card {
      padding: 22px 18px;
    }
    .wf-shipping-features-grid {
      grid-template-columns: 1fr;
    }
    .wf-reviews-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

export {
  getAccessToken,
  uploadThemeAsset,
  HEATING_LAMP_REVIEWS,
  SHIPPING_HTML,
  SHIPPING_AND_REVIEW_CSS
};
