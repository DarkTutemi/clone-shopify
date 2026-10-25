import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
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

// 1. WILLA HEADER
function buildHeader() {
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,600&display=swap" rel="stylesheet">
{{ 'willafarm-theme.css' | asset_url | stylesheet_tag }}

<!-- Announcement Bar -->
<div class="willa-announcement-bar">
  <div class="willa-container willa-announcement-inner">
    <span class="desktop-only">{{ section.settings.announcement_desktop | default: '★ FREE US SHIPPING OVER $49 · 100% SATISFACTION GUARANTEED · 90-DAY RISK-FREE TRIAL ★' }}</span>
    <span class="mobile-only">{{ section.settings.announcement_mobile | default: '★ FREE US SHIPPING OVER $49 · 90-DAY TRIAL ★' }}</span>
  </div>
</div>

<!-- Header -->
<header class="willa-header-wrap" id="willaHeader">
  <div class="willa-container willa-header-inner">
    <!-- Mobile Hamburger Toggle -->
    <button type="button" class="willa-menu-btn" onclick="toggleWillaDrawer()" aria-label="Open menu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </button>

    <!-- Desktop Nav Links (Left) -->
    <nav class="willa-desktop-nav desktop-only">
      {% assign nav_count = 0 %}
      {% for block in section.blocks %}
        {% if block.type == 'nav_link' and block.settings.show_desktop %}
          {% assign nav_count = nav_count | plus: 1 %}
          <a href="{{ block.settings.link }}" {{ block.shopify_attributes }}>{{ block.settings.title }}</a>
        {% endif %}
      {% endfor %}
      {% if nav_count == 0 %}
        <a href="/">Home</a>
        <a href="/collections/best-sellers">Best Sellers</a>
        <a href="/collections/fence-and-farm">Fence &amp; Farm</a>
        <a href="/collections/power-tools">Power Tools</a>
        <a href="/collections/garden-and-outdoor">Garden &amp; Outdoor</a>
        <a href="/pages/track-order">Track Order</a>
      {% endif %}
    </nav>

    <!-- Brand Logo (Center) -->
    <div class="willa-logo-wrap">
      <a href="/" class="willa-logo-link">
        <span class="willa-logo-icon">🌿</span>
        <span class="willa-logo-text">{{ section.settings.logo_text | default: 'ZAVELYN' }}<sup class="willa-reg">®</sup></span>
      </a>
    </div>

    <!-- Right Icons: Search & Cart -->
    <div class="willa-header-actions">
      <a href="/search" class="willa-action-icon desktop-only" aria-label="Search">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </a>
      <button type="button" class="willa-cart-btn" onclick="openWillaCart()" aria-label="Cart">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <span class="willa-cart-count" id="willaCartCount">{{ cart.item_count }}</span>
      </button>
    </div>
  </div>
</header>

<!-- Mobile Navigation Drawer -->
<div class="willa-drawer-overlay" id="willaDrawerOverlay" onclick="toggleWillaDrawer()"></div>
<div class="willa-nav-drawer" id="willaNavDrawer">
  <div class="willa-drawer-header">
    <div class="willa-drawer-logo">
      <span>🌿</span>
      <strong>{{ section.settings.logo_text | default: 'ZAVELYN' }}<sup class="willa-reg">®</sup></strong>
    </div>
    <button type="button" class="willa-drawer-close" onclick="toggleWillaDrawer()" aria-label="Close menu">&times;</button>
  </div>

  <div class="willa-drawer-body">
    <ul class="willa-drawer-menu">
      {% assign drawer_count = 0 %}
      {% for block in section.blocks %}
        {% if block.type == 'nav_link' and block.settings.show_mobile %}
          {% assign drawer_count = drawer_count | plus: 1 %}
          <li {{ block.shopify_attributes }}>
            <a href="{{ block.settings.link }}">
              {% if block.settings.icon != blank %}<span class="menu-icon">{{ block.settings.icon }}</span>{% endif %}
              {{ block.settings.title }}
              {% if block.settings.badge != blank %}<span class="hot-badge">{{ block.settings.badge }}</span>{% endif %}
            </a>
          </li>
        {% endif %}
      {% endfor %}
      {% if drawer_count == 0 %}
        <li><a href="/"><span class="menu-icon">🏠</span> Home</a></li>
        <li><a href="/collections/best-sellers"><span class="menu-icon">🌟</span> Best Sellers <span class="hot-badge">HOT</span></a></li>
        <li><a href="/collections/fence-and-farm"><span class="menu-icon">🌾</span> Fence &amp; Farm Repair</a></li>
        <li><a href="/collections/power-tools"><span class="menu-icon">⚡</span> Power &amp; Precision Tools</a></li>
        <li><a href="/collections/garden-and-outdoor"><span class="menu-icon">🌿</span> Lawn, Garden &amp; Outdoor</a></li>
        <li><a href="/collections/home-and-workshop"><span class="menu-icon">🛠️</span> Home &amp; Workshop Solutions</a></li>
        <li><a href="/collections/all-products"><span class="menu-icon">🔍</span> Shop All Products</a></li>
        <li class="divider"></li>
        <li><a href="/pages/track-order"><span class="menu-icon">📦</span> Track Order</a></li>
        <li><a href="/policies/shipping-policy"><span class="menu-icon">🚚</span> Shipping &amp; Delivery</a></li>
        <li><a href="/policies/refund-policy"><span class="menu-icon">🛡️</span> 90-Day Money-Back Guarantee</a></li>
      {% endif %}
    </ul>

    <div class="willa-drawer-promo">
      <div class="promo-tag">{{ section.settings.promo_tag | default: 'LIMITED SPECIAL' }}</div>
      <h4>{{ section.settings.promo_title | default: 'Spring Tool & Repair Sale' }}</h4>
      <p>{{ section.settings.promo_desc | default: 'Save up to 50% OFF on our best-selling Zavelyn® farm & workshop innovations.' }}</p>
      <a href="{{ section.settings.promo_btn_link | default: '/collections/best-sellers' }}" class="willa-btn-primary" style="padding: 10px 18px; font-size: 13px;">{{ section.settings.promo_btn_text | default: 'SHOP 50% OFF NOW' }}</a>
    </div>
  </div>

  <div class="willa-drawer-footer">
    <p>Need help? Contact support: <br><strong>support@tryzavelyn.com</strong></p>
  </div>
</div>

<style>
  .willa-announcement-bar {
    background-color: #3b2b2f;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 8px 0;
    text-align: center;
  }
  .willa-announcement-inner {
    display: flex;
    justify-content: center;
    gap: 20px;
    align-items: center;
  }
  .mobile-only { display: none !important; }
  @media (max-width: 991px) {
    .desktop-only { display: none !important; }
    .mobile-only { display: inline-block !important; }
    .willa-menu-btn { display: flex !important; }
  }
  @media (max-width: 640px) {
    .willa-announcement-bar { font-size: 11px; padding: 6px 12px; height: 28px; line-height: 16px; box-sizing: border-box; }
    .willa-announcement-inner { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  }

  .willa-header-wrap {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    background-color: #faf7f4;
    border-bottom: 1px solid #e7e4df;
    z-index: 1000;
    transition: box-shadow 0.25s ease;
  }
  .willa-header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }
  @media (max-width: 640px) {
    .willa-header-inner { height: 54px; }
    .willa-logo-text { font-size: 20px !important; }
  }

  .willa-menu-btn {
    background: none;
    border: none;
    color: #231f20;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media (min-width: 992px) {
    .willa-menu-btn { display: none; }
  }

  .willa-desktop-nav {
    display: flex;
    gap: clamp(12px, 1.4vw, 20px);
    align-items: center;
    white-space: nowrap;
  }
  .willa-desktop-nav a {
    color: #231f20;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: color 0.2s;
  }
  .willa-desktop-nav a:hover {
    color: #8a2c13;
  }

  .willa-logo-wrap {
    display: flex;
    align-items: center;
  }
  .willa-logo-link {
    display: flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    color: #231f20;
  }
  .willa-logo-icon { font-size: 20px; }
  .willa-logo-text {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 900;
    font-size: 24px;
    letter-spacing: 2px;
    color: #231f20;
    position: relative;
  }
  .willa-reg {
    font-size: 11px;
    font-weight: 700;
    vertical-align: top;
    margin-left: 1px;
  }

  .willa-header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .willa-action-icon {
    color: #231f20;
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  .willa-cart-btn {
    background: none;
    border: none;
    color: #231f20;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    padding: 6px;
  }
  .willa-cart-count {
    position: absolute;
    top: -2px;
    right: -4px;
    background-color: #8a2c13;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Drawer */
  .willa-drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(35, 31, 32, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1999;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  .willa-drawer-overlay.active {
    opacity: 1;
    visibility: visible;
  }
  .willa-nav-drawer {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 320px;
    max-width: 85vw;
    background-color: #faf7f4;
    z-index: 2000;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  }
  .willa-nav-drawer.active {
    transform: translateX(0);
  }
  .willa-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-drawer-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 900;
    letter-spacing: 1.5px;
  }
  .willa-drawer-close {
    background: none;
    border: none;
    font-size: 26px;
    line-height: 1;
    cursor: pointer;
    color: #59514f;
    padding: 4px 8px;
  }
  .willa-drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
  }
  .willa-drawer-menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .willa-drawer-menu li {
    margin-bottom: 6px;
  }
  .willa-drawer-menu li.divider {
    height: 1px;
    background-color: #e7e4df;
    margin: 14px 0;
  }
  .willa-drawer-menu a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    color: #231f20;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .willa-drawer-menu a:hover {
    background-color: #ede8e1;
    color: #8a2c13;
  }
  .menu-icon { font-size: 16px; }
  .hot-badge {
    margin-left: auto;
    background-color: #8a2c13;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 8px;
  }
  .willa-drawer-promo {
    background-color: #ffffff;
    border: 1px solid #e7e4df;
    border-radius: 14px;
    padding: 16px;
    margin-top: 20px;
    box-shadow: 0 4px 12px rgba(59, 43, 47, 0.05);
  }
  .promo-tag {
    display: inline-block;
    background-color: #f7ede8;
    color: #8a2c13;
    font-size: 10px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 6px;
    margin-bottom: 8px;
  }
  .willa-drawer-promo h4 {
    margin: 0 0 6px 0;
    font-size: 14px;
    font-weight: 700;
  }
  .willa-drawer-promo p {
    font-size: 12px;
    color: #59514f;
    line-height: 1.4;
    margin: 0 0 12px 0;
  }
  .willa-drawer-footer {
    padding: 16px 20px;
    border-top: 1px solid #e7e4df;
    background-color: #faf7f4;
    font-size: 12px;
    color: #59514f;
  }
  .willa-drawer-footer p { margin: 0; }
  .willa-drawer-footer strong { color: #231f20; }
</style>

<script>
  function toggleWillaDrawer() {
    const drawer = document.getElementById('willaNavDrawer');
    const overlay = document.getElementById('willaDrawerOverlay');
    const isOpen = drawer.classList.contains('active');
    drawer.classList.toggle('active', !isOpen);
    overlay.classList.toggle('active', !isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  }

  function openWillaCart() {
    if (typeof window.willaOpenCartDrawer === 'function') {
      window.willaOpenCartDrawer();
    } else {
      window.location.href = '/cart';
    }
  }

  window.addEventListener('scroll', () => {
    const header = document.getElementById('willaHeader');
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 16px rgba(59, 43, 47, 0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
</script>

{% schema %}
{
  "name": "Willa Header",
  "settings": [
    {
      "type": "text",
      "id": "logo_text",
      "label": "Brand Logo Name",
      "default": "ZAVELYN"
    },
    {
      "type": "text",
      "id": "announcement_desktop",
      "label": "Announcement Bar Text (Desktop)",
      "default": "★ FREE US SHIPPING OVER $49 · 100% SATISFACTION GUARANTEED · 90-DAY RISK-FREE TRIAL ★"
    },
    {
      "type": "text",
      "id": "announcement_mobile",
      "label": "Announcement Bar Text (Mobile)",
      "default": "★ FREE US SHIPPING OVER $49 · 90-DAY TRIAL ★"
    },
    {
      "type": "header",
      "content": "Mobile Drawer Promo"
    },
    {
      "type": "text",
      "id": "promo_tag",
      "label": "Promo Tag",
      "default": "LIMITED SPECIAL"
    },
    {
      "type": "text",
      "id": "promo_title",
      "label": "Promo Title",
      "default": "Spring Tool & Repair Sale"
    },
    {
      "type": "textarea",
      "id": "promo_desc",
      "label": "Promo Description",
      "default": "Save up to 50% OFF on our best-selling Zavelyn® farm & workshop innovations."
    },
    {
      "type": "text",
      "id": "promo_btn_text",
      "label": "Promo Button Text",
      "default": "SHOP 50% OFF NOW"
    },
    {
      "type": "url",
      "id": "promo_btn_link",
      "label": "Promo Button Link"
    }
  ],
  "blocks": [
    {
      "type": "nav_link",
      "name": "Navigation Link",
      "settings": [
        {
          "type": "text",
          "id": "title",
          "label": "Link Title",
          "default": "Best Sellers"
        },
        {
          "type": "url",
          "id": "link",
          "label": "Link Target URL"
        },
        {
          "type": "text",
          "id": "icon",
          "label": "Drawer Icon Emoji (Mobile)",
          "default": "🌟"
        },
        {
          "type": "text",
          "id": "badge",
          "label": "Badge Text (e.g. HOT, NEW)",
          "default": ""
        },
        {
          "type": "checkbox",
          "id": "show_desktop",
          "label": "Show on Desktop Navbar",
          "default": true
        },
        {
          "type": "checkbox",
          "id": "show_mobile",
          "label": "Show in Mobile Drawer",
          "default": true
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Willa Header"
    }
  ]
}
{% endschema %}
`;
}

// 2. WILLA FAQ
function buildFaq() {
  return `<section class="willa-faq-section">
  <div class="willa-container">
    <div class="willa-section-header">
      <span class="willa-pill">{{ section.settings.pill_text | default: 'GOT QUESTIONS?' }}</span>
      <h2 class="willa-section-title willa-serif">{{ section.settings.heading | default: 'Frequently Asked Questions' }}</h2>
      <p class="willa-section-subtitle">{{ section.settings.subtitle | default: 'Everything you need to know about our products, shipping, and guarantees.' }}</p>
    </div>

    <div class="willa-faq-wrap">
      {% if section.blocks.size > 0 %}
        {% for block in section.blocks %}
          <details class="willa-faq-item" {% if forloop.first or block.settings.open_default %}open{% endif %} {{ block.shopify_attributes }}>
            <summary>
              <span>{{ block.settings.question }}</span>
              <span class="faq-icon">+</span>
            </summary>
            <div class="faq-content">
              <p>{{ block.settings.answer }}</p>
            </div>
          </details>
        {% endfor %}
      {% else %}
        <!-- Default Fallback FAQs -->
        <details class="willa-faq-item" open>
          <summary>
            <span>How fast is shipping, and where do orders ship from?</span>
            <span class="faq-icon">+</span>
          </summary>
          <div class="faq-content">
            <p>All orders are packed and dispatched directly from our regional US fulfillment centers. Standard delivery takes 3–5 business days. You will receive an automated tracking number via email the moment your package leaves our warehouse.</p>
          </div>
        </details>

        <details class="willa-faq-item">
          <summary>
            <span>What is the 90-Day Risk-Free Money-Back Guarantee?</span>
            <span class="faq-icon">+</span>
          </summary>
          <div class="faq-content">
            <p>We stand 100% behind the craftsmanship and durability of every tool we make. If you are not thoroughly satisfied with the performance of your purchase for any reason within 90 days of delivery, simply email us at support@tryzavelyn.com for a hassle-free refund.</p>
          </div>
        </details>

        <details class="willa-faq-item">
          <summary>
            <span>Are replacement parts or blades available for your tools?</span>
            <span class="faq-icon">+</span>
          </summary>
          <div class="faq-content">
            <p>Yes! We stock replacement blade packs, switch cords, extension accessories, and adapters for all our core tools. You can order them directly on our store or reach out to customer support anytime.</p>
          </div>
        </details>

        <details class="willa-faq-item">
          <summary>
            <span>Is checkout secure? What payment methods do you accept?</span>
            <span class="faq-icon">+</span>
          </summary>
          <div class="faq-content">
            <p>All transactions are 100% encrypted with bank-level 256-bit SSL security. We accept all major credit and debit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay.</p>
          </div>
        </details>
      {% endif %}
    </div>
  </div>
</section>

<style>
  .willa-faq-section {
    background-color: #ffffff;
    padding: 60px 0;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-faq-wrap {
    max-width: 800px;
    margin: 0 auto;
  }
  .willa-faq-item {
    border: 1px solid #e7e4df;
    border-radius: 14px;
    margin-bottom: 14px;
    background-color: #faf7f4;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
    overflow: hidden;
  }
  .willa-faq-item[open] {
    background-color: #ffffff;
    box-shadow: 0 4px 16px rgba(59, 43, 47, 0.05);
  }
  .willa-faq-item summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 22px;
    font-size: 16px;
    font-weight: 700;
    color: #231f20;
    cursor: pointer;
    list-style: none;
    user-select: none;
  }
  .willa-faq-item summary::-webkit-details-marker {
    display: none;
  }
  .faq-icon {
    font-size: 20px;
    color: #8a2c13;
    font-weight: 400;
    transition: transform 0.2s ease;
  }
  .willa-faq-item[open] .faq-icon {
    transform: rotate(45deg);
  }
  .faq-content {
    padding: 0 22px 20px 22px;
    font-size: 14px;
    line-height: 1.6;
    color: #59514f;
  }
  .faq-content p {
    margin: 0;
  }
</style>

{% schema %}
{
  "name": "Willa FAQ",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Badge Pill Text",
      "default": "GOT QUESTIONS?"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Frequently Asked Questions"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "Everything you need to know about our products, shipping, and guarantees."
    }
  ],
  "blocks": [
    {
      "type": "faq_item",
      "name": "FAQ Item",
      "settings": [
        {
          "type": "text",
          "id": "question",
          "label": "Question",
          "default": "How fast is shipping, and where do orders ship from?"
        },
        {
          "type": "textarea",
          "id": "answer",
          "label": "Answer",
          "default": "All orders are packed and dispatched directly from our regional US fulfillment centers."
        },
        {
          "type": "checkbox",
          "id": "open_default",
          "label": "Open by default",
          "default": false
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Willa FAQ"
    }
  ]
}
{% endschema %}
`;
}

// 3. WILLA FACTS (Value Pillars)
function buildFacts() {
  return `<section class="willa-facts-section">
  <div class="willa-container">
    <div class="willa-facts-grid">
      {% if section.blocks.size > 0 %}
        {% for block in section.blocks %}
          <div class="willa-fact-card" {{ block.shopify_attributes }}>
            <div class="fact-icon-wrap">{{ block.settings.icon }}</div>
            <h3>{{ block.settings.title }}</h3>
            <p>{{ block.settings.text }}</p>
          </div>
        {% endfor %}
      {% else %}
        <div class="willa-fact-card">
          <div class="fact-icon-wrap">🛡️</div>
          <h3>Industrial Durability</h3>
          <p>Built with heavy-duty alloys and reinforced polymers engineered for tough workshop and outdoor conditions.</p>
        </div>
        <div class="willa-fact-card">
          <div class="fact-icon-wrap">⚡</div>
          <h3>Precision Performance</h3>
          <p>Engineered to cut labor time in half with automated thermostats, ultrasonic vibrations, and laser guides.</p>
        </div>
        <div class="willa-fact-card">
          <div class="fact-icon-wrap">🔒</div>
          <h3>Certified Safety</h3>
          <p>Zero exposed flames or dangerous hot spots. Rigorously tested for maximum peace of mind on your homestead.</p>
        </div>
        <div class="willa-fact-card">
          <div class="fact-icon-wrap">🚚</div>
          <h3>Free US Delivery</h3>
          <p>Fast dispatch from US regional hubs. Enjoy free express tracked shipping on all orders over $49.</p>
        </div>
      {% endif %}
    </div>
  </div>
</section>

<style>
  .willa-facts-section {
    background-color: #faf7f4;
    padding: 36px 0;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-facts-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  .willa-fact-card {
    background-color: #ffffff;
    border: 1px solid #e7e4df;
    border-radius: 16px;
    padding: 24px 20px;
    box-shadow: 0 4px 14px rgba(59, 43, 47, 0.04);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .willa-fact-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(59, 43, 47, 0.08);
  }
  .fact-icon-wrap {
    font-size: 28px;
    margin-bottom: 12px;
  }
  .willa-fact-card h3 {
    font-size: 16px;
    font-weight: 700;
    color: #231f20;
    margin: 0 0 8px 0;
  }
  .willa-fact-card p {
    font-size: 13px;
    color: #59514f;
    line-height: 1.5;
    margin: 0;
  }
  @media (max-width: 991px) {
    .willa-facts-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }
  @media (max-width: 480px) {
    .willa-facts-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

{% schema %}
{
  "name": "Willa Value Pillars",
  "settings": [],
  "blocks": [
    {
      "type": "fact_card",
      "name": "Pillar Card",
      "settings": [
        {
          "type": "text",
          "id": "icon",
          "label": "Icon Emoji",
          "default": "🛡️"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Title",
          "default": "Industrial Durability"
        },
        {
          "type": "textarea",
          "id": "text",
          "label": "Description",
          "default": "Built with heavy-duty alloys and reinforced polymers engineered for tough workshop and outdoor conditions."
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Willa Value Pillars"
    }
  ]
}
{% endschema %}
`;
}

// 4. WILLA REVIEWS
function buildReviews() {
  return `<section class="willa-reviews-section">
  <div class="willa-container">
    <div class="willa-section-header">
      <span class="willa-pill willa-pill-green">{{ section.settings.pill_text | default: 'VERIFIED BUYERS' }}</span>
      <h2 class="willa-section-title willa-serif">{{ section.settings.heading | default: 'Loved by Over 100,000+ Customers' }}</h2>
      <div class="willa-stars-header">
        <div class="willa-stars">★★★★★</div>
        <span><strong>{{ section.settings.rating_text | default: '4.9 / 5.0 Rating' }}</strong> across 12,480+ authentic reviews</span>
      </div>
    </div>

    <div class="willa-reviews-grid">
      {% if section.blocks.size > 0 %}
        {% for block in section.blocks %}
          <div class="willa-rev-card" {{ block.shopify_attributes }}>
            <div class="willa-rev-header">
              <div>
                <strong>{{ block.settings.author }}</strong>
                {% if block.settings.verified %}<span class="willa-verified-badge">✔ Verified Buyer</span>{% endif %}
              </div>
              <div class="willa-stars">{{ block.settings.stars | default: '★★★★★' }}</div>
            </div>
            <h4>"{{ block.settings.title }}"</h4>
            <p>"{{ block.settings.review }}"</p>
            {% if block.settings.purchased_product != blank %}
              <span class="reviewed-product">Purchased: {{ block.settings.purchased_product }}</span>
            {% endif %}
          </div>
        {% endfor %}
      {% else %}
        <!-- Review 1 -->
        <div class="willa-rev-card">
          <div class="willa-rev-header">
            <div>
              <strong>Debra W.</strong>
              <span class="willa-verified-badge">✔ Verified Buyer</span>
            </div>
            <div class="willa-stars">★★★★★</div>
          </div>
          <h4>"Total game changer for our poultry barn!"</h4>
          <p>"Threw out my old red heat lamp the same day the Zavelyn® heating lamp arrived. After what happened to my neighbor's coop last winter, I wasn't taking any chances. It stays completely cool to the touch and baby chicks sleep soundly."</p>
          <span class="reviewed-product">Purchased: Zavelyn® Intelligent Livestock Heating Lamp</span>
        </div>

        <!-- Review 2 -->
        <div class="willa-rev-card">
          <div class="willa-rev-header">
            <div>
              <strong>Robert M.</strong>
              <span class="willa-verified-badge">✔ Verified Buyer</span>
            </div>
            <div class="willa-stars">★★★★★</div>
          </div>
          <h4>"Repaired 6 rotted posts in an afternoon"</h4>
          <p>"The Fence Post Repair Kit saved me thousands compared to replacing the whole fence line. Heavy steel, solid welds, drove straight into the ground. My fence is stiffer now than when it was originally installed 10 years ago."</p>
          <span class="reviewed-product">Purchased: Zavelyn® Fence Post Repair Kit</span>
        </div>

        <!-- Review 3 -->
        <div class="willa-rev-card">
          <div class="willa-rev-header">
            <div>
              <strong>Ethan Walker</strong>
              <span class="willa-verified-badge">✔ Verified Buyer</span>
            </div>
            <div class="willa-stars">★★★★★</div>
          </div>
          <h4>"Unbelievable precision for model crafting"</h4>
          <p>"The 40kHz Ultrasonic Precision Cutter slices through 3D print supports, dense acrylic, and resin without cracking or melting margins. Lightweight, balanced, and battery life is superb. A must-have for makers."</p>
          <span class="reviewed-product">Purchased: Zavelyn® 40kHz Ultrasonic Precision Cutter Kit</span>
        </div>
      {% endif %}
    </div>
  </div>
</section>

<style>
  .willa-reviews-section {
    background-color: #faf7f4;
    padding: 60px 0;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-stars-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
    font-size: 14px;
    color: #59514f;
  }
  .willa-reviews-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .willa-rev-card {
    background: #ffffff;
    border: 1px solid #e7e4df;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 16px rgba(59, 43, 47, 0.04);
    display: flex;
    flex-direction: column;
  }
  .willa-rev-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  .willa-rev-header strong {
    display: block;
    font-size: 14px;
    color: #231f20;
  }
  .willa-verified-badge {
    color: #2e7d32;
    font-size: 11px;
    font-weight: 700;
  }
  .willa-rev-card h4 {
    font-size: 15px;
    font-weight: 700;
    color: #231f20;
    margin: 0 0 8px 0;
  }
  .willa-rev-card p {
    font-size: 13px;
    color: #59514f;
    line-height: 1.6;
    margin: 0 0 16px 0;
    flex: 1;
  }
  .reviewed-product {
    font-size: 11px;
    font-weight: 600;
    color: #8a2c13;
    background-color: #f7ede8;
    padding: 4px 10px;
    border-radius: 6px;
    display: inline-block;
    align-self: flex-start;
  }
  @media (max-width: 991px) {
    .willa-reviews-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
</style>

{% schema %}
{
  "name": "Willa Customer Reviews",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Pill Badge Text",
      "default": "VERIFIED BUYERS"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Loved by Over 100,000+ Customers"
    },
    {
      "type": "text",
      "id": "rating_text",
      "label": "Rating Text",
      "default": "4.9 / 5.0 Rating"
    }
  ],
  "blocks": [
    {
      "type": "review_card",
      "name": "Customer Review",
      "settings": [
        {
          "type": "text",
          "id": "author",
          "label": "Customer Name",
          "default": "Debra W."
        },
        {
          "type": "checkbox",
          "id": "verified",
          "label": "Verified Buyer Badge",
          "default": true
        },
        {
          "type": "text",
          "id": "stars",
          "label": "Star Rating",
          "default": "★★★★★"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Review Headline",
          "default": "Total game changer for our poultry barn!"
        },
        {
          "type": "textarea",
          "id": "review",
          "label": "Review Body",
          "default": "Threw out my old red heat lamp the same day the Zavelyn® heating lamp arrived."
        },
        {
          "type": "text",
          "id": "purchased_product",
          "label": "Purchased Product Name",
          "default": "Zavelyn® Intelligent Livestock Heating Lamp"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Willa Customer Reviews"
    }
  ]
}
{% endschema %}
`;
}

// 5. WILLA STEPS
function buildSteps() {
  return `<section class="willa-steps-section">
  <div class="willa-container">
    <div class="willa-section-header">
      <span class="willa-pill">{{ section.settings.pill_text | default: 'SIMPLE & RELIABLE' }}</span>
      <h2 class="willa-section-title willa-serif">{{ section.settings.heading | default: 'How Zavelyn® Works' }}</h2>
      <p class="willa-section-subtitle">{{ section.settings.subtitle | default: 'We strip away the complexity of traditional hardware so you get fast, professional results.' }}</p>
    </div>

    <div class="willa-steps-grid">
      {% if section.blocks.size > 0 %}
        {% for block in section.blocks %}
          <div class="willa-step-card" {{ block.shopify_attributes }}>
            <div class="step-number">{{ block.settings.step_number }}</div>
            <h3>{{ block.settings.title }}</h3>
            <p>{{ block.settings.text }}</p>
          </div>
        {% endfor %}
      {% else %}
        <div class="willa-step-card">
          <div class="step-number">01</div>
          <h3>Select Your Solution</h3>
          <p>Choose from our specialized toolkits engineered specifically for fence repair, livestock care, or precision crafting.</p>
        </div>

        <div class="willa-step-card">
          <div class="step-number">02</div>
          <h3>Quick Plug-and-Play Setup</h3>
          <p>All kits include standard US cords, mounting hardware, or screw bases. Ready to run right out of the box with zero guesswork.</p>
        </div>

        <div class="willa-step-card">
          <div class="step-number">03</div>
          <h3>Total Peace of Mind</h3>
          <p>Every product is backed by our 90-Day Money-Back Guarantee and dedicated customer care team ready to help 7 days a week.</p>
        </div>
      {% endif %}
    </div>
  </div>
</section>

<style>
  .willa-steps-section {
    background-color: #faf7f4;
    padding: 60px 0;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }
  .willa-step-card {
    background: #ffffff;
    border: 1px solid #e7e4df;
    border-radius: 20px;
    padding: 30px 24px;
    box-shadow: 0 4px 16px rgba(59, 43, 47, 0.04);
    position: relative;
  }
  .step-number {
    font-family: 'Playfair Display', serif;
    font-size: 38px;
    font-weight: 900;
    color: #8a2c13;
    line-height: 1;
    margin-bottom: 14px;
    opacity: 0.9;
  }
  .willa-step-card h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    font-weight: 700;
    color: #231f20;
  }
  .willa-step-card p {
    margin: 0;
    font-size: 14px;
    color: #59514f;
    line-height: 1.6;
  }
  @media (max-width: 768px) {
    .willa-steps-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
</style>

{% schema %}
{
  "name": "Willa Process Steps",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Pill Badge Text",
      "default": "SIMPLE & RELIABLE"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "How Zavelyn® Works"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "We strip away the complexity of traditional hardware so you get fast, professional results."
    }
  ],
  "blocks": [
    {
      "type": "step_card",
      "name": "Step Card",
      "settings": [
        {
          "type": "text",
          "id": "step_number",
          "label": "Step Number (e.g. 01)",
          "default": "01"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Step Title",
          "default": "Select Your Solution"
        },
        {
          "type": "textarea",
          "id": "text",
          "label": "Step Description",
          "default": "Choose from our specialized toolkits engineered specifically for fence repair, livestock care, or precision crafting."
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Willa Process Steps"
    }
  ]
}
{% endschema %}
`;
}

// 6. WILLA COMPARISON
function buildComparison() {
  return `<section class="willa-comp-section">
  <div class="willa-container">
    <div class="willa-section-header">
      <span class="willa-pill">{{ section.settings.pill_text | default: 'THE ZAVELYN® DIFFERENCE' }}</span>
      <h2 class="willa-section-title willa-serif">{{ section.settings.heading | default: 'Why Choose Zavelyn®' }}</h2>
      <p class="willa-section-subtitle">{{ section.settings.subtitle | default: 'See how our purpose-engineered tools compare to ordinary generic alternatives.' }}</p>
    </div>

    <div class="willa-table-card">
      <table class="willa-comp-table">
        <thead>
          <tr>
            <th>Key Advantage</th>
            <th class="willa-col-highlight">{{ section.settings.brand_header | default: 'Zavelyn® Innovations' }}</th>
            <th>{{ section.settings.competitor_header | default: 'Generic Hardware' }}</th>
          </tr>
        </thead>
        <tbody>
          {% if section.blocks.size > 0 %}
            {% for block in section.blocks %}
              <tr {{ block.shopify_attributes }}>
                <td><strong>{{ block.settings.title }}</strong></td>
                <td class="willa-col-highlight"><span class="willa-check">✔ {{ block.settings.brand_val }}</span></td>
                <td class="willa-cross">✖ {{ block.settings.competitor_val }}</td>
              </tr>
            {% endfor %}
          {% else %}
            <tr>
              <td><strong>Safety Standards</strong></td>
              <td class="willa-col-highlight"><span class="willa-check">✔ 100% Certified</span> (Sealed &amp; tested)</td>
              <td class="willa-cross">✖ High risk &amp; fragile parts</td>
            </tr>
            <tr>
              <td><strong>Auto-Regulation Tech</strong></td>
              <td class="willa-col-highlight"><span class="willa-check">✔ Smart Digital Microchips</span></td>
              <td class="willa-cross">✖ Manual guesswork</td>
            </tr>
            <tr>
              <td><strong>Build Durability</strong></td>
              <td class="willa-col-highlight"><span class="willa-check">✔ Heavy-duty reinforced alloys</span></td>
              <td class="willa-cross">✖ Cheap thin plastic</td>
            </tr>
            <tr>
              <td><strong>Risk-Free Guarantee</strong></td>
              <td class="willa-col-highlight"><span class="willa-check">✔ 90-Day Money-Back Trial</span></td>
              <td class="willa-cross">✖ 14-day restrictive terms</td>
            </tr>
            <tr>
              <td><strong>Customer Support</strong></td>
              <td class="willa-col-highlight"><span class="willa-check">✔ Dedicated US support 7 days/wk</span></td>
              <td class="willa-cross">✖ Automated bot replies</td>
            </tr>
          {% endif %}
        </tbody>
      </table>
    </div>
  </div>
</section>

<style>
  .willa-comp-section {
    background-color: #ffffff;
    padding: 60px 0;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-table-card {
    background-color: #faf7f4;
    border: 1px solid #e7e4df;
    border-radius: 20px;
    overflow-x: auto;
    box-shadow: 0 4px 16px rgba(59, 43, 47, 0.04);
  }
  .willa-comp-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }
  .willa-comp-table th,
  .willa-comp-table td {
    padding: 18px 24px;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-comp-table th {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #59514f;
    background-color: #ede8e1;
  }
  .willa-col-highlight {
    background-color: #f7ede8;
    color: #8a2c13 !important;
    font-weight: 700;
  }
  .willa-check {
    color: #2e7d32;
    font-weight: 700;
  }
  .willa-cross {
    color: #8c8582;
  }
</style>

{% schema %}
{
  "name": "Willa Comparison Table",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Pill Badge Text",
      "default": "THE ZAVELYN® DIFFERENCE"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Why Choose Zavelyn®"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "See how our purpose-engineered tools compare to ordinary generic alternatives."
    },
    {
      "type": "text",
      "id": "brand_header",
      "label": "Brand Column Header",
      "default": "Zavelyn® Innovations"
    },
    {
      "type": "text",
      "id": "competitor_header",
      "label": "Competitor Column Header",
      "default": "Generic Hardware"
    }
  ],
  "blocks": [
    {
      "type": "comparison_row",
      "name": "Comparison Row",
      "settings": [
        {
          "type": "text",
          "id": "title",
          "label": "Feature Name",
          "default": "Safety Standards"
        },
        {
          "type": "text",
          "id": "brand_val",
          "label": "Our Advantage Text",
          "default": "100% Certified (Sealed & tested)"
        },
        {
          "type": "text",
          "id": "competitor_val",
          "label": "Generic Hardware Text",
          "default": "High risk & fragile parts"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Willa Comparison Table"
    }
  ]
}
{% endschema %}
`;
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token. Rebuilding sections with schema & blocks...');

  // Build files locally
  fs.writeFileSync('Clone-willafarm/theme/sections/willa-header.liquid', buildHeader(), 'utf-8');
  fs.writeFileSync('Clone-willafarm/theme/sections/willa-faq.liquid', buildFaq(), 'utf-8');
  fs.writeFileSync('Clone-willafarm/theme/sections/willa-facts.liquid', buildFacts(), 'utf-8');
  fs.writeFileSync('Clone-willafarm/theme/sections/willa-reviews.liquid', buildReviews(), 'utf-8');
  fs.writeFileSync('Clone-willafarm/theme/sections/willa-steps.liquid', buildSteps(), 'utf-8');
  fs.writeFileSync('Clone-willafarm/theme/sections/willa-comparison.liquid', buildComparison(), 'utf-8');

  console.log('Saved section files locally. Uploading to active Shopify theme...');

  await uploadThemeAsset(token, 'sections/willa-header.liquid', buildHeader());
  await uploadThemeAsset(token, 'sections/willa-faq.liquid', buildFaq());
  await uploadThemeAsset(token, 'sections/willa-facts.liquid', buildFacts());
  await uploadThemeAsset(token, 'sections/willa-reviews.liquid', buildReviews());
  await uploadThemeAsset(token, 'sections/willa-steps.liquid', buildSteps());
  await uploadThemeAsset(token, 'sections/willa-comparison.liquid', buildComparison());

  // Configure header-group.json with default blocks
  const headerGroup = {
    name: "Header group",
    type: "header",
    sections: {
      "willa-header": {
        type: "willa-header",
        blocks: {
          "nav_home": { type: "nav_link", settings: { title: "Home", link: "/", icon: "🏠", show_desktop: true, show_mobile: true } },
          "nav_best": { type: "nav_link", settings: { title: "Best Sellers", link: "/collections/best-sellers", icon: "🌟", badge: "HOT", show_desktop: true, show_mobile: true } },
          "nav_fence": { type: "nav_link", settings: { title: "Fence & Farm", link: "/collections/fence-and-farm", icon: "🌾", show_desktop: true, show_mobile: true } },
          "nav_power": { type: "nav_link", settings: { title: "Power Tools", link: "/collections/power-tools", icon: "⚡", show_desktop: true, show_mobile: true } },
          "nav_garden": { type: "nav_link", settings: { title: "Garden & Outdoor", link: "/collections/garden-and-outdoor", icon: "🌿", show_desktop: true, show_mobile: true } },
          "nav_track": { type: "nav_link", settings: { title: "Track Order", link: "/pages/track-order", icon: "📦", show_desktop: true, show_mobile: true } }
        },
        block_order: ["nav_home", "nav_best", "nav_fence", "nav_power", "nav_garden", "nav_track"],
        settings: {
          logo_text: "ZAVELYN"
        }
      }
    },
    order: ["willa-header"]
  };
  await uploadThemeAsset(token, 'sections/header-group.json', JSON.stringify(headerGroup, null, 2));

  // Configure index.json with blocks for FAQ, Facts, Reviews, Steps, Comparison
  const indexJson = {
    sections: {
      "hero": {
        type: "willa-hero",
        settings: {}
      },
      "facts": {
        type: "willa-facts",
        blocks: {
          "fact_1": { type: "fact_card", settings: { icon: "🛡️", title: "Industrial Durability", text: "Built with heavy-duty alloys and reinforced polymers engineered for tough workshop and outdoor conditions." } },
          "fact_2": { type: "fact_card", settings: { icon: "⚡", title: "Precision Performance", text: "Engineered to cut labor time in half with automated thermostats, ultrasonic vibrations, and laser guides." } },
          "fact_3": { type: "fact_card", settings: { icon: "🔒", title: "Certified Safety", text: "Zero exposed flames or dangerous hot spots. Rigorously tested for maximum peace of mind on your homestead." } },
          "fact_4": { type: "fact_card", settings: { icon: "🚚", title: "Free US Delivery", text: "Fast dispatch from US regional hubs. Enjoy free express tracked shipping on all orders over $49." } }
        },
        block_order: ["fact_1", "fact_2", "fact_3", "fact_4"],
        settings: {}
      },
      "featured_offer": {
        type: "willa-featured-product",
        settings: {}
      },
      "categories": {
        type: "willa-collections-grid",
        settings: {}
      },
      "best_sellers": {
        type: "willa-featured-collection",
        settings: {}
      },
      "steps": {
        type: "willa-steps",
        blocks: {
          "step_1": { type: "step_card", settings: { step_number: "01", title: "Select Your Solution", text: "Choose from our specialized toolkits engineered specifically for fence repair, livestock care, or precision crafting." } },
          "step_2": { type: "step_card", settings: { step_number: "02", title: "Quick Plug-and-Play Setup", text: "All kits include standard US cords, mounting hardware, or screw bases. Ready to run right out of the box with zero guesswork." } },
          "step_3": { type: "step_card", settings: { step_number: "03", title: "Total Peace of Mind", text: "Every product is backed by our 90-Day Money-Back Guarantee and dedicated customer care team ready to help 7 days a week." } }
        },
        block_order: ["step_1", "step_2", "step_3"],
        settings: {}
      },
      "comparison": {
        type: "willa-comparison",
        blocks: {
          "comp_1": { type: "comparison_row", settings: { title: "Safety Standards", brand_val: "100% Certified (Sealed & tested)", competitor_val: "High risk & fragile parts" } },
          "comp_2": { type: "comparison_row", settings: { title: "Auto-Regulation Tech", brand_val: "Smart Digital Microchips", competitor_val: "Manual guesswork" } },
          "comp_3": { type: "comparison_row", settings: { title: "Build Durability", brand_val: "Heavy-duty reinforced alloys", competitor_val: "Cheap thin plastic" } },
          "comp_4": { type: "comparison_row", settings: { title: "Risk-Free Guarantee", brand_val: "90-Day Money-Back Trial", competitor_val: "14-day restrictive terms" } },
          "comp_5": { type: "comparison_row", settings: { title: "Customer Support", brand_val: "Dedicated US support 7 days/wk", competitor_val: "Automated bot replies" } }
        },
        block_order: ["comp_1", "comp_2", "comp_3", "comp_4", "comp_5"],
        settings: {}
      },
      "reviews": {
        type: "willa-reviews",
        blocks: {
          "rev_1": { type: "review_card", settings: { author: "Debra W.", verified: true, stars: "★★★★★", title: "Total game changer for our poultry barn!", review: "Threw out my old red heat lamp the same day the Zavelyn® heating lamp arrived. It stays completely cool to the touch and baby chicks sleep soundly.", purchased_product: "Zavelyn® Intelligent Livestock Heating Lamp" } },
          "rev_2": { type: "review_card", settings: { author: "Robert M.", verified: true, stars: "★★★★★", title: "Repaired 6 rotted posts in an afternoon", review: "The Fence Post Repair Kit saved me thousands compared to replacing the whole fence line. Heavy steel, solid welds, drove straight into the ground.", purchased_product: "Zavelyn® Fence Post Repair Kit" } },
          "rev_3": { type: "review_card", settings: { author: "Ethan Walker", verified: true, stars: "★★★★★", title: "Unbelievable precision for model crafting", review: "The 40kHz Ultrasonic Precision Cutter slices through 3D print supports, dense acrylic, and resin without cracking or melting margins.", purchased_product: "Zavelyn® 40kHz Ultrasonic Precision Cutter Kit" } }
        },
        block_order: ["rev_1", "rev_2", "rev_3"],
        settings: {}
      },
      "faq": {
        type: "willa-faq",
        blocks: {
          "faq_1": { type: "faq_item", settings: { question: "How fast is shipping, and where do orders ship from?", answer: "All orders are packed and dispatched directly from our regional US fulfillment centers. Standard delivery takes 3–5 business days. You will receive an automated tracking number via email the moment your package leaves our warehouse.", open_default: true } },
          "faq_2": { type: "faq_item", settings: { question: "What is the 90-Day Risk-Free Money-Back Guarantee?", answer: "We stand 100% behind the craftsmanship and durability of every tool we make. If you are not thoroughly satisfied with the performance of your purchase for any reason within 90 days of delivery, simply email us at support@tryzavelyn.com for a hassle-free refund.", open_default: false } },
          "faq_3": { type: "faq_item", settings: { question: "Are replacement parts or blades available for your tools?", answer: "Yes! We stock replacement blade packs, switch cords, extension accessories, and adapters for all our core tools. You can order them directly on our store or reach out to customer support anytime.", open_default: false } },
          "faq_4": { type: "faq_item", settings: { question: "Is checkout secure? What payment methods do you accept?", answer: "All transactions are 100% encrypted with bank-level 256-bit SSL security. We accept all major credit and debit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay.", open_default: false } }
        },
        block_order: ["faq_1", "faq_2", "faq_3", "faq_4"],
        settings: {}
      }
    },
    order: [
      "hero",
      "facts",
      "featured_offer",
      "categories",
      "best_sellers",
      "steps",
      "comparison",
      "reviews",
      "faq"
    ]
  };
  await uploadThemeAsset(token, 'templates/index.json', JSON.stringify(indexJson, null, 2));

  console.log('✔ All schemas and blocks applied and deployed to Shopify successfully!');
}

main().catch(console.error);
