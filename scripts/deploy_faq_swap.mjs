import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187708571833';

async function main() {
  const token = await getAccessToken();

  async function uploadAsset(key, content) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ asset: { key, value: content } })
    });
    const data = await res.json();
    if (data.asset) {
      console.log(`✓ Uploaded ${key} (${content.length} chars)`);
      return true;
    } else {
      console.error(`✗ Failed to upload ${key}:`, data);
      return false;
    }
  }

  // 1. snippets/botanaroots-faq-accordion.liquid
  const snippetContent = fs.readFileSync('draft_working/snippets_botanaroots-faq-accordion.liquid', 'utf8');
  await uploadAsset('snippets/botanaroots-faq-accordion.liquid', snippetContent);

  // 2. sections/zavelyn-pdp-description-fallback.liquid
  const descriptionFallbackLiquid = `{% schema %}
{
  "name": "Zavelyn PDP Fallback",
  "settings": [],
  "presets": [{ "name": "Zavelyn PDP Fallback" }]
}
{% endschema %}

{%- include 'zavelyn-pdp-data' -%}

{%- unless zv_data_found -%}
  {%- if product.description != blank -%}
    <section class="zv-body-section zv-bg-white" id="zv-product-description">
      <div class="zv-container zv-fallback-description-container">
        <div class="zv-section-header">
          <span class="zv-badge">PRODUCT OVERVIEW</span>
          <h2 class="zv-section-title">Product Details</h2>
        </div>
        <div class="zv-rte-content">
          {%- if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' -%}
            {%- if product.description contains '<!-- FAQ Section -->' -%}
              {%- assign desc_parts = product.description | split: '<!-- FAQ Section -->' -%}
              {%- assign top_content = desc_parts[0] -%}
              {%- assign bottom_parts = desc_parts[1] | split: '<!-- Verified Customer Reviews Section -->' -%}
              {%- assign reviews_content = bottom_parts[1] -%}

              {{ top_content }}

              {%- render 'botanaroots-faq-accordion' -%}

              {%- if reviews_content != blank -%}
                <!-- Verified Customer Reviews Section -->
                {{ reviews_content }}
              {%- endif -%}
            {%- else -%}
              {{ product.description }}
            {%- endif -%}
          {%- else -%}
            {{ product.description }}
          {%- endif -%}
        </div>
      </div>
    </section>
  {%- endif -%}
{%- endunless -%}
`;
  await uploadAsset('sections/zavelyn-pdp-description-fallback.liquid', descriptionFallbackLiquid);

  // 3. sections/zavelyn-pdp-faq.liquid
  let faqLiquid = fs.readFileSync('draft_working/sections_zavelyn-pdp-faq.liquid', 'utf8');
  // Update line checking enable_section to guard against botanaroots
  const faqCheckTarget = '{%- if section.settings.enable_section != false -%}';
  const faqCheckReplacement = `{%- if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' -%}
  {%- comment -%}BotanaRoots renders interactive accordion at position 2 in description fallback{%- endcomment -%}
{%- elsif section.settings.enable_section != false -%}`;

  if (faqLiquid.includes(faqCheckTarget)) {
    faqLiquid = faqLiquid.replace(faqCheckTarget, faqCheckReplacement);
  }
  await uploadAsset('sections/zavelyn-pdp-faq.liquid', faqLiquid);

  // 4. templates/product.json
  const productJson = JSON.parse(fs.readFileSync('draft_working/theme_187708571833_product.json', 'utf8'));
  if (productJson.sections.faq) {
    productJson.sections.faq.disabled = true;
  }
  await uploadAsset('templates/product.json', JSON.stringify(productJson, null, 2));

  console.log('\n========================================================================');
  console.log(`DEPLOYMENT COMPLETE TO DRAFT THEME ${DRAFT_THEME_ID}`);
  console.log('========================================================================\n');
}

main().catch(console.error);
