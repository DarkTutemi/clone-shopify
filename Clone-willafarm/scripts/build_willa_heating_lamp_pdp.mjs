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
  if (!res.ok) throw new Error(`OAuth error: ${JSON.stringify(data)}`);
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
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (res.ok) {
    console.log(`  ✔ Uploaded: ${key}`);
    return true;
  } else {
    console.error(`  ✗ Failed ${key}:`, JSON.stringify(data.errors || data));
    return false;
  }
}

function generateHeatingLampLiquid() {
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

<div class="zavelyn-pdp-wrapper" id="fn-offer">
  <!-- Top Trust & Guarantee Announcement Bar -->
  <div class="wf-top-strip">
    <div class="wf-container wf-strip-inner">
      <span class="wf-strip-item">🔒 100% Encrypted &amp; Secure Checkout</span>
      <span class="wf-strip-item">⭐ 4.9/5 Rating by 1,480+ Farmers &amp; Homesteaders</span>
      <span class="wf-strip-item desktop-only">⚡ 2026 Upgraded Digital Thermostat</span>
    </div>
  </div>

  <!-- SECTION 1: Product Intro & Buy Box (Primary Conversion Area) -->
  <section class="wf-section wf-hero-buybox">
    <div class="wf-container wf-hero-grid">
      <!-- Media Gallery Column -->
      <div class="wf-gallery-col">
        <div class="wf-gallery-main">
          <img id="wf-main-img" src="{{ section.settings.main_image_url | default: 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg' }}" alt="{{ section.settings.product_title | escape }}" referrerpolicy="no-referrer">
          <span class="wf-gallery-badge">50% OFF TODAY</span>
        </div>
        <div class="wf-thumbnail-strip">
          <img class="wf-thumb" src="https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="Zavelyn 2-Pack Bundle">
          <img class="wf-thumb active" src="https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="Zavelyn 1-Pack">
          <img class="wf-thumb" src="https://cdn.myshopage.com/8dfe030d-f1ec-4a8a-02a4-753863454400/w1000.jpg" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="Safe Brooder Warmth">
          <img class="wf-thumb" src="https://cdn.myshopage.com/898406ff-0448-41a5-2440-fd49b2375e00/w1000.jpg" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="Digital Temperature Display">
          <img class="wf-thumb" src="https://cdn.myshopage.com/8f765e2e-fcbd-4199-ab9b-433d4da5c000.jpg" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="Sealed Fireproof Housing">
          <img class="wf-thumb" src="https://cdn.myshopage.com/27c967b2-512d-43ee-b366-7568d2a3a700/w500.jpg" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="E26 E27 Cord Setup">
        </div>

        
      </div>

      <!-- Buy Box & Configuration Column -->
      <div class="wf-buybox-col">
        <div class="wf-header-group">
          <div class="wf-review-stars">
            <span class="wf-stars">{% render 'trustpilot-stars', width: 96, height: 18 %}</span>
            <span class="wf-review-count">4.9 / 5.0 (1,480+ Reviews)</span>
          </div>
          <h1 class="wf-product-title">{{ section.settings.product_title | default: 'Zavelyn® Intelligent Livestock Heating Lamp' }}</h1>
          <p class="wf-product-desc">{{ section.settings.product_subtitle | default: 'Safe, energy-efficient brooder warmth engineered with an intelligent digital thermostat. Keeps baby chicks, ducklings, piglets, and pets comfortably warm without dangerous fire risks or harsh red glare.' }}</p>
        </div>

        <!-- Bundle Package Selector -->
        <div class="wf-bundle-selector">
          <div class="wf-selector-label">
            <span>Select Your Package</span>
            <span class="wf-savings-pill">Extra 10% Off Available</span>
          </div>

          <div class="wf-bundles-container">
            {% assign bundles_count = 0 %}
            {% for block in section.blocks %}
              {% if block.type == 'bundle_package' %}
                {% assign bundles_count = bundles_count | plus: 1 %}
                <div class="wf-bundle-card {% if block.settings.is_best_seller or forloop.first %}selected{% endif %}" id="wf-bundle-{{ forloop.index }}" onclick="selectWfBundle('{{ block.settings.variant_id }}', '{{ block.settings.price }}', '{{ block.settings.old_price }}', 'wf-bundle-{{ forloop.index }}', '{{ block.settings.image_url }}')" {{ block.shopify_attributes }}>
                  {% if block.settings.badge != blank %}
                    <div class="wf-bundle-badge {% unless block.settings.is_best_seller %}secondary{% endunless %}">{{ block.settings.badge }}</div>
                  {% endif %}
                  <div class="wf-bundle-inner">
                    <div class="wf-radio-circle">
                      <div class="wf-radio-dot"></div>
                    </div>
                    {% if block.settings.image_url != blank %}
                      <div class="wf-bundle-thumb">
                        <img src="{{ block.settings.image_url }}" alt="{{ block.settings.title | escape }}" referrerpolicy="no-referrer">
                      </div>
                    {% endif %}
                    <div class="wf-bundle-details">
                      <div class="wf-bundle-name">{{ block.settings.title }}</div>
                      <div class="wf-bundle-includes">{{ block.settings.description }}</div>
                    </div>
                    <div class="wf-bundle-pricing">
                      {% if block.settings.old_price != blank %}<span class="wf-price-compare">\${{ block.settings.old_price }}</span>{% endif %}
                      <span class="wf-price-current">\${{ block.settings.price }}</span>
                    </div>
                  </div>
                </div>
              {% endif %}
            {% endfor %}
            {% if bundles_count == 0 %}
              <!-- Fallback Default Bundles -->
              <div class="wf-bundle-card selected" id="wf-bundle-2" onclick="selectWfBundle('67930179436729', '89.99', '179.99', 'wf-bundle-2', 'https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png')">
                <div class="wf-bundle-badge">BEST SELLER • 50% OFF • FREE SHIPPING</div>
                <div class="wf-bundle-inner">
                  <div class="wf-radio-circle"><div class="wf-radio-dot"></div></div>
                  <div class="wf-bundle-thumb">
                    <img src="https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png" alt="2 Pack Bundle" referrerpolicy="no-referrer">
                  </div>
                  <div class="wf-bundle-details">
                    <div class="wf-bundle-name">2 Pack (Light + US Switch Cord)</div>
                    <div class="wf-bundle-includes">
                      <span>✔ 2x Zavelyn® Intelligent Heating Lamps</span><br>
                      <span>✔ 2x US Heavy-Duty Switch Cords • $44.99/set</span>
                    </div>
                  </div>
                  <div class="wf-bundle-pricing">
                    <span class="wf-price-compare">$179.99</span>
                    <span class="wf-price-current">$89.99</span>
                  </div>
                </div>
              </div>

              <div class="wf-bundle-card" id="wf-bundle-1" onclick="selectWfBundle('67930179403961', '49.99', '99.99', 'wf-bundle-1', 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg')">
                <div class="wf-bundle-badge secondary">STARTER PACK • 50% OFF</div>
                <div class="wf-bundle-inner">
                  <div class="wf-radio-circle"><div class="wf-radio-dot"></div></div>
                  <div class="wf-bundle-thumb">
                    <img src="https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg" alt="1 Pack Bundle" referrerpolicy="no-referrer">
                  </div>
                  <div class="wf-bundle-details">
                    <div class="wf-bundle-name">1 Pack (Light + US Switch Cord)</div>
                    <div class="wf-bundle-includes">
                      <span>✔ 1x Zavelyn® Intelligent Heating Lamp</span><br>
                      <span>✔ 1x US Heavy-Duty Switch Cord</span>
                    </div>
                  </div>
                  <div class="wf-bundle-pricing">
                    <span class="wf-price-compare">$99.99</span>
                    <span class="wf-price-current">$49.99</span>
                  </div>
                </div>
              </div>
            {% endif %}
          </div>
        </div>

        <!-- Quantity & Instant Checkout CTA -->
        <div class="wf-purchase-actions">
          <div class="wf-qty-and-total">
            <div class="wf-qty-control">
              <button type="button" class="wf-qty-btn" onclick="adjustWfQty(-1)">-</button>
              <input type="number" id="wf-qty-input" value="1" min="1" max="10" readonly>
              <button type="button" class="wf-qty-btn" onclick="adjustWfQty(1)">+</button>
            </div>
            <div class="wf-total-block">
              <span class="wf-total-label">Subtotal:</span>
              <span id="wf-total-display" class="wf-total-price">$89.99</span>
            </div>
          </div>

          <button type="button" id="wf-main-atc-btn" class="wf-atc-button" onclick="submitWfOrder()">
            <span class="wf-atc-text">ADD TO CART &bull; CLAIM 50% OFF</span>
            <span class="wf-atc-arrow">➔</span>
          </button>

          <!-- Primary Trust Points Under ATC -->
          <div class="wf-trust-row">
            <div class="wf-trust-badge-item">
              <span class="wf-tb-icon">🛡️</span>
              <span class="wf-tb-text">90-Day Money-Back Guarantee</span>
            </div>
            <div class="wf-trust-badge-item">
              <span class="wf-tb-icon">📦</span>
              <span class="wf-tb-text">Fast US Tracked Dispatch</span>
            </div>
            <div class="wf-trust-badge-item">
              <span class="wf-tb-icon">🔒</span>
              <span class="wf-tb-text">Secure 256-Bit SSL Checkout</span>
            </div>
          </div>

          <div class="wf-payment-icons">
            <span class="wf-payment-secure-text">🔒 Guaranteed Safe &amp; Secure Checkout</span>
            <ul class="wf-payment-list" role="list">
              {% assign payment_types = shop.enabled_payment_types %}
              {% if payment_types == empty or payment_types.size == 0 %}
                {% assign payment_types = 'visa,master,american_express,discover,paypal,apple_pay,google_pay,shopify_pay' | split: ',' %}
              {% endif %}
              {% for type in payment_types %}
                <li class="wf-payment-item">
                  {{ type | payment_type_svg_tag: class: 'wf-payment-svg' }}
                </li>
              {% endfor %}
            </ul>
          </div>

          <!-- Key Benefit Checkmarks (Moved below Shopify Payments) -->
          <div class="wf-benefits-card">
            <div class="wf-benefits-title">Why Homesteaders Choose Zavelyn®:</div>
            <div class="wf-benefits-list">
              {% assign key_points_count = 0 %}
              {% for block in section.blocks %}
                {% if block.type == 'key_point' %}
                  {% assign key_points_count = key_points_count | plus: 1 %}
                  <div class="wf-benefit-item" {{ block.shopify_attributes }}>
                    <span class="wf-check-icon">✔</span>
                    <span><strong>{{ block.settings.title }}:</strong> {{ block.settings.text }}</span>
                  </div>
                {% endif %}
              {% endfor %}
              {% if key_points_count == 0 %}
                <div class="wf-benefit-item">
                  <span class="wf-check-icon">✔</span>
                  <span><strong>Auto-Regulating Digital Thermostat:</strong> Calibrates warmth between 82°F–95°F (28°C–35°C). Auto-shuts off when target temp is reached.</span>
                </div>
                <div class="wf-benefit-item">
                  <span class="wf-check-icon">✔</span>
                  <span><strong>100% Sealed Fireproof Polymer Shell:</strong> Zero hot glass filaments or 400°F surface hazard. Safe around dry hay and pine shavings.</span>
                </div>
                <div class="wf-benefit-item">
                  <span class="wf-check-icon">✔</span>
                  <span><strong>Soft Ambient Glow (Zero Stress):</strong> Gentle illumination eliminates nocturnal sleep disruption and aggressive feather pecking.</span>
                </div>
                <div class="wf-benefit-item">
                  <span class="wf-check-icon">✔</span>
                  <span><strong>Standard E26/E27 Base + Heavy-Duty Cord:</strong> Screws directly into standard household sockets or included US switch cord.</span>
                </div>
              {% endif %}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 2: Main Feature Section (Willa Farm "Here's what's inside" pattern) -->
  <section class="wf-section wf-feature-grid-section">
    <div class="wf-container">
      <div class="wf-section-header">
        <h2 class="wf-section-heading">{{ section.settings.section2_title | default: 'Designed for Better Everyday Livestock Care' }}</h2>
        <div class="wf-section-subtitle">{{ section.settings.section2_subtitle | default: 'Practical warmth. Simple controls. Convenient setup.' }}</div>
      </div>

      <div class="wf-cards-4col">
        {% assign feat_count = 0 %}
        {% for block in section.blocks %}
          {% if block.type == 'feature_card' %}
            {% assign feat_count = feat_count | plus: 1 %}
            <article class="wf-card-item" {{ block.shopify_attributes }}>
              <div class="wf-card-media">
                <img src="{{ block.settings.image_url }}" alt="{{ block.settings.title | escape }}" referrerpolicy="no-referrer">
              </div>
              <div class="wf-card-content">
                <h3 class="wf-card-title">{{ block.settings.title }}</h3>
                <p class="wf-card-text">{{ block.settings.text }}</p>
              </div>
            </article>
          {% endif %}
        {% endfor %}
        {% if feat_count == 0 %}
          <article class="wf-card-item">
            <div class="wf-card-media">
              <img src="https://cdn.myshopage.com/8f765e2e-fcbd-4199-ab9b-433d4da5c000.jpg" alt="Adjustable Temperature" referrerpolicy="no-referrer">
            </div>
            <div class="wf-card-content">
              <h3 class="wf-card-title">Adjustable Temperature</h3>
              <p class="wf-card-text">Simple push-button adjustment between 82°F–95°F (28°C–35°C) to keep your flock or pets at their ideal comfort level.</p>
            </div>
          </article>

          <article class="wf-card-item">
            <div class="wf-card-media">
              <img src="https://cdn.myshopage.com/898406ff-0448-41a5-2440-fd49b2375e00/w1000.jpg" alt="Easy Temperature Monitoring" referrerpolicy="no-referrer">
            </div>
            <div class="wf-card-content">
              <h3 class="wf-card-title">Easy Temperature Monitoring</h3>
              <p class="wf-card-text">Clear digital LED display lets you check current heat levels at a quick glance without disturbing resting animals.</p>
            </div>
          </article>

          <article class="wf-card-item">
            <div class="wf-card-media">
              <img src="https://cdn.myshopage.com/27c967b2-512d-43ee-b366-7568d2a3a700/w500.jpg" alt="Convenient Setup" referrerpolicy="no-referrer">
            </div>
            <div class="wf-card-content">
              <h3 class="wf-card-title">Convenient Setup</h3>
              <p class="wf-card-text">Standard E26/E27 threaded base screws directly into common fixtures; includes a heavy-duty US switch cord for plug-and-play placement.</p>
            </div>
          </article>

          <article class="wf-card-item">
            <div class="wf-card-media">
              <img src="https://cdn.myshopage.com/8dfe030d-f1ec-4a8a-02a4-753863454400/w1000.jpg" alt="Versatile Farm Use" referrerpolicy="no-referrer">
            </div>
            <div class="wf-card-content">
              <h3 class="wf-card-title">Versatile Farm Use</h3>
              <p class="wf-card-text">Perfect for chick brooders, ducklings, piglets, puppies, reptile enclosures, and outdoor coop warming boxes.</p>
            </div>
          </article>
        {% endif %}
      </div>
    </div>
  </section>

  <!-- SECTION 3A: Alternating Storytelling (50/50 split desktop, mobile image first) -->
  <section class="wf-section wf-split-story-section">
    <div class="wf-container wf-split-grid">
      <div class="wf-split-media">
        <img src="https://cdn.myshopage.com/8dfe030d-f1ec-4a8a-02a4-753863454400/w1000.jpg" alt="Reliable Warmth for Your Routine" referrerpolicy="no-referrer">
      </div>
      <div class="wf-split-content">
        <span class="wf-eyebrow-pill">BROODER PEACE OF MIND</span>
        <h2 class="wf-split-heading">Reliable Warmth for Your Everyday Routine</h2>
        <p class="wf-split-lead">Traditional heat lamps keep homesteaders on edge with dangerous fire hazards, erratic temperature swings, and blinding red lights that disturb sleep. Zavelyn® re-engineers coop warming from the ground up.</p>
        
        <div class="wf-story-bullets">
          <div class="wf-story-bullet-item">
            <div class="wf-bullet-icon">🛡️</div>
            <div>
              <h4>Zero Flashpoint Fire Risk</h4>
              <p>100% sealed polymer housing stays cool to the touch. No fragile glass that shatters if splashed or brushed by dry straw.</p>
            </div>
          </div>
          <div class="wf-story-bullet-item">
            <div class="wf-bullet-icon">💨</div>
            <div>
              <h4>Gentle Convection Air Circulation</h4>
              <p>Distributes comfortable, even warmth across your brooder box to eliminate fatal cold spots and chick crowding.</p>
            </div>
          </div>
          <div class="wf-story-bullet-item">
            <div class="wf-bullet-icon">🌙</div>
            <div>
              <h4>Soft Ambient Glow (Stress-Free Flock)</h4>
              <p>Replaces blinding red glow with soothing ambient light, preserving natural circadian sleep cycles and preventing feather pecking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 3B: Simple Setup (01, 02, 03 Numbered Steps) -->
  <section class="wf-section wf-steps-section">
    <div class="wf-container">
      <div class="wf-section-header">
        <span class="wf-eyebrow-pill">EASY 3-STEP SETUP</span>
        <h2 class="wf-section-heading">Simple Setup. Easy Temperature Adjustments.</h2>
        <div class="wf-section-subtitle">Get your flock set up in less than 2 minutes. No tools, wiring, or contractor required.</div>
      </div>

      <div class="wf-steps-grid">
        <div class="wf-step-card">
          <div class="wf-step-badge">01</div>
          <div class="wf-step-icon">🔌</div>
          <h3>Screw &amp; Mount</h3>
          <p>Screw into any standard E26/E27 household fixture or use the included heavy-duty US toggle switch cord to hang anywhere.</p>
        </div>

        <div class="wf-step-card">
          <div class="wf-step-badge">02</div>
          <div class="wf-step-icon">⚙️</div>
          <h3>Set Ideal Warmth</h3>
          <p>Use the digital push-buttons to select your desired target temperature between 82°F–95°F (28°C–35°C) with precision accuracy.</p>
        </div>

        <div class="wf-step-card">
          <div class="wf-step-badge">03</div>
          <div class="wf-step-icon">🌡️</div>
          <h3>Monitor Real-Time</h3>
          <p>Rest easy with the crisp LED display showing real-time warmth. The lamp auto-shuts off when warm and restarts when temps drop.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 3C: Specifications at a Glance -->
  <section class="wf-section wf-specs-section">
    <div class="wf-container">
      <div class="wf-section-header">
        <h2 class="wf-section-heading">Product Specifications at a Glance</h2>
        <div class="wf-section-subtitle">Engineered for commercial-grade durability and complete homesteader safety.</div>
      </div>

      <div class="wf-specs-grid">
        <div class="wf-spec-card">
          <span class="wf-spec-label">Base Type</span>
          <span class="wf-spec-value">Standard E26 / E27 Screw-In</span>
        </div>
        <div class="wf-spec-card">
          <span class="wf-spec-label">Operating Voltage</span>
          <span class="wf-spec-value">AC 110V - 220V (Universal)</span>
        </div>
        <div class="wf-spec-card">
          <span class="wf-spec-label">Temperature Range</span>
          <span class="wf-spec-value">28°C - 35°C (82°F - 95°F)</span>
        </div>
        <div class="wf-spec-card">
          <span class="wf-spec-label">Digital Display</span>
          <span class="wf-spec-value">High-Definition Real-Time LED</span>
        </div>
        <div class="wf-spec-card">
          <span class="wf-spec-label">Shell Construction</span>
          <span class="wf-spec-value">Fireproof High-Density Polymer</span>
        </div>
        <div class="wf-spec-card">
          <span class="wf-spec-label">Switch Cord</span>
          <span class="wf-spec-value">Heavy-Duty US Plug Cord Included</span>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 3D: Trust & Purchase Confidence Badges -->
  <section class="wf-section wf-trust-cards-section">
    <div class="wf-container">
      <div class="wf-trust-cards-grid">
        <div class="wf-tc-card">
          <div class="wf-tc-icon">🚀</div>
          <h3>Fast US Dispatch</h3>
          <p>Orders are dispatched directly from our domestic warehouse within 24–48 hours with door-to-door tracking.</p>
        </div>
        <div class="wf-tc-card">
          <div class="wf-tc-icon">🛡️</div>
          <h3>90-Day Money-Back Guarantee</h3>
          <p>Try Zavelyn® risk-free in your coop or brooder. If you or your flock aren't 100% satisfied, get a prompt full refund.</p>
        </div>
        <div class="wf-tc-card">
          <div class="wf-tc-icon">💬</div>
          <h3>24/7 Dedicated Support</h3>
          <p>Real farm care and homesteader customer assistance whenever you have setup questions or need help.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 4: Comparison Section (Willa Farm Style Table) -->
  <section class="wf-section wf-comparison-section">
    <div class="wf-container">
      <div class="wf-section-header">
        <h2 class="wf-section-heading">Zavelyn® vs. Traditional 250W Heat Lamps</h2>
        <div class="wf-section-subtitle">See why modern poultry owners are ditching dangerous old-school red heat lamps.</div>
      </div>

      <div class="wf-table-card">
        <table class="wf-comparison-table">
          <thead>
            <tr>
              <th class="wf-col-feat">Key Feature</th>
              <th class="wf-col-hero">Zavelyn® Intelligent Lamp</th>
              <th class="wf-col-other">Traditional 250W Heat Lamp</th>
            </tr>
          </thead>
          <tbody>
            {% assign comp_count = 0 %}
            {% for block in section.blocks %}
              {% if block.type == 'comparison_row' %}
                {% assign comp_count = comp_count | plus: 1 %}
                <tr {{ block.shopify_attributes }}>
                  <td class="wf-td-feat">{{ block.settings.feature }}</td>
                  <td class="wf-td-hero"><span class="wf-chk">✔</span> {{ block.settings.saker_val }}</td>
                  <td class="wf-td-other"><span class="wf-cross">✖</span> {{ block.settings.generic_val }}</td>
                </tr>
              {% endif %}
            {% endfor %}
            {% if comp_count == 0 %}
              <tr>
                <td class="wf-td-feat">Fire Hazard Safety</td>
                <td class="wf-td-hero"><span class="wf-chk">✔</span> 100% Fireproof Sealed Polymer</td>
                <td class="wf-td-other"><span class="wf-cross">✖</span> High Risk (400°F surface burns straw)</td>
              </tr>
              <tr>
                <td class="wf-td-feat">Temperature Control</td>
                <td class="wf-td-hero"><span class="wf-chk">✔</span> Automatic Smart Thermostat</td>
                <td class="wf-td-other"><span class="wf-cross">✖</span> None (Runs full blast 24/7)</td>
              </tr>
              <tr>
                <td class="wf-td-feat">Circadian Sleep Health</td>
                <td class="wf-td-hero"><span class="wf-chk">✔</span> Gentle Low-Lux Ambient Glow</td>
                <td class="wf-td-other"><span class="wf-cross">✖</span> Blinding Red Glare (Causes pecking)</td>
              </tr>
              <tr>
                <td class="wf-td-feat">Water Splash Durability</td>
                <td class="wf-td-hero"><span class="wf-chk">✔</span> Splash-Proof Sealed Casing</td>
                <td class="wf-td-other"><span class="wf-cross">✖</span> Fragile Glass Shatters Instantly</td>
              </tr>
              <tr>
                <td class="wf-td-feat">Electricity Cost</td>
                <td class="wf-td-hero"><span class="wf-chk">✔</span> Auto-cycles off (Saves up to 60%)</td>
                <td class="wf-td-other"><span class="wf-cross">✖</span> High 250W continuous draw</td>
              </tr>
            {% endif %}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- SECTION 5: Customer Reviews -->
  <section class="wf-section wf-reviews-section">
    <div class="wf-container">
      <div class="wf-section-header">
        <h2 class="wf-section-heading">What Homesteaders &amp; Farmers Are Saying</h2>
        <div class="wf-section-subtitle">
          <span class="wf-stars">{% render 'trustpilot-stars', width: 96, height: 18 %}</span> 4.9 / 5.0 Rating (1,480+ Verified Homesteader Reviews)
        </div>
      </div>

      <div class="wf-reviews-grid">
        {% assign rev_count = 0 %}
        {% for block in section.blocks %}
          {% if block.type == 'review_card' %}
            {% assign rev_count = rev_count | plus: 1 %}
            <article class="wf-review-card" {{ block.shopify_attributes }}>
              <div class="wf-rev-header">
                <span class="wf-rev-author">{{ block.settings.author }}</span>
                {% if block.settings.verified %}<span class="wf-rev-verified">✔ Verified Buyer</span>{% endif %}
              </div>
              <div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>
              <h4 class="wf-rev-headline">{{ block.settings.headline }}</h4>
              <p class="wf-rev-body">{{ block.settings.review }}</p>
            </article>
          {% endif %}
        {% endfor %}
        {% if rev_count == 0 %}
          <article class="wf-review-card">
            <div class="wf-rev-header">
              <span class="wf-rev-author">Kim D.</span>
              <span class="wf-rev-verified">✔ Verified Buyer</span>
            </div>
            <div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>
            <h4 class="wf-rev-headline">First season with 100% chick survival!</h4>
            <p class="wf-rev-body">"I installed this heating lamp in our brooder shed for the winter hatch. With it, the chicks are warm, thriving, and active. The digital temperature display makes it effortless to monitor, and I love that it shuts off automatically once the target warmth is reached."</p>
          </article>

          <article class="wf-review-card">
            <div class="wf-rev-header">
              <span class="wf-rev-author">Marcus V.</span>
              <span class="wf-rev-verified">✔ Verified Buyer</span>
            </div>
            <div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>
            <h4 class="wf-rev-headline">No more sleepless nights worrying about coop fires</h4>
            <p class="wf-rev-body">"Had a terrifying scare last winter when an old clamp heat lamp slipped into dry pine shavings. Thank God I caught it in time. Swapped everything to Zavelyn® immediately. Cool to the touch exterior, zero fire risk, and the chicks sleep peacefully without pecking."</p>
          </article>

          <article class="wf-review-card">
            <div class="wf-rev-header">
              <span class="wf-rev-author">Sarah L.</span>
              <span class="wf-rev-verified">✔ Verified Buyer</span>
            </div>
            <div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>
            <h4 class="wf-rev-headline">Game-changer for our backyard flock</h4>
            <p class="wf-rev-body">"The built-in digital thermostat is worth its weight in gold. I set it to 90 degrees and go to bed with complete peace of mind. No more getting up at 2 AM in freezing weather to check the brooder. Highly recommend the 2-pack!"</p>
          </article>

          <article class="wf-review-card">
            <div class="wf-rev-header">
              <span class="wf-rev-author">Jason B.</span>
              <span class="wf-rev-verified">✔ Verified Buyer</span>
            </div>
            <div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>
            <h4 class="wf-rev-headline">Great for ducklings and small animals</h4>
            <p class="wf-rev-body">"Raised two batches of ducklings under this lamp this year. The gentle ambient light lets them sleep normally without the blinding red glare that causes aggression. Super simple screw-in installation and excellent build quality."</p>
          </article>
        {% endif %}
      </div>
    </div>
  </section>

  <!-- SECTION 6: Frequently Asked Questions (Collapsible Accordion) -->
  <section class="wf-section wf-faq-section">
    <div class="wf-container wf-faq-container">
      <div class="wf-section-header">
        <h2 class="wf-section-heading">Frequently Asked Questions</h2>
        <div class="wf-section-subtitle">Everything you need to know about setting up and running your Zavelyn® lamp.</div>
      </div>

      <div class="wf-faq-list">
        {% assign faq_count = 0 %}
        {% for block in section.blocks %}
          {% if block.type == 'faq_item' %}
            {% assign faq_count = faq_count | plus: 1 %}
            <details class="wf-faq-item" {{ block.shopify_attributes }}>
              <summary class="wf-faq-question">
                <span>{{ block.settings.question }}</span>
                <span class="wf-faq-chevron">+</span>
              </summary>
              <div class="wf-faq-answer">
                <p>{{ block.settings.answer }}</p>
              </div>
            </details>
          {% endif %}
        {% endfor %}
        {% if faq_count == 0 %}
          <details class="wf-faq-item">
            <summary class="wf-faq-question">
              <span>Is this heating lamp safe to use around dry hay and pine shavings?</span>
              <span class="wf-faq-chevron">+</span>
            </summary>
            <div class="wf-faq-answer">
              <p>Yes, 100%! Unlike traditional glass bulbs that reach 400°F+ on the exterior, the Zavelyn® Livestock Lamp features a sealed, fireproof polymer housing that stays cool to the touch. Even if shavings or loose feathers contact the shell, there are no exposed hot filaments or ignition flashpoints.</p>
            </div>
          </details>

          <details class="wf-faq-item">
            <summary class="wf-faq-question">
              <span>How does the automatic temperature control work?</span>
              <span class="wf-faq-chevron">+</span>
            </summary>
            <div class="wf-faq-answer">
              <p>The lamp features an integrated digital sensor and microcontroller. Simply set your desired temperature (28°C to 35°C / 82°F to 95°F) using the + and - buttons. The heating element automatically suspends heat once the ambient temperature reaches your target and automatically kicks back on when temps dip.</p>
            </div>
          </details>

          <details class="wf-faq-item">
            <summary class="wf-faq-question">
              <span>Does it screw into a regular light socket?</span>
              <span class="wf-faq-chevron">+</span>
            </summary>
            <div class="wf-faq-answer">
              <p>Yes. It uses a standard E26 / E27 threaded screw base. Each package also includes a heavy-duty US standard switch cord with a toggle switch for convenient placement anywhere in your coop, brooder, or barn.</p>
            </div>
          </details>

          <details class="wf-faq-item">
            <summary class="wf-faq-question">
              <span>What is your return and guarantee policy?</span>
              <span class="wf-faq-chevron">+</span>
            </summary>
            <div class="wf-faq-answer">
              <p>Every order comes with our 90-Day 100% Satisfaction Money-Back Guarantee. If for any reason you or your flock are not thrilled with its performance, simply contact our support team for a prompt refund.</p>
            </div>
          </details>
        {% endif %}
      </div>
    </div>
  </section>

  <!-- STICKY BUY BAR (Mobile CRO) -->
  <div class="wf-sticky-buy-bar" id="wf-sticky-bar">
    <div class="wf-sticky-content">
      <div class="wf-sticky-thumb">
        <img id="wf-sticky-img" src="https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png" alt="Zavelyn Livestock Lamp" referrerpolicy="no-referrer">
      </div>
      <div class="wf-sticky-meta">
        <div class="wf-sticky-title">Zavelyn® Livestock Lamp</div>
        <div class="wf-sticky-price" id="wf-sticky-price-val">$89.99 (2 Pack)</div>
      </div>
    </div>
    <button type="button" class="wf-sticky-btn" onclick="document.querySelector('#fn-offer').scrollIntoView({behavior:'smooth'})">
      ORDER NOW ➔
    </button>
  </div>
</div>

<style>
  :root {
    --wf-ink: #3b2b2f;
    --wf-muted: #75696c;
    --wf-border: #e6ded6;
    --wf-accent: #8a2c13;
    --wf-accent-hover: #73230e;
    --wf-accent-light: #fbebe6;
    --wf-bg-page: #faf7f4;
    --wf-card-bg: #ffffff;
    --wf-card-radius: 18px;
    --wf-font-heading: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
    --wf-font-body: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .zavelyn-pdp-wrapper {
    font-family: var(--wf-font-body);
    color: var(--wf-ink);
    background-color: var(--wf-bg-page);
    line-height: 1.5;
    padding-bottom: 80px;
    -webkit-font-smoothing: antialiased;
  }

  .wf-container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* Top announcement strip */
  .wf-top-strip {
    background: var(--wf-ink);
    color: #f7f3e6;
    font-size: 12px;
    font-weight: 600;
    padding: 9px 0;
    letter-spacing: 0.3px;
  }
  .wf-strip-inner {
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
  }

  /* Section headers */
  .wf-section {
    padding: 48px 0;
  }
  .wf-section-header {
    text-align: center;
    max-width: 720px;
    margin: 0 auto 36px auto;
  }
  .wf-eyebrow-pill {
    display: inline-block;
    background: var(--wf-accent-light);
    color: var(--wf-accent);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 4px 14px;
    border-radius: 9999px;
    margin-bottom: 12px;
    text-transform: uppercase;
  }
  .wf-section-heading {
    font-family: var(--wf-font-heading);
    font-size: 32px;
    font-weight: 800;
    color: var(--wf-ink);
    line-height: 1.25;
    margin: 0 0 10px 0;
  }
  .wf-section-subtitle {
    font-size: 15px;
    color: var(--wf-muted);
    line-height: 1.5;
  }

  /* SECTION 1: Hero Buybox */
  .wf-hero-buybox {
    padding-top: 24px;
    background: #ffffff;
    border-bottom: 1px solid var(--wf-border);
  }
  .wf-hero-grid {
    display: flex;
    gap: 40px;
    align-items: flex-start;
  }
  .wf-gallery-col {
    flex: 1 1 54%;
    position: sticky;
    top: 90px;
  }
  .wf-buybox-col {
    flex: 1 1 46%;
  }

  .wf-gallery-main {
    position: relative;
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: var(--wf-card-radius);
    overflow: hidden;
    background: #ffffff;
    border: 1px solid var(--wf-border);
    box-shadow: 0 4px 20px rgba(59, 43, 47, 0.04);
    margin-bottom: 12px;
  }
  .wf-gallery-main img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.25s ease;
  }
  .wf-gallery-badge {
    position: absolute;
    top: 14px;
    left: 14px;
    background: var(--wf-accent);
    color: #ffffff;
    font-family: var(--wf-font-heading);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.5px;
    padding: 5px 12px;
    border-radius: 6px;
  }

  .wf-thumbnail-strip {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 6px;
    margin-bottom: 20px;
  }
  .wf-thumb {
    width: 72px;
    height: 72px;
    border-radius: 10px;
    object-fit: cover;
    border: 2px solid transparent;
    cursor: pointer;
    background: #ffffff;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  .wf-thumb.active {
    border-color: var(--wf-accent);
    transform: scale(0.96);
  }

  .wf-benefits-card {
    background: #fdfbf9;
    border: 1px solid var(--wf-border);
    border-radius: 14px;
    padding: 18px;
    margin-top: 16px;
  }
  .wf-benefits-title {
    font-family: var(--wf-font-heading);
    font-size: 13px;
    font-weight: 800;
    color: var(--wf-ink);
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .wf-benefits-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .wf-benefit-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    color: #4a3e41;
    line-height: 1.4;
  }
  .wf-check-icon {
    color: #219662;
    font-weight: 800;
    font-size: 14px;
    flex-shrink: 0;
  }

  /* Header group in buybox */
  .wf-review-stars {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .wf-stars {
    color: #f59e0b;
    font-size: 15px;
    letter-spacing: 1px;
  }
  .wf-review-count {
    font-size: 13px;
    font-weight: 600;
    color: var(--wf-muted);
  }
  .wf-product-title {
    font-family: var(--wf-font-heading);
    font-size: 28px;
    font-weight: 800;
    color: var(--wf-ink);
    line-height: 1.25;
    margin: 0 0 12px 0;
  }
  .wf-product-desc {
    font-size: 14px;
    color: var(--wf-muted);
    line-height: 1.5;
    margin: 0 0 20px 0;
  }

  /* Bundle selector */
  .wf-bundle-selector {
    margin-bottom: 20px;
  }
  .wf-selector-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--wf-font-heading);
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .wf-savings-pill {
    background: var(--wf-accent-light);
    color: var(--wf-accent);
    font-size: 11px;
    font-weight: 800;
    padding: 3px 10px;
    border-radius: 9999px;
  }

  .wf-bundles-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .wf-bundle-card {
    position: relative;
    background: #ffffff;
    border: 1px solid var(--wf-border);
    border-radius: 14px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .wf-bundle-card:hover {
    border-color: #c9bfb6;
  }
  .wf-bundle-card.selected {
    border: 2px solid var(--wf-accent);
    background: #fffdfb;
    box-shadow: 0 4px 16px rgba(138, 44, 19, 0.08);
  }

  .wf-bundle-badge {
    position: absolute;
    top: -10px;
    right: 16px;
    background: var(--wf-accent);
    color: #ffffff;
    font-family: var(--wf-font-heading);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.5px;
    padding: 3px 10px;
    border-radius: 9999px;
  }
  .wf-bundle-badge.secondary {
    background: var(--wf-accent-light);
    color: var(--wf-accent);
  }

  .wf-bundle-inner {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .wf-radio-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #c9bfb6;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.2s;
  }
  .wf-bundle-card.selected .wf-radio-circle {
    border-color: var(--wf-accent);
  }
  .wf-radio-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: transparent;
    transition: background 0.2s;
  }
  .wf-bundle-card.selected .wf-radio-dot {
    background: var(--wf-accent);
  }

  .wf-bundle-thumb {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    overflow: hidden;
    background: #faf7f4;
    flex-shrink: 0;
  }
  .wf-bundle-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .wf-bundle-details {
    flex-grow: 1;
  }
  .wf-bundle-name {
    font-family: var(--wf-font-heading);
    font-size: 15px;
    font-weight: 700;
    color: var(--wf-ink);
    margin-bottom: 2px;
  }
  .wf-bundle-includes {
    font-size: 12px;
    color: var(--wf-muted);
    line-height: 1.35;
  }

  .wf-bundle-pricing {
    text-align: right;
    flex-shrink: 0;
  }
  .wf-price-compare {
    display: block;
    font-size: 13px;
    color: #a89f9d;
    text-decoration: line-through;
  }
  .wf-price-current {
    font-family: var(--wf-font-heading);
    font-size: 18px;
    font-weight: 800;
    color: var(--wf-accent);
  }

  /* Quantity and CTA */
  .wf-qty-and-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    padding: 12px 16px;
    background: #f7f3ee;
    border-radius: 12px;
  }
  .wf-qty-control {
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid var(--wf-border);
    border-radius: 8px;
    overflow: hidden;
  }
  .wf-qty-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    color: var(--wf-ink);
    transition: background 0.15s;
  }
  .wf-qty-btn:hover {
    background: #f1ede8;
  }
  #wf-qty-input {
    width: 38px;
    height: 32px;
    border: none;
    text-align: center;
    font-family: var(--wf-font-heading);
    font-weight: 700;
    font-size: 14px;
    background: transparent;
  }
  .wf-total-block {
    text-align: right;
  }
  .wf-total-label {
    font-size: 12px;
    color: var(--wf-muted);
    margin-right: 6px;
  }
  .wf-total-price {
    font-family: var(--wf-font-heading);
    font-size: 20px;
    font-weight: 800;
    color: var(--wf-ink);
  }

  .wf-atc-button {
    width: 100%;
    background: var(--wf-accent);
    color: #ffffff;
    border: none;
    border-radius: 14px;
    padding: 16px 24px;
    font-family: var(--wf-font-heading);
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    box-shadow: 0 6px 20px rgba(138, 44, 19, 0.25);
    transition: all 0.2s ease;
  }
  .wf-atc-button:hover {
    background: var(--wf-accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(138, 44, 19, 0.3);
  }
  .wf-atc-button:active {
    transform: translateY(1px);
  }

  .wf-trust-row {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--wf-border);
    gap: 8px;
  }
  .wf-trust-badge-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    color: var(--wf-muted);
  }
  .wf-tb-icon {
    font-size: 14px;
  }

  .wf-payment-icons {
    text-align: center;
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px dashed var(--wf-border);
  }
  .wf-payment-secure-text {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: var(--wf-muted);
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .wf-payment-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0 auto;
  }
  .wf-payment-item {
    display: inline-flex;
    align-items: center;
    line-height: 0;
  }
  .wf-payment-svg {
    width: 38px;
    height: 24px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    transition: transform 0.15s ease;
  }
  .wf-payment-svg:hover {
    transform: scale(1.08);
  }

  /* SECTION 2: 4-Column Feature Cards */
  .wf-feature-grid-section {
    background: var(--wf-bg-page);
  }
  .wf-cards-4col {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  .wf-card-item {
    background: var(--wf-card-bg);
    border: 1px solid var(--wf-border);
    border-radius: var(--wf-card-radius);
    padding: 20px;
    box-shadow: 0 4px 16px rgba(59, 43, 47, 0.03);
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .wf-card-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(59, 43, 47, 0.08);
  }
  .wf-card-media {
    width: 100%;
    aspect-ratio: 4/3;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 16px;
    background: #faf7f4;
  }
  .wf-card-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .wf-card-title {
    font-family: var(--wf-font-heading);
    font-size: 17px;
    font-weight: 700;
    color: var(--wf-ink);
    margin: 0 0 8px 0;
    line-height: 1.3;
  }
  .wf-card-text {
    font-size: 13px;
    color: var(--wf-muted);
    line-height: 1.5;
    margin: 0;
  }

  /* SECTION 3A: Split Storytelling */
  .wf-split-story-section {
    background: #ffffff;
    border-top: 1px solid var(--wf-border);
    border-bottom: 1px solid var(--wf-border);
  }
  .wf-split-grid {
    display: flex;
    align-items: center;
    gap: 50px;
  }
  .wf-split-content {
    flex: 1 1 50%;
  }
  .wf-split-media {
    flex: 1 1 50%;
    border-radius: var(--wf-card-radius);
    overflow: hidden;
    box-shadow: 0 6px 24px rgba(59, 43, 47, 0.08);
    border: 1px solid var(--wf-border);
  }
  .wf-split-media img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
  .wf-split-heading {
    font-family: var(--wf-font-heading);
    font-size: 32px;
    font-weight: 800;
    color: var(--wf-ink);
    line-height: 1.25;
    margin: 0 0 14px 0;
  }
  .wf-split-lead {
    font-size: 15px;
    color: var(--wf-muted);
    line-height: 1.6;
    margin-bottom: 24px;
  }
  .wf-story-bullets {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .wf-story-bullet-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }
  .wf-bullet-icon {
    font-size: 24px;
    line-height: 1;
    flex-shrink: 0;
    padding-top: 2px;
  }
  .wf-story-bullet-item h4 {
    font-family: var(--wf-font-heading);
    font-size: 16px;
    font-weight: 700;
    color: var(--wf-ink);
    margin: 0 0 4px 0;
  }
  .wf-story-bullet-item p {
    font-size: 13px;
    color: var(--wf-muted);
    line-height: 1.45;
    margin: 0;
  }

  /* SECTION 3B: Steps */
  .wf-steps-section {
    background: var(--wf-bg-page);
  }
  .wf-steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .wf-step-card {
    background: var(--wf-card-bg);
    border: 1px solid var(--wf-border);
    border-radius: var(--wf-card-radius);
    padding: 28px 24px;
    position: relative;
    box-shadow: 0 4px 16px rgba(59, 43, 47, 0.03);
  }
  .wf-step-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    font-family: var(--wf-font-heading);
    font-size: 24px;
    font-weight: 800;
    color: rgba(138, 44, 19, 0.18);
  }
  .wf-step-icon {
    font-size: 32px;
    margin-bottom: 16px;
  }
  .wf-step-card h3 {
    font-family: var(--wf-font-heading);
    font-size: 18px;
    font-weight: 700;
    color: var(--wf-ink);
    margin: 0 0 8px 0;
  }
  .wf-step-card p {
    font-size: 13px;
    color: var(--wf-muted);
    line-height: 1.5;
    margin: 0;
  }

  /* SECTION 3C: Specs Grid */
  .wf-specs-section {
    background: #ffffff;
    border-top: 1px solid var(--wf-border);
    border-bottom: 1px solid var(--wf-border);
  }
  .wf-specs-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .wf-spec-card {
    background: #faf7f4;
    border: 1px solid var(--wf-border);
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .wf-spec-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--wf-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .wf-spec-value {
    font-family: var(--wf-font-heading);
    font-size: 15px;
    font-weight: 700;
    color: var(--wf-ink);
  }

  /* SECTION 3D: Trust Cards */
  .wf-trust-cards-section {
    background: var(--wf-bg-page);
    padding: 36px 0;
  }
  .wf-trust-cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .wf-tc-card {
    background: #ffffff;
    border: 1px solid var(--wf-border);
    border-radius: 16px;
    padding: 24px;
    text-align: center;
  }
  .wf-tc-icon {
    font-size: 32px;
    margin-bottom: 10px;
  }
  .wf-tc-card h3 {
    font-family: var(--wf-font-heading);
    font-size: 16px;
    font-weight: 700;
    color: var(--wf-ink);
    margin: 0 0 6px 0;
  }
  .wf-tc-card p {
    font-size: 13px;
    color: var(--wf-muted);
    line-height: 1.45;
    margin: 0;
  }

  /* SECTION 4: Comparison Table */
  .wf-comparison-section {
    background: #ffffff;
    border-top: 1px solid var(--wf-border);
    border-bottom: 1px solid var(--wf-border);
  }
  .wf-table-card {
    background: #ffffff;
    border: 1px solid var(--wf-border);
    border-radius: var(--wf-card-radius);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(59, 43, 47, 0.04);
  }
  .wf-comparison-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  .wf-comparison-table th {
    padding: 18px 20px;
    font-family: var(--wf-font-heading);
    font-size: 14px;
    font-weight: 800;
  }
  .wf-col-feat {
    width: 34%;
    background: #f7f3ee;
    color: var(--wf-ink);
  }
  .wf-col-hero {
    width: 36%;
    background: var(--wf-accent-light);
    color: var(--wf-accent);
  }
  .wf-col-other {
    width: 30%;
    background: #f1ede8;
    color: var(--wf-muted);
  }
  .wf-comparison-table td {
    padding: 16px 20px;
    font-size: 13px;
    border-top: 1px solid var(--wf-border);
  }
  .wf-td-feat {
    font-weight: 600;
    color: var(--wf-ink);
    background: #fffdfb;
  }
  .wf-td-hero {
    font-weight: 600;
    color: var(--wf-ink);
    background: #fffcfb;
  }
  .wf-td-other {
    color: #8c8280;
    background: #ffffff;
  }
  .wf-chk {
    color: #219662;
    font-weight: 800;
    margin-right: 4px;
  }
  .wf-cross {
    color: #dc2626;
    font-weight: 800;
    margin-right: 4px;
  }

  /* SECTION 5: Reviews */
  .wf-reviews-section {
    background: var(--wf-bg-page);
  }
  .wf-reviews-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  .wf-review-card {
    background: #ffffff;
    border: 1px solid var(--wf-border);
    border-radius: var(--wf-card-radius);
    padding: 22px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 16px rgba(59, 43, 47, 0.03);
  }
  .wf-rev-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .wf-rev-author {
    font-family: var(--wf-font-heading);
    font-size: 14px;
    font-weight: 700;
    color: var(--wf-ink);
  }
  .wf-rev-verified {
    font-size: 11px;
    font-weight: 600;
    color: #219662;
  }
  .wf-rev-stars {
    color: #f59e0b;
    font-size: 13px;
    margin-bottom: 8px;
  }
  .wf-rev-headline {
    font-family: var(--wf-font-heading);
    font-size: 15px;
    font-weight: 700;
    color: var(--wf-ink);
    line-height: 1.35;
    margin: 0 0 8px 0;
  }
  .wf-rev-body {
    font-size: 13px;
    color: var(--wf-muted);
    line-height: 1.5;
    margin: 0;
  }

  /* SECTION 6: FAQ Accordion */
  .wf-faq-section {
    background: #ffffff;
    border-top: 1px solid var(--wf-border);
  }
  .wf-faq-container {
    max-width: 800px;
  }
  .wf-faq-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .wf-faq-item {
    background: #ffffff;
    border: 1px solid var(--wf-border);
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.2s ease;
  }
  .wf-faq-item[open] {
    border-color: #c9bfb6;
    box-shadow: 0 4px 16px rgba(59, 43, 47, 0.04);
  }
  .wf-faq-question {
    list-style: none;
    padding: 18px 22px;
    font-family: var(--wf-font-heading);
    font-size: 15px;
    font-weight: 700;
    color: var(--wf-ink);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
  .wf-faq-question::-webkit-details-marker {
    display: none;
  }
  .wf-faq-chevron {
    font-size: 20px;
    font-weight: 400;
    color: var(--wf-muted);
    transition: transform 0.2s ease;
  }
  .wf-faq-item[open] .wf-faq-chevron {
    transform: rotate(45deg);
  }
  .wf-faq-answer {
    padding: 0 22px 18px 22px;
    font-size: 14px;
    color: var(--wf-muted);
    line-height: 1.55;
  }
  .wf-faq-answer p {
    margin: 0;
  }

  /* STICKY BUY BAR (Mobile) */
  .wf-sticky-buy-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    border-top: 1px solid var(--wf-border);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
    padding: 12px 16px;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    transform: translateY(110%);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .wf-sticky-buy-bar.visible {
    transform: translateY(0);
  }
  .wf-sticky-content {
    display: flex;
    align-items: center;
    gap: 10px;
    overflow: hidden;
  }
  .wf-sticky-thumb {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    overflow: hidden;
    background: #faf7f4;
    flex-shrink: 0;
  }
  .wf-sticky-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .wf-sticky-meta {
    overflow: hidden;
  }
  .wf-sticky-title {
    font-family: var(--wf-font-heading);
    font-size: 13px;
    font-weight: 700;
    color: var(--wf-ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .wf-sticky-price {
    font-size: 12px;
    font-weight: 700;
    color: var(--wf-accent);
  }
  .wf-sticky-btn {
    background: var(--wf-accent);
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 10px 18px;
    font-family: var(--wf-font-heading);
    font-size: 13px;
    font-weight: 800;
    white-space: nowrap;
    cursor: pointer;
    flex-shrink: 0;
  }

  .mobile-only {
    display: none;
  }
  .desktop-only {
    display: block;
  }

  /* RESPONSIVE BREAKPOINTS */
  @media (max-width: 991px) {
    .wf-hero-grid {
      flex-direction: column;
      gap: 24px;
    }
    .wf-gallery-col {
      position: static;
      width: 100%;
    }
    .wf-buybox-col {
      width: 100%;
    }
    .wf-cards-4col {
      grid-template-columns: repeat(2, 1fr);
    }
    .wf-split-grid {
      flex-direction: column;
      gap: 24px;
    }
    .wf-split-media {
      order: -1;
      width: 100%;
    }
    .wf-steps-grid {
      grid-template-columns: 1fr;
    }
    .wf-specs-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .wf-trust-cards-grid {
      grid-template-columns: 1fr;
    }
    .wf-reviews-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 767px) {
    .desktop-only {
      display: none !important;
    }
    .mobile-only {
      display: block !important;
    }
    .wf-section {
      padding: 32px 0;
    }
    .wf-section-heading {
      font-size: 24px;
    }
    .wf-product-title {
      font-size: 22px;
    }
    .wf-cards-4col {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .wf-specs-grid {
      grid-template-columns: 1fr;
    }
    .wf-reviews-grid {
      grid-template-columns: 1fr;
    }
    .wf-comparison-table th,
    .wf-comparison-table td {
      padding: 12px 10px;
      font-size: 12px;
    }
    .wf-trust-row {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
    }
    .wf-trust-badge-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      font-weight: 600;
      line-height: 1.25;
      flex: 1 1 0;
      text-align: left;
    }
    .wf-tb-icon {
      font-size: 13px;
      flex-shrink: 0;
    }
  }
</style>

<script>
  let wfSelectedVariantId = '67930179436729'; // default 2 pack
  let wfSelectedPrice = 89.99;
  let wfCurrentQty = 1;

  function switchWfGallery(src) {
    const main = document.getElementById('wf-main-img');
    if (main) {
      main.style.opacity = '0.3';
      setTimeout(() => {
        main.src = src;
        main.style.opacity = '1';
      }, 150);
    }
    document.querySelectorAll('.wf-thumb').forEach(t => {
      if (t.src === src) t.classList.add('active');
      else t.classList.remove('active');
    });
  }

  function selectWfBundle(variantId, price, oldPrice, elementId, imgSrc) {
    wfSelectedVariantId = variantId;
    wfSelectedPrice = parseFloat(price);

    document.querySelectorAll('.wf-bundle-card').forEach(c => c.classList.remove('selected'));
    const el = document.getElementById(elementId);
    if (el) el.classList.add('selected');

    if (imgSrc) {
      switchWfGallery(imgSrc);
      const stickyImg = document.getElementById('wf-sticky-img');
      if (stickyImg) stickyImg.src = imgSrc;
    }

    const titleText = (variantId === '67930179436729') ? '$89.99 (2 Pack)' : '$49.99 (1 Pack)';
    const stickyPriceVal = document.getElementById('wf-sticky-price-val');
    if (stickyPriceVal) stickyPriceVal.textContent = titleText;

    updateWfTotal();
  }

  function adjustWfQty(delta) {
    let input = document.getElementById('wf-qty-input');
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val = Math.max(1, Math.min(10, val + delta));
    input.value = val;
    wfCurrentQty = val;
    updateWfTotal();
  }

  function updateWfTotal() {
    const total = (wfSelectedPrice * wfCurrentQty).toFixed(2);
    const disp = document.getElementById('wf-total-display');
    if (disp) disp.textContent = '$' + total;
  }

  async function submitWfOrder() {
    const btn = document.getElementById('wf-main-atc-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Processing Secure Order...</span>';
    }

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: wfSelectedVariantId,
            quantity: wfCurrentQty
          }]
        })
      });

      if (res.ok) {
        window.location.href = '/checkout';
      } else {
        // Fallback direct checkout url
        window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
      }
    } catch (e) {
      console.error(e);
      window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
    }
  }

  // Sticky bottom bar trigger on scroll past ATC
  window.addEventListener('scroll', function() {
    const atc = document.getElementById('wf-main-atc-btn');
    const sticky = document.getElementById('wf-sticky-bar');
    if (!atc || !sticky) return;

    const rect = atc.getBoundingClientRect();
    if (rect.bottom < 0) {
      sticky.classList.add('visible');
    } else {
      sticky.classList.remove('visible');
    }
  }, { passive: true });
</script>

{% schema %}
{
  "name": "Heating Lamp Willa Funnel",
  "settings": [
    {
      "type": "text",
      "id": "product_title",
      "label": "Product Title",
      "default": "Zavelyn® Intelligent Livestock Heating Lamp"
    },
    {
      "type": "textarea",
      "id": "product_subtitle",
      "label": "Product Subtitle",
      "default": "Safe, energy-efficient brooder warmth engineered with an intelligent digital thermostat. Keeps baby chicks, ducklings, piglets, and pets comfortably warm without dangerous fire risks or harsh red glare."
    },
    {
      "type": "text",
      "id": "main_image_url",
      "label": "Main Image URL",
      "default": "https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg"
    },
    {
      "type": "text",
      "id": "section2_title",
      "label": "Section 2 Title",
      "default": "Designed for Better Everyday Livestock Care"
    },
    {
      "type": "text",
      "id": "section2_subtitle",
      "label": "Section 2 Subtitle",
      "default": "Practical warmth. Simple controls. Convenient setup."
    }
  ],
  "blocks": [
    {
      "type": "bundle_package",
      "name": "Bundle Package",
      "settings": [
        { "type": "text", "id": "title", "label": "Bundle Title" },
        { "type": "text", "id": "badge", "label": "Tag Badge" },
        { "type": "checkbox", "id": "is_best_seller", "label": "Is Best Seller", "default": false },
        { "type": "html", "id": "description", "label": "Includes Description" },
        { "type": "text", "id": "variant_id", "label": "Shopify Variant ID" },
        { "type": "text", "id": "price", "label": "Sale Price" },
        { "type": "text", "id": "old_price", "label": "Compare Price" },
        { "type": "text", "id": "image_url", "label": "Package Thumbnail URL" }
      ]
    },
    {
      "type": "key_point",
      "name": "Hero Key Benefit",
      "settings": [
        { "type": "text", "id": "title", "label": "Title" },
        { "type": "textarea", "id": "text", "label": "Text" }
      ]
    },
    {
      "type": "feature_card",
      "name": "Section 2 Feature Card",
      "settings": [
        { "type": "text", "id": "image_url", "label": "Image URL" },
        { "type": "text", "id": "title", "label": "Feature Title" },
        { "type": "textarea", "id": "text", "label": "Description" }
      ]
    },
    {
      "type": "comparison_row",
      "name": "Comparison Row",
      "settings": [
        { "type": "text", "id": "feature", "label": "Feature Name" },
        { "type": "text", "id": "saker_val", "label": "Zavelyn Value" },
        { "type": "text", "id": "generic_val", "label": "Traditional Value" }
      ]
    },
    {
      "type": "review_card",
      "name": "Review Card",
      "settings": [
        { "type": "text", "id": "author", "label": "Author" },
        { "type": "checkbox", "id": "verified", "label": "Verified Buyer", "default": true },
        { "type": "text", "id": "stars", "label": "Stars", "default": "★★★★★" },
        { "type": "text", "id": "headline", "label": "Review Headline" },
        { "type": "textarea", "id": "review", "label": "Review Text" }
      ]
    },
    {
      "type": "faq_item",
      "name": "FAQ Item",
      "settings": [
        { "type": "text", "id": "question", "label": "Question" },
        { "type": "textarea", "id": "answer", "label": "Answer" }
      ]
    }
  ],
  "presets": [
    {
      "name": "Heating Lamp Willa Funnel"
    }
  ]
}
{% endschema %}
`;
}

function generateHeatingLampJson() {
  return {
    sections: {
      "heating_lamp_funnel": {
        type: "heating-lamp-funnel",
        blocks: {
          "bundle_2": {
            type: "bundle_package",
            settings: {
              badge: "BEST SELLER • 50% OFF • FREE SHIPPING",
              is_best_seller: true,
              title: "2 Pack (Light + US Switch Cord)",
              description: "<span>✔ 2x Zavelyn® Intelligent Heating Lamps</span><br><span>✔ 2x US Heavy-Duty Switch Cords • $44.99/set</span>",
              variant_id: "67930179436729",
              price: "89.99",
              old_price: "179.99",
              image_url: "https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png"
            }
          },
          "bundle_1": {
            type: "bundle_package",
            settings: {
              badge: "STARTER PACK • 50% OFF",
              is_best_seller: false,
              title: "1 Pack (Light + US Switch Cord)",
              description: "<span>✔ 1x Zavelyn® Intelligent Heating Lamp</span><br><span>✔ 1x US Heavy-Duty Switch Cord</span>",
              variant_id: "67930179403961",
              price: "49.99",
              old_price: "99.99",
              image_url: "https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg"
            }
          },
          "point_1": {
            type: "key_point",
            settings: {
              title: "Auto-Regulating Digital Thermostat",
              text: "Calibrates warmth between 82°F–95°F (28°C–35°C). Auto-shuts off when target temp is reached."
            }
          },
          "point_2": {
            type: "key_point",
            settings: {
              title: "100% Sealed Fireproof Polymer Shell",
              text: "Zero hot glass filaments or 400°F surface hazard. Safe around dry hay and pine shavings."
            }
          },
          "point_3": {
            type: "key_point",
            settings: {
              title: "Soft Ambient Glow (Zero Stress)",
              text: "Gentle illumination eliminates nocturnal sleep disruption and aggressive feather pecking."
            }
          },
          "point_4": {
            type: "key_point",
            settings: {
              title: "Standard E26/E27 Base + Heavy-Duty Cord",
              text: "Screws directly into standard household sockets or included US switch cord."
            }
          },
          "feat_1": {
            type: "feature_card",
            settings: {
              image_url: "https://cdn.myshopage.com/8f765e2e-fcbd-4199-ab9b-433d4da5c000.jpg",
              title: "Adjustable Temperature",
              text: "Simple push-button adjustment between 82°F–95°F (28°C–35°C) to keep your flock or pets at their ideal comfort level."
            }
          },
          "feat_2": {
            type: "feature_card",
            settings: {
              image_url: "https://cdn.myshopage.com/898406ff-0448-41a5-2440-fd49b2375e00/w1000.jpg",
              title: "Easy Temperature Monitoring",
              text: "Clear digital LED display lets you check current heat levels at a quick glance without disturbing resting animals."
            }
          },
          "feat_3": {
            type: "feature_card",
            settings: {
              image_url: "https://cdn.myshopage.com/27c967b2-512d-43ee-b366-7568d2a3a700/w500.jpg",
              title: "Convenient Setup",
              text: "Standard E26/E27 threaded base screws directly into common fixtures; includes a heavy-duty US switch cord for plug-and-play placement."
            }
          },
          "feat_4": {
            type: "feature_card",
            settings: {
              image_url: "https://cdn.myshopage.com/8dfe030d-f1ec-4a8a-02a4-753863454400/w1000.jpg",
              title: "Versatile Farm Use",
              text: "Perfect for chick brooders, ducklings, piglets, puppies, reptile enclosures, and outdoor coop warming boxes."
            }
          },
          "comp_1": {
            type: "comparison_row",
            settings: {
              feature: "Fire Hazard Safety",
              saker_val: "100% Fireproof Sealed Polymer",
              generic_val: "High Risk (400°F surface burns straw)"
            }
          },
          "comp_2": {
            type: "comparison_row",
            settings: {
              feature: "Temperature Control",
              saker_val: "Automatic Smart Thermostat",
              generic_val: "None (Runs full blast 24/7)"
            }
          },
          "comp_3": {
            type: "comparison_row",
            settings: {
              feature: "Circadian Sleep Health",
              saker_val: "Gentle Low-Lux Ambient Glow",
              generic_val: "Blinding Red Glare (Causes pecking)"
            }
          },
          "comp_4": {
            type: "comparison_row",
            settings: {
              feature: "Water Splash Durability",
              saker_val: "Splash-Proof Sealed Casing",
              generic_val: "Fragile Glass Shatters Instantly"
            }
          },
          "comp_5": {
            type: "comparison_row",
            settings: {
              feature: "Electricity Cost",
              saker_val: "Auto-cycles off (Saves up to 60%)",
              generic_val: "High 250W continuous draw"
            }
          },
          "rev_1": {
            type: "review_card",
            settings: {
              author: "Kim D.",
              verified: true,
              stars: "★★★★★",
              headline: "First season with 100% chick survival!",
              review: "\"I installed this heating lamp in our brooder shed for the winter hatch. With it, the chicks are warm, thriving, and active. The digital temperature display makes it effortless to monitor, and I love that it shuts off automatically once the target warmth is reached.\""
            }
          },
          "rev_2": {
            type: "review_card",
            settings: {
              author: "Marcus V.",
              verified: true,
              stars: "★★★★★",
              headline: "No more sleepless nights worrying about coop fires",
              review: "\"Had a terrifying scare last winter when an old clamp heat lamp slipped into dry pine shavings. Thank God I caught it in time. Swapped everything to Zavelyn® immediately. Cool to the touch exterior, zero fire risk, and the chicks sleep peacefully without pecking.\""
            }
          },
          "rev_3": {
            type: "review_card",
            settings: {
              author: "Sarah L.",
              verified: true,
              stars: "★★★★★",
              headline: "Game-changer for our backyard flock",
              review: "\"The built-in digital thermostat is worth its weight in gold. I set it to 90 degrees and go to bed with complete peace of mind. No more getting up at 2 AM in freezing weather to check the brooder. Highly recommend the 2-pack!\""
            }
          },
          "rev_4": {
            type: "review_card",
            settings: {
              author: "Jason B.",
              verified: true,
              stars: "★★★★★",
              headline: "Great for ducklings and small animals",
              review: "\"Raised two batches of ducklings under this lamp this year. The gentle ambient light lets them sleep normally without the blinding red glare that causes aggression. Super simple screw-in installation and excellent build quality.\""
            }
          },
          "faq_1": {
            type: "faq_item",
            settings: {
              question: "Is this heating lamp safe to use around dry hay and pine shavings?",
              answer: "Yes, 100%! Unlike traditional glass bulbs that reach 400°F+ on the exterior, the Zavelyn® Livestock Lamp features a sealed, fireproof polymer housing that stays cool to the touch. Even if shavings or loose feathers contact the shell, there are no exposed hot filaments or ignition flashpoints."
            }
          },
          "faq_2": {
            type: "faq_item",
            settings: {
              question: "How does the automatic temperature control work?",
              answer: "The lamp features an integrated digital sensor and microcontroller. Simply set your desired temperature (28°C to 35°C / 82°F to 95°F) using the + and - buttons. The heating element automatically suspends heat once the ambient temperature reaches your target and automatically kicks back on when temps dip."
            }
          },
          "faq_3": {
            type: "faq_item",
            settings: {
              question: "Does it screw into a regular light socket?",
              answer: "Yes. It uses a standard E26 / E27 threaded screw base. Each package also includes a heavy-duty US standard switch cord with a toggle switch for convenient placement anywhere in your coop, brooder, or barn."
            }
          },
          "faq_4": {
            type: "faq_item",
            settings: {
              question: "What is your return and guarantee policy?",
              answer: "Every order comes with our 90-Day 100% Satisfaction Money-Back Guarantee. If for any reason you or your flock are not thrilled with its performance, simply contact our support team for a prompt refund."
            }
          }
        },
        block_order: [
          "bundle_2",
          "bundle_1",
          "point_1",
          "point_2",
          "point_3",
          "point_4",
          "feat_1",
          "feat_2",
          "feat_3",
          "feat_4",
          "comp_1",
          "comp_2",
          "comp_3",
          "comp_4",
          "comp_5",
          "rev_1",
          "rev_2",
          "rev_3",
          "rev_4",
          "faq_1",
          "faq_2",
          "faq_3",
          "faq_4"
        ],
        settings: {
          product_title: "Zavelyn® Intelligent Livestock Heating Lamp",
          product_subtitle: "Safe, energy-efficient brooder warmth engineered with an intelligent digital thermostat. Keeps baby chicks, ducklings, piglets, and pets comfortably warm without dangerous fire risks or harsh red glare.",
          main_image_url: "https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg",
          section2_title: "Designed for Better Everyday Livestock Care",
          section2_subtitle: "Practical warmth. Simple controls. Convenient setup."
        }
      }
    },
    order: [
      "heating_lamp_funnel"
    ]
  };
}

async function main() {
  console.log('--- Starting Willa Farm Heating Lamp PDP Build & Upload ---');
  const token = await getAccessToken();

  const liquidContent = generateHeatingLampLiquid();
  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', liquidContent);
  console.log('Saved local Clone-willafarm/theme/sections/heating-lamp-funnel.liquid');

  const jsonContent = JSON.stringify(generateHeatingLampJson(), null, 2);
  fs.writeFileSync('Clone-willafarm/theme/templates/product.sakerplus-livestock-heating-lamp.json', jsonContent);
  console.log('Saved local Clone-willafarm/theme/templates/product.sakerplus-livestock-heating-lamp.json');

  console.log('\nUploading section to Shopify active theme...');
  const upLiquid = await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', liquidContent);
  if (!upLiquid) throw new Error('Failed to upload section');

  console.log('\nUploading JSON template to Shopify active theme...');
  const upJson = await uploadThemeAsset(token, 'templates/product.sakerplus-livestock-heating-lamp.json', jsonContent);
  if (!upJson) throw new Error('Failed to upload JSON template');

  console.log('\n✔ All theme files successfully deployed to Shopify!');
}

main().catch(console.error);
