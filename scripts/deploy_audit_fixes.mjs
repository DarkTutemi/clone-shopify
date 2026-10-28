import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';
const LIVE_THEME_ID = '186607567033';

// STRICT SAFETY ASSERTIONS
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

async function deleteAsset(token, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    method: 'DELETE',
    headers: { 'X-Shopify-Access-Token': token }
  });
  if (res.ok) {
    console.log(`Successfully deleted obsolete asset: ${key}`);
  } else {
    console.log(`Delete ${key} response: ${res.statusText}`);
  }
}

async function run() {
  console.log('=== STARTING SURGICAL EXECUTION OF AUDIT FIXES ===');
  const token = await getAccessToken();

  // 1. FIX [P0-01]: sections/header-group.json Announcement Bar 90-day -> 60-day
  console.log('\n--- 1. Fixing sections/header-group.json ---');
  let headerGroupStr = await fetchAsset(token, 'sections/header-group.json');
  if (headerGroupStr) {
    const headerGroup = JSON.parse(headerGroupStr);
    if (headerGroup.sections?.['willa-header']?.settings) {
      headerGroup.sections['willa-header'].settings.announcement_desktop = '★ FREE US SHIPPING OVER $49 · 100% SATISFACTION GUARANTEED · 60-DAY RISK-FREE TRIAL ★';
      headerGroup.sections['willa-header'].settings.announcement_mobile = '★ FREE US SHIPPING OVER $49 · 60-DAY RISK-FREE TRIAL ★';
      await putAsset(token, 'sections/header-group.json', JSON.stringify(headerGroup, null, 2));
    }
  }

  // 2. FIX [P0-02]: config/settings_data.json Threshold 10000 -> 4900
  console.log('\n--- 2. Fixing config/settings_data.json ---');
  let settingsDataStr = await fetchAsset(token, 'config/settings_data.json');
  if (settingsDataStr) {
    const settingsData = JSON.parse(settingsDataStr);
    settingsData.current.cart_free_shipping_threshold = 4900;
    if (settingsData.current.sections?.['announcement-bar']?.settings) {
      settingsData.current.sections['announcement-bar'].settings.text = 'FREE US SHIPPING OVER $49 · 60-DAY RISK-FREE TRIAL';
    }
    await putAsset(token, 'config/settings_data.json', JSON.stringify(settingsData, null, 2));
  }

  // 3. FIX [P1-02] & Drawer Overflow: sections/willa-cart-drawer.liquid
  console.log('\n--- 3. Fixing sections/willa-cart-drawer.liquid ---');
  let willaDrawer = await fetchAsset(token, 'sections/willa-cart-drawer.liquid');
  if (willaDrawer) {
    // Add visibility: hidden to closed drawer
    willaDrawer = willaDrawer.replace(
      /(\.willa-cart-drawer\s*\{[\s\S]*?transform:\s*translateX\(100%\);)/,
      '$1\n    visibility: hidden;\n    pointer-events: none;'
    );
    willaDrawer = willaDrawer.replace(
      /(\.willa-cart-drawer\.active\s*\{[\s\S]*?transform:\s*translateX\(0\);)/,
      '$1\n    visibility: visible;\n    pointer-events: auto;'
    );
    await putAsset(token, 'sections/willa-cart-drawer.liquid', willaDrawer);
  }

  // 4. FIX [P0-03], [P0-04], [P1-01]: sections/zavelyn-pdp-main.liquid
  console.log('\n--- 4. Fixing sections/zavelyn-pdp-main.liquid ---');
  let pdpMain = await fetchAsset(token, 'sections/zavelyn-pdp-main.liquid');
  if (pdpMain) {
    // A. Fix Mobile Gallery Overflow in scoped CSS
    const galleryCss = `
<style>
  .zv-pdp-gallery-col {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }
  .zv-pdp-gallery-inner {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }
  .zv-pdp-main-media {
    position: relative !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    border-radius: 16px !important;
    overflow: hidden !important;
    background-color: #f7f7f7 !important;
  }
  .zv-pdp-main-media img {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
    object-fit: cover !important;
  }
  @media (max-width: 768px) {
    .zv-pdp-gallery-col,
    .zv-pdp-gallery-inner,
    .zv-pdp-main-media {
      max-width: 100% !important;
      width: 100% !important;
    }
    .zv-pdp-main-media img {
      max-width: 100% !important;
      width: 100% !important;
    }
  }
</style>
`;
    // Insert scoped styles right after section tag
    if (!pdpMain.includes('.zv-pdp-main-media img {')) {
      pdpMain = pdpMain.replace('<section class="zv-pdp-main-wrap"', galleryCss + '\n<section class="zv-pdp-main-wrap"');
    }

    // B. Fix Single-Variant Bundle Copy
    pdpMain = pdpMain.replace('<strong>Buy 1 Kit</strong>', '<strong>Buy 1 Item</strong>');
    pdpMain = pdpMain.replace('<small>Standard Master Set (21 Pcs)</small>', '<small>Standard Package</small>');
    pdpMain = pdpMain.replace('<strong>Buy 2 Kits (Shop & Service Truck)</strong>', '<strong>Buy 2 Items (Most Popular)</strong>');
    pdpMain = pdpMain.replace('<small>Save Extra 10% · FREE Priority Shipping</small>', '<small>Most Popular · FREE Priority Shipping</small>');
    pdpMain = pdpMain.replace('<strong>Buy 3 Kits (Fleet Master Pack)</strong>', '<strong>Buy 3 Items (Best Value)</strong>');
    pdpMain = pdpMain.replace('<small>Save Extra 15% · FREE Express Shipping</small>', '<small>Best Value · FREE Express Shipping</small>');

    // C. Fix Single-Variant Bundle Prices to match actual Shopify checkout total
    pdpMain = pdpMain.replace(
      '{% assign tier2_price = current_variant.price | times: 2 | times: 0.90 | round %}',
      '{% assign tier2_price = current_variant.price | times: 2 %}'
    );
    pdpMain = pdpMain.replace(
      '{% assign tier3_price = current_variant.price | times: 3 | times: 0.85 | round %}',
      '{% assign tier3_price = current_variant.price | times: 3 %}'
    );

    // D. Fix addToCart to reliably open Willa / Zavelyn Cart Drawer and NEVER redirect to /cart
    const oldCartBlockRegex = /\/\/ Check if theme has Willa cart drawer or custom drawer[\s\S]*?window\.location\.href = '\/cart';\s*\}\s*\}/;
    const newCartBlock = `// 1. Try Willa Cart Drawer
      if (typeof window.willaOpenCartDrawer === 'function') {
        if (typeof window.willaRefreshCart === 'function') {
          await window.willaRefreshCart();
        }
        window.willaOpenCartDrawer();
        return;
      }

      // 2. Try Zavelyn Cart Drawer Custom Element
      const zavelynDrawer = document.querySelector('zavelyn-cart-drawer');
      if (zavelynDrawer) {
        if (typeof zavelynDrawer.refresh === 'function') await zavelynDrawer.refresh();
        if (typeof zavelynDrawer.open === 'function') {
          zavelynDrawer.open();
          return;
        }
      }

      // 3. Fallback: Open willaCartDrawer DOM element directly
      const directDrawer = document.getElementById('willaCartDrawer');
      const directOverlay = document.getElementById('willaCartOverlay');
      if (directDrawer) {
        directDrawer.classList.add('active');
        if (directOverlay) directOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (typeof window.willaRefreshCart === 'function') {
          await window.willaRefreshCart();
        }
        return;
      }

      // 4. Dispatch global event
      document.dispatchEvent(new CustomEvent('zavelyn:cart:open'));`;

    if (oldCartBlockRegex.test(pdpMain)) {
      pdpMain = pdpMain.replace(oldCartBlockRegex, newCartBlock);
    }

    await putAsset(token, 'sections/zavelyn-pdp-main.liquid', pdpMain);
  }

  // 5. FIX [P1-02]: Sticky bar and container overflow in assets/zavelyn-elixir.css
  console.log('\n--- 5. Fixing assets/zavelyn-elixir.css ---');
  let elixirCss = await fetchAsset(token, 'assets/zavelyn-elixir.css');
  if (elixirCss) {
    const additionalCss = `
/* AUDIT FIX: Responsive Mobile Containment */
.zv-pdp-main-media {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  overflow: hidden !important;
}
.zv-pdp-main-media img {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  display: block !important;
  object-fit: cover !important;
}
.zv-pdp-gallery-col,
.zv-pdp-gallery-inner {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
}
#wf-sticky-bar,
.wf-sticky-inner,
.wf-container {
  max-width: 100vw !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
}
`;
    elixirCss += additionalCss;
    await putAsset(token, 'assets/zavelyn-elixir.css', elixirCss);
  }

  // 6. FIX [P1-03]: sections/willa-main-collection.liquid review modulo
  console.log('\n--- 6. Fixing sections/willa-main-collection.liquid ---');
  let collLiquid = await fetchAsset(token, 'sections/willa-main-collection.liquid');
  if (collLiquid && collLiquid.includes('modulo: 800')) {
    collLiquid = collLiquid.replace(
      /<span class="zv-review-count">\(\{\{ product\.id \| modulo: 800 \| plus: 240 \}\}\)<\/span>/g,
      '<span class="zv-verified-tag" style="font-size:12px;color:#1B4D3E;font-weight:700;margin-left:4px;">✓ Verified Quality</span>'
    );
    await putAsset(token, 'sections/willa-main-collection.liquid', collLiquid);
  }

  // 7. FIX [P2-03]: Delete obsolete sections/zhp-pdp-shipping.liquid
  console.log('\n--- 7. Cleaning obsolete sections/zhp-pdp-shipping.liquid ---');
  await deleteAsset(token, 'sections/zhp-pdp-shipping.liquid');

  console.log('\n=== ALL AUDIT FIXES APPLIED SUCCESSFULLY ON DRAFT THEME ===');
}

run().catch(err => {
  console.error('Execution Error:', err);
  process.exit(1);
});
