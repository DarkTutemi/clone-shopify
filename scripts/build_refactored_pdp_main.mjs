import fs from 'fs';

const originalPath = 'draft_working/sections_zavelyn-pdp-main.liquid';
const outputPath = 'draft_working/sections_zavelyn-pdp-main-refactored.liquid';

let content = fs.readFileSync(originalPath, 'utf8');

// 1. Replace TRUST CHIPS (.kc-trust)
const trustStartMarker = '<!-- TRUST CHIPS (.kc-trust) -->';
const trustEndMarker = '<!-- SHORT FAQ ACCORDIONS (.kc-faq) - END OF BUY BOX -->';

const trustIdx = content.indexOf(trustStartMarker);
const faqIdx = content.indexOf(trustEndMarker);

if (trustIdx === -1 || faqIdx === -1) {
  throw new Error('Could not find Trust Chips markers');
}

const originalTrustHtml = content.substring(trustIdx, faqIdx);

const newTrustHtml = `<!-- TRUST CHIPS (.kc-trust) -->
          {%- if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' -%}
            {%- assign trust_blocks = section.blocks | where: "type", "trust_card" -%}
            <div class="kc-trust zv-botana-trust" role="note" aria-label="Guarantee, shipping and security">
              {%- if trust_blocks.size > 0 -%}
                {%- for block in trust_blocks -%}
                  <div class="kc-trust__chip" {{ block.shopify_attributes }}>
                    <div class="kc-trust__icon-wrap">
                      {%- case block.settings.icon -%}
                        {%- when 'shipping' -%}
                          <svg viewBox="0 0 24 24" class="kc-trust__icon" aria-hidden="true"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                        {%- when 'lock' -%}
                          <svg viewBox="0 0 24 24" class="kc-trust__icon" aria-hidden="true"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                        {%- when 'star' -%}
                          <svg viewBox="0 0 24 24" class="kc-trust__icon" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        {%- else -%}
                          <svg viewBox="0 0 24 24" class="kc-trust__icon" aria-hidden="true"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                      {%- endcase -%}
                    </div>
                    <span class="kc-trust__text">
                      <strong class="kc-trust__title">{{ block.settings.title }}</strong>
                      <span class="kc-trust__sub">{{ block.settings.subtext }}</span>
                    </span>
                  </div>
                {%- endfor -%}
              {%- else -%}
                <div class="kc-trust__chip">
                  <div class="kc-trust__icon-wrap">
                    <svg viewBox="0 0 24 24" class="kc-trust__icon" aria-hidden="true"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                  </div>
                  <span class="kc-trust__text">
                    <strong class="kc-trust__title">30-Day Returns</strong>
                    <span class="kc-trust__sub">If you're not satisfied, return within 30 days</span>
                  </span>
                </div>
                <div class="kc-trust__chip">
                  <div class="kc-trust__icon-wrap">
                    <svg viewBox="0 0 24 24" class="kc-trust__icon" aria-hidden="true"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                  </div>
                  <span class="kc-trust__text">
                    <strong class="kc-trust__title">Free Tracked Shipping</strong>
                    <span class="kc-trust__sub">Fast delivery with real-time tracking updates</span>
                  </span>
                </div>
                <div class="kc-trust__chip">
                  <div class="kc-trust__icon-wrap">
                    <svg viewBox="0 0 24 24" class="kc-trust__icon" aria-hidden="true"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                  </div>
                  <span class="kc-trust__text">
                    <strong class="kc-trust__title">Safe 256-Bit SSL</strong>
                    <span class="kc-trust__sub">Encrypted & secure checkout guaranteed</span>
                  </span>
                </div>
              {%- endif -%}
            </div>
          {%- else -%}
            ${originalTrustHtml.replace('<!-- TRUST CHIPS (.kc-trust) -->\n', '')}
          {%- endif -%}\n          `;

// 2. Replace SHORT FAQ (.kc-faq)
const faqCloseMarker = '          </div>\n\n        </div>\n      </div>';
const faqCloseIdx = content.indexOf(faqCloseMarker, faqIdx);

if (faqCloseIdx === -1) {
  throw new Error('Could not find FAQ End marker');
}
const faqEndIdx = faqCloseIdx + 16; // including </div>

const originalFaqHtml = content.substring(faqIdx, faqEndIdx);

const newFaqHtml = `<!-- SHORT FAQ ACCORDIONS (.kc-faq) - END OF BUY BOX -->
          {%- if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' -%}
            {%- assign faq_blocks = section.blocks | where: "type", "faq_item" -%}
            <div class="kc-faq zv-botana-faq" role="region" aria-label="Frequently Asked Questions">
              {%- if faq_blocks.size > 0 -%}
                {%- for block in faq_blocks -%}
                  <details class="kc-faq__item" {% if block.settings.default_open %}open{% endif %} {{ block.shopify_attributes }}>
                    <summary class="kc-faq__q">
                      <span>{{ block.settings.question }}</span>
                    </summary>
                    <div class="kc-faq__a">
                      <p>{{ block.settings.answer }}</p>
                    </div>
                  </details>
                {%- endfor -%}
              {%- else -%}
                <!-- Default BotanaRoots PDP FAQ Items (ALL CLOSED BY DEFAULT) -->
                <details class="kc-faq__item">
                  <summary class="kc-faq__q">
                    <span>How does the 30-Day Return Guarantee work?</span>
                  </summary>
                  <div class="kc-faq__a">
                    <p>Order Zavelyn BotanaRoots with complete confidence. If you are not satisfied with your results within 30 days of receiving your order, simply reach out to our dedicated support team for an effortless return process.</p>
                  </div>
                </details>

                <details class="kc-faq__item">
                  <summary class="kc-faq__q">
                    <span>Shipping, Delivery & Returns</span>
                  </summary>
                  <div class="kc-faq__a">
                    <p>All orders are dispatched from our US logistics hub within 24–48 hours. Standard tracked delivery takes 3–5 business days. You will receive real-time tracking updates via email as soon as your package leaves the warehouse.</p>
                  </div>
                </details>

                <details class="kc-faq__item">
                  <summary class="kc-faq__q">
                    <span>Is payment safe and encrypted?</span>
                  </summary>
                  <div class="kc-faq__a">
                    <p>Yes, 100%. We use bank-grade 256-bit SSL encryption to protect your transaction. Your payment information is processed directly by certified tier-1 merchant gateways and is never stored on our servers.</p>
                  </div>
                </details>
              {%- endif -%}
            </div>
          {%- else -%}
            ${originalFaqHtml.replace('<!-- SHORT FAQ ACCORDIONS (.kc-faq) - END OF BUY BOX -->\n', '')}
          {%- endif -%}\n          `;

// Replace trust & faq blocks
content = content.substring(0, trustIdx) + newTrustHtml + newFaqHtml + content.substring(faqEndIdx);

// 3. Inject CSS styles for .zv-botana-trust and .zv-botana-faq before </style>
const styleEndIdx = content.indexOf('</style>');
if (styleEndIdx === -1) {
  throw new Error('Could not find </style>');
}

const customCss = `
/* ==========================================================================
   BOTANAROOTS TRUST CARDS (MOBILE FULL-WIDTH STACKED, DESKTOP 3-COLUMNS)
   ========================================================================== */
.zv-botana-trust {
  display: flex !important;
  flex-direction: column !important;
  gap: 9px !important;
  margin-top: 14px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.zv-botana-trust .kc-trust__chip {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  background: #FFFAF7 !important;
  border: 1px solid rgba(23, 67, 60, 0.12) !important;
  border-radius: 10px !important;
  padding: 10px 14px !important;
  min-width: 0 !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.zv-botana-trust .kc-trust__icon-wrap {
  flex: 0 0 32px !important;
  width: 32px !important;
  height: 32px !important;
  border-radius: 50% !important;
  background: rgba(23, 67, 60, 0.08) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.zv-botana-trust .kc-trust__icon {
  width: 17px !important;
  height: 17px !important;
  fill: #17433C !important;
}

.zv-botana-trust .kc-trust__text {
  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
  min-width: 0 !important;
  flex: 1 1 auto !important;
}

.zv-botana-trust .kc-trust__title {
  font-size: 13px !important;
  font-weight: 700 !important;
  line-height: 1.25 !important;
  color: #17433C !important;
  white-space: normal !important;
  overflow-wrap: break-word !important;
  word-break: normal !important;
}

.zv-botana-trust .kc-trust__sub {
  font-size: 11.5px !important;
  line-height: 1.3 !important;
  color: #5C6B60 !important;
  white-space: normal !important;
  overflow-wrap: break-word !important;
}

@media screen and (min-width: 768px) {
  .zv-botana-trust {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 10px !important;
  }
  .zv-botana-trust .kc-trust__chip {
    padding: 10px 12px !important;
    align-items: flex-start !important;
  }
}

/* ==========================================================================
   BOTANAROOTS SHORT FAQ (ACCORDION TOGGLE + SMOOTH CHEVRON ANIMATION)
   ========================================================================== */
.zv-botana-faq {
  margin-top: 14px !important;
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
  box-sizing: border-box !important;
}

.zv-botana-faq .kc-faq__item {
  background: #FFFAF7 !important;
  border: 1px solid rgba(23, 67, 60, 0.12) !important;
  border-radius: 10px !important;
  overflow: hidden !important;
  transition: all 0.2s ease !important;
}

.zv-botana-faq .kc-faq__item[open] {
  background: #FFFFFF !important;
  border-color: rgba(23, 67, 60, 0.25) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
}

.zv-botana-faq .kc-faq__q {
  list-style: none !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 12px !important;
  padding: 13px 15px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  line-height: 1.35 !important;
  color: #17433C !important;
  user-select: none !important;
}

.zv-botana-faq .kc-faq__q::-webkit-details-marker {
  display: none !important;
}

.zv-botana-faq .kc-faq__q::after {
  content: "" !important;
  flex: 0 0 8px !important;
  width: 8px !important;
  height: 8px !important;
  border-right: 2px solid #17433C !important;
  border-bottom: 2px solid #17433C !important;
  transform: rotate(45deg) !important;
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
  margin-right: 2px !important;
}

.zv-botana-faq .kc-faq__item[open] .kc-faq__q::after {
  transform: rotate(-135deg) !important;
}

.zv-botana-faq .kc-faq__a {
  padding: 0 15px 14px !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
  color: #5C6B60 !important;
  border-top: 1px solid rgba(23, 67, 60, 0.06) !important;
  padding-top: 10px !important;
}

.zv-botana-faq .kc-faq__a p {
  margin: 0 !important;
}
`;

content = content.substring(0, styleEndIdx) + customCss + content.substring(styleEndIdx);

// 4. Replace Schema
const schemaStart = content.indexOf('{% schema %}');
const schemaEnd = content.indexOf('{% endschema %}');

const newSchemaObj = {
  name: "Zavelyn PDP Main V2",
  settings: [
    {
      type: "header",
      content: "Product Media Gallery (Group A)"
    },
    {
      type: "select",
      id: "gallery_layout",
      label: "Thumbnail Layout",
      options: [
        { value: "thumbnails_bottom", label: "Thumbnails Bottom" },
        { value: "thumbnails_left", label: "Thumbnails Left" },
        { value: "stacked", label: "Stacked Images" }
      ],
      default: "thumbnails_bottom"
    },
    {
      type: "checkbox",
      id: "enable_image_zoom",
      label: "Enable Click-to-Zoom",
      default: true
    },
    {
      type: "select",
      id: "mobile_thumbnails",
      label: "Mobile Gallery Display",
      options: [
        { value: "dots", label: "Pagination Dots" },
        { value: "thumbnails", label: "Mini Thumbnails" },
        { value: "hidden", label: "Swipe Only (Hidden)" }
      ],
      default: "thumbnails"
    },
    {
      type: "header",
      content: "Product Information (Group B)"
    },
    {
      type: "text",
      id: "eyebrow_text",
      label: "Eyebrow Subtitle",
      default: "ZAVELYN INNOVATIONS · INDUSTRIAL GRADE"
    },
    {
      type: "text",
      id: "urgency_text",
      label: "Urgency Alert Text",
      default: "High US Demand · Limited Units Remaining at Clearance Pricing"
    },
    {
      type: "text",
      id: "rating_text",
      label: "Rating Text",
      default: "4.9 / 5.0 · 3,420+ Verified Reviews"
    },
    {
      type: "header",
      content: "BotanaRoots Bundle Custom Images & Layout"
    },
    {
      type: "text",
      id: "bundle_header_label",
      label: "Bundle Section Header Label",
      default: "CHOOSE YOUR QUANTITY:"
    },
    {
      type: "text",
      id: "guarantee_badge_text",
      label: "Guarantee Badge Text",
      default: "30-Day Returns"
    },
    {
      type: "image_picker",
      id: "botana_img_buy3",
      label: "Buy 3 Card Image",
      info: "Custom product image for Buy 3 bundle card (leave empty to use default)"
    },
    {
      type: "text",
      id: "buy3_badge",
      label: "Buy 3 Banner Badge Text",
      default: "BEST VALUE · FREE SHIPPING · EXTRA 20% OFF"
    },
    {
      type: "image_picker",
      id: "botana_img_buy2",
      label: "Buy 2 Card Image",
      info: "Custom product image for Buy 2 bundle card (leave empty to use default)"
    },
    {
      type: "text",
      id: "buy2_badge",
      label: "Buy 2 Banner Badge Text",
      default: "🔥 MOST POPULAR"
    },
    {
      type: "image_picker",
      id: "botana_img_buy1",
      label: "Buy 1 Card Image",
      info: "Custom product image for Buy 1 bundle card (leave empty to use default)"
    },
    {
      type: "text",
      id: "buy1_badge",
      label: "Buy 1 Badge Text",
      default: "Shipping +$4.95"
    },
    {
      type: "header",
      content: "Bottle Size Upsell (60ml -> 120ml)"
    },
    {
      type: "image_picker",
      id: "botana_img_upsell",
      label: "Size Upsell Image (120ml Upgrade)",
      info: "Custom graphic for 120ml bottle size upgrade card (leave empty to use default)"
    },
    {
      type: "range",
      id: "upsell_img_width",
      label: "Desktop Upsell Image Width (px)",
      min: 90,
      max: 200,
      step: 5,
      default: 135,
      unit: "px"
    },
    {
      type: "range",
      id: "upsell_mobile_img_width",
      label: "Mobile Upsell Image Width (px)",
      min: 75,
      max: 160,
      step: 5,
      default: 115,
      unit: "px"
    },
    {
      type: "select",
      id: "upsell_img_fit",
      label: "Upsell Image Fit",
      options: [
        { value: "contain", label: "Contain (Recommended)" },
        { value: "cover", label: "Cover" }
      ],
      default: "contain"
    },
    {
      type: "text",
      id: "upsell_section_title",
      label: "Upsell Section Title",
      default: "UPGRADE YOUR BOTTLE SIZE"
    },
    {
      type: "text",
      id: "upsell_badge",
      label: "Upsell Badge Text",
      default: "SPECIAL OFFER"
    },
    {
      type: "text",
      id: "upsell_heading",
      label: "Upsell Main Heading",
      default: "Double the Size!"
    },
    {
      type: "text",
      id: "upsell_description",
      label: "Upsell Description",
      default: "Upgrade each bottle from 60ml to 120ml."
    },
    {
      type: "header",
      content: "Call To Action & Checkout"
    },
    {
      type: "text",
      id: "cta_text",
      label: "Primary CTA Button Text",
      default: "CLAIM OFFER"
    },
    {
      type: "checkbox",
      id: "enable_sticky_atc",
      label: "Enable Sticky Add to Cart Bar",
      default: true
    }
  ],
  blocks: [
    {
      type: "trust_card",
      name: "Trust Card",
      settings: [
        {
          type: "select",
          id: "icon",
          label: "Card Icon",
          options: [
            { value: "return", label: "30-Day Return / Shield" },
            { value: "shipping", label: "Shipping / Truck" },
            { value: "lock", label: "SSL / Security Lock" },
            { value: "star", label: "Star / Quality Guarantee" }
          ],
          default: "return"
        },
        {
          type: "text",
          id: "title",
          label: "Heading",
          default: "30-Day Returns"
        },
        {
          type: "text",
          id: "subtext",
          label: "Supporting Text",
          default: "If you're not satisfied, return within 30 days"
        }
      ]
    },
    {
      type: "faq_item",
      name: "Short FAQ Question",
      settings: [
        {
          type: "text",
          id: "question",
          label: "Question",
          default: "How does the 30-Day Return Guarantee work?"
        },
        {
          type: "textarea",
          id: "answer",
          label: "Answer",
          default: "Order Zavelyn BotanaRoots with complete confidence. If you are not satisfied with your results within 30 days of receiving your order, simply reach out to our dedicated support team for an effortless return process."
        },
        {
          type: "checkbox",
          id: "default_open",
          label: "Default Open",
          default: false
        }
      ]
    }
  ],
  presets: [
    {
      name: "Zavelyn PDP Main V2",
      blocks: [
        {
          type: "trust_card",
          settings: {
            icon: "return",
            title: "30-Day Returns",
            subtext: "If you're not satisfied, return within 30 days"
          }
        },
        {
          type: "trust_card",
          settings: {
            icon: "shipping",
            title: "Free Tracked Shipping",
            subtext: "Fast delivery with real-time tracking updates"
          }
        },
        {
          type: "trust_card",
          settings: {
            icon: "lock",
            title: "Safe 256-Bit SSL",
            subtext: "Encrypted & secure checkout guaranteed"
          }
        },
        {
          type: "faq_item",
          settings: {
            question: "How does the 30-Day Return Guarantee work?",
            answer: "Order Zavelyn BotanaRoots with complete confidence. If you are not satisfied with your results within 30 days of receiving your order, simply reach out to our dedicated support team for an effortless return process.",
            "default_open": false
          }
        },
        {
          type: "faq_item",
          settings: {
            question: "Shipping, Delivery & Returns",
            answer: "All orders are dispatched from our US logistics hub within 24–48 hours. Standard tracked delivery takes 3–5 business days. You will receive real-time tracking updates via email as soon as your package leaves the warehouse.",
            "default_open": false
          }
        },
        {
          type: "faq_item",
          settings: {
            question: "Is payment safe and encrypted?",
            answer: "Yes, 100%. We use bank-grade 256-bit SSL encryption to protect your transaction. Your payment information is processed directly by certified tier-1 merchant gateways and is never stored on our servers.",
            "default_open": false
          }
        }
      ]
    }
  ]
};

content = content.substring(0, schemaStart + 12) + '\n' + JSON.stringify(newSchemaObj, null, 2) + '\n' + content.substring(schemaEnd);

fs.writeFileSync(outputPath, content);
console.log(`✓ Built refactored PDP Main: ${outputPath} (${content.length} chars)`);
