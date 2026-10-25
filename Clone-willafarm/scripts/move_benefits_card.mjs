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
  console.log('--- Moving Benefits Card Below Shopify Payments Icons ---');
  const token = await getAccessToken();

  let liquid = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');

  // 1. Benefits card block content to be placed under payments
  const benefitsCardHtml = `<!-- Key Benefit Checkmarks (Moved below Shopify Payments) -->
          <div class="wf-benefits-card">
            <div class="wf-benefits-title">Why Homesteaders Choose Zavelyn®:</div>
            <div class="wf-benefits-list">
              {% assign key_points_count = 0 %}
              {% for block in section.blocks %}
                {% if block.type == 'key_point' %}
                  {% assign key_points_count = key_points_count | plus: 1 %}
                  <div class="wf-benefit-item" {{ block.shopify_attributes }}>
                    <span class="wf-check-icon">✔</span>
                    <span><strong>{{ block.settings.title }}:</strong> {{ block.settings.text }}</span>
                  </div>
                {% endif %}
              {% endfor %}
              {% if key_points_count == 0 %}
                <div class="wf-benefit-item">
                  <span class="wf-check-icon">✔</span>
                  <span><strong>Auto-Regulating Digital Thermostat:</strong> Calibrates warmth between 82°F–95°F (28°C–35°C). Auto-shuts off when target temp is reached.</span>
                </div>
                <div class="wf-benefit-item">
                  <span class="wf-check-icon">✔</span>
                  <span><strong>100% Sealed Fireproof Polymer Shell:</strong> Zero hot glass filaments or 400°F surface hazard. Safe around dry hay and pine shavings.</span>
                </div>
                <div class="wf-benefit-item">
                  <span class="wf-check-icon">✔</span>
                  <span><strong>Soft Ambient Glow (Zero Stress):</strong> Gentle illumination eliminates nocturnal sleep disruption and aggressive feather pecking.</span>
                </div>
                <div class="wf-benefit-item">
                  <span class="wf-check-icon">✔</span>
                  <span><strong>Standard E26/E27 Base + Heavy-Duty Cord:</strong> Screws directly into standard household sockets or included US switch cord.</span>
                </div>
              {% endif %}
            </div>
          </div>`;

  // 2. Remove desktop-only benefits card from gallery column
  const desktopCardRegex = /<!-- Key Benefit Checkmarks -->\s*<div class="wf-benefits-card desktop-only">[\s\S]*?<\/div>\s*<\/div>/;
  liquid = liquid.replace(desktopCardRegex, '');

  // 3. Remove mobile-only benefits card from buybox column
  const mobileCardRegex = /<!-- Mobile Checkmarks \(Visible on small screens\) -->\s*<div class="wf-benefits-card mobile-only">[\s\S]*?<\/div>\s*<\/div>/;
  liquid = liquid.replace(mobileCardRegex, '');

  // 4. Insert benefits card right after wf-payment-icons
  const paymentIconsEndRegex = /(<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>\s*<!-- SECTION 2:)/;
  // Let's find exactly the end of wf-payment-icons
  const paymentBlockRegex = /(<div class="wf-payment-icons">[\s\S]*?<\/ul>\s*<\/div>)/;
  if (!liquid.match(paymentBlockRegex)) {
    throw new Error('paymentBlockRegex did not match in liquid file!');
  }

  liquid = liquid.replace(paymentBlockRegex, `$1\n\n          ${benefitsCardHtml}`);

  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', liquid);
  console.log('Saved Clone-willafarm/theme/sections/heating-lamp-funnel.liquid');

  // Also update build_willa_heating_lamp_pdp.mjs so that future builds keep this exact layout
  let buildScript = fs.readFileSync('Clone-willafarm/scripts/build_willa_heating_lamp_pdp.mjs', 'utf8');
  buildScript = buildScript.replace(desktopCardRegex, '');
  buildScript = buildScript.replace(mobileCardRegex, '');
  buildScript = buildScript.replace(paymentBlockRegex, `$1\n\n          ${benefitsCardHtml}`);
  fs.writeFileSync('Clone-willafarm/scripts/build_willa_heating_lamp_pdp.mjs', buildScript);
  console.log('Saved Clone-willafarm/scripts/build_willa_heating_lamp_pdp.mjs');

  // Deploy to Shopify
  console.log('Uploading updated section to Shopify active theme...');
  const ok = await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', liquid);
  if (!ok) throw new Error('Theme asset upload failed');

  console.log('✔ Successfully deployed to Shopify Theme 186607567033!');
}

main().catch(console.error);
