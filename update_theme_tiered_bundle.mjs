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

async function updateTheme() {
  const token = await getAccessToken();
  console.log('Got access token. Fetching live sections/willa-main-product.liquid...');

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=sections/willa-main-product.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  let content = data.asset.value;

  // Find the variant/bundle selector block
  const targetPatternStart = '<!-- Variants / Bundle Selector -->';
  const targetPatternEnd = '<!-- Quantity & ATC -->';

  const startIndex = content.indexOf(targetPatternStart);
  const endIndex = content.indexOf(targetPatternEnd);

  if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find variant selector boundary in content!');
    return;
  }

  const replacementBlock = `<!-- Variants / Bundle Selector -->
        {% unless product.has_only_default_variant %}
          {% assign has_bundle_and_color = false %}
          {% assign bundle_option = nil %}
          {% assign color_option = nil %}

          {% if product.options.size > 1 %}
            {% for opt in product.options_with_values %}
              {% assign opt_name_down = opt.name | downcase %}
              {% if opt_name_down contains 'bundle' or opt_name_down contains 'quantity' or opt_name_down contains 'package' or opt_name_down contains 'tier' %}
                {% assign bundle_option = opt %}
              {% elsif opt_name_down contains 'color' or opt_name_down contains 'colour' %}
                {% assign color_option = opt %}
              {% endif %}
            {% endfor %}
            {% if bundle_option != nil and color_option != nil %}
              {% assign has_bundle_and_color = true %}
            {% endif %}
          {% endif %}

          {% if has_bundle_and_color %}
            <!-- Two-Tier Selector: Buy 1, 2, 3 Bundle Cards + Color Swatches -->
            <div class="willa-pdp-bundle-wrap">
              <label class="variant-label" style="font-weight: 700; margin-bottom: 10px; display: block;">Select Bundle & Save:</label>
              <div class="wf-bundle-selector">
                {% for b_val in bundle_option.values %}
                  {% assign rep_var = nil %}
                  {% for v in product.variants %}
                    {% if v.option1 == b_val and rep_var == nil %}
                      {% assign rep_var = v %}
                    {% endif %}
                  {% endfor %}

                  {% assign v_tag = 'Standard' %}
                  {% assign v_tag_class = 'standard' %}
                  {% assign v_desc = '1 Cozy Wrap • Fast & Easy Setup' %}
                  {% if forloop.index == 2 or b_val contains '2' %}
                    {% assign v_tag = '★ MOST POPULAR' %}
                    {% assign v_tag_class = 'popular' %}
                    {% assign v_desc = 'Save 45% • Just $45.00 each • Most Popular Choice' %}
                  {% elsif forloop.index == 3 or b_val contains '3' %}
                    {% assign v_tag = '★ BEST VALUE' %}
                    {% assign v_tag_class = 'best-value' %}
                    {% assign v_desc = 'Buy 2, Get 1 FREE • Just $43.33 each • Free Express Shipping' %}
                  {% endif %}

                  <div class="wf-bundle-card {% if forloop.first %}active{% endif %}"
                       data-bundle-val="{{ b_val | escape }}"
                       onclick="selectTierBundle('{{ b_val | escape }}', '{{ rep_var.price | money }}', '{{ rep_var.compare_at_price | money }}', this)">
                    <div class="wf-card-radio"></div>
                    <div class="wf-card-info">
                      <div class="wf-card-title-row">
                        <span class="wf-card-title">{{ b_val }}</span>
                        <span class="wf-card-tag {{ v_tag_class }}">{{ v_tag }}</span>
                      </div>
                      <div class="wf-card-desc">{{ v_desc }}</div>
                    </div>
                    <div class="wf-card-pricing">
                      <span class="wf-card-price">{{ rep_var.price | money }}</span>
                      {% if rep_var.compare_at_price > rep_var.price %}
                        <span class="wf-card-comp">{{ rep_var.compare_at_price | money }}</span>
                      {% endif %}
                    </div>
                  </div>
                {% endfor %}
              </div>

              <!-- Color Swatches / Picker -->
              <div class="willa-color-picker-wrap" style="margin-top: 18px; padding: 16px; background: #faf8f5; border: 1.5px solid #e7e4df; border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-size: 14px; font-weight: 700; color: #231f20;">Select Color: <strong id="willaSelectedColorLabel" style="color: #8a2c13;">{{ color_option.values.first }}</strong></span>
                  <span style="font-size: 12px; color: #16a34a; font-weight: 600;">✓ In Stock</span>
                </div>
                <div class="willa-color-chips" style="display: flex; gap: 8px; flex-wrap: wrap;">
                  {% for c_val in color_option.values %}
                    {% assign color_img = '' %}
                    {% for v in product.variants %}
                      {% if v.option2 == c_val and v.featured_image != blank and color_img == '' %}
                        {% assign color_img = v.featured_image | image_url: width: 1000 %}
                      {% endif %}
                    {% endfor %}

                    {% assign dot_color = '#cbd5e0' %}
                    {% assign c_down = c_val | downcase %}
                    {% if c_down contains 'brown' %}
                      {% assign dot_color = '#8c5a3c' %}
                    {% elsif c_down contains 'apricot' %}
                      {% assign dot_color = '#e8c39e' %}
                    {% elsif c_down contains 'green' %}
                      {% assign dot_color = '#556b2f' %}
                    {% elsif c_down contains 'red' %}
                      {% assign dot_color = '#9b2c2c' %}
                    {% elsif c_down contains 'purple' %}
                      {% assign dot_color = '#7e57c2' %}
                    {% elsif c_down contains 'white' %}
                      {% assign dot_color = '#ffffff' %}
                    {% elsif c_down contains 'black' %}
                      {% assign dot_color = '#111827' %}
                    {% endif %}

                    <button type="button" class="willa-color-swatch-btn {% if forloop.first %}active{% endif %}"
                            data-color-val="{{ c_val | escape }}"
                            data-color-img="{{ color_img }}"
                            onclick="selectTierColor('{{ c_val | escape }}', '{{ color_img }}', this)"
                            style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; border: 2px solid {% if forloop.first %}#8a2c13{% else %}#e2e8f0{% endif %}; border-radius: 8px; background: #ffffff; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s;">
                      <span style="width: 14px; height: 14px; border-radius: 50%; background-color: {{ dot_color }}; border: 1px solid rgba(0,0,0,0.15); display: inline-block;"></span>
                      <span>{{ c_val }}</span>
                    </button>
                  {% endfor %}
                </div>
              </div>
            </div>

          {% else %}
            <!-- Single-Option Bundle or Standard Variant Chips -->
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
                        {% assign v_desc = '6 Heavy-Duty H-Stakes + Hardware • Save Extra 15% • <span class=\"wf-freeship-text\">🚚 FREE US SHIPPING INCLUDED</span>' %}
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
                          {% if product.handle contains 'fence-post' and forloop.index == 3 %}
                            <span class="wf-card-tag freeship">🚚 FREE SHIPPING</span>
                          {% endif %}
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
          {% endif %}
        {% endunless %}

        `;

  content = content.slice(0, startIndex) + replacementBlock + content.slice(endIndex);

  // Add the JS support for Tiered Bundle + Color Swatches
  const jsToAdd = `
  const willaProductVariantsData = {{ product.variants | json }};
  let willaCurrentTierBundle = '{% if bundle_option %}{{ bundle_option.values.first | escape }}{% endif %}';
  let willaCurrentTierColor = '{% if color_option %}{{ color_option.values.first | escape }}{% endif %}';

  function updateTierVariant() {
    if (!willaProductVariantsData || willaProductVariantsData.length === 0) return;
    const matched = willaProductVariantsData.find(v => {
      const matchOpt1 = (v.option1 === willaCurrentTierBundle) || (!v.option1);
      const matchOpt2 = (v.option2 === willaCurrentTierColor) || (!v.option2);
      return matchOpt1 && matchOpt2;
    });

    if (matched) {
      willaCurrentPdpVariantId = matched.id;
      const priceFormatted = '$' + (matched.price / 100).toFixed(2);
      const priceEl = document.getElementById('willaPdpPrice');
      if (priceEl) priceEl.innerText = priceFormatted;

      const stickyPriceEl = document.getElementById('willaStickyPrice');
      if (stickyPriceEl) stickyPriceEl.innerText = priceFormatted;

      if (matched.compare_at_price) {
        const compFormatted = '$' + (matched.compare_at_price / 100).toFixed(2);
        const compEl = document.getElementById('willaPdpComparePrice');
        if (compEl) compEl.innerText = compFormatted;
      }

      if (matched.featured_image && matched.featured_image.src) {
        switchPdpImg(matched.featured_image.src);
      }
    }
  }

  function selectTierBundle(bundleVal, price, comparePrice, cardEl) {
    willaCurrentTierBundle = bundleVal;
    document.querySelectorAll('.wf-bundle-card').forEach(c => c.classList.remove('active'));
    if (cardEl) cardEl.classList.add('active');
    updateTierVariant();
  }

  function selectTierColor(colorVal, imgUrl, btnEl) {
    willaCurrentTierColor = colorVal;
    document.querySelectorAll('.willa-color-swatch-btn').forEach(b => {
      b.classList.remove('active');
      b.style.borderColor = '#e2e8f0';
    });
    if (btnEl) {
      btnEl.classList.add('active');
      btnEl.style.borderColor = '#8a2c13';
    }
    const label = document.getElementById('willaSelectedColorLabel');
    if (label) label.innerText = colorVal;
    if (imgUrl) switchPdpImg(imgUrl);
    updateTierVariant();
  }
`;

  if (!content.includes('function selectTierBundle(')) {
    content = content.replace('function selectPdpBundleCard(', jsToAdd + '\n  function selectPdpBundleCard(');
  }

  // Upload back to Shopify
  console.log('Uploading updated sections/willa-main-product.liquid to Theme 186607567033...');
  const putRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      asset: {
        key: 'sections/willa-main-product.liquid',
        value: content
      }
    })
  });
  const putData = await putRes.json();
  if (putData.asset) {
    console.log('✔ Successfully updated sections/willa-main-product.liquid in theme!');
  } else {
    console.error('❌ Failed to update section:', JSON.stringify(putData));
  }
}

updateTheme().catch(console.error);
