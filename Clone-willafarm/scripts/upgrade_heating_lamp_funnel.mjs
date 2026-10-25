import fs from 'fs';
import path from 'path';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

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

async function deleteThemeAsset(token, key) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'X-Shopify-Access-Token': token
    }
  });
  if (res.ok) {
    console.log(`  ✔ Deleted legacy asset: ${key}`);
    return true;
  } else {
    console.log(`  ℹ Delete check ${key}: ${res.status}`);
    return false;
  }
}

function buildHeatingLampLiquid() {
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

<div class="saker-heating-lamp-funnel">
  <!-- Top Trust & Promo Banner -->
  <div class="shl-top-bar">
    <div class="shl-container flex-between">
      <span>🔒 100% Encrypted &amp; Secure Checkout</span>
      <span>⭐ 100,000+ Happy Homesteader Customers</span>
      <span class="desktop-only">⚡ 2026 Upgraded Auto-Thermostat Model</span>
    </div>
  </div>

  <div class="shl-container shl-main-layout">
    <!-- Left Column: Product Showcase & Visual Proof -->
    <div class="shl-visual-column">
      <div class="shl-badge-pill">{{ section.settings.badge_pill | default: '🔥 LIMITED STOCK: ONLY 57 LEFT AT THIS PRICE | 50% OFF' }}</div>
      <h1 class="shl-title">{{ section.settings.product_title | default: 'Zavelyn® Intelligent Auto-Regulating Livestock Heating Lamp' }}</h1>
      <p class="shl-subtitle">{{ section.settings.product_subtitle | default: 'The safe, fireproof brooder heater with built-in digital thermostat. Keeps baby chicks, ducks, piglets, and small livestock comfortably warm without dangerous fire hazards or harsh red glare.' }}</p>

      <div class="shl-gallery">
        <div class="shl-main-image-wrap">
          <img id="shl-main-img" src="{{ section.settings.main_image_url | default: 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg' }}" alt="{{ section.settings.product_title | escape }}" referrerpolicy="no-referrer">
        </div>
        <div class="shl-thumbnails">
          <img class="shl-thumb" src="https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png" onclick="switchShlImg(this.src)" referrerpolicy="no-referrer">
          <img class="shl-thumb active" src="https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg" onclick="switchShlImg(this.src)" referrerpolicy="no-referrer">
          <img class="shl-thumb" src="https://cdn.myshopage.com/8dfe030d-f1ec-4a8a-02a4-753863454400/w1000.jpg" onclick="switchShlImg(this.src)" referrerpolicy="no-referrer">
          <img class="shl-thumb" src="https://cdn.myshopage.com/898406ff-0448-41a5-2440-fd49b2375e00/w1000.jpg" onclick="switchShlImg(this.src)" referrerpolicy="no-referrer">
          <img class="shl-thumb" src="https://cdn.myshopage.com/8f765e2e-fcbd-4199-ab9b-433d4da5c000.jpg" onclick="switchShlImg(this.src)" referrerpolicy="no-referrer">
          <img class="shl-thumb" src="https://cdn.myshopage.com/27c967b2-512d-43ee-b366-7568d2a3a700/w500.jpg" onclick="switchShlImg(this.src)" referrerpolicy="no-referrer">
        </div>
      </div>

      <!-- Key Benefits Bullet Points -->
      <div class="shl-key-points">
        {% assign key_points_count = 0 %}
        {% for block in section.blocks %}
          {% if block.type == 'key_point' %}
            {% assign key_points_count = key_points_count | plus: 1 %}
            <div class="shl-point-item" {{ block.shopify_attributes }}>
              <span class="shl-point-icon">{{ block.settings.icon }}</span>
              <div>
                <strong>{{ block.settings.title }}:</strong> {{ block.settings.text }}
              </div>
            </div>
          {% endif %}
        {% endfor %}
        {% if key_points_count == 0 %}
          <div class="shl-point-item">
            <span class="shl-point-icon">🌡️</span>
            <div><strong>Precision Digital Auto-Thermostat:</strong> Easily adjust temperature between 82°F–95°F (28°C–35°C). Automatically shuts off when target temp is reached and restarts when temps drop.</div>
          </div>
          <div class="shl-point-item">
            <span class="shl-point-icon">🛡️</span>
            <div><strong>100% Sealed Fireproof Polymer Shell:</strong> No fragile glass bulbs or exposed 400°F glowing filaments. Cool-to-touch exterior protects dry hay and bedding from fire risk.</div>
          </div>
          <div class="shl-point-item">
            <span class="shl-point-icon">💨</span>
            <div><strong>Gentle Convection Air Circulation:</strong> Distributes warmth smoothly across the entire brooder. Eliminates dangerous hot spots, cold corners, and chick crowding.</div>
          </div>
          <div class="shl-point-item">
            <span class="shl-point-icon">💡</span>
            <div><strong>Soft LED Ambient Glow (Zero Stress):</strong> Gentle low-lux LED lets you check your flock without disrupting their circadian sleep cycles or causing aggression/pecking.</div>
          </div>
          <div class="shl-point-item">
            <span class="shl-point-icon">🔌</span>
            <div><strong>Standard E26/E27 Threaded Base:</strong> Screws directly into standard sockets. Includes US-standard switch cord for easy plug-and-play installation anywhere.</div>
          </div>
        {% endif %}
      </div>
    </div>

    <!-- Right Column: Interactive Bundle Selector & Order Box -->
    <div class="shl-order-column">
      <div class="shl-order-card">
        <div class="shl-step-header">
          <span class="shl-step-num">Step 1</span>
          <h3>Choose Your Bundle Package</h3>
        </div>

        <div class="shl-bundle-list">
          {% assign bundles_count = 0 %}
          {% for block in section.blocks %}
            {% if block.type == 'bundle_package' %}
              {% assign bundles_count = bundles_count | plus: 1 %}
              <div class="shl-bundle-box {% if forloop.first or block.settings.is_best_seller %}active{% endif %}" id="bundle-box-{{ forloop.index }}" onclick="selectBundle('{{ block.settings.variant_id }}', '{{ block.settings.price }}', '{{ block.settings.old_price }}', 'bundle-box-{{ forloop.index }}', '{{ block.settings.image_url }}')" {{ block.shopify_attributes }}>
                {% if block.settings.badge != blank %}
                  <div class="shl-sales-tag {% unless block.settings.is_best_seller %}secondary{% endunless %}">{{ block.settings.badge }}</div>
                {% endif %}
                <div class="shl-bundle-body">
                  <div class="shl-bundle-radio">
                    <input type="radio" name="shl_bundle" id="radio-bundle-{{ forloop.index }}" {% if forloop.first or block.settings.is_best_seller %}checked{% endif %}>
                  </div>
                  {% if block.settings.image_url != blank %}
                    <div class="shl-bundle-img">
                      <img src="{{ block.settings.image_url }}" alt="{{ block.settings.title | escape }}" referrerpolicy="no-referrer">
                    </div>
                  {% endif %}
                  <div class="shl-bundle-info">
                    <h4>{{ block.settings.title }}</h4>
                    <div class="shl-bundle-includes">
                      {{ block.settings.description }}
                    </div>
                    <div class="shl-price-row">
                      {% if block.settings.old_price != blank %}<span class="shl-old-price">\${{ block.settings.old_price }}</span>{% endif %}
                      <span class="shl-sale-price">\${{ block.settings.price }}</span>
                    </div>
                  </div>
                </div>
              </div>
            {% endif %}
          {% endfor %}
          {% if bundles_count == 0 %}
            <!-- Fallback Bundles -->
            <div class="shl-bundle-box active" id="bundle-box-2" onclick="selectBundle('67930179436729', '89.99', '179.99', 'bundle-box-2', 'https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png')">
              <div class="shl-sales-tag">BEST SELLER • 50% OFF • FREE SHIPPING</div>
              <div class="shl-bundle-body">
                <div class="shl-bundle-radio"><input type="radio" name="shl_bundle" id="radio-bundle-2" checked></div>
                <div class="shl-bundle-img"><img src="https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png" alt="2 Pack" referrerpolicy="no-referrer"></div>
                <div class="shl-bundle-info">
                  <h4>2 Pack (Light + US Switch Cord)</h4>
                  <div class="shl-bundle-includes">
                    <span>✔ 2x Zavelyn® Intelligent Heating Lamps</span><br>
                    <span>✔ 2x US-Standard Heavy-Duty Switch Cords</span><br>
                    <span>✔ Only $44.99/set • Free Express Shipping</span>
                  </div>
                  <div class="shl-price-row">
                    <span class="shl-old-price">$179.99</span>
                    <span class="shl-sale-price">$89.99</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="shl-bundle-box" id="bundle-box-1" onclick="selectBundle('67930179403961', '49.99', '99.99', 'bundle-box-1', 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg')">
              <div class="shl-sales-tag secondary">STARTER PACK • 50% OFF</div>
              <div class="shl-bundle-body">
                <div class="shl-bundle-radio"><input type="radio" name="shl_bundle" id="radio-bundle-1"></div>
                <div class="shl-bundle-img"><img src="https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg" alt="1 Pack" referrerpolicy="no-referrer"></div>
                <div class="shl-bundle-info">
                  <h4>1 Pack (Light + US Switch Cord)</h4>
                  <div class="shl-bundle-includes">
                    <span>✔ 1x Zavelyn® Intelligent Heating Lamp</span><br>
                    <span>✔ 1x US-Standard Heavy-Duty Switch Cord</span><br>
                    <span>✔ Ideal for 1 Brooder / Coop Box</span>
                  </div>
                  <div class="shl-price-row">
                    <span class="shl-old-price">$99.99</span>
                    <span class="shl-sale-price">$49.99</span>
                  </div>
                </div>
              </div>
            </div>
          {% endif %}
        </div>

        <!-- Quantity Selector -->
        <div class="shl-qty-row">
          <label for="shl-qty">Quantity:</label>
          <div class="shl-qty-control">
            <button type="button" onclick="adjustQty(-1)">-</button>
            <input type="number" id="shl-qty" value="1" min="1" max="10" readonly>
            <button type="button" onclick="adjustQty(1)">+</button>
          </div>
        </div>

        <!-- Summary & CTA Button -->
        <div class="shl-cta-wrap">
          <div class="shl-total-row">
            <span>Total Today:</span>
            <span id="shl-total-display">$89.99</span>
          </div>
          <button type="button" id="shl-checkout-btn" class="shl-checkout-btn" onclick="submitHeatingLampOrder()">
            <span class="shl-btn-lock">🔒</span>
            <span class="shl-btn-text">{{ section.settings.cta_btn_text | default: 'COMPLETE SECURE ORDER (50% OFF)' }}</span>
            <span class="shl-btn-arrow">➔</span>
          </button>
          <p class="shl-guarantee-note">🛡️ 90-Day 100% Satisfaction Money-Back Guarantee | Fast Insured Shipping</p>
        </div>

        <!-- Trust Payment Icons -->
        <div class="shl-trust-icons">
          <img src="https://cdn.myshopage.com/32c690d7-b984-40d7-d6a0-62fe13714000.png" alt="Guaranteed Safe Checkout" referrerpolicy="no-referrer">
        </div>
      </div>
    </div>
  </div>

  <!-- Product Features Deep Dive -->
  <div class="shl-features-section">
    <div class="shl-container">
      <div class="shl-section-title">
        <h2>Engineered for Flawless Brooding Performance</h2>
        <p>Why experienced poultry keepers and homesteaders trust Zavelyn® over old-fashioned glass bulbs.</p>
      </div>

      <div class="shl-feature-cards-grid">
        {% assign feat_count = 0 %}
        {% for block in section.blocks %}
          {% if block.type == 'feature_card' %}
            {% assign feat_count = feat_count | plus: 1 %}
            <div class="shl-feature-card" {{ block.shopify_attributes }}>
              <div class="shl-feat-icon">{{ block.settings.icon }}</div>
              <h3>{{ block.settings.title }}</h3>
              <p>{{ block.settings.text }}</p>
            </div>
          {% endif %}
        {% endfor %}
        {% if feat_count == 0 %}
          <div class="shl-feature-card">
            <div class="shl-feat-icon">🔥</div>
            <h3>Zero Fire Hazard</h3>
            <p>Sealed fireproof polymer shell stays cool to the touch. No fragile red glass that shatters when water splashes or loose feathers float by.</p>
          </div>
          <div class="shl-feature-card">
            <div class="shl-feat-icon">📊</div>
            <h3>Precision Temperature</h3>
            <p>Digital LED display lets you calibrate warmth down to the exact degree. Automatically cycles off when target temperature is reached.</p>
          </div>
          <div class="shl-feature-card">
            <div class="shl-feat-icon">🌙</div>
            <h3>Calm Sleep Cycles</h3>
            <p>Provides gentle low-lux light without blinding red glare, dramatically reducing stress, flock aggression, and feather picking.</p>
          </div>
          <div class="shl-feature-card">
            <div class="shl-feat-icon">🔄</div>
            <h3>Universal Compatibility</h3>
            <p>Features a standard E26/E27 threaded screw base. Plugs into any household socket using the included heavy-duty switch cord.</p>
          </div>
        {% endif %}
      </div>
    </div>
  </div>

  <!-- Comparison Table Section -->
  <div class="shl-comparison-section">
    <div class="shl-container">
      <div class="shl-section-title">
        <h2>Zavelyn® vs. Traditional 250W Heat Bulbs</h2>
      </div>

      <div class="shl-table-wrap">
        <table class="shl-comp-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th class="highlight">Zavelyn® Livestock Lamp</th>
              <th>Old 250W Heat Lamps</th>
            </tr>
          </thead>
          <tbody>
            {% assign comp_count = 0 %}
            {% for block in section.blocks %}
              {% if block.type == 'comparison_row' %}
                {% assign comp_count = comp_count | plus: 1 %}
                <tr {{ block.shopify_attributes }}>
                  <td><strong>{{ block.settings.feature }}</strong></td>
                  <td class="highlight-val"><span class="check-green">✔</span> {{ block.settings.saker_val }}</td>
                  <td class="cross-red"><span class="cross-red">✖</span> {{ block.settings.generic_val }}</td>
                </tr>
              {% endif %}
            {% endfor %}
            {% if comp_count == 0 %}
              <tr>
                <td><strong>Fire Hazard Risk</strong></td>
                <td class="highlight-val"><span class="check-green">✔ ZERO RISK</span> (Sealed polymer)</td>
                <td class="cross-red">✖ HIGH RISK (400°F surface temp)</td>
              </tr>
              <tr>
                <td><strong>Temperature Regulation</strong></td>
                <td class="highlight-val"><span class="check-green">✔ Automatic Smart Thermostat</span></td>
                <td class="cross-red">✖ None (Runs hot 24/7)</td>
              </tr>
              <tr>
                <td><strong>Animal Eye Strain</strong></td>
                <td class="highlight-val"><span class="check-green">✔ Gentle Ambient Light</span></td>
                <td class="cross-red">✖ Blinding Red Glare (Causes stress)</td>
              </tr>
              <tr>
                <td><strong>Water Splash Resistance</strong></td>
                <td class="highlight-val"><span class="check-green">✔ Splash-Proof Design</span></td>
                <td class="cross-red">✖ Shatters instantly on contact</td>
              </tr>
              <tr>
                <td><strong>Energy Efficiency</strong></td>
                <td class="highlight-val"><span class="check-green">✔ Saves up to 60% Electricity</span></td>
                <td class="cross-red">✖ Expensive high wattage draw</td>
              </tr>
            {% endif %}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Technical Specifications -->
  <div class="shl-specs-section">
    <div class="shl-container">
      <div class="shl-section-title">
        <h2>Technical Specifications</h2>
      </div>
      <div class="shl-specs-grid">
        {% assign spec_count = 0 %}
        {% for block in section.blocks %}
          {% if block.type == 'spec_item' %}
            {% assign spec_count = spec_count | plus: 1 %}
            <div class="shl-spec-item" {{ block.shopify_attributes }}>
              <strong>{{ block.settings.label }}:</strong> {{ block.settings.value }}
            </div>
          {% endif %}
        {% endfor %}
        {% if spec_count == 0 %}
          <div class="shl-spec-item"><strong>Base Type:</strong> Standard E26 / E27 Screw-In</div>
          <div class="shl-spec-item"><strong>Voltage:</strong> AC 110V - 220V (Worldwide Compatible)</div>
          <div class="shl-spec-item"><strong>Temperature Range:</strong> 28°C - 35°C (82°F - 95°F)</div>
          <div class="shl-spec-item"><strong>Display:</strong> High-Definition Digital LED</div>
          <div class="shl-spec-item"><strong>Shell Material:</strong> High-Density Fireproof Polymer</div>
          <div class="shl-spec-item"><strong>Switch Cord:</strong> Included US Standard Heavy-Duty Cord</div>
        {% endif %}
      </div>
    </div>
  </div>

  <!-- Real Customer Reviews Section -->
  <div class="shl-reviews-section">
    <div class="shl-container">
      <div class="shl-section-title">
        <h2>What Homesteaders &amp; Farmers Are Saying</h2>
        <div class="shl-stars-row">
          ⭐⭐⭐⭐⭐ <span class="shl-rating-score">4.9 / 5.0 Rating (1,480+ Verified Homesteader Reviews)</span>
        </div>
      </div>

      <div class="shl-reviews-grid">
        {% assign rev_count = 0 %}
        {% for block in section.blocks %}
          {% if block.type == 'review_card' %}
            {% assign rev_count = rev_count | plus: 1 %}
            <div class="shl-review-card" {{ block.shopify_attributes }}>
              <div class="shl-review-header">
                <strong>{{ block.settings.author }}</strong>
                {% if block.settings.verified %}<span class="shl-verified-badge">✔ Verified Buyer</span>{% endif %}
              </div>
              <div class="shl-stars">{{ block.settings.stars | default: '⭐⭐⭐⭐⭐' }}</div>
              <p class="shl-review-headline">{{ block.settings.headline }}</p>
              <p class="shl-review-text">{{ block.settings.review }}</p>
            </div>
          {% endif %}
        {% endfor %}
        {% if rev_count == 0 %}
          <div class="shl-review-card">
            <div class="shl-review-header"><strong>Kim D.</strong><span class="shl-verified-badge">✔ Verified Buyer</span></div>
            <div class="shl-stars">⭐⭐⭐⭐⭐</div>
            <p class="shl-review-headline">First season with 100% chick survival!</p>
            <p class="shl-review-text">"I put this Chicken Coop Heaters Lamp in my chicken shed for the winter. With it, the chicks are very warm and active. The digital temperature display makes it so easy to monitor and I love that it shuts off automatically once the target warmth is reached."</p>
          </div>
          <div class="shl-review-card">
            <div class="shl-review-header"><strong>Marcus V.</strong><span class="shl-verified-badge">✔ Verified Buyer</span></div>
            <div class="shl-stars">⭐⭐⭐⭐⭐</div>
            <p class="shl-review-headline">No more sleepless nights worrying about coop fires</p>
            <p class="shl-review-text">"Had a terrifying scare last winter when a clamp heat lamp slipped into dry pine shavings. Thank God I caught it in time. Swapped everything to Zavelyn® lamps immediately. Completely fireproof, cool to touch, and the chicks sleep peacefully without pecking."</p>
          </div>
          <div class="shl-review-card">
            <div class="shl-review-header"><strong>Sarah L.</strong><span class="shl-verified-badge">✔ Verified Buyer</span></div>
            <div class="shl-stars">⭐⭐⭐⭐⭐</div>
            <p class="shl-review-headline">Game-changer for our backyard flock</p>
            <p class="shl-review-text">"The built-in digital thermostat is worth its weight in gold. I set it to 90 degrees and go to bed with complete peace of mind. No more getting up at 2 AM in freezing weather to check the brooder. Highly recommend the 2-pack!"</p>
          </div>
          <div class="shl-review-card">
            <div class="shl-review-header"><strong>Jason B.</strong><span class="shl-verified-badge">✔ Verified Buyer</span></div>
            <div class="shl-stars">⭐⭐⭐⭐⭐</div>
            <p class="shl-review-headline">Great for ducklings and small animals</p>
            <p class="shl-review-text">"Raised two batches of ducklings under this lamp this year. The gentle ambient light lets them sleep normally without the blinding red glare that causes aggression. Super simple screw-in installation and excellent build quality."</p>
          </div>
        {% endif %}
      </div>
    </div>
  </div>

  <!-- Frequently Asked Questions Accordion -->
  <div class="shl-faq-section">
    <div class="shl-container">
      <div class="shl-section-title">
        <h2>Frequently Asked Questions</h2>
      </div>

      <div class="shl-faq-list">
        {% assign faq_count = 0 %}
        {% for block in section.blocks %}
          {% if block.type == 'faq_item' %}
            {% assign faq_count = faq_count | plus: 1 %}
            <details class="shl-faq-item" {{ block.shopify_attributes }}>
              <summary>{{ block.settings.question }}</summary>
              <p>{{ block.settings.answer }}</p>
            </details>
          {% endif %}
        {% endfor %}
        {% if faq_count == 0 %}
          <details class="shl-faq-item">
            <summary>Is this heating lamp safe to use around dry hay and pine shavings?</summary>
            <p>Yes, 100%! Unlike traditional glass bulbs that burn at over 400°F on the surface, the Zavelyn® Livestock Lamp features a sealed, fireproof polymer housing that stays cool to the touch. Even if shavings or dust touch the shell, there are no open filaments or flashpoint temperatures.</p>
          </details>
          <details class="shl-faq-item">
            <summary>How does the automatic temperature control work?</summary>
            <p>The lamp features an integrated digital sensor and microcontroller. Simply set your target temperature (28°C to 35°C / 82°F to 95°F) using the + and - buttons. The lamp automatically suspends heat once the ambient temperature reaches your setting and kicks back on when temps dip.</p>
          </details>
          <details class="shl-faq-item">
            <summary>Does it screw into a regular light socket?</summary>
            <p>Yes. It uses a standard E26 / E27 threaded screw base. Each package also includes a heavy-duty US standard switch cord with a toggle switch for convenient placement anywhere in your coop, brooder, or barn.</p>
          </details>
          <details class="shl-faq-item">
            <summary>What is your return and guarantee policy?</summary>
            <p>Every order comes with our 90-Day 100% Satisfaction Money-Back Guarantee. If for any reason you or your flock are not thrilled with its performance, simply reach out to our support team for a prompt refund.</p>
          </details>
        {% endif %}
      </div>
    </div>
  </div>

  <!-- Sticky Bottom Purchase Bar -->
  <div class="shl-sticky-bar">
    <div class="shl-sticky-info">
      <span class="shl-sticky-name">{{ section.settings.product_title | default: 'Zavelyn® Livestock Heating Lamp' }}</span>
      <span class="shl-sticky-price" id="shl-sticky-price-display">$89.99 (2 Pack)</span>
    </div>
    <button type="button" class="shl-sticky-atc-btn" onclick="document.querySelector('.shl-order-column').scrollIntoView({behavior:'smooth'})">
      ORDER NOW ➔
    </button>
  </div>
</div>

<style>
  .saker-heating-lamp-funnel {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #1e293b;
    background-color: #f8fafc;
    line-height: 1.5;
    padding-bottom: 70px;
  }
  .shl-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }
  .shl-top-bar {
    background: #0f172a;
    color: #e2e8f0;
    font-size: 12px;
    font-weight: 600;
    padding: 8px 0;
    text-align: center;
  }
  .flex-between {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .shl-main-layout {
    display: flex;
    gap: 32px;
    margin-top: 24px;
  }
  .shl-visual-column {
    flex: 1 1 55%;
  }
  .shl-order-column {
    flex: 1 1 45%;
  }

  .shl-badge-pill {
    display: inline-block;
    background: #fee2e2;
    color: #dc2626;
    font-size: 11px;
    font-weight: 800;
    padding: 4px 12px;
    border-radius: 9999px;
    margin-bottom: 12px;
  }
  .shl-title {
    font-size: 26px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.3;
    margin: 0 0 10px 0;
  }
  .shl-subtitle {
    font-size: 14px;
    color: #475569;
    margin: 0 0 18px 0;
  }

  .shl-gallery {
    margin-bottom: 24px;
  }
  .shl-main-image-wrap {
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 16px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    border: 1px solid #e2e8f0;
    margin-bottom: 12px;
  }
  .shl-main-image-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .shl-thumbnails {
    display: flex;
    gap: 8px;
    overflow-x: auto;
  }
  .shl-thumb {
    width: 68px;
    height: 68px;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid transparent;
    cursor: pointer;
    background: #ffffff;
    transition: border-color 0.2s;
  }
  .shl-thumb.active {
    border-color: #4c9a95;
  }

  .shl-key-points {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }
  .shl-point-item {
    display: flex;
    gap: 12px;
    margin-bottom: 14px;
    font-size: 13px;
    color: #334155;
    line-height: 1.45;
  }
  .shl-point-item:last-child {
    margin-bottom: 0;
  }
  .shl-point-icon {
    font-size: 18px;
    flex-shrink: 0;
  }
  .shl-point-item strong {
    color: #0f172a;
  }

  .shl-order-card {
    background: #ffffff;
    border: 2px solid #4c9a95;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(76, 154, 149, 0.12);
  }
  .shl-step-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f1f5f9;
  }
  .shl-step-num {
    background: #4c9a95;
    color: #ffffff;
    font-size: 12px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 6px;
  }
  .shl-step-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
  }

  .shl-bundle-box {
    border: 2px solid #cbd5e1;
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 14px;
    position: relative;
    cursor: pointer;
    background: #f8fafc;
    transition: all 0.2s ease;
  }
  .shl-bundle-box.active {
    border-color: #4c9a95;
    background: #f0fdf4;
    box-shadow: 0 4px 12px rgba(76, 154, 149, 0.15);
  }
  .shl-sales-tag {
    position: absolute;
    top: -10px;
    right: 14px;
    background: #dc2626;
    color: #ffffff;
    font-size: 10px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 6px;
    letter-spacing: 0.5px;
  }
  .shl-sales-tag.secondary {
    background: #475569;
  }
  .shl-bundle-body {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .shl-bundle-radio input {
    width: 18px;
    height: 18px;
    accent-color: #4c9a95;
  }
  .shl-bundle-img img {
    width: 58px;
    height: 58px;
    object-fit: cover;
    border-radius: 8px;
    background: #ffffff;
  }
  .shl-bundle-info {
    flex: 1;
  }
  .shl-bundle-info h4 {
    margin: 0 0 4px 0;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
  }
  .shl-bundle-includes {
    font-size: 12px;
    color: #475569;
    line-height: 1.4;
  }
  .shl-price-row {
    margin-top: 6px;
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .shl-old-price {
    font-size: 12px;
    text-decoration: line-through;
    color: #94a3b8;
  }
  .shl-sale-price {
    font-size: 18px;
    font-weight: 900;
    color: #dc2626;
  }

  .shl-qty-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 18px 0;
    padding: 12px 14px;
    background: #f8fafc;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
  }
  .shl-qty-row label {
    font-size: 14px;
    font-weight: 700;
  }
  .shl-qty-control {
    display: flex;
    align-items: center;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    overflow: hidden;
    background: #ffffff;
  }
  .shl-qty-control button {
    border: none;
    background: #f1f5f9;
    padding: 6px 14px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
  }
  .shl-qty-control input {
    width: 36px;
    text-align: center;
    border: none;
    font-weight: 700;
    outline: none;
  }

  .shl-cta-wrap {
    margin-top: 18px;
  }
  .shl-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .shl-total-row span:last-child {
    font-size: 24px;
    font-weight: 900;
    color: #dc2626;
  }
  .shl-checkout-btn {
    width: 100%;
    background: #4c9a95;
    color: #ffffff;
    border: none;
    padding: 16px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(76, 154, 149, 0.4);
    transition: transform 0.15s, background 0.15s;
  }
  .shl-checkout-btn:hover {
    background: #3d817d;
    transform: translateY(-1px);
  }
  .shl-guarantee-note {
    font-size: 11px;
    color: #64748b;
    text-align: center;
    margin-top: 10px;
  }
  .shl-trust-icons {
    margin-top: 14px;
    text-align: center;
  }
  .shl-trust-icons img {
    max-width: 100%;
    height: auto;
  }

  .shl-features-section {
    background: #ffffff;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    padding: 48px 0;
    margin-top: 48px;
  }
  .shl-section-title {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 36px auto;
  }
  .shl-section-title h2 {
    font-size: 24px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 8px 0;
  }
  .shl-section-title p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }
  .shl-feature-cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  .shl-feature-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px;
    text-align: center;
  }
  .shl-feat-icon {
    font-size: 28px;
    margin-bottom: 10px;
  }
  .shl-feature-card h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }
  .shl-feature-card p {
    font-size: 13px;
    color: #64748b;
    margin: 0;
  }

  .shl-comparison-section {
    padding: 48px 0;
  }
  .shl-table-wrap {
    max-width: 800px;
    margin: 0 auto;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #cbd5e1;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  }
  .shl-comp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: left;
  }
  .shl-comp-table th, .shl-comp-table td {
    padding: 14px 18px;
    border-bottom: 1px solid #e2e8f0;
  }
  .shl-comp-table th {
    background: #f1f5f9;
    font-weight: 700;
  }
  .shl-comp-table th.highlight, .shl-comp-table td.highlight-val {
    background: #f0fdf4;
    color: #15803d;
    font-weight: 700;
  }
  .check-green { color: #16a34a; font-weight: 800; }
  .cross-red { color: #dc2626; font-weight: 800; }

  .shl-specs-section {
    background: #ffffff;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    padding: 40px 0;
  }
  .shl-specs-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    max-width: 900px;
    margin: 0 auto;
  }
  .shl-spec-item {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 16px;
    font-size: 13px;
  }

  .shl-reviews-section {
    padding: 48px 0;
  }
  .shl-stars-row {
    font-size: 14px;
    color: #f59e0b;
    margin-top: 8px;
  }
  .shl-rating-score {
    color: #334155;
    font-weight: 600;
  }
  .shl-reviews-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  .shl-review-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }
  .shl-review-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  .shl-verified-badge {
    color: #16a34a;
    font-size: 11px;
    font-weight: 700;
  }
  .shl-review-headline {
    font-weight: 700;
    font-size: 14px;
    margin: 8px 0 6px 0;
  }
  .shl-review-text {
    font-size: 13px;
    color: #475569;
    line-height: 1.5;
    margin: 0;
  }

  .shl-faq-section {
    background: #ffffff;
    border-top: 1px solid #e2e8f0;
    padding: 48px 0;
  }
  .shl-faq-list {
    max-width: 800px;
    margin: 0 auto;
  }
  .shl-faq-item {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    margin-bottom: 12px;
    padding: 14px 18px;
    background: #f8fafc;
  }
  .shl-faq-item summary {
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
  }
  .shl-faq-item p {
    font-size: 13px;
    color: #475569;
    margin: 10px 0 0 0;
    line-height: 1.5;
  }

  .shl-sticky-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    border-top: 1px solid #cbd5e1;
    padding: 10px 18px;
    box-shadow: 0 -4px 15px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 99999;
  }
  .shl-sticky-name {
    font-weight: 700;
    font-size: 13px;
    color: #0f172a;
    display: block;
  }
  .shl-sticky-price {
    font-size: 13px;
    color: #dc2626;
    font-weight: 700;
    display: block;
  }
  .shl-sticky-atc-btn {
    background: #4c9a95;
    color: #ffffff;
    border: none;
    padding: 10px 22px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
  }

  @media (max-width: 991px) {
    .shl-main-layout {
      flex-direction: column;
    }
    .shl-feature-cards-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .shl-reviews-grid {
      grid-template-columns: 1fr;
    }
    .shl-specs-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<script>
  let currentVariantId = '67930179436729'; // 2 Pack default
  let currentUnitPrice = 89.99;
  let currentPackName = '2 Pack';
  let currentQty = 1;

  function switchShlImg(src) {
    const main = document.getElementById('shl-main-img');
    if (main && src) main.src = src;
    document.querySelectorAll('.shl-thumb').forEach(t => {
      t.classList.toggle('active', t.src === src);
    });
  }

  function selectBundle(variantId, price, oldPrice, boxId, imgSrc) {
    currentVariantId = variantId;
    currentUnitPrice = parseFloat(price);
    currentPackName = boxId.includes('1') ? '1 Pack' : '2 Pack';

    document.querySelectorAll('.shl-bundle-box').forEach(b => b.classList.remove('active'));
    const box = document.getElementById(boxId);
    if (box) {
      box.classList.add('active');
      const rad = box.querySelector('input[type="radio"]');
      if (rad) rad.checked = true;
    }

    if (imgSrc) switchShlImg(imgSrc);
    updateTotalDisplay();
  }

  function adjustQty(delta) {
    currentQty = Math.max(1, Math.min(10, currentQty + delta));
    const el = document.getElementById('shl-qty');
    if (el) el.value = currentQty;
    updateTotalDisplay();
  }

  function updateTotalDisplay() {
    const total = (currentUnitPrice * currentQty).toFixed(2);
    const totEl = document.getElementById('shl-total-display');
    if (totEl) totEl.innerText = '$' + total;
    const stkEl = document.getElementById('shl-sticky-price-display');
    if (stkEl) stkEl.innerText = '$' + total + ' (' + currentPackName + ')';
  }

  async function submitHeatingLampOrder() {
    const btn = document.getElementById('shl-checkout-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Processing Order...</span>';
    }

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: currentVariantId,
            quantity: currentQty
          }]
        })
      });

      if (res.ok) {
        window.location.href = '/checkout';
      } else {
        window.location.href = '/cart/' + currentVariantId + ':' + currentQty;
      }
    } catch (e) {
      window.location.href = '/cart/' + currentVariantId + ':' + currentQty;
    }
  }
</script>

{% schema %}
{
  "name": "Heating Lamp Funnel",
  "settings": [
    {
      "type": "text",
      "id": "badge_pill",
      "label": "Top Badge Text",
      "default": "🔥 LIMITED STOCK: ONLY 57 LEFT AT THIS PRICE | 50% OFF"
    },
    {
      "type": "text",
      "id": "product_title",
      "label": "Product Title",
      "default": "Zavelyn® Intelligent Auto-Regulating Livestock Heating Lamp"
    },
    {
      "type": "textarea",
      "id": "product_subtitle",
      "label": "Product Subtitle",
      "default": "The safe, fireproof brooder heater with built-in digital thermostat. Keeps baby chicks, ducks, piglets, and small livestock comfortably warm without dangerous fire hazards or harsh red glare."
    },
    {
      "type": "text",
      "id": "main_image_url",
      "label": "Main Image URL",
      "default": "https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg"
    },
    {
      "type": "text",
      "id": "cta_btn_text",
      "label": "CTA Button Text",
      "default": "COMPLETE SECURE ORDER (50% OFF)"
    }
  ],
  "blocks": [
    {
      "type": "bundle_package",
      "name": "Bundle Package Card",
      "settings": [
        {
          "type": "text",
          "id": "badge",
          "label": "Sales Tag Badge",
          "default": "BEST SELLER • 50% OFF • FREE SHIPPING"
        },
        {
          "type": "checkbox",
          "id": "is_best_seller",
          "label": "Highlight as Best Seller",
          "default": false
        },
        {
          "type": "text",
          "id": "title",
          "label": "Bundle Title",
          "default": "2 Pack (Light + US Switch Cord)"
        },
        {
          "type": "textarea",
          "id": "description",
          "label": "Includes Description (HTML)",
          "default": "<span>✔ 2x Zavelyn® Intelligent Heating Lamps</span><br><span>✔ 2x US-Standard Heavy-Duty Switch Cords</span><br><span>✔ Only $44.99/set • Free Express Shipping</span>"
        },
        {
          "type": "text",
          "id": "variant_id",
          "label": "Shopify Variant ID",
          "default": "67930179436729"
        },
        {
          "type": "text",
          "id": "price",
          "label": "Active Price ($)",
          "default": "89.99"
        },
        {
          "type": "text",
          "id": "old_price",
          "label": "Compare Price ($)",
          "default": "179.99"
        },
        {
          "type": "text",
          "id": "image_url",
          "label": "Image URL",
          "default": "https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png"
        }
      ]
    },
    {
      "type": "key_point",
      "name": "Key Benefit Point",
      "settings": [
        {
          "type": "text",
          "id": "icon",
          "label": "Emoji Icon",
          "default": "🌡️"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Benefit Headline",
          "default": "Precision Digital Auto-Thermostat"
        },
        {
          "type": "textarea",
          "id": "text",
          "label": "Benefit Description",
          "default": "Easily adjust temperature between 82°F–95°F (28°C–35°C). Automatically shuts off when target temp is reached and restarts when temps drop."
        }
      ]
    },
    {
      "type": "feature_card",
      "name": "Deep Dive Feature Card",
      "settings": [
        {
          "type": "text",
          "id": "icon",
          "label": "Emoji Icon",
          "default": "🔥"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Feature Title",
          "default": "Zero Fire Hazard"
        },
        {
          "type": "textarea",
          "id": "text",
          "label": "Feature Description",
          "default": "Sealed fireproof polymer shell stays cool to the touch. No fragile red glass that shatters when water splashes or loose feathers float by."
        }
      ]
    },
    {
      "type": "comparison_row",
      "name": "Comparison Row",
      "settings": [
        {
          "type": "text",
          "id": "feature",
          "label": "Feature Name",
          "default": "Fire Hazard Risk"
        },
        {
          "type": "text",
          "id": "saker_val",
          "label": "Zavelyn® Value",
          "default": "ZERO RISK (Sealed polymer)"
        },
        {
          "type": "text",
          "id": "generic_val",
          "label": "Old Heat Lamps Value",
          "default": "HIGH RISK (400°F surface temp)"
        }
      ]
    },
    {
      "type": "spec_item",
      "name": "Technical Specification",
      "settings": [
        {
          "type": "text",
          "id": "label",
          "label": "Spec Label",
          "default": "Base Type"
        },
        {
          "type": "text",
          "id": "value",
          "label": "Spec Value",
          "default": "Standard E26 / E27 Screw-In"
        }
      ]
    },
    {
      "type": "review_card",
      "name": "Customer Review Card",
      "settings": [
        {
          "type": "text",
          "id": "author",
          "label": "Customer Name",
          "default": "Kim D."
        },
        {
          "type": "checkbox",
          "id": "verified",
          "label": "Verified Buyer Badge",
          "default": true
        },
        {
          "type": "text",
          "id": "stars",
          "label": "Stars Rating",
          "default": "⭐⭐⭐⭐⭐"
        },
        {
          "type": "text",
          "id": "headline",
          "label": "Review Headline",
          "default": "First season with 100% chick survival!"
        },
        {
          "type": "textarea",
          "id": "review",
          "label": "Review Content",
          "default": "I put this Chicken Coop Heaters Lamp in my chicken shed for the winter. With it, the chicks are very warm and active."
        }
      ]
    },
    {
      "type": "faq_item",
      "name": "FAQ Item",
      "settings": [
        {
          "type": "text",
          "id": "question",
          "label": "Question",
          "default": "Is this heating lamp safe to use around dry hay and pine shavings?"
        },
        {
          "type": "textarea",
          "id": "answer",
          "label": "Answer",
          "default": "Yes, 100%! Unlike traditional glass bulbs that burn at over 400°F on the surface, the Zavelyn® Livestock Lamp features a sealed, fireproof polymer housing that stays cool to the touch."
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Heating Lamp Funnel"
    }
  ]
}
{% endschema %}
`;
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token. Upgrading Heating Lamp Funnel section & JSON template...');

  // 1. Upload upgraded heating-lamp-funnel.liquid with full schema & blocks
  const sectionContent = buildHeatingLampLiquid();
  await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', sectionContent);

  // 2. Upload modern OS 2.0 JSON template templates/product.sakerplus-livestock-heating-lamp.json
  const productJson = {
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
              description: "<span>✔ 2x Zavelyn® Intelligent Heating Lamps</span><br><span>✔ 2x US-Standard Heavy-Duty Switch Cords</span><br><span>✔ Only $44.99/set • Free Express Shipping</span>",
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
              description: "<span>✔ 1x Zavelyn® Intelligent Heating Lamp</span><br><span>✔ 1x US-Standard Heavy-Duty Switch Cord</span><br><span>✔ Ideal for 1 Brooder / Coop Box</span>",
              variant_id: "67930179403961",
              price: "49.99",
              old_price: "99.99",
              image_url: "https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg"
            }
          },
          "point_1": {
            type: "key_point",
            settings: {
              icon: "🌡️",
              title: "Precision Digital Auto-Thermostat",
              text: "Easily adjust temperature between 82°F–95°F (28°C–35°C). Automatically shuts off when target temp is reached and restarts when temps drop."
            }
          },
          "point_2": {
            type: "key_point",
            settings: {
              icon: "🛡️",
              title: "100% Sealed Fireproof Polymer Shell",
              text: "No fragile glass bulbs or exposed 400°F glowing filaments. Cool-to-touch exterior protects dry hay and bedding from fire risk."
            }
          },
          "point_3": {
            type: "key_point",
            settings: {
              icon: "💨",
              title: "Gentle Convection Air Circulation",
              text: "Distributes warmth smoothly across the entire brooder. Eliminates dangerous hot spots, cold corners, and chick crowding."
            }
          },
          "point_4": {
            type: "key_point",
            settings: {
              icon: "💡",
              title: "Soft LED Ambient Glow (Zero Stress)",
              text: "Gentle low-lux LED lets you check your flock without disrupting their circadian sleep cycles or causing aggression/pecking."
            }
          },
          "point_5": {
            type: "key_point",
            settings: {
              icon: "🔌",
              title: "Standard E26/E27 Threaded Base",
              text: "Screws directly into standard sockets. Includes US-standard switch cord for easy plug-and-play installation anywhere."
            }
          },
          "feat_1": {
            type: "feature_card",
            settings: {
              icon: "🔥",
              title: "Zero Fire Hazard",
              text: "Sealed fireproof polymer shell stays cool to the touch. No fragile red glass that shatters when water splashes or loose feathers float by."
            }
          },
          "feat_2": {
            type: "feature_card",
            settings: {
              icon: "📊",
              title: "Precision Temperature",
              text: "Digital LED display lets you calibrate warmth down to the exact degree. Automatically cycles off when target temperature is reached."
            }
          },
          "feat_3": {
            type: "feature_card",
            settings: {
              icon: "🌙",
              title: "Calm Sleep Cycles",
              text: "Provides gentle low-lux light without blinding red glare, dramatically reducing stress, flock aggression, and feather picking."
            }
          },
          "feat_4": {
            type: "feature_card",
            settings: {
              icon: "🔄",
              title: "Universal Compatibility",
              text: "Features a standard E26/E27 threaded screw base. Plugs into any household socket using the included heavy-duty switch cord."
            }
          },
          "comp_1": {
            type: "comparison_row",
            settings: {
              feature: "Fire Hazard Risk",
              saker_val: "ZERO RISK (Sealed polymer)",
              generic_val: "HIGH RISK (400°F surface temp)"
            }
          },
          "comp_2": {
            type: "comparison_row",
            settings: {
              feature: "Temperature Regulation",
              saker_val: "Automatic Smart Thermostat",
              generic_val: "None (Runs hot 24/7)"
            }
          },
          "comp_3": {
            type: "comparison_row",
            settings: {
              feature: "Animal Eye Strain",
              saker_val: "Gentle Ambient Light",
              generic_val: "Blinding Red Glare (Causes stress)"
            }
          },
          "comp_4": {
            type: "comparison_row",
            settings: {
              feature: "Water Splash Resistance",
              saker_val: "Splash-Proof Design",
              generic_val: "Shatters instantly on contact"
            }
          },
          "comp_5": {
            type: "comparison_row",
            settings: {
              feature: "Energy Efficiency",
              saker_val: "Saves up to 60% Electricity",
              generic_val: "Expensive high wattage draw"
            }
          },
          "spec_1": { type: "spec_item", settings: { label: "Base Type", value: "Standard E26 / E27 Screw-In" } },
          "spec_2": { type: "spec_item", settings: { label: "Voltage", value: "AC 110V - 220V (Worldwide Compatible)" } },
          "spec_3": { type: "spec_item", settings: { label: "Temperature Range", value: "28°C - 35°C (82°F - 95°F)" } },
          "spec_4": { type: "spec_item", settings: { label: "Display", value: "High-Definition Digital LED" } },
          "spec_5": { type: "spec_item", settings: { label: "Shell Material", value: "High-Density Fireproof Polymer" } },
          "spec_6": { type: "spec_item", settings: { label: "Switch Cord", value: "Included US Standard Heavy-Duty Cord" } },
          "rev_1": {
            type: "review_card",
            settings: {
              author: "Kim D.",
              verified: true,
              stars: "⭐⭐⭐⭐⭐",
              headline: "First season with 100% chick survival!",
              review: "\"I put this Chicken Coop Heaters Lamp in my chicken shed for the winter. With it, the chicks are very warm and active. The digital temperature display makes it so easy to monitor and I love that it shuts off automatically once the target warmth is reached.\""
            }
          },
          "rev_2": {
            type: "review_card",
            settings: {
              author: "Marcus V.",
              verified: true,
              stars: "⭐⭐⭐⭐⭐",
              headline: "No more sleepless nights worrying about coop fires",
              review: "\"Had a terrifying scare last winter when a clamp heat lamp slipped into dry pine shavings. Thank God I caught it in time. Swapped everything to Zavelyn® lamps immediately. Completely fireproof, cool to touch, and the chicks sleep peacefully without pecking.\""
            }
          },
          "rev_3": {
            type: "review_card",
            settings: {
              author: "Sarah L.",
              verified: true,
              stars: "⭐⭐⭐⭐⭐",
              headline: "Game-changer for our backyard flock",
              review: "\"The built-in digital thermostat is worth its weight in gold. I set it to 90 degrees and go to bed with complete peace of mind. No more getting up at 2 AM in freezing weather to check the brooder. Highly recommend the 2-pack!\""
            }
          },
          "rev_4": {
            type: "review_card",
            settings: {
              author: "Jason B.",
              verified: true,
              stars: "⭐⭐⭐⭐⭐",
              headline: "Great for ducklings and small animals",
              review: "\"Raised two batches of ducklings under this lamp this year. The gentle ambient light lets them sleep normally without the blinding red glare that causes aggression. Super simple screw-in installation and excellent build quality.\""
            }
          },
          "faq_1": {
            type: "faq_item",
            settings: {
              question: "Is this heating lamp safe to use around dry hay and pine shavings?",
              answer: "Yes, 100%! Unlike traditional glass bulbs that burn at over 400°F on the surface, the Zavelyn® Livestock Lamp features a sealed, fireproof polymer housing that stays cool to the touch. Even if shavings or dust touch the shell, there are no open filaments or flashpoint temperatures."
            }
          },
          "faq_2": {
            type: "faq_item",
            settings: {
              question: "How does the automatic temperature control work?",
              answer: "The lamp features an integrated digital sensor and microcontroller. Simply set your target temperature (28°C to 35°C / 82°F to 95°F) using the + and - buttons. The lamp automatically suspends heat once the ambient temperature reaches your setting and kicks back on when temps dip."
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
              answer: "Every order comes with our 90-Day 100% Satisfaction Money-Back Guarantee. If for any reason you or your flock are not thrilled with its performance, simply reach out to our support team for a prompt refund."
            }
          }
        },
        block_order: [
          "bundle_2", "bundle_1",
          "point_1", "point_2", "point_3", "point_4", "point_5",
          "feat_1", "feat_2", "feat_3", "feat_4",
          "comp_1", "comp_2", "comp_3", "comp_4", "comp_5",
          "spec_1", "spec_2", "spec_3", "spec_4", "spec_5", "spec_6",
          "rev_1", "rev_2", "rev_3", "rev_4",
          "faq_1", "faq_2", "faq_3", "faq_4"
        ],
        settings: {
          badge_pill: "🔥 LIMITED STOCK: ONLY 57 LEFT AT THIS PRICE | 50% OFF",
          product_title: "Zavelyn® Intelligent Auto-Regulating Livestock Heating Lamp",
          product_subtitle: "The safe, fireproof brooder heater with built-in digital thermostat. Keeps baby chicks, ducks, piglets, and small livestock comfortably warm without dangerous fire hazards or harsh red glare."
        }
      }
    },
    order: ["heating_lamp_funnel"]
  };

  await uploadThemeAsset(token, 'templates/product.sakerplus-livestock-heating-lamp.json', JSON.stringify(productJson, null, 2));

  // 3. Remove legacy .liquid template so Shopify uses the OS 2.0 .json template
  await deleteThemeAsset(token, 'templates/product.sakerplus-livestock-heating-lamp.liquid');

  console.log('✔ Heating Lamp Funnel upgraded to OS 2.0 with rich blocks and dynamic section support!');
}

main().catch(console.error);
