import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (res.ok) console.log(`  ✔ Uploaded: ${key}`);
  else console.error(`  ✗ Failed: ${key}`, data);
}

async function run() {
  let code = fs.readFileSync('Clone-willafarm/theme/sections/willa-featured-product.liquid', 'utf8');

  // Update bundle cards fallback
  const oldFallback = `            <!-- Bundle 1: 2 Pack (Best Seller) -->
            <div class="willa-bundle-card active" id="willaBundle2" onclick="selectWillaBundle('67930179436729', '89.99', '179.99', 'willaBundle2', 'https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png')">
              <div class="bundle-badge">BEST SELLER • 50% OFF</div>
              <div class="bundle-card-inner">
                <input type="radio" name="willa_offer_bundle" id="radioBundle2" checked>
                <div class="bundle-info">
                  <h4>2 Pack (Light + US Switch Cord)</h4>
                  <p>Includes 2x Smart Lamps + 2x Switch Cords • Free Shipping</p>
                </div>
                <div class="bundle-pricing">
                  <span class="price-old">$179.99</span>
                  <span class="price-current">$89.99</span>
                </div>
              </div>
            </div>

            <!-- Bundle 2: 1 Pack -->
            <div class="willa-bundle-card" id="willaBundle1" onclick="selectWillaBundle('67930179403961', '49.99', '99.99', 'willaBundle1', 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg')">
              <div class="bundle-badge secondary">STARTER • 50% OFF</div>
              <div class="bundle-card-inner">
                <input type="radio" name="willa_offer_bundle" id="radioBundle1">
                <div class="bundle-info">
                  <h4>1 Pack (Light + US Switch Cord)</h4>
                  <p>Includes 1x Smart Lamp + 1x Switch Cord</p>
                </div>
                <div class="bundle-pricing">
                  <span class="price-old">$99.99</span>
                  <span class="price-current">$49.99</span>
                </div>
              </div>
            </div>`;

  const newFallback = `            <!-- Bundle 1: 3 Pack (Best Value) -->
            <div class="willa-bundle-card active" id="willaBundle3" onclick="selectWillaBundle('67953654300857', '119.99', '269.94', 'willaBundle3', 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-3pack-bundle.jpg?v=1792853189')">
              <div class="bundle-badge">BEST VALUE • EXTRA 10% OFF • FREE SHIPPING</div>
              <div class="bundle-card-inner">
                <input type="radio" name="willa_offer_bundle" id="radioBundle3" checked>
                <div class="bundle-info">
                  <h4>3 Pack (Light + US Switch Cord)</h4>
                  <p>Includes 3x Smart Lamps + 3x Switch Cords • Only $39.99/set</p>
                </div>
                <div class="bundle-pricing">
                  <span class="price-old">$269.94</span>
                  <span class="price-current">$119.99</span>
                </div>
              </div>
            </div>

            <!-- Bundle 2: 2 Pack -->
            <div class="willa-bundle-card" id="willaBundle2" onclick="selectWillaBundle('67930179436729', '89.99', '179.98', 'willaBundle2', 'https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png')">
              <div class="bundle-badge secondary">FREE SHIPPING</div>
              <div class="bundle-card-inner">
                <input type="radio" name="willa_offer_bundle" id="radioBundle2">
                <div class="bundle-info">
                  <h4>2 Pack (Light + US Switch Cord)</h4>
                  <p>Includes 2x Smart Lamps + 2x Switch Cords • Free Shipping</p>
                </div>
                <div class="bundle-pricing">
                  <span class="price-old">$179.98</span>
                  <span class="price-current">$89.99</span>
                </div>
              </div>
            </div>

            <!-- Bundle 3: 1 Pack -->
            <div class="willa-bundle-card" id="willaBundle1" onclick="selectWillaBundle('67930179403961', '49.99', '89.98', 'willaBundle1', 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg')">
              <div class="bundle-badge secondary">STARTER PACK</div>
              <div class="bundle-card-inner">
                <input type="radio" name="willa_offer_bundle" id="radioBundle1">
                <div class="bundle-info">
                  <h4>1 Pack (Light + US Switch Cord)</h4>
                  <p>Includes 1x Smart Lamp + 1x Switch Cord</p>
                </div>
                <div class="bundle-pricing">
                  <span class="price-old">$89.98</span>
                  <span class="price-current">$49.99</span>
                </div>
              </div>
            </div>`;

  if (code.includes(oldFallback)) {
    code = code.replace(oldFallback, newFallback);
    console.log('✔ Updated bundle fallback in willa-featured-product');
  }

  // Add Shop Now button under Add to Cart
  const atcBtnHtml = `<button type="button" id="willaOfferAtcBtn" class="willa-btn-primary" onclick="submitWillaOfferOrder()">
            {{ section.settings.cta_btn_text | default: 'CLAIM 50% OFF OFFER ➔' }}
          </button>`;

  const newAtcAndShopNow = `<button type="button" id="willaOfferAtcBtn" class="willa-btn-primary" onclick="submitWillaOfferOrder()">
            {{ section.settings.cta_btn_text | default: 'ADD TO CART • CLAIM 50% OFF ➔' }}
          </button>
          <button type="button" id="willaOfferShopNowBtn" class="willa-offer-shopnow" onclick="submitWillaOfferDirectCheckout()">
            SHOP NOW ➔
          </button>`;

  if (code.includes(atcBtnHtml) && !code.includes('willaOfferShopNowBtn')) {
    code = code.replace(atcBtnHtml, newAtcAndShopNow);
    console.log('✔ Added Shop Now button to willa-featured-product');
  }

  // Update default total in markup
  code = code.replace('<strong id="willaOfferTotal">$89.99</strong>', '<strong id="willaOfferTotal">$119.99</strong>');

  // Add submitWillaOfferDirectCheckout
  if (!code.includes('submitWillaOfferDirectCheckout')) {
    code = code.replace('async function submitWillaOfferOrder() {', `async function submitWillaOfferDirectCheckout() {
    const btn = document.getElementById('willaOfferShopNowBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerText = 'REDIRECTING...';
    }
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ id: willaCurrentVariantId, quantity: 1 }]
        })
      });
      window.location.href = '/checkout';
    } catch (e) {
      window.location.href = '/cart/' + willaCurrentVariantId + ':1';
    }
  }

  async function submitWillaOfferOrder() {`);
  }

  // Add CSS for willa-offer-shopnow
  if (!code.includes('.willa-offer-shopnow')) {
    const shopNowCss = `
  .willa-offer-shopnow {
    width: 100%;
    margin-top: 10px;
    padding: 15px 24px;
    background: #1f1b1c;
    color: #ffffff;
    font-family: inherit;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 14px rgba(31, 27, 28, 0.2);
    transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
  }
  .willa-offer-shopnow:hover {
    background: #000000;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  }
  .willa-offer-shopnow:active {
    transform: translateY(0);
  }
`;
    code = code.replace('.willa-btn-primary:hover {', shopNowCss + '\n  .willa-btn-primary:hover {');
  }

  fs.writeFileSync('Clone-willafarm/theme/sections/willa-featured-product.liquid', code);
  const token = await getAccessToken();
  await uploadThemeAsset(token, 'sections/willa-featured-product.liquid', code);
}

run().catch(console.error);
