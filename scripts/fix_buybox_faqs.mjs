import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function fixBuyBox() {
  const token = await getAccessToken();

  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  let content = data.asset.value;

  // 1. Fix Benefits Block to use dynamic benefits from zv_vp_b0/b1/b2 if available
  const oldBenefitsRegex = /<!-- Value Proposition & Benefits -->[\s\S]*?<!-- Color \/ Style Swatches/;
  const newBenefitsBlock = `<!-- Value Proposition & Benefits -->
          {%- include 'zavelyn-pdp-data' -%}
          <div class="zv-benefits-block">
            {% if zv_vp_b0 != blank %}
              <p class="zv-lead-prop">
                {{ zv_vp_sub }}
              </p>
              <div class="zv-bullet-list">
                <div class="zv-bullet-item"><span class="zv-bullet-icon">⚡</span><span><strong>{{ zv_vp_b0 }}</strong></span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🛡️</span><span><strong>{{ zv_vp_b1 }}</strong></span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🔧</span><span><strong>{{ zv_vp_b2 }}</strong></span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🚚</span><span><strong>Dispatched within 24–48h</strong> from US fulfillment hubs</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">💚</span><span><strong>60-Day Money-Back Guarantee</strong> — 100% risk-free trial</span></div>
              </div>
            {% elsif product.handle contains 'diesel' or product.handle contains 'injector' %}
              <p class="zv-lead-prop">
                Stop fighting seized injectors for hours with slide hammers that damage cylinder heads. Power through rock-solid carbon in under 5 minutes.
              </p>
              <div class="zv-bullet-list">
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🛠️</span><span><strong>High-frequency pneumatic vibration</strong> breaks carbon bonds effortlessly</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🛡️</span><span><strong>Zero cylinder head damage</strong> — balanced vertical shock eliminates snapped threads</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🧰</span><span><strong>21-piece master adapter set</strong> fits Bosch, Delphi, Denso & Siemens injectors</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🚚</span><span><strong>Dispatched within 24–48h</strong> from US warehouses with insured tracking</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">💚</span><span><strong>60-Day Money-Back Guarantee</strong> — if she won't budge, get every cent back</span></div>
              </div>
            {% else %}
              <p class="zv-lead-prop">
                Engineered for maximum reliability and daily performance. Experience precision build quality backed by our ironclad satisfaction guarantee.
              </p>
              <div class="zv-bullet-list">
                <div class="zv-bullet-item"><span class="zv-bullet-icon">⚡</span><span><strong>Instant High Performance</strong> — tested and calibrated for immediate daily use</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🛡️</span><span><strong>Heavy-Duty Premium Materials</strong> — built to outlast ordinary alternatives</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🚚</span><span><strong>Dispatched within 24–48h</strong> from US regional fulfillment centers</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">💚</span><span><strong>60-Day Money-Back Guarantee</strong> — zero risk to try in your home or shop</span></div>
              </div>
            {% endif %}
          </div>

          <!-- Color / Style Swatches`;

  content = content.replace(oldBenefitsRegex, newBenefitsBlock);

  // 2. Fix Short FAQ in Buy Box
  const oldFaqRegex = /<!-- SHORT FAQ ACCORDIONS \(\.kc-faq\) - END OF BUY BOX -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<!-- STICKY ADD TO CART BAR -->/;
  const newFaqBlock = `<!-- SHORT FAQ ACCORDIONS (.kc-faq) - END OF BUY BOX -->
          <div class="kc-faq">
            {%- if zv_faq_count > 0 -%}
              <details class="kc-faq__item" open>
                <summary class="kc-faq__q">{{ zv_faq_0_q }}</summary>
                <div class="kc-faq__a">
                  <p>{{ zv_faq_0_a }}</p>
                </div>
              </details>
              {%- if zv_faq_1_q != blank -%}
              <details class="kc-faq__item">
                <summary class="kc-faq__q">{{ zv_faq_1_q }}</summary>
                <div class="kc-faq__a">
                  <p>{{ zv_faq_1_a }}</p>
                </div>
              </details>
              {%- endif -%}
            {%- elsif product.handle contains 'diesel' or product.handle contains 'injector' -%}
              <details class="kc-faq__item" open>
                <summary class="kc-faq__q">Will this kit work on my vehicle and injector model?</summary>
                <div class="kc-faq__a">
                  <p>Yes. The kit includes 19 precision CNC-machined adapters covering all standard M14, M17, M20, M25, and M27 thread pitches used across Bosch, Delphi, Denso, and Siemens common rail diesel injectors (Ford Powerstroke, Dodge Cummins, Chevy Duramax, Sprinter CDI, VW/Audi TDI, BMW & Mercedes).</p>
                </div>
              </details>
              <details class="kc-faq__item">
                <summary class="kc-faq__q">How does the pneumatic vibration mechanism work?</summary>
                <div class="kc-faq__a">
                  <p>It connects directly to your standard shop air compressor (5–8 Bar / 70–115 PSI). Delivering up to 1000 micro-impact pulses per minute along the vertical injector axis, it fractures stubborn carbon deposits instantly without side-loading or snapping the injector body.</p>
                </div>
              </details>
            {%- endif -%}

            <details class="kc-faq__item" {% unless zv_faq_count > 0 or product.handle contains 'diesel' %}open{% endunless %}>
              <summary class="kc-faq__q">How does the 60-Day Money-Back Guarantee work?</summary>
              <div class="kc-faq__a">
                <p>Try {{ product.title }} completely risk-free. If you are not completely satisfied with the performance or quality within 60 days of receiving your order, simply reach out to our dedicated support team for an immediate, hassle-free 100% refund.</p>
              </div>
            </details>

            <details class="kc-faq__item">
              <summary class="kc-faq__q">Shipping, Delivery & Returns</summary>
              <div class="kc-faq__a">
                <p>All orders are dispatched from our US logistics hub within 24–48 hours. Standard tracked delivery takes 3–5 business days. You will receive real-time tracking updates via email as soon as your package leaves the warehouse.</p>
              </div>
            </details>

            <details class="kc-faq__item">
              <summary class="kc-faq__q">Is payment safe and encrypted?</summary>
              <div class="kc-faq__a">
                <p>Yes, 100%. We use bank-grade 256-bit SSL encryption to protect your transaction. Your payment information is processed directly by certified tier-1 merchant gateways and is never stored on our servers.</p>
              </div>
            </details>
          </div>

        </div>
      </div>

    </div>
  </div>
</div>

<!-- STICKY ADD TO CART BAR -->`;

  content = content.replace(oldFaqRegex, newFaqBlock);

  // Upload back to Draft Theme
  const upRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: { key: 'sections/zavelyn-pdp-main.liquid', value: content }
    })
  });
  if (!upRes.ok) {
    throw new Error(await upRes.text());
  }
  console.log("✔ Updated sections/zavelyn-pdp-main.liquid successfully on Draft Theme!");
}

fixBuyBox().catch(err => {
  console.error("Error fixing Buy Box:", err);
  process.exit(1);
});
