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

async function uploadAsset(token, key, content) {
  console.log(`Uploading ${key} to Draft Theme ${DRAFT_THEME_ID}...`);
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: { key, value: content }
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

// 1. SECTION: zavelyn-pdp-main.liquid
const pdpMainLiquid = `{% schema %}
{
  "name": "Zavelyn Universal PDP",
  "settings": [
    {
      "type": "checkbox",
      "id": "show_breadcrumbs",
      "label": "Show Breadcrumbs",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "show_rating",
      "label": "Show Rating in Buy Box",
      "default": false,
      "info": "Kept hidden by default until verified reviews are integrated."
    },
    {
      "type": "text",
      "id": "rating_score",
      "label": "Rating Score",
      "default": "4.9"
    },
    {
      "type": "text",
      "id": "rating_count_text",
      "label": "Rating Count Text",
      "default": "Verified Customer Reviews"
    },
    {
      "type": "text",
      "id": "shipping_threshold_text",
      "label": "Shipping Reassurance",
      "default": "⚡ In Stock · Dispatched within 24–48h from US Warehouses"
    },
    {
      "type": "checkbox",
      "id": "enable_sticky_atc",
      "label": "Enable Sticky Add to Cart Bar",
      "default": true
    }
  ],
  "presets": [
    {
      "name": "Zavelyn Universal PDP"
    }
  ]
}
{% endschema %}

{%- assign current_variant = product.selected_or_first_available_variant -%}
{%- assign has_compare = false -%}
{%- if current_variant.compare_at_price > current_variant.price -%}
  {%- assign has_compare = true -%}
  {%- assign savings_percent = current_variant.compare_at_price | minus: current_variant.price | times: 100.0 | divided_by: current_variant.compare_at_price | round -%}
{%- endif -%}

<div class="zv-pdp-wrap" id="zvPdpWrap">
  <div class="zv-pdp-container">
    {% if section.settings.show_breadcrumbs %}
      <nav class="zv-pdp-breadcrumbs" aria-label="Breadcrumbs">
        <a href="/">Home</a>
        <span class="sep">/</span>
        <a href="/collections/all-products">Shop</a>
        <span class="sep">/</span>
        <span class="curr">{{ product.title }}</span>
      </nav>
    {% endif %}

    <div class="zv-pdp-layout">
      <!-- LEFT: Media Gallery -->
      <div class="zv-pdp-gallery-col">
        <div class="zv-pdp-main-img-box">
          {% if product.featured_image %}
            <img 
              id="zvPdpMainImg" 
              src="{{ product.featured_image | image_url: width: 1200 }}" 
              alt="{{ product.title | escape }}"
              fetchpriority="high"
              loading="eager"
            >
          {% else %}
            {{ 'image' | placeholder_svg_tag: 'zv-pdp-main-img placeholder' }}
          {% endif %}

          <div id="zvPdpSaveBadge" class="zv-pdp-img-badge {% unless has_compare %}hidden{% endunless %}">
            SAVE <span id="zvPdpSavePercent">{{ savings_percent }}</span>%
          </div>
        </div>

        {% if product.images.size > 1 %}
          <div class="zv-pdp-thumbs-row" id="zvPdpThumbs">
            {% for img in product.images limit: 12 %}
              <button 
                type="button" 
                class="zv-pdp-thumb-btn {% if forloop.first %}active{% endif %}" 
                onclick="zvSwitchMainImg('{{ img | image_url: width: 1200 }}', this)"
                aria-label="View product image {{ forloop.index }}"
              >
                <img src="{{ img | image_url: width: 160, height: 160, crop: 'center' }}" alt="{{ product.title | escape }} thumbnail {{ forloop.index }}" loading="lazy">
              </button>
            {% endfor %}
          </div>
        {% endif %}
      </div>

      <!-- RIGHT: Purchase Column -->
      <div class="zv-pdp-info-col">
        {% if section.settings.show_rating %}
          <div class="zv-pdp-rating-row">
            <span class="zv-pdp-stars">★★★★★</span>
            <span class="zv-pdp-score">{{ section.settings.rating_score }}</span>
            <span class="zv-pdp-review-count">({{ section.settings.rating_count_text }})</span>
          </div>
        {% endif %}

        <h1 class="zv-pdp-title">{{ product.title }}</h1>

        <div class="zv-pdp-price-row">
          <span class="zv-pdp-live-price" id="zvPdpLivePrice">{{ current_variant.price | money }}</span>
          <span class="zv-pdp-compare-price {% unless has_compare %}hidden{% endunless %}" id="zvPdpComparePrice">
            {{ current_variant.compare_at_price | money }}
          </span>
          <span class="zv-pdp-price-badge {% unless has_compare %}hidden{% endunless %}" id="zvPdpPriceBadge">
            SAVE {{ savings_percent }}%
          </span>
        </div>

        <div class="zv-pdp-dispatch-tag">
          {{ section.settings.shipping_threshold_text }}
        </div>

        <!-- 3 Key Value Props -->
        <div class="zv-pdp-key-benefits">
          <div class="zv-pdp-kb-item">
            <span class="zv-pdp-kb-icon">🛠️</span>
            <span>Industrial-Grade Heavy-Duty Build</span>
          </div>
          <div class="zv-pdp-kb-item">
            <span class="zv-pdp-kb-icon">⚡</span>
            <span>24–48h Swift Dispatch from US Hubs</span>
          </div>
          <div class="zv-pdp-kb-item">
            <span class="zv-pdp-kb-icon">🛡️</span>
            <span>60-Day Risk-Free Money-Back Guarantee</span>
          </div>
        </div>

        <!-- Variant & Hybrid Bundle Selector -->
        {%- assign has_bundle_option = false -%}
        {%- assign bundle_opt_index = 0 -%}
        {%- assign secondary_opt_index = 0 -%}

        {%- for opt in product.options_with_values -%}
          {%- assign opt_down = opt.name | downcase -%}
          {%- if opt_down contains 'bundle' or opt_down contains 'package' or opt_down contains 'pack' or opt_down contains 'quantity' -%}
            {%- assign has_bundle_option = true -%}
            {%- assign bundle_opt_index = forloop.index -%}
          {%- else -%}
            {%- assign secondary_opt_index = forloop.index -%}
          {%- endif -%}
        {%- endfor -%}

        {% if product.variants.size > 1 and has_bundle_option %}
          <!-- CASE A: Bundle Cards + Secondary Option (e.g. Color/Size) -->
          <div class="zv-pdp-bundle-engine">
            <label class="zv-pdp-opt-label">Select Package & Save:</label>
            <div class="zv-pdp-bundle-cards" id="zvBundleCards">
              {%- assign b_idx = bundle_opt_index | minus: 1 -%}
              {%- assign bundle_opt = product.options_with_values[b_idx] -%}
              {% for b_val in bundle_opt.values %}
                {%- assign rep_var = nil -%}
                {% for v in product.variants %}
                  {% if bundle_opt_index == 1 and v.option1 == b_val and rep_var == nil %}
                    {% assign rep_var = v %}
                  {% elsif bundle_opt_index == 2 and v.option2 == b_val and rep_var == nil %}
                    {% assign rep_var = v %}
                  {% elsif bundle_opt_index == 3 and v.option3 == b_val and rep_var == nil %}
                    {% assign rep_var = v %}
                  {% endif %}
                {% endfor %}

                {%- assign b_tag = 'STANDARD' -%}
                {%- assign b_tag_class = 'standard' -%}
                {% if forloop.index == 2 %}
                  {% assign b_tag = '★ MOST POPULAR' %}
                  {% assign b_tag_class = 'popular' %}
                {% elsif forloop.index >= 3 %}
                  {% assign b_tag = '★ BEST VALUE' %}
                  {% assign b_tag_class = 'best-value' %}
                {% endif %}

                <div 
                  class="zv-pdp-bcard {% if forloop.first %}active{% endif %}"
                  data-bundle-val="{{ b_val | escape }}"
                  onclick="zvSelectBundle('{{ b_val | escape }}', this)"
                >
                  <div class="zv-bcard-radio"></div>
                  <div class="zv-bcard-info">
                    <div class="zv-bcard-title-row">
                      <span class="zv-bcard-title">{{ b_val }}</span>
                      <span class="zv-bcard-tag {{ b_tag_class }}">{{ b_tag }}</span>
                    </div>
                  </div>
                  <div class="zv-bcard-pricing">
                    <span class="zv-bcard-price">{{ rep_var.price | money }}</span>
                    {% if rep_var.compare_at_price > rep_var.price %}
                      <span class="zv-bcard-compare">{{ rep_var.compare_at_price | money }}</span>
                    {% endif %}
                  </div>
                </div>
              {% endfor %}
            </div>

            {% if product.options.size > 1 and secondary_opt_index > 0 %}
              {%- assign s_idx = secondary_opt_index | minus: 1 -%}
              {%- assign sec_opt = product.options_with_values[s_idx] -%}
              <div class="zv-pdp-secondary-opt-box">
                <label class="zv-pdp-opt-label">
                  Select {{ sec_opt.name }}: <strong id="zvActiveSecLabel">{{ sec_opt.values.first }}</strong>
                </label>
                <div class="zv-pdp-chips-row" id="zvSecondaryChips">
                  {% for s_val in sec_opt.values %}
                    <button 
                      type="button" 
                      class="zv-pdp-chip {% if forloop.first %}active{% endif %}"
                      data-sec-val="{{ s_val | escape }}"
                      onclick="zvSelectSecondary('{{ s_val | escape }}', this)"
                    >
                      {{ s_val }}
                    </button>
                  {% endfor %}
                </div>
              </div>
            {% endif %}
          </div>

        {% elsif product.variants.size > 1 %}
          <!-- CASE B: Standard Multi-variant chips (No bundle keyword) -->
          <div class="zv-pdp-standard-variants">
            {% for opt in product.options_with_values %}
              <div class="zv-pdp-opt-group">
                <label class="zv-pdp-opt-label">Select {{ opt.name }}:</label>
                <div class="zv-pdp-chips-row">
                  {% for val in opt.values %}
                    <button 
                      type="button" 
                      class="zv-pdp-chip {% if opt.selected_value == val or forloop.first %}active{% endif %}"
                      data-option-index="{{ forloop.parentloop.index0 }}"
                      data-option-value="{{ val | escape }}"
                      onclick="zvSelectStandardOption({{ forloop.parentloop.index0 }}, '{{ val | escape }}', this)"
                    >
                      {{ val }}
                    </button>
                  {% endfor %}
                </div>
              </div>
            {% endfor %}
          </div>
        {% endif %}

        <!-- Quantity & Purchase Actions -->
        <div class="zv-pdp-actions-row">
          <div class="zv-pdp-qty-wrap">
            <span class="zv-pdp-qty-label">Quantity:</span>
            <div class="zv-pdp-qty-ctrl">
              <button type="button" onclick="zvChangeQty(-1)" aria-label="Decrease quantity">−</button>
              <input type="number" id="zvPdpQtyInput" value="1" min="1" max="50" readonly>
              <button type="button" onclick="zvChangeQty(1)" aria-label="Increase quantity">+</button>
            </div>
          </div>

          <button 
            type="button" 
            id="zvPdpAtcBtn" 
            class="zv-pdp-atc-btn" 
            onclick="zvAddToCart()"
            {% unless current_variant.available %}disabled{% endunless %}
          >
            <span id="zvAtcBtnText">
              {% if current_variant.available %}ADD TO CART ➔{% else %}SOLD OUT{% endif %}
            </span>
          </button>
        </div>

        <!-- 1-Click Buy Now Button -->
        <button 
          type="button" 
          id="zvPdpBuyNowBtn" 
          class="zv-pdp-buynow-btn" 
          onclick="zvBuyNow()"
          {% unless current_variant.available %}disabled{% endunless %}
        >
          ⚡ BUY NOW (1-CLICK CHECKOUT) ➔
        </button>

        <!-- Official Shopify Payment Icons -->
        <div class="zv-pdp-payment-box">
          <div class="zv-pdp-pay-header">
            <span>🔒 Guaranteed Safe &amp; Encrypted Checkout</span>
          </div>
          <div class="zv-pdp-pay-icons">
            {%- for type in shop.enabled_payment_types -%}
              <span class="zv-pdp-pay-tag">{{ type | payment_type_svg_tag }}</span>
            {%- endfor -%}
          </div>
        </div>

        <!-- 3 Trust Benefit Cards -->
        <div class="zv-pdp-trust-grid">
          <div class="zv-pdp-trust-card">
            <span class="zv-pdp-trust-icon">🛡️</span>
            <div>
              <strong>60-Day Guarantee</strong>
              <span>100% Risk-Free Trial</span>
            </div>
          </div>
          <div class="zv-pdp-trust-card">
            <span class="zv-pdp-trust-icon">🚚</span>
            <div>
              <strong>Free Express Delivery</strong>
              <span>On all orders over $49</span>
            </div>
          </div>
          <div class="zv-pdp-trust-card">
            <span class="zv-pdp-trust-icon">🔒</span>
            <div>
              <strong>Safe Checkout</strong>
              <span>256-Bit Bank Encryption</span>
            </div>
          </div>
        </div>

        <!-- Short Product Accordions -->
        <div class="zv-pdp-accordions">
          <details class="zv-pdp-acc" open>
            <summary>
              <span>What's Included &amp; Key Features</span>
              <span class="zv-acc-icon">+</span>
            </summary>
            <div class="zv-acc-body">
              {% if product.description != blank %}
                {{ product.description }}
              {% else %}
                <p>Heavy-duty industrial grade construction engineered for relentless reliability, high precision, and long-term daily performance.</p>
              {% endif %}
            </div>
          </details>

          <details class="zv-pdp-acc">
            <summary>
              <span>Fast Tracked US Shipping &amp; Delivery</span>
              <span class="zv-acc-icon">+</span>
            </summary>
            <div class="zv-acc-body">
              <p>All orders are verified and dispatched within <strong>24–48 business hours</strong> from our US regional fulfillment hubs. Standard insured courier delivery takes <strong>3–5 business days</strong> via USPS, FedEx, or DHL Express. Full real-time doorstep tracking will be emailed immediately upon carrier scan.</p>
            </div>
          </details>

          <details class="zv-pdp-acc">
            <summary>
              <span>60-Day Money-Back Guarantee &amp; Warranty</span>
              <span class="zv-acc-icon">+</span>
            </summary>
            <div class="zv-acc-body">
              <p>Try it on your jobsite or workshop completely risk-free for <strong>60 days</strong>. If it doesn't meet your rigorous standards, simply email <strong>support@tryzavelyn.com</strong> for a full, hassle-free refund. Every unit also includes an automatic 1-Year Manufacturer Warranty against defects.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile & Desktop Sticky Purchase Bar -->
  {% if section.settings.enable_sticky_atc %}
    <div class="zv-pdp-sticky-bar" id="zvStickyBar">
      <div class="zv-sticky-inner">
        <div class="zv-sticky-media">
          {% if product.featured_image %}
            <img src="{{ product.featured_image | image_url: width: 100, height: 100, crop: 'center' }}" alt="{{ product.title | escape }}">
          {% endif %}
          <div class="zv-sticky-info">
            <span class="zv-sticky-title">{{ product.title | truncate: 32 }}</span>
            <span class="zv-sticky-price" id="zvStickyPrice">{{ current_variant.price | money }}</span>
          </div>
        </div>
        <button type="button" class="zv-sticky-atc-btn" onclick="zvAddToCart()">
          ADD TO CART ➔
        </button>
      </div>
    </div>
  {% endif %}
</div>

<!-- Product Data JSON for JavaScript Engine -->
<script type="application/json" id="zvProductJson">
  {{ product | json }}
</script>

<script>
  (function() {
    const productData = JSON.parse(document.getElementById('zvProductJson').textContent);
    let activeVariantId = {{ current_variant.id }};
    let activeQty = 1;
    {% if has_bundle_option %}
      {% assign b_idx = bundle_opt_index | minus: 1 %}
      let selectedBundle = '{{ product.options_with_values[b_idx].values.first | escape }}';
    {% else %}
      let selectedBundle = '';
    {% endif %}

    {% if product.options.size > 1 and secondary_opt_index > 0 %}
      {% assign s_idx = secondary_opt_index | minus: 1 %}
      let selectedSecondary = '{{ product.options_with_values[s_idx].values.first | escape }}';
    {% else %}
      let selectedSecondary = '';
    {% endif %}
    let selectedOptions = [
      {% for opt in product.options %}
        '{{ product.variants.first.options[forloop.index0] | escape }}'{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ];

    window.zvSwitchMainImg = function(src, btn) {
      const img = document.getElementById('zvPdpMainImg');
      if (img) img.src = src;
      document.querySelectorAll('.zv-pdp-thumb-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
    };

    window.zvChangeQty = function(delta) {
      const input = document.getElementById('zvPdpQtyInput');
      if (!input) return;
      let val = parseInt(input.value) || 1;
      val += delta;
      if (val < 1) val = 1;
      if (val > 50) val = 50;
      input.value = val;
      activeQty = val;
    };

    function updateActiveVariant(variant) {
      if (!variant) return;
      activeVariantId = variant.id;

      // Update Live Price
      const priceEl = document.getElementById('zvPdpLivePrice');
      if (priceEl) priceEl.innerText = formatMoney(variant.price);

      // Update Sticky Bar Price
      const stickyPrice = document.getElementById('zvStickyPrice');
      if (stickyPrice) stickyPrice.innerText = formatMoney(variant.price);

      // Update Compare At Price & Badges
      const compEl = document.getElementById('zvPdpComparePrice');
      const badgeEl = document.getElementById('zvPdpPriceBadge');
      const saveImgBadge = document.getElementById('zvPdpSaveBadge');
      const savePercentEl = document.getElementById('zvPdpSavePercent');

      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        const pct = Math.round((variant.compare_at_price - variant.price) * 100 / variant.compare_at_price);
        if (compEl) {
          compEl.innerText = formatMoney(variant.compare_at_price);
          compEl.classList.remove('hidden');
        }
        if (badgeEl) {
          badgeEl.innerText = 'SAVE ' + pct + '%';
          badgeEl.classList.remove('hidden');
        }
        if (saveImgBadge && savePercentEl) {
          savePercentEl.innerText = pct;
          saveImgBadge.classList.remove('hidden');
        }
      } else {
        if (compEl) compEl.classList.add('hidden');
        if (badgeEl) badgeEl.classList.add('hidden');
        if (saveImgBadge) saveImgBadge.classList.add('hidden');
      }

      // Update Variant Image if available
      if (variant.featured_image && variant.featured_image.src) {
        zvSwitchMainImg(variant.featured_image.src);
      }

      // Update Button state
      const atcBtn = document.getElementById('zvPdpAtcBtn');
      const atcText = document.getElementById('zvAtcBtnText');
      const buyNowBtn = document.getElementById('zvPdpBuyNowBtn');
      if (variant.available) {
        if (atcBtn) atcBtn.disabled = false;
        if (atcText) atcText.innerText = 'ADD TO CART ➔';
        if (buyNowBtn) buyNowBtn.disabled = false;
      } else {
        if (atcBtn) atcBtn.disabled = true;
        if (atcText) atcText.innerText = 'SOLD OUT';
        if (buyNowBtn) buyNowBtn.disabled = true;
      }
    }

    function formatMoney(cents) {
      return '$' + (cents / 100).toFixed(2);
    }

    window.zvSelectBundle = function(bundleVal, card) {
      selectedBundle = bundleVal;
      document.querySelectorAll('.zv-pdp-bcard').forEach(c => c.classList.remove('active'));
      if (card) card.classList.add('active');
      findAndApplyVariant();
    };

    window.zvSelectSecondary = function(secVal, chip) {
      selectedSecondary = secVal;
      const label = document.getElementById('zvActiveSecLabel');
      if (label) label.innerText = secVal;
      document.querySelectorAll('#zvSecondaryChips .zv-pdp-chip').forEach(c => c.classList.remove('active'));
      if (chip) chip.classList.add('active');
      findAndApplyVariant();
    };

    window.zvSelectStandardOption = function(optIdx, val, chip) {
      selectedOptions[optIdx] = val;
      const parent = chip.closest('.zv-pdp-opt-group');
      if (parent) {
        parent.querySelectorAll('.zv-pdp-chip').forEach(c => c.classList.remove('active'));
      }
      chip.classList.add('active');

      const matched = productData.variants.find(v => {
        return v.options.every((optVal, idx) => optVal === selectedOptions[idx]);
      });
      if (matched) updateActiveVariant(matched);
    };

    function findAndApplyVariant() {
      const matched = productData.variants.find(v => {
        const o1 = v.option1 || '';
        const o2 = v.option2 || '';
        const o3 = v.option3 || '';

        {% if has_bundle_option and product.options.size > 1 %}
          {% if bundle_opt_index == 1 %}
            return o1 === selectedBundle && o2 === selectedSecondary;
          {% else %}
            return o2 === selectedBundle && o1 === selectedSecondary;
          {% endif %}
        {% elsif has_bundle_option %}
          return o1 === selectedBundle;
        {% else %}
          return true;
        {% endif %}
      });
      if (matched) updateActiveVariant(matched);
    }

    // ATC Implementation with slide-out cart drawer integration
    window.zvAddToCart = async function() {
      const btn = document.getElementById('zvPdpAtcBtn');
      const btnText = document.getElementById('zvAtcBtnText');
      const origText = btnText ? btnText.innerText : 'ADD TO CART ➔';
      if (btn) btn.disabled = true;
      if (btnText) btnText.innerText = 'ADDING...';

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [{ id: activeVariantId, quantity: activeQty }]
          })
        });

        if (res.ok) {
          if (typeof window.willaOpenCartDrawer === 'function') {
            if (typeof window.willaRefreshCart === 'function') {
              await window.willaRefreshCart();
            }
            window.willaOpenCartDrawer();
            if (btn) btn.disabled = false;
            if (btnText) btnText.innerText = origText;
          } else {
            window.location.href = '/cart';
          }
        } else {
          window.location.href = '/cart/' + activeVariantId + ':' + activeQty;
        }
      } catch (e) {
        window.location.href = '/cart/' + activeVariantId + ':' + activeQty;
      }
    };

    // 1-Click Buy Now Implementation
    window.zvBuyNow = async function() {
      const btn = document.getElementById('zvPdpBuyNowBtn');
      if (btn) {
        btn.disabled = true;
        btn.innerText = '⚡ PROCEEDING TO CHECKOUT...';
      }
      try {
        await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [{ id: activeVariantId, quantity: activeQty }]
          })
        });
        window.location.href = '/checkout';
      } catch (e) {
        window.location.href = '/cart/' + activeVariantId + ':' + activeQty;
      }
    };

    // Sticky ATC Scroll Trigger
    function initStickyBar() {
      const atc = document.getElementById('zvPdpAtcBtn');
      const bar = document.getElementById('zvStickyBar');
      if (!atc || !bar) return;

      function onScroll() {
        const rect = atc.getBoundingClientRect();
        if (rect.bottom < 0) {
          bar.classList.add('visible');
        } else {
          bar.classList.remove('visible');
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      onScroll();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initStickyBar);
    } else {
      initStickyBar();
    }
  })();
</script>
`;

// 2. SECTION: zavelyn-pdp-ticker.liquid
const pdpTickerLiquid = `{% schema %}
{
  "name": "Zavelyn PDP Ticker",
  "settings": [],
  "presets": [{ "name": "Zavelyn PDP Ticker" }]
}
{% endschema %}

<div class="zv-ticker-wrap">
  <div class="zv-ticker-track">
    <div class="zv-ticker-item"><span>⚡</span> 24–48H DISPATCH FROM US FULFILLMENT HUBS</div>
    <div class="zv-ticker-item"><span>🛡️</span> 60-DAY RISK-FREE MONEY-BACK GUARANTEE</div>
    <div class="zv-ticker-item"><span>🛠️</span> INDUSTRIAL-GRADE HEAVY-DUTY MATERIALS</div>
    <div class="zv-ticker-item"><span>🔒</span> 256-BIT ENCRYPTED SAFE CHECKOUT</div>
    <div class="zv-ticker-item"><span>💬</span> DEDICATED US CONCIERGE CUSTOMER SUPPORT</div>

    <div class="zv-ticker-item"><span>⚡</span> 24–48H DISPATCH FROM US FULFILLMENT HUBS</div>
    <div class="zv-ticker-item"><span>🛡️</span> 60-DAY RISK-FREE MONEY-BACK GUARANTEE</div>
    <div class="zv-ticker-item"><span>🛠️</span> INDUSTRIAL-GRADE HEAVY-DUTY MATERIALS</div>
    <div class="zv-ticker-item"><span>🔒</span> 256-BIT ENCRYPTED SAFE CHECKOUT</div>
    <div class="zv-ticker-item"><span>💬</span> DEDICATED US CONCIERGE CUSTOMER SUPPORT</div>
  </div>
</div>
`;

// 3. SECTION: zavelyn-pdp-storytelling.liquid
const pdpStorytellingLiquid = `{% schema %}
{
  "name": "Zavelyn PDP Story",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Engineered for Harsh Conditions.<br><span>Built to Solve Real Jobsite Challenges.</span>" },
    { "type": "textarea", "id": "subhead", "label": "Subheadline", "default": "Stop wasting hours fighting seized, frozen, or broken parts with inferior consumer gadgets. Zavelyn provides industrial precision tools engineered to outlast and outperform." }
  ],
  "presets": [{ "name": "Zavelyn PDP Story" }]
}
{% endschema %}

<section class="zv-story-section">
  <div class="zv-story-container">
    <div class="zv-section-header">
      <span class="zv-card-badge" style="display:inline-block; margin-bottom:12px;">★ PRO-GRADE RELIABILITY</span>
      <h2>{{ section.settings.heading }}</h2>
      <p>{{ section.settings.subhead }}</p>
    </div>

    <div class="zv-story-grid">
      <div class="zv-story-card">
        <div class="zv-story-icon">⚙️</div>
        <h3>High-Toughness Alloys</h3>
        <p>Forged from heat-treated chrome-molybdenum and reinforced aerospace steels designed to handle extreme torque, impact vibration, and continuous heavy-duty use.</p>
      </div>

      <div class="zv-story-card">
        <div class="zv-story-icon">⏱️</div>
        <h3>Cuts Labor Time in Half</h3>
        <p>Eliminate endless hammering, stripped threads, and broken bolts. Automated vibration and precision extraction engineering get the toughest jobs done in minutes.</p>
      </div>

      <div class="zv-story-card">
        <div class="zv-story-icon">🛡️</div>
        <h3>Zero Damage to Engine Blocks</h3>
        <p>Engineered with exact-tolerance adaptors and controlled axial pull to ensure zero damage to delicate surrounding aluminum heads, cylinder casings, or threads.</p>
      </div>
    </div>
  </div>
</section>
`;

// 4. SECTION: zavelyn-pdp-comparison.liquid
const pdpComparisonLiquid = `{% schema %}
{
  "name": "Zavelyn PDP Comparison",
  "settings": [],
  "presets": [{ "name": "Zavelyn PDP Comparison" }]
}
{% endschema %}

<section class="zv-comparison-section">
  <div class="zv-section-header">
    <h2>The Zavelyn Difference</h2>
    <p>See why master mechanics and homesteaders upgrade to Zavelyn pro-grade gear.</p>
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
          <td><strong>Manufacturing Materials</strong></td>
          <td class="zv-brand-col"><span class="zv-check-icon">✔</span> Heat-Treated Cr-Mo &amp; Industrial Alloy</td>
          <td class="zv-other-col"><span class="zv-cross-icon">✘</span> Soft Cast Iron &amp; Brittle Pot Metals</td>
        </tr>
        <tr>
          <td><strong>Tolerance Precision</strong></td>
          <td class="zv-brand-col"><span class="zv-check-icon">✔</span> CNC Machined Exact-Tolerance Fit</td>
          <td class="zv-other-col"><span class="zv-cross-icon">✘</span> Loose Tolerances That Strip Threads</td>
        </tr>
        <tr>
          <td><strong>60-Day Trial Guarantee</strong></td>
          <td class="zv-brand-col"><span class="zv-check-icon">✔</span> Unconditional 60-Day Money-Back</td>
          <td class="zv-other-col"><span class="zv-cross-icon">✘</span> Restrictive 14-Day Or No Returns</td>
        </tr>
        <tr>
          <td><strong>Warranty Coverage</strong></td>
          <td class="zv-brand-col"><span class="zv-check-icon">✔</span> 1-Year Comprehensive Manufacturer Warranty</td>
          <td class="zv-other-col"><span class="zv-cross-icon">✘</span> Zero Warranty Once Used</td>
        </tr>
        <tr>
          <td><strong>Concierge Support</strong></td>
          <td class="zv-brand-col"><span class="zv-check-icon">✔</span> US-Based Support Team (Dallas, TX)</td>
          <td class="zv-other-col"><span class="zv-cross-icon">✘</span> Unresponsive Overseas Chatbots</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
`;

// 5. SECTION: zavelyn-pdp-shipping.liquid
const pdpShippingLiquid = `{% schema %}
{
  "name": "Zavelyn PDP Shipping",
  "settings": [],
  "presets": [{ "name": "Zavelyn PDP Shipping" }]
}
{% endschema %}

<section class="zv-shipping-section">
  <div class="zv-shipping-container">
    <div class="zv-shipping-card">
      <div class="zv-shipping-badge">
        <span>🚚</span> FAST &amp; INSURED TRACKED US DELIVERY
      </div>
      <h2>Doorstep Delivery Guarantee &amp; Real-Time Tracking</h2>
      <p class="zv-shipping-intro">
        Every Zavelyn order is cushioned in heavy-duty protective packaging, inspected for quality, and dispatched from regional US warehouses within <strong>24–48 business hours</strong>. We partner directly with <strong>USPS, FedEx, and DHL Express</strong> to guarantee rapid, dependable doorstep transit.
      </p>

      <div class="zv-shipping-grid">
        <div class="zv-ship-box">
          <span class="zv-ship-icon">⏱️</span>
          <strong>24–48h Dispatch</strong>
          <span>Rapid order processing from US regional hubs</span>
        </div>
        <div class="zv-ship-box">
          <span class="zv-ship-icon">📦</span>
          <strong>100% Insured Transit</strong>
          <span>Full protection against lost or damaged parcels</span>
        </div>
        <div class="zv-ship-box">
          <span class="zv-ship-icon">🔍</span>
          <strong>Live Doorstep Tracking</strong>
          <span>Instant carrier tracking notifications via SMS &amp; email</span>
        </div>
        <div class="zv-ship-box">
          <span class="zv-ship-icon">🛡️</span>
          <strong>60-Day Trial</strong>
          <span>Risk-free 60-day money-back guarantee on all tools</span>
        </div>
      </div>
    </div>
  </div>
</section>
`;

// 6. SECTION: zavelyn-pdp-faq.liquid
const pdpFaqLiquid = `{% schema %}
{
  "name": "Zavelyn PDP Full FAQ",
  "settings": [],
  "presets": [{ "name": "Zavelyn PDP Full FAQ" }]
}
{% endschema %}

<section class="zv-faq-section">
  <div class="zv-section-header">
    <h2>Frequently Asked Questions</h2>
    <p>Straightforward answers regarding shipping, warranty, returns, and tool maintenance.</p>
  </div>

  <div class="zv-faq-wrap">
    <div class="zv-faq-item">
      <button type="button" class="zv-faq-question" onclick="toggleZvFaq(this)">
        <span>How fast will my order arrive?</span>
        <span class="zv-faq-toggle">+</span>
      </button>
      <div class="zv-faq-answer">
        <p>All orders are verified and dispatched within 24–48 business hours from our US distribution centers. Standard courier shipping takes 3–5 business days via USPS, FedEx, or DHL Express. Real-time tracking is provided via email upon dispatch.</p>
      </div>
    </div>

    <div class="zv-faq-item">
      <button type="button" class="zv-faq-question" onclick="toggleZvFaq(this)">
        <span>How does the 60-Day Risk-Free Guarantee work?</span>
        <span class="zv-faq-toggle">+</span>
      </button>
      <div class="zv-faq-answer">
        <p>We believe in the rugged quality of our equipment. Try it on your equipment for 60 days. If you are not 100% satisfied with its build or performance, simply email support@tryzavelyn.com and our team will issue an immediate, hassle-free refund.</p>
      </div>
    </div>

    <div class="zv-faq-item">
      <button type="button" class="zv-faq-question" onclick="toggleZvFaq(this)">
        <span>What is covered under the 1-Year Manufacturer Warranty?</span>
        <span class="zv-faq-toggle">+</span>
      </button>
      <div class="zv-faq-answer">
        <p>Every Zavelyn hardware tool comes with an automatic 1-Year Comprehensive Warranty covering manufacturing defects, material stress fractures, and pneumatic component failures under ordinary use.</p>
      </div>
    </div>

    <div class="zv-faq-item">
      <button type="button" class="zv-faq-question" onclick="toggleZvFaq(this)">
        <span>Can I track my shipment online?</span>
        <span class="zv-faq-toggle">+</span>
      </button>
      <div class="zv-faq-answer">
        <p>Yes. You can visit our <a href="/pages/track-order" style="color:var(--zv-text-dark);font-weight:bold;">Track Order Page</a> and enter your tracking code or order confirmation number to follow carrier progress in real time.</p>
      </div>
    </div>
  </div>
</section>
`;

async function main() {
  const token = await getAccessToken();

  // 1. Append PDP CSS to zavelyn-elixir.css and upload
  let css = fs.readFileSync('scripts/zavelyn-elixir.css', 'utf-8');
  
  const pdpCss = `
/* ==========================================================================
   UNIVERSAL PDP SYSTEM STYLES (.zv-pdp-*)
   ========================================================================== */
.zv-pdp-wrap {
  background-color: var(--zv-bg-warm);
  color: var(--zv-text-dark);
  padding: 16px 20px 60px;
}
.zv-pdp-container {
  max-width: 1240px;
  margin: 0 auto;
}
.zv-pdp-breadcrumbs {
  font-size: 13px;
  color: var(--zv-text-muted);
  margin-bottom: 24px;
}
.zv-pdp-breadcrumbs a {
  color: var(--zv-text-muted);
  text-decoration: none;
}
.zv-pdp-breadcrumbs a:hover {
  color: var(--zv-text-dark);
}
.zv-pdp-breadcrumbs .sep {
  margin: 0 8px;
  opacity: 0.5;
}
.zv-pdp-breadcrumbs .curr {
  color: var(--zv-text-headings);
  font-weight: 600;
}

.zv-pdp-layout {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 48px;
  align-items: start;
}

/* Gallery Column */
.zv-pdp-gallery-col {
  position: sticky;
  top: 24px;
}
.zv-pdp-main-img-box {
  position: relative;
  background: #ffffff;
  border: 1.5px solid var(--zv-border-light);
  border-radius: var(--zv-radius-lg);
  overflow: hidden;
  box-shadow: var(--zv-shadow-card);
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.zv-pdp-main-img-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.2s ease;
}
.zv-pdp-img-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--zv-accent-sale);
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}
.zv-pdp-img-badge.hidden, .zv-pdp-compare-price.hidden, .zv-pdp-price-badge.hidden {
  display: none !important;
}

.zv-pdp-thumbs-row {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: thin;
}
.zv-pdp-thumb-btn {
  width: 76px;
  height: 76px;
  flex-shrink: 0;
  border-radius: var(--zv-radius-sm);
  border: 2px solid transparent;
  background: #ffffff;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  opacity: 0.65;
  transition: all 0.2s ease;
}
.zv-pdp-thumb-btn.active {
  border-color: var(--zv-text-dark);
  opacity: 1;
  box-shadow: 0 2px 8px rgba(23,67,60,0.15);
}
.zv-pdp-thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Purchase Column */
.zv-pdp-rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 12px;
}
.zv-pdp-stars {
  color: #16a34a;
  letter-spacing: 2px;
  font-size: 14px;
}
.zv-pdp-score {
  font-weight: 750;
  color: var(--zv-text-headings);
}
.zv-pdp-review-count {
  color: var(--zv-text-muted);
}

.zv-pdp-title {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.2;
  color: var(--zv-text-headings);
  letter-spacing: var(--zv-letter-spacing-heading);
  margin: 0 0 16px 0;
}

.zv-pdp-price-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
}
.zv-pdp-live-price {
  font-size: 34px;
  font-weight: 850;
  color: var(--zv-text-headings);
}
.zv-pdp-compare-price {
  font-size: 20px;
  text-decoration: line-through;
  color: var(--zv-text-muted);
  font-weight: 500;
}
.zv-pdp-price-badge {
  background: var(--zv-badge-bg);
  color: var(--zv-badge-text);
  font-size: 12px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 4px;
}

.zv-pdp-dispatch-tag {
  font-size: 13px;
  font-weight: 600;
  color: #059669;
  margin-bottom: 20px;
}

/* Key Benefits */
.zv-pdp-key-benefits {
  background: #ffffff;
  border: 1px solid var(--zv-border);
  border-radius: var(--zv-radius-md);
  padding: 14px 18px;
  margin-bottom: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.zv-pdp-kb-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--zv-text-dark);
}
.zv-pdp-kb-icon {
  font-size: 16px;
}

/* Variant & Bundle Section */
.zv-pdp-opt-label {
  display: block;
  font-size: 13px;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--zv-text-headings);
  margin-bottom: 10px;
}
.zv-pdp-bundle-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
}
.zv-pdp-bcard {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 2px solid var(--zv-border);
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}
.zv-pdp-bcard:hover {
  border-color: #cbd5e0;
}
.zv-pdp-bcard.active {
  border-color: var(--zv-text-dark);
  background: #fdfaf7;
  box-shadow: 0 4px 14px rgba(23,67,60,0.08);
}
.zv-bcard-radio {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e0;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}
.zv-pdp-bcard.active .zv-bcard-radio {
  border-color: var(--zv-text-dark);
}
.zv-pdp-bcard.active .zv-bcard-radio::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 8px;
  height: 8px;
  background: var(--zv-text-dark);
  border-radius: 50%;
}
.zv-bcard-info {
  flex: 1;
}
.zv-bcard-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.zv-bcard-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--zv-text-headings);
}
.zv-bcard-tag {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}
.zv-bcard-tag.standard {
  background: #edf2f7;
  color: #4a5568;
}
.zv-bcard-tag.popular {
  background: #e6fffa;
  color: #234e52;
}
.zv-bcard-tag.best-value {
  background: #feebc8;
  color: #7b341e;
}
.zv-bcard-pricing {
  text-align: right;
}
.zv-bcard-price {
  display: block;
  font-size: 16px;
  font-weight: 800;
  color: var(--zv-text-headings);
}
.zv-bcard-compare {
  display: block;
  font-size: 12px;
  text-decoration: line-through;
  color: var(--zv-text-muted);
}

.zv-pdp-chips-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.zv-pdp-chip {
  padding: 8px 16px;
  border: 1.5px solid var(--zv-border);
  border-radius: 20px;
  background: #ffffff;
  color: var(--zv-text-dark);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.zv-pdp-chip:hover {
  border-color: var(--zv-text-dark);
}
.zv-pdp-chip.active {
  background: var(--zv-text-dark);
  color: #ffffff;
  border-color: var(--zv-text-dark);
}

/* Actions & Buttons */
.zv-pdp-actions-row {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}
.zv-pdp-qty-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.zv-pdp-qty-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--zv-text-muted);
}
.zv-pdp-qty-ctrl {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--zv-border);
  border-radius: 40px;
  background: #ffffff;
  height: 52px;
  padding: 0 4px;
}
.zv-pdp-qty-ctrl button {
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  font-size: 18px;
  font-weight: 700;
  color: var(--zv-text-dark);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.zv-pdp-qty-ctrl input {
  width: 32px;
  border: none;
  background: none;
  text-align: center;
  font-size: 15px;
  font-weight: 750;
  color: var(--zv-text-headings);
}

.zv-pdp-atc-btn {
  flex: 1;
  height: 52px;
  background: var(--zv-accent-lime);
  color: #112a24;
  border: none;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(198,250,84,0.35);
  transition: all 0.2s ease;
}
.zv-pdp-atc-btn:hover:not(:disabled) {
  background: var(--zv-accent-lime-hover);
  transform: translateY(-1px);
}
.zv-pdp-atc-btn:disabled {
  background: #cbd5e0;
  color: #718096;
  cursor: not-allowed;
  box-shadow: none;
}

.zv-pdp-buynow-btn {
  width: 100%;
  height: 48px;
  background: #ffffff;
  color: var(--zv-text-dark);
  border: 2px solid var(--zv-text-dark);
  border-radius: 40px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  margin-bottom: 22px;
  transition: all 0.2s ease;
}
.zv-pdp-buynow-btn:hover:not(:disabled) {
  background: var(--zv-text-dark);
  color: #ffffff;
}

/* Payment Icons */
.zv-pdp-payment-box {
  background: #ffffff;
  border: 1px solid var(--zv-border);
  border-radius: var(--zv-radius-md);
  padding: 14px 16px;
  text-align: center;
  margin-bottom: 20px;
}
.zv-pdp-pay-header {
  font-size: 12px;
  font-weight: 700;
  color: var(--zv-text-muted);
  margin-bottom: 10px;
}
.zv-pdp-pay-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.zv-pdp-pay-tag svg {
  height: 24px;
  width: auto;
  display: block;
}

/* Trust Benefit Cards */
.zv-pdp-trust-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}
.zv-pdp-trust-card {
  background: #ffffff;
  border: 1px solid var(--zv-border);
  border-radius: var(--zv-radius-md);
  padding: 12px 10px;
  text-align: center;
}
.zv-pdp-trust-icon {
  font-size: 20px;
  display: block;
  margin-bottom: 4px;
}
.zv-pdp-trust-card strong {
  display: block;
  font-size: 11.5px;
  color: var(--zv-text-headings);
  line-height: 1.3;
}
.zv-pdp-trust-card span {
  display: block;
  font-size: 10.5px;
  color: var(--zv-text-muted);
}

/* Accordions */
.zv-pdp-accordions {
  border-top: 1px solid var(--zv-border);
}
.zv-pdp-acc {
  border-bottom: 1px solid var(--zv-border);
}
.zv-pdp-acc summary {
  padding: 16px 0;
  cursor: pointer;
  font-size: 15px;
  font-weight: 750;
  color: var(--zv-text-headings);
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
}
.zv-pdp-acc summary::-webkit-details-marker {
  display: none;
}
.zv-acc-icon {
  font-size: 18px;
  font-weight: 300;
  transition: transform 0.2s ease;
}
.zv-pdp-acc[open] .zv-acc-icon {
  transform: rotate(45deg);
}
.zv-acc-body {
  padding-bottom: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--zv-text-muted);
}

/* Sticky Bar */
.zv-pdp-sticky-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  border-top: 1.5px solid var(--zv-border);
  box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
  padding: 12px 20px;
  z-index: 999;
  transform: translateY(120%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}
.zv-pdp-sticky-bar.visible {
  transform: translateY(0);
}
.zv-sticky-inner {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.zv-sticky-media {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.zv-sticky-media img {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}
.zv-sticky-info {
  min-width: 0;
}
.zv-sticky-title {
  display: block;
  font-size: 13.5px;
  font-weight: 750;
  color: var(--zv-text-headings);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.zv-sticky-price {
  font-size: 15px;
  font-weight: 800;
  color: var(--zv-text-headings);
}
.zv-sticky-atc-btn {
  height: 44px;
  padding: 0 24px;
  background: var(--zv-accent-lime);
  color: #112a24;
  border: none;
  border-radius: 40px;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(198,250,84,0.3);
}

/* Storytelling & Shipping Sections */
.zv-story-section {
  padding: 60px 20px;
  background: var(--zv-bg-alt);
}
.zv-story-container {
  max-width: 1240px;
  margin: 0 auto;
}
.zv-story-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 36px;
}
.zv-story-card {
  background: #ffffff;
  padding: 28px 24px;
  border-radius: var(--zv-radius-lg);
  border: 1px solid var(--zv-border-light);
  box-shadow: var(--zv-shadow-subtle);
}
.zv-story-icon {
  font-size: 32px;
  margin-bottom: 14px;
}
.zv-story-card h3 {
  font-size: 18px;
  font-weight: 750;
  color: var(--zv-text-headings);
  margin: 0 0 10px 0;
}
.zv-story-card p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--zv-text-muted);
  margin: 0;
}

.zv-shipping-section {
  padding: 60px 20px;
  background: var(--zv-bg-warm);
}
.zv-shipping-container {
  max-width: 1040px;
  margin: 0 auto;
}
.zv-shipping-card {
  background: #ffffff;
  border: 1.5px solid var(--zv-border);
  border-radius: var(--zv-radius-lg);
  padding: 40px;
  box-shadow: var(--zv-shadow-card);
  text-align: center;
}
.zv-shipping-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--zv-badge-bg);
  color: var(--zv-badge-text);
  font-size: 11.5px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}
.zv-shipping-card h2 {
  font-size: 28px;
  font-weight: 800;
  color: var(--zv-text-headings);
  margin: 0 0 16px 0;
}
.zv-shipping-intro {
  font-size: 15px;
  line-height: 1.6;
  color: var(--zv-text-muted);
  max-width: 780px;
  margin: 0 auto 32px auto;
}
.zv-shipping-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.zv-ship-box {
  background: var(--zv-bg-warm);
  border: 1px solid var(--zv-border-light);
  border-radius: var(--zv-radius-md);
  padding: 18px 12px;
  text-align: center;
}
.zv-ship-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}
.zv-ship-box strong {
  display: block;
  font-size: 13.5px;
  color: var(--zv-text-headings);
  margin-bottom: 4px;
}
.zv-ship-box span {
  display: block;
  font-size: 12px;
  color: var(--zv-text-muted);
  line-height: 1.4;
}

/* Mobile Responsiveness */
@media (max-width: 900px) {
  .zv-pdp-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .zv-pdp-gallery-col {
    position: static;
  }
  .zv-pdp-title {
    font-size: 26px;
  }
  .zv-pdp-live-price {
    font-size: 28px;
  }
  .zv-story-grid {
    grid-template-columns: 1fr;
  }
  .zv-shipping-grid {
    grid-template-columns: 1fr 1fr;
  }
  .zv-shipping-card {
    padding: 24px 16px;
  }
}
@media (max-width: 500px) {
  .zv-pdp-trust-grid {
    grid-template-columns: 1fr;
  }
  .zv-shipping-grid {
    grid-template-columns: 1fr;
  }
  .zv-pdp-actions-row {
    flex-direction: column;
  }
  .zv-pdp-qty-ctrl {
    width: 100%;
    justify-content: space-between;
  }
}
`;

  if (!css.includes('UNIVERSAL PDP SYSTEM STYLES')) {
    css += '\n' + pdpCss;
    fs.writeFileSync('scripts/zavelyn-elixir.css', css, 'utf-8');
  }

  await uploadAsset(token, 'assets/zavelyn-elixir.css', css);

  // 2. Upload PDP Sections
  await uploadAsset(token, 'sections/zavelyn-pdp-main.liquid', pdpMainLiquid);
  await uploadAsset(token, 'sections/zavelyn-pdp-ticker.liquid', pdpTickerLiquid);
  await uploadAsset(token, 'sections/zavelyn-pdp-storytelling.liquid', pdpStorytellingLiquid);
  await uploadAsset(token, 'sections/zavelyn-pdp-comparison.liquid', pdpComparisonLiquid);
  await uploadAsset(token, 'sections/zavelyn-pdp-shipping.liquid', pdpShippingLiquid);
  await uploadAsset(token, 'sections/zavelyn-pdp-faq.liquid', pdpFaqLiquid);

  // 3. Update templates/product.json on Draft Theme
  const newProductJson = {
    "sections": {
      "main": {
        "type": "zavelyn-pdp-main",
        "settings": {
          "show_breadcrumbs": true,
          "show_rating": false,
          "shipping_threshold_text": "⚡ In Stock · Dispatched within 24–48h from US Warehouses",
          "enable_sticky_atc": true
        }
      },
      "ticker": {
        "type": "zavelyn-pdp-ticker",
        "settings": {}
      },
      "storytelling": {
        "type": "zavelyn-pdp-storytelling",
        "settings": {
          "heading": "Engineered for Harsh Conditions.<br><span>Built to Solve Real Jobsite Challenges.</span>",
          "subhead": "Stop wasting hours fighting seized, frozen, or broken parts with inferior consumer gadgets. Zavelyn provides industrial precision tools engineered to outlast and outperform."
        }
      },
      "comparison": {
        "type": "zavelyn-pdp-comparison",
        "settings": {}
      },
      "shipping_guarantee": {
        "type": "zavelyn-pdp-shipping",
        "settings": {}
      },
      "reviews": {
        "type": "willa-reviews",
        "settings": {
          "heading": "What Verified Customers Are Saying",
          "subtitle": "Real feedback from craftsmen, farmers, and homeowners across North America."
        }
      },
      "faq": {
        "type": "zavelyn-pdp-faq",
        "settings": {}
      }
    },
    "order": [
      "main",
      "ticker",
      "storytelling",
      "comparison",
      "shipping_guarantee",
      "reviews",
      "faq"
    ]
  };

  await uploadAsset(token, 'templates/product.json', JSON.stringify(newProductJson, null, 2));

  console.log('\n======================================================');
  console.log('🎉 UNIVERSAL PRODUCT PAGE SYSTEM DEPLOYED TO DRAFT!');
  console.log(`Draft Theme ID: ${DRAFT_THEME_ID}`);
  console.log(`Test PDP Link: https://${SHOP}/products/sakerplus®-universal-diesel-injector-removal-kit-clearance-sale?preview_theme_id=${DRAFT_THEME_ID}`);
  console.log('======================================================');
}

main().catch(console.error);
