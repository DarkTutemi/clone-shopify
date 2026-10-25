import fs from 'fs';

const seeded = JSON.parse(fs.readFileSync('Clone-thoson/data/seeded_product.json', 'utf8'));
const fullHtml = fs.readFileSync('Clone-thoson/data/product.html', 'utf8');
const rootVars = fs.readFileSync('Clone-thoson/data/thx_root_vars.css', 'utf8');

const OLD_PRODUCT_ID = '10481778852177';
const NEW_PRODUCT_ID = String(seeded.productId);

// Variant ID mappings
const VARIANTS = {
  Rookie: {
    oldId: '52382835933521',
    newId: String(seeded.variants.find(v => v.title === 'Rookie').id),
    price: '$69',
    compare: '$139',
    discount: 'SAVE 50%'
  },
  PRO: {
    oldId: '52382835966289',
    newId: String(seeded.variants.find(v => v.title === 'PRO').id),
    price: '$119',
    compare: '$169',
    discount: 'SAVE 30%'
  },
  Master: {
    oldId: '52382836031825',
    newId: String(seeded.variants.find(v => v.title === 'Master').id),
    price: '$159',
    compare: '$299',
    discount: 'SAVE 47%'
  }
};

console.log('--- BUILDING THOSON MAGTRACK TEMPLATE ---');
console.log('Seeded product ID:', NEW_PRODUCT_ID);
console.log('Variant mappings:', VARIANTS);

// 1. Snippet: thoson-head.liquid
const headSnippet = `<!-- Thoson MagTrack Design Tokens & Stylesheets -->
${rootVars}

<link rel="stylesheet" href="https://thoson.com/cdn/shop/t/42/assets/base.css">
<link rel="stylesheet" href="https://thoson.com/cdn/shop/t/42/assets/thx-global.css">
<link rel="stylesheet" href="https://thoson.com/cdn/shop/t/42/assets/thx-product.css">
<link rel="stylesheet" href="https://thoson.com/cdn/shop/t/42/assets/thx-qb-select.css">
<link rel="stylesheet" href="https://thoson.com/cdn/shop/t/42/assets/thx-pdp-lower.css">
<link rel="stylesheet" href="https://thoson.com/cdn/shop/t/42/assets/thx-cards.css">
<link rel="stylesheet" href="https://thoson.com/cdn/shop/t/42/assets/thx-headlines.css">
<link rel="stylesheet" href="https://thoson.com/cdn/shop/t/42/assets/thx-rhythm.css">
<link rel="stylesheet" href="https://thoson.com/cdn/shop/t/42/assets/thx-comparison.css">
<link rel="stylesheet" href="https://thoson.com/cdn/shop/t/42/assets/thx-mobile.css">

<style>
  #MainContent { overflow-x: hidden; }
  /* Sticky Product Bar */
  .thx-sticky-atc-bar {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(120px);
    background: #ffffff;
    border-radius: 50px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 14px 8px 10px;
    z-index: 9999;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
    opacity: 0;
    max-width: 95vw;
  }
  .thx-sticky-atc-bar.is-visible {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  .thx-sticky-atc-bar img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
  }
  .thx-sticky-title {
    font-weight: 700;
    font-size: 14px;
    color: #111;
  }
  .thx-sticky-price {
    font-weight: 800;
    font-size: 15px;
    color: #ff6e26;
  }
  .thx-sticky-compare {
    font-size: 13px;
    color: #888;
    text-decoration: line-through;
    margin-left: 4px;
  }
  .thx-sticky-select {
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 600;
    background: #fdfdfd;
    cursor: pointer;
    outline: none;
  }
  .thx-sticky-btn {
    background: linear-gradient(135deg, #ff7e1b, #f35900);
    color: #ffffff;
    font-weight: 800;
    font-size: 14px;
    padding: 10px 20px;
    border-radius: 30px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(243, 89, 0, 0.4);
    transition: transform 0.15s ease, filter 0.15s ease;
  }
  .thx-sticky-btn:hover {
    filter: brightness(1.08);
    transform: scale(1.02);
  }

  /* Quantity break card active style */
  .quantity-break {
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .quantity-breaks-container input[type="radio"]:checked + .quantity-break {
    border-color: #ff6e26 !important;
    box-shadow: 0 0 0 1px #ff6e26;
  }
</style>
`;

// Extract <main> content
const mainMatch = fullHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (!mainMatch) {
  throw new Error('No main tag found');
}
const mainHtml = mainMatch[1];

// Split into Hero and Sections
// Hero is template--32757201404241__main
const heroStart = mainHtml.indexOf('id="shopify-section-template--32757201404241__main"');
const heroTagStart = mainHtml.lastIndexOf('<', heroStart);
const tickerStart = mainHtml.indexOf('id="shopify-section-template--32757201404241__horizontal_ticker_KLdqwG"');
const tickerTagStart = mainHtml.lastIndexOf('<', tickerStart);

let heroChunk = mainHtml.slice(heroTagStart, tickerTagStart);
let sectionsChunk = mainHtml.slice(tickerTagStart);

// Apply ID replacements to both
function replaceIds(chunk) {
  let c = chunk;
  c = c.replaceAll(OLD_PRODUCT_ID, NEW_PRODUCT_ID);
  for (const v of Object.values(VARIANTS)) {
    c = c.replaceAll(v.oldId, v.newId);
  }
  return c;
}

heroChunk = replaceIds(heroChunk);
sectionsChunk = replaceIds(sectionsChunk);

// 3. Scripts snippet
const scriptsSnippet = `
<!-- Thoson Interactive Engine -->
<div class="thx-sticky-atc-bar" id="thxStickyBar">
  <img src="https://cdn.shopify.com/s/files/1/0916/9852/8593/files/Untitled_design_1.png?v=1775435140" alt="Thoson MagTrack">
  <div>
    <div class="thx-sticky-title">Thoson MagTrack™</div>
    <div>
      <span class="thx-sticky-price" id="thxStickyPrice">$69</span>
      <span class="thx-sticky-compare" id="thxStickyCompare">$139</span>
      <span style="font-size:11px; background:#2956e6; color:#fff; padding:2px 6px; border-radius:10px; margin-left:4px; font-weight:700;" id="thxStickyDiscount">SAVE 50%</span>
    </div>
  </div>
  <select class="thx-sticky-select" id="thxStickySelect">
    <option value="${VARIANTS.Rookie.newId}">Rookie · 32 pcs ($69)</option>
    <option value="${VARIANTS.PRO.newId}">Pro · 68 pcs ($119)</option>
    <option value="${VARIANTS.Master.newId}">Master · 145 pcs ($159)</option>
  </select>
  <button class="thx-sticky-btn" id="thxStickyBtn">Add to cart</button>
</div>

<script>
(function() {
  const VARIANTS_DATA = {
    "${VARIANTS.Rookie.newId}": { price: "$69", compare: "$139", discount: "SAVE 50%", title: "Rookie" },
    "${VARIANTS.PRO.newId}": { price: "$119", compare: "$169", discount: "SAVE 30%", title: "PRO" },
    "${VARIANTS.Master.newId}": { price: "$159", compare: "$299", discount: "SAVE 47%", title: "Master" }
  };

  let currentVariantId = "${VARIANTS.Rookie.newId}";

  function updateVariantUI(variantId) {
    currentVariantId = variantId;
    const v = VARIANTS_DATA[variantId];
    if (!v) return;

    // 1. Update Hero Price
    const heroPrice = document.querySelector('.price-item--sale, .price__sale .price-item, .price-item--regular');
    const heroCompare = document.querySelector('.price-item--compare, .price__sale s');
    const badge = document.querySelector('.price-badge, .save-badge, [class*="badge"]');

    document.querySelectorAll('.price-item--sale, .price__sale .price-item').forEach(el => el.textContent = v.price);
    document.querySelectorAll('.price-item--compare, .price__sale s, .price-item--regular').forEach(el => el.textContent = v.compare);
    document.querySelectorAll('.price__badge-sale, [class*="discount-badge"]').forEach(el => el.textContent = v.discount);

    // 2. Update Hidden Form Inputs
    document.querySelectorAll('input[name="id"]').forEach(input => {
      input.value = variantId;
    });

    // 3. Update Sticky Bar
    const stickyPrice = document.getElementById('thxStickyPrice');
    const stickyCompare = document.getElementById('thxStickyCompare');
    const stickyDiscount = document.getElementById('thxStickyDiscount');
    const stickySelect = document.getElementById('thxStickySelect');
    if (stickyPrice) stickyPrice.textContent = v.price;
    if (stickyCompare) stickyCompare.textContent = v.compare;
    if (stickyDiscount) stickyDiscount.textContent = v.discount;
    if (stickySelect && stickySelect.value !== variantId) stickySelect.value = variantId;
  }

  // Listen to Radio Button Changes in Hero
  document.querySelectorAll('.quantity-breaks-container input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const val = this.value;
      let targetId = "${VARIANTS.Rookie.newId}";
      if (val === 'PRO' || val.includes('Pro') || val.includes('68')) targetId = "${VARIANTS.PRO.newId}";
      else if (val === 'Master' || val.includes('145')) targetId = "${VARIANTS.Master.newId}";
      updateVariantUI(targetId);
    });
  });

  // Listen to Sticky Bar Dropdown Changes
  const stickySelect = document.getElementById('thxStickySelect');
  if (stickySelect) {
    stickySelect.addEventListener('change', function() {
      const targetId = this.value;
      updateVariantUI(targetId);
      // Sync radio in hero
      const radios = document.querySelectorAll('.quantity-breaks-container input[type="radio"]');
      radios.forEach(r => {
        if (targetId === "${VARIANTS.Rookie.newId}" && (r.value === 'Rookie' || r.value.includes('32'))) r.checked = true;
        if (targetId === "${VARIANTS.PRO.newId}" && (r.value === 'PRO' || r.value.includes('68'))) r.checked = true;
        if (targetId === "${VARIANTS.Master.newId}" && (r.value === 'Master' || r.value.includes('145'))) r.checked = true;
      });
    });
  }

  // AJAX Add to Cart Handler
  function addToCart(variantId) {
    const btns = document.querySelectorAll('button[name="add"], .product-form__submit, #thxStickyBtn');
    btns.forEach(b => {
      b.disabled = true;
      b.dataset.origText = b.textContent;
      b.textContent = 'ADDING...';
    });

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Number(variantId), quantity: 1 })
    })
    .then(res => res.json())
    .then(data => {
      btns.forEach(b => { b.textContent = 'ADDED ✓'; });
      setTimeout(() => { window.location.href = '/cart'; }, 500);
    })
    .catch(err => {
      console.error('Cart add error:', err);
      window.location.href = '/cart/add?id=' + variantId + '&quantity=1';
    });
  }

  // Intercept Form Submit & Clicks
  document.addEventListener('submit', function(e) {
    const form = e.target.closest('form');
    if (form && form.action.includes('/cart/add')) {
      e.preventDefault();
      addToCart(currentVariantId);
    }
  });

  document.addEventListener('click', function(e) {
    const btn = e.target.closest('button[name="add"], .product-form__submit, #thxStickyBtn');
    if (btn) {
      e.preventDefault();
      addToCart(currentVariantId);
    }
  });

  // Sticky ATC Scroll Watcher
  const stickyBar = document.getElementById('thxStickyBar');
  const heroBtn = document.querySelector('button[name="add"], .product-form__submit');
  if (stickyBar && heroBtn) {
    window.addEventListener('scroll', () => {
      const rect = heroBtn.getBoundingClientRect();
      if (rect.bottom < 0) {
        stickyBar.classList.add('is-visible');
      } else {
        stickyBar.classList.remove('is-visible');
      }
    });
  }

  // FAQs Accordion handler
  document.querySelectorAll('details.accordion-item, .collapsible-trigger, .accordion__title').forEach(el => {
    el.addEventListener('click', function(e) {
      const details = this.closest('details');
      if (details) {
        // native toggle
      }
    });
  });

})();
</script>
`;

// Master Template
const masterTemplate = `{% layout 'theme' %}

{% render 'thoson-head' %}

<div class="thoson-magtrack-page-container">
  {% render 'thoson-hero' %}
  {% render 'thoson-sections' %}
</div>

{% render 'thoson-scripts' %}
`;

// Write snippets
fs.writeFileSync('Clone-thoson/theme/snippets/thoson-head.liquid', headSnippet);
fs.writeFileSync('Clone-thoson/theme/snippets/thoson-hero.liquid', heroChunk);
fs.writeFileSync('Clone-thoson/theme/snippets/thoson-sections.liquid', sectionsChunk);
fs.writeFileSync('Clone-thoson/theme/snippets/thoson-scripts.liquid', scriptsSnippet);
fs.writeFileSync('Clone-thoson/theme/templates/product.thoson-magtrack.liquid', masterTemplate);

console.log('✔ thoson-head.liquid size:', headSnippet.length, 'bytes');
console.log('✔ thoson-hero.liquid size:', heroChunk.length, 'bytes');
console.log('✔ thoson-sections.liquid size:', sectionsChunk.length, 'bytes');
console.log('✔ thoson-scripts.liquid size:', scriptsSnippet.length, 'bytes');
console.log('✔ product.thoson-magtrack.liquid size:', masterTemplate.length, 'bytes');
console.log('All pieces ready for deployment!');
