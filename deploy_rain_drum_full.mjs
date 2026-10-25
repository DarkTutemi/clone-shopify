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
  console.log('Got access token. Deploying Zavelyn Rain Drum PDP & Collection updates...');

  // =========================================================================
  // 1. UPDATE sections/zhp-pdp-hero.liquid for small bundle pricing ($59)
  // =========================================================================
  console.log('\n--- 1. Updating sections/zhp-pdp-hero.liquid ---');
  let heroLiquid = await getAsset(token, 'sections/zhp-pdp-hero.liquid');

  // Ensure bundle tier logic handles under $100 items ($59)
  const bundleCalcSnippet = `            {%- if unit_price_num > 400 -%}
              {%- assign extra_save_2_cents = 8000 -%}
              {%- assign extra_save_3_cents = 21000 -%}
              {%- assign extra_save_2_txt = 'Save Extra $80' -%}
              {%- assign extra_save_3_txt = 'Maximum Savings (Extra $210 Off)' -%}
            {%- elsif unit_price_num > 100 -%}
              {%- assign extra_save_2_cents = 4000 -%}
              {%- assign extra_save_3_cents = 9000 -%}
              {%- assign extra_save_2_txt = 'Save Extra $40' -%}
              {%- assign extra_save_3_txt = 'Maximum Savings (Extra $90 Off)' -%}
            {%- else -%}
              {%- assign extra_save_2_cents = 1000 -%}
              {%- assign extra_save_3_cents = 2000 -%}
              {%- assign extra_save_2_txt = 'Save Extra $10' -%}
              {%- assign extra_save_3_txt = 'Maximum Savings (Extra $20 Off)' -%}
            {%- endif -%}`;

  heroLiquid = heroLiquid.replace(
    /\{%- if unit_price_num > 400 -%}[\s\S]*?\{%- endif -%\}/,
    bundleCalcSnippet
  );

  await uploadAsset(token, 'sections/zhp-pdp-hero.liquid', heroLiquid);

  // =========================================================================
  // 2. CREATE templates/product.zavelyn-rain-drum.json
  // =========================================================================
  console.log('\n--- 2. Creating templates/product.zavelyn-rain-drum.json ---');

  const rainReviews = [
    { author: "Emily Watson", title: "Placed in my flower garden — sounds like fairy chimes!", text: "Whenever it rains, the water droplets tap the tongues and create the most soothing, ethereal music across our porch. Absolutely enchanting.", meta: "Zavelyn Rain Drum™ (Green) • Portland, OR" },
    { author: "Marcus Vance", title: "My 4-year-old and I play duets every morning", text: "It fits right in the palm of your hand. The 6 notes harmonize naturally so no matter what note my son taps, it sounds lovely and peaceful.", meta: "Zavelyn Rain Drum™ (Black) • Denver, CO" },
    { author: "Chloe Martin", title: "Keeps me grounded at my work desk", text: "Instead of fidgeting on my phone during stressful Zoom calls, a couple taps on this little drum instantly calms my mind. Great matte finish.", meta: "Zavelyn Rain Drum™ (Purple) • Seattle, WA" },
    { author: "David Henderson", title: "Bought 3 for our family garden rockery", text: "Left them outside all summer through torrential rainstorms. Zero rust, color is as vibrant as day one. High build quality.", meta: "3x Zavelyn Rain Drum™ Trio (Gold, Navy, Green) • Austin, TX" },
    { author: "Sophie Dubois", title: "Pure acoustic tranquility in pocket size", text: "The wooden mallet produces such clear, singing bell tones. It slips easily into my handbag for outdoor meditation walks.", meta: "Zavelyn Rain Drum™ (Navy) • Boston, MA" },
    { author: "Liam O'Connor", title: "50% off is fantastic value", text: "At $59 this is the cutest and highest-quality mindfulness tool I own. Packaged with care and arrived in 3 days.", meta: "Zavelyn Rain Drum™ (Gold) • Chicago, IL" },
    { author: "Tara Jenkins", title: "Yoga students love the gentle chime notes", text: "I use this to signal transitions during restorative yoga sessions. Soft, resonant, and never harsh or jarring.", meta: "Zavelyn Rain Drum™ (Green) • Miami, FL" },
    { author: "Benjamin Lee", title: "Super fun gift for music lovers", text: "Gifted one to my sister and she immediately ordered two more. Everyone who visits taps it and smiles.", meta: "Zavelyn Rain Drum™ (Black) • San Francisco, CA" }
  ];

  const rainReviewBlocks = {};
  const rainReviewOrder = [];
  rainReviews.forEach((r, idx) => {
    const k = `rev_${idx + 1}`;
    rainReviewBlocks[k] = { type: 'review', settings: r };
    rainReviewOrder.push(k);
  });

  const rainFaqs = {
    "faq_1": {
      "type": "faq",
      "settings": {
        "question": "Can I leave the Zavelyn Rain Drum™ outside in the rain?",
        "answer": "Yes! The drum is coated with an electrostatic baked outdoor powder finish designed specifically to withstand rain, humidity, UV sunlight, and temperature shifts without rusting or tarnishing."
      }
    },
    "faq_2": {
      "type": "faq",
      "settings": {
        "question": "Does rain actually play the drum on its own?",
        "answer": "Yes! When placed in an open garden, patio, or beneath rain gutters, falling raindrops strike the curved alloy tongues to trigger soft, natural chime melodies automatically."
      }
    },
    "faq_3": {
      "type": "faq",
      "settings": {
        "question": "What scale are the 6 notes tuned to?",
        "answer": "The Zavelyn Rain Drum™ is tuned to a pure Pentatonic harmony scale across 6 numbered tongues. The pentatonic layout contains no dissonant intervals, meaning every sequence of notes naturally sounds sweet and relaxing."
      }
    },
    "faq_4": {
      "type": "faq",
      "settings": {
        "question": "What is included with the drum?",
        "answer": "Every Zavelyn Rain Drum™ includes the 3-inch 6-tone steel drum, a solid wooden mallet with a soft rubber resonator tip, pre-applied numbered decals, and a protective pouch."
      }
    },
    "faq_5": {
      "type": "faq",
      "settings": {
        "question": "What is your return policy?",
        "answer": "We offer a 90-Day Money-Back Guarantee. If the Rain Drum doesn't bring peace and joy to your home or garden, return it for a 100% full refund with no hassle."
      }
    }
  };
  const rainFaqOrder = ["faq_1", "faq_2", "faq_3", "faq_4", "faq_5"];

  const rainTpl = {
    wrapper: "div#shopify-section-zavelyn-rain-drum",
    sections: {
      "hero": {
        type: "zhp-pdp-hero",
        settings: {
          main_image_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_1_a84698cf-6387-4a5b-98b7-e0c78526960a.jpg?v=1792908838",
          badge_sale: "50% OFF FLASH SALE",
          title: "Zavelyn Rain Drum™ (3-Inch 6-Tone Outdoor Pocket Drum)",
          short_name: "Zavelyn Rain Drum™",
          subtitle: "Pocket 3-Inch Outdoor Garden & Raindrop Resonator • 6 Pentatonic Chime Notes • Rustproof Baked Enamel • Includes Wooden Mallet & Pouch",
          price: "59.00",
          compare_at: "118.00",
          rating_score: "4.9 / 5.0",
          rating_count: "1,120+ Happy Gardeners & Meditators",
          promo_text: "<strong>SPECIAL OFFER:</strong> 50% OFF applied automatically. Includes Free Wooden Mallet & Protective Velvet Travel Pouch!",
          tier1_desc: "3-Inch 6-Tone Rain Drum + Solid Wooden Mallet + Number Decals + Velvet Pouch",
          thumb_1_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_1_a84698cf-6387-4a5b-98b7-e0c78526960a.jpg?v=1792908838",
          thumb_2_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_2_c81b3459-2d36-4b1d-ade1-ba96bc332636.jpg?v=1792908838",
          thumb_3_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_3.jpg?v=1792908838",
          thumb_4_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_4_d3b28ef2-27a4-4509-876b-987a31f4e90d.jpg?v=1792908838",
          thumb_5_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_5.png?v=1792908838",
          guarantee_1: "90-Day Sound",
          guarantee_2: "Fast Tracked US",
          guarantee_3: "Weatherproof Coating"
        }
      },
      "banner": {
        type: "zhp-pdp-banner",
        settings: {
          banner_image_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_3.jpg?v=1792908838",
          badge_text: "NATURAL AMBIANCE",
          heading: "Let Nature Play: Raindrops Create Ambient Garden Melodies",
          text: "",
          point_1: "Specially tuned tongues ring with delicate chimes when hit by raindrops",
          point_2: "Pocket 3-inch size fits anywhere on patios, balconies, rocks, or desks",
          point_3: "Baked electrostatic enamel completely repels water, rust, and UV sun"
        }
      },
      "experience": {
        type: "zhp-pdp-experience",
        settings: {
          feature_image_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_2_c81b3459-2d36-4b1d-ade1-ba96bc332636.jpg?v=1792908838",
          pill_text: "EFFORTLESS DELIGHT",
          title: "6 Pentatonic Notes: Always Harmonic, Never Out of Tune",
          description: ""
        }
      },
      "included": {
        type: "zhp-pdp-included",
        settings: {
          included_image_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_4_d3b28ef2-27a4-4509-876b-987a31f4e90d.jpg?v=1792908838",
          pill_text: "COMPLETE MINI SET",
          title: "Everything You Need for Pocket Peace & Garden Ambiance",
          description: ""
        }
      },
      "specs": {
        type: "zhp-pdp-specs",
        settings: {
          title: "Technical Specifications",
          spec_diameter: "3 Inches (8 cm) Pocket Ultra-Portable",
          spec_material: "Electrostatic Powder-Coated Alloy Steel",
          spec_tuning: "Harmonic Pentatonic Scale (6 Chime Notes)",
          spec_frequency: "Acoustic Natural Bell Resonance",
          spec_tones: "6 Laser-Cut Tongues",
          spec_weight: "115 grams (Ultra Lightweight)",
          spec_finish: "All-Weather Rustproof Baked Texture Enamel"
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
        blocks: rainReviewBlocks,
        block_order: rainReviewOrder,
        settings: {
          title: "Loved by Over 1,100 Gardeners & Families",
          rating_summary: "1,120+ Verified Customer Reviews"
        }
      },
      "faq": {
        type: "zhp-pdp-faq",
        blocks: rainFaqs,
        block_order: rainFaqOrder,
        settings: {}
      },
      "sticky_bar": {
        type: "zhp-pdp-sticky-bar",
        settings: {
          sticky_image_url: "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_1_a84698cf-6387-4a5b-98b7-e0c78526960a.jpg?v=1792908838",
          title: "Zavelyn Rain Drum™ 3\"",
          price: "59.00",
          compare_at: "118.00"
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

  await uploadAsset(token, 'templates/product.zavelyn-rain-drum.json', JSON.stringify(rainTpl, null, 2));

  // =========================================================================
  // 3. UPDATE sections/zhp-bestsellers.liquid on Collection Page
  // Add Rain Drum card (3" • 6 Tones • $59.00)
  // =========================================================================
  console.log('\n--- 3. Updating sections/zhp-bestsellers.liquid ---');
  let best = await getAsset(token, 'sections/zhp-bestsellers.liquid');

  const rainCardHtml = `        <!-- Product: Rain Drum 3 Inch -->
        <div class="zhp-product-card zhp-card-rain" style="border: 1px solid #73C09C;">
          <div class="zhp-card-badge zhp-badge-green">NEW ARRIVAL • SAVE 50%</div>
          <div class="zhp-card-media">
            <a href="/products/zavelyn-rain-drum">
              <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/img_1_a84698cf-6387-4a5b-98b7-e0c78526960a.jpg?v=1792908838" alt="Zavelyn Rain Drum 3 Inch 6 Tones" class="zhp-card-img" loading="lazy">
            </a>
          </div>
          <div class="zhp-card-content">
            <div class="zhp-card-rating">
              <span class="zhp-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</span>
              <span class="zhp-review-count">(1,120 reviews)</span>
            </div>
            <h3 class="zhp-card-title"><a href="/products/zavelyn-rain-drum">Zavelyn Rain Drum™</a></h3>
            <div class="zhp-card-meta">Pocket series • 3" • 6 Tones (Pentatonic)</div>
            <ul class="zhp-card-features">
              <li>✓ Natural raindrop resonator for garden, patio & desk</li>
              <li>✓ Ultra-portable 115g pocket size with 6 chime tongues</li>
              <li>✓ All-weather rustproof baked enamel (5 vibrant colors)</li>
            </ul>

            <!-- Audio Player -->
            <div class="zhp-audio-player" data-audio-src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_Sound_Bar_v2.mp3">
              <button type="button" class="zhp-audio-btn" aria-label="Play sound preview">
                <svg class="zhp-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <svg class="zhp-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>
              <div class="zhp-audio-info">
                <span class="zhp-audio-label">Hear it in action: <strong>Rain Drum (6 Tones)</strong></span>
                <div class="zhp-audio-bar"><div class="zhp-audio-progress"></div></div>
              </div>
            </div>

            <div class="zhp-card-package">
              <div class="zhp-package-title">What's Included:</div>
              <div class="zhp-package-tags">
                <span>Rain Drum 3"</span>
                <span>FREE Wooden Mallet</span>
                <span>FREE Velvet Pouch</span>
                <span>5 Colors Available</span>
              </div>
            </div>

            <div class="zhp-card-pricing">
              <span class="zhp-price-current">$59.00</span>
              <span class="zhp-price-compare">$118.00</span>
              <span class="zhp-price-save">Save $59.00</span>
            </div>

            <a href="/products/zavelyn-rain-drum" class="zhp-btn zhp-btn-block zhp-btn-cart">SELECT COLOR & ORDER</a>
            <div class="zhp-card-guarantee">🛡️ 90-Day Money Back • Weatherproof Guarantee</div>
          </div>
        </div>
`;

  if (!best.includes('zavelyn-rain-drum')) {
    // Append before closing </section> or after other cards
    best = best.replace('</div>\n    </div>\n  </section>', `${rainCardHtml}      </div>\n    </div>\n  </section>`);
    await uploadAsset(token, 'sections/zhp-bestsellers.liquid', best);
  } else {
    console.log('zhp-bestsellers.liquid already includes rain drum card');
  }

  console.log('\n🎉 ALL RAIN DRUM ASSETS DEPLOYED SUCCESSFULLY TO THEME 186607567033!');
}

run().catch(console.error);
