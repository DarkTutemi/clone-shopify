import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';
const LIVE_THEME_ID = '186607567033';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function uploadAsset(token, key, content) {
  console.log(`Uploading ${key} to Draft Theme ${DRAFT_THEME_ID}...`);
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: { key, value: content }
    })
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ Failed uploading ${key}:`, err);
    throw new Error(err);
  }
  const data = await res.json();
  console.log(`✔ Successfully uploaded ${key} (${content.length} chars)`);
  return data;
}

// ============================================================================
// 1. SECTION: sections/zavelyn-pdp-shipping.liquid
// Premium DTC Doorstep Delivery Guarantee & Real-Time Tracking Section
// ============================================================================
const shippingLiquid = `{% schema %}
{
  "name": "Doorstep Delivery & Track",
  "settings": [
    {
      "type": "text",
      "id": "badge_text",
      "label": "Badge Text",
      "default": "FAST & INSURED TRACKED US DELIVERY"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Doorstep Delivery Guarantee & Real-Time Tracking"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Description",
      "default": "Every Zavelyn order is cushioned in heavy-duty protective packaging, inspected for quality, and dispatched from regional US warehouses within 24–48 business hours. We partner directly with USPS, FedEx, and DHL Express to guarantee rapid, dependable doorstep transit."
    },
    {
      "type": "header",
      "content": "Section Images"
    },
    {
      "type": "image_picker",
      "id": "shipping_img_1",
      "label": "Image 1 (Packaging / Inspection)"
    },
    {
      "type": "text",
      "id": "shipping_img_1_url",
      "label": "Image 1 Default URL",
      "default": "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/5555.webp?v=1792856415"
    },
    {
      "type": "image_picker",
      "id": "shipping_img_2",
      "label": "Image 2 (Handover / Tracking Scan)"
    },
    {
      "type": "text",
      "id": "shipping_img_2_url",
      "label": "Image 2 Default URL",
      "default": "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/44444.webp?v=1792856415"
    },
    {
      "type": "header",
      "content": "Trust Card 1"
    },
    {
      "type": "text",
      "id": "card1_icon",
      "label": "Card 1 Icon",
      "default": "⏱️"
    },
    {
      "type": "text",
      "id": "card1_title",
      "label": "Card 1 Title",
      "default": "24–48h Dispatch"
    },
    {
      "type": "text",
      "id": "card1_desc",
      "label": "Card 1 Description",
      "default": "Rapid order processing from regional US fulfillment hubs."
    },
    {
      "type": "header",
      "content": "Trust Card 2"
    },
    {
      "type": "text",
      "id": "card2_icon",
      "label": "Card 2 Icon",
      "default": "📦"
    },
    {
      "type": "text",
      "id": "card2_title",
      "label": "Card 2 Title",
      "default": "Insured Transit"
    },
    {
      "type": "text",
      "id": "card2_desc",
      "label": "Card 2 Description",
      "default": "Full protection against lost, stolen, or damaged parcels."
    },
    {
      "type": "header",
      "content": "Trust Card 3"
    },
    {
      "type": "text",
      "id": "card3_icon",
      "label": "Card 3 Icon",
      "default": "🔍"
    },
    {
      "type": "text",
      "id": "card3_title",
      "label": "Card 3 Title",
      "default": "Tracking Updates"
    },
    {
      "type": "text",
      "id": "card3_desc",
      "label": "Card 3 Description",
      "default": "Instant carrier tracking notifications via SMS and email."
    },
    {
      "type": "header",
      "content": "Trust Card 4"
    },
    {
      "type": "text",
      "id": "card4_icon",
      "label": "Card 4 Icon",
      "default": "🛡️"
    },
    {
      "type": "text",
      "id": "card4_title",
      "label": "Card 4 Title",
      "default": "Money-Back Guarantee"
    },
    {
      "type": "text",
      "id": "card4_desc",
      "label": "Card 4 Description",
      "default": "Risk-free 60-day money-back guarantee with zero hassle."
    }
  ],
  "presets": [
    {
      "name": "Doorstep Delivery & Track"
    }
  ]
}
{% endschema %}

{%- assign img1_src = section.settings.shipping_img_1_url | default: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/5555.webp?v=1792856415' -%}
{%- if section.settings.shipping_img_1 != blank -%}
  {%- assign img1_src = section.settings.shipping_img_1 | image_url: width: 900 -%}
{%- endif -%}

{%- assign img2_src = section.settings.shipping_img_2_url | default: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/44444.webp?v=1792856415' -%}
{%- if section.settings.shipping_img_2 != blank -%}
  {%- assign img2_src = section.settings.shipping_img_2 | image_url: width: 900 -%}
{%- endif -%}

<section class="zv-delivery-section" id="zv-doorstep-delivery">
  <div class="zv-container">
    <div class="zv-delivery-layout">
      
      <!-- DESKTOP RIGHT (Top) / MOBILE 1ST: Header info -->
      <div class="zv-delivery-header">
        <span class="zv-badge zv-badge-lime">
          <span class="zv-badge-icon">🚚</span> {{ section.settings.badge_text | default: 'FAST &amp; INSURED TRACKED US DELIVERY' }}
        </span>
        <h2 class="zv-delivery-title">{{ section.settings.heading | default: 'Doorstep Delivery Guarantee &amp; Real-Time Tracking' }}</h2>
        <p class="zv-delivery-desc">
          {{ section.settings.subheading | default: 'Every Zavelyn order is cushioned in heavy-duty protective packaging, inspected for quality, and dispatched from regional US warehouses within 24–48 business hours. We partner directly with USPS, FedEx, and DHL Express to guarantee rapid, dependable doorstep transit.' }}
        </p>
      </div>

      <!-- DESKTOP LEFT (45%) / MOBILE 2ND: 2 Images Stacked -->
      <div class="zv-delivery-media-col">
        <div class="zv-delivery-img-wrap">
          <img 
            src="{{ img1_src }}" 
            alt="Zavelyn Order Quality Inspection and Protective Packaging" 
            width="600" 
            height="403"
            loading="lazy"
            class="zv-delivery-img"
          >
        </div>
        <div class="zv-delivery-img-wrap">
          <img 
            src="{{ img2_src }}" 
            alt="Express Courier Handover and Real-Time Tracking Scan" 
            width="600" 
            height="254"
            loading="lazy"
            class="zv-delivery-img"
          >
        </div>
      </div>

      <!-- DESKTOP RIGHT (Bottom) / MOBILE 3RD: 4 Trust Benefit Cards -->
      <div class="zv-delivery-cards-grid">
        <div class="zv-trust-card">
          <div class="zv-trust-card-icon">{{ section.settings.card1_icon | default: '⏱️' }}</div>
          <div class="zv-trust-card-body">
            <h3 class="zv-trust-card-title">{{ section.settings.card1_title | default: '24–48h Dispatch' }}</h3>
            <p class="zv-trust-card-desc">{{ section.settings.card1_desc | default: 'Rapid order processing from regional US fulfillment hubs.' }}</p>
          </div>
        </div>

        <div class="zv-trust-card">
          <div class="zv-trust-card-icon">{{ section.settings.card2_icon | default: '📦' }}</div>
          <div class="zv-trust-card-body">
            <h3 class="zv-trust-card-title">{{ section.settings.card2_title | default: 'Insured Transit' }}</h3>
            <p class="zv-trust-card-desc">{{ section.settings.card2_desc | default: 'Full protection against lost, stolen, or damaged parcels.' }}</p>
          </div>
        </div>

        <div class="zv-trust-card">
          <div class="zv-trust-card-icon">{{ section.settings.card3_icon | default: '🔍' }}</div>
          <div class="zv-trust-card-body">
            <h3 class="zv-trust-card-title">{{ section.settings.card3_title | default: 'Tracking Updates' }}</h3>
            <p class="zv-trust-card-desc">{{ section.settings.card3_desc | default: 'Instant carrier tracking notifications via SMS and email.' }}</p>
          </div>
        </div>

        <div class="zv-trust-card">
          <div class="zv-trust-card-icon">{{ section.settings.card4_icon | default: '🛡️' }}</div>
          <div class="zv-trust-card-body">
            <h3 class="zv-trust-card-title">{{ section.settings.card4_title | default: 'Money-Back Guarantee' }}</h3>
            <p class="zv-trust-card-desc">{{ section.settings.card4_desc | default: 'Risk-free 60-day money-back guarantee with zero hassle.' }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
`;

async function run() {
  console.log("=============================================================");
  console.log("🚀 REDESIGNING DOORSTEP DELIVERY GUARANTEE ON DRAFT THEME");
  console.log(`Draft Theme ID: ${DRAFT_THEME_ID}`);
  console.log(`Live Theme ID: ${LIVE_THEME_ID} (PROTECTED)`);
  console.log("=============================================================");

  const token = await getAccessToken();

  // 1. Fetch current assets/zavelyn-pdp-body.css
  const cssRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=assets/zavelyn-pdp-body.css`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const cssData = await cssRes.json();
  let currentCss = cssData.asset.value;

  // Add Doorstep Delivery styles to CSS
  const deliveryCss = `
/* ==========================================================================
   10. DOORSTEP DELIVERY GUARANTEE & REAL-TIME TRACKING SECTION (PREMIUM DTC)
   ========================================================================== */
.zv-delivery-section {
  padding: 80px 0;
  background-color: #FFFAF7;
  position: relative;
  overflow: hidden;
  border-top: 1px solid #E8EDE9;
}

/* DESKTOP 2-COLUMN LAYOUT: Left 45% (Images), Right 55% (Header + Cards) */
@media (min-width: 993px) {
  .zv-delivery-layout {
    display: grid;
    grid-template-columns: 4.5fr 5.5fr;
    grid-template-areas:
      "media header"
      "media cards";
    column-gap: 52px;
    row-gap: 28px;
    align-items: center;
  }

  .zv-delivery-media-col {
    grid-area: media;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .zv-delivery-header {
    grid-area: header;
    margin-bottom: 0;
  }

  .zv-delivery-cards-grid {
    grid-area: cards;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* Image Wrappers and Styling */
.zv-delivery-img-wrap {
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(23, 67, 60, 0.05);
  background: #FFFFFF;
  border: 1px solid #E8EDE9;
}

.zv-delivery-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.zv-delivery-img-wrap:hover .zv-delivery-img {
  transform: scale(1.02);
}

/* Content & Typography */
.zv-delivery-header {
  margin-bottom: 24px;
}

.zv-delivery-title {
  font-size: 32px;
  line-height: 1.25;
  font-weight: 800;
  color: #17433C;
  letter-spacing: -0.5px;
  margin: 14px 0 16px;
}

.zv-delivery-desc {
  font-size: 15.5px;
  line-height: 1.65;
  color: #556860;
  margin: 0;
}

/* 4 Trust Benefit Cards (2x2 Grid) */
.zv-trust-card {
  background: #FFFFFF;
  border: 1px solid #E8EDE9;
  border-radius: 14px;
  padding: 20px 18px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  box-shadow: 0 2px 10px rgba(23, 67, 60, 0.03);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.zv-trust-card:hover {
  transform: translateY(-3px);
  border-color: #C6FA54;
  box-shadow: 0 8px 24px rgba(23, 67, 60, 0.08);
}

.zv-trust-card-icon {
  font-size: 22px;
  line-height: 1;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #EEF5F2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.zv-trust-card-body {
  flex: 1;
}

.zv-trust-card-title {
  font-size: 15px;
  font-weight: 800;
  color: #17433C;
  margin: 0 0 6px;
  line-height: 1.3;
}

.zv-trust-card-desc {
  font-size: 13.5px;
  line-height: 1.5;
  color: #556860;
  margin: 0;
}

/* MOBILE RESPONSIVE: 1-Column, Header First -> Media Second -> Cards Third */
@media (max-width: 992px) {
  .zv-delivery-section {
    padding: 56px 0;
  }
  .zv-delivery-layout {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .zv-delivery-header {
    order: 1;
    margin-bottom: 0;
  }
  .zv-delivery-media-col {
    order: 2;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .zv-delivery-cards-grid {
    order: 3;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}

@media (max-width: 768px) {
  .zv-delivery-section {
    padding: 44px 0;
  }
  .zv-delivery-title {
    font-size: 26px;
    line-height: 1.28;
    margin: 12px 0 12px;
  }
  .zv-delivery-desc {
    font-size: 15px;
    line-height: 1.6;
  }
}

/* Small mobile (e.g., 390px iPhone): 1 column for cards, generous readable font */
@media (max-width: 520px) {
  .zv-delivery-cards-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .zv-trust-card {
    padding: 18px 16px;
    gap: 14px;
  }
  .zv-trust-card-icon {
    width: 42px;
    height: 42px;
    font-size: 20px;
  }
  .zv-trust-card-title {
    font-size: 15px;
    margin-bottom: 4px;
  }
  .zv-trust-card-desc {
    font-size: 13.5px;
    line-height: 1.5;
  }
}
`;

  // Remove any old delivery styles if existing and append updated styles
  if (currentCss.includes('DOORSTEP DELIVERY GUARANTEE')) {
    currentCss = currentCss.replace(/\/\* ==========================================================================\s*10\. DOORSTEP DELIVERY GUARANTEE[\s\S]*$/, '');
  }
  currentCss = currentCss.trim() + '\n' + deliveryCss;

  // 2. Upload updated assets/zavelyn-pdp-body.css
  await uploadAsset(token, 'assets/zavelyn-pdp-body.css', currentCss);

  // 3. Upload new sections/zavelyn-pdp-shipping.liquid
  await uploadAsset(token, 'sections/zavelyn-pdp-shipping.liquid', shippingLiquid);

  // 4. Also save local copy in workspace for git tracking
  fs.mkdirSync('sections', { recursive: true });
  fs.mkdirSync('assets', { recursive: true });
  fs.writeFileSync('sections/zavelyn-pdp-shipping.liquid', shippingLiquid, 'utf8');
  fs.writeFileSync('assets/zavelyn-pdp-body.css', currentCss, 'utf8');
  console.log("✔ Local copies of section and css saved to workspace.");

  console.log("=============================================================");
  console.log("✔ DOORSTEP DELIVERY GUARANTEE SECTION REDESIGNED SUCCESSFULLY!");
  console.log("=============================================================");
}

run().catch(err => {
  console.error("Execution failed:", err);
  process.exit(1);
});
