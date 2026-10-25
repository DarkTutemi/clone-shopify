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
    return true;
  } else {
    console.error(`  ✗ Failed: ${key}`, JSON.stringify(data.errors || data));
    return false;
  }
}

async function run() {
  const token = await getAccessToken();
  console.log('Got access token. Adding Buybox Accordions (Free shipping, 30-day easy returns, FAQ)...');

  // 1. Update CSS
  let css = fs.readFileSync('Clone-pandadrum/zhp-pdp.css', 'utf8');
  const accordionCss = `
/* Buybox Collapsible Accordion (Free shipping, 30-day easy returns, FAQ) */
.wf-bb-accordion {
  margin-top: 24px;
  border-top: 1px solid #e5e7eb;
}
.wf-bb-acc-item {
  border-bottom: 1px solid #e5e7eb;
}
.wf-bb-acc-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  user-select: none;
  font-family: inherit;
  transition: opacity 0.15s ease;
}
.wf-bb-acc-header:hover {
  opacity: 0.8;
}
.wf-bb-acc-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.wf-bb-acc-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  flex-shrink: 0;
}
.wf-bb-acc-icon svg {
  width: 22px;
  height: 22px;
  stroke: #111827;
  fill: none;
}
.wf-bb-acc-title {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
  letter-spacing: -0.2px;
}
.wf-bb-acc-chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  transition: transform 0.25s ease;
  flex-shrink: 0;
}
.wf-bb-acc-chevron svg {
  width: 18px;
  height: 18px;
  stroke: #111827;
}
.wf-bb-acc-item.open .wf-bb-acc-chevron {
  transform: rotate(180deg);
}
.wf-bb-acc-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.wf-bb-acc-item.open .wf-bb-acc-content {
  max-height: 550px;
}
.wf-bb-acc-body {
  padding: 0 4px 18px 34px;
  font-size: 14px;
  line-height: 1.65;
  color: #4b5563;
}
.wf-bb-acc-body p {
  margin: 0 0 10px;
}
.wf-bb-acc-body p:last-child {
  margin-bottom: 0;
}
.wf-bb-acc-body ul {
  margin: 6px 0 10px;
  padding-left: 20px;
}
.wf-bb-acc-body li {
  margin-bottom: 4px;
}
`;

  if (!css.includes('wf-bb-accordion')) {
    css += '\n' + accordionCss;
    fs.writeFileSync('Clone-pandadrum/zhp-pdp.css', css);
  }
  await uploadAsset(token, 'assets/zhp-pdp.css', css);

  // 2. Update JS
  let js = fs.readFileSync('Clone-pandadrum/zhp-pdp.js', 'utf8');
  const accordionJs = `
function toggleWfBbAcc(btn) {
  const item = btn.closest('.wf-bb-acc-item');
  if (!item) return;
  const isOpen = item.classList.contains('open');
  item.classList.toggle('open');
  btn.setAttribute('aria-expanded', !isOpen);
}
`;
  if (!js.includes('toggleWfBbAcc')) {
    js += '\n' + accordionJs;
    fs.writeFileSync('Clone-pandadrum/zhp-pdp.js', js);
  }
  await uploadAsset(token, 'assets/zhp-pdp.js', js);

  // 3. Update sections/zhp-pdp-hero.liquid
  const heroLiquid = `{{ 'zhp-pdp.css' | asset_url | stylesheet_tag }}
{{ 'zhp-pdp.js' | asset_url | script_tag }}

{%- assign main_src = section.settings.main_image | image_url: width: 1200 -%}
{%- if main_src == blank -%}
  {%- assign main_src = section.settings.main_image_url -%}
{%- endif -%}

<div id="fn-offer" class="wf-funnel-container" data-product-handle="{{ product.handle }}">
  <section class="wf-section wf-hero-section">
    <div class="wf-container">
      <div class="wf-hero-grid">
        <!-- Gallery Column -->
        <div class="wf-hero-gallery">
          <div class="wf-gallery-main">
            <img id="wfMainImg" 
                 src="{{ main_src }}" 
                 alt="{{ section.settings.title | default: product.title }}" 
                 loading="eager" 
                 class="wf-main-image" />
            <div class="wf-badge-sale">{{ section.settings.badge_sale | default: '50% OFF FLASH SALE' }}</div>
          </div>
          
          <div class="wf-gallery-thumbs" id="wfThumbs">
            {%- for i in (1..6) -%}
              {%- assign img_key = 'thumb_' | append: i -%}
              {%- assign url_key = 'thumb_' | append: i | append: '_url' -%}
              {%- assign t_src = section.settings[img_key] | image_url: width: 300 -%}
              {%- if t_src == blank -%}
                {%- assign t_src = section.settings[url_key] -%}
              {%- endif -%}
              {%- if t_src != blank -%}
                <div class="wf-thumb-item {% if forloop.first %}active{% endif %}" onclick="selectWfImage('{{ t_src }}', this)">
                  <img src="{{ t_src }}" alt="{{ section.settings.title }} Thumbnail {{ i }}" />
                </div>
              {%- endif -%}
            {%- endfor -%}
          </div>
        </div>

        <!-- Buybox Column -->
        <div class="wf-hero-buybox">
          <div class="wf-rating-pill">
            <span class="wf-stars">{% render 'trustpilot-stars', width: 96, height: 18 %}</span>
            <span class="wf-rating-score">{{ section.settings.rating_score | default: '4.9 / 5.0' }}</span>
            <span class="wf-rating-count">({{ section.settings.rating_count | default: '1,680+ Verified Practitioners' }})</span>
          </div>

          <h1 class="wf-product-title">{{ section.settings.title | default: product.title }}</h1>
          <p class="wf-product-sub">{{ section.settings.subtitle }}</p>

          <!-- Price Display -->
          <div class="wf-price-box">
            <span class="wf-current-price" id="wfCurrentPrice">\${{ section.settings.price | default: '259.95' }}</span>
            <span class="wf-compare-price" id="wfComparePrice">\${{ section.settings.compare_at | default: '499.95' }}</span>
            <span class="wf-save-badge" id="wfSaveBadge">SAVE 50%</span>
          </div>

          <!-- Promotion highlight -->
          <div class="wf-promo-alert">
            <span class="wf-alert-icon">✨</span>
            <span class="wf-alert-text">{{ section.settings.promo_text | default: '<strong>SPECIAL OFFER:</strong> 50% OFF applied automatically. Includes Free Padded Travel Bag & Tutorial Songbook Guide!' }}</span>
          </div>

          <!-- Color Variant Selector -->
          <div class="wf-color-picker-wrap">
            <label class="wf-bundle-label">CHOOSE COLOR: <span id="wfSelectedColorName" style="color:var(--wf-primary); font-weight:800;">White</span></label>
            <div class="wf-color-options">
              {%- for variant in product.variants -%}
                {%- assign v_title = variant.title | downcase -%}
                {%- assign hex = '#ffffff' -%}
                {%- if v_title contains 'black' -%}{%- assign hex = '#1a1a1a' -%}
                {%- elsif v_title contains 'silver' -%}{%- assign hex = '#cbd5e1' -%}
                {%- elsif v_title contains 'blue' -%}{%- assign hex = '#1e3a8a' -%}
                {%- elsif v_title contains 'sandstone' or v_title contains 'gold' -%}{%- assign hex = '#d4b996' -%}
                {%- elsif v_title contains 'emerald' or v_title contains 'green' -%}{%- assign hex = '#065f46' -%}
                {%- elsif v_title contains 'pink tan' -%}{%- assign hex = '#e0a899' -%}
                {%- elsif v_title contains 'pink' -%}{%- assign hex = '#f472b6' -%}
                {%- elsif v_title contains 'red' -%}{%- assign hex = '#dc2626' -%}
                {%- elsif v_title contains 'burgundy' -%}{%- assign hex = '#831843' -%}
                {%- endif -%}
                <button type="button" class="wf-color-btn {% if forloop.first %}active{% endif %}" 
                        data-color="{{ variant.title }}" 
                        data-variant-id="{{ variant.id }}" 
                        data-img="{% if variant.featured_image %}{{ variant.featured_image | image_url: width: 1000 }}{% endif %}" 
                        style="background:{{ hex }}; {% if hex == '#ffffff' %}border:1px solid #ccc;{% endif %}" 
                        onclick="selectWfColor(this)" 
                        title="{{ variant.title }}"></button>
              {%- endfor -%}
            </div>
          </div>

          <!-- Bundle Options -->
          <div class="wf-bundles-container">
            <label class="wf-bundle-label">CHOOSE YOUR PACKAGE:</label>

            {%- assign unit_price_num = section.settings.price | default: '259.95' | times: 1.0 -%}
            {%- assign unit_comp_num = section.settings.compare_at | default: '499.95' | times: 1.0 -%}
            {%- assign unit_price_cents = unit_price_num | times: 100 | round -%}
            {%- assign unit_comp_cents = unit_comp_num | times: 100 | round -%}
            {%- assign p2_price_cents = unit_price_cents | times: 2 | minus: 4000 -%}
            {%- assign p2_comp_cents = unit_comp_cents | times: 2 -%}
            {%- assign p2_each_cents = p2_price_cents | divided_by: 2 -%}
            {%- assign p3_price_cents = unit_price_cents | times: 3 | minus: 9000 -%}
            {%- assign p3_comp_cents = unit_comp_cents | times: 3 -%}
            {%- assign p3_each_cents = p3_price_cents | divided_by: 3 -%}
            {%- assign p2_price_dollars = p2_price_cents | divided_by: 100.0 -%}
            {%- assign p2_comp_dollars = p2_comp_cents | divided_by: 100.0 -%}
            {%- assign p3_price_dollars = p3_price_cents | divided_by: 100.0 -%}
            {%- assign p3_comp_dollars = p3_comp_cents | divided_by: 100.0 -%}

            <!-- Tier 1 -->
            <div class="wf-bundle-card active" data-qty="1" data-price="{{ unit_price_num }}" data-compare="{{ unit_comp_num }}" onclick="selectWfBundle(this)">
              <div class="wf-card-radio"></div>
              <div class="wf-card-info">
                <div class="wf-card-title-row">
                  <span class="wf-card-title">1x {{ section.settings.short_name | default: 'Zavelyn Drum™' }} Kit</span>
                  <span class="wf-card-tag standard">Standard</span>
                </div>
                <div class="wf-card-desc">{{ section.settings.tier1_desc | default: 'Complete Kit + Travel Backpack + Mallets + Master Songbook + Picks' }}</div>
              </div>
              <div class="wf-card-pricing">
                <span class="wf-card-price">{{ unit_price_cents | money }}</span>
                <span class="wf-card-comp">{{ unit_comp_cents | money }}</span>
              </div>
            </div>

            <!-- Tier 2 -->
            <div class="wf-bundle-card" data-qty="2" data-price="{{ p2_price_dollars }}" data-compare="{{ p2_comp_dollars }}" onclick="selectWfBundle(this)">
              <div class="wf-card-radio"></div>
              <div class="wf-card-info">
                <div class="wf-card-title-row">
                  <span class="wf-card-title">2x {{ section.settings.short_name | default: 'Zavelyn Drum™' }} Duet Pack</span>
                  <span class="wf-card-tag popular">★ MOST POPULAR</span>
                </div>
                <div class="wf-card-desc">2 Complete Kits • Save Extra \$40 • For Couples & Family Play</div>
              </div>
              <div class="wf-card-pricing">
                <span class="wf-card-price">{{ p2_price_cents | money }}</span>
                <span class="wf-card-comp">{{ p2_comp_cents | money }}</span>
                <span class="wf-unit-note">({{ p2_each_cents | money }}/ea)</span>
              </div>
            </div>

            <!-- Tier 3 -->
            <div class="wf-bundle-card" data-qty="3" data-price="{{ p3_price_dollars }}" data-compare="{{ p3_comp_dollars }}" onclick="selectWfBundle(this)">
              <div class="wf-card-radio"></div>
              <div class="wf-card-info">
                <div class="wf-card-title-row">
                  <span class="wf-card-title">3x {{ section.settings.short_name | default: 'Zavelyn Drum™' }} Ensemble</span>
                  <span class="wf-card-tag best-value">★ BEST VALUE</span>
                </div>
                <div class="wf-card-desc">3 Complete Kits • Maximum Savings • For Yoga Studios & Sound Baths</div>
              </div>
              <div class="wf-card-pricing">
                <span class="wf-card-price">{{ p3_price_cents | money }}</span>
                <span class="wf-card-comp">{{ p3_comp_cents | money }}</span>
                <span class="wf-unit-note">({{ p3_each_cents | money }}/ea)</span>
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
              <span class="wf-trust-text"><strong>{{ section.settings.guarantee_1 | default: '90-Day Sound' }}</strong> Guarantee</span>
            </div>
            <div class="wf-trust-item">
              <span class="wf-trust-icon">📦</span>
              <span class="wf-trust-text"><strong>{{ section.settings.guarantee_2 | default: 'Fast Tracked US' }}</strong> Delivery (2-4 Days)</span>
            </div>
            <div class="wf-trust-item">
              <span class="wf-trust-icon">✨</span>
              <span class="wf-trust-text"><strong>{{ section.settings.guarantee_3 | default: '432 Hz Calibrated' }}</strong> Harmonic Pitch</span>
            </div>
          </div>

          <!-- Buybox Collapsible Accordion (Free shipping, 30-day easy returns, FAQ) -->
          <div class="wf-bb-accordion">
            <!-- Accordion Item 1: Free Shipping -->
            <div class="wf-bb-acc-item">
              <button type="button" class="wf-bb-acc-header" onclick="toggleWfBbAcc(this)" aria-expanded="false">
                <div class="wf-bb-acc-left">
                  <span class="wf-bb-acc-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-truck"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                  </span>
                  <span class="wf-bb-acc-title">{{ section.settings.acc_1_title | default: 'Free shipping' }}</span>
                </div>
                <span class="wf-bb-acc-chevron">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </button>
              <div class="wf-bb-acc-content">
                <div class="wf-bb-acc-body">
                  <p>We offer <strong>Free tracked shipping</strong> for all orders. Order processing takes 1-3 business days before dispatch.</p>
                  <p>Estimated delivery times once dispatched:</p>
                  <ul>
                    <li><strong>USA:</strong> 4-9 business days</li>
                    <li><strong>UK &amp; Europe:</strong> 7-12 business days</li>
                    <li><strong>Australia &amp; NZ:</strong> 7-12 business days</li>
                    <li><strong>Canada:</strong> 7-18 business days</li>
                    <li><strong>Rest of World:</strong> 14-20 business days</li>
                  </ul>
                  <p>All packages include complete end-to-end tracking.</p>
                </div>
              </div>
            </div>

            <!-- Accordion Item 2: 30-day easy returns -->
            <div class="wf-bb-acc-item">
              <button type="button" class="wf-bb-acc-header" onclick="toggleWfBbAcc(this)" aria-expanded="false">
                <div class="wf-bb-acc-left">
                  <span class="wf-bb-acc-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-corner-down-left"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>
                  </span>
                  <span class="wf-bb-acc-title">{{ section.settings.acc_2_title | default: '30-day easy returns' }}</span>
                </div>
                <span class="wf-bb-acc-chevron">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </button>
              <div class="wf-bb-acc-content">
                <div class="wf-bb-acc-body">
                  <p>We adore our Zavelyn Drums and we're certain you will too! If things don't quite strike the right note, our return and refund policy is designed to make it as easy as possible for you.</p>
                  <p>You can return your complete package within <strong>30 days of delivery</strong> for a hassle-free, 100% full refund. Contact our 24/7 customer care team to get your prepaid return instructions.</p>
                </div>
              </div>
            </div>

            <!-- Accordion Item 3: FAQ -->
            <div class="wf-bb-acc-item">
              <button type="button" class="wf-bb-acc-header" onclick="toggleWfBbAcc(this)" aria-expanded="false">
                <div class="wf-bb-acc-left">
                  <span class="wf-bb-acc-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </span>
                  <span class="wf-bb-acc-title">{{ section.settings.acc_3_title | default: 'FAQ' }}</span>
                </div>
                <span class="wf-bb-acc-chevron">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </button>
              <div class="wf-bb-acc-content">
                <div class="wf-bb-acc-body">
                  <p><strong>Do I need any musical experience to play?</strong><br>
                  No musical experience is required! The Zavelyn Drum is designed to be completely intuitive and easy to play. Each note produces harmonious sounds, making it accessible for beginners and relaxing for experienced musicians.</p>
                  <p><strong>What kind of sound does it produce?</strong><br>
                  The Zavelyn Drum produces rich, resonant tones calibrated to the 432 Hz healing frequency. Its unique harmonic scale allows each note to blend seamlessly, creating a meditative and calming acoustic experience.</p>
                  <p><strong>How durable is the drum?</strong><br>
                  Crafted from high-grade tempered alloy steel and heat-treated. It is designed to withstand daily use while maintaining its pristine pitch calibration for decades.</p>
                  <p><strong>What key is it tuned to?</strong><br>
                  It is tuned to harmonic D-Major (15 tones on Pro, 11 tones on Plus, 8 tones on Mini) at 432 Hz natural frequency.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

{% schema %}
{
  "name": "Zavelyn Drum PDP Hero",
  "settings": [
    { "type": "image_picker", "id": "main_image", "label": "Main Product Image", "info": "Custom transparent drum without logo" },
    { "type": "text", "id": "main_image_url", "label": "Fallback Main Image URL" },
    { "type": "text", "id": "badge_sale", "label": "Badge Text", "default": "50% OFF FLASH SALE" },
    { "type": "text", "id": "title", "label": "Product Title" },
    { "type": "text", "id": "short_name", "label": "Product Short Name", "default": "Zavelyn Drum™" },
    { "type": "text", "id": "subtitle", "label": "Product Subtitle" },
    { "type": "text", "id": "price", "label": "Current Price", "default": "259.95" },
    { "type": "text", "id": "compare_at", "label": "Compare Price", "default": "499.95" },
    { "type": "text", "id": "rating_score", "label": "Rating Score", "default": "4.9 / 5.0" },
    { "type": "text", "id": "rating_count", "label": "Rating Count", "default": "1,680+ Verified Practitioners" },
    { "type": "textarea", "id": "promo_text", "label": "Promo Box Text" },
    { "type": "text", "id": "tier1_desc", "label": "Tier 1 Description" },
    { "type": "header", "content": "Gallery Thumbnails" },
    { "type": "image_picker", "id": "thumb_1", "label": "Thumbnail 1" },
    { "type": "text", "id": "thumb_1_url", "label": "Fallback Thumb 1 URL" },
    { "type": "image_picker", "id": "thumb_2", "label": "Thumbnail 2" },
    { "type": "text", "id": "thumb_2_url", "label": "Fallback Thumb 2 URL" },
    { "type": "image_picker", "id": "thumb_3", "label": "Thumbnail 3" },
    { "type": "text", "id": "thumb_3_url", "label": "Fallback Thumb 3 URL" },
    { "type": "image_picker", "id": "thumb_4", "label": "Thumbnail 4" },
    { "type": "text", "id": "thumb_4_url", "label": "Fallback Thumb 4 URL" },
    { "type": "image_picker", "id": "thumb_5", "label": "Thumbnail 5" },
    { "type": "text", "id": "thumb_5_url", "label": "Fallback Thumb 5 URL" },
    { "type": "image_picker", "id": "thumb_6", "label": "Thumbnail 6" },
    { "type": "text", "id": "thumb_6_url", "label": "Fallback Thumb 6 URL" },
    { "type": "header", "content": "Trust Badges" },
    { "type": "text", "id": "guarantee_1", "label": "Trust Badge 1 Title", "default": "90-Day Sound" },
    { "type": "text", "id": "guarantee_2", "label": "Trust Badge 2 Title", "default": "Fast Tracked US" },
    { "type": "text", "id": "guarantee_3", "label": "Trust Badge 3 Title", "default": "432 Hz Calibrated" },
    { "type": "header", "content": "Buybox Accordions" },
    { "type": "text", "id": "acc_1_title", "label": "Accordion 1 Title", "default": "Free shipping" },
    { "type": "text", "id": "acc_2_title", "label": "Accordion 2 Title", "default": "30-day easy returns" },
    { "type": "text", "id": "acc_3_title", "label": "Accordion 3 Title", "default": "FAQ" }
  ],
  "presets": [
    {
      "name": "Zavelyn Drum PDP Hero"
    }
  ]
}
{% endschema %}`;

  await uploadAsset(token, 'sections/zhp-pdp-hero.liquid', heroLiquid);
  console.log('✔ Buybox accordions successfully added to sections/zhp-pdp-hero.liquid!');
}

run().catch(console.error);
