import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';
const LIVE_THEME_ID = '186607567033';

if (DRAFT_THEME_ID === LIVE_THEME_ID || DRAFT_THEME_ID !== '187597717689') {
  throw new Error('SAFETY CHECK FAILED: Cannot modify live theme or incorrect draft theme ID!');
}

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function fetchAsset(token, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.asset?.value || null;
}

async function putAsset(token, key, value) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: { key, value }
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to upload ${key}: ${res.status} ${errText}`);
  }
  const data = await res.json();
  console.log(`Successfully uploaded: ${key} (${value.length} bytes)`);
  return data;
}

async function run() {
  console.log('=== PILOT MIGRATION: ZAVELYN SREFALSTEAM ===');
  const token = await getAccessToken();

  // 1. Add SrefalSteam structured benefits to snippets/zavelyn-pdp-data.liquid
  console.log('\n--- 1. Updating snippets/zavelyn-pdp-data.liquid ---');
  let pdpData = await fetchAsset(token, 'snippets/zavelyn-pdp-data.liquid');
  const srefalCase = `
    {% when 'srefalsteam' %}
      {%- assign zv_data_found = true -%}
      {%- assign zv_vp_badge = "COMMERCIAL SANITIZING POWER" -%}
      {%- assign zv_vp_title = "Zavelyn SrefalSteam Pro Cleaner" -%}
      {%- assign zv_vp_sub = "Instant 105°C+ high-pressure dry steam at 3 BAR dissolves rock-hard grease, baked-on grime, and stubborn mildew in seconds—100% chemical-free and safe for children and pets." -%}
      {%- assign zv_vp_img = "https://cdn.shopify.com/s/files/1/0992/8120/7622/files/hf_20260618_121833_7b368bb9-3ee8-4101-9676-74160a6be69e.png?v=1781785593" -%}
      {%- assign zv_vp_b0 = "2500W Fast-Heat Core (Steam in under 15 seconds)" -%}
      {%- assign zv_vp_b1 = "3-BAR Deep Penetrating Pressure dissolves grease instantly" -%}
      {%- assign zv_vp_b2 = "6 Precision Attachments for kitchen, bath, grout & car detailing" -%}
  `;

  if (!pdpData.includes("when 'srefalsteam'")) {
    pdpData = pdpData.replace("{%- case product.handle -%}", "{%- case product.handle -%}" + srefalCase);
    await putAsset(token, 'snippets/zavelyn-pdp-data.liquid', pdpData);
  } else {
    console.log('srefalsteam already present in zavelyn-pdp-data.liquid');
  }

  // 2. Hide old duplicate hero & sticky bar in sections/srefalsteam-funnel.liquid
  console.log('\n--- 2. Updating sections/srefalsteam-funnel.liquid ---');
  let srefalFunnel = await fetchAsset(token, 'sections/srefalsteam-funnel.liquid');
  if (srefalFunnel) {
    // Hide old hero section
    srefalFunnel = srefalFunnel.replace(
      '<section class="wf-section wf-hero-section">',
      '<section class="wf-section wf-hero-section" style="display: none !important;">'
    );
    // Hide old sticky bar
    srefalFunnel = srefalFunnel.replace(
      '<div class="wf-sticky-bar" id="wfStickyBar">',
      '<div class="wf-sticky-bar" id="wfStickyBar" style="display: none !important;">'
    );
    await putAsset(token, 'sections/srefalsteam-funnel.liquid', srefalFunnel);
  }

  // 3. Update templates/product.srefalsteam.json to load Universal Elixir components
  console.log('\n--- 3. Updating templates/product.srefalsteam.json ---');
  const unifiedTemplate = {
    "sections": {
      "main": {
        "type": "zavelyn-pdp-main",
        "settings": {
          "eyebrow_text": "ZAVELYN INNOVATIONS · COMMERCIAL SANITIZING",
          "urgency_text": "High US Demand · Limited Units Remaining at Clearance Pricing",
          "cta_text": "CLAIM OFFER",
          "enable_sticky_atc": true
        }
      },
      "custom_body": {
        "type": "srefalsteam-funnel",
        "settings": {}
      },
      "shipping": {
        "type": "zavelyn-pdp-shipping",
        "settings": {}
      }
    },
    "order": [
      "main",
      "custom_body",
      "shipping"
    ]
  };
  await putAsset(token, 'templates/product.srefalsteam.json', JSON.stringify(unifiedTemplate, null, 2));

  console.log('\n=== PILOT MIGRATION DEPLOYED SUCCESSFULLY ===');
}

run().catch(err => {
  console.error('Pilot migration error:', err);
  process.exit(1);
});
