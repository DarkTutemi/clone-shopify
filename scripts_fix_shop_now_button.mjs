import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function main() {
  let content = fs.readFileSync('live_willa-main-product.liquid', 'utf8');

  // 1. Move Shop Now button below the ATC row so it is a prominent, full-width 1-click checkout button
  const oldActionsHtml = `        <!-- Quantity & ATC -->
        <div class="willa-pdp-actions">
          <div class="willa-pdp-qty-row">
            <label for="willaPdpQty">Quantity:</label>
            <div class="willa-pdp-qty-ctrl">
              <button type="button" onclick="adjustPdpQty(-1)">-</button>
              <input type="number" id="willaPdpQty" value="1" min="1" max="10" readonly>
              <button type="button" onclick="adjustPdpQty(1)">+</button>
            </div>
          </div>

          <button type="button" id="willaPdpAtcBtn" class="willa-btn-primary willa-pdp-atc" onclick="submitPdpOrder()">
            {% if product.available %}
              ADD TO CART ➔
            {% else %}
              SOLD OUT
            {% endif %}
          </button>

          <button type="button" id="willaPdpShopNowBtn" class="willa-pdp-shopnow" onclick="submitPdpDirectCheckout()">
            SHOP NOW ➔
          </button>
        </div>`;

  const newActionsHtml = `        <!-- Quantity & ATC -->
        <div class="willa-pdp-actions">
          <div class="willa-pdp-qty-row">
            <label for="willaPdpQty">Quantity:</label>
            <div class="willa-pdp-qty-ctrl">
              <button type="button" onclick="adjustPdpQty(-1)">-</button>
              <input type="number" id="willaPdpQty" value="1" min="1" max="10" readonly>
              <button type="button" onclick="adjustPdpQty(1)">+</button>
            </div>
          </div>

          <button type="button" id="willaPdpAtcBtn" class="willa-btn-primary willa-pdp-atc" onclick="submitPdpOrder()">
            {% if product.available %}
              ADD TO CART ➔
            {% else %}
              SOLD OUT
            {% endif %}
          </button>
        </div>

        <!-- 1-Click Direct Checkout Button -->
        <button type="button" id="willaPdpShopNowBtn" class="willa-pdp-shopnow" onclick="submitPdpDirectCheckout()">
          ⚡ SHOP NOW (1-CLICK CHECKOUT) ➔
        </button>`;

  if (!content.includes(oldActionsHtml)) {
    console.error('Could not find oldActionsHtml!');
    process.exit(1);
  }
  content = content.replace(oldActionsHtml, newActionsHtml);

  // 2. Add submitPdpDirectCheckout function to script
  const jsFunction = `
  async function submitPdpDirectCheckout() {
    const btn = document.getElementById('willaPdpShopNowBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerText = '⚡ PROCEEDING TO CHECKOUT...';
    }
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: willaCurrentPdpVariantId,
            quantity: willaCurrentPdpQty
          }]
        })
      });
      window.location.href = '/checkout';
    } catch (e) {
      window.location.href = '/cart/' + willaCurrentPdpVariantId + ':' + willaCurrentPdpQty;
    }
  }
`;

  content = content.replace('async function submitPdpOrder() {', jsFunction + '\n  async function submitPdpOrder() {');

  // 3. Add CSS for willa-pdp-shopnow
  const shopNowCss = `
  .willa-pdp-shopnow {
    width: 100%;
    margin-bottom: 24px;
    padding: 16px 24px;
    background: #111827;
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
    box-shadow: 0 4px 14px rgba(17, 24, 39, 0.25);
    transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
    box-sizing: border-box;
  }
  .willa-pdp-shopnow:hover {
    background: #000000;
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35);
  }
  .willa-pdp-shopnow:active {
    transform: translateY(0);
  }
  .willa-pdp-shopnow:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

  content = content.replace('.willa-pdp-atc {', shopNowCss + '\n  .willa-pdp-atc {');

  // Save modified file
  fs.writeFileSync('live_willa-main-product.liquid', content);
  console.log('Saved modified live_willa-main-product.liquid locally.');

  // Upload to Shopify Theme
  const token = await getAccessToken();
  console.log('Uploading to theme...');
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/willa-main-product.liquid',
        value: content
      }
    })
  });
  const data = await res.json();
  if (data.asset) {
    console.log('✔ Successfully uploaded updated sections/willa-main-product.liquid to theme!');
  } else {
    console.error('✗ Upload failed:', data);
  }
}

main().catch(console.error);
