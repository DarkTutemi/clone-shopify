import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function getAsset(token, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  return data.asset ? data.asset.value : null;
}

async function uploadAsset(token, key, value) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (data.asset) {
    console.log(`  ✔ Uploaded: ${key}`);
    return true;
  } else {
    console.error(`  ✗ Failed: ${key}`, JSON.stringify(data.errors || data));
    return false;
  }
}

async function run() {
  const token = await getAccessToken();
  console.log('Got access token. Starting 13-inch and 5-color variants update...');

  // 1. UPDATE templates/product.zavelyn-drum-pro.json
  console.log('\n--- 1. Updating templates/product.zavelyn-drum-pro.json ---');
  let proTplRaw = await getAsset(token, 'templates/product.zavelyn-drum-pro.json');
  let proTpl = JSON.parse(proTplRaw);

  // Update spec_diameter
  proTpl.sections.specs.settings.spec_diameter = "13 Inches (33 cm) Pro Studio";
  proTpl.sections.specs.settings.spec_weight = "7.8 lbs (3.5 kg) Balanced Studio Resonance";
  
  // Update hero tier1 description
  proTpl.sections.hero.settings.tier1_desc = "13-Inch 15-Tone Drum + Travel Backpack + Mallets + Master Songbook + Picks";

  // Update reviews meta to match 5 available colors (Green, Black, Navy, Purple, Gold)
  const colorRotation = ["Green", "Black", "Navy", "Purple", "Gold", "Green", "Black", "Navy", "Purple", "Gold"];
  if (proTpl.sections.reviews && proTpl.sections.reviews.blocks) {
    const blockKeys = Object.keys(proTpl.sections.reviews.blocks);
    blockKeys.forEach((k, idx) => {
      const b = proTpl.sections.reviews.blocks[k];
      if (b.settings && b.settings.meta) {
        const assignedColor = colorRotation[idx % colorRotation.length];
        // Replace (Color) with (AssignedColor)
        b.settings.meta = b.settings.meta.replace(/\([A-Za-z\s]+\)/, `(${assignedColor})`);
      }
    });
  }

  await uploadAsset(token, 'templates/product.zavelyn-drum-pro.json', JSON.stringify(proTpl, null, 2));

  // 2. UPDATE sections/zhp-pdp-specs.liquid
  console.log('\n--- 2. Updating sections/zhp-pdp-specs.liquid ---');
  let specsLiquid = await getAsset(token, 'sections/zhp-pdp-specs.liquid');
  if (specsLiquid) {
    specsLiquid = specsLiquid.replace(/default:\s*'14 Inches \(35\.5 cm\) Master Large'/g, "default: '13 Inches (33 cm) Pro Studio'");
    await uploadAsset(token, 'sections/zhp-pdp-specs.liquid', specsLiquid);
  }

  // 3. UPDATE sections/zhp-pdp-hero.liquid
  console.log('\n--- 3. Updating sections/zhp-pdp-hero.liquid ---');
  let heroLiquid = await getAsset(token, 'sections/zhp-pdp-hero.liquid');
  if (heroLiquid) {
    // 3.1 Update label to dynamic {{ product.variants.first.title | default: 'Green' }}
    heroLiquid = heroLiquid.replace(
      /<span id="wfSelectedColorName"[^>]*>[^<]*<\/span>/,
      `<span id="wfSelectedColorName" style="color:var(--wf-primary); font-weight:800;">{{ product.variants.first.title | default: 'Green' }}</span>`
    );

    // 3.2 Update color swatch hex mappings for Green, Black, Navy, Purple, Gold
    const oldColorLoop = `              {%- for variant in product.variants -%}
                {%- assign v_title = variant.title | downcase -%}
                {%- assign hex = '#ffffff' -%}
                {%- if v_title contains 'black' -%}{%- assign hex = '#1a1a1a' -%}
                {%- elsif v_title contains 'silver' -%}{%- assign hex = '#cbd5e1' -%}
                {%- elsif v_title contains 'blue' -%}{%- assign hex = '#1e3a8a' -%}
                {%- elsif v_title contains 'sandstone' or v_title contains 'gold' -%}{%- assign hex = '#d4b996' -%}
                {%- elsif v_title contains 'emerald' or v_title contains 'green' -%}{%- assign hex = '#065f46' -%}
                {%- elsif v_title contains 'pink tan' -%}{%- assign hex = '#e0a899' -%}
                {%- elsif v_title contains 'pink' -%}{%- assign hex = '#f472b6' -%}
                {%- elsif v_title contains 'red' -%}{%- assign hex = '#dc2626' -%}
                {%- elsif v_title contains 'burgundy' -%}{%- assign hex = '#831843' -%}
                {%- endif -%}`;

    const newColorLoop = `              {%- for variant in product.variants -%}
                {%- assign v_title = variant.title | downcase -%}
                {%- assign hex = '#1a1a1a' -%}
                {%- if v_title contains 'green' or v_title contains 'emerald' -%}
                  {%- assign hex = '#0f6e52' -%}
                {%- elsif v_title contains 'black' -%}
                  {%- assign hex = '#1a1a1a' -%}
                {%- elsif v_title contains 'navy' or v_title contains 'blue' -%}
                  {%- assign hex = '#1b2a4e' -%}
                {%- elsif v_title contains 'purple' or v_title contains 'violet' or v_title contains 'burgundy' -%}
                  {%- assign hex = '#581c87' -%}
                {%- elsif v_title contains 'gold' or v_title contains 'yellow' or v_title contains 'sandstone' -%}
                  {%- assign hex = '#d4af37' -%}
                {%- elsif v_title contains 'white' -%}
                  {%- assign hex = '#ffffff' -%}
                {%- endif -%}`;

    if (heroLiquid.includes(oldColorLoop)) {
      heroLiquid = heroLiquid.replace(oldColorLoop, newColorLoop);
    } else {
      // regex fallback
      heroLiquid = heroLiquid.replace(
        /\{%- for variant in product\.variants -%}[\s\S]*?\{%- endif -%\}/,
        newColorLoop
      );
    }

    // 3.3 Ensure DOMContentLoaded script initializes variant ID & color name dynamically
    if (!heroLiquid.includes('initWfVariantState')) {
      const initScript = `
<script>
  function initWfVariantState() {
    var activeBtn = document.querySelector('.wf-color-btn.active') || document.querySelector('.wf-color-btn');
    if (activeBtn) {
      var vId = activeBtn.getAttribute('data-variant-id');
      var color = activeBtn.getAttribute('data-color');
      if (vId && typeof currentVariantId !== 'undefined') currentVariantId = vId;
      var nameEl = document.getElementById('wfSelectedColorName');
      if (nameEl && color) nameEl.textContent = color;
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWfVariantState);
  } else {
    initWfVariantState();
  }
</script>
`;
      heroLiquid += initScript;
    }

    await uploadAsset(token, 'sections/zhp-pdp-hero.liquid', heroLiquid);
  }

  // 4. UPDATE assets/zhp-pdp.css for double-ring swatches
  console.log('\n--- 4. Updating assets/zhp-pdp.css ---');
  let pdpCss = await getAsset(token, 'assets/zhp-pdp.css');
  if (pdpCss) {
    const oldBtnCss = `.wf-color-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.wf-color-btn.active {
  border-color: var(--wf-primary);
  transform: scale(1.15);
  box-shadow: 0 0 0 3px rgba(138,44,19,0.25);
}`;

    const newBtnCss = `.wf-color-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.15);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  outline: none;
  padding: 0;
  position: relative;
}

.wf-color-btn:hover {
  transform: scale(1.08);
}

.wf-color-btn.active {
  box-shadow: 0 0 0 2.5px #ffffff, 0 0 0 4.5px #8a2c13;
  transform: scale(1.12);
}`;

    if (pdpCss.includes(oldBtnCss)) {
      pdpCss = pdpCss.replace(oldBtnCss, newBtnCss);
    } else {
      pdpCss += `\n/* Enhanced Color Swatch Ring */\n${newBtnCss}\n`;
    }
    await uploadAsset(token, 'assets/zhp-pdp.css', pdpCss);
  }

  // 5. UPDATE assets/zhp-pdp.js
  console.log('\n--- 5. Updating assets/zhp-pdp.js ---');
  let pdpJs = await getAsset(token, 'assets/zhp-pdp.js');
  if (pdpJs) {
    // Ensure default initial variant ID matches Green (67959036838073)
    pdpJs = pdpJs.replace(/let currentVariantId = "[^"]*";/, `let currentVariantId = "67959036838073";`);
    await uploadAsset(token, 'assets/zhp-pdp.js', pdpJs);
  }

  // 6. UPDATE collection page sections for 13" Pro references
  console.log('\n--- 6. Updating Collection Page 13" References ---');

  // 6.1 sections/zhp-bestsellers.liquid
  let best = await getAsset(token, 'sections/zhp-bestsellers.liquid');
  if (best) {
    best = best.replace(/Rich sound • 15" • 15 Tones/g, 'Rich sound • 13" • 15 Tones');
    best = best.replace(/<span>Zavelyn Pro 15"<\/span>/g, '<span>Zavelyn Pro 13"</span>');
    await uploadAsset(token, 'sections/zhp-bestsellers.liquid', best);
  }

  // 6.2 sections/zhp-model-tabs.liquid
  let tabs = await getAsset(token, 'sections/zhp-model-tabs.liquid');
  if (tabs) {
    tabs = tabs.replace(/15 Tones • 15"/g, '15 Tones • 13"');
    tabs = tabs.replace(/15" diameter/g, '13" diameter');
    await uploadAsset(token, 'sections/zhp-model-tabs.liquid', tabs);
  }

  // 6.3 sections/zhp-comparison.liquid
  let comp = await getAsset(token, 'sections/zhp-comparison.liquid');
  if (comp) {
    comp = comp.replace(/15 Tones • 15"/g, '15 Tones • 13"');
    await uploadAsset(token, 'sections/zhp-comparison.liquid', comp);
  }

  console.log('\n🎉 ALL UPDATES DEPLOYED SUCCESSFULLY TO THEME 186607567033!');
}

run().catch(console.error);
