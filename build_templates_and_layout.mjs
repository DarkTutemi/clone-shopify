import fs from 'fs';
import path from 'path';

const THEME_DIR = 'h:/Shopify-Clone/Clone-earthlyderm';
const TEMPLATES_DIR = path.join(THEME_DIR, 'templates');
const SNIPPETS_DIR = path.join(THEME_DIR, 'snippets');
const LAYOUT_DIR = path.join(THEME_DIR, 'layout');

// 1. snippets/earthly-cart-drawer.liquid
const cartDrawerLiquid = `
<div class="earthly-cart-drawer-overlay" id="earthlyCartOverlay" onclick="closeEarthlyCartDrawer()"></div>
<div class="earthly-cart-drawer" id="earthlyCartDrawer">
  <div class="cart-drawer-header">
    <h3 class="cart-drawer-title">Your Cart</h3>
    <button class="cart-drawer-close" onclick="closeEarthlyCartDrawer()">&times;</button>
  </div>

  <div class="cart-timer-banner">
    <span>🔥 YOUR ORDER IS RESERVED FOR <strong id="drawerTimer">09:59</strong></span>
  </div>

  <div class="cart-drawer-items" id="cartDrawerItems">
    <div class="cart-empty-message">Loading your items...</div>
  </div>

  <div class="cart-drawer-footer" id="cartDrawerFooter">
    <div class="cart-subtotal-row">
      <span>Subtotal:</span>
      <span class="subtotal-val" id="drawerSubtotal">$0.00</span>
    </div>
    <p class="cart-shipping-note">Taxes &amp; shipping calculated at checkout. Free shipping over $50!</p>
    <a href="/checkout" class="cart-checkout-btn">PROCEED TO CHECKOUT ➔</a>
  </div>
</div>

<style>
.earthly-cart-drawer-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 3000;
  backdrop-filter: blur(2px);
}
.earthly-cart-drawer {
  position: fixed;
  top: 0;
  right: -420px;
  width: 380px;
  max-width: 90vw;
  height: 100%;
  background: #ffffff;
  z-index: 3001;
  box-shadow: -4px 0 25px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.earthly-cart-drawer.open {
  right: 0;
}
.earthly-cart-drawer-overlay.open {
  display: block;
}
.cart-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #edf2e8;
}
.cart-drawer-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  margin: 0;
  color: #111111;
}
.cart-drawer-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #555555;
}
.cart-timer-banner {
  background: #fbfdf9;
  border-bottom: 1px solid #e3ede0;
  color: #2c5801;
  text-align: center;
  padding: 10px 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 600;
}
.cart-drawer-items {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px 24px;
}
.cart-item-row {
  display: flex;
  gap: 14px;
  margin-bottom: 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid #f2f5ef;
}
.cart-item-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e7efe2;
}
.cart-item-details {
  flex-grow: 1;
}
.cart-item-title {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #111111;
  margin: 0 0 4px 0;
}
.cart-item-variant {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  color: #666666;
  margin-bottom: 6px;
}
.cart-item-price {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #2C5801;
}
.cart-drawer-footer {
  padding: 20px 24px;
  border-top: 1px solid #edf2e8;
  background: #fafcfa;
}
.cart-subtotal-row {
  display: flex;
  justify-content: space-between;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #111111;
  margin-bottom: 8px;
}
.cart-shipping-note {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  color: #777777;
  margin: 0 0 16px 0;
}
.cart-checkout-btn {
  display: block;
  width: 100%;
  text-align: center;
  background: #2C5801;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(44, 88, 1, 0.25);
  transition: background 0.2s ease;
}
.cart-checkout-btn:hover {
  background: #1e3d01;
}
</style>

<script>
function openEarthlyCartDrawer() {
  var d = document.getElementById('earthlyCartDrawer');
  var o = document.getElementById('earthlyCartOverlay');
  if (d && o) {
    d.classList.add('open');
    o.classList.add('open');
    loadDrawerCart();
  }
}

function closeEarthlyCartDrawer() {
  var d = document.getElementById('earthlyCartDrawer');
  var o = document.getElementById('earthlyCartOverlay');
  if (d && o) {
    d.classList.remove('open');
    o.classList.remove('open');
  }
}

async function loadDrawerCart() {
  try {
    var res = await fetch('/cart.js');
    var cart = await res.json();
    var itemsBox = document.getElementById('cartDrawerItems');
    var subEl = document.getElementById('drawerSubtotal');

    if (!itemsBox) return;

    if (cart.items.length === 0) {
      itemsBox.innerHTML = '<div style="text-align:center; padding:40px 0; color:#888; font-family:Poppins;">Your cart is empty.<br><br><a href="/collections/earthly-derm" style="color:#2C5801; font-weight:600;">Shop our handcrafted soaps ➔</a></div>';
      if (subEl) subEl.textContent = '$0.00';
      return;
    }

    var html = '';
    cart.items.forEach(function(item) {
      html += '<div class="cart-item-row">' +
        '<img src="' + item.image + '" class="cart-item-img">' +
        '<div class="cart-item-details">' +
          '<div class="cart-item-title">' + item.product_title + '</div>' +
          '<div class="cart-item-variant">' + (item.variant_title || '') + ' (Qty: ' + item.quantity + ')</div>' +
          '<div class="cart-item-price">' + (item.price / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) + '</div>' +
        '</div>' +
      '</div>';
    });
    itemsBox.innerHTML = html;
    if (subEl) {
      subEl.textContent = (cart.total_price / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
  } catch(e) {}
}
</script>
`;
fs.writeFileSync(path.join(SNIPPETS_DIR, 'earthly-cart-drawer.liquid'), cartDrawerLiquid.trim(), 'utf8');
console.log('✔ Wrote snippets/earthly-cart-drawer.liquid');

// 2. templates/index.json
const indexJson = {
  "sections": {
    "announcement": {
      "type": "earthly-announcement-bar",
      "settings": {}
    },
    "header": {
      "type": "earthly-header",
      "settings": {}
    },
    "hero": {
      "type": "earthly-hero",
      "settings": {}
    },
    "promo_bar": {
      "type": "earthly-promo-bar",
      "settings": {}
    },
    "featured_products": {
      "type": "earthly-featured-products",
      "settings": {}
    },
    "what_to_expect": {
      "type": "earthly-what-to-expect",
      "settings": {}
    },
    "glow_videos": {
      "type": "earthly-glow-videos",
      "settings": {}
    },
    "about_us": {
      "type": "earthly-about-us",
      "settings": {}
    },
    "faqs": {
      "type": "earthly-faqs",
      "settings": {}
    },
    "moneyback": {
      "type": "earthly-moneyback",
      "settings": {}
    },
    "reviews": {
      "type": "earthly-reviews",
      "settings": {}
    },
    "footer": {
      "type": "earthly-footer",
      "settings": {}
    }
  },
  "order": [
    "announcement",
    "header",
    "hero",
    "promo_bar",
    "featured_products",
    "what_to_expect",
    "glow_videos",
    "about_us",
    "faqs",
    "moneyback",
    "reviews",
    "footer"
  ]
};
fs.writeFileSync(path.join(TEMPLATES_DIR, 'index.json'), JSON.stringify(indexJson, null, 2), 'utf8');
console.log('✔ Wrote templates/index.json');

// 3. templates/product.json
const productJson = {
  "sections": {
    "announcement": {
      "type": "earthly-announcement-bar",
      "settings": {}
    },
    "header": {
      "type": "earthly-header",
      "settings": {}
    },
    "main": {
      "type": "earthly-pdp-main",
      "settings": {}
    },
    "faqs": {
      "type": "earthly-faqs",
      "settings": {}
    },
    "moneyback": {
      "type": "earthly-moneyback",
      "settings": {}
    },
    "reviews": {
      "type": "earthly-reviews",
      "settings": {}
    },
    "footer": {
      "type": "earthly-footer",
      "settings": {}
    }
  },
  "order": [
    "announcement",
    "header",
    "main",
    "faqs",
    "moneyback",
    "reviews",
    "footer"
  ]
};
fs.writeFileSync(path.join(TEMPLATES_DIR, 'product.json'), JSON.stringify(productJson, null, 2), 'utf8');
console.log('✔ Wrote templates/product.json');

// 4. templates/collection.json
const collectionJson = {
  "sections": {
    "announcement": {
      "type": "earthly-announcement-bar",
      "settings": {}
    },
    "header": {
      "type": "earthly-header",
      "settings": {}
    },
    "main": {
      "type": "earthly-collection",
      "settings": {}
    },
    "reviews": {
      "type": "earthly-reviews",
      "settings": {}
    },
    "footer": {
      "type": "earthly-footer",
      "settings": {}
    }
  },
  "order": [
    "announcement",
    "header",
    "main",
    "reviews",
    "footer"
  ]
};
fs.writeFileSync(path.join(TEMPLATES_DIR, 'collection.json'), JSON.stringify(collectionJson, null, 2), 'utf8');
console.log('✔ Wrote templates/collection.json');

// 5. layout/theme.liquid
const themeLiquid = `
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
  <link rel="canonical" href="{{ canonical_url }}">
  <link rel="icon" type="image/jpeg" href="//earthlyderm.com/cdn/shop/files/IG_HD_DP_2_32x32.jpg">

  <title>{{ page_title }} &ndash; {{ shop.name }}</title>
  {% if page_description %}
    <meta name="description" content="{{ page_description | escape }}">
  {% endif %}

  <!-- Google Fonts: Poppins, Playfair Display, Epilogue -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@500;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap" rel="stylesheet">

  <!-- Core Theme Stylesheet -->
  {{ 'theme.css' | asset_url | stylesheet_tag }}
  {{ 'section-hero-banner-2.css' | asset_url | stylesheet_tag }}
  {{ 'section-what-to-expect.css' | asset_url | stylesheet_tag }}
  {{ 'accordion-style-2.css' | asset_url | stylesheet_tag }}

  {{ content_for_header }}

  <style>
    body {
      font-family: 'Poppins', sans-serif;
      color: #1a1a1a;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3, h4, .serif-font {
      font-family: 'Playfair Display', serif;
    }
  </style>
</head>
<body>
  {{ content_for_layout }}

  {% render 'earthly-cart-drawer' %}

  {{ 'vendor.js' | asset_url | script_tag }}
  {{ 'theme.js' | asset_url | script_tag }}
</body>
</html>
`;
fs.writeFileSync(path.join(LAYOUT_DIR, 'theme.liquid'), themeLiquid.trim(), 'utf8');
console.log('✔ Wrote layout/theme.liquid');
