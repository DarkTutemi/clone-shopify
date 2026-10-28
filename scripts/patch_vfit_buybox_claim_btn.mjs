import { getAccessToken, SHOP } from './batch1_config.mjs';
import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const DRAFT_THEME_ID = 187720335545; // Strictly Draft Theme only!

async function main() {
  console.log(`=== PATCHING DRAFT THEME ${DRAFT_THEME_ID} TO RESTORE CLAIM OFFER BUTTON ON vFIT BUY BOX ===`);
  const token = await getAccessToken();

  // 1. Fetch current sections/zavelyn-pdp-main.liquid from Draft Theme
  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  let content = data.asset.value;

  // 2. Identify the target block around kc-offers and CTA buttons
  const oldOffersEnd = `            {% endif %}
          </fieldset>

          <!-- Urgency Bar -->
          <p class="kc-order-limit" id="zvUrgencyBar">
            <span aria-hidden="true">✦</span>
            <span>{{ section.settings.urgency_text }}</span>
          </p>

          <!-- CTA BUTTONS -->
          <div class="zv-cta-group">
            <button type="button" class="kc-claim-button" id="zvClaimOfferBtn">
              <span class="button-text">{{ section.settings.cta_text }} ➔</span>
              <div class="loading__spinner hidden" id="zvBtnSpinner">
                <svg aria-hidden="true" focusable="false" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                  <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
                </svg>
              </div>
            </button>

            <button type="button" class="zv-buy-now-btn" id="zvBuyNowBtn">
              ⚡ BUY NOW (1-CLICK CHECKOUT)
            </button>
          </div>

          <!-- Payment Icons -->
          <div class="zv-payment-icons-row" role="region" aria-label="Accepted payment methods">`;

  const newOffersEnd = `            {% endif %}
          </fieldset>
        {%- endif -%}

        {%- unless product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' -%}
          <!-- Urgency Bar -->
          <p class="kc-order-limit" id="zvUrgencyBar">
            <span aria-hidden="true">✦</span>
            <span>{{ section.settings.urgency_text | default: 'Limited Restock Batch • Free Tracked US Shipping' }}</span>
          </p>

          <!-- CTA BUTTONS -->
          <div class="zv-cta-group">
            <button type="button" class="kc-claim-button" id="zvClaimOfferBtn">
              <span class="button-text">{{ section.settings.cta_text | default: 'CLAIM OFFER' }} ➔</span>
              <div class="loading__spinner hidden" id="zvBtnSpinner">
                <svg aria-hidden="true" focusable="false" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                  <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
                </svg>
              </div>
            </button>

            <button type="button" class="zv-buy-now-btn" id="zvBuyNowBtn">
              ⚡ BUY NOW (1-CLICK CHECKOUT)
            </button>
          </div>

          <!-- Payment Icons -->
          <div class="zv-payment-icons-row" role="region" aria-label="Accepted payment methods">`;

  if (!content.includes(oldOffersEnd)) {
    throw new Error('Target oldOffersEnd anchor not found in sections/zavelyn-pdp-main.liquid');
  }

  content = content.replace(oldOffersEnd, newOffersEnd);

  // Also replace the closing {%- endif -%} after payment icons with {%- endunless -%}
  const oldPaymentEnd = `</svg>
          </div>

          
          {%- endif -%}`;

  const newPaymentEnd = `</svg>
          </div>
        {%- endunless -%}`;

  if (!content.includes(oldPaymentEnd)) {
    throw new Error('Target oldPaymentEnd anchor not found in sections/zavelyn-pdp-main.liquid');
  }

  content = content.replace(oldPaymentEnd, newPaymentEnd);

  // Update addToCart function to read activeQty from vfitQtyDisplay if present
  const oldAddToCart = `  async function addToCart(goToCheckout = false) {
    const claimBtn = document.getElementById('zvClaimOfferBtn');
    const spinner = document.getElementById('zvBtnSpinner');
    if (claimBtn) claimBtn.classList.add('loading');
    if (spinner) spinner.classList.remove('hidden');

    try {`;

  const newAddToCart = `  async function addToCart(goToCheckout = false) {
    const claimBtn = document.getElementById('zvClaimOfferBtn');
    const spinner = document.getElementById('zvBtnSpinner');
    if (claimBtn) claimBtn.classList.add('loading');
    if (spinner) spinner.classList.remove('hidden');

    // On vFit, sync activeQty with vFit quantity stepper if present
    const vfitQtyDisp = document.getElementById('vfitQtyDisplay');
    if (vfitQtyDisp) {
      const q = parseInt(vfitQtyDisp.innerText, 10);
      if (!isNaN(q) && q >= 1) activeQty = q;
    }

    try {`;

  if (content.includes(oldAddToCart)) {
    content = content.replace(oldAddToCart, newAddToCart);
    console.log('✓ Injected vFit quantity sync into addToCart function');
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
    console.log(`✓ Uploaded updated sections/zavelyn-pdp-main.liquid (${putData.asset.size} bytes) to Draft Theme`);
  } else {
    throw new Error('Failed to upload: ' + JSON.stringify(putData));
  }
}

main().catch(err => {
  console.error('Fatal in patch_vfit_buybox_claim_btn:', err);
  process.exit(1);
});
