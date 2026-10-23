import fs from 'fs';
import path from 'path';

const SECTIONS_DIR = 'h:/Shopify-Clone/Clone-earthlyderm/sections';

// 2. earthly-header.liquid
const headerLiquid = `
{% schema %}
{
  "name": "Earthly Header",
  "settings": []
}
{% endschema %}

<header class="earthly-header" role="banner">
  <div class="earthly-header-inner">
    <!-- Mobile Menu Button -->
    <button class="earthly-mobile-toggle" aria-label="Open Navigation" onclick="toggleEarthlyDrawer()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    <!-- Logo -->
    <a href="/" class="earthly-logo">
      <img src="//earthlyderm.com/cdn/shop/files/Earthlyderm_logo.png?v=1769464825&width=300" alt="Earthly Derm" width="130" height="65">
    </a>

    <!-- Desktop Navigation Links -->
    <nav class="earthly-nav" role="navigation">
      <a href="/" class="earthly-nav-item {% if request.path == '/' %}active{% endif %}">Home</a>
      <a href="/collections/earthly-derm" class="earthly-nav-item {% if request.path contains '/collections' %}active{% endif %}">Shop</a>
      <a href="/pages/our-story" class="earthly-nav-item {% if request.path contains 'our-story' %}active{% endif %}">Our Story</a>
      <a href="/pages/customer-reviews" class="earthly-nav-item {% if request.path contains 'customer-reviews' %}active{% endif %}">Customer Reviews</a>
      <div class="earthly-dropdown-wrapper">
        <a href="/pages/contact" class="earthly-nav-item dropdown-toggle">Help Center ▾</a>
        <div class="earthly-dropdown-menu">
          <a href="/apps/parcelpanel">Track Your Order</a>
          <a href="/pages/contact">Contact Us</a>
          <a href="/policies/refund-policy">Returns Policy</a>
          <a href="/policies/shipping-policy">Shipping Policy</a>
          <a href="/policies/terms-of-service">Terms of Service</a>
        </div>
      </div>
    </nav>

    <!-- Header Actions -->
    <div class="earthly-actions">
      <a href="/search" class="earthly-action-icon" aria-label="Search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </a>
      <a href="/account" class="earthly-action-icon" aria-label="Account">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </a>
      <a href="/cart" class="earthly-action-icon earthly-cart-trigger" aria-label="Cart" onclick="event.preventDefault(); openEarthlyCartDrawer();">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <span class="earthly-cart-count" id="earthlyCartCount">{{ cart.item_count }}</span>
      </a>
    </div>
  </div>
</header>

<!-- Mobile Navigation Drawer -->
<div class="earthly-drawer-overlay" id="earthlyDrawerOverlay" onclick="toggleEarthlyDrawer()"></div>
<div class="earthly-mobile-drawer" id="earthlyMobileDrawer">
  <div class="earthly-drawer-header">
    <img src="//earthlyderm.com/cdn/shop/files/Earthlyderm_logo.png?v=1769464825&width=200" alt="Earthly Derm" width="110">
    <button class="earthly-drawer-close" onclick="toggleEarthlyDrawer()">&times;</button>
  </div>
  <nav class="earthly-drawer-nav">
    <a href="/" class="drawer-link">Home</a>
    <a href="/collections/earthly-derm" class="drawer-link">Shop</a>
    <a href="/pages/our-story" class="drawer-link">Our Story</a>
    <a href="/pages/customer-reviews" class="drawer-link">Customer Reviews</a>
    <a href="/pages/contact" class="drawer-link">Contact Us</a>
    <a href="/apps/parcelpanel" class="drawer-link">Track Your Order</a>
    <a href="/policies/refund-policy" class="drawer-link">Returns Policy</a>
    <a href="/policies/shipping-policy" class="drawer-link">Shipping Policy</a>
  </nav>
</div>

<style>
.earthly-header {
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 10px 24px;
}
.earthly-header-inner {
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.earthly-logo img {
  display: block;
  max-height: 52px;
  width: auto;
}
.earthly-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}
.earthly-nav-item {
  color: #1a1a1a;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s ease;
}
.earthly-nav-item:hover, .earthly-nav-item.active {
  color: #2C5801;
  font-weight: 600;
}
.earthly-dropdown-wrapper {
  position: relative;
}
.earthly-dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #ffffff;
  min-width: 200px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  border-radius: 8px;
  padding: 10px 0;
  z-index: 1001;
}
.earthly-dropdown-wrapper:hover .earthly-dropdown-menu {
  display: flex;
  flex-direction: column;
}
.earthly-dropdown-menu a {
  padding: 10px 20px;
  color: #333333;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
}
.earthly-dropdown-menu a:hover {
  background: #f7faf4;
  color: #2C5801;
}
.earthly-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}
.earthly-action-icon {
  color: #1a1a1a;
  position: relative;
  display: flex;
  align-items: center;
}
.earthly-cart-count {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #2C5801;
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
.earthly-mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}
.earthly-drawer-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 2000;
}
.earthly-mobile-drawer {
  position: fixed;
  top: 0;
  left: -300px;
  width: 280px;
  height: 100%;
  background: #ffffff;
  z-index: 2001;
  transition: left 0.3s ease;
  padding: 24px;
  box-shadow: 2px 0 12px rgba(0,0,0,0.1);
}
.earthly-mobile-drawer.open {
  left: 0;
}
.earthly-drawer-overlay.open {
  display: block;
}
.earthly-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.earthly-drawer-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
}
.earthly-drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.drawer-link {
  color: #1a1a1a;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 500;
}
@media (max-width: 900px) {
  .earthly-nav { display: none; }
  .earthly-mobile-toggle { display: block; }
}
</style>

<script>
function toggleEarthlyDrawer() {
  var d = document.getElementById('earthlyMobileDrawer');
  var o = document.getElementById('earthlyDrawerOverlay');
  if (d && o) {
    d.classList.toggle('open');
    o.classList.toggle('open');
  }
}
</script>
`;

fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-header.liquid'), headerLiquid.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-header.liquid');

// 3. earthly-hero.liquid
const heroLiquid = `
{% schema %}
{
  "name": "Earthly Hero Banner",
  "settings": []
}
{% endschema %}

<section class="s-hero-banner" role="region" aria-label="Hero banner">
  <div class="s-hero-banner__container">
    <div class="s-hero-banner__image-wrapper">
      <div class="s-hero-banner__image s-hero-banner__image--desktop">
        <picture>
          <source srcset="//earthlyderm.com/cdn/shop/files/rework_4_1.jpg?format=webp&v=1786568088&width=800 800w, //earthlyderm.com/cdn/shop/files/rework_4_1.jpg?format=webp&v=1786568088&width=1600 1600w" type="image/webp">
          <img src="//earthlyderm.com/cdn/shop/files/rework_4_1.jpg?v=1786568088&width=1200" alt="Earthly Derm Skincare" class="s-hero-banner__image-img">
        </picture>
      </div>
      <div class="s-hero-banner__image s-hero-banner__image--mobile">
        <picture>
          <source srcset="//earthlyderm.com/cdn/shop/files/rework_4_1.jpg?format=webp&v=1786568088&width=640 640w" type="image/webp">
          <img src="//earthlyderm.com/cdn/shop/files/rework_4_1.jpg?v=1786568088&width=640" alt="Earthly Derm Skincare" class="s-hero-banner__image-img">
        </picture>
      </div>
    </div>

    <div class="s-hero-banner__content-wrapper">
      <div class="s-hero-banner__content">
        <div class="s-hero-banner__highlight-label">
          BLACK MONTH SALE: UP TO 49% OFF
        </div>

        <div class="s-hero-banner__review">
          <div class="s-hero-banner__stars">
            ★★★★★
          </div>
          <span class="s-hero-banner__review-text">Rated 4.8/5 by 30,000+ Happy Customers</span>
        </div>

        <h1 class="s-hero-banner__title">
          Earth's Remedy for Melanin-Rich Skin
        </h1>

        <p class="s-hero-banner__subtitle">
          No bleaching. No burning. Just your skin, at its best.
        </p>

        <a href="/collections/earthly-derm" class="s-hero-banner__button">
          SHOP & SAVE NOW
        </a>
      </div>
    </div>
  </div>
</section>

<style>
.s-hero-banner {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #ffffff;
}
.s-hero-banner__container {
  display: flex;
  flex-direction: row;
  min-height: 580px;
}
.s-hero-banner__image-wrapper {
  flex: 1 1 50%;
  position: relative;
  overflow: hidden;
}
.s-hero-banner__image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.s-hero-banner__image--mobile {
  display: none;
}
.s-hero-banner__content-wrapper {
  flex: 1 1 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 48px;
  background: #ffffff;
}
.s-hero-banner__content {
  max-width: 540px;
}
.s-hero-banner__highlight-label {
  display: inline-block;
  background-color: #f6fcf1;
  color: #2c5801;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 6px 14px;
  border-radius: 4px;
  margin-bottom: 18px;
}
.s-hero-banner__review {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}
.s-hero-banner__stars {
  color: #F1B948;
  font-size: 18px;
  letter-spacing: 2px;
}
.s-hero-banner__review-text {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #4a4a4a;
}
.s-hero-banner__title {
  font-family: 'Playfair Display', serif;
  font-size: 46px;
  font-weight: 700;
  line-height: 1.15;
  color: #0b0b0b;
  margin: 0 0 18px 0;
}
.s-hero-banner__subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 17px;
  font-style: italic;
  font-weight: 400;
  line-height: 1.5;
  color: #4a4a4a;
  margin: 0 0 32px 0;
}
.s-hero-banner__button {
  display: inline-block;
  background-color: #2c5801;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  text-decoration: none;
  padding: 16px 42px;
  border-radius: 6px;
  transition: background-color 0.2s ease, transform 0.2s ease;
  box-shadow: 0 4px 14px rgba(44, 88, 1, 0.3);
}
.s-hero-banner__button:hover {
  background-color: #1e3d01;
  transform: translateY(-2px);
}
@media (max-width: 900px) {
  .s-hero-banner__container {
    flex-direction: column-reverse;
  }
  .s-hero-banner__image--desktop {
    display: none;
  }
  .s-hero-banner__image--mobile {
    display: block;
  }
  .s-hero-banner__title {
    font-size: 32px;
  }
  .s-hero-banner__content-wrapper {
    padding: 36px 20px;
  }
}
</style>
`;

fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-hero.liquid'), heroLiquid.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-hero.liquid');

// 4. earthly-promo-bar.liquid
const promoBarLiquid = `
{% schema %}
{
  "name": "Earthly Promo Bar",
  "settings": []
}
{% endschema %}

<section class="s-promo-bar">
  <div class="s-promo-bar__container">
    <div class="pb__line1">BLACK MONTH SALE IS LIVE</div>
    <div class="pb__line2">Buy 2 Get 1 FREE + Save 30% Site-wide on all handcrafted soap bars!</div>
  </div>
</section>

<style>
.s-promo-bar {
  background: linear-gradient(92deg, rgba(44, 88, 1, 1), rgba(161, 196, 153, 0.4) 50%, rgba(246, 252, 241, 1) 88%);
  padding: 16px 20px;
  text-align: center;
}
.pb__line1 {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 24px;
  color: #1f1f1f;
  line-height: 1.2;
}
.pb__line2 {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: #1f1f1f;
  margin-top: 4px;
}
@media (max-width: 768px) {
  .pb__line1 { font-size: 18px; }
  .pb__line2 { font-size: 13px; }
}
</style>
`;

fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-promo-bar.liquid'), promoBarLiquid.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-promo-bar.liquid');
