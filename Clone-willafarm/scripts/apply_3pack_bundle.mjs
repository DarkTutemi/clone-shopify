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
  console.log('--- Applying 3-Pack Extra 10% + Free Shipping, 2-Pack Free Shipping Only ---');
  const token = await getAccessToken();

  // 1. Update heating-lamp-funnel.liquid
  let liquid = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');

  // Update savings pill
  liquid = liquid.replace(
    /<span class="wf-savings-pill">Save Up To 50%<\/span>/,
    '<span class="wf-savings-pill">Extra 10% Off Available</span>'
  );

  // Update fallback bundles in liquid
  const oldFallbackBundles = `            {% if bundles_count == 0 %}
              <!-- Fallback Default Bundles -->
              <div class="wf-bundle-card selected" id="wf-bundle-2" onclick="selectWfBundle('67930179436729', '89.99', '179.99', 'wf-bundle-2', 'https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png')">
                <div class="wf-bundle-badge">BEST SELLER • 50% OFF • FREE SHIPPING</div>
                <div class="wf-bundle-inner">
                  <div class="wf-radio-circle"><div class="wf-radio-dot"></div></div>
                  <div class="wf-bundle-thumb">
                    <img src="https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png" alt="2 Pack Bundle" referrerpolicy="no-referrer">
                  </div>
                  <div class="wf-bundle-details">
                    <div class="wf-bundle-name">2 Pack (Light + US Switch Cord)</div>
                    <div class="wf-bundle-includes">
                      <span>✔ 2x Zavelyn® Intelligent Heating Lamps</span><br>
                      <span>✔ 2x US Heavy-Duty Switch Cords • $44.99/set</span>
                    </div>
                  </div>
                  <div class="wf-bundle-pricing">
                    <span class="wf-price-compare">$179.99</span>
                    <span class="wf-price-current">$89.99</span>
                  </div>
                </div>
              </div>

              <div class="wf-bundle-card" id="wf-bundle-1" onclick="selectWfBundle('67930179403961', '49.99', '99.99', 'wf-bundle-1', 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg')">
                <div class="wf-bundle-badge secondary">STARTER PACK • 50% OFF</div>
                <div class="wf-bundle-inner">
                  <div class="wf-radio-circle"><div class="wf-radio-dot"></div></div>
                  <div class="wf-bundle-thumb">
                    <img src="https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg" alt="1 Pack Bundle" referrerpolicy="no-referrer">
                  </div>
                  <div class="wf-bundle-details">
                    <div class="wf-bundle-name">1 Pack (Light + US Switch Cord)</div>
                    <div class="wf-bundle-includes">
                      <span>✔ 1x Zavelyn® Intelligent Heating Lamp</span><br>
                      <span>✔ 1x US Heavy-Duty Switch Cord</span>
                    </div>
                  </div>
                  <div class="wf-bundle-pricing">
                    <span class="wf-price-compare">$99.99</span>
                    <span class="wf-price-current">$49.99</span>
                  </div>
                </div>
              </div>
            {% endif %}`;

  const newFallbackBundles = `            {% if bundles_count == 0 %}
              <!-- Fallback Default Bundles -->
              <div class="wf-bundle-card selected" id="wf-bundle-3" onclick="selectWfBundle('67953654300857', '119.99', '134.99', 'wf-bundle-3', 'https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png')">
                <div class="wf-bundle-badge">BEST VALUE • EXTRA 10% OFF • FREE SHIPPING</div>
                <div class="wf-bundle-inner">
                  <div class="wf-radio-circle"><div class="wf-radio-dot"></div></div>
                  <div class="wf-bundle-thumb">
                    <img src="https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png" alt="3 Pack Bundle" referrerpolicy="no-referrer">
                  </div>
                  <div class="wf-bundle-details">
                    <div class="wf-bundle-name">3 Pack (Light + US Switch Cord)</div>
                    <div class="wf-bundle-includes">
                      <span>✔ 3x Zavelyn® Intelligent Heating Lamps</span><br>
                      <span>✔ 3x US Heavy-Duty Switch Cords • Only $39.99/set</span><br>
                      <span>✔ Extra 10% Off • Free Express Shipping</span>
                    </div>
                  </div>
                  <div class="wf-bundle-pricing">
                    <span class="wf-price-compare">$134.99</span>
                    <span class="wf-price-current">$119.99</span>
                  </div>
                </div>
              </div>

              <div class="wf-bundle-card" id="wf-bundle-2" onclick="selectWfBundle('67930179436729', '89.99', '', 'wf-bundle-2', 'https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png')">
                <div class="wf-bundle-badge secondary">FREE SHIPPING</div>
                <div class="wf-bundle-inner">
                  <div class="wf-radio-circle"><div class="wf-radio-dot"></div></div>
                  <div class="wf-bundle-thumb">
                    <img src="https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png" alt="2 Pack Bundle" referrerpolicy="no-referrer">
                  </div>
                  <div class="wf-bundle-details">
                    <div class="wf-bundle-name">2 Pack (Light + US Switch Cord)</div>
                    <div class="wf-bundle-includes">
                      <span>✔ 2x Zavelyn® Intelligent Heating Lamps</span><br>
                      <span>✔ 2x US Heavy-Duty Switch Cords • $44.99/set</span><br>
                      <span>✔ Free Express Shipping</span>
                    </div>
                  </div>
                  <div class="wf-bundle-pricing">
                    <span class="wf-price-current">$89.99</span>
                  </div>
                </div>
              </div>

              <div class="wf-bundle-card" id="wf-bundle-1" onclick="selectWfBundle('67930179403961', '49.99', '', 'wf-bundle-1', 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg')">
                <div class="wf-bundle-badge secondary">STARTER PACK</div>
                <div class="wf-bundle-inner">
                  <div class="wf-radio-circle"><div class="wf-radio-dot"></div></div>
                  <div class="wf-bundle-thumb">
                    <img src="https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg" alt="1 Pack Bundle" referrerpolicy="no-referrer">
                  </div>
                  <div class="wf-bundle-details">
                    <div class="wf-bundle-name">1 Pack (Light + US Switch Cord)</div>
                    <div class="wf-bundle-includes">
                      <span>✔ 1x Zavelyn® Intelligent Heating Lamp</span><br>
                      <span>✔ 1x US Heavy-Duty Switch Cord</span>
                    </div>
                  </div>
                  <div class="wf-bundle-pricing">
                    <span class="wf-price-current">$49.99</span>
                  </div>
                </div>
              </div>
            {% endif %}`;

  if (liquid.includes('<!-- Fallback Default Bundles -->')) {
    liquid = liquid.replace(/\{% if bundles_count == 0 %}[\s\S]*?\{% endif %\}/, newFallbackBundles.trim());
  }

  // Update JavaScript bundle selection defaults & labels
  liquid = liquid.replace(
    /let wfSelectedVariantId = '[^']+';\s*\/\/ default 2 pack[\s\S]*?let wfSelectedPrice = [0-9.]+;/,
    `let wfSelectedVariantId = '67953654300857'; // default 3 pack\n  let wfSelectedPrice = 119.99;`
  );

  liquid = liquid.replace(
    /const titleText = \(variantId === '67930179436729'\) \? '\$89\.99 \(2 Pack\)' : '\$49\.99 \(1 Pack\)';/,
    `let titleText = '$119.99 (3 Pack)';\n    if (variantId === '67930179436729') titleText = '$89.99 (2 Pack)';\n    else if (variantId === '67930179403961') titleText = '$49.99 (1 Pack)';`
  );

  liquid = liquid.replace(
    /<span id="wf-total-display" class="wf-total-price">\$89\.99<\/span>/,
    '<span id="wf-total-display" class="wf-total-price">$119.99</span>'
  );

  liquid = liquid.replace(
    /<div class="wf-sticky-price" id="wf-sticky-price-val">\$89\.99 \(2 Pack\)<\/div>/,
    '<div class="wf-sticky-price" id="wf-sticky-price-val">$119.99 (3 Pack)</div>'
  );

  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', liquid);
  console.log('Saved Clone-willafarm/theme/sections/heating-lamp-funnel.liquid');

  // 2. Update templates/product.sakerplus-livestock-heating-lamp.json
  const prodJson = JSON.parse(fs.readFileSync('Clone-willafarm/theme/templates/product.sakerplus-livestock-heating-lamp.json', 'utf8'));
  const funnel = prodJson.sections.heating_lamp_funnel;

  // Add bundle_3
  funnel.blocks.bundle_3 = {
    type: "bundle_package",
    settings: {
      badge: "BEST VALUE • EXTRA 10% OFF • FREE SHIPPING",
      is_best_seller: true,
      title: "3 Pack (Light + US Switch Cord)",
      description: "<span>✔ 3x Zavelyn® Intelligent Heating Lamps</span><br><span>✔ 3x US Heavy-Duty Switch Cords • Only $39.99/set</span><br><span>✔ Extra 10% Off • Free Express Shipping</span>",
      variant_id: "67953654300857",
      price: "119.99",
      old_price: "134.99",
      image_url: "https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png"
    }
  };

  // Update bundle_2 (không giảm giá, chỉ freeship)
  funnel.blocks.bundle_2 = {
    type: "bundle_package",
    settings: {
      badge: "FREE SHIPPING",
      is_best_seller: false,
      title: "2 Pack (Light + US Switch Cord)",
      description: "<span>✔ 2x Zavelyn® Intelligent Heating Lamps</span><br><span>✔ 2x US Heavy-Duty Switch Cords • $44.99/set</span><br><span>✔ Free Express Shipping</span>",
      variant_id: "67930179436729",
      price: "89.99",
      old_price: "",
      image_url: "https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png"
    }
  };

  // Update bundle_1 (Starter Pack)
  funnel.blocks.bundle_1 = {
    type: "bundle_package",
    settings: {
      badge: "STARTER PACK",
      is_best_seller: false,
      title: "1 Pack (Light + US Switch Cord)",
      description: "<span>✔ 1x Zavelyn® Intelligent Heating Lamp</span><br><span>✔ 1x US Heavy-Duty Switch Cord</span>",
      variant_id: "67930179403961",
      price: "49.99",
      old_price: "",
      image_url: "https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg"
    }
  };

  // Update block_order to have bundle_3 first, then bundle_2, then bundle_1
  const nonBundleBlocks = funnel.block_order.filter(id => !['bundle_1', 'bundle_2', 'bundle_3'].includes(id));
  funnel.block_order = ['bundle_3', 'bundle_2', 'bundle_1', ...nonBundleBlocks];

  const jsonStr = JSON.stringify(prodJson, null, 2);
  fs.writeFileSync('Clone-willafarm/theme/templates/product.sakerplus-livestock-heating-lamp.json', jsonStr);
  console.log('Saved Clone-willafarm/theme/templates/product.sakerplus-livestock-heating-lamp.json');

  // Also update build_willa_heating_lamp_pdp.mjs
  let buildScript = fs.readFileSync('Clone-willafarm/scripts/build_willa_heating_lamp_pdp.mjs', 'utf8');
  buildScript = buildScript.replace(
    /<span class="wf-savings-pill">Save Up To 50%<\/span>/,
    '<span class="wf-savings-pill">Extra 10% Off Available</span>'
  );
  fs.writeFileSync('Clone-willafarm/scripts/build_willa_heating_lamp_pdp.mjs', buildScript);

  // Deploy both assets to Shopify
  console.log('Uploading sections/heating-lamp-funnel.liquid...');
  const up1 = await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', liquid);
  if (!up1) throw new Error('Failed to upload liquid section');

  console.log('Uploading templates/product.sakerplus-livestock-heating-lamp.json...');
  const up2 = await uploadThemeAsset(token, 'templates/product.sakerplus-livestock-heating-lamp.json', jsonStr);
  if (!up2) throw new Error('Failed to upload json template');

  console.log('✔ Successfully deployed 3-Pack and 2-Pack bundle updates to Shopify Theme 186607567033!');
}

main().catch(console.error);
