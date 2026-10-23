import fs from 'fs';
import path from 'path';

const SECTIONS_DIR = 'h:/Shopify-Clone/Clone-earthlyderm/sections';

// 5. earthly-featured-products.liquid
const featuredProdsLiquid = `
{% schema %}
{
  "name": "Earthly Featured Products",
  "settings": []
}
{% endschema %}

<section class="earthly-featured-section">
  <div class="earthly-container">
    <div class="earthly-section-header text-center">
      <span class="earthly-subtitle">PROVEN RESULTS</span>
      <h2 class="earthly-heading">Our Best-Selling Soap Bars</h2>
      <p class="earthly-desc">Formulated with pure botanical extracts to target acne, hyperpigmentation, and blemishes naturally.</p>
    </div>

    <div class="earthly-cards-grid">
      <!-- Card 1: Turmeric Fade & Glow Bar -->
      <div class="earthly-product-card">
        <div class="card-badge">MOST POPULAR</div>
        <a href="/products/turmeric-glow-soap" class="card-img-wrapper">
          <img src="//earthlyderm.com/cdn/shop/files/earthlyderm-turmeric-no-badge-screenshot.png?crop=center&height=800&v=1790316244&width=800" alt="Turmeric Fade & Glow Bar." class="card-img">
        </a>
        <div class="card-body">
          <div class="card-reviews">
            <span class="stars">★★★★★</span>
            <span class="count">4.9 (18,400+ reviews)</span>
          </div>
          <h3 class="card-title">
            <a href="/products/turmeric-glow-soap">Turmeric Fade &amp; Glow Bar.</a>
          </h3>
          <p class="card-usp">Targets dark spots, hyperpigmentation & gives a natural golden glow.</p>

          <div class="card-bundles">
            <button type="button" class="bundle-btn active" onclick="selectCardBundle(this, 'turmeric', '1 Bar', 34.00, null, 1)">
              <span class="b-qty">1 Bar</span>
              <span class="b-price">$34.00</span>
            </button>
            <button type="button" class="bundle-btn" onclick="selectCardBundle(this, 'turmeric', '2 Bars', 52.00, 68.00, 2)">
              <span class="b-badge">SAVE 24%</span>
              <span class="b-qty">2 Bars</span>
              <span class="b-price">$52.00</span>
            </button>
            <button type="button" class="bundle-btn" onclick="selectCardBundle(this, 'turmeric', '3 Bars', 69.00, 102.00, 3)">
              <span class="b-badge">BEST VALUE</span>
              <span class="b-qty">3 Bars</span>
              <span class="b-price">$69.00</span>
            </button>
          </div>

          <div class="card-atc-wrapper">
            <button type="button" class="card-atc-btn" id="atc-turmeric" onclick="addCardToCart('turmeric-glow-soap', this)">
              ADD TO CART • <span class="btn-price">$34.00</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Card 2: Anti-Acne & Blemish Bar (African Black Soap) -->
      <div class="earthly-product-card">
        <div class="card-badge black-badge">BLEMISH CONTROL</div>
        <a href="/products/african-black-soap" class="card-img-wrapper">
          <img src="//earthlyderm.com/cdn/shop/files/Afircan_Black_Soap_1st_Image_b0317818-35e2-4f95-a39b-549b7d702d26.png?crop=center&height=800&v=1769505761&width=800" alt="Anti-Acne & Blemish Bar." class="card-img">
        </a>
        <div class="card-body">
          <div class="card-reviews">
            <span class="stars">★★★★★</span>
            <span class="count">4.9 (12,800+ reviews)</span>
          </div>
          <h3 class="card-title">
            <a href="/products/african-black-soap">Anti-Acne &amp; Blemish Bar.</a>
          </h3>
          <p class="card-usp">Deep pore detox, calms inflamed breakouts & controls excess oil.</p>

          <div class="card-bundles">
            <button type="button" class="bundle-btn active" onclick="selectCardBundle(this, 'blacksoap', '1 Bar', 34.00, null, 1)">
              <span class="b-qty">1 Bar</span>
              <span class="b-price">$34.00</span>
            </button>
            <button type="button" class="bundle-btn" onclick="selectCardBundle(this, 'blacksoap', '2 Bars', 52.00, 68.00, 2)">
              <span class="b-badge">SAVE 24%</span>
              <span class="b-qty">2 Bars</span>
              <span class="b-price">$52.00</span>
            </button>
            <button type="button" class="bundle-btn" onclick="selectCardBundle(this, 'blacksoap', '3 Bars', 69.00, 102.00, 3)">
              <span class="b-badge">BEST VALUE</span>
              <span class="b-qty">3 Bars</span>
              <span class="b-price">$69.00</span>
            </button>
          </div>

          <div class="card-atc-wrapper">
            <button type="button" class="card-atc-btn" id="atc-blacksoap" onclick="addCardToCart('african-black-soap', this)">
              ADD TO CART • <span class="btn-price">$34.00</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.earthly-featured-section {
  padding: 64px 20px;
  background-color: #fbfdf9;
}
.earthly-container {
  max-width: 1200px;
  margin: 0 auto;
}
.earthly-section-header {
  margin-bottom: 48px;
}
.earthly-subtitle {
  color: #2C5801;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.earthly-heading {
  font-family: 'Playfair Display', serif;
  font-size: 38px;
  color: #111111;
  margin: 10px 0 12px 0;
}
.earthly-desc {
  font-family: 'Poppins', sans-serif;
  color: #555555;
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
}
.earthly-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 36px;
}
.earthly-product-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e7f0e0;
  box-shadow: 0 8px 30px rgba(0,0,0,0.04);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.card-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: #2C5801;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 4px 10px;
  border-radius: 4px;
  z-index: 2;
}
.card-badge.black-badge {
  background: #111111;
}
.card-img-wrapper {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f7f9f5;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.card-img-wrapper:hover .card-img {
  transform: scale(1.04);
}
.card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.card-reviews {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.card-reviews .stars {
  color: #F1B948;
  font-size: 15px;
}
.card-reviews .count {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: #666666;
}
.card-title {
  margin: 0 0 8px 0;
}
.card-title a {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  color: #111111;
  text-decoration: none;
}
.card-usp {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #555555;
  margin: 0 0 18px 0;
  line-height: 1.45;
}
.card-bundles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}
.bundle-btn {
  background: #fcfdfa;
  border: 1px solid #d8e5d0;
  border-radius: 8px;
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}
.bundle-btn.active {
  border: 2px solid #2C5801;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(44, 88, 1, 0.12);
}
.b-badge {
  position: absolute;
  top: -9px;
  background: #2C5801;
  color: #F1B948;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 3px;
}
.b-qty {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #222222;
}
.b-price {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #2C5801;
  margin-top: 2px;
}
.card-atc-btn {
  width: 100%;
  background: #2C5801;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 15px 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}
.card-atc-btn:hover {
  background: #1e3d01;
  transform: translateY(-1px);
}
@media (max-width: 800px) {
  .earthly-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<script>
function selectCardBundle(btn, group, title, price, compPrice, count) {
  var parent = btn.parentElement;
  var btns = parent.querySelectorAll('.bundle-btn');
  btns.forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');

  var atcBtn = document.getElementById('atc-' + group);
  if (atcBtn) {
    var priceSpan = atcBtn.querySelector('.btn-price');
    if (priceSpan) priceSpan.textContent = '$' + price.toFixed(2);
    atcBtn.dataset.variantTitle = title;
  }
}

async function addCardToCart(handle, btn) {
  var origText = btn.innerHTML;
  btn.innerHTML = 'ADDING...';
  btn.disabled = true;

  try {
    // Look up product via handle.js
    var res = await fetch('/products/' + handle + '.js');
    var prod = await res.json();
    var variantTitle = btn.dataset.variantTitle || '1 Bar';
    var variant = prod.variants.find(function(v) { return v.title === variantTitle; }) || prod.variants[0];

    var addRes = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variant.id, quantity: 1 })
    });

    if (addRes.ok) {
      btn.innerHTML = 'ADDED! ✓';
      // update cart count
      var cartRes = await fetch('/cart.js');
      var cartData = await cartRes.json();
      var countEl = document.getElementById('earthlyCartCount');
      if (countEl) countEl.textContent = cartData.item_count;
      setTimeout(function() {
        btn.innerHTML = origText;
        btn.disabled = false;
        openEarthlyCartDrawer();
      }, 800);
    } else {
      btn.innerHTML = 'ERROR';
      setTimeout(function() { btn.innerHTML = origText; btn.disabled = false; }, 1500);
    }
  } catch(e) {
    btn.innerHTML = 'ERROR';
    setTimeout(function() { btn.innerHTML = origText; btn.disabled = false; }, 1500);
  }
}
</script>
`;

fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-featured-products.liquid'), featuredProdsLiquid.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-featured-products.liquid');

// 6. earthly-what-to-expect.liquid
const rawWte = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/sec_template--19526977814662__section_what_to_expect_nXxXNh.html', 'utf8');
const wteClean = `
{% schema %}
{
  "name": "What To Expect",
  "settings": []
}
{% endschema %}

${rawWte.replace(/id=['"]shopify-section-[^'"]*['"]/g, 'class="earthly-wte-wrapper"')}
`;

fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-what-to-expect.liquid'), wteClean.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-what-to-expect.liquid');

// 7. earthly-glow-videos.liquid
const rawGlow = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/sec_template--19526977814662__pdp_glow_section_txREF8.html', 'utf8');
const glowClean = `
{% schema %}
{
  "name": "Earthly Glow Videos",
  "settings": []
}
{% endschema %}

${rawGlow.replace(/id=['"]shopify-section-[^'"]*['"]/g, 'class="earthly-glow-wrapper"')}
`;

fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-glow-videos.liquid'), glowClean.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-glow-videos.liquid');
