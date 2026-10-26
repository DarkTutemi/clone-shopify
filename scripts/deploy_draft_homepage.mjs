import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function uploadAsset(token, key, content) {
  console.log(`Uploading ${key} to Draft Theme ${DRAFT_THEME_ID}...`);
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key,
        value: content
      }
    })
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ Failed uploading ${key}:`, err);
    throw new Error(err);
  }
  const data = await res.json();
  console.log(`✔ Uploaded ${key}`);
  return data;
}

// Section definitions
const topBannerLiquid = `{% schema %}
{
  "name": "Zavelyn Top Banner",
  "settings": [
    { "type": "text", "id": "badge_text", "label": "Badge Text", "default": "FLASH SALE" },
    { "type": "text", "id": "main_text", "label": "Main Offer Text", "default": "BUY 1, GET 2ND AT 50% OFF · FREE US DELIVERY OVER $49" },
    { "type": "text", "id": "timer_end", "label": "Timer Label", "default": "Ends Tonight at 11:59PM" }
  ],
  "presets": [{ "name": "Zavelyn Top Banner" }]
}
{% endschema %}

<div class="zv-countdown-banner" id="zvCountdownBanner">
  <span class="zv-banner-tag">{{ section.settings.badge_text }}</span>
  <span>{{ section.settings.main_text }}</span>
  <span class="zv-timer-box">
    <span>⏳</span>
    <span id="zvTimerClock">04:22:15</span>
  </span>
</div>

<script>
  (function() {
    function updateClock() {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = Math.max(0, Math.floor((midnight - now) / 1000));
      const h = String(Math.floor(diff / 3600)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
      const s = String(diff % 60).padStart(2, '0');
      const el = document.getElementById('zvTimerClock');
      if (el) el.textContent = h + ':' + m + ':' + s;
    }
    setInterval(updateClock, 1000);
    updateClock();
  })();
</script>
`;

const heroLiquid = `{% schema %}
{
  "name": "Zavelyn Elixir Hero",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow Text", "default": "★ 2026 ZAVELYN INNOVATIONS · TRUSTED BY 50,000+ HOMES" },
    { "type": "text", "id": "heading", "label": "Main Heading", "default": "Engineered for Heavy Duty.<br><span>Built for Everyday Reliability.</span>" },
    { "type": "textarea", "id": "subhead", "label": "Subheadline", "default": "Stop settling for cheap gear that fails when you need it most. Zavelyn crafts industrial-grade smart gadgets, repair kits, and wellness tools designed to outlast and outperform." },
    { "type": "text", "id": "primary_cta_text", "label": "Primary Button Text", "default": "SHOP BEST SELLERS →" },
    { "type": "url", "id": "primary_cta_link", "label": "Primary Button Link" },
    { "type": "text", "id": "secondary_cta_text", "label": "Secondary Button Text", "default": "EXPLORE ALL INNOVATIONS" },
    { "type": "url", "id": "secondary_cta_link", "label": "Secondary Button Link" }
  ],
  "presets": [{ "name": "Zavelyn Elixir Hero" }]
}
{% endschema %}

<section class="zv-hero-elixir">
  <div class="zv-hero-container">
    <div class="zv-hero-content">
      <div class="zv-hero-eyebrow">{{ section.settings.eyebrow }}</div>
      <h1 class="zv-hero-heading">{{ section.settings.heading }}</h1>
      <p class="zv-hero-subhead">{{ section.settings.subhead }}</p>
      
      <div class="zv-hero-actions">
        {% assign p_link = section.settings.primary_cta_link %}
        {% if p_link == blank %}{% assign p_link = '/collections/best-sellers' %}{% endif %}
        <a href="{{ p_link }}" class="zv-btn-lime">
          {{ section.settings.primary_cta_text }}
        </a>

        {% assign s_link = section.settings.secondary_cta_link %}
        {% if s_link == blank %}{% assign s_link = '/collections/all-products' %}{% endif %}
        <a href="{{ s_link }}" class="zv-btn-ghost">
          {{ section.settings.secondary_cta_text }}
        </a>
      </div>

      <div class="zv-hero-trust">
        <span>🛡️ 60-Night Risk-Free Trial</span>
        <span>·</span>
        <span>⚡ 24-48h US Dispatch</span>
        <span>·</span>
        <span>⭐ 4.9/5 (12,400+ Reviews)</span>
      </div>
    </div>

    <div class="zv-hero-visual">
      <div class="zv-hero-card">
        <img 
          src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/zavelyn-thermoglove-black.jpg?v=1792936861" 
          alt="Zavelyn Featured Innovation" 
          class="zv-hero-img" 
          fetchpriority="high"
          loading="eager"
        >
        <div class="zv-hero-floating-badge">
          <span>🔥</span>
          <span>Featured: Zavelyn ThermoGlove</span>
        </div>
      </div>
    </div>
  </div>
</section>
`;

const tickerLiquid = `{% schema %}
{
  "name": "Zavelyn Ticker Marquee",
  "settings": [],
  "presets": [{ "name": "Zavelyn Ticker Marquee" }]
}
{% endschema %}

<div class="zv-ticker-wrap">
  <div class="zv-ticker-track">
    <div class="zv-ticker-item"><span>⚡</span> FAST 24-48H DISPATCH FROM US HUBS</div>
    <div class="zv-ticker-item"><span>🛡️</span> 60-DAY MONEY-BACK GUARANTEE</div>
    <div class="zv-ticker-item"><span>🛠️</span> INDUSTRIAL-GRADE DURABILITY</div>
    <div class="zv-ticker-item"><span>⭐</span> 4.9/5 RATED OVER 12,400+ REVIEWS</div>
    <div class="zv-ticker-item"><span>💬</span> 24/7 DEDICATED CONCIERGE SUPPORT</div>
    <div class="zv-ticker-item"><span>🔒</span> 256-BIT ENCRYPTED CHECKOUT</div>
    
    <div class="zv-ticker-item"><span>⚡</span> FAST 24-48H DISPATCH FROM US HUBS</div>
    <div class="zv-ticker-item"><span>🛡️</span> 60-DAY MONEY-BACK GUARANTEE</div>
    <div class="zv-ticker-item"><span>🛠️</span> INDUSTRIAL-GRADE DURABILITY</div>
    <div class="zv-ticker-item"><span>⭐</span> 4.9/5 RATED OVER 12,400+ REVIEWS</div>
    <div class="zv-ticker-item"><span>💬</span> 24/7 DEDICATED CONCIERGE SUPPORT</div>
    <div class="zv-ticker-item"><span>🔒</span> 256-BIT ENCRYPTED CHECKOUT</div>
  </div>
</div>
`;

const painSolutionLiquid = `{% schema %}
{
  "name": "Zavelyn Pain & Solution",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Stop Buying Tools That Break.<br><span>Let Zavelyn Take Over.</span>" },
    { "type": "textarea", "id": "subhead", "label": "Subhead", "default": "You don't need another brittle gadget lying dead in your workshop. You need heavy-duty precision engineered to handle real-world tasks effortlessly." }
  ],
  "presets": [{ "name": "Zavelyn Pain & Solution" }]
}
{% endschema %}

<section class="zv-tabs-section">
  <div class="zv-tabs-container">
    <h2 class="zv-tabs-heading">{{ section.settings.heading }}</h2>
    <p class="zv-tabs-sub">{{ section.settings.subhead }}</p>

    <div class="zv-tabs-nav" id="zvTabsNav">
      <button type="button" class="zv-tab-btn active" data-tab="1">Built for Abuse</button>
      <button type="button" class="zv-tab-btn" data-tab="2">Cuts Labor in Half</button>
      <button type="button" class="zv-tab-btn" data-tab="3">Engineered Safety</button>
      <button type="button" class="zv-tab-btn" data-tab="4">60-Day Guarantee</button>
    </div>

    <div class="zv-tabs-content">
      <div class="zv-tab-panel active" id="zvTabPanel1">
        <p><strong>Never fight broken equipment again.</strong> Most consumer tools use cheap pot metals and brittle plastic gears that strip under pressure. Every Zavelyn innovation is constructed from aerospace-grade alloy frames, reinforced steel gears, and industrial-grade thermal polymers engineered to withstand drops, harsh weather, and years of relentless daily use.</p>
      </div>
      <div class="zv-tab-panel" id="zvTabPanel2">
        <p><strong>Get hours of your life back.</strong> Whether you are repairing homestead fences, precision-cutting materials, or staying warm during sub-zero outdoor work, Zavelyn cuts labor time in half. Intelligent automated thermostats, high-frequency ultrasonic oscillation, and ergonomic weight distribution mean you finish faster with zero physical strain.</p>
      </div>
      <div class="zv-tab-panel" id="zvTabPanel3">
        <p><strong>Zero compromises on safety.</strong> Forget exposed incandescent filaments, loose heating elements, or sketchy electrical wiring. Zavelyn implements dual-redundant auto-shutoffs, 100% sealed waterproof housings, and certified low-voltage high-efficiency heating tech tested to meet rigorous US safety standards.</p>
      </div>
      <div class="zv-tab-panel" id="zvTabPanel4">
        <p><strong>Put us to the test completely risk-free.</strong> Try any Zavelyn product on your homestead, jobsite, or home for a full 60 days. If it doesn't outperform any tool you've previously owned, contact our Dallas TX support team for a swift, 100% hassle-free refund. No questions asked.</p>
        <div style="margin-top: 24px; text-align: center;">
          <a href="/collections/best-sellers" class="zv-btn-lime">EXPERIENCE THE ZAVELYN DIFFERENCE →</a>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
  (function() {
    const nav = document.getElementById('zvTabsNav');
    if (!nav) return;
    const btns = nav.querySelectorAll('.zv-tab-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tabNum = btn.getAttribute('data-tab');
        document.querySelectorAll('.zv-tab-panel').forEach(p => p.classList.remove('active'));
        const activePanel = document.getElementById('zvTabPanel' + tabNum);
        if (activePanel) activePanel.classList.add('active');
      });
    });
  })();
</script>
`;

const categoriesLiquid = `{% schema %}
{
  "name": "Zavelyn Categories Grid",
  "settings": [],
  "presets": [{ "name": "Zavelyn Categories Grid" }]
}
{% endschema %}

<section class="zv-cat-grid-section">
  <div class="zv-section-header">
    <h2>Curated Collections</h2>
    <p>Discover specialized innovations engineered for personal wellness, smart home comfort, and heavy-duty reliability.</p>
  </div>

  <div class="zv-cat-cards-grid">
    <!-- Card 1: Best Sellers -->
    <a href="/collections/best-sellers" class="zv-card-item">
      <div class="zv-card-img-wrap">
        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/gravitygliders_hero_su27.jpg?v=1792936450" alt="Best Sellers" loading="lazy">
      </div>
      <div class="zv-card-body">
        <span class="zv-card-badge">★ TOP RATED</span>
        <h3>Best Sellers</h3>
        <p>Customer favorites with verified 4.9-star ratings and proven track records.</p>
        <span class="zv-card-link">Shop Collection →</span>
      </div>
    </a>

    <!-- Card 2: Smart Heated Gear -->
    <a href="/collections/all-products" class="zv-card-item">
      <div class="zv-card-img-wrap">
        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/zavelyn-thermoglove-black.jpg?v=1792936861" alt="Smart Gadgets & Heated Gear" loading="lazy">
      </div>
      <div class="zv-card-body">
        <span class="zv-card-badge">SMART TECH</span>
        <h3>Smart Gadgets & Heated Gear</h3>
        <p>Thermostatic heated gloves, CozyHeat blankets & ultrasonic precision tools.</p>
        <span class="zv-card-link">Discover Gear →</span>
      </div>
    </a>

    <!-- Card 3: Wellness & Personal Care -->
    <a href="/collections/all-products" class="zv-card-item">
      <div class="zv-card-img-wrap">
        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/botanaroots_miracle_oil.jpg?v=1792934891" alt="Personal Care & Wellness" loading="lazy">
      </div>
      <div class="zv-card-body">
        <span class="zv-card-badge">WELLNESS</span>
        <h3>Personal Care & Wellness</h3>
        <p>100% Organic Honduran Batana scalp oil, vFit rejuvenation & sculptwear.</p>
        <span class="zv-card-link">Explore Wellness →</span>
      </div>
    </a>

    <!-- Card 4: Heavy Duty & Farm Tools -->
    <a href="/collections/fence-and-farm" class="zv-card-item">
      <div class="zv-card-img-wrap">
        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/megalifters_hero_excavator.png?v=1792936057" alt="Power & Heavy Duty Tools" loading="lazy">
      </div>
      <div class="zv-card-body">
        <span class="zv-card-badge">HEAVY DUTY</span>
        <h3>Power & Farm Tools</h3>
        <p>High-torque cordless blowers, alloy RC fleets & fence post repair kits.</p>
        <span class="zv-card-link">Shop Heavy Duty →</span>
      </div>
    </a>

    <!-- Card 5: Smart Pet Essentials -->
    <a href="/collections/all-products" class="zv-card-item">
      <div class="zv-card-img-wrap">
        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/selenepets_hero_fountain.jpg?v=1792935435" alt="Smart Pet Essentials" loading="lazy">
      </div>
      <div class="zv-card-body">
        <span class="zv-card-badge">PET ESSENTIALS</span>
        <h3>Smart Pet Essentials</h3>
        <p>Ultra-quiet wireless stainless water fountains & feeder solutions.</p>
        <span class="zv-card-link">Shop Pet Care →</span>
      </div>
    </a>

    <!-- Card 6: Handpan Drums -->
    <a href="/collections/zavelyn-handpans" class="zv-card-item">
      <div class="zv-card-img-wrap">
        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/8_inch_red_mini.webp?v=1792928373" alt="Handpan Drums" loading="lazy">
      </div>
      <div class="zv-card-body">
        <span class="zv-card-badge">ACOUSTIC WELLNESS</span>
        <h3>Handpan & Tongue Drums</h3>
        <p>Hand-tuned 432Hz meditative steel drums for stress relief and musical expression.</p>
        <span class="zv-card-link">Explore Handpans →</span>
      </div>
    </a>
  </div>
</section>
`;

const bestsellersLiquid = `{% schema %}
{
  "name": "Zavelyn Best Sellers",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Popular Zavelyn Best Sellers" },
    { "type": "textarea", "id": "subhead", "label": "Subheadline", "default": "Real customer favorites engineered for reliability, durability, and time-saving efficiency." },
    { "type": "collection", "id": "collection", "label": "Collection" }
  ],
  "presets": [{ "name": "Zavelyn Best Sellers" }]
}
{% endschema %}

{%- assign target_col = collections[section.settings.collection] | default: collections['best-sellers'] | default: collections['all'] -%}

<section class="zv-bestsellers-section">
  <div class="zv-section-header">
    <span class="zv-card-badge" style="display:inline-block; margin-bottom:12px;">★ TOP RATED HARDWARE & GADGETS</span>
    <h2>{{ section.settings.heading }}</h2>
    <p>{{ section.settings.subhead }}</p>
  </div>

  <div class="zv-products-grid">
    {% for product in target_col.products limit: 8 %}
      <div class="zv-product-card">
        <a href="{{ product.url }}" class="zv-pcard-media">
          {% if product.featured_image %}
            <img 
              src="{{ product.featured_image | image_url: width: 600 }}" 
              alt="{{ product.title | escape }}" 
              loading="eager"
              fetchpriority="high"
            >
          {% endif %}
          {% if product.compare_at_price > product.price %}
            {% assign savings = product.compare_at_price | minus: product.price | times: 100.0 | divided_by: product.compare_at_price | round %}
            <span class="zv-pcard-badge">SAVE {{ savings }}%</span>
          {% endif %}
          <span class="zv-pcard-hot">🔥 BEST SELLER</span>
        </a>

        <div class="zv-pcard-info">
          <div class="zv-pcard-stars">
            <span>★★★★★</span>
            <span>4.9</span>
          </div>

          <a href="{{ product.url }}" class="zv-pcard-title">
            {{ product.title }}
          </a>

          <div class="zv-pcard-pricing">
            <span class="zv-price-live">{{ product.price | money }}</span>
            {% if product.compare_at_price > product.price %}
              <span class="zv-price-compare">{{ product.compare_at_price | money }}</span>
            {% endif %}
          </div>

          <button 
            type="button" 
            class="zv-pcard-atc"
            onclick="addZavelynItem('{{ product.selected_or_first_available_variant.id }}')"
          >
            <span>🛍️</span>
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    {% endfor %}
  </div>

  <div style="text-align: center; margin-top: 48px;">
    <a href="/collections/all-products" class="zv-btn-ghost">
      VIEW ALL 83 PRODUCTS →
    </a>
  </div>
</section>

<script>
  function addZavelynItem(variantId) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    })
    .then(r => r.json())
    .then(item => {
      window.location.href = '/cart';
    })
    .catch(err => {
      window.location.href = '/cart';
    });
  }
</script>
`;

const comparisonLiquid = `{% schema %}
{
  "name": "Zavelyn Comparison Table",
  "settings": [],
  "presets": [{ "name": "Zavelyn Comparison Table" }]
}
{% endschema %}

<section class="zv-comparison-section">
  <div class="zv-section-header">
    <h2>Us Vs. Them</h2>
    <p>See why over 50,000+ homeowners choose Zavelyn over generic market alternatives.</p>
  </div>

  <div class="zv-comparison-box">
    <table class="zv-comp-table">
      <thead>
        <tr>
          <th>Standard Features</th>
          <th class="zv-brand-col">Zavelyn Innovations</th>
          <th class="zv-other-col">Generic Knockoffs</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Build Materials</strong></td>
          <td class="zv-brand-col"><span class="zv-check-icon">✔</span> Aerospace Alloy & Reinforced Nylon</td>
          <td class="zv-other-col"><span class="zv-cross-icon">✘</span> Brittle Recycled Plastic</td>
        </tr>
        <tr>
          <td><strong>Performance & Speed</strong></td>
          <td class="zv-brand-col"><span class="zv-check-icon">✔</span> High-Torque Motors & Auto-Thermostat</td>
          <td class="zv-other-col"><span class="zv-cross-icon">✘</span> Weak Output & Slow Operation</td>
        </tr>
        <tr>
          <td><strong>Certified Safety</strong></td>
          <td class="zv-brand-col"><span class="zv-check-icon">✔</span> Multi-Stage Thermal Cutoff & Sealed Housing</td>
          <td class="zv-other-col"><span class="zv-cross-icon">✘</span> Fire Hazards & Exposed Wires</td>
        </tr>
        <tr>
          <td><strong>Risk-Free Guarantee</strong></td>
          <td class="zv-brand-col"><span class="zv-check-icon">✔</span> 60-Day 100% Money-Back Trial</td>
          <td class="zv-other-col"><span class="zv-cross-icon">✘</span> Restrictive 14-Day Or No Returns</td>
        </tr>
        <tr>
          <td><strong>Customer Support</strong></td>
          <td class="zv-brand-col"><span class="zv-check-icon">✔</span> Dedicated US Concierge Team (Dallas, TX)</td>
          <td class="zv-other-col"><span class="zv-cross-icon">✘</span> Unresponsive Chatbots</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
`;

const faqLiquid = `{% schema %}
{
  "name": "Zavelyn Elixir FAQ",
  "settings": [],
  "presets": [{ "name": "Zavelyn Elixir FAQ" }]
}
{% endschema %}

<section class="zv-faq-section">
  <div class="zv-section-header">
    <h2>Everything You're Wondering</h2>
    <p>Straightforward answers to common questions about shipping, warranties, and orders.</p>
  </div>

  <div class="zv-faq-wrap">
    <div class="zv-faq-item">
      <button type="button" class="zv-faq-question" onclick="toggleZvFaq(this)">
        <span>How fast will my order arrive?</span>
        <span class="zv-faq-toggle">+</span>
      </button>
      <div class="zv-faq-answer">
        <p>All orders are processed and verified within 24–48 hours from our US distribution centers. Standard tracked shipping takes 3–5 business days within the United States. You will receive real-time carrier tracking updates via email and SMS as soon as your parcel ships.</p>
      </div>
    </div>

    <div class="zv-faq-item">
      <button type="button" class="zv-faq-question" onclick="toggleZvFaq(this)">
        <span>What is the 60-Day Risk-Free Guarantee?</span>
        <span class="zv-faq-toggle">+</span>
      </button>
      <div class="zv-faq-answer">
        <p>We believe in our products completely. If you are not 100% thrilled with your purchase for any reason within 60 days of delivery, simply reach out to our concierge support team at support@tryzavelyn.com. We will arrange a prepaid return and process a full refund to your original payment method.</p>
      </div>
    </div>

    <div class="zv-faq-item">
      <button type="button" class="zv-faq-question" onclick="toggleZvFaq(this)">
        <span>Do you offer warranty coverage on hardware tools?</span>
        <span class="zv-faq-toggle">+</span>
      </button>
      <div class="zv-faq-answer">
        <p>Yes. Every Zavelyn hardware tool and smart device comes with an automatic 1-Year Comprehensive Manufacturer Warranty covering parts, motors, heating filaments, and workmanship defects.</p>
      </div>
    </div>

    <div class="zv-faq-item">
      <button type="button" class="zv-faq-question" onclick="toggleZvFaq(this)">
        <span>Can I track my shipment in real time?</span>
        <span class="zv-faq-toggle">+</span>
      </button>
      <div class="zv-faq-answer">
        <p>Yes! Simply visit our <a href="/pages/track-order" style="color:var(--zv-text-dark);font-weight:bold;">Track Order Page</a> and enter your tracking number or order confirmation email to see live carrier milestones from USPS, FedEx, UPS, or DHL.</p>
      </div>
    </div>
  </div>
</section>

<script>
  function toggleZvFaq(btn) {
    const item = btn.closest('.zv-faq-item');
    if (item) item.classList.toggle('open');
  }
</script>
`;

async function main() {
  const token = await getAccessToken();

  // 1. Upload CSS
  const css = fs.readFileSync('scripts/zavelyn-elixir.css', 'utf-8');
  await uploadAsset(token, 'assets/zavelyn-elixir.css', css);

  // 2. Upload Sections
  await uploadAsset(token, 'sections/zavelyn-top-banner.liquid', topBannerLiquid);
  await uploadAsset(token, 'sections/zavelyn-hero-elixir.liquid', heroLiquid);
  await uploadAsset(token, 'sections/zavelyn-ticker.liquid', tickerLiquid);
  await uploadAsset(token, 'sections/zavelyn-pain-solution.liquid', painSolutionLiquid);
  await uploadAsset(token, 'sections/zavelyn-categories.liquid', categoriesLiquid);
  await uploadAsset(token, 'sections/zavelyn-bestsellers.liquid', bestsellersLiquid);
  await uploadAsset(token, 'sections/zavelyn-comparison-elixir.liquid', comparisonLiquid);
  await uploadAsset(token, 'sections/zavelyn-faq-elixir.liquid', faqLiquid);

  // 3. Update layout/theme.liquid on Draft Theme to link CSS
  const layoutRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=layout/theme.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const layoutData = await layoutRes.json();
  let layoutVal = layoutData.asset.value;
  if (!layoutVal.includes('zavelyn-elixir.css')) {
    layoutVal = layoutVal.replace('</head>', `  {{ 'zavelyn-elixir.css' | asset_url | stylesheet_tag }}\n</head>`);
    await uploadAsset(token, 'layout/theme.liquid', layoutVal);
  }

  // 4. Update templates/index.json on Draft Theme
  const newIndexJson = {
    "sections": {
      "top_banner": {
        "type": "zavelyn-top-banner",
        "settings": {
          "badge_text": "FLASH SALE",
          "main_text": "BUY 1, GET 2ND AT 50% OFF · FREE US EXPRESS SHIPPING OVER $49",
          "timer_end": "Ends Tonight at 11:59PM"
        }
      },
      "hero": {
        "type": "zavelyn-hero-elixir",
        "settings": {
          "eyebrow": "★ 2026 ZAVELYN INNOVATIONS · TRUSTED BY 50,000+ HOMES",
          "heading": "Engineered for Heavy Duty.<br><span>Built for Everyday Reliability.</span>",
          "subhead": "Stop settling for cheap gear that fails when you need it most. Zavelyn crafts industrial-grade smart gadgets, repair kits, and wellness tools designed to outlast and outperform.",
          "primary_cta_text": "SHOP BEST SELLERS →",
          "secondary_cta_text": "EXPLORE ALL INNOVATIONS"
        }
      },
      "ticker": {
        "type": "zavelyn-ticker",
        "settings": {}
      },
      "categories": {
        "type": "zavelyn-categories",
        "settings": {}
      },
      "bestsellers": {
        "type": "zavelyn-bestsellers",
        "settings": {
          "heading": "Popular Zavelyn Best Sellers",
          "subhead": "Real customer favorites engineered for reliability, durability, and time-saving efficiency.",
          "collection": "best-sellers"
        }
      },
      "pain_solution": {
        "type": "zavelyn-pain-solution",
        "settings": {
          "heading": "Stop Buying Tools That Break.<br><span>Let Zavelyn Take Over.</span>",
          "subhead": "You don't need another brittle gadget lying dead in your workshop. You need heavy-duty precision engineered to handle real-world tasks effortlessly."
        }
      },
      "comparison": {
        "type": "zavelyn-comparison-elixir",
        "settings": {}
      },
      "faq": {
        "type": "zavelyn-faq-elixir",
        "settings": {}
      }
    },
    "order": [
      "top_banner",
      "hero",
      "ticker",
      "categories",
      "bestsellers",
      "pain_solution",
      "comparison",
      "faq"
    ]
  };

  await uploadAsset(token, 'templates/index.json', JSON.stringify(newIndexJson, null, 2));

  console.log('\n======================================================');
  console.log('🎉 HOMEPAGE MILESTONE SUCCESSFULLY DEPLOYED TO DRAFT!');
  console.log(`Draft Theme ID: ${DRAFT_THEME_ID}`);
  console.log(`Preview Link: https://${SHOP}/?preview_theme_id=${DRAFT_THEME_ID}`);
  console.log('======================================================');
}

main();
