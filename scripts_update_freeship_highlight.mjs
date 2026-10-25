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

  // 1. Remove Free Express Delivery on Orders $49+ for fence-post product in the trust box
  const oldTrustBox = `        <!-- Guarantees Row -->
        <div class="willa-pdp-trust-box">
          <div class="pdp-trust-item">
            <span>🛡️</span> <strong>90-Day Money-Back Guarantee</strong>
          </div>
          <div class="pdp-trust-item">
            <span>🚚</span> <strong>Free Express Delivery on Orders $49+</strong>
          </div>
          <div class="pdp-trust-item">
            <span>🔒</span> <strong>Safe &amp; Encrypted 256-Bit Checkout</strong>
          </div>
        </div>`;

  const newTrustBox = `        <!-- Guarantees Row -->
        <div class="willa-pdp-trust-box">
          <div class="pdp-trust-item">
            <span>🛡️</span> <strong>90-Day Money-Back Guarantee</strong>
          </div>
          {% unless product.handle contains 'fence-post' %}
            <div class="pdp-trust-item">
              <span>🚚</span> <strong>Free Express Delivery on Orders $49+</strong>
            </div>
          {% endunless %}
          <div class="pdp-trust-item">
            <span>🔒</span> <strong>Safe &amp; Encrypted 256-Bit Checkout</strong>
          </div>
        </div>`;

  if (!content.includes(oldTrustBox)) {
    console.error('Could not find oldTrustBox!');
    process.exit(1);
  }
  content = content.replace(oldTrustBox, newTrustBox);

  // 2. Make Free Shipping on Buy 6 stand out boldly
  const oldCard3Desc = `                    {% elsif forloop.index == 3 or v_title contains '6' %}
                      {% assign v_tag = '★ BEST VALUE' %}
                      {% assign v_tag_class = 'best-value' %}
                      {% assign v_desc = '6 Heavy-Duty H-Stakes + Hardware • Save Extra 15% • Free Shipping' %}
                      {% assign unit_ea = variant.price | divided_by: 6.0 | money %}
                      {% assign v_unit = '(' | append: unit_ea | append: '/ea)' %}
                    {% endif %}`;

  const newCard3Desc = `                    {% elsif forloop.index == 3 or v_title contains '6' %}
                      {% assign v_tag = '★ BEST VALUE' %}
                      {% assign v_tag_class = 'best-value' %}
                      {% assign v_desc = '6 Heavy-Duty H-Stakes + Hardware • Save Extra 15% • <span class=\"wf-freeship-text\">🚚 FREE US SHIPPING INCLUDED</span>' %}
                      {% assign unit_ea = variant.price | divided_by: 6.0 | money %}
                      {% assign v_unit = '(' | append: unit_ea | append: '/ea)' %}
                    {% endif %}`;

  if (!content.includes(oldCard3Desc)) {
    console.error('Could not find oldCard3Desc!');
    process.exit(1);
  }
  content = content.replace(oldCard3Desc, newCard3Desc);

  // 3. Add Free Shipping tag to title row and badge in pricing
  const oldTitleRow = `                      <div class="wf-card-title-row">
                        <span class="wf-card-title">{{ variant.title }}</span>
                        <span class="wf-card-tag {{ v_tag_class }}">{{ v_tag }}</span>
                      </div>`;

  const newTitleRow = `                      <div class="wf-card-title-row">
                        <span class="wf-card-title">{{ variant.title }}</span>
                        <span class="wf-card-tag {{ v_tag_class }}">{{ v_tag }}</span>
                        {% if product.handle contains 'fence-post' and forloop.index == 3 %}
                          <span class="wf-card-tag freeship">🚚 FREE SHIPPING</span>
                        {% endif %}
                      </div>`;

  if (!content.includes(oldTitleRow)) {
    console.error('Could not find oldTitleRow!');
    process.exit(1);
  }
  content = content.replace(oldTitleRow, newTitleRow);

  const oldPricingCol = `                    <div class="wf-card-pricing">
                      <span class="wf-card-price">{{ variant.price | money }}</span>
                      {% if variant.compare_at_price > variant.price %}
                        <span class="wf-card-comp">{{ variant.compare_at_price | money }}</span>
                      {% endif %}
                      {% if v_unit != '' %}
                        <span class="wf-unit-note">{{ v_unit }}</span>
                      {% endif %}
                    </div>`;

  const newPricingCol = `                    <div class="wf-card-pricing">
                      <span class="wf-card-price">{{ variant.price | money }}</span>
                      {% if variant.compare_at_price > variant.price %}
                        <span class="wf-card-comp">{{ variant.compare_at_price | money }}</span>
                      {% endif %}
                      {% if v_unit != '' %}
                        <span class="wf-unit-note">{{ v_unit }}</span>
                      {% endif %}
                      {% if product.handle contains 'fence-post' and forloop.index == 3 %}
                        <span class="wf-card-freeship-badge">✨ FREE SHIPPING</span>
                      {% endif %}
                    </div>`;

  if (!content.includes(oldPricingCol)) {
    console.error('Could not find oldPricingCol!');
    process.exit(1);
  }
  content = content.replace(oldPricingCol, newPricingCol);

  // 4. Add CSS for freeship badges
  const extraFreeshipCss = `
  .wf-card-tag.freeship {
    background: #059669;
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 6px rgba(5, 150, 105, 0.25);
  }
  .wf-freeship-text {
    color: #059669;
    font-weight: 700;
  }
  .wf-card-freeship-badge {
    display: inline-block;
    background: #ecfdf5;
    color: #059669;
    border: 1px solid #10b981;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 800;
    padding: 2px 6px;
    margin-top: 3px;
    letter-spacing: 0.5px;
  }
`;
  content = content.replace('.wf-card-tag.best-value {', extraFreeshipCss + '\n  .wf-card-tag.best-value {');

  // Save modified local file
  fs.writeFileSync('live_willa-main-product.liquid', content);
  console.log('Saved modified live_willa-main-product.liquid locally.');

  // Upload to Shopify Theme
  const token = await getAccessToken();
  console.log('Uploading updated asset to theme...');
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
