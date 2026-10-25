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
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (res.ok) {
    console.log(`  ✔ Successfully uploaded: ${key}`);
  } else {
    console.error(`  ✗ Failed to upload: ${key}`, JSON.stringify(data.errors || data));
  }
}

async function run() {
  console.log('--- FIXING CART REDIRECT ISSUE ---');
  const token = await getAccessToken();

  // 1. Fix templates/cart.json: Replace redirect-home with main-cart
  const newCartJson = JSON.stringify({
    "sections": {
      "main": {
        "type": "main-cart",
        "settings": {}
      }
    },
    "order": [
      "main"
    ]
  }, null, 2);

  fs.writeFileSync('Clone-willafarm/theme/templates/cart.json', newCartJson);
  await uploadThemeAsset(token, 'templates/cart.json', newCartJson);

  // 2. Fix layout/theme.liquid: Render willa-cart-drawer instead of cart-drawer
  let themeLiquid = fs.readFileSync('Clone-willafarm/theme/layout_theme_backup.liquid', 'utf8');
  const oldDrawerBlock = `{%- if settings.cart_type == 'drawer' -%}\n      {% section 'cart-drawer' %}\n    {%- endif -%}`;
  const newDrawerBlock = `{% section 'willa-cart-drawer' %}`;

  if (themeLiquid.includes(oldDrawerBlock)) {
    themeLiquid = themeLiquid.replace(oldDrawerBlock, newDrawerBlock);
  } else if (themeLiquid.includes("{% section 'cart-drawer' %}")) {
    themeLiquid = themeLiquid.replace("{% section 'cart-drawer' %}", newDrawerBlock);
  } else if (!themeLiquid.includes("willa-cart-drawer")) {
    themeLiquid = themeLiquid.replace("{% sections 'footer-group' %}", "{% sections 'footer-group' %}\n\n    {% section 'willa-cart-drawer' %}");
  }

  fs.mkdirSync('Clone-willafarm/theme/layout', { recursive: true });
  fs.writeFileSync('Clone-willafarm/theme/layout/theme.liquid', themeLiquid);
  await uploadThemeAsset(token, 'layout/theme.liquid', themeLiquid);

  // 3. Update sections/willa-cart-drawer.liquid to also intercept any a[href="/cart"]
  let willaDrawer = fs.readFileSync('Clone-willafarm/theme/sections/willa-cart-drawer.liquid', 'utf8');
  if (!willaDrawer.includes('willaCartGlobalListener')) {
    const interceptCode = `
  // Intercept any cart links/buttons across the store to open slide-out drawer
  function initWillaCartInterceptors() {
    document.querySelectorAll('a[href="/cart"], a[href="' + (window.Sakerplus?.routes?.cart_url || '/cart') + '"], .header__icon--cart, .cart-icon-bubble').forEach(el => {
      if (!el.dataset.willaCartBound) {
        el.dataset.willaCartBound = 'true';
        el.addEventListener('click', (e) => {
          e.preventDefault();
          if (typeof window.willaOpenCartDrawer === 'function') {
            window.willaOpenCartDrawer();
          }
        });
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWillaCartInterceptors);
  } else {
    initWillaCartInterceptors();
  }
  window.willaCartGlobalListener = true;
`;
    willaDrawer = willaDrawer.replace('</script>', interceptCode + '\n</script>');
    fs.writeFileSync('Clone-willafarm/theme/sections/willa-cart-drawer.liquid', willaDrawer);
    await uploadThemeAsset(token, 'sections/willa-cart-drawer.liquid', willaDrawer);
  }

  console.log('--- ALL CART FIXES APPLIED & UPLOADED ---');
}

run().catch(console.error);
