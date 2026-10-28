import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187708571833';

const faqItems = [
  {
    question: "How do I apply Zavelyn BotanaRoots for best results?",
    answer: "Warm a few drops between your palms and gently massage into your scalp in circular motions for 3–5 minutes. Leave on for at least 30 minutes, or overnight as an intensive scalp treatment before washing.",
    default_open: false
  },
  {
    question: "How soon will I see visible results?",
    answer: "Most customers report a reduction in shedding within 10-14 days. Visible new baby hair growth and thickening of sparse areas typically appears between 4 to 8 weeks of daily use.",
    default_open: false
  },
  {
    question: "Can I use this on color-treated, bleached, or chemically straightened hair?",
    answer: "Yes! Zavelyn BotanaRoots™ is 100% natural, sulfate-free, and color-safe. It actually helps repair damage caused by bleaching and hot styling tools.",
    default_open: false
  },
  {
    question: "Is it suitable for both men and women?",
    answer: "Absolutely. BotanaRoots™ is universally effective for all hair types (Type 1 straight to Type 4 coily) and works equally well on receding men's hairlines and thinning women's crowns.",
    default_open: false
  },
  {
    question: "Is it 100% pure raw batana oil with no added chemicals?",
    answer: "Yes. Our Batana Oil is sustainably wild-harvested in La Mosquitia, Honduras, following centuries-old artisanal roasting methods. It contains zero mineral oils, parabens, sulfates, silicones, or synthetic fragrances.",
    default_open: false
  },
  {
    question: "How does the 30-Day Return Guarantee work?",
    answer: "We want you to experience BotanaRoots completely risk-free. If you are not satisfied with your purchase within 30 days of delivery, simply email our customer support team for an effortless return and refund.",
    default_open: false
  }
];

// 1. Update templates/product.json
const productJsonPath = 'draft_working/templates_product_refactored.json';
const productJson = JSON.parse(fs.readFileSync(productJsonPath, 'utf8'));

productJson.sections.faq.blocks = {};
productJson.sections.faq.block_order = [];

faqItems.forEach((item, idx) => {
  const blockId = `faq_item_${idx + 1}`;
  productJson.sections.faq.blocks[blockId] = {
    type: "faq_item",
    settings: item
  };
  productJson.sections.faq.block_order.push(blockId);
});

fs.writeFileSync(productJsonPath, JSON.stringify(productJson, null, 2));
console.log('✓ Updated draft_working/templates_product_refactored.json with 6 FAQs');

// 2. Update sections/zavelyn-pdp-faq.liquid
let faqLiquid = fs.readFileSync('draft_working/sections_zavelyn-pdp-faq-refactored.liquid', 'utf8');

// Replace schema presets
const newPresets = [
  {
    name: "Zavelyn Extended FAQ",
    blocks: faqItems.map(item => ({
      type: "faq_item",
      settings: item
    }))
  }
];

const schemaStart = faqLiquid.indexOf('{% schema %}');
const schemaEnd = faqLiquid.indexOf('{% endschema %}');
const schema = JSON.parse(faqLiquid.substring(schemaStart + 12, schemaEnd).trim());
schema.presets = newPresets;

// Generate fallback HTML
const fallbackHtml = faqItems.map(item => `          <details class="zv-faq-item-details">
            <summary class="zv-faq-question-btn">
              <span>${item.question}</span>
              <span class="zv-faq-icon-indicator" aria-hidden="true"></span>
            </summary>
            <div class="zv-faq-answer-panel">
              <p>${item.answer}</p>
            </div>
          </details>`).join('\n');

const fallbackStartMarker = '<!-- Fallback BotanaRoots questions -->';
const fallbackEndMarker = '        {%- endif -%}\n      {%- endif -%}\n    </div>';

const fbStart = faqLiquid.indexOf(fallbackStartMarker);
const fbEnd = faqLiquid.indexOf(fallbackEndMarker);

if (fbStart !== -1 && fbEnd !== -1) {
  faqLiquid = faqLiquid.substring(0, fbStart + fallbackStartMarker.length) + '\n' + fallbackHtml + '\n' + faqLiquid.substring(fbEnd);
}

// Re-inject updated schema
const freshSchemaStart = faqLiquid.indexOf('{% schema %}');
const freshSchemaEnd = faqLiquid.indexOf('{% endschema %}');
faqLiquid = faqLiquid.substring(0, freshSchemaStart + 12) + '\n' + JSON.stringify(schema, null, 2) + '\n' + faqLiquid.substring(freshSchemaEnd);

fs.writeFileSync('draft_working/sections_zavelyn-pdp-faq-refactored.liquid', faqLiquid);
console.log('✓ Updated draft_working/sections_zavelyn-pdp-faq-refactored.liquid with 6 FAQs');

// 3. Deploy both to Draft Theme
async function deploy() {
  const token = await getAccessToken();

  async function upload(key, content) {
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
      console.log(`✓ Uploaded ${key} to Draft Theme ${DRAFT_THEME_ID}`);
    } else {
      console.error(`✗ Failed to upload ${key}:`, data);
    }
  }

  await upload('sections/zavelyn-pdp-faq.liquid', faqLiquid);
  await upload('templates/product.json', JSON.stringify(productJson, null, 2));

  console.log('\n========================================================================');
  console.log(`FAQ UPDATE COMPLETE ON DRAFT THEME ${DRAFT_THEME_ID}`);
  console.log('========================================================================\n');
}

deploy().catch(console.error);
