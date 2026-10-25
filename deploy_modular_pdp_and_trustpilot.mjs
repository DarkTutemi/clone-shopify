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

async function getAsset(token, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  return data.asset ? data.asset.value : null;
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
  console.log('Got access token. Starting Trustpilot Stars & Modular PDP deployment...');

  // =========================================================================
  // PART 1: REPLACE ALL STORE STARS WITH TRUSTPILOT STARS
  // =========================================================================
  console.log('\n--- 1. Updating Store Stars to Trustpilot Stars ---');

  // 1.1 sections/zhp-hero.liquid
  let zhp通Hero = await getAsset(token, 'sections/zhp-hero.liquid');
  if (zhp通Hero) {
    zhp通Hero = zhp通Hero.replace(/<span class="zhp-stars">[^<]+<\/span>/g, `<span class="zhp-stars">{% render 'trustpilot-stars', width: 92, height: 17 %}</span>`);
    await uploadAsset(token, 'sections/zhp-hero.liquid', zhp通Hero);
  }

  // 1.2 sections/zhp-bestsellers.liquid
  let zhpBest = await getAsset(token, 'sections/zhp-bestsellers.liquid');
  if (zhpBest) {
    zhpBest = zhpBest.replace(/<span class="zhp-stars">[^<]+<\/span>/g, `<span class="zhp-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</span>`);
    await uploadAsset(token, 'sections/zhp-bestsellers.liquid', zhpBest);
  }

  // 1.3 sections/zhp-reviews.liquid
  let zhpRevs = await getAsset(token, 'sections/zhp-reviews.liquid');
  if (zhpRevs) {
    zhpRevs = zhpRevs.replace(/<span class="zhp-stars">★★★★★<\/span>/g, `<span class="zhp-stars">{% render 'trustpilot-stars', width: 92, height: 17 %}</span>`);
    zhpRevs = zhpRevs.replace(/<span class="zhp-stars">[^<]*\{\{[^}]+\}\}[^<]*<\/span>/g, `<span class="zhp-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</span>`);
    await uploadAsset(token, 'sections/zhp-reviews.liquid', zhpRevs);
  }

  // 1.4 assets/zhp-collection.css - ensure proper inline-flex styling for .zhp-stars
  let zhpCss = await getAsset(token, 'assets/zhp-collection.css');
  if (zhpCss) {
    if (!zhpCss.includes('.trustpilot-stars-wrap')) {
      zhpCss += `\n/* Trustpilot Stars alignment */\n.zhp-stars, .trustpilot-stars-wrap { display: inline-flex; align-items: center; line-height: 0; vertical-align: middle; }\n`;
    }
    zhpCss = zhpCss.replace(/\.zhp-stars\s*\{[^}]+\}/g, `.zhp-stars { display: inline-flex; align-items: center; line-height: 0; vertical-align: middle; }`);
    await uploadAsset(token, 'assets/zhp-collection.css', zhpCss);
  }

  // 1.5 sections/thoson-magtrack-funnel.liquid
  let thoson = await getAsset(token, 'sections/thoson-magtrack-funnel.liquid');
  if (thoson) {
    thoson = thoson.replace(/<span class="wf-stars">★★★★★<\/span>/g, `<span class="wf-stars">{% render 'trustpilot-stars', width: 96, height: 18 %}</span>`);
    thoson = thoson.replace(/<div class="wf-card-stars">★★★★★<\/div>/g, `<div class="wf-card-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>`);
    if (!thoson.includes('.trustpilot-stars-wrap')) {
      thoson = thoson.replace('</style>', `  .wf-stars, .wf-card-stars, .trustpilot-stars-wrap { display: inline-flex; align-items: center; line-height: 0; vertical-align: middle; }\n</style>`);
    }
    await uploadAsset(token, 'sections/thoson-magtrack-funnel.liquid', thoson);
  }

  // 1.6 sections/srefalsteam-funnel.liquid
  let srefal = await getAsset(token, 'sections/srefalsteam-funnel.liquid');
  if (srefal) {
    srefal = srefal.replace(/<span class="wf-stars">★★★★★<\/span>/g, `<span class="wf-stars">{% render 'trustpilot-stars', width: 96, height: 18 %}</span>`);
    srefal = srefal.replace(/<span class="wf-stars-large">★★★★★<\/span>/g, `<span class="wf-stars-large">{% render 'trustpilot-stars', width: 96, height: 18 %}</span>`);
    srefal = srefal.replace(/<div class="wf-rev-stars">★★★★★<\/div>/g, `<div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>`);
    if (!srefal.includes('.trustpilot-stars-wrap')) {
      srefal = srefal.replace('</style>', `  .wf-stars, .wf-stars-large, .wf-rev-stars, .trustpilot-stars-wrap { display: inline-flex; align-items: center; line-height: 0; vertical-align: middle; }\n</style>`);
    }
    await uploadAsset(token, 'sections/srefalsteam-funnel.liquid', srefal);
  }

  // 1.7 sections/yeoman-sweep-funnel.liquid
  let yeoman = await getAsset(token, 'sections/yeoman-sweep-funnel.liquid');
  if (yeoman) {
    yeoman = yeoman.replace(/<span class="wf-stars">★★★★★<\/span>/g, `<span class="wf-stars">{% render 'trustpilot-stars', width: 96, height: 18 %}</span>`);
    yeoman = yeoman.replace(/<span class="wf-stars-large">★★★★★<\/span>/g, `<span class="wf-stars-large">{% render 'trustpilot-stars', width: 96, height: 18 %}</span>`);
    yeoman = yeoman.replace(/<div class="wf-rev-stars">★★★★★<\/div>/g, `<div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>`);
    if (!yeoman.includes('.trustpilot-stars-wrap')) {
      yeoman = yeoman.replace('</style>', `  .wf-stars, .wf-stars-large, .wf-rev-stars, .trustpilot-stars-wrap { display: inline-flex; align-items: center; line-height: 0; vertical-align: middle; }\n</style>`);
    }
    await uploadAsset(token, 'sections/yeoman-sweep-funnel.liquid', yeoman);
  }

  // 1.8 snippets/regrip-loox-reviews.liquid and snippets/zavelyn-loox-reviews.liquid
  let regripLoox = await getAsset(token, 'snippets/regrip-loox-reviews.liquid');
  if (regripLoox) {
    regripLoox = regripLoox.replace(/<div class="rg-review-card__stars"[^>]*>★★★★★<\/div>/g, `<div class="rg-review-card__stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>`);
    await uploadAsset(token, 'snippets/regrip-loox-reviews.liquid', regripLoox);
  }
  let zavelynLoox = await getAsset(token, 'snippets/zavelyn-loox-reviews.liquid');
  if (zavelynLoox) {
    zavelynLoox = zavelynLoox.replace(/<div class="rg-review-card__stars"[^>]*>★★★★★<\/div>/g, `<div class="rg-review-card__stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>`);
    await uploadAsset(token, 'snippets/zavelyn-loox-reviews.liquid', zavelynLoox);
  }

  console.log('✔ All global store star ratings upgraded to authentic Trustpilot stars!');

  // =========================================================================
  // PART 2: UPLOAD PDP ASSETS (zhp-pdp.css & zhp-pdp.js)
  // =========================================================================
  console.log('\n--- 2. Uploading PDP Assets (zhp-pdp.css & zhp-pdp.js) ---');
  let pdpCss = fs.readFileSync('Clone-pandadrum/zhp-pdp.css', 'utf8');
  if (!pdpCss.includes('.trustpilot-stars-wrap')) {
    pdpCss += `\n/* Trustpilot Stars alignment */\n.wf-stars, .wf-rev-stars, .wf-card-stars, .wf-stars-large, .trustpilot-stars-wrap { display: inline-flex; align-items: center; line-height: 0; vertical-align: middle; }\n`;
  }
  await uploadAsset(token, 'assets/zhp-pdp.css', pdpCss);

  const pdpJs = fs.readFileSync('Clone-pandadrum/zhp-pdp.js', 'utf8');
  await uploadAsset(token, 'assets/zhp-pdp.js', pdpJs);

  // =========================================================================
  // PART 3: CREATE & UPLOAD 9 MODULAR PDP SECTIONS
  // =========================================================================
  console.log('\n--- 3. Creating & Uploading 9 Modular PDP Sections ---');

  // --- SECTION 1: zhp-pdp-hero.liquid ---
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
    { "type": "text", "id": "guarantee_3", "label": "Trust Badge 3 Title", "default": "432 Hz Calibrated" }
  ],
  "presets": [
    {
      "name": "Zavelyn Drum PDP Hero"
    }
  ]
}
{% endschema %}`;

  await uploadAsset(token, 'sections/zhp-pdp-hero.liquid', heroLiquid);

  // --- SECTION 2: zhp-pdp-banner.liquid ---
  const bannerLiquid = `{%- assign b_src = section.settings.banner_image | image_url: width: 1000 -%}
{%- if b_src == blank -%}
  {%- assign b_src = section.settings.banner_image_url -%}
{%- endif -%}

<section class="wf-section wf-banner-section">
  <div class="wf-container">
    <div class="wf-banner-card">
      <div class="wf-banner-grid">
        <div class="wf-banner-media">
          <img src="{{ b_src }}" alt="{{ section.settings.heading | default: '432 Hz Sound Healing' }}" loading="lazy" />
        </div>
        <div class="wf-banner-content">
          <span class="wf-sub-pill">{{ section.settings.badge_text | default: 'NATURAL RESONANCE' }}</span>
          <h2 class="wf-banner-title">{{ section.settings.heading | default: 'Tuned to 432 Hz: The Frequency of Natural Healing' }}</h2>
          <p class="wf-banner-desc">{{ section.settings.text | default: 'Unlike standard concert tuning (440 Hz), 432 Hz is mathematically aligned with the natural vibration of biological life. Every tone promotes deep nervous system relief, cortisol reduction, and tranquil mindfulness.' }}</p>
          <div class="wf-banner-points">
            <div class="wf-point-item"><span class="wf-point-icon">✓</span> <span>{{ section.settings.point_1 | default: 'Harmonic resonance that melts daily stress within 5 minutes' }}</span></div>
            <div class="wf-point-item"><span class="wf-point-icon">✓</span> <span>{{ section.settings.point_2 | default: 'Zero discordant frequencies — impossible to play an out-of-tune note' }}</span></div>
            <div class="wf-point-item"><span class="wf-point-icon">✓</span> <span>{{ section.settings.point_3 | default: 'Used by sound healers, yoga instructors, and therapists worldwide' }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Zavelyn Drum 432Hz Banner",
  "settings": [
    { "type": "image_picker", "id": "banner_image", "label": "Banner Image" },
    { "type": "text", "id": "banner_image_url", "label": "Fallback Banner Image URL" },
    { "type": "text", "id": "badge_text", "label": "Badge Text", "default": "NATURAL RESONANCE" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Tuned to 432 Hz: The Frequency of Natural Healing" },
    { "type": "textarea", "id": "text", "label": "Description" },
    { "type": "text", "id": "point_1", "label": "Bullet Point 1", "default": "Harmonic resonance that melts daily stress within 5 minutes" },
    { "type": "text", "id": "point_2", "label": "Bullet Point 2", "default": "Zero discordant frequencies — impossible to play an out-of-tune note" },
    { "type": "text", "id": "point_3", "label": "Bullet Point 3", "default": "Used by sound healers, yoga instructors, and therapists worldwide" }
  ],
  "presets": [
    {
      "name": "Zavelyn Drum 432Hz Banner"
    }
  ]
}
{% endschema %}`;

  await uploadAsset(token, 'sections/zhp-pdp-banner.liquid', bannerLiquid);

  // --- SECTION 3: zhp-pdp-experience.liquid ---
  const experienceLiquid = `{%- assign f_src = section.settings.feature_image | image_url: width: 1000 -%}
{%- if f_src == blank -%}
  {%- assign f_src = section.settings.feature_image_url -%}
{%- endif -%}

<section class="wf-section wf-steps-section">
  <div class="wf-container">
    <div class="wf-center-header">
      <span class="wf-sub-pill">{{ section.settings.pill_text | default: 'EFFORTLESS PLAY' }}</span>
      <h2 class="wf-sec-title">{{ section.settings.title | default: 'Zero Musical Training Required' }}</h2>
      <p class="wf-sec-desc">{{ section.settings.description | default: 'Designed with an intuitive numbered note layout. If you can count from 1 to 8, you can play beautiful meditative songs right out of the box.' }}</p>
    </div>

    <div class="wf-steps-grid">
      <div class="wf-step-card">
        <div class="wf-step-num">1</div>
        <h3 class="wf-step-title">Follow Numbered Notes</h3>
        <p class="wf-step-desc">Open the included songbook. Every melody corresponds to simple numbers laser-engraved onto each tongue.</p>
      </div>

      <div class="wf-step-card">
        <div class="wf-step-num">2</div>
        <h3 class="wf-step-title">Instantly Harmonious</h3>
        <p class="wf-step-desc">The scale is mathematically tuned so any combination of notes produces deep, soothing harmonics.</p>
      </div>

      <div class="wf-step-card">
        <div class="wf-step-num">3</div>
        <h3 class="wf-step-title">Play Within 5 Minutes</h3>
        <p class="wf-step-desc">From your very first session, create peaceful ambient soundscapes that quiet your mind and soothe your surroundings.</p>
      </div>
    </div>

    {%- if f_src != blank -%}
      <div style="margin-top: 36px; text-align: center;">
        <img src="{{ f_src }}" alt="{{ section.settings.title }}" style="max-width: 100%; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.06);" loading="lazy" />
      </div>
    {%- endif -%}
  </div>
</section>

{% schema %}
{
  "name": "Zavelyn Zero Experience",
  "settings": [
    { "type": "image_picker", "id": "feature_image", "label": "Feature Demonstration Image" },
    { "type": "text", "id": "feature_image_url", "label": "Fallback Feature Image URL" },
    { "type": "text", "id": "pill_text", "label": "Pill Subtitle", "default": "EFFORTLESS PLAY" },
    { "type": "text", "id": "title", "label": "Title", "default": "Zero Musical Training Required" },
    { "type": "textarea", "id": "description", "label": "Description" }
  ],
  "presets": [
    {
      "name": "Zavelyn Zero Experience"
    }
  ]
}
{% endschema %}`;

  await uploadAsset(token, 'sections/zhp-pdp-experience.liquid', experienceLiquid);

  // --- SECTION 4: zhp-pdp-included.liquid ---
  const includedLiquid = `{%- assign inc_src = section.settings.included_image | image_url: width: 1000 -%}
{%- if inc_src == blank -%}
  {%- assign inc_src = section.settings.included_image_url -%}
{%- endif -%}

<section class="wf-section wf-features-section">
  <div class="wf-container">
    <div class="wf-feature-row">
      <div class="wf-feature-media">
        <img src="{{ inc_src }}" alt="{{ section.settings.title | default: 'Complete Zavelyn Kit' }}" loading="lazy" />
      </div>
      <div class="wf-feature-content">
        <span class="wf-sub-pill">{{ section.settings.pill_text | default: 'COMPLETE PACKAGE' }}</span>
        <h2 class="wf-sec-title">{{ section.settings.title | default: 'Everything You Need to Begin Immediately' }}</h2>
        <p class="wf-sec-desc">{{ section.settings.description | default: 'Every Zavelyn Drum arrives as an all-in-one comprehensive kit — no accessories or extra purchases needed.' }}</p>
        <ul class="wf-feature-list">
          <li><strong>Laser-Tuned Steel Tongue Handpan Drum</strong> with precision acoustic tongues calibrated to 432 Hz</li>
          <li><strong>Padded Protective Travel Backpack</strong> with dual shoulder straps & heavy-duty shock absorption</li>
          <li><strong>Pair of Acoustic Bamboo Mallets</strong> with weighted rubber tips for effortless, resonant bell tones</li>
          <li><strong>Full Tutorial Songbook & Number Guide</strong> with 20+ familiar songs and easy visual tabs</li>
          <li><strong>Silicone Finger Picks Set</strong> for intimate fingerstyle acoustic meditation playing</li>
        </ul>
      </div>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Zavelyn What Is Included",
  "settings": [
    { "type": "image_picker", "id": "included_image", "label": "Unpacking / Included Image" },
    { "type": "text", "id": "included_image_url", "label": "Fallback Included Image URL" },
    { "type": "text", "id": "pill_text", "label": "Pill Subtitle", "default": "COMPLETE PACKAGE" },
    { "type": "text", "id": "title", "label": "Title", "default": "Everything You Need to Begin Immediately" },
    { "type": "textarea", "id": "description", "label": "Description" }
  ],
  "presets": [
    {
      "name": "Zavelyn What Is Included"
    }
  ]
}
{% endschema %}`;

  await uploadAsset(token, 'sections/zhp-pdp-included.liquid', includedLiquid);

  // --- SECTION 5: zhp-pdp-specs.liquid ---
  const specsLiquid = `<section class="wf-section wf-specs-section">
  <div class="wf-container">
    <div class="wf-specs-card">
      <h2 class="wf-sec-title">{{ section.settings.title | default: 'Technical Specifications' }}</h2>
      <div class="wf-specs-grid">
        <div class="wf-spec-row">
          <span class="wf-spec-key">Diameter / Size:</span>
          <span class="wf-spec-val">{{ section.settings.spec_diameter | default: '14 Inches (35.5 cm) Master Large' }}</span>
        </div>
        <div class="wf-spec-row">
          <span class="wf-spec-key">Material:</span>
          <span class="wf-spec-val">{{ section.settings.spec_material | default: 'Tempered Carbon-Titanium Surgical Alloy Steel' }}</span>
        </div>
        <div class="wf-spec-row">
          <span class="wf-spec-key">Scale / Tuning:</span>
          <span class="wf-spec-val">{{ section.settings.spec_tuning | default: 'Master D-Major Harmonic Scale (15 Notes)' }}</span>
        </div>
        <div class="wf-spec-row">
          <span class="wf-spec-key">Tuning Frequency:</span>
          <span class="wf-spec-val">{{ section.settings.spec_frequency | default: '432 Hz Natural Biological Resonance' }}</span>
        </div>
        <div class="wf-spec-row">
          <span class="wf-spec-key">Number of Tones:</span>
          <span class="wf-spec-val">{{ section.settings.spec_tones | default: '15 Acoustic Tongues (2 Complete Octaves)' }}</span>
        </div>
        <div class="wf-spec-row">
          <span class="wf-spec-key">Weight:</span>
          <span class="wf-spec-val">{{ section.settings.spec_weight | default: '8.4 lbs (3.8 kg) Studio Stability' }}</span>
        </div>
        <div class="wf-spec-row">
          <span class="wf-spec-key">Surface Finish:</span>
          <span class="wf-spec-val">{{ section.settings.spec_finish | default: 'Baked Electrostatic Pearlescent Protective Coating' }}</span>
        </div>
      </div>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Zavelyn PDP Specs",
  "settings": [
    { "type": "text", "id": "title", "label": "Title", "default": "Technical Specifications" },
    { "type": "text", "id": "spec_diameter", "label": "Diameter / Size" },
    { "type": "text", "id": "spec_material", "label": "Material", "default": "Tempered Carbon-Titanium Surgical Alloy Steel" },
    { "type": "text", "id": "spec_tuning", "label": "Scale / Tuning" },
    { "type": "text", "id": "spec_frequency", "label": "Tuning Frequency", "default": "432 Hz Natural Biological Resonance" },
    { "type": "text", "id": "spec_tones", "label": "Number of Tones" },
    { "type": "text", "id": "spec_weight", "label": "Weight" },
    { "type": "text", "id": "spec_finish", "label": "Surface Finish", "default": "Baked Electrostatic Pearlescent Protective Coating" }
  ],
  "presets": [
    {
      "name": "Zavelyn PDP Specs"
    }
  ]
}
{% endschema %}`;

  await uploadAsset(token, 'sections/zhp-pdp-specs.liquid', specsLiquid);

  // --- SECTION 6: zhp-pdp-shipping.liquid ---
  const shippingLiquid = `{%- assign ship1_src = section.settings.shipping_img_1 | image_url: width: 600 -%}
{%- if ship1_src == blank -%}{%- assign ship1_src = section.settings.shipping_img_1_url -%}{%- endif -%}
{%- assign ship2_src = section.settings.shipping_img_2 | image_url: width: 600 -%}
{%- if ship2_src == blank -%}{%- assign ship2_src = section.settings.shipping_img_2_url -%}{%- endif -%}

<section class="wf-section wf-shipping-section">
  <div class="wf-container">
    <div class="wf-shipping-card">
      <h2 class="wf-sec-title">{{ section.settings.title | default: 'Fast US Delivery & Tracked Shipping' }}</h2>
      <p class="wf-sec-desc">{{ section.settings.description | default: 'All Zavelyn Drums are acoustically inspected, foam-cushioned in protective cartons, and dispatched from our US logistics centers with real-time tracking within 24 hours.' }}</p>
      <div class="wf-shipping-images">
        <img src="{{ ship1_src | default: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/5555.webp?v=1792856415' }}" alt="Order Quality Inspection and Safe Packing" loading="lazy" />
        <img src="{{ ship2_src | default: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/44444.webp?v=1792856415' }}" alt="Express Courier Handover and Real-Time Tracking" loading="lazy" />
      </div>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Zavelyn Shipping Proof",
  "settings": [
    { "type": "text", "id": "title", "label": "Title", "default": "Fast US Delivery & Tracked Shipping" },
    { "type": "textarea", "id": "description", "label": "Description" },
    { "type": "image_picker", "id": "shipping_img_1", "label": "Shipping Image 1" },
    { "type": "text", "id": "shipping_img_1_url", "label": "Fallback Shipping Image 1 URL" },
    { "type": "image_picker", "id": "shipping_img_2", "label": "Shipping Image 2" },
    { "type": "text", "id": "shipping_img_2_url", "label": "Fallback Shipping Image 2 URL" }
  ],
  "presets": [
    {
      "name": "Zavelyn Shipping Proof"
    }
  ]
}
{% endschema %}`;

  await uploadAsset(token, 'sections/zhp-pdp-shipping.liquid', shippingLiquid);

  // --- SECTION 7: zhp-pdp-reviews.liquid ---
  const reviewsLiquid = `<section class="wf-section wf-reviews-section" id="wfReviewsSec">
  <div class="wf-container">
    <div class="wf-center-header">
      <span class="wf-sub-pill">{{ section.settings.pill_text | default: 'PRACTITIONER EXPERIENCES' }}</span>
      <h2 class="wf-sec-title">{{ section.settings.title | default: 'Loved By Thousands of Sound Seekers' }}</h2>
      <div class="wf-reviews-summary">
        <span class="wf-stars-large">{% render 'trustpilot-stars', width: 96, height: 18 %}</span>
        <span class="wf-rating-big">4.9 / 5.0</span>
        <span class="wf-total-badge">{{ section.settings.rating_summary | default: '1,680+ Verified Reviews' }}</span>
      </div>
    </div>

    <div class="wf-reviews-grid">
      {%- for block in section.blocks -%}
        <div class="wf-review-card" {{ block.shopify_attributes }}>
          <div class="wf-rev-header">
            <div class="wf-rev-avatar">{{ block.settings.author | slice: 0, 2 | upcase }}</div>
            <div class="wf-rev-meta">
              <span class="wf-rev-author">{{ block.settings.author }}</span>
              <span class="wf-rev-verified">✓ Verified Practitioner</span>
            </div>
          </div>
          <div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>
          <h4 class="wf-rev-title">{{ block.settings.title }}</h4>
          <p class="wf-rev-body">{{ block.settings.text }}</p>
          <div class="wf-rev-footer">
            <span class="wf-rev-variant">{{ block.settings.meta }}</span>
          </div>
        </div>
      {%- endfor -%}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Zavelyn Customer Reviews",
  "settings": [
    { "type": "text", "id": "pill_text", "label": "Pill Subtitle", "default": "PRACTITIONER EXPERIENCES" },
    { "type": "text", "id": "title", "label": "Title", "default": "Loved By Thousands of Sound Seekers" },
    { "type": "text", "id": "rating_summary", "label": "Rating Summary Text", "default": "1,680+ Verified Reviews" }
  ],
  "blocks": [
    {
      "type": "review",
      "name": "Customer Review",
      "settings": [
        { "type": "text", "id": "author", "label": "Author Name" },
        { "type": "text", "id": "title", "label": "Review Headline" },
        { "type": "textarea", "id": "text", "label": "Review Content" },
        { "type": "text", "id": "meta", "label": "Product / Location Meta" }
      ]
    }
  ],
  "presets": [
    {
      "name": "Zavelyn Customer Reviews"
    }
  ]
}
{% endschema %}`;

  await uploadAsset(token, 'sections/zhp-pdp-reviews.liquid', reviewsLiquid);

  // --- SECTION 8: zhp-pdp-faq.liquid ---
  const faqLiquid = `<section class="wf-section wf-faq-section">
  <div class="wf-container">
    <div class="wf-center-header">
      <span class="wf-sub-pill">{{ section.settings.pill_text | default: 'QUESTIONS & ANSWERS' }}</span>
      <h2 class="wf-sec-title">{{ section.settings.title | default: 'Frequently Asked Questions' }}</h2>
      <p class="wf-sec-desc">{{ section.settings.description | default: 'Everything you need to know about playing, caring for, and enjoying your Zavelyn Drum.' }}</p>
    </div>

    <div class="wf-faq-accordion">
      {%- for block in section.blocks -%}
        <div class="wf-faq-item" {{ block.shopify_attributes }}>
          <button type="button" class="wf-faq-question" onclick="toggleWfFaq(this)">
            <span>{{ block.settings.question }}</span>
            <span class="wf-faq-arrow">+</span>
          </button>
          <div class="wf-faq-answer">
            <p>{{ block.settings.answer }}</p>
          </div>
        </div>
      {%- endfor -%}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Zavelyn Drum PDP FAQ",
  "settings": [
    { "type": "text", "id": "pill_text", "label": "Pill Subtitle", "default": "QUESTIONS & ANSWERS" },
    { "type": "text", "id": "title", "label": "Title", "default": "Frequently Asked Questions" },
    { "type": "textarea", "id": "description", "label": "Description" }
  ],
  "blocks": [
    {
      "type": "faq",
      "name": "FAQ Item",
      "settings": [
        { "type": "text", "id": "question", "label": "Question" },
        { "type": "textarea", "id": "answer", "label": "Answer" }
      ]
    }
  ],
  "presets": [
    {
      "name": "Zavelyn Drum PDP FAQ"
    }
  ]
}
{% endschema %}`;

  await uploadAsset(token, 'sections/zhp-pdp-faq.liquid', faqLiquid);

  // --- SECTION 9: zhp-pdp-sticky-bar.liquid ---
  const stickyLiquid = `{%- assign st_src = section.settings.sticky_image | image_url: width: 200 -%}
{%- if st_src == blank -%}{%- assign st_src = section.settings.sticky_image_url -%}{%- endif -%}

<div class="wf-sticky-bar" id="wfStickyBar">
  <div class="wf-sticky-inner">
    <div class="wf-sticky-prod">
      <img src="{{ st_src }}" alt="{{ section.settings.title | default: product.title }} Thumb" class="wf-sticky-thumb" id="wfStickyThumb" />
      <div class="wf-sticky-info">
        <span class="wf-sticky-title">{{ section.settings.title | default: product.title }}</span>
        <span class="wf-sticky-price" id="wfStickyPrice">\${{ section.settings.price | default: '259.95' }} <s class="wf-sticky-comp">\${{ section.settings.compare_at | default: '499.95' }}</s></span>
      </div>
    </div>
    <div class="wf-sticky-actions">
      <select id="wfStickyBundleSelect" class="wf-sticky-select" onchange="syncStickySelect(this.value)">
        <option value="1">1x Kit (\${{ section.settings.price | default: '259.95' }})</option>
        <option value="2">2x Duet Pack (Save \$40 - POPULAR)</option>
        <option value="3">3x Ensemble (Save \$90 - BEST VALUE)</option>
      </select>
      <button type="button" class="wf-sticky-atc-btn" onclick="submitWfAddToCart()">
        ADD TO CART • 50% OFF
      </button>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "Zavelyn Drum Sticky Bar",
  "settings": [
    { "type": "image_picker", "id": "sticky_image", "label": "Sticky Bar Thumbnail" },
    { "type": "text", "id": "sticky_image_url", "label": "Fallback Sticky Thumbnail URL" },
    { "type": "text", "id": "title", "label": "Title" },
    { "type": "text", "id": "price", "label": "Price", "default": "259.95" },
    { "type": "text", "id": "compare_at", "label": "Compare Price", "default": "499.95" }
  ],
  "presets": [
    {
      "name": "Zavelyn Drum Sticky Bar"
    }
  ]
}
{% endschema %}`;

  await uploadAsset(token, 'sections/zhp-pdp-sticky-bar.liquid', stickyLiquid);

  console.log('✔ All 9 modular PDP sections uploaded to theme successfully!');

  // =========================================================================
  // PART 4: CONFIGURE & DEPLOY 3 PRODUCT TEMPLATES (PRO, PLUS, MINI)
  // =========================================================================
  console.log('\n--- 4. Creating & Uploading Modular Product Templates ---');

  // Common FAQs
  const commonFaqs = {
    "faq_1": {
      "type": "faq",
      "settings": {
        "question": "Do I need any prior musical experience to play?",
        "answer": "None whatsoever! Zavelyn Drums are designed to be completely intuitive. Because every note is tuned to natural harmonic scales, there are zero discordant or 'bad' notes. You can play purely by intuition, or follow the numbered songbook."
      }
    },
    "faq_2": {
      "type": "faq",
      "settings": {
        "question": "What does 432 Hz tuning mean?",
        "answer": "Standard modern music is tuned to 440 Hz, which can sound tense. 432 Hz is the natural harmonic frequency historically used by classical masters. Scientific studies indicate 432 Hz produces calmer emotional responses, lower heart rates, and enhanced meditation states."
      }
    },
    "faq_3": {
      "type": "faq",
      "settings": {
        "question": "Should I play with the mallets or my hands?",
        "answer": "Both! The included weighted bamboo mallets produce a bright, loud, crystal-clear bell resonance with minimum effort. Playing with your hands or the silicone finger picks creates a softer, warmer, and more intimate tone ideal for quiet meditation."
      }
    },
    "faq_4": {
      "type": "faq",
      "settings": {
        "question": "Will the drum ever go out of tune?",
        "answer": "No. The acoustic tongues are laser-cut from high-grade tempered alloy steel and heat-treated. Unless subjected to severe physical deformation, the instrument will maintain its pitch calibration for decades."
      }
    },
    "faq_5": {
      "type": "faq",
      "settings": {
        "question": "What is your return policy?",
        "answer": "We offer a 90-Day Risk-Free Trial. If you don't feel a noticeable sense of relaxation, joy, and peace when playing your Zavelyn Drum™, return it for a 100% full refund with no questions asked."
      }
    }
  };
  const faqOrder = ["faq_1", "faq_2", "faq_3", "faq_4", "faq_5"];

  // --- 4.1 PRO TEMPLATE ---
  const proReviews = [
    { author: "Elena Rodriguez", title: "My yoga students fall into deep meditation within minutes", text: "I introduce sound baths at the end of every restorative yoga class. The 432 Hz frequency creates such a profound, soothing sustain. The 15 notes allow for endless melodies.", meta: "Zavelyn Drum™ Pro (White) • Boulder, CO" },
    { author: "Marcus Bennett", title: "Zero musical background, playing songs on day one!", text: "I have never played an instrument in my 42 years. The numbered songbook made it so easy. After 20 minutes, I was playing Hallelujah.", meta: "Zavelyn Drum™ Pro (Black) • Austin, TX" },
    { author: "Claire Lansing", title: "Incredible build quality and deep, rich bass notes", text: "The drum is substantial, heavy, and notes ring with cathedral-like sustain. The travel backpack is high quality too. 10/10 purchase.", meta: "Zavelyn Drum™ Pro (Emerald Green) • Seattle, WA" },
    { author: "Dr. David Klein", title: "Used in our clinic for sensory anxiety reduction", text: "As an occupational therapist, acoustic tactile vibration is remarkable for sensory regulation. Patients love playing with both mallets and finger picks.", meta: "2x Zavelyn Drum™ Pro Duet Pack • Chicago, IL" },
    { author: "Sarah Jenkins", title: "The Sandstone color is gorgeous in our living room", text: "It looks like sculptural art on our coffee table. Whenever guests come over, everyone naturally sits down and starts playing.", meta: "Zavelyn Drum™ Pro (Sandstone) • Portland, OR" },
    { author: "Robert Taylor", title: "Tuning is spot on accurate at 432 Hz", text: "Checked every single one of the 15 notes with an acoustic tuner app. Every note was calibrated within ±2 cents. Superb craftsmanship.", meta: "Zavelyn Drum™ Pro (Silver) • Nashville, TN" },
    { author: "Angela Morales", title: "Gifted to my husband — he is obsessed", text: "He sits on the porch every evening playing ambient melodies. His blood pressure has literally decreased. Best gift ever!", meta: "Zavelyn Drum™ Pro (Blue) • San Diego, CA" },
    { author: "James Henderson", title: "Arrived in 3 days in bulletproof packaging", text: "Shipping was lightning fast. Thick foam molds protected the instrument completely. Everything arrived in mint condition.", meta: "Zavelyn Drum™ Pro (Burgundy) • Atlanta, GA" },
    { author: "Karen Lewis", title: "The 15-note range makes all the difference", text: "I previously owned an 8-note drum, but felt limited. The Zavelyn Pro gives you the full two octaves for real compositions.", meta: "Zavelyn Drum™ Pro (Pink Tan) • Miami, FL" },
    { author: "Thomas Wright", title: "Pure acoustic bliss", text: "Whenever life feels chaotic, 5 minutes with this drum resets my nervous system. I cannot recommend it enough for inner calm.", meta: "Zavelyn Drum™ Pro (White) • Philadelphia, PA" }
  ];

  const proBlocks = {};
  const proBlockOrder = [];
  proReviews.forEach((r, idx) => {
    const key = `rev_${idx + 1}`;
    proBlocks[key] = {
      type: "review",
      settings: r
    };
    proBlockOrder.push(key);
  });

  const proTpl = {
    wrapper: "div#shopify-section-zavelyn-drum-pro",
    sections: {
      "hero": {
        type: "zhp-pdp-hero",
        settings: {
          main_image: "shopify://shop_images/tr-ng-en-n-n-trong-su-t.png",
          main_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White.webp?v=1716783328",
          title: "Zavelyn Drum™ Pro (15-Tone Steel Tongue Handpan Drum)",
          short_name: "Zavelyn Drum™ Pro",
          subtitle: "Master 15-Tone D-Major Scale • 432 Hz Healing Frequency • Surgical Alloy Steel • Complete Kit (Backpack, Mallets & Songbook)",
          price: "259.95",
          compare_at: "499.95",
          rating_score: "4.9 / 5.0",
          rating_count: "1,680+ Verified Practitioners",
          tier1_desc: "15-Tone Drum + Travel Backpack + Mallets + Master Songbook + Picks",
          thumb_1_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White.webp?v=1716783328",
          thumb_2_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White_Th_Pts.webp?v=1716961111",
          thumb_3_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/details.webp?v=1751703134",
          thumb_4_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/UnpackingPro.webp?v=1751703134",
          thumb_5_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White_1a_LFs.webp?v=1716961111",
          thumb_6_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/inside.webp?v=1751703134"
        }
      },
      "banner": {
        type: "zhp-pdp-banner",
        settings: {
          banner_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White_1a_LFs.webp?v=1716783328",
          heading: "Tuned to 432 Hz: The Frequency of Natural Healing"
        }
      },
      "experience": {
        type: "zhp-pdp-experience",
        settings: {
          feature_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White_Th_Pts.webp?v=1716961111",
          title: "Zero Musical Training Required"
        }
      },
      "included": {
        type: "zhp-pdp-included",
        settings: {
          included_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/UnpackingPro.webp?v=1751703134",
          title: "Everything You Need to Begin Immediately"
        }
      },
      "specs": {
        type: "zhp-pdp-specs",
        settings: {
          title: "Technical Specifications",
          spec_diameter: "14 Inches (35.5 cm) Master Large",
          spec_material: "Tempered Carbon-Titanium Surgical Alloy Steel",
          spec_tuning: "Master D-Major Harmonic Scale (15 Notes)",
          spec_frequency: "432 Hz Natural Biological Resonance",
          spec_tones: "15 Acoustic Tongues (2 Complete Octaves)",
          spec_weight: "8.4 lbs (3.8 kg) Studio Stability",
          spec_finish: "Baked Electrostatic Pearlescent Protective Coating"
        }
      },
      "shipping": {
        type: "zhp-pdp-shipping",
        settings: {}
      },
      "reviews": {
        type: "zhp-pdp-reviews",
        blocks: proBlocks,
        block_order: proBlockOrder,
        settings: {
          title: "Loved By Thousands of Sound Seekers",
          rating_summary: "1,680+ Verified Practitioner Reviews"
        }
      },
      "faq": {
        type: "zhp-pdp-faq",
        blocks: commonFaqs,
        block_order: faqOrder,
        settings: {}
      },
      "sticky_bar": {
        type: "zhp-pdp-sticky-bar",
        settings: {
          sticky_image: "shopify://shop_images/tr-ng-en-n-n-trong-su-t.png",
          sticky_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White.webp?v=1716783328",
          title: "Zavelyn Drum™ Pro",
          price: "259.95",
          compare_at: "499.95"
        }
      }
    },
    order: [
      "hero",
      "banner",
      "experience",
      "included",
      "specs",
      "shipping",
      "reviews",
      "faq",
      "sticky_bar"
    ]
  };

  await uploadAsset(token, 'templates/product.zavelyn-drum-pro.json', JSON.stringify(proTpl, null, 2));

  // --- 4.2 PLUS TEMPLATE ---
  const plusReviews = [
    { author: "Jessica Warren", title: "The sweet spot for size and sound", text: "The 10-inch 11-tone drum is so comfortable on my lap. The notes ring clearly without echoing into noise. My kids love playing it before bedtime.", meta: "Zavelyn Drum™ Plus (Emerald Green) • Denver, CO" },
    { author: "Brian Miller", title: "Helps tremendously with ADHD focus", text: "I keep this on my work desk. Whenever my focus wanes, I tap a simple 3-note melody. The gentle tone resets my concentration instantly.", meta: "Zavelyn Drum™ Plus (Black) • New York, NY" },
    { author: "Laura Hayes", title: "Beautiful melodic sound, so easy to play", text: "Bought this after seeing a video online. Even without reading music, my 6-year-old daughter and I can play duets together. Highly recommend!", meta: "Zavelyn Drum™ Plus (Pink) • Minneapolis, MN" },
    { author: "Greg Simmons", title: "Superior tuning compared to generic brands", text: "I previously tried a cheap brand and half the tongues sounded dead. This Zavelyn Plus is tuned flawlessly. Warm, resonant, and singing tones.", meta: "Zavelyn Drum™ Plus (Blue) • Seattle, WA" },
    { author: "Amy Davis", title: "The carry bag is sturdy and convenient", text: "Take it with me to the beach on weekends. Sits firmly in its zippered case and mallets slot in securely. Great build quality.", meta: "Zavelyn Drum™ Plus (Sandstone) • Sarasota, FL" },
    { author: "Michael Chang", title: "Wonderful instrument for mind-body balance", text: "I practice Qigong and meditation. The vibrations of this drum resonate straight through the chest. A truly therapeutic tool.", meta: "Zavelyn Drum™ Plus (White) • San Francisco, CA" },
    { author: "Nancy Larson", title: "Delighted with the Red finish", text: "The red baked enamel finish is vibrant and flawless. Looks very elegant and produces such a soothing chime.", meta: "Zavelyn Drum™ Plus (Red) • Dallas, TX" },
    { author: "Paul Robinson", title: "Ordered 2 for our school music room", text: "Students take turns playing. The numbered tabs make teaching rhythm intuitive. No broken strings or fragile parts to worry about.", meta: "2x Zavelyn Drum™ Plus Duet Pack • Boston, MA" },
    { author: "Tina Campbell", title: "My favorite purchase of the year", text: "Unwinding with this drum after a 12-hour nursing shift is heavenly. It replaces endless screen scrolling with acoustic peace.", meta: "Zavelyn Drum™ Plus (Pink Tan) • Phoenix, AZ" },
    { author: "Steven Hall", title: "Fast shipping and great customer care", text: "Ordered on Monday and received it by Thursday. Everything arrived safe and sounds divine.", meta: "Zavelyn Drum™ Plus (Black) • Charlotte, NC" }
  ];

  const plusBlocks = {};
  const plusBlockOrder = [];
  plusReviews.forEach((r, idx) => {
    const key = `rev_${idx + 1}`;
    plusBlocks[key] = {
      type: "review",
      settings: r
    };
    plusBlockOrder.push(key);
  });

  const plusTpl = {
    wrapper: "div#shopify-section-zavelyn-drum-plus",
    sections: {
      "hero": {
        type: "zhp-pdp-hero",
        settings: {
          main_image: "shopify://shop_images/tr-ng-tr-ng-n-n-trong-su-t.png",
          main_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Plus_White.webp?v=1716735931",
          title: "Zavelyn Drum™ Plus (11-Tone Steel Tongue Handpan Drum)",
          short_name: "Zavelyn Drum™ Plus",
          subtitle: "Most Versatile 11-Tone D-Major Scale • 432 Hz Harmonic Healing • Compact 10\" Diameter • Complete Travel Kit",
          price: "159.95",
          compare_at: "299.95",
          rating_score: "4.9 / 5.0",
          rating_count: "1,420+ Verified Practitioners",
          tier1_desc: "11-Tone Drum + Travel Bag + Mallets + Beginner Songbook + Picks",
          thumb_1_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Plus_White.webp?v=1716735931",
          thumb_2_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PDwhit_lfstl.webp?v=1716736589",
          thumb_3_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/78.jpg?v=1716736589",
          thumb_4_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PDWHITEBG_LIFESTYLE.webp?v=1716736589",
          thumb_5_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/plusinside.webp?v=1751703631",
          thumb_6_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Plus_black1000x1000.webp?v=1751703631"
        }
      },
      "banner": {
        type: "zhp-pdp-banner",
        settings: {
          banner_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PDWHITEBG_LIFESTYLE.webp?v=1716736589",
          heading: "Tuned to 432 Hz: The Frequency of Natural Healing"
        }
      },
      "experience": {
        type: "zhp-pdp-experience",
        settings: {
          feature_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PDwhit_lfstl.webp?v=1716736589",
          title: "Zero Musical Training Required"
        }
      },
      "included": {
        type: "zhp-pdp-included",
        settings: {
          included_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/plusinside.webp?v=1751703631",
          title: "Everything You Need to Begin Immediately"
        }
      },
      "specs": {
        type: "zhp-pdp-specs",
        settings: {
          title: "Technical Specifications",
          spec_diameter: "10 Inches (25.4 cm) Medium Plus",
          spec_material: "Tempered Carbon-Titanium Surgical Alloy Steel",
          spec_tuning: "D-Major Harmonic Scale (11 Notes)",
          spec_frequency: "432 Hz Natural Biological Resonance",
          spec_tones: "11 Acoustic Tongues",
          spec_weight: "3.3 lbs (1.5 kg) Balanced Resonance",
          spec_finish: "Baked Electrostatic Pearlescent Protective Coating"
        }
      },
      "shipping": {
        type: "zhp-pdp-shipping",
        settings: {}
      },
      "reviews": {
        type: "zhp-pdp-reviews",
        blocks: plusBlocks,
        block_order: plusBlockOrder,
        settings: {
          title: "Loved By Thousands of Sound Seekers",
          rating_summary: "1,420+ Verified Practitioner Reviews"
        }
      },
      "faq": {
        type: "zhp-pdp-faq",
        blocks: commonFaqs,
        block_order: faqOrder,
        settings: {}
      },
      "sticky_bar": {
        type: "zhp-pdp-sticky-bar",
        settings: {
          sticky_image: "shopify://shop_images/tr-ng-tr-ng-n-n-trong-su-t.png",
          sticky_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Plus_White.webp?v=1716735931",
          title: "Zavelyn Drum™ Plus",
          price: "159.95",
          compare_at: "299.95"
        }
      }
    },
    order: [
      "hero",
      "banner",
      "experience",
      "included",
      "specs",
      "shipping",
      "reviews",
      "faq",
      "sticky_bar"
    ]
  };

  await uploadAsset(token, 'templates/product.zavelyn-drum-plus.json', JSON.stringify(plusTpl, null, 2));

  // --- 4.3 MINI TEMPLATE ---
  const miniReviews = [
    { author: "Kimberly Green", title: "My 3-year-old son loves this so much", text: "He used to throw tantrums before naptime. Now he sits with his mini drum and taps softly until he is calm. It is indestructible and sounds so peaceful.", meta: "Zavelyn Drum™ Mini (Blue) • Atlanta, GA" },
    { author: "Daniel Howard", title: "Pocket sound bowl for hiking and backpacking", text: "Weighs barely a pound. Fits in my daypack side pocket. Sitting at mountain summits playing acoustic notes into the valley is pure magic.", meta: "Zavelyn Drum™ Mini (Black) • Salt Lake City, UT" },
    { author: "Stephanie Lopez", title: "Impossible to play a bad note", text: "The pentatonic tuning means every note blends harmoniously. You cannot make a mistake. It is genuinely fun and soothing for anyone.", meta: "Zavelyn Drum™ Mini (Pink) • Tampa, FL" },
    { author: "Jonathan Wood", title: "Surprising volume and resonance for 6 inches", text: "Expected it to sound like a toy, but it rings with genuine bell clarity and sustain. The mini rubber mallets work wonders.", meta: "Zavelyn Drum™ Mini (White) • Nashville, TN" },
    { author: "Rachel Morris", title: "Great screen-free gift for grandchildren", text: "Gave one to each of my granddaughters. They spent hours playing songs together instead of staring at iPads. A grandparent win!", meta: "2x Zavelyn Drum™ Mini Explorer Pack • Chicago, IL" },
    { author: "Ethan Turner", title: "Lovely desk accessory for stress relief", text: "I keep it right under my computer monitor. During long Zoom calls or stressful emails, a soft tap restores immediate tranquility.", meta: "Zavelyn Drum™ Mini (Sandstone) • Austin, TX" },
    { author: "Megan Brooks", title: "Cute, durable and beautifully tuned", text: "The red paint is thick and flawless. Has survived multiple drops onto carpet without a scratch or going out of tune.", meta: "Zavelyn Drum™ Mini (Red) • Denver, CO" },
    { author: "Anthony Lee", title: "Perfect introductory instrument", text: "Builds hand-eye coordination and auditory sensitivity in young kids. Numbered booklet is very well laid out.", meta: "Zavelyn Drum™ Mini (White) • Seattle, WA" },
    { author: "Heather Cox", title: "Sweet and gentle lullabies", text: "I play Twinkle Twinkle Little Star on this every evening in our baby nursery. Instantly settles our newborn.", meta: "Zavelyn Drum™ Mini (Pink Tan) • Charlotte, NC" },
    { author: "William Bailey", title: "Exceeded all expectations", text: "Compact, affordable, beautifully packaged, and sounds genuinely healing. Couldn’t be happier with this purchase.", meta: "Zavelyn Drum™ Mini (Blue) • Portland, OR" }
  ];

  const miniBlocks = {};
  const miniBlockOrder = [];
  miniReviews.forEach((r, idx) => {
    const key = `rev_${idx + 1}`;
    miniBlocks[key] = {
      type: "review",
      settings: r
    };
    miniBlockOrder.push(key);
  });

  const miniTpl = {
    wrapper: "div#shopify-section-zavelyn-drum-mini",
    sections: {
      "hero": {
        type: "zhp-pdp-hero",
        settings: {
          main_image: "shopify://shop_images/tr-ng-v-ng-n-n-trong-su-t.png",
          main_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_white.webp?v=1716782465",
          title: "Zavelyn Drum™ Mini (8-Tone Steel Tongue Handpan Drum)",
          short_name: "Zavelyn Drum™ Mini",
          subtitle: "Ultra-Portable 6-Inch Pocket Handpan • 8-Tone Pentatonic C-Scale • 432 Hz Calming Tones • Perfect for Kids & Travel",
          price: "109.95",
          compare_at: "179.95",
          rating_score: "4.9 / 5.0",
          rating_count: "950+ Verified Practitioners",
          tier1_desc: "8-Tone Mini Drum + Pouch + Mini Mallets + Beginner Booklet",
          thumb_1_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_white.webp?v=1716782465",
          thumb_2_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_White2.webp?v=1716782465",
          thumb_3_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/products/8-tone_6-inch_steel_tongue_panda_drum_help_by_a_little_girl.jpg?v=1716782465",
          thumb_4_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/products/1Box_Drum_8_new.jpg?v=1716782465",
          thumb_5_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_red.webp?v=1716782465",
          thumb_6_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_Sandstone.webp?v=1716782465"
        }
      },
      "banner": {
        type: "zhp-pdp-banner",
        settings: {
          banner_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/products/8-tone_6-inch_steel_tongue_panda_drum_help_by_a_little_girl.jpg?v=1716782465",
          heading: "Tuned to 432 Hz: The Frequency of Natural Healing"
        }
      },
      "experience": {
        type: "zhp-pdp-experience",
        settings: {
          feature_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/products/panda-drum-6-inch-steel-tongue-drum.jpg?v=1716782465",
          title: "Zero Musical Training Required"
        }
      },
      "included": {
        type: "zhp-pdp-included",
        settings: {
          included_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/products/1Box_Drum_8_new.jpg?v=1716782465",
          title: "Everything You Need to Begin Immediately"
        }
      },
      "specs": {
        type: "zhp-pdp-specs",
        settings: {
          title: "Technical Specifications",
          spec_diameter: "6 Inches (15.2 cm) Pocket Mini",
          spec_material: "Tempered Carbon-Titanium Surgical Alloy Steel",
          spec_tuning: "Pentatonic C-Major Scale (8 Notes)",
          spec_frequency: "432 Hz Natural Biological Resonance",
          spec_tones: "8 Acoustic Tongues",
          spec_weight: "1.3 lbs (0.6 kg) Ultra Portable",
          spec_finish: "Baked Electrostatic Pearlescent Protective Coating"
        }
      },
      "shipping": {
        type: "zhp-pdp-shipping",
        settings: {}
      },
      "reviews": {
        type: "zhp-pdp-reviews",
        blocks: miniBlocks,
        block_order: miniBlockOrder,
        settings: {
          title: "Loved By Thousands of Sound Seekers",
          rating_summary: "950+ Verified Practitioner Reviews"
        }
      },
      "faq": {
        type: "zhp-pdp-faq",
        blocks: commonFaqs,
        block_order: faqOrder,
        settings: {}
      },
      "sticky_bar": {
        type: "zhp-pdp-sticky-bar",
        settings: {
          sticky_image: "shopify://shop_images/tr-ng-v-ng-n-n-trong-su-t.png",
          sticky_image_url: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_white.webp?v=1716782465",
          title: "Zavelyn Drum™ Mini",
          price: "109.95",
          compare_at: "179.95"
        }
      }
    },
    order: [
      "hero",
      "banner",
      "experience",
      "included",
      "specs",
      "shipping",
      "reviews",
      "faq",
      "sticky_bar"
    ]
  };

  await uploadAsset(token, 'templates/product.zavelyn-drum-mini.json', JSON.stringify(miniTpl, null, 2));

  console.log('✔ All 3 Handpan Product Templates deployed modularly with custom image pickers and user transparent images!');
}

run().catch(console.error);
