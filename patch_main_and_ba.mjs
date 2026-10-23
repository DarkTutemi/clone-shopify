import fs from 'fs';

// -------------------------------------------------------------
// Update earthly-pdp-main.liquid
// -------------------------------------------------------------
function updateMain() {
  let content = fs.readFileSync('Clone-earthlyderm/sections/earthly-pdp-main.liquid', 'utf8');

  // 1. Ratings
  content = content.replace(
    `<p class="pdp-happy-faces-text">Rated 5/5 by <span>6,791</span> happy customers</p>`,
    `{% if product.handle contains 'african' or product.handle contains 'black' %}
        <p class="pdp-happy-faces-text">Rated 5/5 by <span>674</span> happy customers</p>
      {% else %}
        <p class="pdp-happy-faces-text">Rated 5/5 by <span>6,791</span> happy customers</p>
      {% endif %}`
  );

  // 2. Live prices default
  content = content.replace(
    `<span class="pdp-live-price" id="pdpLivePrice">$39.20</span>
        <span class="pdp-live-compare" id="pdpLiveCompare">$102.00</span>`,
    `{% if product.handle contains 'african' or product.handle contains 'black' %}
        <span class="pdp-live-price" id="pdpLivePrice">$41.60</span>
        <span class="pdp-live-compare" id="pdpLiveCompare">$68.00</span>
      {% else %}
        <span class="pdp-live-price" id="pdpLivePrice">$39.20</span>
        <span class="pdp-live-compare" id="pdpLiveCompare">$102.00</span>
      {% endif %}`
  );

  // 3. USPs Grid
  const turmericUsps = `      <!-- 4 USP Points (2x2 Grid) -->
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
      </div>`;

  const newUsps = `      <!-- 4 USP Points (2x2 Grid) -->
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
${turmericUsps}
      {% endif %}`;

  content = content.replace(turmericUsps, newUsps);

  // 4. Subtitle Description
  const turmericSubtitle = `      <!-- Subtitle Description -->
      <div class="pdp-subheading-text">
        <p><strong>Most products only work on the top layer of skin.</strong> Dark marks, acne scars and bumps start deeper. Our turmeric is ground extra fine so it gets down to where they start.</p>
      </div>`;

  const newSubtitle = `      <!-- Subtitle Description -->
      <div class="pdp-subheading-text">
        {% if product.handle contains 'african' or product.handle contains 'black' %}
          <p>Nature's remedy for recurring breakouts on melanin-rich skin.</p>
        {% else %}
          <p><strong>Most products only work on the top layer of skin.</strong> Dark marks, acne scars and bumps start deeper. Our turmeric is ground extra fine so it gets down to where they start.</p>
        {% endif %}
      </div>`;

  content = content.replace(turmericSubtitle, newSubtitle);

  // 5. Kaching deals
  const kachingStart = `<div class="kaching-deal-bars">`;
  const kachingEnd = `</div>\n\n        <!-- Subscription Checkbox -->`;

  const sK = content.indexOf(kachingStart);
  const eK = content.indexOf(kachingEnd);

  if (sK !== -1 && eK !== -1) {
    const turmericKaching = content.slice(sK + kachingStart.length, eK);
    const blackSoapKaching = `
          <!-- Black Soap Bundle Deals -->
          <!-- Card 1: Single Bar -->
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
`;
    content = content.slice(0, sK) + `${kachingStart}\n{% if product.handle contains 'african' or product.handle contains 'black' %}${blackSoapKaching}{% else %}${turmericKaching}{% endif %}` + content.slice(eK);
  }

  // Subscription text
  content = content.replace(
    `<div class="kaching-sub-title">Save 20% More With Auto-Delivery</div>`,
    `{% if product.handle contains 'african' or product.handle contains 'black' %}
                <div class="kaching-sub-title">Save 15% More With Auto-Delivery</div>
              {% else %}
                <div class="kaching-sub-title">Save 20% More With Auto-Delivery</div>
              {% endif %}`
  );

  // ATC button default prices
  content = content.replace(
    `<span id="atcPriceText">$39.20</span>
          <span id="atcCompareText" class="atc-compare-price">$102.00</span>`,
    `{% if product.handle contains 'african' or product.handle contains 'black' %}
            <span id="atcPriceText">$41.60</span>
            <span id="atcCompareText" class="atc-compare-price">$68.00</span>
          {% else %}
            <span id="atcPriceText">$39.20</span>
            <span id="atcCompareText" class="atc-compare-price">$102.00</span>
          {% endif %}`
  );

  // 6. Accordions
  const accStart = `<!-- Accordion: Why It Works -->`;
  const accEnd = `<!-- More FAQ's Link -->`;

  const sA = content.indexOf(accStart);
  const eA = content.indexOf(accEnd);

  if (sA !== -1 && eA !== -1) {
    const turmericAccordions = content.slice(sA, eA);
    const blackSoapAccData = JSON.parse(fs.readFileSync('black_soap_accordions.json', 'utf8'));

    const blackSoapAccordionsHtml = blackSoapAccData.map((a, idx) => `
      <!-- Accordion ${idx + 1}: ${a.title} -->
      <div class="pdp-rich-acc-card">
        <button type="button" class="pdp-rich-acc-header" onclick="toggleRichAcc(this)">
          <span>${a.title}</span>
          <span class="pdp-acc-toggle-icon">+</span>
        </button>
        <div class="pdp-rich-acc-body">
          ${a.content}
        </div>
      </div>
    `).join('\n');

    content = content.slice(0, sA) + `{% if product.handle contains 'african' or product.handle contains 'black' %}\n${blackSoapAccordionsHtml}\n{% else %}\n${turmericAccordions}\n{% endif %}\n      ` + content.slice(eA);
  }

  // 7. Videos block: hide for Black Soap
  const vidStart = `<!-- SEE IT IN ACTION Videos Block -->`;
  const vidEnd = `<!-- Trust Badges (Payment icons) -->`;

  const sV = content.indexOf(vidStart);
  const eV = content.indexOf(vidEnd);

  if (sV !== -1 && eV !== -1) {
    const vidBlock = content.slice(sV, eV);
    content = content.slice(0, sV) + `{% unless product.handle contains 'african' or product.handle contains 'black' %}\n${vidBlock}\n{% endunless %}\n      ` + content.slice(eV);
  }

  fs.writeFileSync('Clone-earthlyderm/sections/earthly-pdp-main.liquid', content);
  console.log('Updated earthly-pdp-main.liquid successfully.');
}

// -------------------------------------------------------------
// Update earthly-before-after-results.liquid (hide stats on Black soap)
// -------------------------------------------------------------
function updateBeforeAfter() {
  let content = fs.readFileSync('Clone-earthlyderm/sections/earthly-before-after-results.liquid', 'utf8');

  // Wrap bar-stats and bar-footnote in unless
  const statsStart = `<div class="bar-stats">`;
  const statsEnd = `<div class="bar-cta-wrap">`;

  const sS = content.indexOf(statsStart);
  const eS = content.indexOf(statsEnd);

  if (sS !== -1 && eS !== -1) {
    const statsBlock = content.slice(sS, eS);
    if (!statsBlock.includes('unless product.handle')) {
      content = content.slice(0, sS) + `{% unless product.handle contains 'african' or product.handle contains 'black' %}\n${statsBlock}\n{% endunless %}\n  ` + content.slice(eS);
      fs.writeFileSync('Clone-earthlyderm/sections/earthly-before-after-results.liquid', content);
      console.log('Updated earthly-before-after-results.liquid stats successfully.');
    }
  }
}

updateMain();
updateBeforeAfter();
