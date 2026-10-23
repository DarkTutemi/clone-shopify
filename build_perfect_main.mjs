import fs from 'fs';

const blackSoapAccData = JSON.parse(fs.readFileSync('black_soap_accordions.json', 'utf8'));

const cleanedBlackSoapAccordionsHtml = blackSoapAccData.map((a, idx) => {
  let body = a.content.trim();
  if (body.startsWith('<div class="product__accordion__inner rte" data-collapsible-content="">')) {
    body = body.slice('<div class="product__accordion__inner rte" data-collapsible-content="">'.length);
  }
  return `
      <!-- Accordion ${idx + 1}: ${a.title} -->
      <div class="pdp-rich-acc-card">
        <button type="button" class="pdp-rich-acc-header" onclick="toggleRichAcc(this)">
          <span>${a.title}</span>
          <span class="pdp-acc-toggle-icon">+</span>
        </button>
        <div class="pdp-rich-acc-body">
          ${body}
        </div>
      </div>`;
}).join('\n');

const turmericAccordionsHtml = `
      <!-- Accordion: Why It Works -->
      <div class="pdp-rich-acc-card">
        <button type="button" class="pdp-rich-acc-header" onclick="toggleRichAcc(this)">
          <span>Why It Works</span>
          <span class="pdp-acc-toggle-icon">+</span>
        </button>
        <div class="pdp-rich-acc-body">
          <div class="acc-content-bullet">
            <img src="//earthlyderm.com/cdn/shop/files/svgviewer-output_5.svg?v=1789857836" alt="" width="18" height="18">
            <div>
              <strong>MADE FOR:</strong>
              <span>Black skin, first. Most products are made for lighter skin and sold to everyone. Earthly Derm was built for melanin-rich skin from day one.</span>
            </div>
          </div>
          <div class="acc-content-bullet">
            <img src="//earthlyderm.com/cdn/shop/files/svgviewer-output_5.svg?v=1789857836" alt="" width="18" height="18">
            <div>
              <strong>BEST FOR:</strong>
              <span>Dark marks, acne scars, razor bumps and uneven tone. Use it on your face, underarms, inner thighs, bikini line, knees and elbows.</span>
            </div>
          </div>
          <div class="acc-content-bullet">
            <img src="//earthlyderm.com/cdn/shop/files/svgviewer-output_5.svg?v=1789857836" alt="" width="18" height="18">
            <div>
              <strong>COLD PRESSED:</strong>
              <span>Most turmeric soap is made with heat, which kills the part of turmeric that fades dark marks. Ours is cold pressed within 48 hours of harvest, so it reaches your skin with everything still in it.</span>
            </div>
          </div>
          <div class="acc-content-bullet">
            <img src="//earthlyderm.com/cdn/shop/files/svgviewer-output_5.svg?v=1789857836" alt="" width="18" height="18">
            <div>
              <strong>WHAT'S INSIDE:</strong>
              <span>Kerala turmeric, tea tree, activated charcoal, shea butter, aloe and raw honey. No hydroquinone, no bleach, no sulfates, no synthetic dyes or fragrance.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Accordion: Your 4-Week Fade Plan -->
      <div class="pdp-rich-acc-card">
        <button type="button" class="pdp-rich-acc-header" onclick="toggleRichAcc(this)">
          <span>Your 4-Week Fade Plan</span>
          <span class="pdp-acc-toggle-icon">+</span>
        </button>
        <div class="pdp-rich-acc-body">
          <div class="acc-content-bullet">
            <img src="//earthlyderm.com/cdn/shop/files/gempages_541528186094093173-72dc17b8-b5fd-4e96-802a-31865f4ae9fb_1.png?v=1789861535" alt="" width="48" height="48">
            <div>
              <strong>1. TAKE YOUR BEFORE PHOTO</strong>
              <span>Do it right away. The most common thing our customers tell us is "I wish I'd taken a before picture."</span>
            </div>
          </div>
          <div class="acc-content-bullet">
            <img src="//earthlyderm.com/cdn/shop/files/svgviewer-output_5.svg?v=1789857836" alt="" width="18" height="18">
            <div>
              <strong>2. WASH TWICE A DAY</strong>
              <span>Lather gently into wet skin morning and evening. Let the natural botanical lather sit for 60 seconds before rinsing.</span>
            </div>
          </div>
          <div class="acc-content-bullet">
            <img src="//earthlyderm.com/cdn/shop/files/svgviewer-output_5.svg?v=1789857836" alt="" width="18" height="18">
            <div>
              <strong>3. NOTICE THE GLOW BY WEEK 2</strong>
              <span>Active turmeric antioxidants penetrate the dermal layer to visibly diminish hyperpigmentation and discoloration.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Accordion: How To Use It -->
      <div class="pdp-rich-acc-card">
        <button type="button" class="pdp-rich-acc-header" onclick="toggleRichAcc(this)">
          <span>How To Use It</span>
          <span class="pdp-acc-toggle-icon">+</span>
        </button>
        <div class="pdp-rich-acc-body">
          <p style="margin:0 0 10px 0; color:#444; font-size:14px; line-height:1.6;">
            <strong>Face:</strong> Wet face with lukewarm water. Rub bar between hands to create a rich lather. Massage into skin for 60 seconds. Rinse clean.
          </p>
          <p style="margin:0; color:#444; font-size:14px; line-height:1.6;">
            <strong>Body:</strong> Safe for daily full body cleansing. Target dark inner thighs, underarms, knees and bikini line. Keep soap bar in a dry spot between uses.
          </p>
        </div>
      </div>`;

// Read the base CSS and JS
const currentContent = fs.readFileSync('Clone-earthlyderm/sections/earthly-pdp-main.liquid', 'utf8');
const paloAltoMarker = '/* Palo Alto Theme Typography & Base PDP Styles */';
const styleStart = currentContent.indexOf(paloAltoMarker);
if (styleStart === -1) {
  throw new Error('Could not find Palo Alto stylesheet marker');
}
const styleAndScript = '<style>\n' + currentContent.slice(styleStart);

const fullTemplate = `{% schema %}
{
  "name": "Earthly PDP Main",
  "settings": []
}
{% endschema %}

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">

<div class="earthly-pdp-wrapper">
  <div class="earthly-pdp-container">
    <!-- LEFT: Gallery Column -->
    <div class="pdp-gallery-col">
      <div class="pdp-main-image-container">
        <div class="pdp-bestseller-badge">BEST SELLER 🔥</div>
        <img id="pdpMainImage" src="{{ product.featured_image | image_url: width: 1000 }}" alt="{{ product.title }}" class="pdp-main-image">
        
        <button type="button" class="pdp-nav-arrow pdp-nav-prev" onclick="navPdpImage(-1)" aria-label="Previous image">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button type="button" class="pdp-nav-arrow pdp-nav-next" onclick="navPdpImage(1)" aria-label="Next image">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <div class="pdp-thumbnails-scroll">
        {% for image in product.images %}
          <button type="button" class="pdp-thumb-card {% if forloop.first %}active{% endif %}" onclick="switchPdpThumb(this, '{{ image | image_url: width: 1000 }}', {{ forloop.index0 }})">
            <img src="{{ image | image_url: width: 150 }}" alt="{{ product.title }}" class="pdp-thumb-img">
          </button>
        {% endfor %}
      </div>
    </div>

    <!-- RIGHT: Buy Box Column -->
    <div class="pdp-buybox-col">
      <!-- Ratings with customer faces -->
      <div class="pdp-happy-faces-flex">
        <div class="pdp-stars">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 77 14" height="14" width="77">
            <path fill="#F1B948" d="M3.16 13.34L4.2 8.52L1.04 6.26C0.57 5.76 0.89 4.8 1.55 4.68L5.43 4.71L6.61 1C6.94 0.28 7.93 0.28 8.26 1L9.44 4.71L13.32 4.68C13.98 4.8 14.3 5.76 13.84 6.26L10.68 8.52L11.92 12.2C12.02 12.87 11.18 13.46 10.57 13.18L7.43 10.88L4.3 13.18C3.69 13.46 3.01 12.87 3.16 12.2V13.34Z"></path>
            <path fill="#F1B948" d="M18.69 13.34L19.73 8.52L16.57 6.26C16.1 5.76 16.42 4.8 17.08 4.68L20.96 4.71L22.14 1C22.47 0.28 23.46 0.28 23.8 1L24.97 4.71L28.85 4.68C29.51 4.8 29.83 5.76 29.37 6.26L26.21 8.52L27.45 12.2C27.55 12.87 26.71 13.46 26.1 13.18L22.96 10.88L19.83 13.18C19.22 13.46 18.54 12.87 18.69 12.2V13.34Z"></path>
            <path fill="#F1B948" d="M34.22 13.34L35.26 8.52L32.1 6.26C31.63 5.76 31.95 4.8 32.61 4.68L36.49 4.71L37.67 1C38 0.28 38.99 0.28 39.33 1L40.5 4.71L44.38 4.68C45.04 4.8 45.36 5.76 44.9 6.26L41.74 8.52L42.98 12.2C43.08 12.87 42.24 13.46 41.63 13.18L38.5 10.88L35.36 13.18C34.75 13.46 34.07 12.87 34.22 12.2V13.34Z"></path>
            <path fill="#F1B948" d="M49.76 13.34L50.79 8.52L47.63 6.26C47.17 5.76 47.48 4.8 48.14 4.68L52.03 4.71L53.21 1C53.54 0.28 54.53 0.28 54.86 1L56.04 4.71L59.91 4.68C60.58 4.8 60.9 5.76 60.43 6.26L57.27 8.52L58.51 12.2C58.61 12.87 57.77 13.46 57.17 13.18L54.03 10.88L50.9 13.18C50.29 13.46 49.61 12.87 49.76 12.2V13.34Z"></path>
            <path fill="#F1B948" d="M65.29 13.34L66.33 8.52L63.16 6.26C62.7 5.76 63.02 4.8 63.68 4.68L67.56 4.71L68.74 1C69.07 0.28 70.06 0.28 70.39 1L71.57 4.71L75.45 4.68C76.11 4.8 76.43 5.76 75.96 6.26L72.8 8.52L74.04 12.2C74.14 12.87 73.3 13.46 72.7 13.18L69.56 10.88L66.43 13.18C65.82 13.46 65.14 12.87 65.29 12.2V13.34Z"></path>
          </svg>
        </div>
        <p class="pdp-happy-faces-text">
          {% if product.handle contains 'african' or product.handle contains 'black' %}
            Rated 5/5 by <span>674</span> happy customers
          {% else %}
            Rated 5/5 by <span>6,791</span> happy customers
          {% endif %}
        </p>
        <img src="//earthlyderm.com/cdn/shop/files/WhatsApp_Image_2024-12-20_at_14.51.30.jpg?v=1769476103" alt="Happy customers" class="pdp-happy-faces-img">
      </div>

      <!-- Title -->
      <h1 class="pdp-headline">{{ product.title }}</h1>

      <!-- Price & Badge Row -->
      <div class="pdp-price-badge-row">
        {% if product.handle contains 'african' or product.handle contains 'black' %}
          <span class="pdp-live-price" id="pdpLivePrice">$41.60</span>
          <span class="pdp-live-compare" id="pdpLiveCompare">$68.00</span>
        {% else %}
          <span class="pdp-live-price" id="pdpLivePrice">$39.20</span>
          <span class="pdp-live-compare" id="pdpLiveCompare">$102.00</span>
        {% endif %}
        <div class="pdp-us-badge">
          <span>🇺🇸</span>
          <span>100% US OWNED</span>
        </div>
      </div>

      <!-- 4 USP Points (2x2 Grid) -->
      {% if product.handle contains 'african' or product.handle contains 'black' %}
      <div class="usp-points-grid">
        <div class="usp-point-card">
          <svg viewBox="0 0 82 82" width="20" height="20" fill="#2C5801"><path d="M28.405 48.928S44.542 23.912 75.372 2.55c2.763-1.915 6.046 1.572 3.979 4.234-13.918 17.921-37.073 49.81-43.093 70.8-.782 2.728-4.346 3.291-5.927.941C25.63 71.543 17 60.565 3.384 49.668c-2.359-1.888-1.617-5.774 1.574-6.211 5.206-.714 13.211-.483 23.447 5.471Z"/></svg>
          <span>Prevents Breakouts</span>
        </div>
        <div class="usp-point-card">
          <svg viewBox="0 0 82 82" width="20" height="20" fill="#2C5801"><path d="M28.405 48.928S44.542 23.912 75.372 2.55c2.763-1.915 6.046 1.572 3.979 4.234-13.918 17.921-37.073 49.81-43.093 70.8-.782 2.728-4.346 3.291-5.927.941C25.63 71.543 17 60.565 3.384 49.668c-2.359-1.888-1.617-5.774 1.574-6.211 5.206-.714 13.211-.483 23.447 5.471Z"/></svg>
          <span>Calms Inflammation</span>
        </div>
        <div class="usp-point-card">
          <svg viewBox="0 0 82 82" width="20" height="20" fill="#2C5801"><path d="M28.405 48.928S44.542 23.912 75.372 2.55c2.763-1.915 6.046 1.572 3.979 4.234-13.918 17.921-37.073 49.81-43.093 70.8-.782 2.728-4.346 3.291-5.927.941C25.63 71.543 17 60.565 3.384 49.668c-2.359-1.888-1.617-5.774 1.574-6.211 5.206-.714 13.211-.483 23.447 5.471Z"/></svg>
          <span>Restores the Skin Barrier</span>
        </div>
        <div class="usp-point-card">
          <svg viewBox="0 0 82 82" width="20" height="20" fill="#2C5801"><path d="M28.405 48.928S44.542 23.912 75.372 2.55c2.763-1.915 6.046 1.572 3.979 4.234-13.918 17.921-37.073 49.81-43.093 70.8-.782 2.728-4.346 3.291-5.927.941C25.63 71.543 17 60.565 3.384 49.668c-2.359-1.888-1.617-5.774 1.574-6.211 5.206-.714 13.211-.483 23.447 5.471Z"/></svg>
          <span>60 day money-back guarantee</span>
        </div>
      </div>
      {% else %}
      <div class="usp-points-grid">
        <div class="usp-point-card">
          <img src="//earthlyderm.com/cdn/shop/files/icons_smooche_new_17_2C5801_FIXED.svg?v=1789810720" alt="Fades dark spots" width="22" height="22">
          <span>Fades dark spots</span>
        </div>
        <div class="usp-point-card">
          <img src="//earthlyderm.com/cdn/shop/files/svgviewer-output_2.svg?v=1789810839" alt="For melanin-rich skin" width="22" height="22">
          <span>For melanin-rich skin</span>
        </div>
        <div class="usp-point-card">
          <img src="//earthlyderm.com/cdn/shop/files/svgviewer-output_4.svg?v=1789811013" alt="1 million+ bars sold" width="22" height="22">
          <span>1 million+ bars sold</span>
        </div>
        <div class="usp-point-card">
          <img src="//earthlyderm.com/cdn/shop/files/svgviewer-output_3.svg?v=1789810974" alt="Results in 2-3 weeks" width="22" height="22">
          <span>Results in 2-3 weeks</span>
        </div>
      </div>
      {% endif %}

      <!-- Subtitle Description -->
      <div class="pdp-subheading-text">
        {% if product.handle contains 'african' or product.handle contains 'black' %}
          <p>Nature's remedy for recurring breakouts on melanin-rich skin.</p>
        {% else %}
          <p><strong>Most products only work on the top layer of skin.</strong> Dark marks, acne scars and bumps start deeper. Our turmeric is ground extra fine so it gets down to where they start.</p>
        {% endif %}
      </div>

      <!-- Kaching Bundles Section -->
      <div class="kaching-bundles-container">
        <div class="kaching-bundles-title">LOW STOCK - SELLING FAST</div>

        <div class="kaching-deal-bars">
          {% if product.handle contains 'african' or product.handle contains 'black' %}
          <!-- Card 1: Buy 1 Single Bar -->
          <div class="kaching-bar" onclick="selectKachingDeal(this, 1, '{{ product.variants[0].id }}', '$27.20', '$34.00')">
            <div class="kaching-bar-inner">
              <img class="kaching-bar-img" src="https://cdn.shopify.com/s/files/1/0650/9808/8582/files/Kaching-Bundles-image-1790062636636_300x300.png?v=1790062666" alt="Single Bar">
              <div class="kaching-bar-info">
                <div class="kaching-bar-line1">
                  <span class="kaching-bar-name">Single Bar</span>
                  <span class="kaching-bar-pill">Only $0.88/day</span>
                </div>
                <div class="kaching-bar-line2">You save 20%</div>
              </div>
              <div class="kaching-bar-pricing">
                <div class="kaching-bar-cur">$27.20</div>
                <div class="kaching-bar-orig">$34.00</div>
              </div>
            </div>
          </div>

          <!-- Card 2: Two Bars (Active Default) -->
          <div class="kaching-bar active" onclick="selectKachingDeal(this, 2, '{{ product.variants[1].id | default: product.variants[0].id }}', '$41.60', '$68.00')">
            <div class="kaching-badge-pill popular">MOST POPULAR</div>
            <div class="kaching-bar-inner">
              <img class="kaching-bar-img" src="https://cdn.shopify.com/s/files/1/0650/9808/8582/files/Kaching-Bundles-image-1790062714750_300x300.png?v=1790062730" alt="Two Bars">
              <div class="kaching-bar-info">
                <div class="kaching-bar-line1">
                  <span class="kaching-bar-name">Two Bars</span>
                  <span class="kaching-bar-pill">Only $0.45/day</span>
                </div>
                <div class="kaching-bar-line2">You Save 39%</div>
              </div>
              <div class="kaching-bar-pricing">
                <div class="kaching-bar-cur">$41.60</div>
                <div class="kaching-bar-orig">$68.00</div>
              </div>
            </div>
          </div>

          <!-- Card 3: Three Bars -->
          <div class="kaching-bar" onclick="selectKachingDeal(this, 3, '{{ product.variants[2].id | default: product.variants[0].id }}', '$57.60', '$102.00')">
            <div class="kaching-badge-pill best-value">BEST VALUE</div>
            <div class="kaching-bar-inner">
              <img class="kaching-bar-img" src="https://cdn.shopify.com/s/files/1/0650/9808/8582/files/Kaching-Bundles-image-1790062739365_300x300.png?v=1790062756" alt="Three Bars">
              <div class="kaching-bar-info">
                <div class="kaching-bar-line1">
                  <span class="kaching-bar-name">Three Bars</span>
                  <span class="kaching-bar-pill">Only $0.37/day</span>
                </div>
                <div class="kaching-bar-line2">You Save 44%</div>
              </div>
              <div class="kaching-bar-pricing">
                <div class="kaching-bar-cur">$57.60</div>
                <div class="kaching-bar-orig">$102.00</div>
              </div>
            </div>
          </div>
          {% else %}
          <!-- Card 1: Buy 1 -->
          <div class="kaching-bar" onclick="selectKachingDeal(this, 1, '{{ product.variants[0].id }}', '$27.20', '$34.00')">
            <div class="kaching-bar-inner">
              <img class="kaching-bar-img" src="https://cdn.shopify.com/s/files/1/0650/9808/8582/files/Kaching-Bundles-image-1790062636636_300x300.png?v=1790062666" alt="Buy 1">
              <div class="kaching-bar-info">
                <div class="kaching-bar-line1">
                  <span class="kaching-bar-name">Buy 1</span>
                  <span class="kaching-bar-pill">Only $0.88/day</span>
                </div>
                <div class="kaching-bar-line2">You save 20%</div>
              </div>
              <div class="kaching-bar-pricing">
                <div class="kaching-bar-cur">$27.20</div>
                <div class="kaching-bar-orig">$34.00</div>
              </div>
            </div>
          </div>

          <!-- Card 2: Buy 2 + Get 1 Free (Active Default) -->
          <div class="kaching-bar active" onclick="selectKachingDeal(this, 2, '{{ product.variants[1].id | default: product.variants[0].id }}', '$39.20', '$102.00')">
            <div class="kaching-badge-pill popular">MOST POPULAR</div>
            <div class="kaching-bar-inner">
              <img class="kaching-bar-img" src="https://cdn.shopify.com/s/files/1/0650/9808/8582/files/Kaching-Bundles-image-1790062714750_300x300.png?v=1790062730" alt="Buy 2 + Get 1 Free">
              <div class="kaching-bar-info">
                <div class="kaching-bar-line1">
                  <span class="kaching-bar-name">Buy 2 + Get 1 Free</span>
                  <span class="kaching-bar-pill">Only $0.42/day</span>
                </div>
                <div class="kaching-bar-line2">You save 62%</div>
              </div>
              <div class="kaching-bar-pricing">
                <div class="kaching-bar-cur">$39.20</div>
                <div class="kaching-bar-orig">$102.00</div>
              </div>
            </div>
          </div>

          <!-- Card 3: Buy 3 + Get 2 Free -->
          <div class="kaching-bar" onclick="selectKachingDeal(this, 3, '{{ product.variants[2].id | default: product.variants[0].id }}', '$55.20', '$170.00')">
            <div class="kaching-badge-pill best-value">BEST VALUE</div>
            <div class="kaching-bar-inner">
              <img class="kaching-bar-img" src="https://cdn.shopify.com/s/files/1/0650/9808/8582/files/Kaching-Bundles-image-1790062739365_300x300.png?v=1790062756" alt="Buy 3 + Get 2 Free">
              <div class="kaching-bar-info">
                <div class="kaching-bar-line1">
                  <span class="kaching-bar-name">Buy 3 + Get 2 Free</span>
                  <span class="kaching-bar-pill">Only $0.36/day</span>
                </div>
                <div class="kaching-bar-line2">You save 68%</div>
              </div>
              <div class="kaching-bar-pricing">
                <div class="kaching-bar-cur">$55.20</div>
                <div class="kaching-bar-orig">$170.00</div>
              </div>
            </div>
          </div>
          {% endif %}
        </div>

        <!-- Subscription Checkbox -->
        <div class="kaching-sub-card">
          <div class="kaching-sub-row">
            <input type="checkbox" id="kachingSubToggle" checked onchange="toggleSubscription(this)" class="kaching-sub-check">
            <label for="kachingSubToggle" class="kaching-sub-content">
              {% if product.handle contains 'african' or product.handle contains 'black' %}
                <div class="kaching-sub-title">Save 15% More With Auto-Delivery</div>
              {% else %}
                <div class="kaching-sub-title">Save 20% More With Auto-Delivery</div>
              {% endif %}
              <div class="kaching-sub-desc">Never lose progress. Zero Commitment. Cancel Anytime.</div>
            </label>
          </div>
          <div class="kaching-sub-select-wrapper" id="subSelectWrapper">
            <select class="kaching-sub-select" id="kachingDeliveryFreq">
              <option value="1">Delivers every month</option>
              <option value="2">Deliver every 2 months</option>
              <option value="3">Deliver every 3 months</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Add To Cart Button -->
      <div class="pdp-action-area">
        <input type="hidden" id="pdpSelectedVariantId" value="{{ product.variants[1].id | default: product.selected_or_first_available_variant.id }}">
        <button type="button" class="pdp-main-atc-button" id="pdpAtcBtn" onclick="triggerPdpAddToCart()">
          <span id="atcActionText">ADD TO CART</span>
          <span class="vs-dash">-</span>
          {% if product.handle contains 'african' or product.handle contains 'black' %}
            <span id="atcPriceText">$41.60</span>
            <span id="atcCompareText" class="atc-compare-price">$68.00</span>
          {% else %}
            <span id="atcPriceText">$39.20</span>
            <span id="atcCompareText" class="atc-compare-price">$102.00</span>
          {% endif %}
        </button>
      </div>

      <!-- Express Delivery Line -->
      <div class="pdp-delivery-line">
        <div class="delivery-truck-svg">
          <svg width="28" height="16" viewBox="0 0 33 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32.7 9L28.86 5.18C28.79 5.11 28.71 5.06 28.62 5.02C28.53 4.98 28.43 4.96 28.33 4.96H25.84V0.73C25.84 0.3 -0.03 0.73 -0.03 0.73H11.35V14.46H13.15C13.16 15.32 14.67 18.03 16.32 18.03C17.97 18.03 19.48 15.32 19.48 15.22H24.06C24.07 15.32 25.58 18.03 27.23 18.03C28.88 18.03 30.39 15.32 30.39 15.22H32.16C32.66 15.22 32.92 14.46 32.92 14.46V9.47C32.92 9.38 32.86 9.22 32.7 9ZM16.31 16.57C15.45 16.57 14.63 15.75 14.63 14.9C14.63 14.05 15.45 13.21 16.31 13.21C17.17 13.21 17.97 14.05 17.97 14.9C17.97 15.75 17.17 16.57 16.31 16.57ZM27.23 16.57C26.37 16.57 25.63 15.75 25.63 14.9C25.63 14.05 26.37 13.21 27.23 13.21C28.09 13.21 28.89 14.05 28.89 14.9C28.89 15.75 28.09 16.57 27.23 16.57ZM28.07 6.48L31.46 9.81L31.41 13.76H30.2C29.61 12.83 28.58 12.02 27.28 11.9C26.47 12.01 25.89 12.2 25.89 12.2V6.48H28.07Z" fill="#1A1A1A"/>
          </svg>
        </div>
        <p>Delivered on <span class="pdp-delivery-date" id="pdpExpressDate">Wednesday, 28 October</span> with Express Shipping</p>
      </div>

      <!-- Trust Badges (Warehouse & Guarantee) -->
      <div class="pdp-trust-dual-row">
        <div class="pdp-trust-dual-item">
          <img src="//earthlyderm.com/cdn/shop/files/60-days_11622780_1.webp?v=1776003100&width=60" alt="60-Day Money-Back Guarantee" width="46" height="46">
          <p>60-Day Money-Back Guarantee</p>
        </div>
        <div class="pdp-trust-dual-item">
          <img src="//earthlyderm.com/cdn/shop/files/Frame_1000003293.webp?v=1776003881&width=60" alt="Indiana Warehouse" width="46" height="46">
          <p>Ships From Our Indiana Warehouse</p>
        </div>
      </div>

      <!-- Accordions Section -->
      {% if product.handle contains 'african' or product.handle contains 'black' %}
${cleanedBlackSoapAccordionsHtml}
      {% else %}
${turmericAccordionsHtml}
      {% endif %}

      <!-- More FAQ's Link -->
      <div class="pdp-more-faqs-wrap">
        <a class="more-faqs" href="#vsFaqSection">More FAQ's</a>
      </div>

      {% unless product.handle contains 'african' or product.handle contains 'black' %}
      <!-- SEE IT IN ACTION Videos Block -->
      <div class="s-main-product__videos-block">
        <h3 class="s-main-product__videos-title">SEE IT IN ACTION</h3>
        <div class="s-main-product__videos-wrapper">
          <div class="s-main-product__video" onclick="playPdpVideo(this)">
            <div class="s-main-product__video-inner">
              <video class="s-main-product__video-file" playsinline loop src="//earthlyderm.com/cdn/shop/videos/c/vp/8211bd2d53794932b84f86e5921fd5b3/8211bd2d53794932b84f86e5921fd5b3.HD-1080p-7.2Mbps-68074137.mp4?v=0"></video>
              <div class="s-main-product__preview-image">
                <img src="//earthlyderm.com/cdn/shop/files/Screenshot_2025-11-04_at_16.49.53.png?v=1769506410&width=600" alt="Action video 1">
              </div>
              <div class="s-main-product__play-icon">
                <svg width="34" height="34" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="white" fill-opacity="0.85"/><polygon points="19,14 35,24 19,34" fill="#2C5801"/></svg>
              </div>
            </div>
          </div>

          <div class="s-main-product__video" onclick="playPdpVideo(this)">
            <div class="s-main-product__video-inner">
              <video class="s-main-product__video-file" playsinline loop src="//earthlyderm.com/cdn/shop/videos/c/vp/f4e25a4a1c6d4f1687849a86785883a0/f4e25a4a1c6d4f1687849a86785883a0.HD-720p-1.6Mbps-67893799.mp4?v=0"></video>
              <div class="s-main-product__preview-image">
                <img src="//earthlyderm.com/cdn/shop/files/Screenshot_2025-09-04_at_12.14.52.png?v=1769475088&width=600" alt="Action video 2">
              </div>
              <div class="s-main-product__play-icon">
                <svg width="34" height="34" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="white" fill-opacity="0.85"/><polygon points="19,14 35,24 19,34" fill="#2C5801"/></svg>
              </div>
            </div>
          </div>

          <div class="s-main-product__video" onclick="playPdpVideo(this)">
            <div class="s-main-product__video-inner">
              <video class="s-main-product__video-file" playsinline loop src="//earthlyderm.com/cdn/shop/videos/c/vp/38f39f1d32754a5ba3a7bccd47c66dfa/38f39f1d32754a5ba3a7bccd47c66dfa.HD-1080p-7.2Mbps-67894105.mp4?v=0"></video>
              <div class="s-main-product__preview-image">
                <img src="//earthlyderm.com/cdn/shop/files/Screenshot_2024-12-25_at_11.42.26.png?v=1769475173&width=600" alt="Action video 3">
              </div>
              <div class="s-main-product__play-icon">
                <svg width="34" height="34" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="white" fill-opacity="0.85"/><polygon points="19,14 35,24 19,34" fill="#2C5801"/></svg>
              </div>
            </div>
          </div>

          <div class="s-main-product__video" onclick="playPdpVideo(this)">
            <div class="s-main-product__video-inner">
              <video class="s-main-product__video-file" playsinline loop src="//earthlyderm.com/cdn/shop/videos/c/vp/d2acbcde9f9b4dbd8663733c21e3a1b9/d2acbcde9f9b4dbd8663733c21e3a1b9.HD-720p-1.6Mbps-67894215.mp4?v=0"></video>
              <div class="s-main-product__preview-image">
                <img src="//earthlyderm.com/cdn/shop/files/Screenshot_2025-09-04_at_12.17.56.png?v=1769475210&width=600" alt="Action video 4">
              </div>
              <div class="s-main-product__play-icon">
                <svg width="34" height="34" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="white" fill-opacity="0.85"/><polygon points="19,14 35,24 19,34" fill="#2C5801"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      {% endunless %}
    </div>
  </div>
</div>

${styleAndScript}
`;

fs.writeFileSync('Clone-earthlyderm/sections/earthly-pdp-main.liquid', fullTemplate);
console.log('Successfully wrote flawless earthly-pdp-main.liquid template!');
