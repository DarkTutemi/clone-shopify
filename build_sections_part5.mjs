import fs from 'fs';
import path from 'path';

const SECTIONS_DIR = 'h:/Shopify-Clone/Clone-earthlyderm/sections';

// 13. earthly-pdp-main.liquid
const pdpMainLiquid = `
{% schema %}
{
  "name": "Earthly PDP Main",
  "settings": []
}
{% endschema %}

<div class="earthly-pdp-container">
  <div class="earthly-pdp-grid">
    <!-- Gallery Column -->
    <div class="pdp-gallery-col">
      <div class="pdp-main-image-wrapper">
        <img id="pdpMainImage" src="{{ product.featured_image | image_url: width: 1000 }}" alt="{{ product.title }}" class="pdp-main-image">
      </div>
      <div class="pdp-thumbnails">
        {% for image in product.images %}
          <button type="button" class="pdp-thumb-btn {% if forloop.first %}active{% endif %}" onclick="switchPdpImage(this, '{{ image | image_url: width: 1000 }}')">
            <img src="{{ image | image_url: width: 150 }}" alt="{{ product.title }}" class="pdp-thumb-img">
          </button>
        {% endfor %}
      </div>
    </div>

    <!-- Buy Box Column -->
    <div class="pdp-buybox-col">
      <div class="pdp-badge-wrapper">
        <span class="pdp-top-badge">ORGANIC FORMULA</span>
      </div>

      <h1 class="pdp-title">{{ product.title }}</h1>

      <div class="pdp-rating-row">
        <span class="stars">★★★★★</span>
        <span class="score">4.9</span>
        <span class="count">(18,400+ reviews)</span>
      </div>

      <div class="pdp-price-row">
        <span class="pdp-current-price" id="pdpCurrentPrice">{{ product.selected_or_first_available_variant.price | money }}</span>
        {% if product.selected_or_first_available_variant.compare_at_price > product.selected_or_first_available_variant.price %}
          <span class="pdp-compare-price" id="pdpComparePrice">{{ product.selected_or_first_available_variant.compare_at_price | money }}</span>
          {% assign save_val = product.selected_or_first_available_variant.compare_at_price | minus: product.selected_or_first_available_variant.price %}
          <span class="pdp-save-badge" id="pdpSaveBadge">SAVE {{ save_val | money }}</span>
        {% else %}
          <span class="pdp-compare-price hidden" id="pdpComparePrice"></span>
          <span class="pdp-save-badge hidden" id="pdpSaveBadge"></span>
        {% endif %}
      </div>

      <!-- Bundle Selection Cards -->
      <div class="pdp-bundles-section">
        <label class="pdp-section-label">SELECT BUNDLE & SAVE:</label>
        <div class="pdp-bundle-options">
          {% for variant in product.variants %}
            <div class="pdp-bundle-card {% if forloop.first %}active{% endif %}" onclick="selectPdpBundle(this, '{{ variant.id }}', '{{ variant.price | money }}', '{% if variant.compare_at_price > variant.price %}{{ variant.compare_at_price | money }}{% endif %}', '{% if variant.compare_at_price > variant.price %}{% assign v_save = variant.compare_at_price | minus: variant.price %}{{ v_save | money }}{% endif %}')">
              {% if forloop.index == 2 %}
                <span class="bundle-pill">MOST POPULAR</span>
              {% elsif forloop.index == 3 %}
                <span class="bundle-pill best-value">BEST VALUE</span>
              {% endif %}
              <div class="bundle-left">
                <input type="radio" name="pdp_variant" value="{{ variant.id }}" {% if forloop.first %}checked{% endif %} class="bundle-radio">
                <span class="bundle-name">{{ variant.title }}</span>
              </div>
              <div class="bundle-right">
                <span class="bundle-price">{{ variant.price | money }}</span>
                {% if variant.compare_at_price > variant.price %}
                  <span class="bundle-compare">{{ variant.compare_at_price | money }}</span>
                {% endif %}
              </div>
            </div>
          {% endfor %}
        </div>
      </div>

      <!-- ATC Button -->
      <div class="pdp-atc-wrapper">
        <input type="hidden" id="selectedVariantId" value="{{ product.selected_or_first_available_variant.id }}">
        <button type="button" class="pdp-atc-btn" id="pdpAtcButton" onclick="addPdpToCart()">
          ADD TO CART • <span id="pdpBtnPrice">{{ product.selected_or_first_available_variant.price | money }}</span>
        </button>
      </div>

      <!-- Trust Badges -->
      <div class="pdp-trust-grid">
        <div class="trust-item">
          <span class="t-icon">🌿</span>
          <span class="t-text">100% Raw Organic</span>
        </div>
        <div class="trust-item">
          <span class="t-icon">⚡</span>
          <span class="t-text">Fast 2-4 Day Delivery</span>
        </div>
        <div class="trust-item">
          <span class="t-icon">🛡️</span>
          <span class="t-text">60-Day Money Back</span>
        </div>
      </div>

      <!-- Tabbed Information -->
      <div class="pdp-accordion-wrapper">
        <div class="pdp-acc-item active">
          <button type="button" class="pdp-acc-btn" onclick="toggleAcc(this)">
            <span>Key Benefits</span>
            <span class="acc-icon">▾</span>
          </button>
          <div class="pdp-acc-content">
            <ul>
              <li>Fades dark spots, sun damage & post-acne marks.</li>
              <li>Promotes an even, glowing skin tone without bleaching.</li>
              <li>Controls excess sebum and prevents future breakouts.</li>
              <li>Gentle enough for daily use on face & body.</li>
            </ul>
          </div>
        </div>

        <div class="pdp-acc-item">
          <button type="button" class="pdp-acc-btn" onclick="toggleAcc(this)">
            <span>How to Use for Best Results</span>
            <span class="acc-icon">▾</span>
          </button>
          <div class="pdp-acc-content">
            <p><strong>Face:</strong> Lather with warm water, apply gently to face in circular motions for 60-90 seconds, then rinse thoroughly. Follow with a natural moisturizer or raw shea butter.</p>
            <p><strong>Body:</strong> Use daily in the shower, focusing on areas with dark marks (underarms, knees, bikini area).</p>
          </div>
        </div>

        <div class="pdp-acc-item">
          <button type="button" class="pdp-acc-btn" onclick="toggleAcc(this)">
            <span>Shipping &amp; 60-Day Guarantee</span>
            <span class="acc-icon">▾</span>
          </button>
          <div class="pdp-acc-content">
            <p>Free tracked US shipping on all orders over $50. If you don't see visibly clearer, brighter skin within 60 days, simply contact our team for a full refund - no hassles.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Deep Authentic Description from Website Sections -->
  <div class="pdp-rich-description">
    {{ product.description }}
  </div>
</div>

<style>
.earthly-pdp-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 40px 20px 80px 20px;
}
.earthly-pdp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: start;
}
.pdp-main-image-wrapper {
  background: #fcfdfa;
  border-radius: 12px;
  border: 1px solid #edf3e9;
  aspect-ratio: 1;
  overflow: hidden;
}
.pdp-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pdp-thumbnails {
  display: flex;
  gap: 12px;
  margin-top: 14px;
  overflow-x: auto;
  padding-bottom: 6px;
}
.pdp-thumb-btn {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  border: 1px solid #dce8d5;
  background: #ffffff;
  padding: 2px;
  cursor: pointer;
  flex-shrink: 0;
}
.pdp-thumb-btn.active {
  border: 2px solid #2C5801;
}
.pdp-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}
.pdp-top-badge {
  display: inline-block;
  background: #f6fcf1;
  color: #2c5801;
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 4px 10px;
  border-radius: 4px;
  margin-bottom: 12px;
}
.pdp-title {
  font-family: 'Playfair Display', serif;
  font-size: 38px;
  color: #111111;
  margin: 0 0 12px 0;
  line-height: 1.2;
}
.pdp-rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}
.pdp-rating-row .stars {
  color: #F1B948;
  font-size: 16px;
}
.pdp-rating-row .score {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: #111111;
}
.pdp-rating-row .count {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: #666666;
}
.pdp-price-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.pdp-current-price {
  font-family: 'Poppins', sans-serif;
  font-size: 30px;
  font-weight: 700;
  color: #2C5801;
}
.pdp-compare-price {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  color: #888888;
  text-decoration: line-through;
}
.pdp-save-badge {
  background: #f2fbea;
  color: #2c5801;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
}
.pdp-section-label {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: #333333;
  display: block;
  margin-bottom: 10px;
}
.pdp-bundle-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}
.pdp-bundle-card {
  border: 1px solid #dce8d5;
  border-radius: 8px;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  position: relative;
  background: #ffffff;
  transition: all 0.2s ease;
}
.pdp-bundle-card.active {
  border: 2px solid #2C5801;
  background: #fafdf8;
}
.bundle-pill {
  position: absolute;
  top: -9px;
  right: 18px;
  background: #2C5801;
  color: #F1B948;
  font-family: 'Poppins', sans-serif;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 3px;
}
.bundle-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bundle-name {
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #222222;
}
.bundle-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bundle-price {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #2C5801;
}
.bundle-compare {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: #888888;
  text-decoration: line-through;
}
.pdp-atc-btn {
  width: 100%;
  background: #2C5801;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 17px;
  font-weight: 700;
  padding: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 20px rgba(44, 88, 1, 0.25);
  transition: background 0.2s ease, transform 0.1s ease;
}
.pdp-atc-btn:hover {
  background: #1e3d01;
  transform: translateY(-2px);
}
.pdp-trust-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 24px 0 32px 0;
  padding: 16px 0;
  border-top: 1px solid #edf3e9;
  border-bottom: 1px solid #edf3e9;
}
.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
}
.t-icon {
  font-size: 20px;
}
.t-text {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #444444;
}
.pdp-accordion-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pdp-acc-item {
  border: 1px solid #e7f0e2;
  border-radius: 8px;
  overflow: hidden;
}
.pdp-acc-btn {
  width: 100%;
  background: #fbfdfa;
  border: none;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #222222;
  cursor: pointer;
  text-align: left;
}
.pdp-acc-content {
  display: none;
  padding: 14px 18px;
  background: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 13.5px;
  line-height: 1.6;
  color: #4a4a4a;
}
.pdp-acc-item.active .pdp-acc-content {
  display: block;
}
.pdp-acc-item.active .acc-icon {
  transform: rotate(180deg);
}
.pdp-rich-description {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid #eaf2e5;
}
@media (max-width: 900px) {
  .earthly-pdp-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>

<script>
function switchPdpImage(btn, src) {
  var thumbs = document.querySelectorAll('.pdp-thumb-btn');
  thumbs.forEach(function(t) { t.classList.remove('active'); });
  btn.classList.add('active');
  var main = document.getElementById('pdpMainImage');
  if (main) main.src = src;
}

function selectPdpBundle(card, variantId, price, compPrice, saveText) {
  var cards = document.querySelectorAll('.pdp-bundle-card');
  cards.forEach(function(c) { c.classList.remove('active'); });
  card.classList.add('active');

  var radio = card.querySelector('.bundle-radio');
  if (radio) radio.checked = true;

  document.getElementById('selectedVariantId').value = variantId;

  document.getElementById('pdpCurrentPrice').textContent = price;
  document.getElementById('pdpBtnPrice').textContent = price;

  var compEl = document.getElementById('pdpComparePrice');
  var saveEl = document.getElementById('pdpSaveBadge');

  if (compPrice) {
    compEl.textContent = compPrice;
    compEl.classList.remove('hidden');
    saveEl.textContent = 'SAVE ' + saveText;
    saveEl.classList.remove('hidden');
  } else {
    compEl.classList.add('hidden');
    saveEl.classList.add('hidden');
  }
}

function toggleAcc(btn) {
  var item = btn.closest('.pdp-acc-item');
  item.classList.toggle('active');
}

async function addPdpToCart() {
  var btn = document.getElementById('pdpAtcButton');
  var orig = btn.innerHTML;
  btn.innerHTML = 'ADDING...';
  btn.disabled = true;

  var varId = document.getElementById('selectedVariantId').value;

  try {
    var res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: varId, quantity: 1 })
    });
    if (res.ok) {
      btn.innerHTML = 'ADDED TO CART ✓';
      var cartRes = await fetch('/cart.js');
      var cartData = await cartRes.json();
      var countEl = document.getElementById('earthlyCartCount');
      if (countEl) countEl.textContent = cartData.item_count;
      setTimeout(function() {
        btn.innerHTML = orig;
        btn.disabled = false;
        openEarthlyCartDrawer();
      }, 700);
    } else {
      btn.innerHTML = 'ERROR OCCURRED';
      setTimeout(function() { btn.innerHTML = orig; btn.disabled = false; }, 1500);
    }
  } catch(e) {
    btn.innerHTML = 'ERROR OCCURRED';
    setTimeout(function() { btn.innerHTML = orig; btn.disabled = false; }, 1500);
  }
}
</script>
`;
fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-pdp-main.liquid'), pdpMainLiquid.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-pdp-main.liquid');

// 14. earthly-collection.liquid
const colLiquid = `
{% schema %}
{
  "name": "Earthly Collection",
  "settings": []
}
{% endschema %}

<div class="earthly-col-container">
  <div class="earthly-col-hero text-center">
    <h1 class="earthly-col-title">Earthly Derm Handcrafted Bars</h1>
    <p class="earthly-col-desc">All-natural organic soaps crafted with raw African botanicals. Target dark spots, blemishes & hyperpigmentation safely.</p>
  </div>

  <div class="earthly-col-grid">
    {% for product in collection.products %}
      <div class="col-card">
        <a href="{{ product.url }}" class="col-card-img-link">
          <img src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.title }}" class="col-card-img" loading="lazy">
        </a>
        <div class="col-card-content">
          <div class="col-card-stars">★★★★★ <span class="score">4.9</span></div>
          <h2 class="col-card-title"><a href="{{ product.url }}">{{ product.title }}</a></h2>
          <div class="col-card-price">
            <span class="price-from">From</span> {{ product.price_min | money }}
            {% if product.compare_at_price_max > product.price_min %}
              <span class="price-comp">{{ product.compare_at_price_max | money }}</span>
            {% endif %}
          </div>
          <a href="{{ product.url }}" class="col-card-btn">SELECT BUNDLE ➔</a>
        </div>
      </div>
    {% endfor %}
  </div>
</div>

<style>
.earthly-col-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px 20px;
}
.earthly-col-hero {
  margin-bottom: 48px;
}
.earthly-col-title {
  font-family: 'Playfair Display', serif;
  font-size: 42px;
  color: #111111;
  margin: 0 0 12px 0;
}
.earthly-col-desc {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  color: #555555;
  max-width: 620px;
  margin: 0 auto;
}
.earthly-col-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 36px;
}
.col-card {
  background: #ffffff;
  border: 1px solid #e7efe2;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.col-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(44, 88, 1, 0.1);
}
.col-card-img-link {
  display: block;
  aspect-ratio: 1;
  background: #f7faf4;
  overflow: hidden;
}
.col-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.col-card-content {
  padding: 22px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.col-card-stars {
  color: #F1B948;
  font-size: 14px;
  margin-bottom: 6px;
}
.col-card-stars .score {
  font-family: 'Poppins', sans-serif;
  color: #444444;
  font-weight: 700;
  margin-left: 4px;
}
.col-card-title {
  margin: 0 0 12px 0;
}
.col-card-title a {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  color: #111111;
  text-decoration: none;
}
.col-card-price {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #2C5801;
  margin-bottom: 18px;
}
.col-card-price .price-from {
  font-size: 13px;
  font-weight: 400;
  color: #666666;
}
.col-card-price .price-comp {
  font-size: 15px;
  color: #888888;
  text-decoration: line-through;
  margin-left: 6px;
}
.col-card-btn {
  margin-top: auto;
  display: block;
  text-align: center;
  background: #2C5801;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  padding: 13px 20px;
  border-radius: 6px;
  transition: background 0.2s ease;
}
.col-card-btn:hover {
  background: #1e3d01;
}
</style>
`;
fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-collection.liquid'), colLiquid.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-collection.liquid');
