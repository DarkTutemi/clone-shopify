import fs from 'fs';
import {
  getAccessToken,
  uploadThemeAsset,
  HEATING_LAMP_REVIEWS,
  SHIPPING_HTML,
  SHIPPING_AND_REVIEW_CSS
} from './reviews_and_shipping_data.mjs';

async function updateHeatingLampFunnel(token) {
  console.log('\n--- 1. Updating heating-lamp-funnel.liquid ---');
  let code = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');

  // A. Insert Shipping & Delivery section before Reviews section
  const reviewSectionHeader = '<!-- SECTION 6: Customer Reviews (Real Feedback - After FAQ) -->';
  if (code.includes(reviewSectionHeader) && !code.includes('wf-shipping-section')) {
    code = code.replace(reviewSectionHeader, SHIPPING_HTML + '\n\n  ' + reviewSectionHeader);
    console.log('  ✔ Inserted Shipping & Delivery Section before Reviews');
  }

  // B. Update review cards rendering in Section 6
  const oldReviewLoopRegex = /<div class="wf-reviews-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
  
  let fallbackCardsHtml = '';
  HEATING_LAMP_REVIEWS.forEach((rev, idx) => {
    fallbackCardsHtml += `
          <article class="wf-review-card">
            <div>
              <div class="wf-rev-header">
                <div class="wf-rev-author-wrap">
                  <span class="wf-rev-author">${rev.author}</span>
                  <span class="wf-rev-date">${rev.date}</span>
                </div>
                <span class="wf-rev-verified">✔ Verified Buyer</span>
              </div>
              <div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>
              <h4 class="wf-rev-headline">"${rev.headline}"</h4>
              <p class="wf-rev-body">${rev.review}</p>
            </div>
            ${rev.photo_url ? `
            <div class="wf-rev-photo">
              <img src="${rev.photo_url}" alt="${rev.author} Customer Review Photo" loading="lazy">
            </div>` : ''}
          </article>`;
  });

  const newReviewsGridHtml = `<div class="wf-reviews-grid">
        {% assign rev_count = 0 %}
        {% for block in section.blocks %}
          {% if block.type == 'review_card' %}
            {% assign rev_count = rev_count | plus: 1 %}
            <article class="wf-review-card" {{ block.shopify_attributes }}>
              <div>
                <div class="wf-rev-header">
                  <div class="wf-rev-author-wrap">
                    <span class="wf-rev-author">{{ block.settings.author }}</span>
                    <span class="wf-rev-date">{{ block.settings.date | default: 'Verified Buyer' }}</span>
                  </div>
                  {% if block.settings.verified %}<span class="wf-rev-verified">✔ Verified Buyer</span>{% endif %}
                </div>
                <div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>
                <h4 class="wf-rev-headline">"{{ block.settings.headline }}"</h4>
                <p class="wf-rev-body">{{ block.settings.review }}</p>
              </div>
              {% if block.settings.photo_url != blank %}
                <div class="wf-rev-photo">
                  <img src="{{ block.settings.photo_url }}" alt="{{ block.settings.author }} Review Photo" loading="lazy">
                </div>
              {% elsif block.settings.photo != blank %}
                <div class="wf-rev-photo">
                  <img src="{{ block.settings.photo | img_url: '600x' }}" alt="{{ block.settings.author }} Review Photo" loading="lazy">
                </div>
              {% endif %}
            </article>
          {% endif %}
        {% endfor %}
        {% if rev_count == 0 %}
${fallbackCardsHtml}
        {% endif %}
      </div>
    </div>
  </section>`;

  if (code.match(oldReviewLoopRegex)) {
    code = code.replace(oldReviewLoopRegex, newReviewsGridHtml);
    console.log('  ✔ Updated Reviews grid with 10 reviews and photo support');
  }

  // C. Add CSS
  if (!code.includes('wf-shipping-trust-card')) {
    code = code.replace('</style>', SHIPPING_AND_REVIEW_CSS + '\n</style>');
    console.log('  ✔ Appended Shipping & Review CSS');
  }

  // D. Update schema to support photo_url and date
  if (!code.includes('"id": "photo_url"')) {
    code = code.replace(
      /{\s*"type":\s*"review_card",[\s\S]*?"settings":\s*\[/,
      `{
      "type": "review_card",
      "name": "Review Card",
      "settings": [
        { "type": "text", "id": "date", "label": "Review Date", "default": "Verified 3 days ago" },
        { "type": "text", "id": "photo_url", "label": "Review Photo URL" },`
    );
    console.log('  ✔ Updated review_card block schema');
  }

  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', code);
  await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', code);
}

async function updateHeatingLampTemplate(token) {
  console.log('\n--- 2. Updating templates/product.sakerplus-livestock-heating-lamp.json ---');
  const path = 'Clone-willafarm/theme/templates/product.sakerplus-livestock-heating-lamp.json';
  const json = JSON.parse(fs.readFileSync(path, 'utf8'));
  const section = json.sections.heating_lamp_funnel;

  // Add 10 review blocks
  HEATING_LAMP_REVIEWS.forEach((rev, idx) => {
    const key = `rev_${idx + 1}`;
    section.blocks[key] = {
      type: "review_card",
      settings: {
        author: rev.author,
        verified: true,
        date: rev.date,
        stars: "★★★★★",
        headline: rev.headline,
        review: `"${rev.review}"`,
        photo_url: rev.photo_url || ""
      }
    };
  });

  // Ensure rev_1 through rev_10 are in block_order
  const revKeys = HEATING_LAMP_REVIEWS.map((_, idx) => `rev_${idx + 1}`);
  section.block_order = section.block_order.filter(k => !k.startsWith('rev_'));
  section.block_order.push(...revKeys);

  const updatedJson = JSON.stringify(json, null, 2);
  fs.writeFileSync(path, updatedJson);
  await uploadThemeAsset(token, 'templates/product.sakerplus-livestock-heating-lamp.json', updatedJson);
  console.log('  ✔ Configured 10 review blocks in product template JSON');
}

async function updateWillaReviews(token) {
  console.log('\n--- 3. Updating sections/willa-reviews.liquid (All Store Products) ---');
  let code = fs.readFileSync('Clone-willafarm/theme/sections/willa-reviews.liquid', 'utf8');

  // 10 Detailed reviews for General Products
  const GENERAL_REVIEWS = [
    {
      author: "David M.",
      verified: true,
      date: "Verified 3 days ago",
      title: "Exceeded every single expectation — premium build quality",
      review: "I was a bit skeptical before buying, but the moment I unboxed it I could tell the materials and construction are top notch. Works flawlessly right out of the box. Couldn't be happier with this purchase!",
      photo: "https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/ugc-review-1.jpg?v=1792856891"
    },
    {
      author: "Jennifer K.",
      verified: true,
      date: "Verified 5 days ago",
      title: "Shipped lightning fast via FedEx & packaged securely",
      review: "Ordered on Tuesday and FedEx delivered it to my porch Thursday afternoon! Everything was packed with thick protective cushioning. Instructions were clear, setup took 2 minutes, and performance is 10/10.",
      photo: "https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/ugc-review-2.jpg?v=1792856893"
    },
    {
      author: "Robert H.",
      verified: true,
      date: "Verified 1 week ago",
      title: "Total game-changer for our home and workshop",
      review: "Does exactly what it promises without any unnecessary complications. Heavy duty components, smooth operation, and you can tell it's built to last for years. Highly recommend getting it while on sale.",
      photo: ""
    },
    {
      author: "Amanda S.",
      verified: true,
      date: "Verified 1 week ago",
      title: "Claimed the 50% discount and it was the best deal of the year",
      review: "Saw this recommended on a home improvement forum and decided to grab it with the 50% off promotion. The quality rivals brands costing 3x as much. Very pleased with Zavelyn!",
      photo: "https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/ugc-review-3.jpg?v=1792856894"
    },
    {
      author: "Michael B.",
      verified: true,
      date: "Verified 2 weeks ago",
      title: "Solid construction, intuitive controls, whisper quiet",
      review: "I really appreciate the engineering on this. It feels weighted, durable, and thoughtfully designed. No weird plastic smells or noisy operation. It just works seamlessly.",
      photo: ""
    },
    {
      author: "Patricia W.",
      verified: true,
      date: "Verified 2 weeks ago",
      title: "Bought this after seeing a neighbor's setup — 5 stars all the way",
      review: "My neighbor let me test theirs and I ordered mine that very night. Customer service answered my shipping question within an hour, and tracking was provided immediately. Very satisfied customer.",
      photo: "https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/ugc-review-4.jpg?v=1792856896"
    },
    {
      author: "Thomas L.",
      verified: true,
      date: "Verified 3 weeks ago",
      title: "Worth every penny, solved an ongoing frustration",
      review: "We've tried two cheaper alternatives in the past and both broke down within months. The Zavelyn unit has been running non-stop without a single hiccup. Wish I had bought this first.",
      photo: ""
    },
    {
      author: "Heather N.",
      verified: true,
      date: "Verified 3 weeks ago",
      title: "Practical, durable, and very easy for anyone to use",
      review: "Even if you're not particularly handy, this is practically plug and play. Great ergonomics, clear indicator displays, and feels safe to leave running unattended.",
      photo: "https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/ugc-review-5.jpg?v=1792856897"
    },
    {
      author: "Chris G.",
      verified: true,
      date: "Verified 1 month ago",
      title: "Reliable everyday performance — already bought a second one",
      review: "After testing the first one for two weeks, I came back and bought a second unit as a gift for my father. He loves it just as much as I do. Solid 5 stars.",
      photo: ""
    },
    {
      author: "Karen D.",
      verified: true,
      date: "Verified 1 month ago",
      title: "Fast dispatch, real-time tracking, 90-day peace of mind",
      review: "You can order with complete confidence. Arrived in pristine condition via FedEx with tracking at every stage. The 90-day guarantee gave me confidence to buy, but I certainly won't be returning it!",
      photo: ""
    }
  ];

  let willaFallbackHtml = '';
  GENERAL_REVIEWS.forEach(rev => {
    willaFallbackHtml += `
          <div class="willa-review-card">
            <div>
              <div class="review-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>
              <h4 class="review-title">"${rev.title}"</h4>
              <p class="review-body">${rev.review}</p>
            </div>
            ${rev.photo ? `
            <div class="review-photo">
              <img src="${rev.photo}" alt="${rev.author} Customer Review Photo" loading="lazy">
            </div>` : ''}
            <div class="review-footer-wrap">
              <div class="review-author-wrap">
                <strong>${rev.author}</strong>
                <span class="review-date">${rev.date}</span>
                <span class="verified-tag">✓ Verified Buyer</span>
              </div>
              <div class="review-product-tag">Item: {{ product.title | default: 'Zavelyn® Equipment' }}</div>
            </div>
          </div>`;
  });

  const willaNewTemplate = `<section class="willa-reviews-section">
  <div class="willa-container">

    <!-- SHIPPING & DELIVERY GUARANTEE BANNER (Directly before Customer Reviews) -->
    <div class="wf-shipping-trust-card" style="margin-bottom: 50px;">
      <div class="wf-shipping-badge-pill">
        <span class="wf-shipping-pill-icon">🚚</span>
        <span>FAST &amp; INSURED WORLDWIDE EXPRESS SHIPPING</span>
      </div>
      <h3 class="wf-shipping-card-heading">Doorstep Delivery Guarantee &amp; Real-Time Tracking</h3>
      
      <div class="wf-shipping-card-body">
        <div class="wf-shipping-media-col">
          <div class="wf-shipping-img-frame top-frame">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/5555.webp?v=1792856415" alt="FedEx Courier Dispatch and Safe Package Handling" loading="lazy">
            <div class="wf-shipping-img-tag">⚡ Handled with Care &bull; Direct Carrier Dispatch</div>
          </div>
          <div class="wf-shipping-img-frame bottom-frame">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/44444.webp?v=1792856415" alt="Express Worldwide Delivery &amp; Tracked Shipping" loading="lazy">
          </div>
        </div>
        
        <div class="wf-shipping-text-col">
          <div class="wf-shipping-summary-text">
            <p>
              Every Zavelyn® order is meticulously inspected, cushioned in heavy-duty protective packaging, and dispatched directly from our regional fulfillment centers within <strong>24–48 business hours</strong>. We partner directly with trusted premier carriers including <strong>FedEx, USPS, and DHL Express</strong> to guarantee rapid, dependable, door-to-door transit across the United States and worldwide.
            </p>
            <p>
              The moment your shipment leaves our facility, you will automatically receive an instant tracking link via email and SMS with live, step-by-step delivery updates. Backed by our <strong>100% In-Transit Protection Guarantee</strong> — if your parcel experiences any transit delay or packaging damage, our dedicated 24/7 support team will arrange an immediate zero-cost replacement without delay.
            </p>
          </div>
          
          <div class="wf-shipping-features-grid">
            <div class="wf-shipping-feature-box">
              <span class="wf-feat-icon">⏱️</span>
              <div>
                <strong>24–48h Dispatch</strong>
                <span>Swift domestic fulfillment from regional hubs</span>
              </div>
            </div>
            <div class="wf-shipping-feature-box">
              <span class="wf-feat-icon">📦</span>
              <div>
                <strong>100% Insured Transit</strong>
                <span>Full coverage against lost or transit-damaged items</span>
              </div>
            </div>
            <div class="wf-shipping-feature-box">
              <span class="wf-feat-icon">🔍</span>
              <div>
                <strong>Live Real-Time Tracking</strong>
                <span>Doorstep progress notifications via SMS &amp; email</span>
              </div>
            </div>
            <div class="wf-shipping-feature-box">
              <span class="wf-feat-icon">🛡️</span>
              <div>
                <strong>90-Day Money-Back</strong>
                <span>Total risk-free satisfaction guarantee on all orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CUSTOMER REVIEWS HEADER -->
    <div class="willa-section-header">
      <span class="willa-pill">{{ section.settings.pill_text | default: 'REAL EXPERIENCES' }}</span>
      <h2 class="willa-section-title willa-serif">{{ section.settings.heading | default: 'Trusted by Hardworking Makers & Farmers' }}</h2>
      <p class="willa-section-subtitle">{{ section.settings.subtitle | default: 'See how Zavelyn® tools and equipment solve daily challenges across workshops, farms, and homes.' }}</p>
    </div>

    <!-- Overall Rating Summary Card -->
    <div class="willa-reviews-rating-bar">
      <div class="rating-bar-score">{{ section.settings.rating_score | default: '4.9' }}</div>
      <div class="rating-bar-details">
        <div class="willa-stars">{% render 'trustpilot-stars', width: 92, height: 17 %}</div>
        <span>{{ section.settings.rating_note | default: '12,480+ Verified 5-Star Reviews across North America' }}</span>
      </div>
    </div>

    <div class="willa-reviews-grid">
      {% if section.blocks.size > 0 %}
        {% for block in section.blocks %}
          <div class="willa-review-card" {{ block.shopify_attributes }}>
            <div>
              <div class="review-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>
              <h4 class="review-title">"{{ block.settings.title }}"</h4>
              <p class="review-body">{{ block.settings.review }}</p>
            </div>
            {% if block.settings.photo_url != blank %}
              <div class="review-photo">
                <img src="{{ block.settings.photo_url }}" alt="{{ block.settings.author }} Review Photo" loading="lazy">
              </div>
            {% elsif block.settings.photo != blank %}
              <div class="review-photo">
                <img src="{{ block.settings.photo | img_url: '600x' }}" alt="{{ block.settings.author }} Review Photo" loading="lazy">
              </div>
            {% endif %}
            <div class="review-footer-wrap">
              <div class="review-author-wrap">
                <strong>{{ block.settings.author }}</strong>
                <span class="review-date">{{ block.settings.date | default: 'Verified Buyer' }}</span>
                {% if block.settings.verified %}<span class="verified-tag">✓ Verified Buyer</span>{% endif %}
              </div>
              <div class="review-product-tag">Item: {{ block.settings.purchased_product | default: product.title }}</div>
            </div>
          </div>
        {% endfor %}
      {% else %}
${willaFallbackHtml}
      {% endif %}
    </div>
  </div>
</section>

<style>
  .willa-reviews-section {
    background-color: #faf7f4;
    padding: 60px 0;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  .willa-section-header {
    text-align: center;
    margin-bottom: 30px;
  }
  .willa-pill {
    display: inline-block;
    background: #f4ece4;
    color: #8a2c13;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.8px;
    padding: 5px 14px;
    border-radius: 9999px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .willa-section-title {
    font-size: 32px;
    font-weight: 800;
    color: #231f20;
    margin: 0 0 10px 0;
  }
  .willa-section-subtitle {
    font-size: 15px;
    color: #6d6260;
    margin: 0;
  }
  .willa-reviews-rating-bar {
    max-width: 480px;
    margin: 0 auto 40px auto;
    background: #ffffff;
    border: 1px solid #e7e4df;
    border-radius: 16px;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    gap: 18px;
    box-shadow: 0 4px 14px rgba(59, 43, 47, 0.04);
  }
  .rating-bar-score {
    font-size: 38px;
    font-weight: 900;
    color: #8a2c13;
  }
  .rating-bar-details span {
    font-size: 12px;
    color: #59514f;
    font-weight: 600;
  }
  .willa-reviews-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .willa-review-card {
    background: #ffffff;
    border: 1px solid #e7e4df;
    border-radius: 16px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 4px 14px rgba(59, 43, 47, 0.03);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .willa-review-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59, 43, 47, 0.08);
  }
  .review-title {
    font-size: 15px;
    font-weight: 700;
    color: #231f20;
    margin: 10px 0 8px 0;
    line-height: 1.35;
  }
  .review-body {
    font-size: 13px;
    color: #59514f;
    line-height: 1.55;
    margin: 0;
  }
  .review-photo {
    margin-top: 14px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #eae5e0;
    background: #f7f5f2;
    aspect-ratio: 4 / 3;
    max-height: 190px;
  }
  .review-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }
  .review-photo:hover img {
    transform: scale(1.05);
  }
  .review-footer-wrap {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid #f4f0eb;
  }
  .review-author-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 6px;
  }
  .review-author-wrap strong {
    font-size: 13.5px;
    color: #231f20;
  }
  .review-date {
    font-size: 11px;
    color: #8c827a;
  }
  .verified-tag {
    font-size: 11px;
    font-weight: 700;
    color: #00B67A;
  }
  .review-product-tag {
    font-size: 11px;
    color: #8a7e78;
    background: #faf7f4;
    padding: 3px 8px;
    border-radius: 6px;
    display: inline-block;
  }
  .willa-stars, .review-stars {
    display: inline-flex;
    align-items: center;
    line-height: 0;
  }

  ${SHIPPING_AND_REVIEW_CSS}
</style>

{% schema %}
{
  "name": "Willa Customer Reviews",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Pill Badge Text",
      "default": "REAL EXPERIENCES"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Trusted by Hardworking Makers & Farmers"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "See how Zavelyn® tools and equipment solve daily challenges across workshops, farms, and homes."
    },
    {
      "type": "text",
      "id": "rating_score",
      "label": "Score",
      "default": "4.9"
    },
    {
      "type": "text",
      "id": "rating_note",
      "label": "Rating Note Text",
      "default": "12,480+ Verified 5-Star Reviews across North America"
    }
  ],
  "blocks": [
    {
      "type": "review_card",
      "name": "Customer Review",
      "settings": [
        { "type": "text", "id": "author", "label": "Customer Name", "default": "Debra W." },
        { "type": "checkbox", "id": "verified", "label": "Verified Buyer Badge", "default": true },
        { "type": "text", "id": "date", "label": "Review Date", "default": "Verified 3 days ago" },
        { "type": "text", "id": "stars", "label": "Stars Rating", "default": "★★★★★" },
        { "type": "text", "id": "title", "label": "Review Headline", "default": "Total game changer for our poultry barn!" },
        { "type": "textarea", "id": "review", "label": "Review Body", "default": "Threw out my old red heat lamp the same day the Zavelyn® heating lamp arrived. It stays completely cool to the touch and baby chicks sleep soundly." },
        { "type": "text", "id": "purchased_product", "label": "Purchased Product Name", "default": "Zavelyn® Equipment" },
        { "type": "text", "id": "photo_url", "label": "Customer Photo URL" }
      ]
    }
  ],
  "presets": [
    {
      "name": "Willa Customer Reviews"
    }
  ]
}
{% endschema %}
`;

  fs.writeFileSync('Clone-willafarm/theme/sections/willa-reviews.liquid', willaNewTemplate);
  await uploadThemeAsset(token, 'sections/willa-reviews.liquid', willaNewTemplate);
}

async function main() {
  console.log('--- Applying 10 Reviews, UGC Photos & Shipping Section ---');
  const token = await getAccessToken();

  await updateHeatingLampFunnel(token);
  await updateHeatingLampTemplate(token);
  await updateWillaReviews(token);

  console.log('\n✔ ALL SECTIONS & TEMPLATES DEPLOYED TO SHOPIFY THEME SUCCESSFULLY!');
}

main().catch(console.error);
