import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

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

// -------------------------------------------------------------
// 1. WILLA HEADER
// -------------------------------------------------------------
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
    font-size: 24px;
    font-weight: 900;
    letter-spacing: 2px;
    color: #231f20;
  }
  .willa-reg {
    font-size: 11px;
    vertical-align: super;
    line-height: 0;
    color: #8a2c13;
    font-weight: 700;
    margin-left: 1px;
  }

  .willa-header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .willa-action-icon, .willa-cart-btn {
    background: none;
    border: none;
    color: #231f20;
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    position: relative;
    transition: color 0.2s;
  }
  .willa-action-icon:hover, .willa-cart-btn:hover {
    color: #8a2c13;
  }
  .willa-cart-count {
    position: absolute;
    top: 0;
    right: 0;
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

  /* Drawer Overlay & Menu */
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
    if (drawer && overlay) {
      const isOpen = drawer.classList.contains('active');
      if (isOpen) {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  }

  function openWillaCart() {
    if (typeof window.willaOpenCartDrawer === 'function') {
      window.willaOpenCartDrawer();
    } else {
      window.location.href = '/cart';
    }
  }

  window.addEventListener('scroll', function() {
    const header = document.getElementById('willaHeader');
    if (!header) return;
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
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
          "label": "Emoji Icon",
          "default": "🌟"
        },
        {
          "type": "text",
          "id": "badge",
          "label": "Hot Badge (Optional)"
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

// -------------------------------------------------------------
// 2. WILLA HERO
// -------------------------------------------------------------
function buildHero() {
  return `<section class="willa-hero-section">
  <div class="willa-container willa-hero-inner">
    <!-- Left Column: Compelling Copy & Immediate Mobile CTA -->
    <div class="willa-hero-content">
      <div class="willa-hero-badge">
        {% if section.settings.pill_1 != blank %}<span class="willa-pill">{{ section.settings.pill_1 }}</span>{% endif %}
        {% if section.settings.pill_2 != blank %}<span class="willa-pill willa-pill-green">{{ section.settings.pill_2 }}</span>{% endif %}
      </div>

      <h1 class="willa-hero-title willa-serif">
        {{ section.settings.heading | default: 'Engineered for Heavy Duty. Built for Everyday Reliability.' }}
      </h1>

      <p class="willa-hero-desc">
        {{ section.settings.desc | default: 'Stop fighting broken equipment and low-grade tools. Zavelyn® brings you industrial-grade farm repair kits, precision ultrasonic tools, and durable homestead solutions trusted by over 100,000+ customers.' }}
      </p>

      <!-- Proof Row -->
      <div class="willa-hero-proof">
        <div class="willa-stars">{{ section.settings.rating_stars | default: '★★★★★' }}</div>
        <span class="proof-text">{{ section.settings.rating_text | default: '<strong>4.9/5.0</strong> based on 12,480+ verified reviews' }}</span>
      </div>

      <!-- Main Action Buttons -->
      <div class="willa-hero-cta-wrap">
        {% if section.settings.btn_primary_text != blank %}
          <a href="{{ section.settings.btn_primary_link | default: '/collections/best-sellers' }}" class="willa-btn-primary">
            {{ section.settings.btn_primary_text }}
          </a>
        {% endif %}
        {% if section.settings.btn_secondary_text != blank %}
          <a href="{{ section.settings.btn_secondary_link | default: '/collections/fence-and-farm' }}" class="willa-btn-secondary">
            {{ section.settings.btn_secondary_text }}
          </a>
        {% endif %}
      </div>

      <!-- Trust Badges Under CTA -->
      <div class="willa-hero-guarantees">
        {% if section.blocks.size > 0 %}
          {% for block in section.blocks %}
            <div class="guarantee-item" {{ block.shopify_attributes }}>
              <span>{{ block.settings.icon }}</span> <strong>{{ block.settings.highlight }}</strong> {{ block.settings.text }}
            </div>
          {% endfor %}
        {% else %}
          <div class="guarantee-item">
            <span>🛡️</span> <strong>90-Day</strong> Risk-Free Trial
          </div>
          <div class="guarantee-item">
            <span>🚚</span> <strong>Free Shipping</strong> Over $49
          </div>
          <div class="guarantee-item">
            <span>🇺🇸</span> <strong>Fast US</strong> Warehouse Dispatch
          </div>
        {% endif %}
      </div>
    </div>

    <!-- Right Column: Visual Product Showcase -->
    <div class="willa-hero-visual">
      <div class="willa-hero-image-card">
        <img src="{{ section.settings.hero_image_url | default: 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg' }}" alt="{{ section.settings.heading | escape }}" class="willa-hero-main-img" loading="eager" fetchpriority="high">
        
        <!-- Floating Conversion Pill -->
        <div class="willa-hero-floating-tag">
          <div class="floating-tag-icon">{{ section.settings.floating_icon | default: '🔥' }}</div>
          <div class="floating-tag-info">
            <strong>{{ section.settings.floating_title | default: 'Zavelyn® Innovation' }}</strong>
            <span>{{ section.settings.floating_subtitle | default: 'Up to 50% Off Today' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .willa-hero-section {
    background-color: #faf7f4;
    padding-top: 36px;
    padding-bottom: 50px;
    border-bottom: 1px solid #e7e4df;
    overflow: hidden;
  }
  .willa-hero-inner {
    display: flex;
    align-items: center;
    gap: 48px;
  }
  .willa-hero-content {
    flex: 1 1 55%;
    max-width: 620px;
  }
  .willa-hero-visual {
    flex: 1 1 45%;
    display: flex;
    justify-content: center;
  }

  .willa-hero-badge {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .willa-hero-title {
    font-size: 42px;
    font-weight: 900;
    line-height: 1.18;
    color: #231f20;
    margin: 0 0 16px 0;
    letter-spacing: -0.5px;
  }
  .willa-hero-desc {
    font-size: 16px;
    color: #59514f;
    line-height: 1.6;
    margin: 0 0 20px 0;
  }

  .willa-hero-proof {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
    background: #ffffff;
    padding: 8px 16px;
    border-radius: 9999px;
    display: inline-flex;
    border: 1px solid #e7e4df;
  }
  .proof-text {
    font-size: 13px;
    color: #231f20;
  }

  .willa-hero-cta-wrap {
    display: flex;
    gap: 14px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .willa-hero-guarantees {
    display: flex;
    gap: 20px;
    font-size: 12px;
    color: #59514f;
    flex-wrap: wrap;
    border-top: 1px solid #e7e4df;
    padding-top: 16px;
  }
  .guarantee-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .willa-hero-image-card {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 16px 40px rgba(59, 43, 47, 0.12);
    border: 1px solid #e7e4df;
    background: #ffffff;
    width: 100%;
    max-width: 480px;
  }
  .willa-hero-main-img {
    width: 100%;
    height: auto;
    display: block;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  .willa-hero-floating-tag {
    position: absolute;
    bottom: 16px;
    left: 16px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border: 1px solid #e7e4df;
    border-radius: 14px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }
  .floating-tag-icon { font-size: 20px; }
  .floating-tag-info {
    display: flex;
    flex-direction: column;
    font-size: 12px;
  }
  .floating-tag-info strong {
    color: #231f20;
    font-size: 13px;
  }
  .floating-tag-info span {
    color: #8a2c13;
    font-weight: 700;
  }

  @media (max-width: 991px) {
    .willa-hero-inner {
      flex-direction: column;
      gap: 22px;
    }
    .willa-hero-content {
      text-align: left;
      max-width: 100%;
    }
    .willa-hero-title {
      font-size: clamp(26px, 7vw, 32px);
      line-height: 1.15;
    }
    .willa-hero-desc {
      font-size: 14px;
    }
    .willa-hero-cta-wrap {
      flex-direction: column;
      gap: 10px;
    }
    .willa-hero-cta-wrap a {
      width: 100%;
      box-sizing: border-box;
      padding: 15px 20px !important;
      font-size: 14px !important;
      text-align: center;
    }
    .willa-hero-guarantees {
      gap: 12px;
    }
    .willa-hero-visual {
      width: 100%;
    }
    .willa-hero-image-card {
      max-width: 100%;
      border-radius: 18px;
    }
  }
</style>

{% schema %}
{
  "name": "Willa Hero",
  "settings": [
    {
      "type": "header",
      "content": "Pills & Headings"
    },
    {
      "type": "text",
      "id": "pill_1",
      "label": "Badge Pill 1",
      "default": "★ 2026 ZAVELYN® COLLECTION"
    },
    {
      "type": "text",
      "id": "pill_2",
      "label": "Badge Pill 2",
      "default": "IN STOCK & READY TO SHIP"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Hero Main Heading",
      "default": "Engineered for Heavy Duty. Built for Everyday Reliability."
    },
    {
      "type": "textarea",
      "id": "desc",
      "label": "Hero Description",
      "default": "Stop fighting broken equipment and low-grade tools. Zavelyn® brings you industrial-grade farm repair kits, precision ultrasonic tools, and durable homestead solutions trusted by over 100,000+ customers."
    },
    {
      "type": "header",
      "content": "Proof & Ratings"
    },
    {
      "type": "text",
      "id": "rating_stars",
      "label": "Stars Rating",
      "default": "★★★★★"
    },
    {
      "type": "text",
      "id": "rating_text",
      "label": "Rating Text",
      "default": "4.9/5.0 based on 12,480+ verified reviews"
    },
    {
      "type": "header",
      "content": "Action Buttons"
    },
    {
      "type": "text",
      "id": "btn_primary_text",
      "label": "Primary Button Text",
      "default": "EXPLORE BEST SELLERS ➔"
    },
    {
      "type": "url",
      "id": "btn_primary_link",
      "label": "Primary Button Link"
    },
    {
      "type": "text",
      "id": "btn_secondary_text",
      "label": "Secondary Button Text",
      "default": "FARM & FENCE REPAIR"
    },
    {
      "type": "url",
      "id": "btn_secondary_link",
      "label": "Secondary Button Link"
    },
    {
      "type": "header",
      "content": "Visual & Floating Badge"
    },
    {
      "type": "text",
      "id": "hero_image_url",
      "label": "Hero Image URL",
      "default": "https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg"
    },
    {
      "type": "text",
      "id": "floating_icon",
      "label": "Floating Tag Icon",
      "default": "🔥"
    },
    {
      "type": "text",
      "id": "floating_title",
      "label": "Floating Tag Title",
      "default": "Zavelyn® Innovation"
    },
    {
      "type": "text",
      "id": "floating_subtitle",
      "label": "Floating Tag Subtitle",
      "default": "Up to 50% Off Today"
    }
  ],
  "blocks": [
    {
      "type": "trust_item",
      "name": "Guarantee / Trust Item",
      "settings": [
        {
          "type": "text",
          "id": "icon",
          "label": "Emoji Icon",
          "default": "🛡️"
        },
        {
          "type": "text",
          "id": "highlight",
          "label": "Bold Highlight Text",
          "default": "90-Day"
        },
        {
          "type": "text",
          "id": "text",
          "label": "Guarantee Description",
          "default": "Risk-Free Trial"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Willa Hero"
    }
  ]
}
{% endschema %}
`;
}

// -------------------------------------------------------------
// 3. WILLA FACTS
// -------------------------------------------------------------
function buildFacts() {
  return `<section class="willa-facts-section">
  <div class="willa-container">
    <div class="willa-section-header">
      <span class="willa-pill">{{ section.settings.pill_text | default: 'THE ZAVELYN® ADVANTAGE' }}</span>
      <h2 class="willa-section-title willa-serif">{{ section.settings.heading | default: 'Engineered Without Compromise' }}</h2>
      <p class="willa-section-subtitle">{{ section.settings.subtitle | default: 'We design tools that withstand grueling conditions, protect livestock, and streamline complex tasks.' }}</p>
    </div>

    <div class="willa-facts-grid">
      {% if section.blocks.size > 0 %}
        {% for block in section.blocks %}
          <div class="willa-fact-card" {{ block.shopify_attributes }}>
            <div class="fact-icon">{{ block.settings.icon }}</div>
            <div class="fact-content">
              <h3>{{ block.settings.title }}</h3>
              <p>{{ block.settings.text }}</p>
            </div>
          </div>
        {% endfor %}
      {% else %}
        <div class="willa-fact-card">
          <div class="fact-icon">🛡️</div>
          <div class="fact-content">
            <h3>Industrial Durability</h3>
            <p>Built with heavy-duty alloys and reinforced polymers engineered for tough workshop and outdoor conditions.</p>
          </div>
        </div>
        <div class="willa-fact-card">
          <div class="fact-icon">⚡</div>
          <div class="fact-content">
            <h3>Precision Performance</h3>
            <p>Engineered to cut labor time in half with automated thermostats, ultrasonic vibrations, and laser guides.</p>
          </div>
        </div>
        <div class="willa-fact-card">
          <div class="fact-icon">🔒</div>
          <div class="fact-content">
            <h3>Certified Safety</h3>
            <p>Zero exposed flames or dangerous hot spots. Rigorously tested for maximum peace of mind on your homestead.</p>
          </div>
        </div>
        <div class="willa-fact-card">
          <div class="fact-icon">🚚</div>
          <div class="fact-content">
            <h3>Free US Delivery</h3>
            <p>Fast dispatch from US regional hubs. Enjoy free express tracked shipping on all orders over $49.</p>
          </div>
        </div>
      {% endif %}
    </div>
  </div>
</section>

<style>
  .willa-facts-section {
    background-color: #ffffff;
    padding: 60px 0;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-facts-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  .willa-fact-card {
    background-color: #faf7f4;
    border: 1px solid #e7e4df;
    border-radius: 18px;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .willa-fact-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(59, 43, 47, 0.06);
  }
  .fact-icon {
    font-size: 28px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e7e4df;
  }
  .fact-content h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 800;
    color: #231f20;
  }
  .fact-content p {
    margin: 0;
    font-size: 13px;
    color: #59514f;
    line-height: 1.5;
  }
  @media (max-width: 991px) {
    .willa-facts-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }
  @media (max-width: 540px) {
    .willa-facts-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

{% schema %}
{
  "name": "Willa Facts",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Badge Pill Text",
      "default": "THE ZAVELYN® ADVANTAGE"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Engineered Without Compromise"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "We design tools that withstand grueling conditions, protect livestock, and streamline complex tasks."
    }
  ],
  "blocks": [
    {
      "type": "fact_card",
      "name": "Fact Card",
      "settings": [
        {
          "type": "text",
          "id": "icon",
          "label": "Emoji Icon",
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
      "name": "Willa Facts"
    }
  ]
}
{% endschema %}
`;
}

// -------------------------------------------------------------
// 4. WILLA FEATURED PRODUCT (OFFER / BUNDLE)
// -------------------------------------------------------------
function buildFeaturedProduct() {
  return `<section class="willa-featured-offer-section">
  <div class="willa-container">
    <div class="willa-section-header">
      <span class="willa-pill">{{ section.settings.pill_text | default: 'FEATURED HOMESTEAD INNOVATION' }}</span>
      <h2 class="willa-section-title willa-serif">{{ section.settings.heading | default: 'Zavelyn® Intelligent Livestock Heating Lamp' }}</h2>
      <p class="willa-section-subtitle">{{ section.settings.subtitle | default: 'Auto-regulating smart thermostat, 100% sealed fireproof shell, and gentle ambient warmth. The safer way to protect baby chicks, ducks, and small livestock all season.' }}</p>
    </div>

    <div class="willa-offer-layout">
      <!-- Gallery Column -->
      <div class="willa-offer-gallery">
        <div class="willa-offer-main-img-wrap">
          <img id="willaOfferMainImg" src="{{ section.settings.main_image_url | default: 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg' }}" alt="{{ section.settings.heading | escape }}" loading="lazy">
        </div>
        <div class="willa-offer-thumbs">
          <img class="willa-offer-thumb active" src="{{ section.settings.thumb_1_url | default: 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg' }}" onclick="switchWillaOfferImg(this.src)">
          <img class="willa-offer-thumb" src="{{ section.settings.thumb_2_url | default: 'https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png' }}" onclick="switchWillaOfferImg(this.src)">
          <img class="willa-offer-thumb" src="{{ section.settings.thumb_3_url | default: 'https://cdn.myshopage.com/8dfe030d-f1ec-4a8a-02a4-753863454400/w1000.jpg' }}" onclick="switchWillaOfferImg(this.src)">
          <img class="willa-offer-thumb" src="{{ section.settings.thumb_4_url | default: 'https://cdn.myshopage.com/898406ff-0448-41a5-2440-fd49b2375e00/w1000.jpg' }}" onclick="switchWillaOfferImg(this.src)">
        </div>
      </div>

      <!-- Offer Selector Column -->
      <div class="willa-offer-box">
        <div class="willa-offer-box-header">
          <div class="willa-stars">{{ section.settings.rating_stars | default: '★★★★★' }}</div>
          <span class="rating-note">{{ section.settings.rating_text | default: '4.9/5 (1,480+ Reviews)' }}</span>
          <span class="stock-alert">{{ section.settings.stock_alert | default: '● Only 57 Units Remaining' }}</span>
        </div>

        <h3 class="willa-offer-box-title">{{ section.settings.bundle_box_title | default: 'Choose Your Package Bundle' }}</h3>
        <p class="willa-offer-box-desc">{{ section.settings.bundle_box_desc | default: 'Select your bundle below to unlock 50% discount and free express US delivery.' }}</p>

        <!-- Bundles List -->
        <div class="willa-bundle-options">
          {% if section.blocks.size > 0 %}
            {% for block in section.blocks %}
              <div class="willa-bundle-card {% if forloop.first or block.settings.is_best_seller %}active{% endif %}" id="willaBundle{{ forloop.index }}" onclick="selectWillaBundle('{{ block.settings.variant_id }}', '{{ block.settings.price }}', '{{ block.settings.compare_price }}', 'willaBundle{{ forloop.index }}', '{{ block.settings.image_url }}')" {{ block.shopify_attributes }}>
                {% if block.settings.badge != blank %}
                  <div class="bundle-badge {% unless block.settings.is_best_seller %}secondary{% endunless %}">{{ block.settings.badge }}</div>
                {% endif %}
                <div class="bundle-card-inner">
                  <input type="radio" name="willa_offer_bundle" id="radioBundle{{ forloop.index }}" {% if forloop.first or block.settings.is_best_seller %}checked{% endif %}>
                  <div class="bundle-info">
                    <h4>{{ block.settings.title }}</h4>
                    <p>{{ block.settings.subtitle }}</p>
                  </div>
                  <div class="bundle-pricing">
                    {% if block.settings.compare_price != blank %}<span class="price-old">\${{ block.settings.compare_price }}</span>{% endif %}
                    <span class="price-current">\${{ block.settings.price }}</span>
                  </div>
                </div>
              </div>
            {% endfor %}
          {% else %}
            <!-- Bundle 1: 2 Pack (Best Seller) -->
            <div class="willa-bundle-card active" id="willaBundle2" onclick="selectWillaBundle('67930179436729', '89.99', '179.99', 'willaBundle2', 'https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png')">
              <div class="bundle-badge">BEST SELLER • 50% OFF</div>
              <div class="bundle-card-inner">
                <input type="radio" name="willa_offer_bundle" id="radioBundle2" checked>
                <div class="bundle-info">
                  <h4>2 Pack (Light + US Switch Cord)</h4>
                  <p>Includes 2x Smart Lamps + 2x Switch Cords • Free Shipping</p>
                </div>
                <div class="bundle-pricing">
                  <span class="price-old">$179.99</span>
                  <span class="price-current">$89.99</span>
                </div>
              </div>
            </div>

            <!-- Bundle 2: 1 Pack -->
            <div class="willa-bundle-card" id="willaBundle1" onclick="selectWillaBundle('67930179403961', '49.99', '99.99', 'willaBundle1', 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg')">
              <div class="bundle-badge secondary">STARTER • 50% OFF</div>
              <div class="bundle-card-inner">
                <input type="radio" name="willa_offer_bundle" id="radioBundle1">
                <div class="bundle-info">
                  <h4>1 Pack (Light + US Switch Cord)</h4>
                  <p>Includes 1x Smart Lamp + 1x Switch Cord</p>
                </div>
                <div class="bundle-pricing">
                  <span class="price-old">$99.99</span>
                  <span class="price-current">$49.99</span>
                </div>
              </div>
            </div>
          {% endif %}
        </div>

        <!-- Quantity & Instant Checkout -->
        <div class="willa-offer-cta-section">
          <div class="willa-offer-total">
            <span>Total Today:</span>
            <strong id="willaOfferTotal">$89.99</strong>
          </div>
          <button type="button" id="willaOfferAtcBtn" class="willa-btn-primary" onclick="submitWillaOfferOrder()">
            {{ section.settings.cta_btn_text | default: 'CLAIM 50% OFF OFFER ➔' }}
          </button>
          <a href="{{ section.settings.details_link_url | default: '/products/sakerplus-livestock-heating-lamp' }}" class="willa-view-details-link">
            {{ section.settings.details_link_text | default: 'View Complete Product Details & Specifications →' }}
          </a>
        </div>

        <!-- Trust Row -->
        <div class="willa-offer-trust">
          <span>🛡️ 90-Day Money-Back Guarantee</span>
          <span>⚡ Fast Tracked Shipping</span>
          <span>🔒 100% Encrypted Checkout</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .willa-featured-offer-section {
    background-color: #faf7f4;
    padding: 60px 0;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-offer-layout {
    display: flex;
    gap: 40px;
    align-items: flex-start;
  }
  .willa-offer-gallery {
    flex: 1 1 50%;
  }
  .willa-offer-main-img-wrap {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 20px;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid #e7e4df;
    box-shadow: 0 8px 30px rgba(59, 43, 47, 0.08);
    margin-bottom: 14px;
  }
  .willa-offer-main-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.25s ease;
  }
  .willa-offer-thumbs {
    display: flex;
    gap: 10px;
  }
  .willa-offer-thumb {
    width: 76px;
    height: 76px;
    border-radius: 12px;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid transparent;
    background: #ffffff;
    transition: border-color 0.2s;
  }
  .willa-offer-thumb.active {
    border-color: #8a2c13;
  }

  .willa-offer-box {
    flex: 1 1 50%;
    background: #ffffff;
    border: 1px solid #e7e4df;
    border-radius: 24px;
    padding: 30px;
    box-shadow: 0 12px 36px rgba(59, 43, 47, 0.07);
  }
  .willa-offer-box-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }
  .rating-note {
    font-size: 13px;
    color: #59514f;
    font-weight: 600;
  }
  .stock-alert {
    margin-left: auto;
    font-size: 11px;
    font-weight: 700;
    color: #b7381b;
    background: #fbf0ee;
    padding: 4px 10px;
    border-radius: 20px;
  }
  .willa-offer-box-title {
    margin: 0 0 6px 0;
    font-size: 20px;
    font-weight: 800;
    color: #231f20;
  }
  .willa-offer-box-desc {
    font-size: 14px;
    color: #59514f;
    margin: 0 0 20px 0;
  }

  .willa-bundle-options {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 24px;
  }
  .willa-bundle-card {
    position: relative;
    border: 2px solid #e7e4df;
    border-radius: 16px;
    padding: 16px 18px;
    cursor: pointer;
    background-color: #faf7f4;
    transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
  }
  .willa-bundle-card.active {
    border-color: #8a2c13;
    background-color: #fffbf9;
    box-shadow: 0 4px 16px rgba(138, 44, 19, 0.1);
  }
  .bundle-badge {
    position: absolute;
    top: -11px;
    right: 18px;
    background: #8a2c13;
    color: #ffffff;
    font-size: 10px;
    font-weight: 800;
    padding: 3px 10px;
    border-radius: 12px;
    letter-spacing: 0.5px;
  }
  .bundle-badge.secondary {
    background: #59514f;
  }
  .bundle-card-inner {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .bundle-card-inner input[type="radio"] {
    accent-color: #8a2c13;
    width: 18px;
    height: 18px;
  }
  .bundle-info {
    flex: 1;
  }
  .bundle-info h4 {
    margin: 0 0 4px 0;
    font-size: 15px;
    font-weight: 700;
    color: #231f20;
  }
  .bundle-info p {
    margin: 0;
    font-size: 12px;
    color: #59514f;
  }
  .bundle-pricing {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .price-old {
    font-size: 12px;
    text-decoration: line-through;
    color: #8c827a;
  }
  .price-current {
    font-size: 18px;
    font-weight: 800;
    color: #8a2c13;
  }

  .willa-offer-cta-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .willa-offer-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
    color: #231f20;
    padding: 0 4px;
  }
  .willa-offer-total strong {
    font-size: 22px;
    color: #8a2c13;
    font-weight: 900;
  }
  .willa-view-details-link {
    text-align: center;
    font-size: 13px;
    color: #59514f;
    text-decoration: underline;
    font-weight: 600;
    transition: color 0.15s;
  }
  .willa-view-details-link:hover {
    color: #8a2c13;
  }
  .willa-offer-trust {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #59514f;
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid #e7e4df;
    flex-wrap: wrap;
    gap: 8px;
  }

  @media (max-width: 991px) {
    .willa-offer-layout {
      flex-direction: column;
      gap: 24px;
    }
    .willa-offer-box {
      padding: 20px;
      border-radius: 18px;
    }
  }
</style>

<script>
  let willaCurrentVariantId = '67930179436729';

  function switchWillaOfferImg(src) {
    const main = document.getElementById('willaOfferMainImg');
    if (main && src) {
      main.style.opacity = '0.5';
      setTimeout(() => {
        main.src = src;
        main.style.opacity = '1';
      }, 150);
    }
    document.querySelectorAll('.willa-offer-thumb').forEach(t => {
      if (t.src === src) t.classList.add('active');
      else t.classList.remove('active');
    });
  }

  function selectWillaBundle(variantId, price, oldPrice, cardId, imgUrl) {
    willaCurrentVariantId = variantId;
    document.querySelectorAll('.willa-bundle-card').forEach(c => c.classList.remove('active'));
    const card = document.getElementById(cardId);
    if (card) {
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    }
    const total = document.getElementById('willaOfferTotal');
    if (total) total.innerText = '$' + price;
    if (imgUrl) switchWillaOfferImg(imgUrl);
  }

  async function submitWillaOfferOrder() {
    const btn = document.getElementById('willaOfferAtcBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerText = 'ADDING TO CART...';
    }
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ id: willaCurrentVariantId, quantity: 1 }]
        })
      });

      if (res.ok) {
        if (typeof window.willaOpenCartDrawer === 'function') {
          await window.willaRefreshCart();
          window.willaOpenCartDrawer();
          btn.disabled = false;
          btn.innerText = 'CLAIM 50% OFF OFFER ➔';
        } else {
          window.location.href = '/checkout';
        }
      } else {
        window.location.href = '/cart/' + willaCurrentVariantId + ':1';
      }
    } catch (e) {
      window.location.href = '/cart/' + willaCurrentVariantId + ':1';
    }
  }
</script>

{% schema %}
{
  "name": "Willa Featured Offer",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Badge Pill Text",
      "default": "FEATURED HOMESTEAD INNOVATION"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Zavelyn® Intelligent Livestock Heating Lamp"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "Auto-regulating smart thermostat, 100% sealed fireproof shell, and gentle ambient warmth. The safer way to protect baby chicks, ducks, and small livestock all season."
    },
    {
      "type": "header",
      "content": "Ratings & Urgency"
    },
    {
      "type": "text",
      "id": "rating_stars",
      "label": "Stars Rating",
      "default": "★★★★★"
    },
    {
      "type": "text",
      "id": "rating_text",
      "label": "Rating Text",
      "default": "4.9/5 (1,480+ Reviews)"
    },
    {
      "type": "text",
      "id": "stock_alert",
      "label": "Stock Alert Badge",
      "default": "● Only 57 Units Remaining"
    },
    {
      "type": "header",
      "content": "Bundle Box Headers"
    },
    {
      "type": "text",
      "id": "bundle_box_title",
      "label": "Bundle Box Title",
      "default": "Choose Your Package Bundle"
    },
    {
      "type": "textarea",
      "id": "bundle_box_desc",
      "label": "Bundle Box Description",
      "default": "Select your bundle below to unlock 50% discount and free express US delivery."
    },
    {
      "type": "text",
      "id": "cta_btn_text",
      "label": "ATC Button Text",
      "default": "CLAIM 50% OFF OFFER ➔"
    },
    {
      "type": "text",
      "id": "details_link_text",
      "label": "Details Link Text",
      "default": "View Complete Product Details & Specifications →"
    },
    {
      "type": "url",
      "id": "details_link_url",
      "label": "Details Link URL"
    },
    {
      "type": "header",
      "content": "Product Media"
    },
    {
      "type": "text",
      "id": "main_image_url",
      "label": "Main Image URL",
      "default": "https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg"
    },
    {
      "type": "text",
      "id": "thumb_1_url",
      "label": "Thumbnail 1 URL",
      "default": "https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg"
    },
    {
      "type": "text",
      "id": "thumb_2_url",
      "label": "Thumbnail 2 URL",
      "default": "https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png"
    },
    {
      "type": "text",
      "id": "thumb_3_url",
      "label": "Thumbnail 3 URL",
      "default": "https://cdn.myshopage.com/8dfe030d-f1ec-4a8a-02a4-753863454400/w1000.jpg"
    },
    {
      "type": "text",
      "id": "thumb_4_url",
      "label": "Thumbnail 4 URL",
      "default": "https://cdn.myshopage.com/898406ff-0448-41a5-2440-fd49b2375e00/w1000.jpg"
    }
  ],
  "blocks": [
    {
      "type": "bundle_card",
      "name": "Package Bundle Card",
      "settings": [
        {
          "type": "text",
          "id": "badge",
          "label": "Badge Text",
          "default": "BEST SELLER • 50% OFF"
        },
        {
          "type": "checkbox",
          "id": "is_best_seller",
          "label": "Highlight as Best Seller",
          "default": false
        },
        {
          "type": "text",
          "id": "title",
          "label": "Bundle Title",
          "default": "2 Pack (Light + US Switch Cord)"
        },
        {
          "type": "text",
          "id": "subtitle",
          "label": "Bundle Subtitle",
          "default": "Includes 2x Smart Lamps + 2x Switch Cords • Free Shipping"
        },
        {
          "type": "text",
          "id": "variant_id",
          "label": "Shopify Variant ID",
          "default": "67930179436729"
        },
        {
          "type": "text",
          "id": "price",
          "label": "Active Price ($)",
          "default": "89.99"
        },
        {
          "type": "text",
          "id": "compare_price",
          "label": "Compare At Price ($)",
          "default": "179.99"
        },
        {
          "type": "text",
          "id": "image_url",
          "label": "Bundle Preview Image URL",
          "default": "https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Willa Featured Offer"
    }
  ]
}
{% endschema %}
`;
}

// -------------------------------------------------------------
// 5. WILLA COLLECTIONS GRID
// -------------------------------------------------------------
function buildCollectionsGrid() {
  return `<section class="willa-collections-section">
  <div class="willa-container">
    <div class="willa-section-header">
      <span class="willa-pill">{{ section.settings.pill_text | default: 'CURATED ESSENTIALS' }}</span>
      <h2 class="willa-section-title willa-serif">{{ section.settings.heading | default: 'Explore by Category' }}</h2>
      <p class="willa-section-subtitle">{{ section.settings.subtitle | default: 'Find the exact tool, kit, or equipment tailored to your specific project needs.' }}</p>
    </div>

    <div class="willa-categories-grid">
      {% if section.blocks.size > 0 %}
        {% for block in section.blocks %}
          <a href="{{ block.settings.link }}" class="willa-cat-card" {{ block.shopify_attributes }}>
            <div class="willa-cat-img-wrap">
              <img src="{{ block.settings.image_url }}" alt="{{ block.settings.title | escape }}" loading="lazy">
            </div>
            <div class="willa-cat-info">
              <h3>{{ block.settings.title }}</h3>
              <p>{{ block.settings.description }}</p>
              <span class="willa-cat-link">{{ block.settings.cta_text | default: 'Shop Category &rarr;' }}</span>
            </div>
          </a>
        {% endfor %}
      {% else %}
        <!-- Card 1 -->
        <a href="/collections/fence-and-farm" class="willa-cat-card">
          <div class="willa-cat-img-wrap">
            <img src="https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg" alt="Fence & Farm Repair" loading="lazy">
          </div>
          <div class="willa-cat-info">
            <h3>Fence &amp; Farm Repair</h3>
            <p>Reinforce posts, regulate livestock heat, and automate coop care.</p>
            <span class="willa-cat-link">Shop Category &rarr;</span>
          </div>
        </a>

        <!-- Card 2 -->
        <a href="/collections/power-tools" class="willa-cat-card">
          <div class="willa-cat-img-wrap">
            <img src="https://cdn.myshopage.com/db25d099-77fd-4ea4-8503-2f77737c8100/w1280.jpg" alt="Power & Precision Tools" loading="lazy">
          </div>
          <div class="willa-cat-info">
            <h3>Power &amp; Precision Tools</h3>
            <p>40kHz ultrasonic cutters, digital levels, and hydraulic crimpers.</p>
            <span class="willa-cat-link">Shop Category &rarr;</span>
          </div>
        </a>

        <!-- Card 3 -->
        <a href="/collections/garden-and-outdoor" class="willa-cat-card">
          <div class="willa-cat-img-wrap">
            <img src="https://cdn.myshopage.com/898406ff-0448-41a5-2440-fd49b2375e00/w1000.jpg" alt="Lawn, Garden & Outdoor" loading="lazy">
          </div>
          <div class="willa-cat-info">
            <h3>Lawn, Garden &amp; Outdoor</h3>
            <p>Yard sweepers, solar motion lights, and downspout drainage.</p>
            <span class="willa-cat-link">Shop Category &rarr;</span>
          </div>
        </a>

        <!-- Card 4 -->
        <a href="/collections/home-and-workshop" class="willa-cat-card">
          <div class="willa-cat-img-wrap">
            <img src="https://cdn.myshopage.com/8f765e2e-fcbd-4199-ab9b-433d4da5c000.jpg" alt="Home & Workshop Solutions" loading="lazy">
          </div>
          <div class="willa-cat-info">
            <h3>Home &amp; Workshop</h3>
            <p>Steam sanitizers, modular storage, and heavy-duty utility tools.</p>
            <span class="willa-cat-link">Shop Category &rarr;</span>
          </div>
        </a>
      {% endif %}
    </div>
  </div>
</section>

<style>
  .willa-collections-section {
    background-color: #ffffff;
    padding: 60px 0;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-categories-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  .willa-cat-card {
    background-color: #faf7f4;
    border: 1px solid #e7e4df;
    border-radius: 20px;
    overflow: hidden;
    text-decoration: none;
    color: #231f20;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    display: flex;
    flex-direction: column;
  }
  .willa-cat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(59, 43, 47, 0.08);
  }
  .willa-cat-img-wrap {
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: #ffffff;
  }
  .willa-cat-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .willa-cat-card:hover .willa-cat-img-wrap img {
    transform: scale(1.05);
  }
  .willa-cat-info {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .willa-cat-info h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 800;
    color: #231f20;
  }
  .willa-cat-info p {
    margin: 0 0 14px 0;
    font-size: 13px;
    color: #59514f;
    line-height: 1.5;
    flex: 1;
  }
  .willa-cat-link {
    font-size: 13px;
    font-weight: 700;
    color: #8a2c13;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  @media (max-width: 991px) {
    .willa-categories-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }
  @media (max-width: 540px) {
    .willa-categories-grid {
      grid-template-columns: 1fr;
    }
    .willa-cat-info {
      padding: 16px;
    }
  }
</style>

{% schema %}
{
  "name": "Willa Collections Grid",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Badge Pill Text",
      "default": "CURATED ESSENTIALS"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Explore by Category"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "Find the exact tool, kit, or equipment tailored to your specific project needs."
    }
  ],
  "blocks": [
    {
      "type": "category_card",
      "name": "Category Card",
      "settings": [
        {
          "type": "text",
          "id": "title",
          "label": "Category Title",
          "default": "Fence & Farm Repair"
        },
        {
          "type": "textarea",
          "id": "description",
          "label": "Category Description",
          "default": "Reinforce posts, regulate livestock heat, and automate coop care."
        },
        {
          "type": "url",
          "id": "link",
          "label": "Collection Link"
        },
        {
          "type": "text",
          "id": "image_url",
          "label": "Image URL",
          "default": "https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg"
        },
        {
          "type": "text",
          "id": "cta_text",
          "label": "Button Text",
          "default": "Shop Category →"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Willa Collections Grid"
    }
  ]
}
{% endschema %}
`;
}

// -------------------------------------------------------------
// 6. WILLA FEATURED COLLECTION (BEST SELLERS)
// -------------------------------------------------------------
function buildFeaturedCollection() {
  return `<section class="willa-best-sellers-section">
  <div class="willa-container">
    <div class="willa-section-header">
      <span class="willa-pill">{{ section.settings.pill_text | default: 'TOP RATED ZAVELYN® HARDWARE' }}</span>
      <h2 class="willa-section-title willa-serif">{{ section.settings.heading | default: 'Popular Zavelyn® Best Sellers' }}</h2>
      <p class="willa-section-subtitle">{{ section.settings.subtitle | default: 'Real customer favorites engineered for reliability, durability, and time-saving efficiency.' }}</p>
    </div>

    <div class="willa-products-grid">
      {% assign bsc = collections[section.settings.collection] %}
      {% if bsc == blank %}
        {% assign bsc = collections['best-sellers'] %}
      {% endif %}
      {% assign prod_limit = section.settings.products_to_show | default: 8 %}

      {% if bsc and bsc.products.size > 0 %}
        {% for product in bsc.products limit: prod_limit %}
          <div class="willa-prod-card">
            <a href="{{ product.url }}" class="willa-prod-img-wrap">
              {% if product.featured_image %}
                <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title | escape }}" loading="lazy">
              {% else %}
                <img src="https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg" alt="{{ product.title | escape }}" loading="lazy">
              {% endif %}
              
              {% if product.compare_at_price > product.price %}
                <span class="willa-sale-tag">SAVE 50%</span>
              {% endif %}
            </a>

            <div class="willa-prod-card-body">
              <div class="willa-stars">★★★★★</div>
              <h3 class="willa-prod-title">
                <a href="{{ product.url }}">{{ product.title }}</a>
              </h3>

              <div class="willa-prod-pricing">
                {% if product.compare_at_price > product.price %}
                  <span class="price-compare">{{ product.compare_at_price | money }}</span>
                {% endif %}
                <span class="price-active">{{ product.price | money }}</span>
              </div>

              {% if product.available %}
                <button type="button" class="willa-quick-atc-btn" onclick="willaQuickAddToCart('{{ product.first_available_variant.id }}', this)">
                  ADD TO CART ➔
                </button>
              {% else %}
                <button type="button" class="willa-quick-atc-btn disabled" disabled>
                  SOLD OUT
                </button>
              {% endif %}
            </div>
          </div>
        {% endfor %}
      {% else %}
        <!-- Fallback Cards if collection loading -->
        {% for product in collections.all.products limit: prod_limit %}
          <div class="willa-prod-card">
            <a href="{{ product.url }}" class="willa-prod-img-wrap">
              <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title | escape }}" loading="lazy">
              <span class="willa-sale-tag">BEST SELLER</span>
            </a>
            <div class="willa-prod-card-body">
              <div class="willa-stars">★★★★★</div>
              <h3 class="willa-prod-title"><a href="{{ product.url }}">{{ product.title }}</a></h3>
              <div class="willa-prod-pricing">
                <span class="price-active">{{ product.price | money }}</span>
              </div>
              <button type="button" class="willa-quick-atc-btn" onclick="willaQuickAddToCart('{{ product.first_available_variant.id }}', this)">
                ADD TO CART ➔
              </button>
            </div>
          </div>
        {% endfor %}
      {% endif %}
    </div>

    <div class="willa-view-all-wrap">
      <a href="{{ section.settings.view_all_link | default: '/collections/all-products' }}" class="willa-btn-secondary">
        {{ section.settings.view_all_text | default: 'VIEW ALL PRODUCTS ➔' }}
      </a>
    </div>
  </div>
</section>

<style>
  .willa-best-sellers-section {
    background-color: #faf7f4;
    padding: 60px 0;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }
  .willa-prod-card {
    background-color: #ffffff;
    border: 1px solid #e7e4df;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 14px rgba(59, 43, 47, 0.04);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .willa-prod-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(59, 43, 47, 0.08);
  }

  .willa-prod-img-wrap {
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    position: relative;
    background-color: #faf7f4;
    display: block;
  }
  .willa-prod-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  .willa-prod-card:hover .willa-prod-img-wrap img {
    transform: scale(1.04);
  }
  .willa-sale-tag {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #8a2c13;
    color: #ffffff;
    font-size: 10px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }

  .willa-prod-card-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .willa-prod-title {
    margin: 8px 0 10px 0;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
    flex: 1;
  }
  .willa-prod-title a {
    color: #231f20;
    text-decoration: none;
    transition: color 0.15s;
  }
  .willa-prod-title a:hover {
    color: #8a2c13;
  }

  .willa-prod-pricing {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 14px;
  }
  .price-active {
    font-size: 16px;
    font-weight: 800;
    color: #8a2c13;
  }
  .price-compare {
    font-size: 13px;
    text-decoration: line-through;
    color: #8c827a;
  }

  .willa-quick-atc-btn {
    width: 100%;
    background-color: #faf7f4;
    border: 1px solid #8a2c13;
    color: #8a2c13;
    font-size: 12px;
    font-weight: 800;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    text-align: center;
  }
  .willa-quick-atc-btn:hover {
    background-color: #8a2c13;
    color: #ffffff;
  }
  .willa-quick-atc-btn.disabled {
    border-color: #e7e4df;
    color: #8c827a;
    cursor: not-allowed;
  }

  .willa-view-all-wrap {
    display: flex;
    justify-content: center;
  }

  @media (max-width: 991px) {
    .willa-products-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .willa-prod-card-body {
      padding: 12px;
    }
    .willa-prod-title {
      font-size: 13px;
    }
  }
</style>

<script>
  async function willaQuickAddToCart(variantId, btn) {
    if (!variantId) return;
    const origText = btn.innerText;
    btn.disabled = true;
    btn.innerText = 'ADDING...';
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
      });
      if (res.ok) {
        if (typeof window.willaOpenCartDrawer === 'function') {
          await window.willaRefreshCart();
          window.willaOpenCartDrawer();
          btn.disabled = false;
          btn.innerText = origText;
        } else {
          window.location.href = '/cart';
        }
      } else {
        window.location.href = '/cart/' + variantId + ':1';
      }
    } catch (e) {
      window.location.href = '/cart/' + variantId + ':1';
    }
  }
</script>

{% schema %}
{
  "name": "Willa Best Sellers",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Badge Pill Text",
      "default": "TOP RATED ZAVELYN® HARDWARE"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Popular Zavelyn® Best Sellers"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "Real customer favorites engineered for reliability, durability, and time-saving efficiency."
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Source Collection"
    },
    {
      "type": "range",
      "id": "products_to_show",
      "min": 4,
      "max": 16,
      "step": 2,
      "label": "Number of Products to Show",
      "default": 8
    },
    {
      "type": "text",
      "id": "view_all_text",
      "label": "View All Button Text",
      "default": "VIEW ALL PRODUCTS ➔"
    },
    {
      "type": "url",
      "id": "view_all_link",
      "label": "View All Link"
    }
  ],
  "presets": [
    {
      "name": "Willa Best Sellers"
    }
  ]
}
{% endschema %}
`;
}

// -------------------------------------------------------------
// 7. WILLA STEPS
// -------------------------------------------------------------
function buildSteps() {
  return `<section class="willa-steps-section">
  <div class="willa-container">
    <div class="willa-section-header">
      <span class="willa-pill">{{ section.settings.pill_text | default: 'HOW IT WORKS' }}</span>
      <h2 class="willa-section-title willa-serif">{{ section.settings.heading | default: 'Simplicity in 3 Easy Steps' }}</h2>
      <p class="willa-section-subtitle">{{ section.settings.subtitle | default: 'We eliminate friction so you can focus on building, repairing, and creating.' }}</p>
    </div>

    <div class="willa-steps-grid">
      {% if section.blocks.size > 0 %}
        {% for block in section.blocks %}
          <div class="willa-step-card" {{ block.shopify_attributes }}>
            <div class="step-num">{{ block.settings.step_number }}</div>
            <h3>{{ block.settings.title }}</h3>
            <p>{{ block.settings.text }}</p>
          </div>
        {% endfor %}
      {% else %}
        <div class="willa-step-card">
          <div class="step-num">01</div>
          <h3>Select Your Solution</h3>
          <p>Choose from our specialized toolkits engineered specifically for fence repair, livestock care, or precision crafting.</p>
        </div>
        <div class="willa-step-card">
          <div class="step-num">02</div>
          <h3>Quick Plug-and-Play Setup</h3>
          <p>All kits include standard US cords, mounting hardware, or screw bases. Ready to run right out of the box with zero guesswork.</p>
        </div>
        <div class="willa-step-card">
          <div class="step-num">03</div>
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
    padding: 30px;
    position: relative;
    box-shadow: 0 4px 16px rgba(59, 43, 47, 0.04);
  }
  .step-num {
    font-size: 32px;
    font-weight: 900;
    color: #8a2c13;
    opacity: 0.8;
    margin-bottom: 14px;
    font-family: 'Playfair Display', serif;
  }
  .willa-step-card h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    font-weight: 800;
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
  "name": "Willa Steps",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Badge Pill Text",
      "default": "HOW IT WORKS"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Simplicity in 3 Easy Steps"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "We eliminate friction so you can focus on building, repairing, and creating."
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
          "label": "Step Details",
          "default": "Choose from our specialized toolkits engineered specifically for fence repair, livestock care, or precision crafting."
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Willa Steps"
    }
  ]
}
{% endschema %}
`;
}

// -------------------------------------------------------------
// 8. WILLA COMPARISON
// -------------------------------------------------------------
function buildComparison() {
  return `<section class="willa-comparison-section">
  <div class="willa-container">
    <div class="willa-section-header">
      <span class="willa-pill">{{ section.settings.pill_text | default: 'HEAD-TO-HEAD COMPARISON' }}</span>
      <h2 class="willa-section-title willa-serif">{{ section.settings.heading | default: 'Why Zavelyn® Outperforms the Rest' }}</h2>
    </div>

    <div class="willa-comp-table-wrap">
      <table class="willa-comp-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th class="col-brand">{{ section.settings.brand_col_title | default: 'Zavelyn® Original' }}</th>
            <th class="col-other">{{ section.settings.competitor_col_title | default: 'Generic Alternatives' }}</th>
          </tr>
        </thead>
        <tbody>
          {% if section.blocks.size > 0 %}
            {% for block in section.blocks %}
              <tr {{ block.shopify_attributes }}>
                <td><strong>{{ block.settings.title }}</strong></td>
                <td class="col-brand"><span class="check-icon">✓</span> {{ block.settings.brand_val }}</td>
                <td class="col-other"><span class="cross-icon">✗</span> {{ block.settings.competitor_val }}</td>
              </tr>
            {% endfor %}
          {% else %}
            <tr>
              <td><strong>Safety Standards</strong></td>
              <td class="col-brand"><span class="check-icon">✓</span> 100% Certified (Sealed &amp; tested)</td>
              <td class="col-other"><span class="cross-icon">✗</span> High risk &amp; fragile parts</td>
            </tr>
            <tr>
              <td><strong>Auto-Regulation Tech</strong></td>
              <td class="col-brand"><span class="check-icon">✓</span> Smart Digital Microchips</td>
              <td class="col-other"><span class="cross-icon">✗</span> Manual guesswork</td>
            </tr>
            <tr>
              <td><strong>Build Durability</strong></td>
              <td class="col-brand"><span class="check-icon">✓</span> Heavy-duty reinforced alloys</td>
              <td class="col-other"><span class="cross-icon">✗</span> Cheap thin plastic</td>
            </tr>
            <tr>
              <td><strong>Risk-Free Guarantee</strong></td>
              <td class="col-brand"><span class="check-icon">✓</span> 90-Day Money-Back Trial</td>
              <td class="col-other"><span class="cross-icon">✗</span> 14-day restrictive terms</td>
            </tr>
            <tr>
              <td><strong>Customer Support</strong></td>
              <td class="col-brand"><span class="check-icon">✓</span> Dedicated US support 7 days/wk</td>
              <td class="col-other"><span class="cross-icon">✗</span> Automated bot replies</td>
            </tr>
          {% endif %}
        </tbody>
      </table>
    </div>
  </div>
</section>

<style>
  .willa-comparison-section {
    background-color: #ffffff;
    padding: 60px 0;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-comp-table-wrap {
    max-width: 900px;
    margin: 0 auto;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #e7e4df;
    box-shadow: 0 8px 30px rgba(59, 43, 47, 0.05);
  }
  .willa-comp-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }
  .willa-comp-table th, .willa-comp-table td {
    padding: 16px 20px;
    border-bottom: 1px solid #e7e4df;
  }
  .willa-comp-table th {
    background-color: #faf7f4;
    font-size: 15px;
    font-weight: 800;
    color: #231f20;
  }
  .willa-comp-table th.col-brand, .willa-comp-table td.col-brand {
    background-color: #fffbf9;
    color: #8a2c13;
    font-weight: 700;
  }
  .check-icon {
    color: #2e7d32;
    font-weight: 900;
    margin-right: 6px;
  }
  .cross-icon {
    color: #c62828;
    font-weight: 900;
    margin-right: 6px;
  }
  @media (max-width: 640px) {
    .willa-comp-table { font-size: 12px; }
    .willa-comp-table th, .willa-comp-table td { padding: 12px 10px; }
  }
</style>

{% schema %}
{
  "name": "Willa Comparison Table",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Badge Pill Text",
      "default": "HEAD-TO-HEAD COMPARISON"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Why Zavelyn® Outperforms the Rest"
    },
    {
      "type": "text",
      "id": "brand_col_title",
      "label": "Brand Column Title",
      "default": "Zavelyn® Original"
    },
    {
      "type": "text",
      "id": "competitor_col_title",
      "label": "Competitor Column Title",
      "default": "Generic Alternatives"
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
          "label": "Zavelyn® Value",
          "default": "100% Certified (Sealed & tested)"
        },
        {
          "type": "text",
          "id": "competitor_val",
          "label": "Competitor Value",
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

// -------------------------------------------------------------
// 9. WILLA REVIEWS
// -------------------------------------------------------------
function buildReviews() {
  return `<section class="willa-reviews-section">
  <div class="willa-container">
    <div class="willa-section-header">
      <span class="willa-pill">{{ section.settings.pill_text | default: 'REAL EXPERIENCES' }}</span>
      <h2 class="willa-section-title willa-serif">{{ section.settings.heading | default: 'Trusted by Hardworking Makers & Farmers' }}</h2>
      <p class="willa-section-subtitle">{{ section.settings.subtitle | default: 'See how Zavelyn® tools and equipment solve daily challenges across workshops, farms, and homes.' }}</p>
    </div>

    <!-- Overall Rating Summary Card -->
    <div class="willa-reviews-rating-bar">
      <div class="rating-bar-score">{{ section.settings.rating_score | default: '4.9' }}</div>
      <div class="rating-bar-details">
        <div class="willa-stars">★★★★★</div>
        <span>{{ section.settings.rating_note | default: '12,480+ Verified 5-Star Reviews across North America' }}</span>
      </div>
    </div>

    <div class="willa-reviews-grid">
      {% if section.blocks.size > 0 %}
        {% for block in section.blocks %}
          <div class="willa-review-card" {{ block.shopify_attributes }}>
            <div class="review-stars">{{ block.settings.stars | default: '★★★★★' }}</div>
            <h4 class="review-title">"{{ block.settings.title }}"</h4>
            <p class="review-body">{{ block.settings.review }}</p>
            <div class="review-author-wrap">
              <strong>{{ block.settings.author }}</strong>
              {% if block.settings.verified %}<span class="verified-tag">✓ Verified Buyer</span>{% endif %}
            </div>
            {% if block.settings.purchased_product != blank %}
              <div class="review-product-tag">Item: {{ block.settings.purchased_product }}</div>
            {% endif %}
          </div>
        {% endfor %}
      {% else %}
        <div class="willa-review-card">
          <div class="review-stars">★★★★★</div>
          <h4 class="review-title">"Total game changer for our poultry barn!"</h4>
          <p class="review-body">Threw out my old red heat lamp the same day the Zavelyn® heating lamp arrived. It stays completely cool to the touch and baby chicks sleep soundly.</p>
          <div class="review-author-wrap">
            <strong>Debra W.</strong>
            <span class="verified-tag">✓ Verified Buyer</span>
          </div>
          <div class="review-product-tag">Item: Zavelyn® Intelligent Livestock Heating Lamp</div>
        </div>

        <div class="willa-review-card">
          <div class="review-stars">★★★★★</div>
          <h4 class="review-title">"Repaired 6 rotted posts in an afternoon"</h4>
          <p class="review-body">The Fence Post Repair Kit saved me thousands compared to replacing the whole fence line. Heavy steel, solid welds, drove straight into the ground.</p>
          <div class="review-author-wrap">
            <strong>Robert M.</strong>
            <span class="verified-tag">✓ Verified Buyer</span>
          </div>
          <div class="review-product-tag">Item: Zavelyn® Fence Post Repair Kit</div>
        </div>

        <div class="willa-review-card">
          <div class="review-stars">★★★★★</div>
          <h4 class="review-title">"Unbelievable precision for model crafting"</h4>
          <p class="review-body">The 40kHz Ultrasonic Precision Cutter slices through 3D print supports, dense acrylic, and resin without cracking or melting margins.</p>
          <div class="review-author-wrap">
            <strong>Ethan Walker</strong>
            <span class="verified-tag">✓ Verified Buyer</span>
          </div>
          <div class="review-product-tag">Item: Zavelyn® 40kHz Ultrasonic Precision Cutter Kit</div>
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
  .willa-reviews-rating-bar {
    max-width: 480px;
    margin: 0 auto 36px auto;
    background: #ffffff;
    border: 1px solid #e7e4df;
    border-radius: 16px;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    gap: 18px;
    box-shadow: 0 4px 14px rgba(59, 43, 47, 0.04);
  }
  .rating-bar-score {
    font-size: 38px;
    font-weight: 900;
    color: #8a2c13;
    font-family: 'Playfair Display', serif;
  }
  .rating-bar-details span {
    font-size: 12px;
    color: #59514f;
    font-weight: 600;
  }
  .willa-reviews-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .willa-review-card {
    background: #ffffff;
    border: 1px solid #e7e4df;
    border-radius: 18px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 16px rgba(59, 43, 47, 0.04);
  }
  .review-stars {
    color: #d97706;
    letter-spacing: 2px;
    margin-bottom: 10px;
  }
  .review-title {
    margin: 0 0 10px 0;
    font-size: 15px;
    font-weight: 700;
    color: #231f20;
  }
  .review-body {
    font-size: 13px;
    line-height: 1.6;
    color: #59514f;
    margin: 0 0 16px 0;
    flex: 1;
  }
  .review-author-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
  }
  .verified-tag {
    color: #2e7d32;
    font-size: 11px;
    font-weight: 700;
  }
  .review-product-tag {
    font-size: 11px;
    color: #8a2c13;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #f0ede8;
    font-weight: 600;
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
      "label": "Badge Pill Text",
      "default": "REAL EXPERIENCES"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Trusted by Hardworking Makers & Farmers"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "See how Zavelyn® tools and equipment solve daily challenges across workshops, farms, and homes."
    },
    {
      "type": "text",
      "id": "rating_score",
      "label": "Score",
      "default": "4.9"
    },
    {
      "type": "text",
      "id": "rating_note",
      "label": "Rating Note Text",
      "default": "12,480+ Verified 5-Star Reviews across North America"
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
          "label": "Stars Rating",
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
          "default": "Threw out my old red heat lamp the same day the Zavelyn® heating lamp arrived. It stays completely cool to the touch and baby chicks sleep soundly."
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

// -------------------------------------------------------------
// 10. WILLA FAQ
// -------------------------------------------------------------
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
          "default": "All orders are packed and dispatched directly from our regional US fulfillment centers. Standard delivery takes 3–5 business days."
        },
        {
          "type": "checkbox",
          "id": "open_default",
          "label": "Open by Default",
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

// -------------------------------------------------------------
// 11. WILLA FOOTER
// -------------------------------------------------------------
function buildFooter() {
  return `<footer class="willa-footer-wrap">
  <div class="willa-container">
    <!-- Top Footer: Newsletter & Brand Story -->
    <div class="willa-footer-top">
      <div class="willa-footer-brand-col">
        <div class="willa-footer-logo">
          <span>🌿</span>
          <span class="willa-serif">{{ section.settings.logo_text | default: 'ZAVELYN' }}<sup class="willa-reg">®</sup></span>
        </div>
        <p class="willa-footer-about">
          {{ section.settings.about_text | default: 'Engineered for performance and durability. We bring specialized farm repair solutions, precision crafting tools, and outdoor essentials directly to hardworking homeowners.' }}
        </p>
        <div class="willa-footer-contact">
          <p>Email: <strong>{{ section.settings.support_email | default: 'support@tryzavelyn.com' }}</strong></p>
          <p>Customer Support: {{ section.settings.support_hours | default: 'Monday – Sunday, 9am – 6pm EST' }}</p>
        </div>
      </div>

      <!-- Quick Nav Links -->
      <div class="willa-footer-links-col">
        <h4>Shop Collections</h4>
        <ul>
          <li><a href="/collections/best-sellers">★ Best Sellers</a></li>
          <li><a href="/collections/fence-and-farm">Fence &amp; Farm Repair</a></li>
          <li><a href="/collections/power-tools">Power &amp; Precision Tools</a></li>
          <li><a href="/collections/garden-and-outdoor">Lawn, Garden &amp; Outdoor</a></li>
          <li><a href="/collections/home-and-workshop">Home &amp; Workshop</a></li>
          <li><a href="/collections/all-products">Shop All Products</a></li>
        </ul>
      </div>

      <!-- Customer Care & Policies -->
      <div class="willa-footer-links-col">
        <h4>Customer Care</h4>
        <ul>
          <li><a href="/pages/track-order">Track Your Order</a></li>
          <li><a href="/policies/shipping-policy">Shipping Policy</a></li>
          <li><a href="/policies/refund-policy">Refund &amp; Return Policy</a></li>
          <li><a href="/policies/privacy-policy">Privacy Policy</a></li>
          <li><a href="/policies/terms-of-service">Terms of Service</a></li>
        </ul>
      </div>

      <!-- Newsletter -->
      <div class="willa-footer-newsletter-col">
        <h4>{{ section.settings.newsletter_title | default: 'Join the Zavelyn® Community' }}</h4>
        <p>{{ section.settings.newsletter_desc | default: 'Subscribe for exclusive 50% seasonal discounts, farm tips, and early access to new tool releases.' }}</p>
        <form class="willa-newsletter-form" onsubmit="event.preventDefault(); alert('Thank you for subscribing to Zavelyn®!');">
          <input type="email" placeholder="Enter your email address" required>
          <button type="submit" class="willa-btn-primary" style="padding: 12px 20px; font-size: 13px;">{{ section.settings.newsletter_btn_text | default: 'JOIN' }}</button>
        </form>
        <div class="willa-newsletter-note">
          🔒 Zero spam. Unsubscribe at any time.
        </div>
      </div>
    </div>

    <!-- Bottom Footer: Copyright & Payment Badges -->
    <div class="willa-footer-bottom">
      <div class="willa-copyright">
        &copy; {{ 'now' | date: '%Y' }} {{ section.settings.copyright_text | default: 'Zavelyn® Inc. All rights reserved.' }}
      </div>
      <div class="willa-payment-icons">
        <span>VISA</span>
        <span>MASTERCARD</span>
        <span>AMEX</span>
        <span>DISCOVER</span>
        <span>PAYPAL</span>
        <span>APPLE PAY</span>
      </div>
    </div>
  </div>
</footer>

<style>
  .willa-footer-wrap {
    background-color: #3b2b2f;
    color: #f7f4ee;
    padding-top: 60px;
    padding-bottom: 30px;
    border-top: 1px solid #4a383d;
  }
  .willa-footer-top {
    display: grid;
    grid-template-columns: 2fr 1.2fr 1.2fr 1.8fr;
    gap: 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .willa-footer-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 26px;
    font-weight: 900;
    letter-spacing: 2px;
    color: #ffffff;
    margin-bottom: 14px;
  }
  .willa-footer-logo sup.willa-reg {
    font-size: 13px;
    vertical-align: super;
    line-height: 0;
    color: #ff8a65;
    margin-left: 2px;
  }
  .willa-footer-about {
    font-size: 13px;
    color: #d1c7c2;
    line-height: 1.6;
    margin-bottom: 16px;
  }
  .willa-footer-contact p {
    margin: 4px 0;
    font-size: 12px;
    color: #b5aba4;
  }
  .willa-footer-contact strong {
    color: #ffffff;
  }

  .willa-footer-links-col h4, .willa-footer-newsletter-col h4 {
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 16px 0;
    letter-spacing: 0.5px;
  }
  .willa-footer-links-col ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .willa-footer-links-col li {
    margin-bottom: 10px;
  }
  .willa-footer-links-col a {
    color: #d1c7c2;
    text-decoration: none;
    font-size: 13px;
    transition: color 0.15s;
  }
  .willa-footer-links-col a:hover {
    color: #ffffff;
    text-decoration: underline;
  }

  .willa-footer-newsletter-col p {
    font-size: 13px;
    color: #d1c7c2;
    line-height: 1.5;
    margin-bottom: 16px;
  }
  .willa-newsletter-form {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }
  .willa-newsletter-form input {
    flex: 1;
    background: #4a383d;
    border: 1px solid #5d464d;
    border-radius: 8px;
    padding: 12px 14px;
    color: #ffffff;
    font-size: 13px;
    outline: none;
  }
  .willa-newsletter-form input::placeholder {
    color: #a39599;
  }
  .willa-newsletter-note {
    font-size: 11px;
    color: #a39599;
  }

  .willa-footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    font-size: 12px;
    color: #b5aba4;
    gap: 16px;
    flex-wrap: wrap;
  }
  .willa-payment-icons {
    display: flex;
    gap: 8px;
    font-weight: 700;
    font-size: 10px;
    letter-spacing: 0.5px;
  }
  .willa-payment-icons span {
    background: #4a383d;
    padding: 4px 8px;
    border-radius: 4px;
    color: #ffffff;
  }

  @media (max-width: 991px) {
    .willa-footer-top {
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
    }
  }
  @media (max-width: 640px) {
    .willa-footer-top {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .willa-footer-bottom {
      flex-direction: column;
      text-align: center;
    }
    .willa-newsletter-form {
      flex-direction: column;
    }
  }
</style>

{% schema %}
{
  "name": "Willa Footer",
  "settings": [
    {
      "type": "text",
      "id": "logo_text",
      "label": "Brand Logo Text",
      "default": "ZAVELYN"
    },
    {
      "type": "textarea",
      "id": "about_text",
      "label": "About Brand Description",
      "default": "Engineered for performance and durability. We bring specialized farm repair solutions, precision crafting tools, and outdoor essentials directly to hardworking homeowners."
    },
    {
      "type": "text",
      "id": "support_email",
      "label": "Support Email Address",
      "default": "support@tryzavelyn.com"
    },
    {
      "type": "text",
      "id": "support_hours",
      "label": "Customer Support Operating Hours",
      "default": "Monday – Sunday, 9am – 6pm EST"
    },
    {
      "type": "header",
      "content": "Newsletter Box"
    },
    {
      "type": "text",
      "id": "newsletter_title",
      "label": "Newsletter Title",
      "default": "Join the Zavelyn® Community"
    },
    {
      "type": "textarea",
      "id": "newsletter_desc",
      "label": "Newsletter Description",
      "default": "Subscribe for exclusive 50% seasonal discounts, farm tips, and early access to new tool releases."
    },
    {
      "type": "text",
      "id": "newsletter_btn_text",
      "label": "Newsletter Button Text",
      "default": "JOIN"
    },
    {
      "type": "text",
      "id": "copyright_text",
      "label": "Copyright Text",
      "default": "Zavelyn® Inc. All rights reserved."
    }
  ],
  "presets": [
    {
      "name": "Willa Footer"
    }
  ]
}
{% endschema %}
`;
}

// -------------------------------------------------------------
// 12. WILLA MAIN PRODUCT
// -------------------------------------------------------------
function buildMainProduct() {
  return `<div class="willa-pdp-page">
  <div class="willa-container">
    {% if section.settings.show_breadcrumbs %}
      <div class="willa-breadcrumbs">
        <a href="/">Home</a> &gt; <a href="/collections/all-products">Shop</a> &gt; <span>{{ product.title }}</span>
      </div>
    {% endif %}

    <div class="willa-pdp-layout">
      <!-- Media Gallery -->
      <div class="willa-pdp-gallery">
        <div class="willa-pdp-main-img-wrap">
          {% if product.featured_image %}
            <img id="willaPdpMainImg" src="{{ product.featured_image | image_url: width: 1000 }}" alt="{{ product.title | escape }}">
          {% else %}
            <img id="willaPdpMainImg" src="https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg" alt="{{ product.title | escape }}">
          {% endif %}

          {% if product.compare_at_price > product.price %}
            <div class="willa-pdp-badge">{{ section.settings.badge_text | default: 'SPECIAL OFFER' }}</div>
          {% endif %}
        </div>

        {% if product.images.size > 1 %}
          <div class="willa-pdp-thumbs">
            {% for image in product.images limit: 8 %}
              <img class="willa-pdp-thumb {% if forloop.first %}active{% endif %}" src="{{ image | image_url: width: 160 }}" alt="{{ product.title | escape }}" onclick="switchPdpImg(this.src)">
            {% endfor %}
          </div>
        {% endif %}
      </div>

      <!-- Purchase Box -->
      <div class="willa-pdp-details">
        <div class="willa-pdp-rating-row">
          <div class="willa-stars">★★★★★</div>
          <span class="rating-text">{{ section.settings.rating_text | default: '4.9 / 5.0 (1,240+ Verified Reviews)' }}</span>
        </div>

        <h1 class="willa-pdp-title willa-serif">{{ product.title }}</h1>

        <div class="willa-pdp-price-row">
          <span class="willa-pdp-active-price" id="willaPdpPrice">{{ product.selected_or_first_available_variant.price | money }}</span>
          {% if product.selected_or_first_available_variant.compare_at_price > product.selected_or_first_available_variant.price %}
            <span class="willa-pdp-compare-price" id="willaPdpComparePrice">{{ product.selected_or_first_available_variant.compare_at_price | money }}</span>
            <span class="willa-pdp-save-badge">{{ section.settings.save_badge_text | default: '50% OFF' }}</span>
          {% endif %}
        </div>

        <!-- Variants Selector -->
        {% unless product.has_only_default_variant %}
          <div class="willa-pdp-variants-wrap">
            <label class="variant-label">Select Option:</label>
            <div class="willa-pdp-variant-chips">
              {% for variant in product.variants %}
                {% assign var_img = '' %}
                {% if variant.featured_image != blank %}
                  {% assign var_img = variant.featured_image | image_url: width: 1000 %}
                {% elsif product.featured_image != blank %}
                  {% assign var_img = product.featured_image | image_url: width: 1000 %}
                {% endif %}
                <button type="button" class="willa-variant-chip {% if variant.id == product.selected_or_first_available_variant.id %}active{% endif %}" onclick="selectPdpVariant('{{ variant.id }}', '{{ variant.price | money }}', '{{ variant.compare_at_price | money }}', '{{ var_img }}', this)">
                  {{ variant.title }}
                </button>
              {% endfor %}
            </div>
          </div>
        {% endunless %}

        <!-- Quantity & ATC -->
        <div class="willa-pdp-actions">
          <div class="willa-pdp-qty-row">
            <label for="willaPdpQty">Quantity:</label>
            <div class="willa-pdp-qty-ctrl">
              <button type="button" onclick="adjustPdpQty(-1)">-</button>
              <input type="number" id="willaPdpQty" value="1" min="1" max="10" readonly>
              <button type="button" onclick="adjustPdpQty(1)">+</button>
            </div>
          </div>

          <button type="button" id="willaPdpAtcBtn" class="willa-btn-primary willa-pdp-atc" onclick="submitPdpOrder()">
            {% if product.available %}
              ADD TO CART ➔
            {% else %}
              SOLD OUT
            {% endif %}
          </button>
        </div>

        <!-- Guarantees Row -->
        <div class="willa-pdp-trust-box">
          <div class="pdp-trust-item">
            <span>🛡️</span> <strong>90-Day Money-Back Guarantee</strong>
          </div>
          <div class="pdp-trust-item">
            <span>🚚</span> <strong>Free Express Delivery on Orders $49+</strong>
          </div>
          <div class="pdp-trust-item">
            <span>🔒</span> <strong>Safe &amp; Encrypted 256-Bit Checkout</strong>
          </div>
        </div>

        <!-- Accordions: Description, Features, Shipping -->
        <div class="willa-pdp-accordions">
          {% if section.blocks.size > 0 %}
            {% for block in section.blocks %}
              <details class="willa-faq-item" {% if forloop.first or block.settings.open_default %}open{% endif %} {{ block.shopify_attributes }}>
                <summary>
                  <span>{{ block.settings.title }}</span>
                  <span class="faq-icon">+</span>
                </summary>
                <div class="faq-content">
                  {% if block.settings.use_product_description %}
                    {% if product.description != blank %}
                      {{ product.description }}
                    {% else %}
                      <p>Industrial-grade construction engineered for tough jobs and reliable long-term performance.</p>
                    {% endif %}
                  {% else %}
                    <p>{{ block.settings.content }}</p>
                  {% endif %}
                </div>
              </details>
            {% endfor %}
          {% else %}
            <details class="willa-faq-item" open>
              <summary>
                <span>Product Description</span>
                <span class="faq-icon">+</span>
              </summary>
              <div class="faq-content">
                {% if product.description != blank %}
                  {{ product.description }}
                {% else %}
                  <p>Industrial-grade construction engineered for tough jobs and reliable long-term performance.</p>
                {% endif %}
              </div>
            </details>

            <details class="willa-faq-item">
              <summary>
                <span>Shipping &amp; Delivery Information</span>
                <span class="faq-icon">+</span>
              </summary>
              <div class="faq-content">
                <p>Orders are dispatched within 24 hours from our US warehouses. Free standard shipping is automatically applied to orders over $49. Delivery takes 3–5 business days with live tracking.</p>
              </div>
            </details>

            <details class="willa-faq-item">
              <summary>
                <span>Warranty &amp; Returns</span>
                <span class="faq-icon">+</span>
              </summary>
              <div class="faq-content">
                <p>We offer an unconditional 90-day money-back guarantee. If you are not completely satisfied, email support@tryzavelyn.com for an immediate exchange or refund.</p>
              </div>
            </details>
          {% endif %}
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Sticky Bottom Purchase Bar -->
  {% if section.settings.enable_sticky_atc %}
    <div class="willa-pdp-sticky-bar" id="willaStickyAtc">
      <div class="sticky-bar-left">
        <span class="sticky-title">{{ product.title | truncate: 30 }}</span>
        <span class="sticky-price" id="willaStickyPrice">{{ product.selected_or_first_available_variant.price | money }}</span>
      </div>
      <button type="button" class="willa-sticky-btn" onclick="submitPdpOrder()">
        {{ section.settings.sticky_btn_text | default: 'BUY NOW ➔' }}
      </button>
    </div>
  {% endif %}
</div>

<style>
  .willa-pdp-page {
    background-color: #ffffff;
    padding: 30px 0 60px 0;
  }
  .willa-breadcrumbs {
    font-size: 13px;
    color: #8c827a;
    margin-bottom: 24px;
  }
  .willa-breadcrumbs a {
    color: #59514f;
    text-decoration: none;
  }
  .willa-breadcrumbs a:hover {
    color: #8a2c13;
  }
  .willa-breadcrumbs span {
    color: #231f20;
    font-weight: 600;
  }

  .willa-pdp-layout {
    display: flex;
    gap: 48px;
    align-items: flex-start;
  }
  .willa-pdp-gallery {
    flex: 1 1 52%;
    position: sticky;
    top: 90px;
  }
  .willa-pdp-main-img-wrap {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 20px;
    overflow: hidden;
    background: #faf7f4;
    border: 1px solid #e7e4df;
    position: relative;
    box-shadow: 0 8px 30px rgba(59, 43, 47, 0.06);
    margin-bottom: 16px;
  }
  .willa-pdp-main-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.25s ease;
  }
  .willa-pdp-badge {
    position: absolute;
    top: 14px;
    left: 14px;
    background-color: #8a2c13;
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 6px;
    letter-spacing: 0.5px;
  }

  .willa-pdp-thumbs {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 6px;
  }
  .willa-pdp-thumb {
    width: 72px;
    height: 72px;
    border-radius: 10px;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid transparent;
    background: #faf7f4;
    transition: border-color 0.2s;
  }
  .willa-pdp-thumb.active {
    border-color: #8a2c13;
  }

  .willa-pdp-details {
    flex: 1 1 48%;
  }
  .willa-pdp-rating-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  .willa-pdp-details .willa-stars {
    color: #d97706;
  }
  .willa-pdp-details .rating-text {
    font-size: 13px;
    color: #59514f;
    font-weight: 600;
  }
  .willa-pdp-title {
    font-size: 32px;
    font-weight: 900;
    color: #231f20;
    line-height: 1.25;
    margin: 0 0 16px 0;
  }

  .willa-pdp-price-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  .willa-pdp-active-price {
    font-size: 28px;
    font-weight: 900;
    color: #8a2c13;
  }
  .willa-pdp-compare-price {
    font-size: 18px;
    text-decoration: line-through;
    color: #8c827a;
  }
  .willa-pdp-save-badge {
    background-color: #fbf0ee;
    color: #8a2c13;
    font-size: 11px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 6px;
  }

  .willa-pdp-variants-wrap {
    margin-bottom: 24px;
  }
  .variant-label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: #231f20;
    margin-bottom: 10px;
  }
  .willa-pdp-variant-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .willa-variant-chip {
    background-color: #faf7f4;
    border: 1.5px solid #e7e4df;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #231f20;
    cursor: pointer;
    transition: all 0.2s;
  }
  .willa-variant-chip:hover {
    border-color: #8a2c13;
  }
  .willa-variant-chip.active {
    border-color: #8a2c13;
    background-color: #fffbf9;
    color: #8a2c13;
    font-weight: 700;
  }

  .willa-pdp-actions {
    display: flex;
    gap: 14px;
    margin-bottom: 24px;
    align-items: center;
  }
  .willa-pdp-qty-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .willa-pdp-qty-row label {
    font-size: 13px;
    font-weight: 600;
    color: #59514f;
    display: none;
  }
  .willa-pdp-qty-ctrl {
    display: flex;
    align-items: center;
    border: 1px solid #e7e4df;
    border-radius: 10px;
    overflow: hidden;
    background: #faf7f4;
  }
  .willa-pdp-qty-ctrl button {
    background: none;
    border: none;
    padding: 12px 16px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    color: #231f20;
  }
  .willa-pdp-qty-ctrl input {
    width: 40px;
    text-align: center;
    border: none;
    background: none;
    font-size: 14px;
    font-weight: 700;
    color: #231f20;
    outline: none;
  }

  .willa-pdp-atc {
    flex: 1;
    padding: 16px 24px !important;
    font-size: 15px !important;
  }

  .willa-pdp-trust-box {
    background-color: #faf7f4;
    border: 1px solid #e7e4df;
    border-radius: 14px;
    padding: 16px 20px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .pdp-trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #59514f;
  }
  .pdp-trust-item strong {
    color: #231f20;
  }

  .willa-pdp-accordions details {
    margin-bottom: 12px;
  }

  .willa-pdp-sticky-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
    border-top: 1px solid #e7e4df;
    padding: 12px 20px;
    z-index: 999;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
    display: none;
    align-items: center;
    justify-content: space-between;
  }
  .willa-pdp-sticky-bar.visible {
    display: flex;
  }
  .sticky-bar-left {
    display: flex;
    flex-direction: column;
  }
  .sticky-title {
    font-size: 13px;
    font-weight: 700;
    color: #231f20;
  }
  .sticky-price {
    font-size: 15px;
    font-weight: 900;
    color: #8a2c13;
  }
  .willa-sticky-btn {
    background-color: #8a2c13;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
  }

  @media (max-width: 991px) {
    .willa-pdp-layout {
      flex-direction: column;
      gap: 24px;
    }
    .willa-pdp-gallery {
      position: static;
      width: 100%;
    }
    .willa-pdp-title {
      font-size: 24px;
    }
    .willa-pdp-active-price {
      font-size: 24px;
    }
  }
</style>

<script>
  let willaCurrentPdpVariantId = '{{ product.selected_or_first_available_variant.id }}';
  let willaCurrentPdpQty = 1;

  function switchPdpImg(src) {
    const main = document.getElementById('willaPdpMainImg');
    if (main && src) {
      main.style.opacity = '0.5';
      setTimeout(() => {
        main.src = src;
        main.style.opacity = '1';
      }, 150);
    }
    document.querySelectorAll('.willa-pdp-thumb').forEach(t => {
      if (t.src === src) t.classList.add('active');
      else t.classList.remove('active');
    });
  }

  function selectPdpVariant(id, price, comparePrice, imgUrl, btn) {
    willaCurrentPdpVariantId = id;
    document.querySelectorAll('.willa-variant-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const priceEl = document.getElementById('willaPdpPrice');
    if (priceEl) priceEl.innerText = price;

    const stickyPriceEl = document.getElementById('willaStickyPrice');
    if (stickyPriceEl) stickyPriceEl.innerText = price;

    const compEl = document.getElementById('willaPdpComparePrice');
    if (compEl && comparePrice) compEl.innerText = comparePrice;

    if (imgUrl) switchPdpImg(imgUrl);
  }

  function adjustPdpQty(delta) {
    const input = document.getElementById('willaPdpQty');
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val += delta;
    if (val < 1) val = 1;
    if (val > 10) val = 10;
    input.value = val;
    willaCurrentPdpQty = val;
  }

  async function submitPdpOrder() {
    const btn = document.getElementById('willaPdpAtcBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerText = 'ADDING...';
    }
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ id: willaCurrentPdpVariantId, quantity: willaCurrentPdpQty }]
        })
      });

      if (res.ok) {
        if (typeof window.willaOpenCartDrawer === 'function') {
          await window.willaRefreshCart();
          window.willaOpenCartDrawer();
          btn.disabled = false;
          btn.innerText = 'ADD TO CART ➔';
        } else {
          window.location.href = '/cart';
        }
      } else {
        window.location.href = '/cart/' + willaCurrentPdpVariantId + ':' + willaCurrentPdpQty;
      }
    } catch (e) {
      window.location.href = '/cart/' + willaCurrentPdpVariantId + ':' + willaCurrentPdpQty;
    }
  }

  function initStickyBar() {
    const mainAtc = document.getElementById('willaPdpAtcBtn');
    const stickyBar = document.getElementById('willaStickyAtc');
    if (!mainAtc || !stickyBar) return;

    function checkSticky() {
      const rect = mainAtc.getBoundingClientRect();
      if (rect.bottom < 0) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', checkSticky, { passive: true });
    window.addEventListener('resize', checkSticky, { passive: true });
    checkSticky();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyBar);
  } else {
    initStickyBar();
  }
</script>

{% schema %}
{
  "name": "Willa Main Product",
  "settings": [
    {
      "type": "checkbox",
      "id": "show_breadcrumbs",
      "label": "Show Breadcrumbs Navigation",
      "default": true
    },
    {
      "type": "text",
      "id": "badge_text",
      "label": "Sale Badge Text",
      "default": "SPECIAL OFFER"
    },
    {
      "type": "text",
      "id": "rating_text",
      "label": "Rating Text",
      "default": "4.9 / 5.0 (1,240+ Verified Reviews)"
    },
    {
      "type": "text",
      "id": "save_badge_text",
      "label": "Save Badge Text",
      "default": "50% OFF"
    },
    {
      "type": "header",
      "content": "Sticky Add to Cart Bar"
    },
    {
      "type": "checkbox",
      "id": "enable_sticky_atc",
      "label": "Enable Sticky Add to Cart Bar",
      "default": true
    },
    {
      "type": "text",
      "id": "sticky_btn_text",
      "label": "Sticky Button Text",
      "default": "BUY NOW ➔"
    }
  ],
  "blocks": [
    {
      "type": "accordion_item",
      "name": "Product Accordion / Tab",
      "settings": [
        {
          "type": "text",
          "id": "title",
          "label": "Accordion Title",
          "default": "Product Description"
        },
        {
          "type": "checkbox",
          "id": "use_product_description",
          "label": "Use Product Body Description",
          "default": false
        },
        {
          "type": "textarea",
          "id": "content",
          "label": "Custom Content",
          "default": "Industrial-grade construction engineered for tough jobs and reliable long-term performance."
        },
        {
          "type": "checkbox",
          "id": "open_default",
          "label": "Open by Default",
          "default": false
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Willa Main Product"
    }
  ]
}
{% endschema %}
`;
}

// -------------------------------------------------------------
// 13. WILLA MAIN COLLECTION
// -------------------------------------------------------------
function buildMainCollection() {
  return `<div class="willa-collection-page">
  <!-- Collection Banner Header -->
  <div class="willa-collection-hero">
    <div class="willa-container">
      {% if section.settings.show_breadcrumbs %}
        <div class="willa-breadcrumbs">
          <a href="/">Home</a> &gt; <span>{{ collection.title }}</span>
        </div>
      {% endif %}
      <h1 class="willa-collection-title willa-serif">{{ collection.title }}</h1>
      {% if collection.description != blank %}
        <div class="willa-collection-desc">{{ collection.description }}</div>
      {% endif %}
    </div>
  </div>

  <!-- Filter & Sort Bar (Willa Style) -->
  {% if section.settings.show_filter_bar %}
    <div class="willa-collection-filter-bar">
      <div class="willa-container filter-bar-inner">
        <div class="filter-left">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
          <span>Filter and sort</span>
        </div>
        <div class="filter-right">
          <span>{{ collection.products_count }} products</span>
        </div>
      </div>
    </div>
  {% endif %}

  <!-- Products Grid (Willa 2-Column Mobile Precision Grid) -->
  <div class="willa-container willa-collection-body">
    <div class="willa-products-grid">
      {% for product in collection.products %}
        <div class="willa-prod-card">
          <a href="{{ product.url }}" class="willa-prod-img-wrap">
            {% if product.featured_image %}
              <img src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title | escape }}" loading="lazy">
            {% else %}
              <img src="https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg" alt="{{ product.title | escape }}" loading="lazy">
            {% endif %}

            {% if product.compare_at_price > product.price %}
              <span class="willa-sale-tag">🏷️ SAVE 50%</span>
            {% endif %}
          </a>

          <div class="willa-prod-card-body">
            <h3 class="willa-prod-title">
              <a href="{{ product.url }}">{{ product.title }}</a>
            </h3>

            <div class="willa-stars">★★★★★</div>

            <div class="willa-prod-pricing">
              <span class="price-active">{{ product.price | money }}</span>
              {% if product.compare_at_price > product.price %}
                <span class="price-compare">{{ product.compare_at_price | money }}</span>
              {% endif %}
            </div>

            {% if product.available %}
              <button type="button" class="willa-quick-atc-btn" onclick="willaQuickAddToCart('{{ product.first_available_variant.id }}', this)">
                Add to cart
              </button>
            {% else %}
              <button type="button" class="willa-quick-atc-btn disabled" disabled>
                Sold Out
              </button>
            {% endif %}
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</div>

<style>
  .willa-collection-page {
    background-color: #ffffff;
    min-height: 80vh;
  }
  .willa-collection-hero {
    background-color: #faf7f4;
    padding: 36px 0 28px 0;
    border-bottom: 1px solid #e7e4df;
    text-align: center;
  }
  .willa-collection-hero .willa-breadcrumbs {
    margin-bottom: 16px;
  }
  .willa-collection-title {
    font-size: 38px;
    font-weight: 900;
    color: #231f20;
    margin: 0 0 10px 0;
    letter-spacing: -0.5px;
  }
  .willa-collection-desc {
    max-width: 680px;
    margin: 0 auto;
    font-size: 14px;
    color: #59514f;
    line-height: 1.6;
  }

  .willa-collection-filter-bar {
    background: #ffffff;
    border-bottom: 1px solid #e7e4df;
    padding: 14px 0;
  }
  .filter-bar-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
    color: #231f20;
  }
  .filter-left {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  .filter-right {
    color: #8c827a;
    font-weight: 600;
  }

  .willa-collection-body {
    padding: 36px 0 60px 0;
  }
  .willa-collection-body .willa-products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  @media (max-width: 991px) {
    .willa-collection-body .willa-products-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 12px !important;
    }
    .willa-collection-title {
      font-size: 26px;
    }
  }
</style>

{% schema %}
{
  "name": "Willa Main Collection",
  "settings": [
    {
      "type": "checkbox",
      "id": "show_breadcrumbs",
      "label": "Show Breadcrumbs Navigation",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "show_filter_bar",
      "label": "Show Filter & Sort Bar",
      "default": true
    }
  ],
  "presets": [
    {
      "name": "Willa Main Collection"
    }
  ]
}
{% endschema %}
`;
}

// -------------------------------------------------------------
// MASTER EXECUTION FUNCTION
// -------------------------------------------------------------
async function main() {
  const token = await getAccessToken();
  console.log('Got access token. Rebuilding all sections with schema & blocks...');

  const sectionsToBuild = [
    { key: 'sections/willa-header.liquid', content: buildHeader() },
    { key: 'sections/willa-hero.liquid', content: buildHero() },
    { key: 'sections/willa-facts.liquid', content: buildFacts() },
    { key: 'sections/willa-featured-product.liquid', content: buildFeaturedProduct() },
    { key: 'sections/willa-collections-grid.liquid', content: buildCollectionsGrid() },
    { key: 'sections/willa-featured-collection.liquid', content: buildFeaturedCollection() },
    { key: 'sections/willa-steps.liquid', content: buildSteps() },
    { key: 'sections/willa-comparison.liquid', content: buildComparison() },
    { key: 'sections/willa-reviews.liquid', content: buildReviews() },
    { key: 'sections/willa-faq.liquid', content: buildFaq() },
    { key: 'sections/willa-footer.liquid', content: buildFooter() },
    { key: 'sections/willa-main-product.liquid', content: buildMainProduct() },
    { key: 'sections/willa-main-collection.liquid', content: buildMainCollection() }
  ];

  // 1. Save locally to theme/sections/
  const sectionsDir = path.resolve(ROOT_DIR, 'theme', 'sections');
  if (!fs.existsSync(sectionsDir)) {
    fs.mkdirSync(sectionsDir, { recursive: true });
  }

  for (const s of sectionsToBuild) {
    const filename = path.basename(s.key);
    const localPath = path.resolve(sectionsDir, filename);
    fs.writeFileSync(localPath, s.content, 'utf-8');
  }
  console.log(`Saved ${sectionsToBuild.length} sections locally to ${sectionsDir}`);

  // 2. Upload to Shopify Theme
  console.log('Uploading sections to Shopify active theme...');
  for (const s of sectionsToBuild) {
    await uploadThemeAsset(token, s.key, s.content);
  }

  // 3. Update sections/header-group.json with rich default blocks
  console.log('Configuring sections/header-group.json with nav_link blocks...');
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
          "nav_workshop": { type: "nav_link", settings: { title: "Home & Workshop", link: "/collections/home-and-workshop", icon: "🛠️", show_desktop: false, show_mobile: true } },
          "nav_all": { type: "nav_link", settings: { title: "Shop All Products", link: "/collections/all-products", icon: "🔍", show_desktop: false, show_mobile: true } },
          "nav_track": { type: "nav_link", settings: { title: "Track Order", link: "/pages/track-order", icon: "📦", show_desktop: true, show_mobile: true } }
        },
        block_order: ["nav_home", "nav_best", "nav_fence", "nav_power", "nav_garden", "nav_workshop", "nav_all", "nav_track"],
        settings: {
          logo_text: "ZAVELYN",
          announcement_desktop: "★ FREE US SHIPPING OVER $49 · 100% SATISFACTION GUARANTEED · 90-DAY RISK-FREE TRIAL ★",
          announcement_mobile: "★ FREE US SHIPPING OVER $49 · 90-DAY TRIAL ★"
        }
      }
    },
    order: ["willa-header"]
  };
  await uploadThemeAsset(token, 'sections/header-group.json', JSON.stringify(headerGroup, null, 2));

  // 4. Update templates/index.json with rich blocks across all sections
  console.log('Configuring templates/index.json with rich blocks...');
  const indexJson = {
    sections: {
      "hero": {
        type: "willa-hero",
        blocks: {
          "trust_1": { type: "trust_item", settings: { icon: "🛡️", highlight: "90-Day", text: "Risk-Free Trial" } },
          "trust_2": { type: "trust_item", settings: { icon: "🚚", highlight: "Free Shipping", text: "Over $49" } },
          "trust_3": { type: "trust_item", settings: { icon: "🇺🇸", highlight: "Fast US", text: "Warehouse Dispatch" } }
        },
        block_order: ["trust_1", "trust_2", "trust_3"],
        settings: {
          pill_1: "★ 2026 ZAVELYN® COLLECTION",
          pill_2: "IN STOCK & READY TO SHIP",
          heading: "Engineered for Heavy Duty. Built for Everyday Reliability.",
          desc: "Stop fighting broken equipment and low-grade tools. Zavelyn® brings you industrial-grade farm repair kits, precision ultrasonic tools, and durable homestead solutions trusted by over 100,000+ customers.",
          btn_primary_text: "EXPLORE BEST SELLERS ➔",
          btn_primary_link: "/collections/best-sellers",
          btn_secondary_text: "FARM & FENCE REPAIR",
          btn_secondary_link: "/collections/fence-and-farm"
        }
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
        settings: {
          pill_text: "THE ZAVELYN® ADVANTAGE",
          heading: "Engineered Without Compromise"
        }
      },
      "featured_offer": {
        type: "willa-featured-product",
        blocks: {
          "bundle_best": {
            type: "bundle_card",
            settings: {
              badge: "BEST SELLER • 50% OFF",
              is_best_seller: true,
              title: "2 Pack (Light + US Switch Cord)",
              subtitle: "Includes 2x Smart Lamps + 2x Switch Cords • Free Shipping",
              variant_id: "67930179436729",
              price: "89.99",
              compare_price: "179.99",
              image_url: "https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png"
            }
          },
          "bundle_starter": {
            type: "bundle_card",
            settings: {
              badge: "STARTER • 50% OFF",
              is_best_seller: false,
              title: "1 Pack (Light + US Switch Cord)",
              subtitle: "Includes 1x Smart Lamp + 1x Switch Cord",
              variant_id: "67930179403961",
              price: "49.99",
              compare_price: "99.99",
              image_url: "https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg"
            }
          }
        },
        block_order: ["bundle_best", "bundle_starter"],
        settings: {
          pill_text: "FEATURED HOMESTEAD INNOVATION",
          heading: "Zavelyn® Intelligent Livestock Heating Lamp",
          subtitle: "Auto-regulating smart thermostat, 100% sealed fireproof shell, and gentle ambient warmth. The safer way to protect baby chicks, ducks, and small livestock all season."
        }
      },
      "categories": {
        type: "willa-collections-grid",
        blocks: {
          "cat_fence": {
            type: "category_card",
            settings: {
              title: "Fence & Farm Repair",
              description: "Reinforce posts, regulate livestock heat, and automate coop care.",
              link: "/collections/fence-and-farm",
              image_url: "https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg",
              cta_text: "Shop Category →"
            }
          },
          "cat_tools": {
            type: "category_card",
            settings: {
              title: "Power & Precision Tools",
              description: "40kHz ultrasonic cutters, digital levels, and hydraulic crimpers.",
              link: "/collections/power-tools",
              image_url: "https://cdn.myshopage.com/db25d099-77fd-4ea4-8503-2f77737c8100/w1280.jpg",
              cta_text: "Shop Category →"
            }
          },
          "cat_garden": {
            type: "category_card",
            settings: {
              title: "Lawn, Garden & Outdoor",
              description: "Yard sweepers, solar motion lights, and downspout drainage.",
              link: "/collections/garden-and-outdoor",
              image_url: "https://cdn.myshopage.com/898406ff-0448-41a5-2440-fd49b2375e00/w1000.jpg",
              cta_text: "Shop Category →"
            }
          },
          "cat_home": {
            type: "category_card",
            settings: {
              title: "Home & Workshop",
              description: "Steam sanitizers, modular storage, and heavy-duty utility tools.",
              link: "/collections/home-and-workshop",
              image_url: "https://cdn.myshopage.com/8f765e2e-fcbd-4199-ab9b-433d4da5c000.jpg",
              cta_text: "Shop Category →"
            }
          }
        },
        block_order: ["cat_fence", "cat_tools", "cat_garden", "cat_home"],
        settings: {
          pill_text: "CURATED ESSENTIALS",
          heading: "Explore by Category"
        }
      },
      "best_sellers": {
        type: "willa-featured-collection",
        settings: {
          pill_text: "TOP RATED ZAVELYN® HARDWARE",
          heading: "Popular Zavelyn® Best Sellers",
          subtitle: "Real customer favorites engineered for reliability, durability, and time-saving efficiency.",
          collection: "best-sellers",
          products_to_show: 8
        }
      },
      "steps": {
        type: "willa-steps",
        blocks: {
          "step_1": { type: "step_card", settings: { step_number: "01", title: "Select Your Solution", text: "Choose from our specialized toolkits engineered specifically for fence repair, livestock care, or precision crafting." } },
          "step_2": { type: "step_card", settings: { step_number: "02", title: "Quick Plug-and-Play Setup", text: "All kits include standard US cords, mounting hardware, or screw bases. Ready to run right out of the box with zero guesswork." } },
          "step_3": { type: "step_card", settings: { step_number: "03", title: "Total Peace of Mind", text: "Every product is backed by our 90-Day Money-Back Guarantee and dedicated customer care team ready to help 7 days a week." } }
        },
        block_order: ["step_1", "step_2", "step_3"],
        settings: {
          pill_text: "HOW IT WORKS",
          heading: "Simplicity in 3 Easy Steps"
        }
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
        settings: {
          pill_text: "HEAD-TO-HEAD COMPARISON",
          heading: "Why Zavelyn® Outperforms the Rest"
        }
      },
      "reviews": {
        type: "willa-reviews",
        blocks: {
          "rev_1": { type: "review_card", settings: { author: "Debra W.", verified: true, stars: "★★★★★", title: "Total game changer for our poultry barn!", review: "Threw out my old red heat lamp the same day the Zavelyn® heating lamp arrived. It stays completely cool to the touch and baby chicks sleep soundly.", purchased_product: "Zavelyn® Intelligent Livestock Heating Lamp" } },
          "rev_2": { type: "review_card", settings: { author: "Robert M.", verified: true, stars: "★★★★★", title: "Repaired 6 rotted posts in an afternoon", review: "The Fence Post Repair Kit saved me thousands compared to replacing the whole fence line. Heavy steel, solid welds, drove straight into the ground.", purchased_product: "Zavelyn® Fence Post Repair Kit" } },
          "rev_3": { type: "review_card", settings: { author: "Ethan Walker", verified: true, stars: "★★★★★", title: "Unbelievable precision for model crafting", review: "The 40kHz Ultrasonic Precision Cutter slices through 3D print supports, dense acrylic, and resin without cracking or melting margins.", purchased_product: "Zavelyn® 40kHz Ultrasonic Precision Cutter Kit" } }
        },
        block_order: ["rev_1", "rev_2", "rev_3"],
        settings: {
          pill_text: "REAL EXPERIENCES",
          heading: "Trusted by Hardworking Makers & Farmers"
        }
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
        settings: {
          pill_text: "GOT QUESTIONS?",
          heading: "Frequently Asked Questions"
        }
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

  // 5. Update templates/product.json with accordion blocks
  console.log('Configuring templates/product.json with accordion blocks...');
  const productJson = {
    sections: {
      "main": {
        type: "willa-main-product",
        blocks: {
          "acc_desc": { type: "accordion_item", settings: { title: "Product Description", use_product_description: true, open_default: true } },
          "acc_shipping": { type: "accordion_item", settings: { title: "Shipping & Delivery Information", content: "Orders are dispatched within 24 hours from our US warehouses. Free standard shipping is automatically applied to orders over $49. Delivery takes 3–5 business days with live tracking.", use_product_description: false, open_default: false } },
          "acc_warranty": { type: "accordion_item", settings: { title: "Warranty & Returns", content: "We offer an unconditional 90-day money-back guarantee. If you are not completely satisfied, email support@tryzavelyn.com for an immediate exchange or refund.", use_product_description: false, open_default: false } }
        },
        block_order: ["acc_desc", "acc_shipping", "acc_warranty"],
        settings: {
          show_breadcrumbs: true,
          enable_sticky_atc: true,
          badge_text: "SPECIAL OFFER"
        }
      }
    },
    order: ["main"]
  };
  await uploadThemeAsset(token, 'templates/product.json', JSON.stringify(productJson, null, 2));

  console.log('✔ SUCCESS! All theme schemas and blocks have been generated and deployed to Shopify!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
