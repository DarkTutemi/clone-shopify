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

function fixNesting(content) {
  // Find the rogue </div> between wf-header-group and wf-bundle-selector
  const badSegment = `        <div class="wf-header-group">
          <div class="wf-review-stars">
            <span class="wf-stars">★★★★★</span>
            <span class="wf-review-count">4.9 / 5.0 (1,480+ Reviews)</span>
          </div>
          <h1 class="wf-product-title">{{ section.settings.product_title | default: 'Zavelyn® Intelligent Livestock Heating Lamp' }}</h1>
          <p class="wf-product-desc">{{ section.settings.product_subtitle | default: 'Safe, energy-efficient brooder warmth engineered with an intelligent digital thermostat. Keeps baby chicks, ducklings, piglets, and pets comfortably warm without dangerous fire risks or harsh red glare.' }}</p>
        </div>

        
        </div>

        <!-- Bundle Package Selector -->`;

  const cleanSegment = `        <div class="wf-header-group">
          <div class="wf-review-stars">
            <span class="wf-stars">★★★★★</span>
            <span class="wf-review-count">4.9 / 5.0 (1,480+ Reviews)</span>
          </div>
          <h1 class="wf-product-title">{{ section.settings.product_title | default: 'Zavelyn® Intelligent Livestock Heating Lamp' }}</h1>
          <p class="wf-product-desc">{{ section.settings.product_subtitle | default: 'Safe, energy-efficient brooder warmth engineered with an intelligent digital thermostat. Keeps baby chicks, ducklings, piglets, and pets comfortably warm without dangerous fire risks or harsh red glare.' }}</p>
        </div>

        <!-- Bundle Package Selector -->`;

  if (content.includes(badSegment)) {
    console.log('Found exact rogue </div> segment! Replacing...');
    return content.replace(badSegment, cleanSegment);
  } else {
    console.log('Exact badSegment string not matched, checking with regex...');
    return content.replace(
      /(<div class="wf-header-group">[\s\S]*?<\/div>)\s*<\/div>\s*(<!-- Bundle Package Selector -->)/,
      '$1\n\n        $2'
    );
  }
}

async function main() {
  console.log('--- Fixing Hero Buybox 2-Column Grid Nesting ---');
  const token = await getAccessToken();

  let liquid = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');
  liquid = fixNesting(liquid);
  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', liquid);

  let buildScript = fs.readFileSync('Clone-willafarm/scripts/build_willa_heating_lamp_pdp.mjs', 'utf8');
  buildScript = fixNesting(buildScript);
  fs.writeFileSync('Clone-willafarm/scripts/build_willa_heating_lamp_pdp.mjs', buildScript);

  console.log('Uploading corrected section to Shopify active theme...');
  const ok = await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', liquid);
  if (!ok) throw new Error('Theme asset upload failed');

  console.log('✔ Successfully deployed fix to Shopify Theme 186607567033!');
}

main().catch(console.error);
