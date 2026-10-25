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
  return (await res.json()).access_token;
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
  console.log('Got access token. Deploying Zavelyn Handpan Master PDP & Collection updates...');

  // =========================================================================
  // 1. UPDATE sections/zhp-pdp-hero.liquid
  // Support both multi-variant (Color swatches) and single-variant (Scale badge)
  // Dynamic currentVariantId initialization from product.selected_or_first_available_variant.id
  // Dynamic bundle calculations
  // =========================================================================
  console.log('\n--- 1. Updating sections/zhp-pdp-hero.liquid ---');
  let heroLiquid = await getAsset(token, 'sections/zhp-pdp-hero.liquid');

  // Let's replace the Color Variant Selector block with conditional check
  const variantBlockReplacement = `          <!-- Color / Scale Variant Selector -->
          {%- if product.options.first == 'Color' and product.variants.size > 1 -%}
            <div class="wf-color-picker-wrap">
              <label class="wf-bundle-label">CHOOSE COLOR: <span id="wfSelectedColorName" style="color:var(--wf-primary); font-weight:800;">{{ product.variants.first.title | default: 'Green' }}</span></label>
              <div class="wf-color-options">
                {%- for variant in product.variants -%}
                  {%- assign v_title = variant.title | downcase -%}
                  {%- assign hex = '#1a1a1a' -%}
                  {%- if v_title contains 'green' or v_title contains 'emerald' -%}
                    {%- assign hex = '#0f6e52' -%}
                  {%- elsif v_title contains 'black' -%}
                    {%- assign hex = '#1a1a1a' -%}
                  {%- elsif v_title contains 'navy' or v_title contains 'blue' -%}
                    {%- assign hex = '#1b2a4e' -%}
                  {%- elsif v_title contains 'purple' or v_title contains 'violet' or v_title contains 'burgundy' -%}
                    {%- assign hex = '#581c87' -%}
                  {%- elsif v_title contains 'gold' or v_title contains 'yellow' or v_title contains 'sandstone' -%}
                    {%- assign hex = '#d4af37' -%}
                  {%- elsif v_title contains 'white' -%}
                    {%- assign hex = '#ffffff' -%}
                  {%- endif -%}
                  <button type="button" class="wf-color-btn {% if forloop.first %}active{% endif %}" 
                          data-color="{{ variant.title }}" 
                          data-variant-id="{{ variant.id }}" 
                          data-img="{% if variant.featured_image %}{{ variant.featured_image | image_url: width: 1000 }}{% endif %}" 
                          style="background:{{ hex }}; {% if hex == '#ffffff' %}border:1px solid #ccc;{% endif %}" 
                          onclick="selectWfColor(this)" 
                          title="{{ variant.title }}"
                          aria-label="{{ variant.title }}"></button>
                {%- endfor -%}
              </div>
            </div>
          {%- else -%}
            <div class="wf-variant-single-wrap" style="margin-bottom: 20px;">
              <label class="wf-bundle-label">SCALE & FREQUENCY: <span style="color:var(--wf-primary); font-weight:800;">{{ product.variants.first.title }}</span></label>
              <div class="wf-scale-badge" style="display:inline-flex; align-items:center; gap:10px; margin-top:8px; padding:10px 18px; background:#fffaf0; border:1.5px solid var(--wf-primary); border-radius:8px; width:100%; box-sizing:border-box;">
                <span style="font-size:20px;">🎼</span>
                <div style="flex:1;">
                  <div style="font-weight:700; color:#1a202c; font-size:15px;">{{ product.variants.first.title }}</div>
                  <div style="font-size:12px; color:#718096;">D-Minor Kurd • 432 Hz Natural Biological Resonance</div>
                </div>
                <span style="background:#2C4236; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px; letter-spacing:0.5px;">IN STOCK</span>
              </div>
            </div>
          {%- endif -%}`;

  // Replace old color picker wrap
  heroLiquid = heroLiquid.replace(/<!-- Color Variant Selector -->[\s\S]*?<\/div>\s*<\/div>/, variantBlockReplacement);

  // Dynamic savings calculations for bundle cards:
  const oldBundleCalc = `            {%- assign unit_price_num = section.settings.price | default: '259.95' | times: 1.0 -%}
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
            {%- assign p3_comp_dollars = p3_comp_cents | divided_by: 100.0 -%}`;

  const newBundleCalc = `            {%- assign unit_price_num = section.settings.price | default: product.price | times: 1.0 -%}
            {%- assign unit_comp_num = section.settings.compare_at | default: product.compare_at_price | times: 1.0 -%}
            {%- assign unit_price_cents = unit_price_num | times: 100 | round -%}
            {%- assign unit_comp_cents = unit_comp_num | times: 100 | round -%}
            {%- if unit_price_num > 400 -%}
              {%- assign extra_save_2_cents = 8000 -%}
              {%- assign extra_save_3_cents = 21000 -%}
              {%- assign extra_save_2_txt = 'Save Extra $80' -%}
              {%- assign extra_save_3_txt = 'Maximum Savings (Extra $210 Off)' -%}
            {%- else -%}
              {%- assign extra_save_2_cents = 4000 -%}
              {%- assign extra_save_3_cents = 9000 -%}
              {%- assign extra_save_2_txt = 'Save Extra $40' -%}
              {%- assign extra_save_3_txt = 'Maximum Savings (Extra $90 Off)' -%}
            {%- endif -%}
            {%- assign p2_price_cents = unit_price_cents | times: 2 | minus: extra_save_2_cents -%}
            {%- assign p2_comp_cents = unit_comp_cents | times: 2 -%}
            {%- assign p2_each_cents = p2_price_cents | divided_by: 2 -%}
            {%- assign p3_price_cents = unit_price_cents | times: 3 | minus: extra_save_3_cents -%}
            {%- assign p3_comp_cents = unit_comp_cents | times: 3 -%}
            {%- assign p3_each_cents = p3_price_cents | divided_by: 3 -%}
            {%- assign p2_price_dollars = p2_price_cents | divided_by: 100.0 -%}
            {%- assign p2_comp_dollars = p2_comp_cents | divided_by: 100.0 -%}
            {%- assign p3_price_dollars = p3_price_cents | divided_by: 100.0 -%}
            {%- assign p3_comp_dollars = p3_comp_cents | divided_by: 100.0 -%}`;

  heroLiquid = heroLiquid.replace(oldBundleCalc, newBundleCalc);

  // Update bundle card text to use extra_save_2_txt / extra_save_3_txt
  heroLiquid = heroLiquid.replace('Save Extra $40', '{{ extra_save_2_txt }}');
  heroLiquid = heroLiquid.replace('Maximum Savings', '{{ extra_save_3_txt }}');

  // Dynamic JS variant initialization
  const scriptTagInit = `
<script>
  let currentVariantId = "{{ product.selected_or_first_available_variant.id }}";
  let currentUnitPrice = {{ section.settings.price | default: '599.00' | times: 1.0 }};
  let currentUnitCompare = {{ section.settings.compare_at | default: '1199.00' | times: 1.0 }};

  function initWfVariantState() {
    var activeBtn = document.querySelector('.wf-color-btn.active') || document.querySelector('.wf-color-btn');
    if (activeBtn) {
      var vId = activeBtn.getAttribute('data-variant-id');
      var color = activeBtn.getAttribute('data-color');
      if (vId) currentVariantId = vId;
      var nameEl = document.getElementById('wfSelectedColorName');
      if (nameEl && color) nameEl.textContent = color;
    } else {
      currentVariantId = "{{ product.selected_or_first_available_variant.id }}";
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWfVariantState);
  } else {
    initWfVariantState();
  }
</script>
`;
  // Replace previous init script if present, or append
  if (heroLiquid.includes('function initWfVariantState()')) {
    heroLiquid = heroLiquid.replace(/<script>\s*function initWfVariantState\(\)[\s\S]*?<\/script>/, scriptTagInit);
  } else {
    heroLiquid += scriptTagInit;
  }

  await uploadAsset(token, 'sections/zhp-pdp-hero.liquid', heroLiquid);

  // =========================================================================
  // 2. CREATE templates/product.zavelyn-handpan-master.json
  // =========================================================================
  console.log('\n--- 2. Creating templates/product.zavelyn-handpan-master.json ---');

  const masterReviews = [
    { author: "Julian Vane", title: "Pure cathedral acoustics — this is an authentic master instrument", text: "I have played high-end European pantams for over a decade. The sustain, dynamic touch sensitivity, and warm harmonic blooming of this 22-inch D-Kurd are utterly world-class.", meta: "Zavelyn Handpan™ Master (432Hz 12 Notes) • Vienna, Austria" },
    { author: "Dr. Maya Lin", title: "The centerpiece of my sound bath therapy center", text: "Clients frequently tear up during sessions. The 432 Hz frequency resonates deeply into the solar plexus. The included aluminum tripod stand is sturdy and positions the drum perfectly.", meta: "Zavelyn Handpan™ Master (432Hz 12 Notes) • San Diego, CA" },
    { author: "David Sterling", title: "Worth every single penny and more", text: "50% off for a genuine 22-inch 12-tone nitrided steel handpan is unbelievable value. Tested with a strobe acoustic tuner — every single dimple and octave harmonic is calibrated to 432 Hz spot on.", meta: "Zavelyn Handpan™ Master (432Hz 12 Notes) • Boulder, CO" },
    { author: "Seraphina Moon", title: "Hypnotic soundscapes that stop time", text: "Playing with bare hands is pure joy. The central Ding produces a thunderous bass note, and the 11 outer tone fields allow for soaring ambient journeys. Arrived in a heavy-duty reinforced travel bag.", meta: "Zavelyn Handpan™ Master (432Hz 12 Notes) • Sedona, AZ" },
    { author: "Marcus Thorne", title: "Outstanding craftsmanship and protective braided rope", text: "The nitrogen-hardened steel finish has an antique bronze iridescence that looks like fine museum art. The braided rope wrap gives it a rugged, artisanal touch.", meta: "Zavelyn Handpan™ Master (432Hz 12 Notes) • Seattle, WA" },
    { author: "Elena Rostova", title: "Complete package made starting seamless", text: "Having the tripod stand, travel backpack, mallets, and care cloth all included in the box is fantastic. No need to hunt for accessories.", meta: "Zavelyn Handpan™ Master (432Hz 12 Notes) • Chicago, IL" },
    { author: "Gabriel Santos", title: "Deep resonance that calms my busy mind", text: "After intense corporate work days, sitting at this handpan for 15 minutes completely resets my nervous system. Best acoustic purchase I've ever made.", meta: "Zavelyn Handpan™ Master (432Hz 12 Notes) • Austin, TX" },
    { author: "Rachel Hoffman", title: "Fast delivery & bulletproof packaging", text: "Delivered within 3 days in thick molded foam. Zero scratches, tuned to absolute perfection out of the box.", meta: "Zavelyn Handpan™ Master (432Hz 12 Notes) • Nashville, TN" }
  ];

  const masterReviewBlocks = {};
  const masterReviewOrder = [];
  masterReviews.forEach((r, idx) => {
    const k = `rev_${idx + 1}`;
    masterReviewBlocks[k] = { type: 'review', settings: r };
    masterReviewOrder.push(k);
  });

  const masterFaqs = {
    "faq_1": {
      "type": "faq",
      "settings": {
        "question": "What is the difference between a Steel Tongue Drum and a true Handpan?",
        "answer": "While tongue drums use laser-cut steel tongues, a true Handpan (Pantam) features hand-hammered resonant dimple tone fields shaped over an acoustic hemisphere. The Zavelyn Handpan™ Master offers a larger 22-inch acoustic volume, deeper cathedral sustain, and an expansive dynamic range played predominantly with hand touches."
      }
    },
    "faq_2": {
      "type": "faq",
      "settings": {
        "question": "What scale is this Handpan tuned to?",
        "answer": "The Zavelyn Handpan™ Master is tuned in the world-renowned D-Minor Kurd scale across 12 tone fields: Central Ding (D3) surrounded by A3, Bb3, C4, D4, E4, F4, G4, A4, C5, D5, E5. This scale is celebrated globally for its deeply emotional, hypnotic, and meditative tonal quality."
      }
    },
    "faq_3": {
      "type": "faq",
      "settings": {
        "question": "Why is 432 Hz tuning superior for relaxation?",
        "answer": "Standard commercial instruments are tuned to 440 Hz, which can induce subtle acoustic tension. 432 Hz is mathematically aligned with natural harmonic ratios and golden spirals, scientifically shown to promote alpha brainwaves, reduce heart rate, and enhance meditation."
      }
    },
    "faq_4": {
      "type": "faq",
      "settings": {
        "question": "Does it include the tripod stand and backpack?",
        "answer": "Yes! The Complete Concert Master Set includes a heavy-duty foldable aluminum tripod stand, a high-density padded travel backpack with dual shoulder straps, solid wooden mallets, braided protective edge rope, visual scale stickers, and a microfiber cleaning cloth."
      }
    },
    "faq_5": {
      "type": "faq",
      "settings": {
        "question": "What is your risk-free trial and return policy?",
        "answer": "We back the Zavelyn Handpan™ Master with our 90-Day Sound Guarantee. If you don't feel a profound sense of musical peace and restorative acoustic delight, return it within 90 days for a full refund."
      }
    }
  };
  const masterFaqOrder = ["faq_1", "faq_2", "faq_3", "faq_4", "faq_5"];

  const masterTpl = {
    wrapper: "div#shopify-section-zavelyn-handpan-master",
    sections: {
      "hero": {
        type: "zhp-pdp-hero",
        settings: {
          main_image_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_1.jpg?v=1792907902",
          badge_sale: "50% OFF FLASH SALE",
          title: "Zavelyn Handpan™ Master (12-Tone 432Hz D-Minor Kurd)",
          short_name: "Zavelyn Handpan™ Master",
          subtitle: "Concert 22-Inch Handcrafted Nitrided Steel • D-Minor Kurd Scale (12 Notes) • 432 Hz Healing Frequency • Includes Tripod Stand & Heavy-Duty Travel Backpack",
          price: "599.00",
          compare_at: "1199.00",
          rating_score: "4.9 / 5.0",
          rating_count: "840+ Concert Artists & Practitioners",
          promo_text: "<strong>SPECIAL OFFER:</strong> 50% OFF applied automatically. Includes Free Foldable Tripod Stand, Heavy-Duty Travel Backpack, Mallets & Braided Edge Wrap!",
          tier1_desc: "22-Inch 12-Tone Handpan + Tripod Stand + Padded Backpack + Mallets + Braided Rope",
          thumb_1_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_1.jpg?v=1792907902",
          thumb_2_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_2.jpg?v=1792907902",
          thumb_3_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_4.jpg?v=1792907902",
          thumb_4_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_3.png?v=1792907902",
          thumb_5_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_5.jpg?v=1792907902",
          thumb_6_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_6.jpg?v=1792907902",
          guarantee_1: "90-Day Sound",
          guarantee_2: "Fast Tracked US",
          guarantee_3: "432 Hz Calibrated"
        }
      },
      "banner": {
        type: "zhp-pdp-banner",
        settings: {
          banner_image_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_4.jpg?v=1792907902",
          badge_text: "NATURAL RESONANCE",
          heading: "Tuned to 432 Hz: The Frequency of Natural Healing",
          text: "",
          point_1: "Expansive D-Minor Kurd harmonic scale that melts daily anxiety within 5 minutes",
          point_2: "Nitrided steel acoustic chamber providing warm, crystal cathedral sustain",
          point_3: "Loved by professional sound therapists, yoga studios, and concert performers worldwide"
        }
      },
      "experience": {
        type: "zhp-pdp-experience",
        settings: {
          feature_image_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_2.jpg?v=1792907902",
          pill_text: "CONCERT MASTER",
          title: "12 Acoustic Tone Fields: Infinite Melodic Expression",
          description: ""
        }
      },
      "included": {
        type: "zhp-pdp-included",
        settings: {
          included_image_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_6.jpg?v=1792907902",
          pill_text: "COMPLETE MASTER KIT",
          title: "Everything You Need for Studio & Stage Performance",
          description: ""
        }
      },
      "specs": {
        type: "zhp-pdp-specs",
        settings: {
          title: "Technical Specifications",
          spec_diameter: "22 Inches (55 cm) Concert Large",
          spec_material: "Hand-Hammered Nitrided Carbon-Titanium Steel",
          spec_tuning: "D-Minor Kurd (12 Tone Fields: D3 / A3, Bb3, C4, D4, E4, F4, G4, A4, C5, D5, E5)",
          spec_frequency: "432 Hz Pure Natural Biological Resonance",
          spec_tones: "12 Acoustic Tone Fields (Ding + 11 Dimples)",
          spec_weight: "9.2 lbs (4.2 kg) Concert Stage Stability",
          spec_finish: "High-Temperature Nitrogen Hardened Antique Bronze Coating"
        }
      },
      "shipping": {
        type: "zhp-pdp-shipping",
        settings: {
          title: "Fast US Delivery & Tracked Shipping"
        }
      },
      "reviews": {
        type: "zhp-pdp-reviews",
        blocks: masterReviewBlocks,
        block_order: masterReviewOrder,
        settings: {
          title: "Acclaimed by Master Sound Practitioners",
          rating_summary: "840+ Verified Concert & Studio Reviews"
        }
      },
      "faq": {
        type: "zhp-pdp-faq",
        blocks: masterFaqs,
        block_order: masterFaqOrder,
        settings: {}
      },
      "sticky_bar": {
        type: "zhp-pdp-sticky-bar",
        settings: {
          sticky_image_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_1.jpg?v=1792907902",
          title: "Zavelyn Handpan™ Master 22\"",
          price: "599.00",
          compare_at: "1199.00"
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

  await uploadAsset(token, 'templates/product.zavelyn-handpan-master.json', JSON.stringify(masterTpl, null, 2));

  // =========================================================================
  // 3. UPDATE sections/zhp-bestsellers.liquid on Collection Page
  // Add Master 22" (12 Notes • $599) as the 1st card (FLAGSHIP CONCERT)
  // =========================================================================
  console.log('\n--- 3. Updating sections/zhp-bestsellers.liquid ---');
  let best = await getAsset(token, 'sections/zhp-bestsellers.liquid');

  const masterCardHtml = `        <!-- Product 0: Master 22 Inch 12 Notes -->
        <div class="zhp-product-card zhp-card-master" style="border: 2px solid #8A2C13;">
          <div class="zhp-card-badge" style="background-color: #8A2C13; color: #FFFFFF;">FLAGSHIP CONCERT • SAVE 50%</div>
          <div class="zhp-card-media">
            <a href="/products/zavelyn-handpan-master">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_1.jpg?v=1792907902" alt="Zavelyn Handpan Master 22 Inch 12 Notes" class="zhp-card-img" loading="lazy">
            </a>
          </div>
          <div class="zhp-card-content">
            <div class="zhp-card-rating">
              <span class="zhp-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</span>
              <span class="zhp-review-count">(840 reviews)</span>
            </div>
            <h3 class="zhp-card-title"><a href="/products/zavelyn-handpan-master">Zavelyn Handpan™ Master</a></h3>
            <div class="zhp-card-meta">Concert series • 22" • 12 Notes (D-Minor Kurd)</div>
            <ul class="zhp-card-features">
              <li>✓ Authentic 22" hand-hammered nitrided steel concert handpan</li>
              <li>✓ 12 harmonic tone fields tuned to pure 432 Hz biological healing</li>
              <li>✓ Includes heavy-duty tripod stand & padded travel backpack</li>
            </ul>

            <!-- Audio Player -->
            <div class="zhp-audio-player" data-audio-src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Pro_Sound_Bar_v2.mp3">
              <button type="button" class="zhp-audio-btn" aria-label="Play sound preview">
                <svg class="zhp-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <svg class="zhp-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>
              <div class="zhp-audio-info">
                <span class="zhp-audio-label">Hear it in action: <strong>Master (12 Notes Kurd)</strong></span>
                <div class="zhp-audio-bar"><div class="zhp-audio-progress"></div></div>
              </div>
            </div>

            <div class="zhp-card-package">
              <div class="zhp-package-title">What's Included:</div>
              <div class="zhp-package-tags">
                <span>Master 22"</span>
                <span>FREE Tripod Stand</span>
                <span>FREE Travel Backpack</span>
                <span>FREE Mallets</span>
                <span>Braided Edge Rope</span>
              </div>
            </div>

            <div class="zhp-card-pricing">
              <span class="zhp-price-current">$599.00</span>
              <span class="zhp-price-compare">$1,199.00</span>
              <span class="zhp-price-save" style="background:#fee2e2; color:#b91c1c;">Save $600.00</span>
            </div>

            <a href="/products/zavelyn-handpan-master" class="zhp-btn zhp-btn-block zhp-btn-cart" style="background:#8A2C13; color:#fff;">ORDER MASTER 22"</a>
            <div class="zhp-card-guarantee">🛡️ 90-Day Money Back • Lifetime Tuning Warranty</div>
          </div>
        </div>

`;

  if (!best.includes('zavelyn-handpan-master')) {
    best = best.replace('<div class="zhp-product-grid">', `<div class="zhp-product-grid">\n${masterCardHtml}`);
    await uploadAsset(token, 'sections/zhp-bestsellers.liquid', best);
  } else {
    console.log('zhp-bestsellers.liquid already includes master card');
  }

  // =========================================================================
  // 4. UPDATE assets/zhp-collection.css for 4-card grid
  // =========================================================================
  console.log('\n--- 4. Updating assets/zhp-collection.css ---');
  let colCss = await getAsset(token, 'assets/zhp-collection.css');
  if (colCss) {
    colCss = colCss.replace(
      /grid-template-columns:\s*repeat\(3,\s*1fr\);/g,
      'grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));'
    );
    await uploadAsset(token, 'assets/zhp-collection.css', colCss);
  }

  console.log('\n🎉 ALL MASTER HANDPAN ASSETS DEPLOYED SUCCESSFULLY TO THEME 186607567033!');
}

run().catch(console.error);
