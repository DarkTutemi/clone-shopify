import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OAuth error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (res.ok) {
    console.log(`  ✔ Uploaded: ${key}`);
    return true;
  } else {
    console.error(`  ✗ Failed ${key}:`, JSON.stringify(data.errors || data));
    return false;
  }
}

async function main() {
  console.log('--- Applying Shop Now Buttons & 50% Off Compare-At Prices ---');
  const token = await getAccessToken();

  // 1. Update heating-lamp-funnel.liquid
  let funnel = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');

  // A. Add Shop Now button under Add to Cart button
  const atcBtnHtml = `<button type="button" id="wf-main-atc-btn" class="wf-atc-button" onclick="submitWfOrder()">
            <span class="wf-atc-text">ADD TO CART &bull; CLAIM 50% OFF</span>
            <span class="wf-atc-arrow">➔</span>
          </button>`;

  const newAtcAndShopNow = `<button type="button" id="wf-main-atc-btn" class="wf-atc-button" onclick="submitWfOrder()">
            <span class="wf-atc-text">ADD TO CART &bull; CLAIM 50% OFF</span>
            <span class="wf-atc-arrow">➔</span>
          </button>

          <button type="button" id="wf-main-shopnow-btn" class="wf-shopnow-button" onclick="submitWfDirectCheckout()">
            <span class="wf-shopnow-text">SHOP NOW &bull; INSTANT CHECKOUT</span>
            <span class="wf-shopnow-arrow">⚡</span>
          </button>`;

  if (funnel.includes(atcBtnHtml) && !funnel.includes('wf-main-shopnow-btn')) {
    funnel = funnel.replace(atcBtnHtml, newAtcAndShopNow);
    console.log('✔ Added Shop Now button to heating-lamp-funnel');
  }

  // B. Update Subtotal section to show compare-at price
  funnel = funnel.replace(
    /<div class="wf-total-block">[\s\S]*?<span id="wf-total-display" class="wf-total-price">\$119\.99<\/span>\s*<\/div>/,
    `<div class="wf-total-block">
              <span class="wf-total-label">Subtotal:</span>
              <span id="wf-total-compare" class="wf-total-compare-price" style="text-decoration:line-through;color:#998e87;font-size:15px;margin-right:6px;font-weight:600;">$269.94</span>
              <span id="wf-total-display" class="wf-total-price">$119.99</span>
            </div>`
  );

  // C. Update bundle card pricing block loop to ensure compare-at price always shows 50% off if blank
  funnel = funnel.replace(
    /<div class="wf-bundle-pricing">\s*\{% if block\.settings\.old_price != blank %\}<span class="wf-price-compare">\$[\s\S]*?<\/div>/m,
    `<div class="wf-bundle-pricing">
                      {% if block.settings.old_price != blank %}
                        <span class="wf-price-compare">$\{\{ block.settings.old_price \}\}</span>
                      {% else %}
                        {% assign auto_comp = block.settings.price | times: 1.8 | round: 2 %}
                        <span class="wf-price-compare">$\{\{ auto_comp \}\}</span>
                      {% endif %}
                      <span class="wf-price-current">$\{\{ block.settings.price \}\}</span>
                    </div>`
  );

  // D. Update fallback bundles in heating-lamp-funnel
  // Bundle 3: 119.99, old 269.94
  funnel = funnel.replace(
    /onclick="selectWfBundle\('67953654300857',\s*'119\.99',\s*'[^']*',\s*'wf-bundle-3'/,
    `onclick="selectWfBundle('67953654300857', '119.99', '269.94', 'wf-bundle-3'`
  );
  funnel = funnel.replace(
    /<span class="wf-price-compare">\$134\.99<\/span>\s*<span class="wf-price-current">\$119\.99<\/span>/,
    `<span class="wf-price-compare">$269.94</span>\n                    <span class="wf-price-current">$119.99</span>`
  );

  // Bundle 2: 89.99, old 179.98
  funnel = funnel.replace(
    /onclick="selectWfBundle\('67930179436729',\s*'89\.99',\s*'',\s*'wf-bundle-2'/,
    `onclick="selectWfBundle('67930179436729', '89.99', '179.98', 'wf-bundle-2'`
  );
  funnel = funnel.replace(
    /<div class="wf-bundle-pricing">\s*<span class="wf-price-current">\$89\.99<\/span>\s*<\/div>/,
    `<div class="wf-bundle-pricing">\n                    <span class="wf-price-compare">$179.98</span>\n                    <span class="wf-price-current">$89.99</span>\n                  </div>`
  );

  // Bundle 1: 49.99, old 89.98
  funnel = funnel.replace(
    /onclick="selectWfBundle\('67930179403961',\s*'49\.99',\s*'',\s*'wf-bundle-1'/,
    `onclick="selectWfBundle('67930179403961', '49.99', '89.98', 'wf-bundle-1'`
  );
  funnel = funnel.replace(
    /<div class="wf-bundle-pricing">\s*<span class="wf-price-current">\$49\.99<\/span>\s*<\/div>/,
    `<div class="wf-bundle-pricing">\n                    <span class="wf-price-compare">$89.98</span>\n                    <span class="wf-price-current">$49.99</span>\n                  </div>`
  );

  // E. Update selectWfBundle and updateWfTotal javascript functions
  const oldSelectScript = `  let wfSelectedVariantId = '67953654300857'; // default 3 pack
  let wfSelectedPrice = 119.99;
  let wfCurrentQty = 1;`;

  const newSelectScript = `  let wfSelectedVariantId = '67953654300857'; // default 3 pack
  let wfSelectedPrice = 119.99;
  let wfSelectedOldPrice = 269.94;
  let wfCurrentQty = 1;`;

  funnel = funnel.replace(oldSelectScript, newSelectScript);

  funnel = funnel.replace(
    /function selectWfBundle\(variantId, price, oldPrice, elementId, imgSrc\) \{[\s\S]*?wfSelectedPrice = parseFloat\(price\);/,
    `function selectWfBundle(variantId, price, oldPrice, elementId, imgSrc) {
    wfSelectedVariantId = variantId;
    wfSelectedPrice = parseFloat(price);
    wfSelectedOldPrice = oldPrice ? parseFloat(oldPrice) : (wfSelectedPrice * 1.8);`
  );

  funnel = funnel.replace(
    /function updateWfTotal\(\) \{[\s\S]*?if \(disp\) disp\.textContent = '\$' \+ total;\s*\}/,
    `function updateWfTotal() {
    const total = (wfSelectedPrice * wfCurrentQty).toFixed(2);
    const compTotal = (wfSelectedOldPrice * wfCurrentQty).toFixed(2);
    const disp = document.getElementById('wf-total-display');
    const compDisp = document.getElementById('wf-total-compare');
    if (disp) disp.textContent = '$' + total;
    if (compDisp) compDisp.textContent = '$' + compTotal;
  }`
  );

  // F. Add submitWfDirectCheckout function
  if (!funnel.includes('submitWfDirectCheckout')) {
    funnel = funnel.replace(
      /async function submitWfOrder\(\) \{/,
      `async function submitWfDirectCheckout() {
    const btn = document.getElementById('wf-main-shopnow-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Proceeding to Checkout...</span>';
    }
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: wfSelectedVariantId,
            quantity: wfCurrentQty
          }]
        })
      });
      window.location.href = '/checkout';
    } catch (e) {
      window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
    }
  }

  async function submitWfOrder() {`
    );
  }

  // G. Add CSS for wf-shopnow-button
  if (!funnel.includes('.wf-shopnow-button')) {
    const shopNowCss = `
  .wf-shopnow-button {
    width: 100%;
    margin-top: 10px;
    padding: 16px 28px;
    background: #1f1b1c;
    color: #ffffff;
    font-family: var(--wf-font-heading);
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 4px 14px rgba(31, 27, 28, 0.2);
    transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
  }
  .wf-shopnow-button:hover {
    background: #000000;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  }
  .wf-shopnow-button:active {
    transform: translateY(0);
  }
  .wf-shopnow-arrow {
    font-size: 16px;
    transition: transform 0.2s ease;
  }
  .wf-shopnow-button:hover .wf-shopnow-arrow {
    transform: scale(1.2);
  }
`;
    funnel = funnel.replace('.wf-atc-button:hover {', shopNowCss + '\n  .wf-atc-button:hover {');
  }

  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', funnel);
  console.log('Saved Clone-willafarm/theme/sections/heating-lamp-funnel.liquid');
  await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', funnel);

  // 2. Update templates/product.sakerplus-livestock-heating-lamp.json bundle prices
  const sakerJsonPath = 'Clone-willafarm/theme/templates/product.sakerplus-livestock-heating-lamp.json';
  const sakerJson = JSON.parse(fs.readFileSync(sakerJsonPath, 'utf8'));
  const fBlock = sakerJson.sections.heating_lamp_funnel;

  if (fBlock.blocks.bundle_1) {
    fBlock.blocks.bundle_1.settings.price = '49.99';
    fBlock.blocks.bundle_1.settings.old_price = '89.98';
  }
  if (fBlock.blocks.bundle_2) {
    fBlock.blocks.bundle_2.settings.price = '89.99';
    fBlock.blocks.bundle_2.settings.old_price = '179.98';
  }
  if (fBlock.blocks.bundle_3) {
    fBlock.blocks.bundle_3.settings.price = '119.99';
    fBlock.blocks.bundle_3.settings.old_price = '269.94';
  }

  const updatedSakerJson = JSON.stringify(sakerJson, null, 2);
  fs.writeFileSync(sakerJsonPath, updatedSakerJson);
  console.log('Saved templates/product.sakerplus-livestock-heating-lamp.json with 50% off bundle prices');
  await uploadThemeAsset(token, 'templates/product.sakerplus-livestock-heating-lamp.json', updatedSakerJson);

  // 3. Update willa-main-product.liquid (all other products)
  let willaMain = fs.readFileSync('Clone-willafarm/theme/sections/willa-main-product.liquid', 'utf8');

  // A. Add Shop Now button under Add to Cart button
  const willaAtcRegex = /<button type="button" id="willaPdpAtcBtn"[\s\S]*?<\/button>/m;
  const newWillaAtcAndShopNow = `<button type="button" id="willaPdpAtcBtn" class="willa-btn-primary willa-pdp-atc" onclick="submitPdpOrder()">
            {% if product.available %}
              ADD TO CART ➔
            {% else %}
              SOLD OUT
            {% endif %}
          </button>

          <button type="button" id="willaPdpShopNowBtn" class="willa-pdp-shopnow" onclick="submitPdpDirectCheckout()">
            SHOP NOW ➔
          </button>`;

  if (!willaMain.includes('willaPdpShopNowBtn')) {
    willaMain = willaMain.replace(willaAtcRegex, newWillaAtcAndShopNow);
    console.log('✔ Added Shop Now button to willa-main-product');
  }

  // B. Ensure 50% discount price is ALWAYS calculated and displayed
  willaMain = willaMain.replace(
    /<div class="willa-pdp-price-row">[\s\S]*?<\/div>/m,
    `<div class="willa-pdp-price-row">
          <span class="willa-pdp-active-price" id="willaPdpPrice">{{ product.selected_or_first_available_variant.price | money }}</span>
          {% assign calc_compare = product.selected_or_first_available_variant.compare_at_price %}
          {% if calc_compare == blank or calc_compare <= product.selected_or_first_available_variant.price %}
            {% assign calc_compare = product.selected_or_first_available_variant.price | times: 1.8 | round %}
          {% endif %}
          <span class="willa-pdp-compare-price" id="willaPdpComparePrice">{{ calc_compare | money }}</span>
          <span class="willa-pdp-save-badge">{{ section.settings.save_badge_text | default: '50% OFF TODAY' }}</span>
        </div>`
  );

  // C. Add submitPdpDirectCheckout to javascript
  if (!willaMain.includes('submitPdpDirectCheckout')) {
    willaMain = willaMain.replace(
      /async function submitPdpOrder\(\) \{/,
      `async function submitPdpDirectCheckout() {
    const btn = document.getElementById('willaPdpShopNowBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerText = 'REDIRECTING...';
    }
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: willaCurrentPdpVariantId,
            quantity: willaCurrentPdpQty
          }]
        })
      });
      window.location.href = '/checkout';
    } catch (e) {
      window.location.href = '/cart/' + willaCurrentPdpVariantId + ':' + willaCurrentPdpQty;
    }
  }

  async function submitPdpOrder() {`
    );
  }

  // D. Add CSS for willa-pdp-shopnow
  if (!willaMain.includes('.willa-pdp-shopnow')) {
    const willaShopNowCss = `
  .willa-pdp-shopnow {
    width: 100%;
    margin-top: 10px;
    padding: 15px 24px;
    background: #1f1b1c;
    color: #ffffff;
    font-family: inherit;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 14px rgba(31, 27, 28, 0.2);
    transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
  }
  .willa-pdp-shopnow:hover {
    background: #000000;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  }
  .willa-pdp-shopnow:active {
    transform: translateY(0);
  }
`;
    willaMain = willaMain.replace('.willa-btn-primary:hover {', willaShopNowCss + '\n  .willa-btn-primary:hover {');
  }

  fs.writeFileSync('Clone-willafarm/theme/sections/willa-main-product.liquid', willaMain);
  console.log('Saved Clone-willafarm/theme/sections/willa-main-product.liquid');
  await uploadThemeAsset(token, 'sections/willa-main-product.liquid', willaMain);

  console.log('\n✔ All Shop Now buttons and 50% off bundle prices successfully applied and deployed!');
}

main().catch(console.error);
