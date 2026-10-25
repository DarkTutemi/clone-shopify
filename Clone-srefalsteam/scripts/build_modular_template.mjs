import fs from 'fs';

const seeded = JSON.parse(fs.readFileSync('Clone-srefalsteam/data/seeded_product.json', 'utf8'));
const fullHtml = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');
const rootVars = fs.readFileSync('Clone-srefalsteam/data/atlas_root_vars.css', 'utf8');

const OLD_VARIANT_ID = '56604272591174';
const NEW_VARIANT_ID = String(seeded.variantId);
const OLD_PRODUCT_ID = '15562968269126';
const NEW_PRODUCT_ID = String(seeded.productId);

console.log('--- SLICING & ENHANCING SREFALSTEAM SNIPPETS ---');

// 1. Snippet: srefalsteam-head.liquid
const headSnippet = `<!-- SrefalSteam Design Tokens & Stylesheets -->
${rootVars}

<link rel="stylesheet" href="https://srefal.com/cdn/shop/t/1/assets/base.css">
<link rel="stylesheet" href="https://srefal.com/cdn/shop/t/1/compiled_assets/styles.css">
<link rel="stylesheet" href="https://srefal.com/cdn/shop/t/1/assets/atlas-base.min.css">
<link rel="stylesheet" href="https://srefal.com/cdn/shop/t/1/assets/atlas-vendors.min.css">
<link rel="stylesheet" href="https://srefal.com/cdn/shop/t/1/assets/atlas-custom.css">
<link rel="stylesheet" href="https://srefal.com/cdn/shop/t/1/assets/atlas-base-deferred.min.css">
<link rel="stylesheet" href="https://srefal.com/cdn/shop/t/1/assets/atlas-component-sticky-atc.css">
<link rel="stylesheet" href="https://srefal.com/cdn/shop/t/1/assets/atlas-component-rating.css">
<link rel="stylesheet" href="https://cdn.shopify.com/extensions/01a1661e-c2d6-72f3-9abc-23caaf8765f1/dropshipt-4-507/assets/bundle.css">
<link rel="stylesheet" href="https://srefal.com/cdn/shop/t/1/assets/atlas-component-mini-reviews.css">
<link rel="stylesheet" href="https://srefal.com/cdn/shop/t/1/assets/atlas-collapsible-content.css">
<link rel="stylesheet" href="https://cdn.shopify.com/extensions/01a1661e-c2d6-72f3-9abc-23caaf8765f1/dropshipt-4-507/assets/swiper-bundle.min.css">

<style>
  #MainContent { overflow-x: hidden; }
  .product-form-button-text { letter-spacing: 1px; font-size: 18px !important; }
  
  /* Comparison Slider Perfect Formatting */
  .comparison-slider {
    position: relative;
    overflow: hidden;
    aspect-ratio: var(--ratio, 16/9);
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }
  .comparison-slider__container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .comparison-slider__media-wrapper {
    --compare: 50;
    position: relative;
    width: 100%;
    height: 100%;
    display: grid !important;
    grid-template: 1fr / 1fr !important;
    overflow: hidden;
  }
  .comparison-slider__layer {
    grid-area: 1 / 1 !important;
    position: relative;
    width: 100%;
    height: 100%;
  }
  .comparison-slider__layer img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  [data-orientation=horizontal] .comparison-slider__layer--before {
    clip-path: inset(0 calc((100 - var(--compare)) * 1%) 0 0) !important;
    z-index: 2;
  }
  [data-orientation=horizontal] .comparison-slider__layer--after {
    clip-path: inset(0 0 0 calc(var(--compare) * 1%)) !important;
    z-index: 1;
  }
  .comparison-slider__media-wrapper:before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(var(--compare) * 1%);
    width: 3px;
    background: #ffffff;
    box-shadow: 0 0 8px rgba(0,0,0,0.5);
    z-index: 5;
    pointer-events: none;
    transform: translateX(-50%);
  }
  .comparison-slider__media-wrapper:after {
    content: "◀ ▶";
    position: absolute;
    top: 50%;
    left: calc(var(--compare) * 1%);
    width: 38px;
    height: 38px;
    background: #ffffff;
    border-radius: 50%;
    color: #111;
    font-size: 11px;
    letter-spacing: -1px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.35);
    z-index: 6;
    pointer-events: none;
    transform: translate(-50%, -50%);
  }
  .cs-slider {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: ew-resize;
    z-index: 10;
    margin: 0;
  }

  /* Sticky ATC */
  .sticky-atc {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  .sticky-atc.is-visible {
    transform: translateY(0) !important;
    opacity: 1 !important;
  }
</style>

<script async crossorigin fetchpriority="high" src="https://cdn.shopify.com/shopifycloud/importmap-polyfill/es-modules-shim.2.4.0.js"></script>
<script type="importmap">
  {
    "imports": {
      "@theme/overflow-list": "https://srefal.com/cdn/shop/t/1/assets/overflow-list.js",
      "@theme/product-title": "https://srefal.com/cdn/shop/t/1/assets/product-title-truncation.js",
      "@theme/component": "https://srefal.com/cdn/shop/t/1/assets/component.js",
      "@theme/dialog": "https://srefal.com/cdn/shop/t/1/assets/dialog.js",
      "@theme/events": "https://srefal.com/cdn/shop/t/1/assets/events.js",
      "@theme/focus": "https://srefal.com/cdn/shop/t/1/assets/focus.js",
      "@theme/morph": "https://srefal.com/cdn/shop/t/1/assets/morph.js",
      "@theme/paginated-list": "https://srefal.com/cdn/shop/t/1/assets/paginated-list.js",
      "@theme/performance": "https://srefal.com/cdn/shop/t/1/assets/performance.js",
      "@theme/product-form": "https://srefal.com/cdn/shop/t/1/assets/product-form.js",
      "@theme/recently-viewed-products": "https://srefal.com/cdn/shop/t/1/assets/recently-viewed-products.js",
      "@theme/scrolling": "https://srefal.com/cdn/shop/t/1/assets/scrolling.js",
      "@theme/section-renderer": "https://srefal.com/cdn/shop/t/1/assets/section-renderer.js",
      "@theme/section-hydration": "https://srefal.com/cdn/shop/t/1/assets/section-hydration.js",
      "@theme/money-formatting": "https://srefal.com/cdn/shop/t/1/assets/money-formatting.js",
      "@theme/utilities": "https://srefal.com/cdn/shop/t/1/assets/utilities.js",
      "@theme/variant-picker": "https://srefal.com/cdn/shop/t/1/assets/variant-picker.js",
      "@theme/media-gallery": "https://srefal.com/cdn/shop/t/1/assets/media-gallery.js",
      "@theme/quick-add": "https://srefal.com/cdn/shop/t/1/assets/quick-add.js",
      "@theme/paginated-list-aspect-ratio": "https://srefal.com/cdn/shop/t/1/assets/paginated-list-aspect-ratio.js",
      "@theme/popover-polyfill": "https://srefal.com/cdn/shop/t/1/assets/popover-polyfill.js",
      "@theme/component-quantity-selector": "https://srefal.com/cdn/shop/t/1/assets/component-quantity-selector.js",
      "@theme/comparison-slider": "https://srefal.com/cdn/shop/t/1/assets/comparison-slider.js",
      "@theme/sticky-add-to-cart": "https://srefal.com/cdn/shop/t/1/assets/sticky-add-to-cart.js",
      "@theme/fly-to-cart": "https://srefal.com/cdn/shop/t/1/assets/fly-to-cart.js"
    }
  }
</script>
`;

// Extract chunks from fullHtml
const sIdx = fullHtml.indexOf('template--27870995579206__atlas_dependencies');
const nextIdx = fullHtml.indexOf('template--27870995579206__scrolling_images_UgXcTG');
const mainEndIdx = fullHtml.indexOf('</main>');

let heroChunk = fullHtml.slice(sIdx - 30, nextIdx - 30);
let sectionsChunk = fullHtml.slice(nextIdx - 30, mainEndIdx);

// Apply ID replacements
heroChunk = heroChunk.replaceAll(OLD_VARIANT_ID, NEW_VARIANT_ID).replaceAll(OLD_PRODUCT_ID, NEW_PRODUCT_ID);
sectionsChunk = sectionsChunk.replaceAll(OLD_VARIANT_ID, NEW_VARIANT_ID).replaceAll(OLD_PRODUCT_ID, NEW_PRODUCT_ID);

// Remove remote app blocking scripts
heroChunk = heroChunk.replace(/<script[^>]*>(?:(?!<\/script>)[\s\S])*app\.helloatlas\.io(?:(?!<\/script>)[\s\S])*<\/script>/gi, '');
heroChunk = heroChunk.replace(/<script[^>]+src="[^"]*progressive-gift-monitor[^"]*"[^>]*><\/script>/gi, '');

// Inject Special Deal
const bundlePlaceholder = '<div class="atlas-bundler-render bundle-qty-deal"></div>';
const bundleRenderedHtml = `
<div class="atlas-bundler-render bundle-qty-deal">
  <div class="bundle-qty-deal__header" style="text-align: center; margin-bottom: 10px;">
    <span class="bundle-qty-deal__title" style="font-weight: 800; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color: #111;">SPECIAL DEAL</span>
  </div>
  <div class="bundle-qty-option selected" style="border: 2px solid #111; border-radius: 8px; overflow: hidden; background: #fff; cursor: pointer; position: relative;">
    <div class="bundle-qty-option-inner" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; position: relative;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <input type="radio" checked name="bundle-deal" style="width: 20px; height: 20px; accent-color: #1b3040; margin: 0; cursor: pointer;">
        <div>
          <div style="font-weight: 700; font-size: 16px; color: #111; line-height: 1.2;">Promo Clean</div>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #666; margin-top: 4px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Limited Time Offer</span>
          </div>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="position: absolute; top: 0; right: 0; background: #000; color: #fff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-bottom-left-radius: 8px; letter-spacing: 0.5px;">40%OFF + 1 FREE GIFT</div>
        <div style="margin-top: 14px;">
          <span style="font-size: 20px; font-weight: 800; color: #111;">$89.99</span>
          <span style="font-size: 14px; color: #888; text-decoration: line-through; margin-left: 6px;">$149.99</span>
        </div>
      </div>
    </div>
    <div class="bundle-qty-gift-bar" style="background: #293e50; color: #ffffff; padding: 10px 16px; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; border-top: 1px solid rgba(255,255,255,0.1);">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>
      <span>+FREE 4x Attachment Nozzles</span>
    </div>
  </div>
</div>
`;

if (heroChunk.includes(bundlePlaceholder)) {
  heroChunk = heroChunk.replace(bundlePlaceholder, bundleRenderedHtml);
}
heroChunk = heroChunk.replace(/<input[^>]+name="id"[^>]+disabled[^>]*>/gi, `<input type="hidden" name="id" value="${NEW_VARIANT_ID}" class="product-variant-id">`);

// Separate styles from heroChunk into heroStyles
let heroStyles = '';
heroChunk = heroChunk.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match) => {
  heroStyles += match + '\n';
  return '';
});

// 4. Scripts snippet
const scriptsSnippet = `
<script>
(function() {
  const VARIANT_ID = "${NEW_VARIANT_ID}";

  function addToCart(qty = 1) {
    const btns = document.querySelectorAll('button[name="add"], .sticky-atc button, #atc-button-template--27870995579206__main');
    btns.forEach(b => {
      b.disabled = true;
      const textSpan = b.querySelector('.button-text') || b;
      textSpan.innerHTML = 'ADDING...';
    });

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Number(VARIANT_ID), quantity: qty })
    })
    .then(res => res.json())
    .then(data => {
      btns.forEach(b => {
        const textSpan = b.querySelector('.button-text') || b;
        textSpan.innerHTML = 'ADDED ✓';
      });
      setTimeout(() => { window.location.href = '/cart'; }, 500);
    })
    .catch(err => {
      console.error('Cart add error:', err);
      window.location.href = '/cart/add?id=' + VARIANT_ID + '&quantity=' + qty;
    });
  }

  document.addEventListener('submit', function(e) {
    const form = e.target.closest('form');
    if (form && (form.action.includes('/cart/add') || form.querySelector('input[name="id"]'))) {
      e.preventDefault();
      addToCart(1);
    }
  });

  document.addEventListener('click', function(e) {
    const atcBtn = e.target.closest('button[name="add"], .sticky-atc button, #atc-button-template--27870995579206__main');
    if (atcBtn) {
      e.preventDefault();
      addToCart(1);
    }
  });

  function initAccordions() {
    document.querySelectorAll('button[class*="accordionButtonStyle"]').forEach(btn => {
      if (btn.dataset.initialized) return;
      btn.dataset.initialized = 'true';
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('active');
        const panel = this.nextElementSibling;
        if (panel) {
          if (panel.style.maxHeight && panel.style.maxHeight !== '0px') {
            panel.style.maxHeight = '0px';
          } else {
            panel.style.maxHeight = (panel.scrollHeight + 50) + 'px';
          }
        }
      });
    });
  }

  function initComparisonSliders() {
    document.querySelectorAll('comparison-slider-component').forEach(comp => {
      if (comp.dataset.initialized) return;
      comp.dataset.initialized = 'true';
      const wrapper = comp.querySelector('[data-orientation]') || comp.querySelector('.comparison-slider__media-wrapper') || comp;
      const slider = comp.querySelector('input[type="range"]');
      if (slider && wrapper) {
        const update = () => {
          const min = Number(slider.min || 0);
          const max = Number(slider.max || 100);
          const val = Number(slider.value);
          const percent = Math.round(((val - min) / (max - min)) * 100);
          wrapper.style.setProperty('--compare', percent);
        };
        slider.addEventListener('input', update);
        slider.addEventListener('change', update);
        update();
      }
    });
  }

  function initGallerySwitch() {
    const mainImages = document.querySelectorAll('.product__media-list .product__media-item img, .product__media img');
    document.querySelectorAll('.thumbnail-list__item button').forEach((btn, idx) => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const clickedImg = btn.querySelector('img');
        if (clickedImg && mainImages.length > 0) {
          mainImages[0].src = clickedImg.src;
          if (mainImages[0].srcset) mainImages[0].srcset = clickedImg.src;
        }
        document.querySelectorAll('.thumbnail-list__item').forEach(li => li.classList.remove('is-active'));
        btn.closest('.thumbnail-list__item')?.classList.add('is-active');
      });
    });
  }

  function initStickyAtc() {
    const sticky = document.querySelector('.sticky-atc');
    const trigger = document.querySelector('button[name="add"]') || document.querySelector('.product-form');
    if (!sticky || !trigger) return;

    window.addEventListener('scroll', () => {
      const rect = trigger.getBoundingClientRect();
      if (rect.bottom < 0) {
        sticky.classList.add('is-visible');
        sticky.style.transform = 'translateY(0)';
        sticky.style.opacity = '1';
      } else {
        sticky.classList.remove('is-visible');
        sticky.style.transform = 'translateY(100%)';
        sticky.style.opacity = '0';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initAccordions();
    initComparisonSliders();
    initGallerySwitch();
    initStickyAtc();
  });

  setTimeout(() => {
    initAccordions();
    initComparisonSliders();
    initGallerySwitch();
    initStickyAtc();
  }, 1000);
})();
</script>
`;

// Master Template: product.srefalsteam.liquid
const masterTemplate = `{% layout 'theme' %}

{% render 'srefalsteam-head' %}
{% render 'srefalsteam-hero-styles' %}

<div class="srefalsteam-page-container">
  {% render 'srefalsteam-hero' %}
  {% render 'srefalsteam-sections' %}
</div>

{% render 'srefalsteam-scripts' %}
`;

// Write all snippets and template
fs.writeFileSync('Clone-srefalsteam/theme/snippets/srefalsteam-head.liquid', headSnippet);
fs.writeFileSync('Clone-srefalsteam/theme/snippets/srefalsteam-hero-styles.liquid', heroStyles);
fs.writeFileSync('Clone-srefalsteam/theme/snippets/srefalsteam-hero.liquid', heroChunk);
fs.writeFileSync('Clone-srefalsteam/theme/snippets/srefalsteam-sections.liquid', sectionsChunk);
fs.writeFileSync('Clone-srefalsteam/theme/snippets/srefalsteam-scripts.liquid', scriptsSnippet);
fs.writeFileSync('Clone-srefalsteam/theme/templates/product.srefalsteam.liquid', masterTemplate);

console.log('✔ srefalsteam-head.liquid size:', headSnippet.length, 'bytes');
console.log('✔ srefalsteam-hero-styles.liquid size:', heroStyles.length, 'bytes');
console.log('✔ srefalsteam-hero.liquid size:', heroChunk.length, 'bytes');
console.log('✔ srefalsteam-sections.liquid size:', sectionsChunk.length, 'bytes');
console.log('✔ srefalsteam-scripts.liquid size:', scriptsSnippet.length, 'bytes');
console.log('✔ product.srefalsteam.liquid size:', masterTemplate.length, 'bytes');
console.log('All chunks ready for deployment!');
