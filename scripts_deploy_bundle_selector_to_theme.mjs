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

  // 1. Replace the variants selector block
  const oldVariantBlock = `        <!-- Variants Selector -->
        {% unless product.has_only_default_variant %}
          <div class="willa-pdp-variants-wrap">
            <label class="variant-label">Select Option:</label>
            <div class="willa-pdp-variant-chips">
              {% for variant in product.variants %}
                {% assign var_img = '' %}
                {% if variant.featured_image != blank %}
                  {% assign var_img = variant.featured_image | image_url: width: 1000 %}
                {% elsif product.featured_image != blank %}
                  {% assign var_img = product.featured_image | image_url: width: 1000 %}
                {% endif %}
                <button type="button" class="willa-variant-chip {% if variant.id == product.selected_or_first_available_variant.id %}active{% endif %}" onclick="selectPdpVariant('{{ variant.id }}', '{{ variant.price | money }}', '{{ variant.compare_at_price | money }}', '{{ var_img }}', this)">
                  {{ variant.title }}
                </button>
              {% endfor %}
            </div>
          </div>
        {% endunless %}`;

  const newVariantBlock = `        <!-- Variants / Bundle Selector -->
        {% unless product.has_only_default_variant %}
          {% assign is_bundle_product = false %}
          {% for opt in product.options_with_values %}
            {% assign opt_name_down = opt.name | downcase %}
            {% if opt_name_down contains 'bundle' or opt_name_down contains 'quantity' or opt_name_down contains 'package' or opt_name_down contains 'pack' or product.handle contains 'fence-post' %}
              {% assign is_bundle_product = true %}
            {% endif %}
          {% endfor %}

          {% if is_bundle_product and product.variants.size > 1 %}
            <div class="willa-pdp-bundle-wrap">
              <label class="variant-label" style="font-weight: 700; margin-bottom: 10px; display: block;">Select Bundle Option:</label>
              <div class="wf-bundle-selector">
                {% for variant in product.variants %}
                  {% assign var_img = '' %}
                  {% if variant.featured_image != blank %}
                    {% assign var_img = variant.featured_image | image_url: width: 1000 %}
                  {% elsif product.featured_image != blank %}
                    {% assign var_img = product.featured_image | image_url: width: 1000 %}
                  {% endif %}

                  {% assign v_title = variant.title %}
                  {% assign v_tag = 'Standard' %}
                  {% assign v_tag_class = 'standard' %}
                  {% assign v_desc = 'Complete Kit + Mounting Hardware' %}
                  {% assign v_unit = '' %}

                  {% if product.handle contains 'fence-post' %}
                    {% if forloop.index == 1 or v_title contains '2' %}
                      {% assign v_tag = 'Standard' %}
                      {% assign v_tag_class = 'standard' %}
                      {% assign v_desc = '2 Heavy-Duty H-Stakes + Hardware • Complete 2-Post Repair' %}
                      {% assign unit_ea = variant.price | divided_by: 2.0 | money %}
                      {% assign v_unit = '(' | append: unit_ea | append: '/ea)' %}
                    {% elsif forloop.index == 2 or v_title contains '4' %}
                      {% assign v_tag = '★ MOST POPULAR' %}
                      {% assign v_tag_class = 'popular' %}
                      {% assign v_desc = '4 Heavy-Duty H-Stakes + Hardware • Save Extra 5%' %}
                      {% assign unit_ea = variant.price | divided_by: 4.0 | money %}
                      {% assign v_unit = '(' | append: unit_ea | append: '/ea)' %}
                    {% elsif forloop.index == 3 or v_title contains '6' %}
                      {% assign v_tag = '★ BEST VALUE' %}
                      {% assign v_tag_class = 'best-value' %}
                      {% assign v_desc = '6 Heavy-Duty H-Stakes + Hardware • Save Extra 15% • Free Shipping' %}
                      {% assign unit_ea = variant.price | divided_by: 6.0 | money %}
                      {% assign v_unit = '(' | append: unit_ea | append: '/ea)' %}
                    {% endif %}
                  {% else %}
                    {% if forloop.index == 2 %}
                      {% assign v_tag = '★ MOST POPULAR' %}
                      {% assign v_tag_class = 'popular' %}
                      {% assign v_desc = 'Save Extra 5% • Most Popular Choice' %}
                      {% assign unit_ea = variant.price | divided_by: 2.0 | money %}
                      {% assign v_unit = '(' | append: unit_ea | append: '/ea)' %}
                    {% elsif forloop.index == 3 %}
                      {% assign v_tag = '★ BEST VALUE' %}
                      {% assign v_tag_class = 'best-value' %}
                      {% assign v_desc = 'Save Extra 15% • Free Express Shipping' %}
                      {% assign unit_ea = variant.price | divided_by: 3.0 | money %}
                      {% assign v_unit = '(' | append: unit_ea | append: '/ea)' %}
                    {% else %}
                      {% assign v_desc = 'Standard Kit • Fast & Easy Setup' %}
                    {% endif %}
                  {% endif %}

                  <div class="wf-bundle-card {% if variant.id == product.selected_or_first_available_variant.id %}active{% endif %}"
                       onclick="selectPdpBundleCard('{{ variant.id }}', '{{ variant.price | money }}', '{{ variant.compare_at_price | money }}', '{{ var_img }}', this)">
                    <div class="wf-card-radio"></div>
                    <div class="wf-card-info">
                      <div class="wf-card-title-row">
                        <span class="wf-card-title">{{ variant.title }}</span>
                        <span class="wf-card-tag {{ v_tag_class }}">{{ v_tag }}</span>
                      </div>
                      <div class="wf-card-desc">{{ v_desc }}</div>
                    </div>
                    <div class="wf-card-pricing">
                      <span class="wf-card-price">{{ variant.price | money }}</span>
                      {% if variant.compare_at_price > variant.price %}
                        <span class="wf-card-comp">{{ variant.compare_at_price | money }}</span>
                      {% endif %}
                      {% if v_unit != '' %}
                        <span class="wf-unit-note">{{ v_unit }}</span>
                      {% endif %}
                    </div>
                  </div>
                {% endfor %}
              </div>
            </div>
          {% else %}
            <div class="willa-pdp-variants-wrap">
              <label class="variant-label">Select Option:</label>
              <div class="willa-pdp-variant-chips">
                {% for variant in product.variants %}
                  {% assign var_img = '' %}
                  {% if variant.featured_image != blank %}
                    {% assign var_img = variant.featured_image | image_url: width: 1000 %}
                  {% elsif product.featured_image != blank %}
                    {% assign var_img = product.featured_image | image_url: width: 1000 %}
                  {% endif %}
                  <button type="button" class="willa-variant-chip {% if variant.id == product.selected_or_first_available_variant.id %}active{% endif %}" onclick="selectPdpVariant('{{ variant.id }}', '{{ variant.price | money }}', '{{ variant.compare_at_price | money }}', '{{ var_img }}', this)">
                    {{ variant.title }}
                  </button>
                {% endfor %}
              </div>
            </div>
          {% endif %}
        {% endunless %}`;

  if (!content.includes(oldVariantBlock)) {
    console.error('Could not find oldVariantBlock in content!');
    process.exit(1);
  }
  content = content.replace(oldVariantBlock, newVariantBlock);

  // 2. Add selectPdpBundleCard function to JS
  const jsToAdd = `
  function selectPdpBundleCard(id, price, comparePrice, imgUrl, el) {
    willaCurrentPdpVariantId = id;
    document.querySelectorAll('.wf-bundle-card').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');

    const priceEl = document.getElementById('willaPdpPrice');
    if (priceEl) priceEl.innerText = price;

    const stickyPriceEl = document.getElementById('willaStickyPrice');
    if (stickyPriceEl) stickyPriceEl.innerText = price;

    const compEl = document.getElementById('willaPdpComparePrice');
    if (compEl && comparePrice) compEl.innerText = comparePrice;

    if (imgUrl) switchPdpImg(imgUrl);
  }
`;
  content = content.replace('function selectPdpVariant(', jsToAdd + '\n  function selectPdpVariant(');

  // 3. Add CSS for wf-bundle-card
  const cssToAdd = `
  /* WF Bundle Cards Styles */
  .willa-pdp-bundle-wrap {
    margin-bottom: 24px;
  }
  .wf-bundle-selector {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .wf-bundle-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    border: 2px solid #e7e4df;
    border-radius: 12px;
    cursor: pointer;
    background: #ffffff;
    transition: all 0.2s ease;
    position: relative;
    box-sizing: border-box;
  }
  .wf-bundle-card:hover {
    border-color: #cbd5e0;
  }
  .wf-bundle-card.active {
    border-color: #8a2c13;
    background: #fdfaf7;
    box-shadow: 0 4px 14px rgba(138, 44, 19, 0.08);
  }
  .wf-card-radio {
    width: 20px;
    height: 20px;
    border: 2px solid #cbd5e0;
    border-radius: 50%;
    flex-shrink: 0;
    position: relative;
    box-sizing: border-box;
  }
  .wf-bundle-card.active .wf-card-radio {
    border-color: #8a2c13;
  }
  .wf-bundle-card.active .wf-card-radio::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 10px;
    height: 10px;
    background: #8a2c13;
    border-radius: 50%;
  }
  .wf-card-info {
    flex: 1;
    min-width: 0;
  }
  .wf-card-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    flex-wrap: wrap;
  }
  .wf-card-title {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
  }
  .wf-card-tag {
    font-size: 11px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }
  .wf-card-tag.standard {
    background: #edf2f7;
    color: #4a5568;
  }
  .wf-card-tag.popular {
    background: #e6fffa;
    color: #234e52;
  }
  .wf-card-tag.best-value {
    background: #feebc8;
    color: #7b341e;
  }
  .wf-card-desc {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.4;
  }
  .wf-card-pricing {
    text-align: right;
    flex-shrink: 0;
  }
  .wf-card-price {
    display: block;
    font-size: 18px;
    font-weight: 800;
    color: #111827;
  }
  .wf-card-comp {
    display: block;
    font-size: 13px;
    color: #9ca3af;
    text-decoration: line-through;
  }
  .wf-unit-note {
    display: block;
    font-size: 11px;
    color: #0d9488;
    font-weight: 600;
    margin-top: 2px;
  }
`;
  content = content.replace('.willa-pdp-page {', cssToAdd + '\n  .willa-pdp-page {');

  // Save locally
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
