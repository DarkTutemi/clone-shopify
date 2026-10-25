import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
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

async function uploadAsset(token, key, value) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (data.asset) {
    console.log(`  ✔ Uploaded: ${key}`);
  } else {
    console.error(`  ✗ Failed: ${key}`, JSON.stringify(data.errors || data));
  }
}

// Function to generate funnel liquid
function generateFunnelLiquid(config) {
  const colorButtonsHtml = config.colors.map((c, i) => `
    <button type="button" class="wf-color-btn ${i === 0 ? 'active' : ''}" 
            data-color="${c.name}" 
            data-variant-id="${c.id}" 
            data-img="${c.img}" 
            style="background:${c.hex}; ${c.hex === '#ffffff' ? 'border:1px solid #ccc;' : ''}" 
            onclick="selectWfColor(this)" 
            title="${c.name}"></button>
  `).join('');

  const thumbsHtml = config.thumbs.map((t, i) => `
    <div class="wf-thumb-item ${i === 0 ? 'active' : ''}" onclick="selectWfImage('${t.img}', this)">
      <img src="${t.img}" alt="${t.alt}" />
    </div>
  `).join('');

  return `{% comment %}
  Zavelyn ${config.title} Funnel
  Standardized to Zavelyn Design System
{% endcomment %}

<div id="fn-offer" class="wf-funnel-container" data-product-handle="{{ product.handle }}">
  <!-- 1. HERO PRODUCT SECTION -->
  <section class="wf-section wf-hero-section">
    <div class="wf-container">
      <div class="wf-hero-grid">
        <!-- Gallery Column -->
        <div class="wf-hero-gallery">
          <div class="wf-gallery-main">
            <img id="wfMainImg" 
                 src="${config.mainImage}" 
                 alt="${config.title}" 
                 loading="eager" 
                 class="wf-main-image" />
            <div class="wf-badge-sale">50% OFF FLASH SALE</div>
          </div>
          <div class="wf-gallery-thumbs" id="wfThumbs">
            ${thumbsHtml}
          </div>
        </div>

        <!-- Buybox Column -->
        <div class="wf-hero-buybox">
          <div class="wf-rating-pill">
            <span class="wf-stars">★★★★★</span>
            <span class="wf-rating-score">4.9 / 5.0</span>
            <span class="wf-rating-count">(${config.reviewCount}+ Verified Practitioners)</span>
          </div>

          <h1 class="wf-product-title">${config.title}</h1>
          <p class="wf-product-sub">${config.subtitle}</p>

          <!-- Price Display -->
          <div class="wf-price-box">
            <span class="wf-current-price" id="wfCurrentPrice">$${config.price.toFixed(2)}</span>
            <span class="wf-compare-price" id="wfComparePrice">$${config.compareAt.toFixed(2)}</span>
            <span class="wf-save-badge" id="wfSaveBadge">SAVE 50%</span>
          </div>

          <!-- Promotion highlight -->
          <div class="wf-promo-alert">
            <span class="wf-alert-icon">✨</span>
            <span class="wf-alert-text"><strong>SPECIAL OFFER:</strong> 50% OFF applied automatically. Includes Free Padded Travel Bag & Tutorial Songbook Guide!</span>
          </div>

          <!-- Color Variant Selector -->
          <div class="wf-color-picker-wrap">
            <label class="wf-bundle-label">CHOOSE COLOR: <span id="wfSelectedColorName" style="color:var(--wf-primary); font-weight:800;">${config.colors[0].name}</span></label>
            <div class="wf-color-options">
              ${colorButtonsHtml}
            </div>
          </div>

          <!-- Bundle Options -->
          <div class="wf-bundles-container">
            <label class="wf-bundle-label">CHOOSE YOUR PACKAGE:</label>

            <!-- Tier 1 -->
            <div class="wf-bundle-card active" data-qty="1" data-price="${config.price}" data-compare="${config.compareAt}" onclick="selectWfBundle(this)">
              <div class="wf-card-radio"></div>
              <div class="wf-card-info">
                <div class="wf-card-title-row">
                  <span class="wf-card-title">1x ${config.shortName} Kit</span>
                  <span class="wf-card-tag standard">Standard</span>
                </div>
                <div class="wf-card-desc">${config.tier1Desc}</div>
              </div>
              <div class="wf-card-pricing">
                <span class="wf-card-price">$${config.price.toFixed(2)}</span>
                <span class="wf-card-comp">$${config.compareAt.toFixed(2)}</span>
              </div>
            </div>

            <!-- Tier 2 -->
            <div class="wf-bundle-card" data-qty="2" data-price="${(config.price * 2 - 40).toFixed(2)}" data-compare="${(config.compareAt * 2).toFixed(2)}" onclick="selectWfBundle(this)">
              <div class="wf-card-radio"></div>
              <div class="wf-card-info">
                <div class="wf-card-title-row">
                  <span class="wf-card-title">2x ${config.shortName} Duet Pack</span>
                  <span class="wf-card-tag popular">★ MOST POPULAR</span>
                </div>
                <div class="wf-card-desc">2 Complete Kits • Save Extra $40 • For Couples & Family Play</div>
              </div>
              <div class="wf-card-pricing">
                <span class="wf-card-price">$${(config.price * 2 - 40).toFixed(2)}</span>
                <span class="wf-card-comp">$${(config.compareAt * 2).toFixed(2)}</span>
                <span class="wf-unit-note">($${((config.price * 2 - 40) / 2).toFixed(2)}/ea)</span>
              </div>
            </div>

            <!-- Tier 3 -->
            <div class="wf-bundle-card" data-qty="3" data-price="${(config.price * 3 - 90).toFixed(2)}" data-compare="${(config.compareAt * 3).toFixed(2)}" onclick="selectWfBundle(this)">
              <div class="wf-card-radio"></div>
              <div class="wf-card-info">
                <div class="wf-card-title-row">
                  <span class="wf-card-title">3x ${config.shortName} Ensemble</span>
                  <span class="wf-card-tag best-value">★ BEST VALUE</span>
                </div>
                <div class="wf-card-desc">3 Complete Kits • Maximum Savings • For Yoga Studios & Sound Baths</div>
              </div>
              <div class="wf-card-pricing">
                <span class="wf-card-price">$${(config.price * 3 - 90).toFixed(2)}</span>
                <span class="wf-card-comp">$${(config.compareAt * 3).toFixed(2)}</span>
                <span class="wf-unit-note">($${((config.price * 3 - 90) / 3).toFixed(2)}/ea)</span>
              </div>
            </div>
          </div>

          <!-- Quantity Selector -->
          <div class="wf-qty-row">
            <span class="wf-qty-label">Quantity:</span>
            <div class="wf-qty-control">
              <button type="button" class="wf-qty-btn" onclick="adjustWfQty(-1)">−</button>
              <input type="number" id="wfQtyInput" value="1" min="1" max="10" readonly />
              <button type="button" class="wf-qty-btn" onclick="adjustWfQty(1)">+</button>
            </div>
          </div>

          <!-- ATC & Direct Checkout Buttons -->
          <div class="wf-actions-group">
            <button type="button" id="wfAddToCartBtn" class="wf-btn-atc" onclick="submitWfAddToCart()">
              <span class="wf-btn-icon">🛒</span>
              <span class="wf-btn-text">ADD TO CART • GET 50% OFF</span>
            </button>

            <button type="button" id="wfShopNowBtn" class="wf-btn-shopnow" onclick="submitWfDirectCheckout()">
              <span class="wf-btn-text">⚡ SHOP NOW (1-CLICK CHECKOUT)</span>
            </button>
          </div>

          <!-- Trust Sub-bar -->
          <div class="wf-trust-badges">
            <div class="wf-trust-item">
              <span class="wf-trust-icon">🎶</span>
              <span class="wf-trust-text"><strong>90-Day Sound</strong> Guarantee</span>
            </div>
            <div class="wf-trust-item">
              <span class="wf-trust-icon">📦</span>
              <span class="wf-trust-text"><strong>Fast Tracked US</strong> Delivery (2-4 Days)</span>
            </div>
            <div class="wf-trust-item">
              <span class="wf-trust-icon">✨</span>
              <span class="wf-trust-text"><strong>432 Hz Calibrated</strong> Harmonic Pitch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. 432 HZ SOUND HEALING BANNER -->
  <section class="wf-section wf-banner-section">
    <div class="wf-container">
      <div class="wf-banner-card">
        <div class="wf-banner-grid">
          <div class="wf-banner-media">
            <img src="${config.bannerImage}" 
                 alt="Sound Healing and Meditation with ${config.title}" 
                 loading="lazy" 
                 class="wf-gif-image" />
          </div>
          <div class="wf-banner-content">
            <span class="wf-sub-pill">HARMONIC SOUND THERAPY</span>
            <h2 class="wf-sec-title">Calm Your Mind With 432 Hz Natural Vibration</h2>
            <p class="wf-sec-desc">
              Unlike harsh synthetic instruments, the <strong>${config.title}</strong> is master-tuned to <strong>432 Hz</strong>—the natural mathematical harmonic frequency of the universe. Just 10 minutes of striking these resonant steel tongues stimulates alpha brainwaves, naturally reducing cortisol levels and cultivating deep inner peace.
            </p>
            <div class="wf-spec-badges">
              <div class="wf-spec-badge">
                <span class="wf-spec-num">${config.noteCount} NOTES</span>
                <span class="wf-spec-label">${config.scaleType}</span>
              </div>
              <div class="wf-spec-badge">
                <span class="wf-spec-num">432 Hz</span>
                <span class="wf-spec-label">Healing Tuning</span>
              </div>
              <div class="wf-spec-badge">
                <span class="wf-spec-num">100%</span>
                <span class="wf-spec-label">Harmonic Blend</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. ZERO EXPERIENCE REQUIRED -->
  <section class="wf-section wf-steps-section">
    <div class="wf-container">
      <div class="wf-center-header">
        <span class="wf-sub-pill">EFFORTLESS PLAY</span>
        <h2 class="wf-sec-title">Zero Musical Training Required</h2>
        <p class="wf-sec-desc">Designed with an intuitive harmonic scale where it is impossible to play a wrong note.</p>
      </div>

      <div class="wf-steps-grid">
        <div class="wf-step-card">
          <div class="wf-step-number">01</div>
          <div class="wf-step-icon">🎵</div>
          <h3 class="wf-step-title">Numbered Notation</h3>
          <p class="wf-step-text">Each tongue has an embossed gold number. Simply match the numbers to songs in the tutorial book.</p>
        </div>
        <div class="wf-step-card">
          <div class="wf-step-number">02</div>
          <div class="wf-step-icon">🥢</div>
          <h3 class="wf-step-title">Mallets or Fingers</h3>
          <p class="wf-step-text">Use the included balanced rubber-head bamboo mallets or the ergonomic silicone finger picks.</p>
        </div>
        <div class="wf-step-card">
          <div class="wf-step-number">03</div>
          <div class="wf-step-icon">🧘</div>
          <h3 class="wf-step-title">Instant Harmony</h3>
          <p class="wf-step-text">Every single note is in harmonic chord alignment. Any random pattern sounds deeply melodious.</p>
        </div>
        <div class="wf-step-card">
          <div class="wf-step-number">04</div>
          <div class="wf-step-icon">🎒</div>
          <h3 class="wf-step-title">Play Anywhere</h3>
          <p class="wf-step-text">Slip into the travel carry case to bring soothing acoustic vibrations to yoga, parks, or home relaxation.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. WHAT'S INCLUDED SHOWCASE -->
  <section class="wf-section wf-features-section">
    <div class="wf-container">
      <div class="wf-feature-row">
        <div class="wf-feature-media">
          <img src="${config.accessoryImage}" 
               alt="Complete ${config.title} Accessories Kit" 
               loading="lazy" />
        </div>
        <div class="wf-feature-content">
          <span class="wf-sub-pill">COMPLETE DELUXE KIT</span>
          <h3 class="wf-feature-heading">Everything You Need To Start Playing Today</h3>
          <p class="wf-feature-desc">
            No expensive music lessons or additional gear required. Every ${config.shortName} arrives fully outfitted with professional-grade accessories.
          </p>
          <ul class="wf-feature-bullets">
            <li>✓ Custom padded travel carry case for safe transport</li>
            <li>✓ Pair of hand-finished wooden mallets with acoustic heads</li>
            <li>✓ Comprehensive song tutorial book with easy-to-read numbers</li>
            <li>✓ Ergonomic silicone finger picks for quiet, tactile hand playing</li>
            <li>✓ High-visibility note markers and microfiber cleaning cloth</li>
          </ul>
        </div>
      </div>

      <div class="wf-feature-row reverse">
        <div class="wf-feature-media">
          <img src="${config.craftImage}" 
               alt="Hand-Tuned Precision Acoustic Tongues" 
               loading="lazy" />
        </div>
        <div class="wf-feature-content">
          <span class="wf-sub-pill">MASTER CRAFTSMANSHIP</span>
          <h3 class="wf-feature-heading">Laser-Cut Alloy Steel With Baked Enamel Finish</h3>
          <p class="wf-feature-desc">
            Each tongue is precision laser-cut from high-tensile alloy steel and hand-tuned by master acoustic artisans. The electroplated enamel finish resists moisture, rust, scratches, and sweat.
          </p>
          <ul class="wf-feature-bullets">
            <li>✓ Resonant bell-like sustain lasting over 4 seconds per note</li>
            <li>✓ Hand-tuned to ±5 cents musical accuracy</li>
            <li>✓ Non-toxic baked finish safe for hands and environment</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. TECHNICAL SPECIFICATIONS -->
  <section class="wf-section wf-specs-section">
    <div class="wf-container">
      <div class="wf-specs-card">
        <h2 class="wf-sec-title">Technical Specifications</h2>
        <div class="wf-specs-grid">
          <div class="wf-spec-row">
            <span class="wf-spec-key">Diameter / Size:</span>
            <span class="wf-spec-val">${config.sizeSpec}</span>
          </div>
          <div class="wf-spec-row">
            <span class="wf-spec-key">Number of Notes:</span>
            <span class="wf-spec-val">${config.noteCount} Harmonic Tones</span>
          </div>
          <div class="wf-spec-row">
            <span class="wf-spec-key">Musical Scale:</span>
            <span class="wf-spec-val">${config.scaleSpec}</span>
          </div>
          <div class="wf-spec-row">
            <span class="wf-spec-key">Tuning Calibration:</span>
            <span class="wf-spec-val">432 Hz Natural Frequency</span>
          </div>
          <div class="wf-spec-row">
            <span class="wf-spec-key">Body Material:</span>
            <span class="wf-spec-val">Titanium Alloy Steel Composite</span>
          </div>
          <div class="wf-spec-row">
            <span class="wf-spec-key">Weight:</span>
            <span class="wf-spec-val">${config.weightSpec}</span>
          </div>
          <div class="wf-spec-row">
            <span class="wf-spec-key">Finish Coating:</span>
            <span class="wf-spec-val">Baked Anti-Corrosion Enamel</span>
          </div>
          <div class="wf-spec-row">
            <span class="wf-spec-key">Warranty:</span>
            <span class="wf-spec-val">90-Day Money Back + 2-Year Tonal Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. SHIPPING & LOGISTICS PROOF -->
  <section class="wf-section wf-shipping-section">
    <div class="wf-container">
      <div class="wf-shipping-card">
        <h2 class="wf-sec-title">Fast US Delivery & Tracked Shipping</h2>
        <p class="wf-sec-desc">All Zavelyn Drums are acoustically inspected, foam-cushioned in protective cartons, and dispatched from our US logistics centers with real-time tracking within 24 hours.</p>
        <div class="wf-shipping-images">
          <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/5555.webp?v=1792856415" alt="Order Quality Inspection and Safe Packing" loading="lazy" />
          <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/44444.webp?v=1792856415" alt="Express Courier Handover and Real-Time Tracking" loading="lazy" />
        </div>
      </div>
    </div>
  </section>

  <!-- 7. VERIFIED CUSTOMER REVIEWS (10 REVIEWS) -->
  <section class="wf-section wf-reviews-section" id="wfReviewsSec">
    <div class="wf-container">
      <div class="wf-center-header">
        <span class="wf-sub-pill">PRACTITIONER EXPERIENCES</span>
        <h2 class="wf-sec-title">Loved By Thousands of Sound Seekers</h2>
        <div class="wf-reviews-summary">
          <span class="wf-stars-large">★★★★★</span>
          <span class="wf-rating-big">4.9 / 5.0</span>
          <span class="wf-total-badge">${config.reviewCount}+ Verified Reviews</span>
        </div>
      </div>

      <div class="wf-reviews-grid">
        ${config.reviewsHtml}
      </div>
    </div>
  </section>

  <!-- 8. FREQUENTLY ASKED QUESTIONS (FAQ) -->
  <section class="wf-section wf-faq-section">
    <div class="wf-container">
      <div class="wf-center-header">
        <span class="wf-sub-pill">QUESTIONS & ANSWERS</span>
        <h2 class="wf-sec-title">Frequently Asked Questions</h2>
        <p class="wf-sec-desc">Everything you need to know about the ${config.title}.</p>
      </div>

      <div class="wf-faq-accordion">
        <div class="wf-faq-item">
          <button type="button" class="wf-faq-question" onclick="toggleWfFaq(this)">
            <span>Do I need any prior musical experience to play?</span>
            <span class="wf-faq-arrow">+</span>
          </button>
          <div class="wf-faq-answer">
            <p>None whatsoever! The ${config.title} is designed to be completely intuitive. Because every note is tuned to harmonic ${config.scaleSpec}, there are zero discordant or 'bad' notes. You can play by intuition, or follow the numbered songbook.</p>
          </div>
        </div>

        <div class="wf-faq-item">
          <button type="button" class="wf-faq-question" onclick="toggleWfFaq(this)">
            <span>What does 432 Hz tuning mean?</span>
            <span class="wf-faq-arrow">+</span>
          </button>
          <div class="wf-faq-answer">
            <p>Standard modern music is tuned to 440 Hz, which can sound tense. 432 Hz is the natural harmonic frequency historically used by classical masters. Scientific studies indicate 432 Hz produces calmer emotional responses, lower heart rates, and enhanced meditation states.</p>
          </div>
        </div>

        <div class="wf-faq-item">
          <button type="button" class="wf-faq-question" onclick="toggleWfFaq(this)">
            <span>Should I play with the mallets or my hands?</span>
            <span class="wf-faq-arrow">+</span>
          </button>
          <div class="wf-faq-answer">
            <p>Both! The included weighted bamboo mallets produce a bright, loud, crystal-clear bell resonance with minimum effort. Playing with your hands or the silicone finger picks creates a softer, warmer, and more intimate tone ideal for quiet meditation.</p>
          </div>
        </div>

        <div class="wf-faq-item">
          <button type="button" class="wf-faq-question" onclick="toggleWfFaq(this)">
            <span>Will the drum ever go out of tune?</span>
            <span class="wf-faq-arrow">+</span>
          </button>
          <div class="wf-faq-answer">
            <p>No. The acoustic tongues are laser-cut from high-grade tempered alloy steel and heat-treated. Unless subjected to severe physical deformation, the instrument will maintain its pitch calibration for decades.</p>
          </div>
        </div>

        <div class="wf-faq-item">
          <button type="button" class="wf-faq-question" onclick="toggleWfFaq(this)">
            <span>What is your return policy?</span>
            <span class="wf-faq-arrow">+</span>
          </button>
          <div class="wf-faq-answer">
            <p>We offer a 90-Day Risk-Free Trial. If you don't feel a noticeable sense of relaxation, joy, and peace when playing your Zavelyn Drum™, return it for a 100% full refund with no questions asked.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 9. STICKY BUY BAR -->
  <div class="wf-sticky-bar" id="wfStickyBar">
    <div class="wf-sticky-inner">
      <div class="wf-sticky-prod">
        <img src="${config.mainImage}" alt="${config.title} Thumb" class="wf-sticky-thumb" id="wfStickyThumb" />
        <div class="wf-sticky-info">
          <span class="wf-sticky-title">${config.title}</span>
          <span class="wf-sticky-price" id="wfStickyPrice">$${config.price.toFixed(2)} <s class="wf-sticky-comp">$${config.compareAt.toFixed(2)}</s></span>
        </div>
      </div>
      <div class="wf-sticky-actions">
        <select id="wfStickyBundleSelect" class="wf-sticky-select" onchange="syncStickySelect(this.value)">
          <option value="1">1x Kit ($${config.price.toFixed(2)})</option>
          <option value="2">2x Duet Pack ($${(config.price * 2 - 40).toFixed(2)} - POPULAR)</option>
          <option value="3">3x Ensemble ($${(config.price * 3 - 90).toFixed(2)} - BEST VALUE)</option>
        </select>
        <button type="button" class="wf-sticky-atc-btn" onclick="submitWfAddToCart()">
          ADD TO CART • 50% OFF
        </button>
      </div>
    </div>
  </div>
</div>

<style>
/* ZAVELYN UNIFIED DESIGN SYSTEM STYLES */
:root {
  --wf-primary: #8a2c13;
  --wf-primary-hover: #73230e;
  --wf-secondary: #008763;
  --wf-dark: #22181c;
  --wf-text: #3b2b2f;
  --wf-text-muted: #718096;
  --wf-bg-light: #faf7f4;
  --wf-border: #e6ded6;
  --wf-star: #ffb800;
  --wf-font: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.wf-funnel-container {
  font-family: var(--wf-font);
  color: var(--wf-text);
  line-height: 1.6;
  background-color: #fff;
  overflow-x: hidden;
}

.wf-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.wf-section {
  padding: 56px 0;
  border-bottom: 1px solid #edf2f7;
}

.wf-center-header {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 40px;
}

.wf-sub-pill {
  display: inline-block;
  background: #fbebe6;
  color: var(--wf-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  padding: 6px 14px;
  border-radius: 50px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.wf-sec-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--wf-dark);
  line-height: 1.25;
  margin: 0 0 12px;
}

.wf-sec-desc {
  font-size: 16px;
  color: var(--wf-text-muted);
  margin: 0;
}

.wf-hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

.wf-hero-gallery {
  position: sticky;
  top: 80px;
}

.wf-gallery-main {
  position: relative;
  background: #f8f9fa;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--wf-border);
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wf-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.wf-badge-sale {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #e53e3e;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 50px;
  letter-spacing: 1px;
}

.wf-gallery-thumbs {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.wf-thumb-item {
  width: 76px;
  height: 76px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  flex-shrink: 0;
  background: #f1f3f5;
  transition: all 0.2s ease;
}

.wf-thumb-item.active {
  border-color: var(--wf-primary);
  box-shadow: 0 0 0 2px rgba(138,44,19,0.2);
}

.wf-thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wf-rating-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.wf-stars {
  color: var(--wf-star);
  font-size: 18px;
}

.wf-rating-score {
  font-weight: 700;
  font-size: 14px;
  color: var(--wf-dark);
}

.wf-rating-count {
  font-size: 14px;
  color: var(--wf-text-muted);
}

.wf-product-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--wf-dark);
  line-height: 1.25;
  margin: 0 0 10px;
}

.wf-product-sub {
  font-size: 15px;
  color: var(--wf-text-muted);
  margin: 0 0 20px;
}

.wf-price-box {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 16px;
}

.wf-current-price {
  font-size: 36px;
  font-weight: 800;
  color: var(--wf-primary);
}

.wf-compare-price {
  font-size: 22px;
  color: #a0aec0;
  text-decoration: line-through;
}

.wf-save-badge {
  background: #fed7d7;
  color: #c53030;
  font-size: 13px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
}

.wf-promo-alert {
  background: #fffaf0;
  border: 1px dashed #dd6b20;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #7b341e;
}

/* COLOR SELECTOR */
.wf-color-picker-wrap {
  margin-bottom: 20px;
}

.wf-color-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.wf-color-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.wf-color-btn.active {
  border-color: var(--wf-primary);
  transform: scale(1.15);
  box-shadow: 0 0 0 3px rgba(138,44,19,0.25);
}

/* BUNDLE CARDS */
.wf-bundle-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--wf-dark);
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.wf-bundles-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.wf-bundle-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 2px solid var(--wf-border);
  border-radius: 12px;
  cursor: pointer;
  background: #fff;
  transition: all 0.2s ease;
  position: relative;
}

.wf-bundle-card:hover {
  border-color: #cbd5e0;
}

.wf-bundle-card.active {
  border-color: var(--wf-primary);
  background: #fffaf7;
  box-shadow: 0 4px 12px rgba(138,44,19,0.08);
}

.wf-card-radio {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e0;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}

.wf-bundle-card.active .wf-card-radio {
  border-color: var(--wf-primary);
}

.wf-bundle-card.active .wf-card-radio::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 10px;
  height: 10px;
  background: var(--wf-primary);
  border-radius: 50%;
}

.wf-card-info {
  flex: 1;
}

.wf-card-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.wf-card-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--wf-dark);
}

.wf-card-tag {
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.wf-card-tag.standard {
  background: #edf2f7;
  color: #4a5568;
}

.wf-card-tag.popular {
  background: #e6fffa;
  color: #234e52;
}

.wf-card-tag.best-value {
  background: #feebc8;
  color: #7b341e;
}

.wf-card-desc {
  font-size: 12px;
  color: var(--wf-text-muted);
}

.wf-card-pricing {
  text-align: right;
  flex-shrink: 0;
}

.wf-card-price {
  display: block;
  font-size: 18px;
  font-weight: 800;
  color: var(--wf-dark);
}

.wf-card-comp {
  display: block;
  font-size: 13px;
  color: #a0aec0;
  text-decoration: line-through;
}

.wf-unit-note {
  font-size: 11px;
  color: var(--wf-secondary);
  font-weight: 600;
}

/* QUANTITY SELECTOR */
.wf-qty-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.wf-qty-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--wf-dark);
}

.wf-qty-control {
  display: flex;
  align-items: center;
  border: 1px solid var(--wf-border);
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.wf-qty-btn {
  background: #edf2f7;
  border: none;
  width: 38px;
  height: 38px;
  font-size: 18px;
  font-weight: 700;
  color: var(--wf-dark);
  cursor: pointer;
  transition: background 0.2s;
}

.wf-qty-btn:hover {
  background: #e2e8f0;
}

#wfQtyInput {
  width: 48px;
  height: 38px;
  border: none;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--wf-dark);
}

/* ACTIONS */
.wf-actions-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.wf-btn-atc {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  background: var(--wf-primary);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 18px 24px;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(138,44,19,0.3);
  transition: all 0.2s ease;
}

.wf-btn-atc:hover {
  background: var(--wf-primary-hover);
  transform: translateY(-1px);
}

.wf-btn-shopnow {
  width: 100%;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.wf-btn-shopnow:hover {
  background: #2d3748;
}

.wf-trust-badges {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--wf-border);
}

.wf-trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}

.wf-trust-icon {
  font-size: 20px;
}

.wf-trust-text {
  font-size: 12px;
  color: var(--wf-text-muted);
}

/* BANNER */
.wf-banner-card {
  background: #1a202c;
  color: #fff;
  border-radius: 20px;
  padding: 48px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.wf-banner-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.wf-banner-media {
  border-radius: 14px;
  overflow: hidden;
}

.wf-gif-image {
  width: 100%;
  display: block;
}

.wf-banner-content .wf-sec-title {
  color: #fff;
}

.wf-banner-content .wf-sec-desc {
  color: #cbd5e0;
  margin-bottom: 24px;
}

.wf-spec-badges {
  display: flex;
  gap: 20px;
}

.wf-spec-badge {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 14px 20px;
  text-align: center;
  flex: 1;
}

.wf-spec-num {
  display: block;
  font-size: 24px;
  font-weight: 800;
  color: #ff9f1c;
}

.wf-spec-label {
  font-size: 12px;
  color: #a0aec0;
  text-transform: uppercase;
}

/* STEPS */
.wf-steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.wf-step-card {
  background: var(--wf-bg-light);
  border-radius: 16px;
  padding: 30px 24px;
  position: relative;
  border: 1px solid var(--wf-border);
  transition: transform 0.2s;
}

.wf-step-card:hover {
  transform: translateY(-4px);
}

.wf-step-number {
  position: absolute;
  top: 18px;
  right: 20px;
  font-size: 28px;
  font-weight: 900;
  color: #e2e8f0;
}

.wf-step-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.wf-step-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--wf-dark);
  margin: 0 0 8px;
}

.wf-step-text {
  font-size: 14px;
  color: var(--wf-text-muted);
  margin: 0;
}

/* FEATURE ROWS */
.wf-feature-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  margin-bottom: 56px;
}

.wf-feature-row:last-child {
  margin-bottom: 0;
}

.wf-feature-row.reverse {
  direction: rtl;
}

.wf-feature-row.reverse .wf-feature-content,
.wf-feature-row.reverse .wf-feature-media {
  direction: ltr;
}

.wf-feature-media {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0,0,0,0.06);
}

.wf-feature-media img {
  width: 100%;
  display: block;
}

.wf-feature-heading {
  font-size: 26px;
  font-weight: 800;
  color: var(--wf-dark);
  margin: 0 0 16px;
  line-height: 1.3;
}

.wf-feature-desc {
  font-size: 15px;
  color: var(--wf-text-muted);
  margin: 0 0 20px;
}

.wf-feature-bullets {
  list-style: none;
  padding: 0;
  margin: 0;
}

.wf-feature-bullets li {
  font-size: 14px;
  font-weight: 600;
  color: var(--wf-dark);
  margin-bottom: 8px;
}

/* SPECS */
.wf-specs-card {
  max-width: 860px;
  margin: 0 auto;
  background: var(--wf-bg-light);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid var(--wf-border);
}

.wf-specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 32px;
  margin-top: 24px;
}

.wf-spec-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #edf2f7;
  font-size: 14px;
}

.wf-spec-key {
  font-weight: 600;
  color: var(--wf-text-muted);
}

.wf-spec-val {
  font-weight: 700;
  color: var(--wf-dark);
  text-align: right;
}

/* SHIPPING & REVIEWS */
.wf-shipping-card {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.wf-shipping-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

.wf-shipping-images img {
  width: 100%;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.wf-reviews-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
}

.wf-stars-large {
  color: var(--wf-star);
  font-size: 24px;
}

.wf-rating-big {
  font-size: 20px;
  font-weight: 800;
  color: var(--wf-dark);
}

.wf-total-badge {
  background: #edf2f7;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
  color: var(--wf-text);
}

.wf-reviews-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 40px;
}

.wf-review-card {
  background: #fff;
  border: 1px solid var(--wf-border);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.03);
}

.wf-rev-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.wf-rev-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #4a5568;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.wf-rev-name {
  font-weight: 700;
  font-size: 15px;
  color: var(--wf-dark);
}

.wf-rev-verified {
  font-size: 12px;
  color: var(--wf-secondary);
  font-weight: 600;
  margin-left: 4px;
}

.wf-rev-stars {
  color: var(--wf-star);
  font-size: 14px;
}

.wf-rev-title {
  font-weight: 700;
  font-size: 15px;
  color: var(--wf-dark);
  margin-bottom: 8px;
}

.wf-rev-body {
  font-size: 14px;
  color: var(--wf-text);
  margin: 0 0 12px;
  line-height: 1.5;
}

.wf-rev-meta {
  font-size: 12px;
  color: var(--wf-text-muted);
}

/* FAQ */
.wf-faq-accordion {
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wf-faq-item {
  border: 1px solid var(--wf-border);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.wf-faq-question {
  width: 100%;
  padding: 18px 24px;
  background: none;
  border: none;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  color: var(--wf-dark);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.wf-faq-arrow {
  font-size: 20px;
  color: #a0aec0;
  transition: transform 0.2s;
}

.wf-faq-item.open .wf-faq-arrow {
  transform: rotate(45deg);
}

.wf-faq-answer {
  display: none;
  padding: 0 24px 20px;
  font-size: 14px;
  color: var(--wf-text);
  line-height: 1.6;
}

.wf-faq-item.open .wf-faq-answer {
  display: block;
}

/* STICKY BUY BAR */
.wf-sticky-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid var(--wf-border);
  box-shadow: 0 -4px 16px rgba(0,0,0,0.08);
  padding: 12px 20px;
  z-index: 999;
  transform: translateY(120%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-sticky-bar.visible {
  transform: translateY(0);
}

.wf-sticky-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.wf-sticky-prod {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wf-sticky-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--wf-border);
}

.wf-sticky-info {
  display: flex;
  flex-direction: column;
}

.wf-sticky-title {
  font-weight: 700;
  font-size: 14px;
  color: var(--wf-dark);
}

.wf-sticky-price {
  font-size: 15px;
  font-weight: 800;
  color: var(--wf-primary);
}

.wf-sticky-comp {
  font-size: 13px;
  color: #a0aec0;
  margin-left: 6px;
}

.wf-sticky-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wf-sticky-select {
  padding: 10px 14px;
  border: 1px solid var(--wf-border);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--wf-dark);
  background: #fff;
  cursor: pointer;
}

.wf-sticky-atc-btn {
  background: var(--wf-primary);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
}

.wf-sticky-atc-btn:hover {
  background: var(--wf-primary-hover);
}

/* RESPONSIVE (MOBILE FIRST) */
@media (max-width: 991px) {
  .wf-hero-grid,
  .wf-banner-grid,
  .wf-feature-row,
  .wf-feature-row.reverse {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .wf-hero-gallery {
    position: static;
  }
  .wf-steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .wf-reviews-grid {
    grid-template-columns: 1fr;
  }
  .wf-specs-grid {
    grid-template-columns: 1fr;
  }
  .wf-banner-card {
    padding: 30px 20px;
  }
}

@media (max-width: 767px) {
  .wf-section {
    padding: 40px 0;
  }
  .wf-sec-title {
    font-size: 24px;
  }
  .wf-product-title {
    font-size: 22px;
  }
  .wf-current-price {
    font-size: 28px;
  }
  .wf-steps-grid,
  .wf-shipping-images {
    grid-template-columns: 1fr;
  }
  .wf-spec-badges {
    flex-direction: column;
    gap: 10px;
  }
  .wf-trust-badges {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .wf-trust-item {
    flex-direction: row;
    text-align: left;
  }
  .wf-sticky-info {
    display: none;
  }
  .wf-sticky-inner {
    justify-content: space-between;
  }
  .wf-sticky-select {
    max-width: 150px;
    font-size: 12px;
  }
  .wf-sticky-atc-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>

<script>
// DYNAMIC BUYBOX SCRIPT
let currentVariantId = "${config.colors[0].id}";
let currentQty = 1;
let currentUnitPrice = ${config.price};
let currentUnitCompare = ${config.compareAt};

function selectWfImage(src, thumbEl) {
  const main = document.getElementById('wfMainImg');
  if (main) main.src = src;
  document.querySelectorAll('.wf-thumb-item').forEach(el => el.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

function selectWfColor(btn) {
  document.querySelectorAll('.wf-color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const color = btn.getAttribute('data-color');
  const vId = btn.getAttribute('data-variant-id');
  const img = btn.getAttribute('data-img');

  currentVariantId = vId;
  const nameEl = document.getElementById('wfSelectedColorName');
  if (nameEl) nameEl.textContent = color;

  if (img) {
    const main = document.getElementById('wfMainImg');
    const stickyImg = document.getElementById('wfStickyThumb');
    if (main) main.src = img;
    if (stickyImg) stickyImg.src = img;
  }
}

function selectWfBundle(cardEl) {
  document.querySelectorAll('.wf-bundle-card').forEach(c => c.classList.remove('active'));
  cardEl.classList.add('active');

  const qty = parseInt(cardEl.getAttribute('data-qty'), 10) || 1;
  const price = parseFloat(cardEl.getAttribute('data-price')) || currentUnitPrice;
  const compare = parseFloat(cardEl.getAttribute('data-compare')) || currentUnitCompare;

  currentQty = qty;

  const qtyInput = document.getElementById('wfQtyInput');
  if (qtyInput) qtyInput.value = qty;

  updateWfPricing(price, compare);

  const stickySel = document.getElementById('wfStickyBundleSelect');
  if (stickySel) stickySel.value = qty.toString();
}

function updateWfPricing(price, compare) {
  const curEl = document.getElementById('wfCurrentPrice');
  const compEl = document.getElementById('wfComparePrice');
  const stCurEl = document.getElementById('wfStickyPrice');

  if (curEl) curEl.textContent = '$' + price.toFixed(2);
  if (compEl) compEl.textContent = '$' + compare.toFixed(2);
  if (stCurEl) stCurEl.innerHTML = '$' + price.toFixed(2) + ' <s class="wf-sticky-comp">$' + compare.toFixed(2) + '</s>';
}

function adjustWfQty(delta) {
  const input = document.getElementById('wfQtyInput');
  if (!input) return;
  let val = parseInt(input.value, 10) || 1;
  val = Math.max(1, Math.min(10, val + delta));
  input.value = val;
  currentQty = val;

  const totalPrice = currentUnitPrice * val;
  const totalCompare = currentUnitCompare * val;
  updateWfPricing(totalPrice, totalCompare);
}

function syncStickySelect(val) {
  const targetCard = document.querySelector('.wf-bundle-card[data-qty="' + val + '"]');
  if (targetCard) selectWfBundle(targetCard);
}

function toggleWfFaq(btn) {
  const item = btn.closest('.wf-faq-item');
  if (item) item.classList.toggle('open');
}

// AJAX ADD TO CART
async function submitWfAddToCart() {
  const btn = document.getElementById('wfAddToCartBtn');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>ADDING TO CART...</span>';
  }

  try {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          id: currentVariantId,
          quantity: currentQty
        }]
      })
    });

    if (!res.ok) throw new Error('Add to cart failed');

    if (typeof window.willaRefreshCart === 'function') {
      await window.willaRefreshCart();
    }
    if (typeof window.willaOpenCartDrawer === 'function') {
      window.willaOpenCartDrawer();
    } else {
      window.location.href = '/cart';
    }
  } catch (err) {
    console.error('Cart add error:', err);
    window.location.href = '/cart/' + currentVariantId + ':' + currentQty;
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }
}

// 1-CLICK DIRECT CHECKOUT
function submitWfDirectCheckout() {
  window.location.href = '/cart/' + currentVariantId + ':' + currentQty;
}

// STICKY SCROLL TRIGGER
window.addEventListener('scroll', function() {
  const buybox = document.querySelector('.wf-hero-buybox');
  const sticky = document.getElementById('wfStickyBar');
  if (!buybox || !sticky) return;

  const rect = buybox.getBoundingClientRect();
  if (rect.bottom < 0) sticky.classList.add('visible');
  else sticky.classList.remove('visible');
});
</script>
`;
}

// Common reviews generator helper
function generateReviews(items) {
  return items.map(r => `
    <div class="wf-review-card">
      <div class="wf-rev-header">
        <div class="wf-rev-avatar">${r.avatar}</div>
        <div>
          <div class="wf-rev-name">${r.name} <span class="wf-rev-verified">✔ Verified Buyer</span></div>
          <div class="wf-rev-stars">★★★★★</div>
        </div>
      </div>
      <div class="wf-rev-title">${r.title}</div>
      <p class="wf-rev-body">${r.body}</p>
      <div class="wf-rev-meta">Purchased: ${r.meta}</div>
    </div>
  `).join('');
}

// Config 1: PRO
const proConfig = {
  title: 'Zavelyn Drum™ Pro (15-Tone Steel Tongue Handpan Drum)',
  shortName: 'Zavelyn Drum™ Pro',
  subtitle: 'Master 15-Tone D-Major Scale • 432 Hz Healing Frequency • Surgical Alloy Steel • Complete Kit (Backpack, Mallets & Songbook)',
  price: 259.95,
  compareAt: 499.95,
  reviewCount: 1680,
  mainImage: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White.webp?v=1716783328',
  bannerImage: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White_1a_LFs.webp?v=1716961111',
  accessoryImage: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/UnpackingPro.webp?v=1751703134',
  craftImage: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/details.webp?v=1751703134',
  noteCount: 15,
  scaleType: 'Full D-Major Range',
  sizeSpec: '14 Inches (35.5 cm) Master Pro',
  scaleSpec: 'D-Major Extended Chromatic Scale',
  weightSpec: '~5.5 lbs (2.5 kg) Solid Resonance',
  tier1Desc: '15-Tone Drum + Travel Backpack + Mallets + Master Songbook + Picks',
  colors: [
    { name: 'White', id: '67959036838073', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White.webp?v=1716783328', hex: '#ffffff' },
    { name: 'Black', id: '67959036870841', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/products/DSC7099.webp?v=1751703134', hex: '#1a1a1a' },
    { name: 'Silver', id: '67959036903609', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Pro_Silver.webp?v=1716783328', hex: '#c0c0c0' },
    { name: 'Blue', id: '67959036936377', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/products/DSC7102.webp?v=1751703134', hex: '#1e3a8a' },
    { name: 'Sandstone', id: '67959036969145', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Pro_Sandstone.webp?v=1716783328', hex: '#d4b996' },
    { name: 'Emerald Green', id: '67959037001913', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Pro_Green.webp?v=1716783328', hex: '#065f46' },
    { name: 'Pink Tan', id: '67959037034681', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Pro_Tan.webp?v=1716783328', hex: '#e0a899' },
    { name: 'Burgundy', id: '67959037067449', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Pro_Burgundy.webp?v=1716783328', hex: '#800020' }
  ],
  thumbs: [
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White.webp?v=1716783328', alt: 'White Finish' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White_Th_Pts.webp?v=1716961111', alt: 'Playing with Mallets' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/details.webp?v=1751703134', alt: 'Laser-Cut 15 Notes' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/UnpackingPro.webp?v=1751703134', alt: 'Unpacking Kit' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White_1a_LFs.webp?v=1716961111', alt: 'Sound Healing Lifestyle' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/inside.webp?v=1751703134', alt: 'Acoustic Cavity' }
  ],
  reviewsHtml: generateReviews([
    { avatar: 'ER', name: 'Elena Rodriguez', title: 'My yoga students fall into deep meditation within minutes', body: 'I introduce sound baths at the end of every restorative yoga class. The 432 Hz frequency creates such a profound, soothing sustain. The 15 notes allow for endless melodies.', meta: 'Zavelyn Drum™ Pro (White) • Boulder, CO' },
    { avatar: 'MB', name: 'Marcus Bennett', title: 'Zero musical background, playing songs on day one!', body: 'I have never played an instrument in my 42 years. The numbered songbook made it so easy. After 20 minutes, I was playing Hallelujah.', meta: 'Zavelyn Drum™ Pro (Black) • Austin, TX' },
    { avatar: 'CL', name: 'Claire Lansing', title: 'Incredible build quality and deep, rich bass notes', body: 'The drum is substantial, heavy, and notes ring with cathedral-like sustain. The travel backpack is high quality too. 10/10 purchase.', meta: 'Zavelyn Drum™ Pro (Emerald Green) • Seattle, WA' },
    { avatar: 'DK', name: 'Dr. David Klein', title: 'Used in our clinic for sensory anxiety reduction', body: 'As an occupational therapist, acoustic tactile vibration is remarkable for sensory regulation. Patients love playing with both mallets and finger picks.', meta: '2x Zavelyn Drum™ Pro Duet Pack • Chicago, IL' },
    { avatar: 'ST', name: 'Sarah Jenkins', title: 'The Sandstone color is gorgeous in our living room', body: 'It looks like sculptural art on our coffee table. Whenever guests come over, everyone naturally sits down and starts playing.', meta: 'Zavelyn Drum™ Pro (Sandstone) • Portland, OR' },
    { avatar: 'RT', name: 'Robert Taylor', title: 'Tuning is spot on accurate at 432 Hz', body: 'Checked every single one of the 15 notes with an acoustic tuner app. Every note was calibrated within ±2 cents. Superb craftsmanship.', meta: 'Zavelyn Drum™ Pro (Silver) • Nashville, TN' },
    { avatar: 'AM', name: 'Angela Morales', title: 'Gifted to my husband — he is obsessed', body: 'He sits on the porch every evening playing ambient melodies. His blood pressure has literally decreased. Best gift ever!', meta: 'Zavelyn Drum™ Pro (Blue) • San Diego, CA' },
    { avatar: 'JH', name: 'James Henderson', title: 'Arrived in 3 days in bulletproof packaging', body: 'Shipping was lightning fast. Thick foam molds protected the instrument completely. Everything arrived in mint condition.', meta: 'Zavelyn Drum™ Pro (Burgundy) • Atlanta, GA' },
    { avatar: 'KL', name: 'Karen Lewis', title: 'The 15-note range makes all the difference', body: 'I previously owned an 8-note drum, but felt limited. The Zavelyn Pro gives you the full two octaves for real compositions.', meta: 'Zavelyn Drum™ Pro (Pink Tan) • Miami, FL' },
    { avatar: 'TW', name: 'Thomas Wright', title: 'Pure acoustic bliss', body: 'Whenever life feels chaotic, 5 minutes with this drum resets my nervous system. I cannot recommend it enough for inner calm.', meta: 'Zavelyn Drum™ Pro (White) • Philadelphia, PA' }
  ])
};

// Config 2: PLUS
const plusConfig = {
  title: 'Zavelyn Drum™ Plus (11-Tone Steel Tongue Handpan Drum)',
  shortName: 'Zavelyn Drum™ Plus',
  subtitle: 'Most Versatile 11-Tone D-Major Scale • 432 Hz Harmonic Healing • Compact 10" Diameter • Complete Travel Kit',
  price: 159.95,
  compareAt: 299.95,
  reviewCount: 1420,
  mainImage: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Plus_White.webp?v=1716735931',
  bannerImage: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PDWHITEBG_LIFESTYLE.webp?v=1716736589',
  accessoryImage: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/plusinside.webp?v=1751703631',
  craftImage: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/78.jpg?v=1716736589',
  noteCount: 11,
  scaleType: 'D-Major Harmony Scale',
  sizeSpec: '10 Inches (25.4 cm) Medium Plus',
  scaleSpec: 'D-Major Harmonic Scale (11 Notes)',
  weightSpec: '3.3 lbs (1.5 kg) Balanced Resonance',
  tier1Desc: '11-Tone Drum + Travel Bag + Mallets + Beginner Songbook + Picks',
  colors: [
    { name: 'White', id: '67959037427897', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Plus_White.webp?v=1716735931', hex: '#ffffff' },
    { name: 'Black', id: '67959037460665', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Plus_black1000x1000.webp?v=1751703631', hex: '#1a1a1a' },
    { name: 'Emerald Green', id: '67959037493433', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Plus_Green.webp?v=1716735931', hex: '#065f46' },
    { name: 'Red', id: '67959037526201', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Plus_Red.webp?v=1716735931', hex: '#dc2626' },
    { name: 'Blue', id: '67959037558969', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Plus_blue1000x1000.webp?v=1751703631', hex: '#1e3a8a' },
    { name: 'Pink', id: '67959037591737', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Plus_Pink.webp?v=1716735931', hex: '#f472b6' },
    { name: 'Sandstone', id: '67959037624505', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Plus_Sandstone.webp?v=1716735931', hex: '#d4b996' },
    { name: 'Pink Tan', id: '67959037657273', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Plus_PinkTan.webp?v=1716735931', hex: '#e0a899' }
  ],
  thumbs: [
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Plus_White.webp?v=1716735931', alt: 'White Finish' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PDwhit_lfstl.webp?v=1716736589', alt: 'Lifestyle in Nature' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/78.jpg?v=1716736589', alt: 'Playing in Hands' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PDWHITEBG_LIFESTYLE.webp?v=1716736589', alt: 'Meditation Room' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/plusinside.webp?v=1751703631', alt: 'Included Accessories' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Plus_black1000x1000.webp?v=1751703631', alt: 'Black Finish' }
  ],
  reviewsHtml: generateReviews([
    { avatar: 'JW', name: 'Jessica Warren', title: 'The sweet spot for size and sound', body: 'The 10-inch 11-tone drum is so comfortable on my lap. The notes ring clearly without echoing into noise. My kids love playing it before bedtime.', meta: 'Zavelyn Drum™ Plus (Emerald Green) • Denver, CO' },
    { avatar: 'BM', name: 'Brian Miller', title: 'Helps tremendously with ADHD focus', body: 'I keep this on my work desk. Whenever my focus wanes, I tap a simple 3-note melody. The gentle tone resets my concentration instantly.', meta: 'Zavelyn Drum™ Plus (Black) • New York, NY' },
    { avatar: 'LH', name: 'Laura Hayes', title: 'Beautiful melodic sound, so easy to play', body: 'Bought this after seeing a video online. Even without reading music, my 6-year-old daughter and I can play duets together. Highly recommend!', meta: 'Zavelyn Drum™ Plus (Pink) • Minneapolis, MN' },
    { avatar: 'GS', name: 'Greg Simmons', title: 'Superior tuning compared to generic brands', body: 'I previously tried a cheap brand and half the tongues sounded dead. This Zavelyn Plus is tuned flawlessly. Warm, resonant, and singing tones.', meta: 'Zavelyn Drum™ Plus (Blue) • Seattle, WA' },
    { avatar: 'AD', name: 'Amy Davis', title: 'The carry bag is sturdy and convenient', body: 'Take it with me to the beach on weekends. Sits firmly in its zippered case and mallets slot in securely. Great build quality.', meta: 'Zavelyn Drum™ Plus (Sandstone) • Sarasota, FL' },
    { avatar: 'MC', name: 'Michael Chang', title: 'Wonderful instrument for mind-body balance', body: 'I practice Qigong and meditation. The vibrations of this drum resonate straight through the chest. A truly therapeutic tool.', meta: 'Zavelyn Drum™ Plus (White) • San Francisco, CA' },
    { avatar: 'NL', name: 'Nancy Larson', title: 'Delighted with the Red finish', body: 'The red baked enamel finish is vibrant and flawless. Looks very elegant and produces such a soothing chime.', meta: 'Zavelyn Drum™ Plus (Red) • Dallas, TX' },
    { avatar: 'PR', name: 'Paul Robinson', title: 'Ordered 2 for our school music room', body: 'Students take turns playing. The numbered tabs make teaching rhythm intuitive. No broken strings or fragile parts to worry about.', meta: '2x Zavelyn Drum™ Plus Duet Pack • Boston, MA' },
    { avatar: 'TC', name: 'Tina Campbell', title: 'My favorite purchase of the year', body: 'Unwinding with this drum after a 12-hour nursing shift is heavenly. It replaces endless screen scrolling with acoustic peace.', meta: 'Zavelyn Drum™ Plus (Pink Tan) • Phoenix, AZ' },
    { avatar: 'SH', name: 'Steven Hall', title: 'Fast shipping and great customer care', body: 'Ordered on Monday and received it by Thursday. Everything arrived safe and sounds divine.', meta: 'Zavelyn Drum™ Plus (Black) • Charlotte, NC' }
  ])
};

// Config 3: MINI
const miniConfig = {
  title: 'Zavelyn Drum™ Mini (8-Tone Steel Tongue Handpan Drum)',
  shortName: 'Zavelyn Drum™ Mini',
  subtitle: 'Ultra-Portable 6-Inch Pocket Handpan • 8-Tone Pentatonic C-Scale • 432 Hz Calming Tones • Perfect for Kids & Travel',
  price: 109.95,
  compareAt: 179.95,
  reviewCount: 950,
  mainImage: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_white.webp?v=1716782465',
  bannerImage: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/products/8-tone_6-inch_steel_tongue_panda_drum_help_by_a_little_girl.jpg?v=1716782465',
  accessoryImage: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/products/1Box_Drum_8_new.jpg?v=1716782465',
  craftImage: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/products/panda-drum-6-inch-steel-tongue-drum.jpg?v=1716782465',
  noteCount: 8,
  scaleType: 'Pentatonic C-Scale',
  sizeSpec: '6 Inches (15.2 cm) Pocket Mini',
  scaleSpec: 'Pentatonic C-Major Scale (8 Notes)',
  weightSpec: '1.3 lbs (0.6 kg) Ultra Portable',
  tier1Desc: '8-Tone Mini Drum + Pouch + Mini Mallets + Beginner Booklet',
  colors: [
    { name: 'White', id: '67959041032377', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_white.webp?v=1716782465', hex: '#ffffff' },
    { name: 'Red', id: '67959041065145', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_red.webp?v=1716782465', hex: '#dc2626' },
    { name: 'Black', id: '67959041097913', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_black.webp?v=1716782465', hex: '#1a1a1a' },
    { name: 'Blue', id: '67959041130681', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_blue.webp?v=1716782465', hex: '#1e3a8a' },
    { name: 'Sandstone', id: '67959041163449', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_Sandstone.webp?v=1716782465', hex: '#d4b996' },
    { name: 'Pink', id: '67959041196217', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_Pink.webp?v=1716782465', hex: '#f472b6' },
    { name: 'Pink Tan', id: '67959041228985', img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_PinkTan.webp?v=1716782465', hex: '#e0a899' }
  ],
  thumbs: [
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_white.webp?v=1716782465', alt: 'White Mini Drum' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_White2.webp?v=1716782465', alt: 'Angled Mini View' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/products/8-tone_6-inch_steel_tongue_panda_drum_help_by_a_little_girl.jpg?v=1716782465', alt: 'Toddler Playing' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/products/1Box_Drum_8_new.jpg?v=1716782465', alt: 'Complete Packaging' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_red.webp?v=1716782465', alt: 'Red Finish' },
    { img: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_Sandstone.webp?v=1716782465', alt: 'Sandstone Finish' }
  ],
  reviewsHtml: generateReviews([
    { avatar: 'KG', name: 'Kimberly Green', title: 'My 3-year-old son loves this so much', body: 'He used to throw tantrums before naptime. Now he sits with his mini drum and taps softly until he is calm. It is indestructible and sounds so peaceful.', meta: 'Zavelyn Drum™ Mini (Blue) • Atlanta, GA' },
    { avatar: 'DH', name: 'Daniel Howard', title: 'Pocket sound bowl for hiking and backpacking', body: 'Weighs barely a pound. Fits in my daypack side pocket. Sitting at mountain summits playing acoustic notes into the valley is pure magic.', meta: 'Zavelyn Drum™ Mini (Black) • Salt Lake City, UT' },
    { avatar: 'SL', name: 'Stephanie Lopez', title: 'Impossible to play a bad note', body: 'The pentatonic tuning means every note blends harmoniously. You cannot make a mistake. It is genuinely fun and soothing for anyone.', meta: 'Zavelyn Drum™ Mini (Pink) • Tampa, FL' },
    { avatar: 'JW', name: 'Jonathan Wood', title: 'Surprising volume and resonance for 6 inches', body: 'Expected it to sound like a toy, but it rings with genuine bell clarity and sustain. The mini rubber mallets work wonders.', meta: 'Zavelyn Drum™ Mini (White) • Nashville, TN' },
    { avatar: 'RM', name: 'Rachel Morris', title: 'Great screen-free gift for grandchildren', body: 'Gave one to each of my granddaughters. They spent hours playing songs together instead of staring at iPads. A grandparent win!', meta: '2x Zavelyn Drum™ Mini Explorer Pack • Chicago, IL' },
    { avatar: 'ET', name: 'Ethan Turner', title: 'Lovely desk accessory for stress relief', body: 'I keep it right under my computer monitor. During long Zoom calls or stressful emails, a soft tap restores immediate tranquility.', meta: 'Zavelyn Drum™ Mini (Sandstone) • Austin, TX' },
    { avatar: 'MB', name: 'Megan Brooks', title: 'Cute, durable and beautifully tuned', body: 'The red paint is thick and flawless. Has survived multiple drops onto carpet without a scratch or going out of tune.', meta: 'Zavelyn Drum™ Mini (Red) • Denver, CO' },
    { avatar: 'AL', name: 'Anthony Lee', title: 'Perfect introductory instrument', body: 'Builds hand-eye coordination and auditory sensitivity in young kids. Numbered booklet is very well laid out.', meta: 'Zavelyn Drum™ Mini (White) • Seattle, WA' },
    { avatar: 'HC', name: 'Heather Cox', title: 'Sweet and gentle lullabies', body: 'I play Twinkle Twinkle Little Star on this every evening in our baby nursery. Instantly settles our newborn.', meta: 'Zavelyn Drum™ Mini (Pink Tan) • Charlotte, NC' },
    { avatar: 'WB', name: 'William Bailey', title: 'Exceeded all expectations', body: 'Compact, affordable, beautifully packaged, and sounds genuinely healing. Couldn’t be happier with this purchase.', meta: 'Zavelyn Drum™ Mini (Blue) • Portland, OR' }
  ])
};

async function run() {
  const token = await getAccessToken();
  console.log('Got access token. Uploading all 3 customized Handpan funnels...');

  // 1. Pro
  await uploadAsset(token, 'sections/zavelyn-drum-pro-funnel.liquid', generateFunnelLiquid(proConfig));

  // 2. Plus
  await uploadAsset(token, 'sections/zavelyn-drum-plus-funnel.liquid', generateFunnelLiquid(plusConfig));

  // 3. Mini
  await uploadAsset(token, 'sections/zavelyn-drum-mini-funnel.liquid', generateFunnelLiquid(miniConfig));

  console.log('✔ All 3 Handpan funnels refreshed with tailored color palettes & scripts!');
}

run().catch(console.error);
