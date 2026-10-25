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

const liquidContent = `{% comment %}
  Zavelyn Handpans Collection Section
  Full Information & Product Showcase matching https://pandadrum.com/pages/collection
  Self-contained, safe, isolated from other pages.
{% endcomment %}

<div class="zhp-wrapper" id="zhp-collection-root">
  <!-- Top Marquee Bar -->
  <div class="zhp-marquee-bar">
    <div class="zhp-marquee-track">
      <div class="zhp-marquee-item">🚚 FREE EXPRESS WORLDWIDE SHIPPING</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">✨ 432 HZ NATURAL HEALING FREQUENCY</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">🛡️ 30-DAY 100% HAPPINESS GUARANTEE</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">🎁 COMPLETE STARTER KIT INCLUDED WITH EVERY DRUM</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">⭐ OVER 72,000+ HAPPY DRUMMERS WORLDWIDE</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">🚚 FREE EXPRESS WORLDWIDE SHIPPING</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">✨ 432 HZ NATURAL HEALING FREQUENCY</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">🛡️ 30-DAY 100% HAPPINESS GUARANTEE</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">🎁 COMPLETE STARTER KIT INCLUDED WITH EVERY DRUM</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">⭐ OVER 72,000+ HAPPY DRUMMERS WORLDWIDE</div>
      <div class="zhp-marquee-item">•</div>
    </div>
  </div>

  <!-- Hero Section -->
  <section class="zhp-hero">
    <div class="zhp-hero-bg">
      <picture>
        <source media="(max-width: 767px)" srcset="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/heromobile1.avif?v=1716727985">
        <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/herdesktop3.avif?v=1716727145" alt="Zavelyn Handpans - Escape to Calmness" class="zhp-hero-img">
      </picture>
      <div class="zhp-hero-overlay"></div>
    </div>
    <div class="zhp-container zhp-hero-content">
      <div class="zhp-hero-badge">
        <span class="zhp-stars">★★★★★</span>
        <span>Rated <strong>4.92/5</strong> by 72,000+ Happy Drummers</span>
      </div>
      <h1 class="zhp-hero-title">Escape to Calmness</h1>
      <p class="zhp-hero-subtitle">
        Feel the stress melt away with every note. Handcrafted steel tongue drums tuned to pure 432 Hz healing frequencies, bringing tranquility, mindfulness, and joy into your everyday life.
      </p>
      <div class="zhp-hero-trust-pills">
        <span class="zhp-trust-pill"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Free Worldwide Shipping</span>
        <span class="zhp-trust-pill"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> 30-Day Money Back Guarantee</span>
        <span class="zhp-trust-pill"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> No Musical Experience Needed</span>
      </div>
      <div class="zhp-hero-actions">
        <a href="#zhp-bestsellers" class="zhp-btn zhp-btn-primary">EXPLORE ZAVELYN DRUMS</a>
        <a href="#zhp-buyers-guide" class="zhp-btn zhp-btn-outline">WHY 432 HZ MATTERS</a>
      </div>
    </div>
  </section>

  <!-- Press Mentions Bar -->
  <section class="zhp-press-bar">
    <div class="zhp-container zhp-press-inner">
      <span class="zhp-press-label">FEATURED IN LEADING WELLNESS & MUSIC PUBLICATIONS</span>
      <div class="zhp-press-logos">
        <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/wsj.webp?v=1691487451" alt="WSJ" loading="lazy">
        <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/cnbc.webp?v=1691487451" alt="CNBC" loading="lazy">
        <div class="zhp-press-text-logo">FORBES</div>
        <div class="zhp-press-text-logo">YOGA JOURNAL</div>
        <div class="zhp-press-text-logo">MINDBODYGREEN</div>
      </div>
    </div>
  </section>

  <!-- 3 Bestsellers Product Grid Section -->
  <section class="zhp-bestsellers" id="zhp-bestsellers">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">OUR COLLECTION</span>
        <h2 class="zhp-section-title">Zavelyn Drums™ You'll Love</h2>
        <p class="zhp-section-subtitle">Save up to 48% today. Every instrument includes a complete starter kit, padded bag, bamboo mallets, and tutorial songbook.</p>
      </div>

      <div class="zhp-product-grid">
        <!-- Product 1: Pro 15 Tones -->
        <div class="zhp-product-card zhp-card-featured">
          <div class="zhp-card-badge zhp-badge-gold">BEST VALUE • SAVE 48%</div>
          <div class="zhp-card-media">
            <a href="/products/zavelyn-drum-pro">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/PandaDrumPro_White.webp?v=1792868508" alt="Zavelyn Drum Pro 15 Tones" class="zhp-card-img" loading="lazy">
            </a>
          </div>
          <div class="zhp-card-content">
            <div class="zhp-card-rating">
              <span class="zhp-stars">★★★★★</span>
              <span class="zhp-review-count">(571 reviews)</span>
            </div>
            <h3 class="zhp-card-title"><a href="/products/zavelyn-drum-pro">Zavelyn Drum™ Pro</a></h3>
            <div class="zhp-card-meta">Rich sound • 15" • 15 Tones (D-Major)</div>
            <ul class="zhp-card-features">
              <li>✓ Broadest 15-note chromatic range for infinite melodies</li>
              <li>✓ Deep resonant chamber with acoustic warmth</li>
              <li>✓ Handcrafted alloy steel with woolen edge wrap</li>
            </ul>

            <!-- Audio Player -->
            <div class="zhp-audio-player" data-audio-src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Pro_Sound_Bar_v2.mp3">
              <button type="button" class="zhp-audio-btn" aria-label="Play sound preview">
                <svg class="zhp-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <svg class="zhp-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>
              <div class="zhp-audio-info">
                <span class="zhp-audio-label">Hear it in action: <strong>Pro (15 Tones)</strong></span>
                <div class="zhp-audio-bar"><div class="zhp-audio-progress"></div></div>
              </div>
            </div>

            <div class="zhp-card-package">
              <div class="zhp-package-title">What's Included:</div>
              <div class="zhp-package-tags">
                <span>Zavelyn Pro 15"</span>
                <span>FREE Travel Backpack</span>
                <span>FREE Bamboo Mallets</span>
                <span>FREE Songbook (20+ songs)</span>
                <span>Braided Wool Wrap</span>
              </div>
            </div>

            <div class="zhp-card-pricing">
              <span class="zhp-price-current">$259.95</span>
              <span class="zhp-price-compare">$499.95</span>
              <span class="zhp-price-save">Save $240.00</span>
            </div>

            <a href="/products/zavelyn-drum-pro" class="zhp-btn zhp-btn-block zhp-btn-cart">SELECT COLOR & ORDER</a>
            <div class="zhp-card-guarantee">🛡️ 30-Day Money Back • Lifetime Serenity Warranty</div>
          </div>
        </div>

        <!-- Product 2: Plus 11 Tones -->
        <div class="zhp-product-card zhp-card-popular">
          <div class="zhp-card-badge zhp-badge-green">MOST POPULAR • SAVE 47%</div>
          <div class="zhp-card-media">
            <a href="/products/zavelyn-drum-plus">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/PandaDrum_Plus_White.webp?v=1792868520" alt="Zavelyn Drum Plus 11 Tones" class="zhp-card-img" loading="lazy">
            </a>
          </div>
          <div class="zhp-card-content">
            <div class="zhp-card-rating">
              <span class="zhp-stars">★★★★★</span>
              <span class="zhp-review-count">(690 reviews)</span>
            </div>
            <h3 class="zhp-card-title"><a href="/products/zavelyn-drum-plus">Zavelyn Drum™ Plus</a></h3>
            <div class="zhp-card-meta">Most versatile • 11" • 11 Tones (D-Major)</div>
            <ul class="zhp-card-features">
              <li>✓ Ideal balance between portability and musical depth</li>
              <li>✓ Tuned to pure 432 Hz healing relaxation frequency</li>
              <li>✓ Perfect for family bonding, yoga, and meditation</li>
            </ul>

            <!-- Audio Player -->
            <div class="zhp-audio-player" data-audio-src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Plus_Sound_Bar_v2.mp3">
              <button type="button" class="zhp-audio-btn" aria-label="Play sound preview">
                <svg class="zhp-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <svg class="zhp-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>
              <div class="zhp-audio-info">
                <span class="zhp-audio-label">Hear it in action: <strong>Plus (11 Tones)</strong></span>
                <div class="zhp-audio-bar"><div class="zhp-audio-progress"></div></div>
              </div>
            </div>

            <div class="zhp-card-package">
              <div class="zhp-package-title">What's Included:</div>
              <div class="zhp-package-tags">
                <span>Zavelyn Plus 11"</span>
                <span>FREE Travel Shoulder Bag</span>
                <span>FREE Bamboo Mallets</span>
                <span>FREE Songbook (20+ songs)</span>
                <span>Fingertip Picks</span>
              </div>
            </div>

            <div class="zhp-card-pricing">
              <span class="zhp-price-current">$159.95</span>
              <span class="zhp-price-compare">$299.95</span>
              <span class="zhp-price-save">Save $140.00</span>
            </div>

            <a href="/products/zavelyn-drum-plus" class="zhp-btn zhp-btn-block zhp-btn-cart">SELECT COLOR & ORDER</a>
            <div class="zhp-card-guarantee">🛡️ 30-Day Money Back • 3-Year Quality Warranty</div>
          </div>
        </div>

        <!-- Product 3: Mini 8 Tones -->
        <div class="zhp-product-card">
          <div class="zhp-card-badge zhp-badge-blue">BEST FOR KIDS & GIFTS • SAVE 39%</div>
          <div class="zhp-card-media">
            <a href="/products/zavelyn-drum-mini">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/Mini_white.webp?v=1792868532" alt="Zavelyn Drum Mini 8 Tones" class="zhp-card-img" loading="lazy">
            </a>
          </div>
          <div class="zhp-card-content">
            <div class="zhp-card-rating">
              <span class="zhp-stars">★★★★★</span>
              <span class="zhp-review-count">(503 reviews)</span>
            </div>
            <h3 class="zhp-card-title"><a href="/products/zavelyn-drum-mini">Zavelyn Drum™ Mini</a></h3>
            <div class="zhp-card-meta">Best for kids • 6" • 8 Tones (C-Major)</div>
            <ul class="zhp-card-features">
              <li>✓ Ultra-lightweight (1.5 lbs) and portable for tiny hands</li>
              <li>✓ Intuitive pentatonic scale - impossible to hit a wrong note</li>
              <li>✓ Spark musical curiosity and peaceful playtime</li>
            </ul>

            <!-- Audio Player -->
            <div class="zhp-audio-player" data-audio-src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_Sound_Bar_v2.mp3">
              <button type="button" class="zhp-audio-btn" aria-label="Play sound preview">
                <svg class="zhp-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <svg class="zhp-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>
              <div class="zhp-audio-info">
                <span class="zhp-audio-label">Hear it in action: <strong>Mini (8 Tones)</strong></span>
                <div class="zhp-audio-bar"><div class="zhp-audio-progress"></div></div>
              </div>
            </div>

            <div class="zhp-card-package">
              <div class="zhp-package-title">What's Included:</div>
              <div class="zhp-package-tags">
                <span>Zavelyn Mini 6"</span>
                <span>FREE Travel Pouch</span>
                <span>FREE Mallets</span>
                <span>FREE Songbook (20+ songs)</span>
                <span>Tone Stickers</span>
              </div>
            </div>

            <div class="zhp-card-pricing">
              <span class="zhp-price-current">$109.95</span>
              <span class="zhp-price-compare">$179.95</span>
              <span class="zhp-price-save">Save $70.00</span>
            </div>

            <a href="/products/zavelyn-drum-mini" class="zhp-btn zhp-btn-block zhp-btn-cart">SELECT COLOR & ORDER</a>
            <div class="zhp-card-guarantee">🛡️ 30-Day Money Back • 2-Year Warranty</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Interactive Model Switcher & Feature Pillars -->
  <section class="zhp-model-tabs-section">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">EXPLORE BY MODEL</span>
        <h2 class="zhp-section-title">Easy to Learn and Soothing to Play</h2>
        <p class="zhp-section-subtitle">Click each model to explore unique tones, technical dimensions, and ideal musical journeys.</p>
      </div>

      <!-- Tab Buttons -->
      <div class="zhp-tabs-nav" role="tablist">
        <button type="button" class="zhp-tab-btn active" data-tab="tab-pro" role="tab">
          <span class="zhp-tab-name">Zavelyn Drum™ Pro</span>
          <span class="zhp-tab-badge">15 Tones • 15"</span>
        </button>
        <button type="button" class="zhp-tab-btn" data-tab="tab-plus" role="tab">
          <span class="zhp-tab-name">Zavelyn Drum™ Plus</span>
          <span class="zhp-tab-badge">11 Tones • 11"</span>
        </button>
        <button type="button" class="zhp-tab-btn" data-tab="tab-mini" role="tab">
          <span class="zhp-tab-name">Zavelyn Drum™ Mini</span>
          <span class="zhp-tab-badge">8 Tones • 6"</span>
        </button>
      </div>

      <!-- Tab Content Panels -->
      <div class="zhp-tabs-content">
        <!-- Panel Pro -->
        <div class="zhp-tab-panel active" id="tab-pro" role="tabpanel">
          <div class="zhp-tab-grid">
            <div class="zhp-tab-image-col">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/details.webp?v=1792868508" alt="Zavelyn Drum Pro Specs" loading="lazy">
            </div>
            <div class="zhp-tab-info-col">
              <h3>The Masterpiece: Zavelyn Drum™ Pro (15 Tones)</h3>
              <p class="zhp-tab-desc">Designed for deep relaxation and rich acoustic depth. Its expansive 15 notes offer a serene sanctuary for both beginner meditators and seasoned music creators.</p>
              <div class="zhp-specs-list">
                <div class="zhp-spec-item">
                  <strong>Full Musical Range:</strong>
                  <span>D-Major, 15 notes, 15" diameter, 6 lbs - capable of playing complex songs and deep, multi-layered melodies.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>432 Hz Healing Resonance:</strong>
                  <span>Tuned to the earth's natural resonance frequency, proven to reduce stress and heart rate.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Conversation Starter:</strong>
                  <span>Doubles as an exquisite artisanal art piece with handcrafted woolen braid around the perimeter.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Lifetime Serenity Guarantee:</strong>
                  <span>Crafted from certified titanium-alloy steel engineered to never go out of tune.</span>
                </div>
              </div>
              <a href="/products/zavelyn-drum-pro" class="zhp-btn zhp-btn-primary">EXPLORE PRO 15-TONE</a>
            </div>
          </div>
        </div>

        <!-- Panel Plus -->
        <div class="zhp-tab-panel" id="tab-plus" role="tabpanel">
          <div class="zhp-tab-grid">
            <div class="zhp-tab-image-col">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/78.jpg?v=1792868520" alt="Zavelyn Drum Plus Specs" loading="lazy">
            </div>
            <div class="zhp-tab-info-col">
              <h3>The All-Rounder: Zavelyn Drum™ Plus (11 Tones)</h3>
              <p class="zhp-tab-desc">A versatile, heartwarming instrument that brings people together. With its easy playability and rich harmonic tones, it is the most popular choice for households worldwide.</p>
              <div class="zhp-specs-list">
                <div class="zhp-spec-item">
                  <strong>Tunes for Everyone:</strong>
                  <span>D-Major, 11 tones, 11" diameter, 3 lbs - great for family evenings, solo unwinding, and acoustic jams.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Your Daily Peace Sanctuary:</strong>
                  <span>Soothing sound vibrations settle the mind, relieve tension, and promote restorative rest.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Travel-Ready Music:</strong>
                  <span>Includes a padded shoulder bag so you can bring tranquil music into nature, camping, and yoga classes.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Robust and Weatherproof:</strong>
                  <span>Electroplated protective coating prevents rust and wear for years of reliable joy.</span>
                </div>
              </div>
              <a href="/products/zavelyn-drum-plus" class="zhp-btn zhp-btn-primary">EXPLORE PLUS 11-TONE</a>
            </div>
          </div>
        </div>

        <!-- Panel Mini -->
        <div class="zhp-tab-panel" id="tab-mini" role="tabpanel">
          <div class="zhp-tab-grid">
            <div class="zhp-tab-image-col">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/1Box_Drum_8_new.jpg?v=1792868532" alt="Zavelyn Drum Mini Specs" loading="lazy">
            </div>
            <div class="zhp-tab-info-col">
              <h3>The Joyful Start: Zavelyn Drum™ Mini (8 Tones)</h3>
              <p class="zhp-tab-desc">A delightful first step into musical creativity. Sized and pitched for smaller hands and casual desk play, producing sweet bell-like notes with effortless ease.</p>
              <div class="zhp-specs-list">
                <div class="zhp-spec-item">
                  <strong>Child-Friendly Tuning:</strong>
                  <span>C-Major pentatonic scale, 6" diameter, 1.5 lbs - zero wrong notes so anyone plays beautifully right away.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Easy Learn, Instant Joy:</strong>
                  <span>Includes color-coded songbook with popular tunes like Twinkle Twinkle, Happy Birthday, and Ode to Joy.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Durable & Drop-Proof:</strong>
                  <span>Solid alloy steel designed to handle active play without warping or detuning.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Screen-Free Calming Break:</strong>
                  <span>A mindful, tactile alternative to digital screens that cultivates focus, rhythm, and peace.</span>
                </div>
              </div>
              <a href="/products/zavelyn-drum-mini" class="zhp-btn zhp-btn-primary">EXPLORE MINI 8-TONE</a>
            </div>
          </div>
        </div>
      </div>

      <!-- 4 Pillars Feature Cards -->
      <div class="zhp-pillars-grid">
        <div class="zhp-pillar-card">
          <div class="zhp-pillar-icon">
            <img src="https://cdn.shopify.com/s/files/1/0772/9528/8652/files/m_editation.svg?v=1693327629" alt="Stress Relief" loading="lazy">
          </div>
          <h4>Built for Deep Relaxation</h4>
          <p>432 Hz frequencies synchronize brainwaves into the alpha state, melting away daily tension within minutes.</p>
        </div>
        <div class="zhp-pillar-card">
          <div class="zhp-pillar-icon">
            <img src="https://cdn.shopify.com/s/files/1/0772/9528/8652/files/creativity_color.svg?v=1693327715" alt="Creativity" loading="lazy">
          </div>
          <h4>For All Ages & Skill Levels</h4>
          <p>No prior musical education required. Numbered tongues and guided songbooks make playing completely foolproof.</p>
        </div>
        <div class="zhp-pillar-card">
          <div class="zhp-pillar-icon">
            <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/gift.svg?v=1698733901" alt="Gift" loading="lazy">
          </div>
          <h4>A Meaningful, Lasting Gift</h4>
          <p>In a world of fast tech, give a timeless gift that inspires calm, connection, and mindful creative expression.</p>
        </div>
        <div class="zhp-pillar-card">
          <div class="zhp-pillar-icon">
            <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Happy_customers.avif?v=1715926939" alt="Happy Customers" loading="lazy">
          </div>
          <h4>Over 72,000+ Happy Drummers</h4>
          <p>Cherished by yoga teachers, sound therapists, families, and wellness lovers across 70+ countries.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- What You'll Get Section -->
  <section class="zhp-what-you-get">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">EVERYTHING INCLUDED</span>
        <h2 class="zhp-section-title">What You'll Get</h2>
        <p class="zhp-section-subtitle">No hidden extras or surprise add-ons needed. Every Zavelyn Drum ships as a complete all-in-one musical kit.</p>
      </div>

      <div class="zhp-kit-grid">
        <div class="zhp-kit-card">
          <div class="zhp-kit-media">
            <img src="https://cdn.shopify.com/s/files/1/0772/9528/8652/files/Panda_Drum_bag_15t.avif?v=1693393541" alt="Travel Bag" loading="lazy">
          </div>
          <div class="zhp-kit-badge">INCLUDED</div>
          <h4>Anti-Shock Travel Bag</h4>
          <p>Thickly padded custom carrying bag with shoulder straps to keep your drum safe at home or on the road.</p>
        </div>

        <div class="zhp-kit-card">
          <div class="zhp-kit-media">
            <img src="https://cdn.shopify.com/s/files/1/0772/9528/8652/files/mallets15t.avif?v=1693393704" alt="Bamboo Mallets" loading="lazy">
          </div>
          <div class="zhp-kit-badge">INCLUDED</div>
          <h4>2x Bamboo Mallets</h4>
          <p>Acoustically balanced bamboo mallets with soft rubber tips engineered for optimal resonance and pure bell tones.</p>
        </div>

        <div class="zhp-kit-card">
          <div class="zhp-kit-media">
            <img src="https://cdn.shopify.com/s/files/1/0772/9528/8652/files/drum_15t.avif?v=1693393704" alt="Handcrafted Drum" loading="lazy">
          </div>
          <div class="zhp-kit-badge">INCLUDED</div>
          <h4>Handcrafted Zavelyn Drum</h4>
          <p>Master-tuned alloy steel tongue drum with permanent tone markings and laser-cut acoustic tongues.</p>
        </div>

        <div class="zhp-kit-card">
          <div class="zhp-kit-media">
            <img src="https://cdn.shopify.com/s/files/1/0772/9528/8652/files/book15t.avif?v=1693393704" alt="Tutorial Book" loading="lazy">
          </div>
          <div class="zhp-kit-badge">INCLUDED</div>
          <h4>Tutorial Songbook & Videos</h4>
          <p>Comprehensive step-by-step guidebook containing 20+ songs plus QR codes for free online video lessons.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Endorsements Section -->
  <section class="zhp-endorsements">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">EXPERT VOICES</span>
        <h2 class="zhp-section-title">The Voices of Calm and Balance</h2>
        <p class="zhp-section-subtitle">Hear how renowned yoga instructors, authors, and percussionists use Zavelyn Drums to find serenity.</p>
      </div>

      <div class="zhp-endorsements-grid">
        <!-- Endorsement 1 -->
        <div class="zhp-endorsement-card">
          <div class="zhp-endorser-header">
            <img src="https://cdn.shopify.com/s/files/1/0780/8362/1190/files/radhi_v.avif?v=1697095497" alt="Radhi Devlukia" class="zhp-endorser-avatar" loading="lazy">
            <div class="zhp-endorser-details">
              <h4>Radhi Devlukia</h4>
              <div class="zhp-endorser-role">Co-Founder Sama Tea & Joyo Tea</div>
              <div class="zhp-endorser-handle">@radhidevlukia • 2.2M</div>
            </div>
          </div>
          <div class="zhp-endorsement-tag">INNER PEACE</div>
          <blockquote class="zhp-endorsement-quote">
            "When everything is noisy around me, this drum helps me find a corner of calm. It's my beautiful daily escape."
          </blockquote>
        </div>

        <!-- Endorsement 2 -->
        <div class="zhp-endorsement-card">
          <div class="zhp-endorser-header">
            <img src="https://cdn.shopify.com/s/files/1/0780/8362/1190/files/adam_green.avif?v=1697097548" alt="Adam Green" class="zhp-endorser-avatar" loading="lazy">
            <div class="zhp-endorser-details">
              <h4>Adam Green</h4>
              <div class="zhp-endorser-role">Sound Practitioner & Creator</div>
              <div class="zhp-endorser-handle">@ethereal.in.e</div>
            </div>
          </div>
          <div class="zhp-endorsement-tag">SOUND THERAPY</div>
          <blockquote class="zhp-endorsement-quote">
            "The sounds of my drum make me feel good instantly. Everything seems brighter, calmer, and more joyful."
          </blockquote>
        </div>

        <!-- Endorsement 3 -->
        <div class="zhp-endorsement-card">
          <div class="zhp-endorser-header">
            <img src="https://cdn.shopify.com/s/files/1/0780/8362/1190/files/bianca_green.avif?v=1697097548" alt="Bianca Oliveira" class="zhp-endorser-avatar" loading="lazy">
            <div class="zhp-endorser-details">
              <h4>Bianca Oliveira</h4>
              <div class="zhp-endorser-role">Certified Yoga Coach • Biancayoga</div>
              <div class="zhp-endorser-handle">@biancayoga</div>
            </div>
          </div>
          <div class="zhp-endorsement-tag">YOGA & MINDFULNESS</div>
          <blockquote class="zhp-endorsement-quote">
            "The drum adds extraordinary depth to our yoga sessions. My students can feel every movement and breath more deeply."
          </blockquote>
        </div>

        <!-- Endorsement 4 -->
        <div class="zhp-endorsement-card">
          <div class="zhp-endorser-header">
            <img src="https://cdn.shopify.com/s/files/1/0780/8362/1190/files/joana_green.avif?v=1697097548" alt="Joana Duarte" class="zhp-endorser-avatar" loading="lazy">
            <div class="zhp-endorser-details">
              <h4>Joana Duarte</h4>
              <div class="zhp-endorser-role">Mindfulness Instructor & Author</div>
              <div class="zhp-endorser-handle">@joana____duarte • 0.5M</div>
            </div>
          </div>
          <div class="zhp-endorsement-tag">HERE & NOW</div>
          <blockquote class="zhp-endorsement-quote">
            "This drum brings me back here and now, away from anxious thoughts and worries. It feels like a long, deep exhale."
          </blockquote>
        </div>

        <!-- Endorsement 5 -->
        <div class="zhp-endorsement-card">
          <div class="zhp-endorser-header">
            <img src="https://cdn.shopify.com/s/files/1/0780/8362/1190/files/steve_green.avif?v=1697097548" alt="Steve Nguyen" class="zhp-endorser-avatar" loading="lazy">
            <div class="zhp-endorser-details">
              <h4>Steve Nguyen</h4>
              <div class="zhp-endorser-role">Painter, Actor & Director</div>
              <div class="zhp-endorser-handle">@stevenguyen • 0.5M</div>
            </div>
          </div>
          <div class="zhp-endorsement-tag">AUDITORY INSPIRATION</div>
          <blockquote class="zhp-endorsement-quote">
            "When I'm stuck in my art, the acoustic vibration helps dissolve creative blocks. Fresh ideas start flowing naturally."
          </blockquote>
        </div>

        <!-- Endorsement 6 -->
        <div class="zhp-endorsement-card">
          <div class="zhp-endorser-header">
            <img src="https://cdn.shopify.com/s/files/1/0780/8362/1190/files/taylor_green.avif?v=1697097548" alt="Taylor Dorothea" class="zhp-endorser-avatar" loading="lazy">
            <div class="zhp-endorser-details">
              <h4>Taylor Dorothea</h4>
              <div class="zhp-endorser-role">Percussion Influencer & Educator</div>
              <div class="zhp-endorser-handle">@taylor.dorothea • 0.5M</div>
            </div>
          </div>
          <div class="zhp-endorsement-tag">LIVING RHYTHM</div>
          <blockquote class="zhp-endorsement-quote">
            "Each drum has a story. Zavelyn speaks immediately to the heart and inspires me to share acoustic music everywhere."
          </blockquote>
        </div>
      </div>
    </div>
  </section>

  <!-- Detailed Comparison Table Section -->
  <section class="zhp-comparison-section" id="zhp-comparison">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">SIDE BY SIDE</span>
        <h2 class="zhp-section-title">Which Zavelyn Drum™ Should You Choose?</h2>
        <p class="zhp-section-subtitle">Compare all technical specifications, tone character, and included items across our 3 models.</p>
      </div>

      <div class="zhp-table-responsive">
        <table class="zhp-comparison-table">
          <thead>
            <tr>
              <th class="zhp-col-feature">Feature / Spec</th>
              <th class="zhp-col-model">
                <div class="zhp-tbl-header-card">
                  <span class="zhp-tbl-badge zhp-badge-blue">KIDS & GIFTS</span>
                  <h4>Mini</h4>
                  <div class="zhp-tbl-tones">8 Tones • 6"</div>
                  <div class="zhp-tbl-price">$109.95</div>
                </div>
              </th>
              <th class="zhp-col-model zhp-tbl-col-popular">
                <div class="zhp-tbl-header-card">
                  <span class="zhp-tbl-badge zhp-badge-green">MOST POPULAR</span>
                  <h4>Plus</h4>
                  <div class="zhp-tbl-tones">11 Tones • 11"</div>
                  <div class="zhp-tbl-price">$159.95</div>
                </div>
              </th>
              <th class="zhp-col-model zhp-tbl-col-best">
                <div class="zhp-tbl-header-card">
                  <span class="zhp-tbl-badge zhp-badge-gold">BEST VALUE</span>
                  <h4>Pro</h4>
                  <div class="zhp-tbl-tones">15 Tones • 15"</div>
                  <div class="zhp-tbl-price">$259.95</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="zhp-cell-feature">Recommended Age</td>
              <td>All Ages / 3+</td>
              <td class="zhp-tbl-col-popular">4+ to Adult</td>
              <td class="zhp-tbl-col-best">12+ to Adult & Pros</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Musical Scale</td>
              <td>Pentatonic C-Major</td>
              <td class="zhp-tbl-col-popular">D-Major (11 Notes)</td>
              <td class="zhp-tbl-col-best">D-Major Chromatic (15 Notes)</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Tuning & Frequency</td>
              <td>Precision 432 Hz</td>
              <td class="zhp-tbl-col-popular">Natural 432 Hz Healing</td>
              <td class="zhp-tbl-col-best">432 Hz Deep Acoustic Chamber</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Learning Curve</td>
              <td>Extremely Easy (No fail)</td>
              <td class="zhp-tbl-col-popular">Very Easy (Play in 5 mins)</td>
              <td class="zhp-tbl-col-best">Easy to Advanced</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Sound Profile</td>
              <td>Sweet, joyful bell-like tones</td>
              <td class="zhp-tbl-col-popular">Warm, rich relaxing tones</td>
              <td class="zhp-tbl-col-best">Very deep, therapeutic resonance</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Included Gear</td>
              <td>Bag, 2 Mallets, Songbook</td>
              <td class="zhp-tbl-col-popular">Padded Shoulder Bag, Mallets, Picks, Book</td>
              <td class="zhp-tbl-col-best">Heavy-duty Backpack, Mallets, Picks, Book, Wool Wrap</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Best For</td>
              <td>Children, gifts, desk relaxation</td>
              <td class="zhp-tbl-col-popular">Family fun, versatile everyday use</td>
              <td class="zhp-tbl-col-best">Sound baths, yoga, meditation, recording</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Warranty</td>
              <td>2-Year Warranty</td>
              <td class="zhp-tbl-col-popular">3-Year Warranty</td>
              <td class="zhp-tbl-col-best">Lifetime Serenity Guarantee</td>
            </tr>
            <tr class="zhp-tbl-actions-row">
              <td class="zhp-cell-feature">Select Model</td>
              <td><a href="/products/zavelyn-drum-mini" class="zhp-btn zhp-btn-sm zhp-btn-outline">Order Mini</a></td>
              <td class="zhp-tbl-col-popular"><a href="/products/zavelyn-drum-plus" class="zhp-btn zhp-btn-sm zhp-btn-primary">Order Plus</a></td>
              <td class="zhp-tbl-col-best"><a href="/products/zavelyn-drum-pro" class="zhp-btn zhp-btn-sm zhp-btn-gold">Order Pro</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- The Ultimate Buyer's Guide Section -->
  <section class="zhp-buyers-guide" id="zhp-buyers-guide">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">ESSENTIAL KNOWLEDGE • 3 MIN READ</span>
        <h2 class="zhp-section-title">The Ultimate Zavelyn Drum™ Buyer's Guide</h2>
        <p class="zhp-section-subtitle">5 Essential Facts That Make Zavelyn Drums a Top Pick for Wellness, Family, and Musicians.</p>
      </div>

      <div class="zhp-guide-list">
        <!-- Fact 1 -->
        <div class="zhp-guide-item">
          <div class="zhp-guide-number">01</div>
          <div class="zhp-guide-content">
            <div class="zhp-guide-tags">
              <span class="zhp-badge-pill">Mini • 8 Tones</span>
              <span class="zhp-badge-pill">Plus • 11 Tones</span>
            </div>
            <h3>Awakening Inner Creativity</h3>
            <p>You don't need a single hour of music lessons. Because our drums are harmonically tuned to pentatonic and diatonic scales, every single note sounds melodic with every other note. Whether you are a first-time musical adventurer or a lifelong learner reigniting an old passion, you can play captivating melodies from your very first tap.</p>
            <div class="zhp-guide-who"><strong>Who it's for:</strong> Beginners, revitalized musicians, curious creators, and anyone seeking a joyful hobby.</div>
          </div>
          <div class="zhp-guide-media">
            <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Fena_-_IG_size-8.avif?v=1720589813" alt="Awakening Creativity" loading="lazy">
          </div>
        </div>

        <!-- Fact 2 -->
        <div class="zhp-guide-item">
          <div class="zhp-guide-number">02</div>
          <div class="zhp-guide-content">
            <div class="zhp-guide-tags">
              <span class="zhp-badge-pill">Plus • 11 Tones</span>
              <span class="zhp-badge-pill">Pro • 15 Tones</span>
            </div>
            <h3>Fun for the Whole Family (Zero Screens Needed)</h3>
            <p>Creating shared household memories has never been this harmonious. Zavelyn Drum Plus and Pro ensure every family member finds their rhythm, fostering meaningful bonding moments that last a lifetime while gently drawing children away from tablet and smartphone screens.</p>
            <div class="zhp-guide-who"><strong>Who it's for:</strong> Families of every size, kids, parents, and grandparents playing together.</div>
          </div>
          <div class="zhp-guide-media">
            <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Fena_-_IG_size-9.avif?v=1720589813" alt="Family Bonding" loading="lazy">
          </div>
        </div>

        <!-- Fact 3 -->
        <div class="zhp-guide-item">
          <div class="zhp-guide-number">03</div>
          <div class="zhp-guide-content">
            <div class="zhp-guide-tags">
              <span class="zhp-badge-pill">Plus • 11 Tones</span>
              <span class="zhp-badge-pill">Pro • 15 Tones</span>
            </div>
            <h3>Healing Resonance & Somatic Calming</h3>
            <p>Embark on a sound journey where every note mends, resonates, and harmonizes. Scientific studies show that 432 Hz acoustic vibrations lower cortisol levels, quiet racing thoughts, and trigger natural somatic nervous system restoration. The handcrafted resonance chamber in the Pro 15 Tones delivers unparalleled immersion.</p>
            <div class="zhp-guide-who"><strong>Who it's for:</strong> Sound healing therapists, yoga studios, meditation practitioners, and high-stress professionals.</div>
          </div>
          <div class="zhp-guide-media">
            <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Fena_-_IG_size-10.avif?v=1720589813" alt="Healing Resonance" loading="lazy">
          </div>
        </div>

        <!-- Fact 4 -->
        <div class="zhp-guide-item">
          <div class="zhp-guide-number">04</div>
          <div class="zhp-guide-content">
            <div class="zhp-guide-tags">
              <span class="zhp-badge-pill">Plus • 11 Tones</span>
              <span class="zhp-badge-pill">Pro • 15 Tones</span>
            </div>
            <h3>Making Music More Magical</h3>
            <p>Elevate every tune, be it a bedtime lullaby, a campfire singalong, or an intricate studio recording. With 11 to 15 harmonic notes, songwriters and melophiles gain an expressive sonic flavor that blends acoustic bell-like purity with meditative sustained reverb.</p>
            <div class="zhp-guide-who"><strong>Who it's for:</strong> Musicians, multi-instrumentalists, songwriters, and melody lovers.</div>
          </div>
          <div class="zhp-guide-media">
            <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Fena_-_IG_size-11.avif?v=1720589813" alt="Making Music Magical" loading="lazy">
          </div>
        </div>

        <!-- Fact 5 -->
        <div class="zhp-guide-item">
          <div class="zhp-guide-number">05</div>
          <div class="zhp-guide-content">
            <div class="zhp-guide-tags">
              <span class="zhp-badge-pill">Mini • 8 Tones</span>
            </div>
            <h3>Boost Your Child's Cognitive Development</h3>
            <p>Unveil a world of musical wonder with the Zavelyn Drum™ Mini (8 Tones). Engineered for smaller hands, it cultivates hand-eye coordination, bilateral motor skills, and focused concentration while providing an instantly rewarding sensory experience.</p>
            <div class="zhp-guide-who"><strong>Who it's for:</strong> Curious toddlers, young dreamers, and teachers seeking positive sensory tools.</div>
          </div>
          <div class="zhp-guide-media">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/panda-drum-6-inch-steel-tongue-drum.jpg?v=1792868532" alt="Kids Music" loading="lazy">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Customer Testimonials Section -->
  <section class="zhp-reviews-section">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">COMMUNITY VOICES</span>
        <h2 class="zhp-section-title">What Our Customers Say</h2>
        <p class="zhp-section-subtitle">Real verified drummers sharing their journey of calm, focus, and musical joy.</p>
        <div class="zhp-reviews-summary">
          <span class="zhp-stars">★★★★★</span>
          <strong>4.92 / 5.0 Average Rating</strong>
          <span>Based on 72,000+ Verified Purchases Worldwide</span>
        </div>
      </div>

      <div class="zhp-reviews-grid">
        <!-- Review 1 -->
        <div class="zhp-review-card">
          <div class="zhp-review-header">
            <span class="zhp-stars">★★★★★</span>
            <span class="zhp-verified-badge"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Verified Buyer</span>
          </div>
          <h4 class="zhp-review-title">"Touches deep into your soul..."</h4>
          <p class="zhp-review-text">"A truly magnificent instrument! The resonant sound touches so deeply. Playing for just ten minutes before bed has completely transformed my sleep quality. No musical talent needed, it just sings!"</p>
          <div class="zhp-reviewer-info">
            <strong>Sarah M.</strong> — <span>Verified Owner of Zavelyn Drum™ Pro</span>
          </div>
        </div>

        <!-- Review 2 -->
        <div class="zhp-review-card">
          <div class="zhp-review-header">
            <span class="zhp-stars">★★★★★</span>
            <span class="zhp-verified-badge"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Verified Buyer</span>
          </div>
          <h4 class="zhp-review-title">"Brought our family together"</h4>
          <p class="zhp-review-text">"Bought the Plus 11-tone for our living room. My kids (6 and 9) put down their iPads without even being asked. We pass it around every evening and make peaceful melodies together."</p>
          <div class="zhp-reviewer-info">
            <strong>David & Elena T.</strong> — <span>Verified Owner of Zavelyn Drum™ Plus</span>
          </div>
        </div>

        <!-- Review 3 -->
        <div class="zhp-review-card">
          <div class="zhp-review-header">
            <span class="zhp-stars">★★★★★</span>
            <span class="zhp-verified-badge"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Verified Buyer</span>
          </div>
          <h4 class="zhp-review-title">"Perfection for my yoga studio"</h4>
          <p class="zhp-review-text">"The 432 Hz frequency is genuine. During savasana, playing soft tones on the Pro 15 creates goosebumps throughout the room. The finish and bag are top tier."</p>
          <div class="zhp-reviewer-info">
            <strong>Chloe R.</strong> — <span>Yoga & Meditation Instructor</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section & Guarantee -->
  <section class="zhp-faq-section" id="zhp-faq">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">COMMON QUESTIONS</span>
        <h2 class="zhp-section-title">Frequently Asked Questions</h2>
        <p class="zhp-section-subtitle">Everything you need to know about shipping, playing ease, and our 100% Happiness Guarantee.</p>
      </div>

      <div class="zhp-faq-accordion">
        <div class="zhp-faq-item">
          <button type="button" class="zhp-faq-question">
            <span>How long does shipping take?</span>
            <span class="zhp-faq-icon">+</span>
          </button>
          <div class="zhp-faq-answer">
            <p>We provide <strong>FREE tracked shipping</strong> on all orders. Orders are processed within 1-3 business days. Estimated delivery times once dispatched:</p>
            <ul>
              <li><strong>United States:</strong> 4-9 business days</li>
              <li><strong>United Kingdom:</strong> 7-12 business days</li>
              <li><strong>Australia & Europe:</strong> 7-12 business days</li>
              <li><strong>Canada:</strong> 7-18 business days</li>
              <li><strong>Rest of the World:</strong> 10-20 business days</li>
            </ul>
          </div>
        </div>

        <div class="zhp-faq-item">
          <button type="button" class="zhp-faq-question">
            <span>Can literally anyone play a Zavelyn Drum?</span>
            <span class="zhp-faq-icon">+</span>
          </button>
          <div class="zhp-faq-answer">
            <p><strong>Yes, 100%!</strong> Zavelyn Drums are purposefully engineered with harmonic scales and clear numbered tone indicators. You do not need to read sheet music or have any musical background. Included in your box is a songbook with 20+ familiar songs using simple numbers, allowing anyone from young children to seniors to play captivating melodies within 5 minutes.</p>
          </div>
        </div>

        <div class="zhp-faq-item">
          <button type="button" class="zhp-faq-question">
            <span>What is your 30-Day Happiness Guarantee?</span>
            <span class="zhp-faq-icon">+</span>
          </button>
          <div class="zhp-faq-answer">
            <p>We want you to experience genuine peace of mind. If for any reason you are not completely delighted with your Zavelyn Drum within 30 days of delivery, simply email our 24/7 support team. You can return your complete package for a hassle-free, full refund.</p>
          </div>
        </div>

        <div class="zhp-faq-item">
          <button type="button" class="zhp-faq-question">
            <span>What comes included with my order?</span>
            <span class="zhp-faq-icon">+</span>
          </button>
          <div class="zhp-faq-answer">
            <p>Every Zavelyn Drum ships as a complete all-in-one set: your selected drum (Mini, Plus, or Pro), a custom-fitted anti-shock padded travel bag/backpack, 2 precision bamboo mallets with soft acoustic tips, fingertip picks for fingerstyle playing, tone stickers, and our full tutorial songbook.</p>
          </div>
        </div>

        <div class="zhp-faq-item">
          <button type="button" class="zhp-faq-question">
            <span>Why is the 432 Hz frequency so special?</span>
            <span class="zhp-faq-icon">+</span>
          </button>
          <div class="zhp-faq-answer">
            <p>Unlike standard concert tuning (440 Hz), 432 Hz is known as the natural harmonic frequency of nature. Its acoustic wavelength produces warmer, softer tones that resonate with biological rhythms, promoting deep nervous system relaxation, stress reduction, and mental clarity.</p>
          </div>
        </div>
      </div>

      <!-- Trust Bottom Guarantee Card -->
      <div class="zhp-guarantee-card">
        <div class="zhp-guarantee-icon">🛡️</div>
        <div class="zhp-guarantee-text">
          <h3>100% Risk-Free Happiness Guarantee</h3>
          <p>Over 72,000+ drummers love Zavelyn. If it does not bring you peace and joy, our friendly support team is here to make it right with easy 30-day returns and dedicated lifetime customer care.</p>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
/* Scoped Zavelyn Handpans Styles */
.zhp-wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1F2923;
  background-color: #FAF8F5;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.zhp-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Marquee Bar */
.zhp-marquee-bar {
  background-color: #2C4236;
  color: #FAF8F5;
  overflow: hidden;
  white-space: nowrap;
  padding: 10px 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.zhp-marquee-track {
  display: inline-flex;
  align-items: center;
  animation: zhp-marquee 35s linear infinite;
}
.zhp-marquee-item {
  padding: 0 16px;
  display: inline-block;
}
@keyframes zhp-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Hero Section */
.zhp-hero {
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: center;
  color: #FFFFFF;
  padding: 60px 0;
  background-color: #2C4236;
  overflow: hidden;
}
.zhp-hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.zhp-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.zhp-hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(31, 41, 35, 0.88) 0%, rgba(44, 66, 54, 0.75) 100%);
}
.zhp-hero-content {
  position: relative;
  z-index: 2;
  max-width: 680px;
}
.zhp-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 13px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.25);
}
.zhp-stars {
  color: #FBBF24;
  letter-spacing: 2px;
}
.zhp-hero-title {
  font-size: 46px;
  line-height: 1.15;
  font-weight: 800;
  margin: 0 0 16px;
  color: #FFFFFF;
  letter-spacing: -0.5px;
}
.zhp-hero-subtitle {
  font-size: 17px;
  line-height: 1.6;
  color: #E2E8F0;
  margin: 0 0 24px;
}
.zhp-hero-trust-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 30px;
}
.zhp-trust-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.12);
  padding: 5px 12px;
  border-radius: 6px;
}
.zhp-trust-pill svg {
  width: 14px;
  height: 14px;
  color: #73C09C;
}
.zhp-hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* Buttons */
.zhp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 26px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}
.zhp-btn-primary {
  background-color: #73C09C;
  color: #1F2923;
}
.zhp-btn-primary:hover {
  background-color: #5FA886;
  color: #FFFFFF;
  transform: translateY(-1px);
}
.zhp-btn-outline {
  background-color: transparent;
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.4);
}
.zhp-btn-outline:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #FFFFFF;
}
.zhp-btn-cart {
  background-color: #2C4236;
  color: #FFFFFF;
}
.zhp-btn-cart:hover {
  background-color: #1B2B22;
  color: #FFFFFF;
}
.zhp-btn-gold {
  background-color: #D97706;
  color: #FFFFFF;
}
.zhp-btn-gold:hover {
  background-color: #B45309;
}
.zhp-btn-block {
  width: 100%;
}
.zhp-btn-sm {
  padding: 8px 16px;
  font-size: 12px;
}

/* Press Bar */
.zhp-press-bar {
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  padding: 20px 0;
}
.zhp-press-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.zhp-press-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #6B7280;
  text-transform: uppercase;
}
.zhp-press-logos {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 36px;
  flex-wrap: wrap;
}
.zhp-press-logos img {
  height: 24px;
  width: auto;
  opacity: 0.65;
  filter: grayscale(100%);
  transition: opacity 0.2s;
}
.zhp-press-logos img:hover {
  opacity: 1;
}
.zhp-press-text-logo {
  font-size: 15px;
  font-weight: 800;
  color: #6B7280;
  letter-spacing: 1px;
}

/* Section Common Header */
.zhp-section-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 40px;
}
.zhp-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #2C4236;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.zhp-section-title {
  font-size: 34px;
  font-weight: 800;
  color: #1F2923;
  margin: 0 0 12px;
  line-height: 1.2;
}
.zhp-section-subtitle {
  font-size: 16px;
  color: #4B5563;
  margin: 0;
  line-height: 1.6;
}

/* Product Cards Grid */
.zhp-bestsellers {
  padding: 70px 0;
}
.zhp-product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-items: stretch;
}
.zhp-product-card {
  background-color: #FFFFFF;
  border-radius: 14px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.zhp-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}
.zhp-card-featured {
  border: 2px solid #D97706;
}
.zhp-card-popular {
  border: 2px solid #73C09C;
}
.zhp-card-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}
.zhp-badge-gold {
  background-color: #D97706;
  color: #FFFFFF;
}
.zhp-badge-green {
  background-color: #2C4236;
  color: #FFFFFF;
}
.zhp-badge-blue {
  background-color: #2563EB;
  color: #FFFFFF;
}
.zhp-card-media {
  background-color: #F8FAF9;
  text-align: center;
  padding: 24px 20px 10px;
}
.zhp-card-img {
  max-width: 100%;
  height: 240px;
  object-fit: contain;
  transition: transform 0.3s;
}
.zhp-product-card:hover .zhp-card-img {
  transform: scale(1.04);
}
.zhp-card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.zhp-card-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.zhp-review-count {
  font-size: 12px;
  color: #6B7280;
  font-weight: 600;
}
.zhp-card-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 4px;
}
.zhp-card-title a {
  color: #1F2923;
  text-decoration: none;
}
.zhp-card-title a:hover {
  color: #2C4236;
}
.zhp-card-meta {
  font-size: 13px;
  font-weight: 600;
  color: #2C4236;
  margin-bottom: 14px;
}
.zhp-card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  font-size: 13px;
  color: #4B5563;
  line-height: 1.6;
}
.zhp-card-features li {
  margin-bottom: 4px;
}

/* Audio Player Component */
.zhp-audio-player {
  background: #F1F5F3;
  border-radius: 30px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  border: 1px solid #E2E8F0;
}
.zhp-audio-btn {
  background: #2C4236;
  color: #FFFFFF;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  transition: transform 0.15s;
}
.zhp-audio-btn:hover {
  transform: scale(1.1);
}
.zhp-audio-btn svg {
  width: 14px;
  height: 14px;
}
.zhp-audio-info {
  flex-grow: 1;
}
.zhp-audio-label {
  display: block;
  font-size: 11px;
  color: #4B5563;
  margin-bottom: 3px;
}
.zhp-audio-bar {
  height: 4px;
  background: #CBD5E1;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}
.zhp-audio-progress {
  height: 100%;
  width: 0%;
  background: #2C4236;
  border-radius: 2px;
  transition: width 0.1s linear;
}

/* Package contents tags */
.zhp-card-package {
  background: #FAF8F5;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 16px;
  border: 1px dashed #D1D5DB;
}
.zhp-package-title {
  font-size: 11px;
  font-weight: 700;
  color: #2C4236;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.zhp-package-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.zhp-package-tags span {
  font-size: 11px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  padding: 2px 6px;
  color: #374151;
}

/* Pricing */
.zhp-card-pricing {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: auto;
  margin-bottom: 14px;
}
.zhp-price-current {
  font-size: 24px;
  font-weight: 800;
  color: #1F2923;
}
.zhp-price-compare {
  font-size: 16px;
  color: #9CA3AF;
  text-decoration: line-through;
}
.zhp-price-save {
  font-size: 12px;
  font-weight: 700;
  color: #D97706;
  background: #FEF3C7;
  padding: 2px 6px;
  border-radius: 4px;
}
.zhp-card-guarantee {
  text-align: center;
  font-size: 11px;
  color: #6B7280;
  margin-top: 10px;
}

/* Interactive Model Switcher & Pillars */
.zhp-model-tabs-section {
  padding: 70px 0;
  background-color: #FFFFFF;
}
.zhp-tabs-nav {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}
.zhp-tab-btn {
  background: #FAF8F5;
  border: 1px solid #E5E7EB;
  border-radius: 30px;
  padding: 10px 22px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.zhp-tab-btn.active {
  background-color: #2C4236;
  border-color: #2C4236;
}
.zhp-tab-btn .zhp-tab-name {
  font-size: 15px;
  font-weight: 700;
  color: #1F2923;
}
.zhp-tab-btn.active .zhp-tab-name {
  color: #FFFFFF;
}
.zhp-tab-btn .zhp-tab-badge {
  font-size: 12px;
  color: #6B7280;
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 12px;
}
.zhp-tab-btn.active .zhp-tab-badge {
  color: #73C09C;
  background: rgba(255, 255, 255, 0.15);
}
.zhp-tab-panel {
  display: none;
}
.zhp-tab-panel.active {
  display: block;
}
.zhp-tab-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  background: #FAF8F5;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 50px;
}
.zhp-tab-image-col img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.zhp-tab-info-col h3 {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 12px;
  color: #1F2923;
}
.zhp-tab-desc {
  font-size: 15px;
  color: #4B5563;
  margin: 0 0 20px;
  line-height: 1.6;
}
.zhp-specs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
.zhp-spec-item {
  font-size: 14px;
  line-height: 1.5;
}
.zhp-spec-item strong {
  color: #2C4236;
}
.zhp-spec-item span {
  color: #4B5563;
}

/* Feature Pillars Grid */
.zhp-pillars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.zhp-pillar-card {
  background: #FAF8F5;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  text-align: center;
}
.zhp-pillar-icon {
  margin-bottom: 14px;
}
.zhp-pillar-icon img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.zhp-pillar-card h4 {
  font-size: 16px;
  font-weight: 700;
  color: #1F2923;
  margin: 0 0 8px;
}
.zhp-pillar-card p {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
  margin: 0;
}

/* What You'll Get */
.zhp-what-you-get {
  padding: 70px 0;
  background-color: #FAF8F5;
}
.zhp-kit-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.zhp-kit-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #E5E7EB;
  text-align: center;
  position: relative;
}
.zhp-kit-media {
  margin-bottom: 16px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.zhp-kit-media img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.zhp-kit-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #2C4236;
  background: #DCFCE7;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 10px;
}
.zhp-kit-card h4 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px;
  color: #1F2923;
}
.zhp-kit-card p {
  font-size: 13px;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
}

/* Endorsements */
.zhp-endorsements {
  padding: 70px 0;
  background-color: #FFFFFF;
}
.zhp-endorsements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.zhp-endorsement-card {
  background: #FAF8F5;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}
.zhp-endorser-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}
.zhp-endorser-avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #73C09C;
}
.zhp-endorser-details h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1F2923;
}
.zhp-endorser-role {
  font-size: 12px;
  color: #4B5563;
}
.zhp-endorser-handle {
  font-size: 11px;
  color: #9CA3AF;
}
.zhp-endorsement-tag {
  display: inline-block;
  align-self: flex-start;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #2C4236;
  background: rgba(44, 66, 54, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
}
.zhp-endorsement-quote {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  font-style: italic;
  margin: 0;
  flex-grow: 1;
}

/* Comparison Table */
.zhp-comparison-section {
  padding: 70px 0;
  background-color: #FAF8F5;
}
.zhp-table-responsive {
  overflow-x: auto;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  background: #FFFFFF;
}
.zhp-comparison-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  min-width: 680px;
}
.zhp-comparison-table th,
.zhp-comparison-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
  font-size: 14px;
}
.zhp-comparison-table th {
  background-color: #F8FAF9;
  vertical-align: top;
}
.zhp-col-feature,
.zhp-cell-feature {
  text-align: left;
  font-weight: 700;
  color: #1F2923;
  width: 25%;
}
.zhp-tbl-header-card {
  padding: 10px;
}
.zhp-tbl-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}
.zhp-tbl-header-card h4 {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 4px;
  color: #1F2923;
}
.zhp-tbl-tones {
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 6px;
}
.zhp-tbl-price {
  font-size: 18px;
  font-weight: 800;
  color: #2C4236;
}
.zhp-tbl-col-popular {
  background-color: #F0FDF4;
}
.zhp-tbl-col-best {
  background-color: #FFFBEB;
}
.zhp-tbl-actions-row td {
  padding: 20px;
}

/* Buyer's Guide */
.zhp-buyers-guide {
  padding: 70px 0;
  background-color: #FFFFFF;
}
.zhp-guide-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.zhp-guide-item {
  display: grid;
  grid-template-columns: 70px 1fr 340px;
  gap: 30px;
  background: #FAF8F5;
  border-radius: 14px;
  padding: 32px;
  border: 1px solid #E5E7EB;
  align-items: center;
}
.zhp-guide-number {
  font-size: 42px;
  font-weight: 900;
  color: #73C09C;
  line-height: 1;
}
.zhp-guide-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.zhp-badge-pill {
  font-size: 11px;
  font-weight: 700;
  background: #E2E8F0;
  color: #334155;
  padding: 2px 8px;
  border-radius: 4px;
}
.zhp-guide-content h3 {
  font-size: 22px;
  font-weight: 800;
  color: #1F2923;
  margin: 0 0 10px;
}
.zhp-guide-content p {
  font-size: 14px;
  line-height: 1.6;
  color: #4B5563;
  margin: 0 0 14px;
}
.zhp-guide-who {
  font-size: 13px;
  color: #2C4236;
  background: rgba(44, 66, 54, 0.06);
  padding: 8px 12px;
  border-radius: 6px;
  display: inline-block;
}
.zhp-guide-media img {
  width: 100%;
  height: 220px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

/* Customer Reviews */
.zhp-reviews-section {
  padding: 70px 0;
  background-color: #FAF8F5;
}
.zhp-reviews-summary {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  color: #4B5563;
}
.zhp-reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.zhp-review-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
}
.zhp-review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.zhp-verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #059669;
}
.zhp-verified-badge svg {
  width: 14px;
  height: 14px;
}
.zhp-review-title {
  font-size: 16px;
  font-weight: 700;
  color: #1F2923;
  margin: 0 0 10px;
}
.zhp-review-text {
  font-size: 14px;
  line-height: 1.6;
  color: #4B5563;
  margin: 0 0 16px;
  flex-grow: 1;
}
.zhp-reviewer-info {
  font-size: 12px;
  color: #6B7280;
  border-top: 1px solid #F3F4F6;
  padding-top: 12px;
}

/* FAQ Accordion */
.zhp-faq-section {
  padding: 70px 0;
  background-color: #FFFFFF;
}
.zhp-faq-accordion {
  max-width: 800px;
  margin: 0 auto 50px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.zhp-faq-item {
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  overflow: hidden;
  background: #FAF8F5;
  transition: border-color 0.2s;
}
.zhp-faq-item.active {
  border-color: #73C09C;
  background: #FFFFFF;
}
.zhp-faq-question {
  width: 100%;
  padding: 18px 20px;
  background: none;
  border: none;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: #1F2923;
  cursor: pointer;
}
.zhp-faq-icon {
  font-size: 22px;
  color: #2C4236;
  font-weight: 400;
  transition: transform 0.2s;
}
.zhp-faq-item.active .zhp-faq-icon {
  transform: rotate(45deg);
}
.zhp-faq-answer {
  display: none;
  padding: 0 20px 20px;
  font-size: 14px;
  line-height: 1.6;
  color: #4B5563;
}
.zhp-faq-item.active .zhp-faq-answer {
  display: block;
}
.zhp-faq-answer ul {
  padding-left: 20px;
  margin: 8px 0;
}
.zhp-faq-answer li {
  margin-bottom: 4px;
}

/* Guarantee Card */
.zhp-guarantee-card {
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #2C4236 0%, #1F2923 100%);
  color: #FFFFFF;
  border-radius: 14px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.zhp-guarantee-icon {
  font-size: 48px;
  flex-shrink: 0;
}
.zhp-guarantee-text h3 {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 8px;
  color: #FFFFFF;
}
.zhp-guarantee-text p {
  font-size: 14px;
  color: #D1D5DB;
  line-height: 1.6;
  margin: 0;
}

/* Responsive Media Queries */
@media (max-width: 991px) {
  .zhp-product-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }
  .zhp-tab-grid {
    grid-template-columns: 1fr;
  }
  .zhp-pillars-grid,
  .zhp-kit-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .zhp-endorsements-grid,
  .zhp-reviews-grid {
    grid-template-columns: 1fr;
  }
  .zhp-guide-item {
    grid-template-columns: 1fr;
    text-align: left;
  }
  .zhp-guide-media img {
    height: auto;
    max-height: 280px;
  }
}

@media (max-width: 640px) {
  .zhp-hero-title {
    font-size: 32px;
  }
  .zhp-section-title {
    font-size: 26px;
  }
  .zhp-pillars-grid,
  .zhp-kit-grid {
    grid-template-columns: 1fr;
  }
  .zhp-guarantee-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>

<script>
(function() {
  // Audio Player Functionality
  const audioPlayers = document.querySelectorAll('.zhp-audio-player');
  let currentAudio = null;
  let currentButton = null;
  let currentProgress = null;

  audioPlayers.forEach(player => {
    const src = player.getAttribute('data-audio-src');
    if (!src) return;
    const btn = player.querySelector('.zhp-audio-btn');
    const playIcon = player.querySelector('.zhp-icon-play');
    const pauseIcon = player.querySelector('.zhp-icon-pause');
    const progressBar = player.querySelector('.zhp-audio-progress');

    const audio = new Audio(src);

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentButton) {
          currentButton.querySelector('.zhp-icon-play').style.display = 'block';
          currentButton.querySelector('.zhp-icon-pause').style.display = 'none';
        }
        if (currentProgress) {
          currentProgress.style.width = '0%';
        }
      }

      if (audio.paused) {
        audio.play().then(() => {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
          currentAudio = audio;
          currentButton = btn;
          currentProgress = progressBar;
        }).catch(err => console.log('Audio autoplay blocked', err));
      } else {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    });

    audio.addEventListener('timeupdate', function() {
      if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = pct + '%';
      }
    });

    audio.addEventListener('ended', function() {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      progressBar.style.width = '0%';
    });
  });

  // Model Tabs Switcher
  const tabButtons = document.querySelectorAll('.zhp-tab-btn');
  const tabPanels = document.querySelectorAll('.zhp-tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.zhp-faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', function() {
      const item = this.closest('.zhp-faq-item');
      item.classList.toggle('active');
    });
  });
})();
</script>

{% schema %}
{
  "name": "Zavelyn Handpans",
  "settings": []
}
{% endschema %}
`;

async function run() {
  const token = await getAccessToken();
  console.log('Got access token');

  // 1. Upload sections/zavelyn-handpans-collection.liquid
  console.log('Uploading sections/zavelyn-handpans-collection.liquid...');
  const secRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/zavelyn-handpans-collection.liquid',
        value: liquidContent
      }
    })
  });
  const secData = await secRes.json();
  console.log('Section upload result:', secData.asset ? 'SUCCESS' : secData);

  // 2. Upload templates/collection.zavelyn-handpans.json
  console.log('Uploading templates/collection.zavelyn-handpans.json...');
  const templateJson = JSON.stringify({
    name: "Zavelyn Handpans Collection",
    wrapper: "div#shopify-section-zavelyn-handpans-collection",
    sections: {
      "main": {
        "type": "zavelyn-handpans-collection",
        "settings": {}
      }
    },
    order: ["main"]
  }, null, 2);

  const tplRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'templates/collection.zavelyn-handpans.json',
        value: templateJson
      }
    })
  });
  const tplData = await tplRes.json();
  console.log('Collection template upload result:', tplData.asset ? 'SUCCESS' : tplData);

  // 3. Upload templates/page.zavelyn-handpans.json
  console.log('Uploading templates/page.zavelyn-handpans.json...');
  const pageTplJson = JSON.stringify({
    name: "Zavelyn Handpans Page",
    wrapper: "div#shopify-section-zavelyn-handpans-page",
    sections: {
      "main": {
        "type": "zavelyn-handpans-collection",
        "settings": {}
      }
    },
    order: ["main"]
  }, null, 2);

  const pageTplRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'templates/page.zavelyn-handpans.json',
        value: pageTplJson
      }
    })
  });
  const pageTplData = await pageTplRes.json();
  console.log('Page template upload result:', pageTplData.asset ? 'SUCCESS' : pageTplData);

  // 4. Ensure Page /pages/collection exists and has template_suffix: 'zavelyn-handpans'
  console.log('Ensuring Page /pages/collection exists...');
  const pagesRes = await fetch(`https://${SHOP}/admin/api/2024-10/pages.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pagesData = await pagesRes.json();
  const existingColPage = pagesData.pages.find(p => p.handle === 'collection');
  if (existingColPage) {
    console.log('Updating existing page id:', existingColPage.id);
    const updateRes = await fetch(`https://${SHOP}/admin/api/2024-10/pages/${existingColPage.id}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        page: {
          id: existingColPage.id,
          template_suffix: 'zavelyn-handpans'
        }
      })
    });
    console.log('Updated page:', await updateRes.json());
  } else {
    console.log('Creating new page /pages/collection...');
    const createRes = await fetch(`https://${SHOP}/admin/api/2024-10/pages.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        page: {
          title: 'Collection',
          handle: 'collection',
          template_suffix: 'zavelyn-handpans',
          body_html: ''
        }
      })
    });
    console.log('Created page:', await createRes.json());
  }
}

run().catch(console.error);
