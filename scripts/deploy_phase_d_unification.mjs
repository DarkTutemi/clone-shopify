import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';
const LIVE_THEME_ID = '186607567033';

// STRICT SAFETY ASSERTION
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
  console.log('=== PHASE D: STOREWIDE PRODUCT TEMPLATE UNIFICATION DEPLOYMENT ===');
  const token = await getAccessToken();

  // 1. UPDATE snippets/zavelyn-pdp-data.liquid with rich structured benefits for all custom funnels
  console.log('\n--- 1. Updating snippets/zavelyn-pdp-data.liquid ---');
  let pdpData = await fetchAsset(token, 'snippets/zavelyn-pdp-data.liquid');
  
  const additionalCases = `
    {% when 'the-yeoman-sweep' %}
      {%- assign zv_data_found = true -%}
      {%- assign zv_vp_badge = "HEAVY-DUTY LAWN & YARD CARE" -%}
      {%- assign zv_vp_title = "Zavelyn Yeoman Sweep Yard Sweeper" -%}
      {%- assign zv_vp_sub = "Commercial-grade rotary brush yard sweeper that clears wet leaves, lawn thatch, pine cones, and grass clippings in a single effortless walking pass." -%}
      {%- assign zv_vp_img = "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/yeoman-sweep-main.webp?v=1792809300" -%}
      {%- assign zv_vp_b0 = "Quad-Action High-Velocity Rotary Brushes clear 26-inch path" -%}
      {%- assign zv_vp_b1 = "Extra-Large Flow-Through Hopper Bag cuts dump trips in half" -%}
      {%- assign zv_vp_b2 = "Infinite Height Micro-Adjustment for lawn, gravel & driveway" -%}

    {% when 'thoson-magtrack' %}
      {%- assign zv_data_found = true -%}
      {%- assign zv_vp_badge = "SCREEN-FREE STEM INNOVATION" -%}
      {%- assign zv_vp_title = "Zavelyn MagTrack™ Modular Magnetic Train Set" -%}
      {%- assign zv_vp_sub = "Architectural magnetic rail building system with dual-polarity neodymium magnets, motorized locomotives, and drop-resistant BPA-free components." -%}
      {%- assign zv_vp_img = "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/MagTrack.webp?v=1792809300" -%}
      {%- assign zv_vp_b0 = "Dual-Polarity Neodymium Snap-Lock Joints click firm without pinching" -%}
      {%- assign zv_vp_b1 = "Electric Motorized Locomotive tackles 45° inclines and loop bridges" -%}
      {%- assign zv_vp_b2 = "100% Drop-Tested, BPA-Free Food-Grade ABS with silky rounded edges" -%}

    {% when 'livestock-heating-lamp' %}
      {%- assign zv_data_found = true -%}
      {%- assign zv_vp_badge = "PROFESSIONAL FARM & BROODER CARE" -%}
      {%- assign zv_vp_title = "Zavelyn Livestock Carbon Fiber Heating Lamp" -%}
      {%- assign zv_vp_sub = "Digital thermostatic infrared heating lamp engineered for barns, brooders, whelping pens, and coops with zero-fire hazard protection." -%}
      {%- assign zv_vp_img = "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/heating-lamp-main.webp?v=1792809300" -%}
      {%- assign zv_vp_b0 = "Carbon Fiber Far-Infrared Core warms livestock directly without glare" -%}
      {%- assign zv_vp_b1 = "Smart Digital Thermostat holds exact target brooder temperature" -%}
      {%- assign zv_vp_b2 = "Heavy-Duty Stainless Guard & Anti-Bite Cable prevent barn hazards" -%}

    {% when 'zavelyn-drum-mini' or 'zavelyn-drum-plus' or 'zavelyn-drum-pro' or 'zavelyn-handpan-master' or 'zavelyn-rain-drum' %}
      {%- assign zv_data_found = true -%}
      {%- assign zv_vp_badge = "HANDCRAFTED MEDITATION INSTRUMENT" -%}
      {%- assign zv_vp_title = product.title -%}
      {%- assign zv_vp_sub = "Harmonically tuned alloy steel tongue drum calibrated to 432 Hz healing frequencies for deep mindfulness, anxiety relief, and effortless acoustic resonance." -%}
      {%- assign zv_vp_img = product.featured_image | image_url: width: 1000 -%}
      {%- assign zv_vp_b0 = "Harmonic 432 Hz Tuning aligns with natural acoustic resonance" -%}
      {%- assign zv_vp_b1 = "Premium Laser-Cut Carbon Steel Alloy with rust-proof electrocoating" -%}
      {%- assign zv_vp_b2 = "Complete Master Set Includes padded travel bag, mallets & tutorial" -%}
  `;

  if (!pdpData.includes("when 'the-yeoman-sweep'")) {
    pdpData = pdpData.replace("{%- case product.handle -%}", "{%- case product.handle -%}" + additionalCases);
    await putAsset(token, 'snippets/zavelyn-pdp-data.liquid', pdpData);
  }

  // 2. MIGRATE THE YEOMAN SWEEP
  console.log('\n--- 2. Migrating Yeoman Sweep ---');
  let yeomanFunnel = await fetchAsset(token, 'sections/yeoman-sweep-funnel.liquid');
  if (yeomanFunnel) {
    yeomanFunnel = yeomanFunnel.replace(
      '<section class="wf-section wf-hero-section">',
      '<section class="wf-section wf-hero-section" style="display: none !important;">'
    );
    yeomanFunnel = yeomanFunnel.replace(
      '<div class="wf-sticky-bar" id="wfStickyBar">',
      '<div class="wf-sticky-bar" id="wfStickyBar" style="display: none !important;">'
    );
    await putAsset(token, 'sections/yeoman-sweep-funnel.liquid', yeomanFunnel);
  }
  const yeomanTemplate = {
    "sections": {
      "main": {
        "type": "zavelyn-pdp-main",
        "settings": {
          "eyebrow_text": "ZAVELYN INNOVATIONS · HOMESTEAD & YARD CARE",
          "urgency_text": "High US Demand · Limited Units Remaining at Clearance Pricing",
          "cta_text": "CLAIM OFFER",
          "enable_sticky_atc": true
        }
      },
      "custom_body": {
        "type": "yeoman-sweep-funnel",
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
  await putAsset(token, 'templates/product.yeoman-sweep.json', JSON.stringify(yeomanTemplate, null, 2));

  // 3. MIGRATE THOSON MAGTRACK
  console.log('\n--- 3. Migrating Thoson MagTrack ---');
  let thosonFunnel = await fetchAsset(token, 'sections/thoson-magtrack-funnel.liquid');
  if (thosonFunnel) {
    thosonFunnel = thosonFunnel.replace(
      '<section class="wf-section wf-hero-buybox">',
      '<section class="wf-section wf-hero-buybox" style="display: none !important;">'
    );
    thosonFunnel = thosonFunnel.replace(
      '<div class="wf-sticky-bar" id="wf-sticky-bar">',
      '<div class="wf-sticky-bar" id="wf-sticky-bar" style="display: none !important;">'
    );
    await putAsset(token, 'sections/thoson-magtrack-funnel.liquid', thosonFunnel);
  }
  const thosonTemplate = {
    "sections": {
      "main": {
        "type": "zavelyn-pdp-main",
        "settings": {
          "eyebrow_text": "ZAVELYN INNOVATIONS · STEM EDUCATIONAL TOYS",
          "urgency_text": "High US Demand · Limited Units Remaining at Clearance Pricing",
          "cta_text": "CLAIM OFFER",
          "enable_sticky_atc": true
        }
      },
      "custom_body": {
        "type": "thoson-magtrack-funnel",
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
  await putAsset(token, 'templates/product.thoson-magtrack.json', JSON.stringify(thosonTemplate, null, 2));

  // 4. MIGRATE LIVESTOCK HEATING LAMP
  console.log('\n--- 4. Migrating Livestock Heating Lamp ---');
  let heatingFunnel = await fetchAsset(token, 'sections/heating-lamp-funnel.liquid');
  if (heatingFunnel) {
    heatingFunnel = heatingFunnel.replace(
      '<section class="wf-section wf-hero-buybox">',
      '<section class="wf-section wf-hero-buybox" style="display: none !important;">'
    );
    heatingFunnel = heatingFunnel.replace(
      '<div class="wf-sticky-buy-bar" id="wf-sticky-bar">',
      '<div class="wf-sticky-buy-bar" id="wf-sticky-bar" style="display: none !important;">'
    );
    await putAsset(token, 'sections/heating-lamp-funnel.liquid', heatingFunnel);
  }
  const heatingTemplate = {
    "sections": {
      "main": {
        "type": "zavelyn-pdp-main",
        "settings": {
          "eyebrow_text": "ZAVELYN INNOVATIONS · FARM & LIVESTOCK ESSENTIALS",
          "urgency_text": "High US Demand · Limited Units Remaining at Clearance Pricing",
          "cta_text": "CLAIM OFFER",
          "enable_sticky_atc": true
        }
      },
      "heating_lamp_funnel": {
        "type": "heating-lamp-funnel",
        "settings": {}
      },
      "shipping": {
        "type": "zavelyn-pdp-shipping",
        "settings": {}
      }
    },
    "order": [
      "main",
      "heating_lamp_funnel",
      "shipping"
    ]
  };
  await putAsset(token, 'templates/product.sakerplus-livestock-heating-lamp.json', JSON.stringify(heatingTemplate, null, 2));

  // 5. MIGRATE THE 5 DRUM / HANDPAN TEMPLATES
  console.log('\n--- 5. Migrating the 5 Drum / Handpan Templates ---');
  const drumTemplates = [
    'templates/product.zavelyn-drum-mini.json',
    'templates/product.zavelyn-drum-plus.json',
    'templates/product.zavelyn-drum-pro.json',
    'templates/product.zavelyn-handpan-master.json',
    'templates/product.zavelyn-rain-drum.json'
  ];

  for (const dt of drumTemplates) {
    let tplStr = await fetchAsset(token, dt);
    if (tplStr) {
      const tpl = JSON.parse(tplStr);
      // Replace hero with main
      tpl.sections.main = {
        "type": "zavelyn-pdp-main",
        "settings": {
          "eyebrow_text": "ZAVELYN INNOVATIONS · MEDITATION & SOUND THERAPY",
          "urgency_text": "High US Demand · Limited Handcrafted Batches Remaining",
          "cta_text": "CLAIM OFFER",
          "enable_sticky_atc": true
        }
      };
      delete tpl.sections.hero;

      // Replace shipping with Doorstep Delivery Guarantee section
      tpl.sections.shipping = {
        "type": "zavelyn-pdp-shipping",
        "settings": {}
      };

      // Remove sticky_bar section if present (zavelyn-pdp-main has built-in sticky bar)
      delete tpl.sections.sticky_bar;

      // Clean order list
      tpl.order = tpl.order.filter(sec => sec !== 'hero' && sec !== 'sticky_bar');
      if (!tpl.order.includes('main')) tpl.order.unshift('main');
      if (!tpl.order.includes('shipping')) tpl.order.push('shipping');

      await putAsset(token, dt, JSON.stringify(tpl, null, 2));
    }
  }

  console.log('\n=== ALL 8 ACTIVE CUSTOM PRODUCT TEMPLATES UNIFIED SUCCESSFULLY ===');
}

run().catch(err => {
  console.error('Phase D Deployment Error:', err);
  process.exit(1);
});
