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

// Read heating-lamp-funnel.liquid as CSS & JS base
const baseFunnel = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');

// Extract CSS from baseFunnel
const cssStart = baseFunnel.indexOf('<style>');
const cssEnd = baseFunnel.indexOf('</style>');
const baseCss = baseFunnel.substring(cssStart + 7, cssEnd);

// Build Thoson MagTrack Funnel Liquid
const thosonLiquid = `
<!-- THOSON MAGTRACK FUNNEL SECTION (Zavelyn Design System) -->
<div class="wf-funnel-wrapper" id="fn-offer">
  
  <!-- SECTION 1: HERO BUYBOX -->
  <section class="wf-section wf-hero-buybox">
    <div class="wf-container wf-hero-grid">
      
      <!-- LEFT: Dynamic Media Gallery -->
      <div class="wf-gallery-col">
        <div class="wf-gallery-sticky">
          <div class="wf-gallery-main">
            <span class="wf-gallery-badge">50% OFF TODAY</span>
            <button type="button" class="wf-gallery-arrow prev" onclick="skipWfGallery(-1)" aria-label="Previous image">&#8249;</button>
            <img id="wf-main-img" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/MagTrack.webp?v=1792809300" alt="Zavelyn MagTrack Modular Magnetic Train Set" onclick="skipWfGallery(1)">
            <button type="button" class="wf-gallery-arrow next" onclick="skipWfGallery(1)" aria-label="Next image">&#8250;</button>
          </div>
          
          <div class="wf-gallery-thumbs" id="wf-thumbs-container">
            <div class="wf-thumb active" onclick="switchWfGallery('https://cdn.shopify.com/s/files/1/0826/2483/9865/files/MagTrack.webp?v=1792809300', 0)">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/MagTrack.webp?v=1792809300" alt="MagTrack Main Set">
            </div>
            <div class="wf-thumb" onclick="switchWfGallery('https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-03.png?v=1792809300', 1)">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-03.png?v=1792809300" alt="MagTrack Layout in Action">
            </div>
            <div class="wf-thumb" onclick="switchWfGallery('https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-01.png?v=1792809300', 2)">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-01.png?v=1792809300" alt="Magnetic Click Pieces">
            </div>
            <div class="wf-thumb" onclick="switchWfGallery('https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-05.png?v=1792809300', 3)">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-05.png?v=1792809300" alt="Motorized Train">
            </div>
            <div class="wf-thumb" onclick="switchWfGallery('https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-04.png?v=1792809300', 4)">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-04.png?v=1792809300" alt="Endless Modular Track">
            </div>
            <div class="wf-thumb" onclick="switchWfGallery('https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-02.png?v=1792809300', 5)">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-02.png?v=1792809300" alt="Safe Durable Pieces">
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Buybox & Bundles -->
      <div class="wf-buybox-col">
        <div class="wf-header-group">
          <div class="wf-review-stars">
            <span class="wf-stars">
              <svg class="wf-tp-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg class="wf-tp-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg class="wf-tp-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg class="wf-tp-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg class="wf-tp-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </span>
            <span class="wf-review-count">4.9 / 5.0 (2,180+ Verified Parents &amp; Teachers)</span>
          </div>
          <span class="wf-pill">STEM ACCREDITED &bull; ZERO SCREEN TIME &bull; AGES 3+</span>
          <h1 class="wf-title">Zavelyn MagTrack Modular Magnetic Train Set</h1>
          <p class="wf-subtitle">The snap-together magnetic train set kids engineer themselves. Build gravity-defying loops, multi-level 3D bridges, and endless custom routes with USB-rechargeable electric train.</p>
        </div>

        <div class="wf-package-header">
          <span class="wf-package-title">Select Your Package</span>
          <span class="wf-package-badge">Extra 10% Off Applied</span>
        </div>

        <!-- Bundle Package Selector -->
        <div class="wf-bundle-selector">
          <!-- Master Package (128 Pcs) -->
          <div class="wf-bundle-card selected" id="wf-bundle-3" onclick="selectWfBundle('67925383807161', '159.00', '299.00', 'wf-bundle-3', 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/MagTrack.webp?v=1792809300')">
            <div class="wf-bundle-badge">BEST VALUE &bull; EXTRA 10% OFF &bull; FREE EXPEDITED SHIPPING</div>
            <div class="wf-bundle-inner">
              <div class="wf-radio-circle"><div class="wf-radio-dot"></div></div>
              <div class="wf-bundle-thumb">
                <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/MagTrack.webp?v=1792809300" alt="Master Set">
              </div>
              <div class="wf-bundle-details">
                <div class="wf-bundle-name">Master Kit (128 Pcs + 2 Electric Trains)</div>
                <div class="wf-bundle-includes">
                  <span>✔ 128 Modular Magnetic Track &amp; Stunt Pieces</span><br>
                  <span>✔ 2x Motorized USB-Rechargeable Trains</span><br>
                  <span>✔ Multi-Tier Bridge Pillars &amp; Looping Rails</span><br>
                  <span>✔ Free US Expedited Shipping</span>
                </div>
              </div>
              <div class="wf-bundle-pricing">
                <span class="wf-price-old">$299.00</span>
                <span class="wf-price-current">$159.00</span>
                <span class="wf-price-save">SAVE $140.00</span>
              </div>
            </div>
          </div>

          <!-- PRO Package (64 Pcs) -->
          <div class="wf-bundle-card" id="wf-bundle-2" onclick="selectWfBundle('67925383774393', '119.00', '169.00', 'wf-bundle-2', 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-03.png?v=1792809300')">
            <div class="wf-bundle-badge secondary">MOST POPULAR &bull; FREE SHIPPING</div>
            <div class="wf-bundle-inner">
              <div class="wf-radio-circle"><div class="wf-radio-dot"></div></div>
              <div class="wf-bundle-thumb">
                <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-03.png?v=1792809300" alt="PRO Set">
              </div>
              <div class="wf-bundle-details">
                <div class="wf-bundle-name">PRO Kit (64 Pcs + 1 Electric Train)</div>
                <div class="wf-bundle-includes">
                  <span>✔ 64 Modular Magnetic Track Pieces</span><br>
                  <span>✔ 1x Motorized USB-Rechargeable Train</span><br>
                  <span>✔ Elevated Bridge Piers &amp; Stunt Curves</span><br>
                  <span>✔ Free US Shipping</span>
                </div>
              </div>
              <div class="wf-bundle-pricing">
                <span class="wf-price-old">$169.00</span>
                <span class="wf-price-current">$119.00</span>
                <span class="wf-price-save">SAVE $50.00</span>
              </div>
            </div>
          </div>

          <!-- Rookie Package (32 Pcs) -->
          <div class="wf-bundle-card" id="wf-bundle-1" onclick="selectWfBundle('67925383741625', '69.00', '139.00', 'wf-bundle-1', 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-01.png?v=1792809300')">
            <div class="wf-bundle-badge secondary">STARTER PACK</div>
            <div class="wf-bundle-inner">
              <div class="wf-radio-circle"><div class="wf-radio-dot"></div></div>
              <div class="wf-bundle-thumb">
                <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-01.png?v=1792809300" alt="Rookie Set">
              </div>
              <div class="wf-bundle-details">
                <div class="wf-bundle-name">Rookie Starter (32 Pcs + 1 Train)</div>
                <div class="wf-bundle-includes">
                  <span>✔ 32 Modular Magnetic Track Pieces</span><br>
                  <span>✔ 1x Motorized USB-Rechargeable Train</span>
                </div>
              </div>
              <div class="wf-bundle-pricing">
                <span class="wf-price-old">$139.00</span>
                <span class="wf-price-current">$69.00</span>
                <span class="wf-price-save">SAVE $70.00</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quantity & Subtotal Row -->
        <div class="wf-purchase-actions">
          <div class="wf-qty-row">
            <span class="wf-qty-label">Quantity:</span>
            <div class="wf-qty-picker">
              <button type="button" class="wf-qty-btn minus" onclick="changeWfQty(-1)">-</button>
              <span class="wf-qty-val" id="wf-qty-num">1</span>
              <button type="button" class="wf-qty-btn plus" onclick="changeWfQty(1)">+</button>
            </div>
            <div class="wf-total-summary">
              <span class="wf-total-label">Subtotal:</span>
              <span id="wf-total-compare" class="wf-total-compare">$299.00</span>
              <span id="wf-total-display" class="wf-total-price">$159.00</span>
            </div>
          </div>

          <!-- Main Add to Cart Button -->
          <button type="button" id="wf-main-atc-btn" class="wf-atc-button" onclick="submitWfOrder()">
            <span class="wf-atc-text">CLAIM 50% OFF TODAY &bull; GET MY MAGTRACK</span>
            <span class="wf-atc-subtext">🔒 90-Day Money-Back Guarantee &middot; Fast US Tracked Dispatch</span>
          </button>

          <!-- Instant Checkout Button -->
          <button type="button" id="wf-main-shopnow-btn" class="wf-shopnow-button" onclick="submitWfDirectCheckout()">
            <span>⚡ SHOP NOW &middot; INSTANT CHECKOUT &rarr;</span>
          </button>

          <!-- Trust row -->
          <div class="wf-trust-row">
            <div class="wf-trust-item"><span class="wf-icon">🛡️</span> 90-Day Money-Back Guarantee</div>
            <div class="wf-trust-item"><span class="wf-icon">📦</span> Fast US Tracked Dispatch</div>
            <div class="wf-trust-item"><span class="wf-icon">🔒</span> Secure 256-Bit SSL Checkout</div>
          </div>

          <!-- Payment Badges -->
          <div class="wf-payment-badges">
            <span class="wf-secure-label">🔒 GUARANTEED SAFE &amp; SECURE CHECKOUT</span>
            <div class="wf-badge-icons">
              <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/apple_pay-f6db0077dc7c325b436ecbdcf254239100b35b70b1663b0394032a84b25f190e.svg" alt="Apple Pay">
              <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/google_pay-c66a29c63facf2053bf693529805a65e9000b01ae574f74077e6817d8e613393.svg" alt="Google Pay">
              <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/paypal-49e4c173da326e3444b76216ae7d5b35277498db2da70073c8d84b6f47264a23.svg" alt="PayPal">
              <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/master-eb2ce302384c341b6d60b1d4e3ebf473c914371457df74288ff3f159a68a9b31.svg" alt="Mastercard">
              <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/visa-319d545c6fd255c9aad5eeaad21fd6f7f7b4fdbdb1a35ce83b89cca07718734e.svg" alt="Visa">
              <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/shopify_pay-100fde795157a3d1c18042346ed8da3e6c984764d0e848770b92e202915d0161.svg" alt="Shop Pay">
            </div>
          </div>

          <!-- Benefits Card -->
          <div class="wf-benefits-card">
            <div class="wf-benefit-item">
              <span class="wf-check">&#10004;</span>
              <div><strong>100% Screen-Free Engagement:</strong> Keeps children focused, creative, and absorbed in tactile play for hours without phones or tablets.</div>
            </div>
            <div class="wf-benefit-item">
              <span class="wf-check">&#10004;</span>
              <div><strong>Patented Snap-Lock Magnets:</strong> High-powered dual-polarity neodymium magnets click tight instantly and hold strong through sharp curves and steep loops.</div>
            </div>
            <div class="wf-benefit-item">
              <span class="wf-check">&#10004;</span>
              <div><strong>Certified STEM Engineering:</strong> Nurtures 3D spatial thinking, architectural planning, and physics concepts through trial and error.</div>
            </div>
            <div class="wf-benefit-item">
              <span class="wf-check">&#10004;</span>
              <div><strong>Durable &amp; Non-Toxic ABS:</strong> Ultra-tough drop-resistant polymers with silky chamfered edges, 100% BPA-free and child-safe.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 2: FEATURE CARDS GRID -->
  <section class="wf-section wf-features-section">
    <div class="wf-container">
      <div class="wf-section-header">
        <h2 class="wf-section-heading">Designed for Independent Creative Engineering</h2>
        <div class="wf-section-subtitle">Real architectural freedom. Drop-resistant components. Hours of screen-free focus.</div>
      </div>

      <div class="wf-features-grid">
        <div class="wf-feature-card">
          <div class="wf-feature-img-wrap">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-01.png?v=1792809300" alt="Magnetic Click Pieces">
          </div>
          <div class="wf-feature-content">
            <h3 class="wf-feature-title">Instant Magnetic Click</h3>
            <p class="wf-feature-text">Neodymium magnetic joints align automatically with a satisfying snap. Toddlers and big kids can construct complex layouts without frustrating pinches or stuck connectors.</p>
          </div>
        </div>

        <div class="wf-feature-card">
          <div class="wf-feature-img-wrap">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-02.png?v=1792809300" alt="Durable and Child-Safe">
          </div>
          <div class="wf-feature-content">
            <h3 class="wf-feature-title">Indestructible ABS Polymer</h3>
            <p class="wf-feature-text">Engineered from premium impact-resistant ABS. Magnets are ultrasonically sealed inside reinforced double-shell walls so they never dislodge or expose loose parts.</p>
          </div>
        </div>

        <div class="wf-feature-card">
          <div class="wf-feature-img-wrap">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-04.png?v=1792809300" alt="Modular 3D Track System">
          </div>
          <div class="wf-feature-content">
            <h3 class="wf-feature-title">Modular 3D Engineering</h3>
            <p class="wf-feature-text">Go beyond flat carpet layouts. Interlocking vertical bridge piers let young builders elevate tracks, create multi-tier spirals, steep overpasses, and roller-coaster dips.</p>
          </div>
        </div>

        <div class="wf-feature-card">
          <div class="wf-feature-img-wrap">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-05.png?v=1792809300" alt="Motorized USB-Rechargeable Train">
          </div>
          <div class="wf-feature-content">
            <h3 class="wf-feature-title">USB Fast-Recharge Engine</h3>
            <p class="wf-feature-text">No expensive AA/AAA batteries that die every two days. High-torque motorized train recharges quickly via standard USB-C and features magnetic guide rollers that cling firmly to the tracks.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 3: STORY & NARRATIVE -->
  <section class="wf-section wf-story-section">
    <div class="wf-container wf-story-grid">
      <div class="wf-story-img-col">
        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/MagTrack.webp?v=1792809300" alt="Kids playing with Zavelyn MagTrack">
      </div>
      <div class="wf-story-content-col">
        <span class="wf-story-eyebrow">SCREEN-FREE CHILDHOOD JOY</span>
        <h2 class="wf-story-title">End Screen Battles: Give Your Child A Toy That Teaches, Focuses, and Delights</h2>
        <div class="wf-story-body">
          <p>Every parent knows the dreaded tablet struggle. Hours slip away behind glowing screens, followed by irritable meltdowns, scattered focus, and passive consumption. Modern kids crave real tactile feedback, spatial problem-solving, and the thrill of making things work with their own two hands.</p>
          <p>With <strong>Zavelyn MagTrack</strong>, your living room floor transforms into an active engineering laboratory. Watch your child plan multi-tier bridge crossovers, test gravity drops, iterate when the train derails, and beam with genuine pride when their custom route completes its maiden voyage.</p>
        </div>
        <div class="wf-story-points">
          <div class="wf-story-point">
            <span class="wf-sp-icon">🧠</span>
            <div>
              <strong>Calm, Deep Focus</strong>
              <span>Engages dopamine pathways through physical creation, not addictive algorithmic flashing lights.</span>
            </div>
          </div>
          <div class="wf-story-point">
            <span class="wf-sp-icon">🤝</span>
            <div>
              <strong>Collaborative Sibling Play</strong>
              <span>Large modular kits give multiple children plenty of pieces to build sprawling cities together without fighting.</span>
            </div>
          </div>
          <div class="wf-story-point">
            <span class="wf-sp-icon">⚡</span>
            <div>
              <strong>Quick Tidy-Up</strong>
              <span>Magnets attract each other during pack-up, making clean-up time take under 3 minutes.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 4: 3-STEP SETUP -->
  <section class="wf-section wf-steps-section">
    <div class="wf-container">
      <div class="wf-section-header">
        <span class="wf-pill">EFFORTLESS PLAYTIME</span>
        <h2 class="wf-section-heading">How MagTrack Works in 3 Simple Steps</h2>
        <div class="wf-section-subtitle">Zero complicated tools or frustrating tiny screws. Open the box and start building.</div>
      </div>

      <div class="wf-steps-grid">
        <div class="wf-step-card">
          <div class="wf-step-number">01</div>
          <div class="wf-step-icon">🧩</div>
          <h3 class="wf-step-title">Snap the Tracks Together</h3>
          <p class="wf-step-desc">Strong magnetic joints snap into place effortlessly at any angle. Lay down loops, curves, switchbacks, and straightaways in seconds.</p>
        </div>

        <div class="wf-step-card">
          <div class="wf-step-number">02</div>
          <div class="wf-step-icon">🚂</div>
          <h3 class="wf-step-title">Switch On the Train</h3>
          <p class="wf-step-desc">Press the top power toggle on the motorized electric engine. Magnetic guide wheels latch onto the tracks and cruise through steep inclines.</p>
        </div>

        <div class="wf-step-card">
          <div class="wf-step-number">03</div>
          <div class="wf-step-icon">🏗️</div>
          <h3 class="wf-step-title">Elevate, Test &amp; Expand</h3>
          <p class="wf-step-desc">Stack bridge piers to build multi-story elevated roller-coasters. Reconfigure tracks in real-time as the train is running!</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 5: VIDEO / INTERACTIVE SHOWCASE -->
  <section class="wf-section wf-video-demo-section" id="wf-video-demo">
    <div class="wf-container">
      <div class="wf-video-card">
        <div class="wf-video-grid">
          <div class="wf-video-col">
            <div class="wf-video-wrapper">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/6a8eaac1-5d40-418f-aa89-b6522654543f_1e60f38e-84d1-4c22-bb85-35158bc9c2a0.webp?v=1792809300" alt="MagTrack Live Stunt Run" class="wf-video-element">
              <div class="wf-video-tag">
                <span class="wf-video-pulse"></span>
                <span>REAL KIDS TESTED &bull; 100% ACTIVE PLAY</span>
              </div>
            </div>
          </div>
          
          <div class="wf-video-content-col">
            <span class="wf-eyebrow-pill">SEE IT IN ACTION &bull; 3D MAGNETIC STUNTS</span>
            <h2 class="wf-video-title">Gravity-Defying Magnetic Grip &amp; High-Torque Climbing</h2>
            <div class="wf-video-desc">
              <p>Unlike old-fashioned wooden or plastic toy trains that derail at the slightest bump, MagTrack features integrated magnetic stability rails that keep the train firmly glued to the track even on steep 45-degree climbs and inverted loops.</p>
              <p>Kids can test the limits of physics, create thrilling bridges across furniture, and experiment with spatial geometry while having the time of their lives.</p>
            </div>
            
            <div class="wf-video-highlights">
              <div class="wf-video-highlight-item">
                <span class="wf-vh-icon">🧲</span>
                <div>
                  <strong>Ultra-Secure Anti-Derailment</strong>
                  <span>Continuous magnetic pull keeps wheels tracking smoothly at top speed</span>
                </div>
              </div>
              <div class="wf-video-highlight-item">
                <span class="wf-vh-icon">🔋</span>
                <div>
                  <strong>Zero Battery Costs (USB Fast Charge)</strong>
                  <span>High-capacity rechargeable lithium cell delivers hours of high-torque climbing</span>
                </div>
              </div>
              <div class="wf-video-highlight-item">
                <span class="wf-vh-icon">🧱</span>
                <div>
                  <strong>100% Modular &amp; Expandable</strong>
                  <span>All Zavelyn MagTrack sets combine seamlessly into giant mega-layouts</span>
                </div>
              </div>
            </div>

            <div class="wf-video-cta-wrap">
              <a href="#fn-offer" class="wf-video-jump-btn" onclick="document.querySelector('.wf-buybox-col').scrollIntoView({behavior: 'smooth'}); return false;">
                CLAIM 50% OFF TODAY &bull; SELECT PACKAGE &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 6: PRODUCT SPECIFICATIONS -->
  <section class="wf-section wf-specs-section">
    <div class="wf-container">
      <div class="wf-section-header">
        <h2 class="wf-section-heading">Product Specifications at a Glance</h2>
        <div class="wf-section-subtitle">Engineered for commercial-grade durability and complete child safety.</div>
      </div>

      <div class="wf-specs-grid">
        <div class="wf-spec-card">
          <span class="wf-spec-label">Magnetic Core</span>
          <span class="wf-spec-value">Ultrasonic Sealed N52 Neodymium</span>
        </div>
        <div class="wf-spec-card">
          <span class="wf-spec-label">Material Safety</span>
          <span class="wf-spec-value">100% BPA-Free Non-Toxic Impact ABS</span>
        </div>
        <div class="wf-spec-card">
          <span class="wf-spec-label">Train Power Supply</span>
          <span class="wf-spec-value">USB-C Fast Rechargeable Lithium-Ion</span>
        </div>
        <div class="wf-spec-card">
          <span class="wf-spec-label">Battery Life</span>
          <span class="wf-spec-value">Up to 90 Mins Continuous Run</span>
        </div>
        <div class="wf-spec-card">
          <span class="wf-spec-label">Safety Compliance</span>
          <span class="wf-spec-value">ASTM F963 &amp; CPSIA Safety Certified</span>
        </div>
        <div class="wf-spec-card">
          <span class="wf-spec-label">Recommended Age</span>
          <span class="wf-spec-value">Ages 3+ (Toddler to Pre-Teen)</span>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 7: COMPARISON TABLE -->
  <section class="wf-section wf-comparison-section">
    <div class="wf-container">
      <div class="wf-section-header">
        <h2 class="wf-section-heading">Zavelyn MagTrack vs. Traditional Toy Trains</h2>
        <div class="wf-section-subtitle">See why over 50,000+ families chose MagTrack for screen-free creative playtime.</div>
      </div>

      <div class="wf-table-card">
        <table class="wf-comp-table">
          <thead>
            <tr>
              <th>KEY FEATURE</th>
              <th class="wf-col-winner">ZAVELYN MAGTRACK™</th>
              <th class="wf-col-loser">CHEAP PLASTIC / WOODEN TRACKS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Magnetic 3D Elevation</td>
              <td class="wf-winner-cell">&#10004; Strong magnetic climbing &amp; loops</td>
              <td class="wf-loser-cell">&#10008; Flat carpet only, collapses easily</td>
            </tr>
            <tr>
              <td>Screen-Free Attention Span</td>
              <td class="wf-winner-cell">&#10004; 2+ hours absorbed creative engineering</td>
              <td class="wf-loser-cell">&#10008; Kids lose interest within 10 minutes</td>
            </tr>
            <tr>
              <td>Battery &amp; Running Costs</td>
              <td class="wf-winner-cell">&#10004; USB-C Rechargeable (Zero battery costs)</td>
              <td class="wf-loser-cell">&#10008; Requires non-stop expensive AAA batteries</td>
            </tr>
            <tr>
              <td>Durability &amp; Child Safety</td>
              <td class="wf-winner-cell">&#10004; Sealed ABS polymers, shatterproof</td>
              <td class="wf-loser-cell">&#10008; Snaps, splinters, and exposed small magnets</td>
            </tr>
            <tr>
              <td>Assembly Speed</td>
              <td class="wf-winner-cell">&#10004; 100% Tool-free instant magnetic snap</td>
              <td class="wf-loser-cell">&#10008; Difficult interlocking pegs that pinch fingers</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- SECTION 8: FAQ ACCORDION -->
  <section class="wf-section wf-faq-section">
    <div class="wf-container wf-faq-container">
      <div class="wf-section-header">
        <h2 class="wf-section-heading">Frequently Asked Questions</h2>
        <div class="wf-section-subtitle">Everything you need to know about setting up and enjoying MagTrack.</div>
      </div>

      <div class="wf-faq-list">
        <details class="wf-faq-item" open>
          <summary class="wf-faq-question">Does the motorized train require regular batteries?<span class="wf-faq-toggle">+</span></summary>
          <div class="wf-faq-answer">
            <p>No! The electric train features an integrated USB-rechargeable battery. Simply plug the included charging cable into any USB port or wall adapter, and in about 30 minutes your train is fully powered and ready for up to 90 minutes of continuous high-torque climbing.</p>
          </div>
        </details>

        <details class="wf-faq-item">
          <summary class="wf-faq-question">Are the magnets safe and secure for toddlers and young children?<span class="wf-faq-toggle">+</span></summary>
          <div class="wf-faq-answer">
            <p>Yes, 100%. Safety is our top priority. Every neodymium magnet is ultrasonically sealed inside reinforced double-layered impact-resistant ABS plastic. There are zero loose magnets, sharp splinters, or swallow hazards. Certified compliant with ASTM F963 and CPSIA child toy safety standards.</p>
          </div>
        </details>

        <details class="wf-faq-item">
          <summary class="wf-faq-question">Can I combine multiple sets into one massive layout?<span class="wf-faq-toggle">+</span></summary>
          <div class="wf-faq-answer">
            <p>Absolutely! All Zavelyn MagTrack packages (Rookie, PRO, and Master) use identical universal magnetic joint dimensions. You can connect two, three, or more sets together to span entire bedrooms, weave around table legs, and build soaring multi-level sky bridges.</p>
          </div>
        </details>

        <details class="wf-faq-item">
          <summary class="wf-faq-question">What age range is MagTrack designed for?<span class="wf-faq-toggle">+</span></summary>
          <div class="wf-faq-answer">
            <p>MagTrack is ideal for children ages 3 to 12. Toddlers love the satisfying magnetic snap and watching the motorized train cruise, while older kids (ages 6 to 12) love engineering complex gravity-defying bridges, switch-tracks, and high-speed stunt layouts.</p>
          </div>
        </details>

        <details class="wf-faq-item">
          <summary class="wf-faq-question">What is your guarantee and return policy?<span class="wf-faq-toggle">+</span></summary>
          <div class="wf-faq-answer">
            <p>Every order is covered by our 90-Day 100% Satisfaction Money-Back Guarantee. If your child doesn't absolutely love building with MagTrack, or if any piece is ever damaged during playtime, contact our US support team for a full refund or free replacement.</p>
          </div>
        </details>
      </div>
    </div>
  </section>

  <!-- SECTION 9: DOORSTEP DELIVERY GUARANTEE -->
  <section class="wf-section wf-delivery-section">
    <div class="wf-container">
      <div class="wf-delivery-card">
        <div class="wf-delivery-grid">
          <div class="wf-delivery-media-col">
            <div class="wf-delivery-img-wrap">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/5555.webp?v=1792856415" alt="FedEx Tracked Delivery Truck" class="wf-delivery-img">
            </div>
            <div class="wf-delivery-img-wrap secondary">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/44444.webp?v=1792856415" alt="Rapid Dispatch Shipping" class="wf-delivery-img">
            </div>
          </div>
          <div class="wf-delivery-content-col">
            <span class="wf-pill">FAST &amp; INSURED DOMESTIC EXPEDITED SHIPPING</span>
            <h2 class="wf-delivery-title">Doorstep Delivery Guarantee &amp; Real-Time Tracking</h2>
            <p class="wf-delivery-text">Every MagTrack set is carefully inspected, packed in heavy-duty crush-proof protective cartons, and dispatched directly from our regional fulfillment centers within <strong>24–48 business hours</strong>. We partner directly with <strong>FedEx, USPS, and DHL Express</strong> to ensure rapid, dependable door-to-door transit.</p>
            <p class="wf-delivery-text">The moment your order leaves our facility, you will receive an instant tracking link via email and SMS with step-by-step delivery updates. Backed by our <strong>100% In-Transit Protection Guarantee</strong> &mdash; if your package experiences any transit delay or rough handling damage, our team will dispatch an immediate zero-cost replacement.</p>
            
            <div class="wf-delivery-badges-grid">
              <div class="wf-db-item">
                <span class="wf-db-icon">🚀</span>
                <div>
                  <strong>24–48h Dispatch</strong>
                  <span>Swift domestic fulfillment from regional hubs</span>
                </div>
              </div>
              <div class="wf-db-item">
                <span class="wf-db-icon">🛡️</span>
                <div>
                  <strong>100% Insured Transit</strong>
                  <span>Full coverage against lost or transit-damaged items</span>
                </div>
              </div>
              <div class="wf-db-item">
                <span class="wf-db-icon">📍</span>
                <div>
                  <strong>Live Real-Time Tracking</strong>
                  <span>Doorstep progress notifications via SMS &amp; email</span>
                </div>
              </div>
              <div class="wf-db-item">
                <span class="wf-db-icon">🔄</span>
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

  <!-- SECTION 10: CUSTOMER REVIEWS -->
  <section class="wf-section wf-reviews-section">
    <div class="wf-container">
      <div class="wf-section-header">
        <h2 class="wf-section-heading">What Parents &amp; Grandparents Are Saying</h2>
        <div class="wf-review-stars-summary">
          <span class="wf-stars">★★★★★</span>
          <span class="wf-rating-text">4.9 / 5.0 Rating (2,180+ Verified Customer Reviews)</span>
        </div>
      </div>

      <div class="wf-reviews-grid">
        <div class="wf-review-card">
          <div class="wf-review-meta">
            <strong>Sarah M.</strong>
            <span class="wf-verified-badge">✔ Verified Buyer</span>
            <span class="wf-review-date">Verified 3 days ago</span>
          </div>
          <div class="wf-card-stars">★★★★★</div>
          <h3 class="wf-review-headline">"Finally a toy he plays with every single day!"</h3>
          <p class="wf-review-body">"I was skeptical because my 5-year-old usually gets bored of new toys in 24 hours. MagTrack completely surprised us. He woke up on Saturday and built a three-level track across his rug and coffee table. It's been two weeks and he hasn't asked for the iPad once!"</p>
          <div class="wf-review-photo">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-03.png?v=1792809300" alt="Sarah M. Review Photo">
          </div>
        </div>

        <div class="wf-review-card">
          <div class="wf-review-meta">
            <strong>David K.</strong>
            <span class="wf-verified-badge">✔ Verified Buyer</span>
            <span class="wf-review-date">Verified 1 week ago</span>
          </div>
          <div class="wf-card-stars">★★★★★</div>
          <h3 class="wf-review-headline">"The magnets are remarkably strong &mdash; doesn't collapse"</h3>
          <p class="wf-review-body">"We've owned wooden train sets and cheap plastic snap tracks in the past. They always fell apart when bumped. These magnets hold firmly together even when my 4yo leans on them. The USB rechargeable train has great climbing torque. Highly recommend getting the Master Kit!"</p>
          <div class="wf-review-photo">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/MagTrack.webp?v=1792809300" alt="David K. Review Photo">
          </div>
        </div>

        <div class="wf-review-card">
          <div class="wf-review-meta">
            <strong>Jennifer P.</strong>
            <span class="wf-verified-badge">✔ Verified Buyer</span>
            <span class="wf-review-date">Verified 2 weeks ago</span>
          </div>
          <div class="wf-card-stars">★★★★★</div>
          <h3 class="wf-review-headline">"Huge hit for both my 4yo and 8yo boys!"</h3>
          <p class="wf-review-body">"It's rare to find a toy that both my preschooler and second-grader can play with together without arguing. They spent three hours designing a dual-loop circuit. Excellent engineering quality and clean-up is super fast because the magnetic pieces stack neatly."</p>
          <div class="wf-review-photo">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-04.png?v=1792809300" alt="Jennifer P. Review Photo">
          </div>
        </div>

        <div class="wf-review-card">
          <div class="wf-review-meta">
            <strong>Robert T.</strong>
            <span class="wf-verified-badge">✔ Verified Buyer</span>
            <span class="wf-review-date">Verified 2 weeks ago</span>
          </div>
          <div class="wf-card-stars">★★★★★</div>
          <h3 class="wf-review-headline">"Best birthday gift for our grandson by far"</h3>
          <p class="wf-review-body">"Ordered the Master 128-piece set for our grandson's 6th birthday. Arrived in pristine condition in 3 days. Watching him figure out the elevated bridges and test which incline angles worked best was pure joy. Worth every penny."</p>
          <div class="wf-review-photo">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-01.png?v=1792809300" alt="Robert T. Review Photo">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 11: STICKY BOTTOM BUY BAR -->
  <div class="wf-sticky-buy-bar" id="wf-sticky-bar">
    <div class="wf-sticky-content">
      <div class="wf-sticky-thumb">
        <img id="wf-sticky-img" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/MagTrack.webp?v=1792809300" alt="Zavelyn MagTrack">
      </div>
      <div class="wf-sticky-meta">
        <div class="wf-sticky-title">Zavelyn MagTrack™</div>
        <div class="wf-sticky-price" id="wf-sticky-price-val">$159.00 (Master Kit)</div>
      </div>
      <button type="button" class="wf-sticky-btn" onclick="document.querySelector('#fn-offer').scrollIntoView({behavior:'smooth'})">
        SELECT PACKAGE &rarr;
      </button>
    </div>
  </div>

</div>

<style>
${baseCss}
</style>

<script>
  let wfCurrentGalleryIdx = 0;
  const wfGalleryImgs = [
    'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/MagTrack.webp?v=1792809300',
    'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-03.png?v=1792809300',
    'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-01.png?v=1792809300',
    'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-05.png?v=1792809300',
    'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-04.png?v=1792809300',
    'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/thoson-magtrack-02.png?v=1792809300'
  ];

  let wfSelectedVariantId = '67925383807161'; // Default Master set
  let wfSelectedPrice = 159.00;
  let wfSelectedOldPrice = 299.00;
  let wfCurrentQty = 1;

  function switchWfGallery(src, index) {
    const mainImg = document.getElementById('wf-main-img');
    if (mainImg) mainImg.src = src;
    
    if (typeof index === 'number') {
      wfCurrentGalleryIdx = index;
    } else {
      const cleanSrc = src.split('?')[0];
      const foundIdx = wfGalleryImgs.findIndex(u => u.split('?')[0] === cleanSrc);
      if (foundIdx !== -1) wfCurrentGalleryIdx = foundIdx;
    }

    const thumbs = document.querySelectorAll('.wf-thumb');
    thumbs.forEach((t, i) => {
      if (i === wfCurrentGalleryIdx) t.classList.add('active');
      else t.classList.remove('active');
    });
  }

  function skipWfGallery(direction) {
    wfCurrentGalleryIdx = (wfCurrentGalleryIdx + direction + wfGalleryImgs.length) % wfGalleryImgs.length;
    switchWfGallery(wfGalleryImgs[wfCurrentGalleryIdx], wfCurrentGalleryIdx);
  }

  function selectWfBundle(variantId, price, oldPrice, cardId, imgSrc) {
    wfSelectedVariantId = variantId;
    wfSelectedPrice = parseFloat(price);
    wfSelectedOldPrice = oldPrice ? parseFloat(oldPrice) : (wfSelectedPrice * 1.8);
    
    document.querySelectorAll('.wf-bundle-card').forEach(c => c.classList.remove('selected'));
    const activeCard = document.getElementById(cardId);
    if (activeCard) activeCard.classList.add('selected');

    if (imgSrc) switchWfGallery(imgSrc);

    const stickyImg = document.getElementById('wf-sticky-img');
    if (stickyImg && imgSrc) stickyImg.src = imgSrc;

    let titleText = '$159.00 (Master Kit)';
    if (variantId === '67925383774393') titleText = '$119.00 (PRO Kit)';
    else if (variantId === '67925383741625') titleText = '$69.00 (Rookie Set)';
    const stickyPriceVal = document.getElementById('wf-sticky-price-val');
    if (stickyPriceVal) stickyPriceVal.textContent = titleText;

    updateWfTotal();
  }

  function changeWfQty(delta) {
    wfCurrentQty = Math.max(1, wfCurrentQty + delta);
    const qtyNum = document.getElementById('wf-qty-num');
    if (qtyNum) qtyNum.textContent = wfCurrentQty;
    updateWfTotal();
  }

  function updateWfTotal() {
    const total = (wfSelectedPrice * wfCurrentQty).toFixed(2);
    const compTotal = (wfSelectedOldPrice * wfCurrentQty).toFixed(2);
    const disp = document.getElementById('wf-total-display');
    const compDisp = document.getElementById('wf-total-compare');
    if (disp) disp.textContent = '$' + total;
    if (compDisp) compDisp.textContent = '$' + compTotal;
  }

  async function submitWfDirectCheckout() {
    const btn = document.getElementById('wf-main-shopnow-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Proceeding to Checkout...</span>';
    }
    try {
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ id: wfSelectedVariantId, quantity: wfCurrentQty }]
        })
      });
      window.location.href = '/checkout';
    } catch (e) {
      window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
    }
  }

  async function submitWfOrder() {
    const btn = document.getElementById('wf-main-atc-btn');
    const originalContent = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="wf-atc-text">ADDING TO CART...</span>';
    }

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ id: wfSelectedVariantId, quantity: wfCurrentQty }]
        })
      });

      if (res.ok) {
        if (typeof window.willaRefreshCart === 'function') {
          await window.willaRefreshCart();
        }
        if (typeof window.willaOpenCartDrawer === 'function') {
          window.willaOpenCartDrawer();
        }
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalContent;
        }
      } else {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalContent;
        }
        window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
      }
    } catch (e) {
      console.error(e);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalContent;
      }
      window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
    }
  }

  // Sticky buy bar listener & swipe
  document.addEventListener('DOMContentLoaded', function() {
    const mainWrap = document.querySelector('.wf-gallery-main');
    if (mainWrap) {
      let touchStartX = 0;
      let touchStartY = 0;
      mainWrap.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      mainWrap.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) skipWfGallery(1);
          else skipWfGallery(-1);
        }
      }, { passive: true });
    }

    const atc = document.getElementById('wf-main-atc-btn');
    const sticky = document.getElementById('wf-sticky-bar');
    if (!atc || !sticky) return;
    
    function checkSticky() {
      const rect = atc.getBoundingClientRect();
      if (rect.bottom < 0) sticky.classList.add('visible');
      else sticky.classList.remove('visible');
    }
    
    window.addEventListener('scroll', checkSticky, { passive: true });
    checkSticky();
  });
</script>

{% schema %}
{
  "name": "Thoson MagTrack Funnel",
  "settings": []
}
{% endschema %}
`;

// Save local file
fs.mkdirSync('Clone-willafarm/theme/sections', { recursive: true });
fs.writeFileSync('Clone-willafarm/theme/sections/thoson-magtrack-funnel.liquid', thosonLiquid);

// Create templates/product.thoson-magtrack.json
const thosonJson = JSON.stringify({
  "sections": {
    "thoson_magtrack_funnel": {
      "type": "thoson-magtrack-funnel",
      "settings": {}
    }
  },
  "order": [
    "thoson_magtrack_funnel"
  ]
}, null, 2);

fs.writeFileSync('Clone-willafarm/theme/templates/product.thoson-magtrack.json', thosonJson);

async function run() {
  const token = await getAccessToken();
  console.log('--- Deploying Thoson MagTrack Funnel & Template ---');
  await uploadThemeAsset(token, 'sections/thoson-magtrack-funnel.liquid', thosonLiquid);
  await uploadThemeAsset(token, 'templates/product.thoson-magtrack.json', thosonJson);
  console.log('✔ Thoson MagTrack successfully deployed!');
}

run().catch(console.error);
