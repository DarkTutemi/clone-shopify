import { getAccessToken, SHOP } from './batch1_config.mjs';

const DRAFT_THEME_ID = 187720335545; // Strictly Draft Theme only!

async function main() {
  console.log(`=== PATCHING DRAFT THEME ${DRAFT_THEME_ID} FOR vFIT BUY BOX QUANTITY ===`);
  const token = await getAccessToken();

  // 1. Fetch current sections/zavelyn-pdp-main.liquid
  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  let content = data.asset.value;

  // 2. Check if already patched
  if (content.includes('vfit-buybox-injected')) {
    console.log('Already patched with vfit-buybox-injected.');
  } else {
    const targetAnchor = `{%- if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' -%}
            {%- render 'botanaroots-bundle-upsell',
                img_buy3: section.settings.botana_img_buy3,
                img_buy2: section.settings.botana_img_buy2,
                img_buy1: section.settings.botana_img_buy1,
                img_upsell: section.settings.botana_img_upsell
            -%}
          {%- else -%}`;

    const vfitSnippet = `{%- if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' -%}
            {%- render 'botanaroots-bundle-upsell',
                img_buy3: section.settings.botana_img_buy3,
                img_buy2: section.settings.botana_img_buy2,
                img_buy1: section.settings.botana_img_buy1,
                img_upsell: section.settings.botana_img_upsell
            -%}
          {%- elsif product.handle == 'zavelyn-vfit-red-light-intimate-wellness-device' -%}
            <!-- vfit-buybox-injected: vFit Dedicated Starter Kit + Quantity Stepper -->
            <style>
              .zv-buy1-container {
                background: #FFFFFF;
                border: 2px solid #234E3E;
                border-radius: 14px;
                padding: 16px 18px;
                margin-bottom: 20px;
                box-shadow: 0 4px 16px rgba(35, 78, 62, 0.06);
              }
              .zv-buy1-card {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 14px;
              }
              .zv-buy1-left {
                display: flex;
                align-items: center;
                gap: 12px;
              }
              .zv-buy1-radio-dot {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 6px solid #234E3E;
                background: #FFFFFF;
                flex-shrink: 0;
              }
              .zv-buy1-content {
                display: flex;
                flex-direction: column;
              }
              .zv-buy1-title {
                font-size: 15px;
                font-weight: 800;
                color: #183324;
              }
              .zv-buy1-sub {
                font-size: 12.5px;
                color: #667085;
                margin-top: 2px;
              }
              .zv-buy1-price-col {
                text-align: right;
                flex-shrink: 0;
              }
              .zv-buy1-price {
                font-size: 18px;
                font-weight: 900;
                color: #183324;
                display: block;
              }
              .zv-buy1-compare {
                font-size: 13px;
                color: #98A2B3;
                text-decoration: line-through;
              }
              .zv-qty-wrap {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 14px;
                padding-top: 12px;
                border-top: 1px dashed #E2D9D3;
              }
              .zv-qty-label-group {
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .zv-qty-title {
                font-size: 13.5px;
                font-weight: 800;
                color: #183324;
              }
              .zv-qty-note {
                font-size: 11.5px;
                color: #667085;
              }
              .zv-qty-stepper {
                display: flex;
                align-items: center;
                background: #F8F5F2;
                border: 1.5px solid #D8CFC8;
                border-radius: 9999px;
                padding: 3px;
              }
              .zv-qty-btn {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: none;
                background: #FFFFFF;
                color: #183324;
                font-size: 17px;
                font-weight: 800;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.18s ease;
                box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                line-height: 1;
              }
              .zv-qty-btn:hover:not(:disabled) {
                background: #234E3E;
                color: #FFFFFF;
              }
              .zv-qty-btn:disabled {
                opacity: 0.4;
                cursor: not-allowed;
              }
              .zv-qty-num {
                font-size: 15px;
                font-weight: 800;
                color: #183324;
                min-width: 36px;
                text-align: center;
              }
            </style>

            <div class="zv-buy1-container">
              <div class="zv-buy1-card">
                <div class="zv-buy1-left">
                  <div class="zv-buy1-radio-dot"></div>
                  <div class="zv-buy1-content">
                    <div class="zv-buy1-title">Buy 1 (Essential Starter Kit - Save 67%)</div>
                    <div class="zv-buy1-sub">Single vFit Intimate Wellness Device + Photonic Primer Gel</div>
                  </div>
                </div>
                <div class="zv-buy1-price-col">
                  <span class="zv-buy1-price" id="zvBuy1Price">{{ current_variant.price | money }}</span>
                  {% if current_variant.compare_at_price > current_variant.price %}
                    <s class="zv-buy1-compare" id="zvBuy1Compare">{{ current_variant.compare_at_price | money }}</s>
                  {% endif %}
                </div>
              </div>

              <!-- Quantity Stepper under Buy 1 -->
              <div class="zv-qty-wrap">
                <div class="zv-qty-label-group">
                  <span class="zv-qty-title">Quantity:</span>
                  <span class="zv-qty-note">(Unit Price: {{ current_variant.price | money }})</span>
                </div>
                <div class="zv-qty-stepper">
                  <button type="button" class="zv-qty-btn" id="vfitQtyMinus" aria-label="Decrease quantity" disabled>−</button>
                  <span class="zv-qty-num" id="vfitQtyDisplay">1</span>
                  <button type="button" class="zv-qty-btn" id="vfitQtyPlus" aria-label="Increase quantity">+</button>
                </div>
              </div>
            </div>
          {%- else -%}`;

    if (!content.includes(targetAnchor)) {
      throw new Error('Target anchor not found in sections/zavelyn-pdp-main.liquid');
    }

    content = content.replace(targetAnchor, vfitSnippet);
    console.log('✓ Successfully inserted vFit Buy Box markup into zavelyn-pdp-main.liquid');
  }

  // 3. Upload updated sections/zavelyn-pdp-main.liquid to Draft Theme
  const putRes = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${DRAFT_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/zavelyn-pdp-main.liquid',
        value: content
      }
    })
  });

  const putData = await putRes.json();
  if (putRes.ok && putData.asset) {
    console.log(`✓ Uploaded updated sections/zavelyn-pdp-main.liquid (${putData.asset.size} bytes)`);
  } else {
    throw new Error('Failed to upload sections/zavelyn-pdp-main.liquid: ' + JSON.stringify(putData));
  }

  // 4. Also upload updated snippets/vfit-selfcare-upsell.liquid with multi-quantity support
  const snippetPath = 'snippets/vfit-selfcare-upsell.liquid';
  const fs = await import('fs');
  const snippetContent = fs.readFileSync(snippetPath, 'utf8');

  const sRes = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${DRAFT_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'snippets/vfit-selfcare-upsell.liquid',
        value: snippetContent
      }
    })
  });
  const sData = await sRes.json();
  if (sRes.ok && sData.asset) {
    console.log(`✓ Uploaded updated snippets/vfit-selfcare-upsell.liquid (${sData.asset.size} bytes)`);
  } else {
    throw new Error('Failed to upload snippets/vfit-selfcare-upsell.liquid: ' + JSON.stringify(sData));
  }

  console.log('\n🎉 ALL UPDATES DEPLOYED TO DRAFT THEME 187720335545 SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Fatal in patch_draft_theme_vfit_buybox:', err);
  process.exit(1);
});
