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
  if (res.ok) console.log(`  ✔ Uploaded: ${key}`);
  else console.error(`  ✗ Failed: ${key}`, JSON.stringify(data.errors || data));
}

async function fixGallery() {
  console.log('--- Fixing Gallery Skip & Navigation in heating-lamp-funnel.liquid ---');
  let code = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');

  // 1. Update gallery main markup to include Prev & Next skip arrows
  const oldMainGallery = `<div class="wf-gallery-main">
          {% assign hero_src = section.settings.main_image_url | default: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-hero-main.png?v=1792853600' %}
          {% if custom_gallery_count > 0 and first_gallery_img != '' %}
            {% assign hero_src = first_gallery_img %}
          {% elsif section.settings.main_image != blank %}
            {% assign hero_src = section.settings.main_image | image_url: width: 1000 %}
          {% endif %}
          <img id="wf-main-img" src="{{ hero_src }}" alt="{{ section.settings.product_title | escape }}" referrerpolicy="no-referrer">
          <span class="wf-gallery-badge">50% OFF TODAY</span>
        </div>`;

  const newMainGallery = `<div class="wf-gallery-main">
          <button type="button" class="wf-gallery-arrow prev" onclick="skipWfGallery(-1); event.stopPropagation();" aria-label="Previous Image">‹</button>
          {% assign hero_src = section.settings.main_image_url | default: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-hero-main.png?v=1792853600' %}
          {% if custom_gallery_count > 0 and first_gallery_img != '' %}
            {% assign hero_src = first_gallery_img %}
          {% elsif section.settings.main_image != blank %}
            {% assign hero_src = section.settings.main_image | image_url: width: 1000 %}
          {% endif %}
          <img id="wf-main-img" src="{{ hero_src }}" alt="{{ section.settings.product_title | escape }}" referrerpolicy="no-referrer" onclick="skipWfGallery(1)">
          <button type="button" class="wf-gallery-arrow next" onclick="skipWfGallery(1); event.stopPropagation();" aria-label="Next Image">›</button>
          <span class="wf-gallery-badge">50% OFF TODAY</span>
        </div>`;

  if (code.includes(oldMainGallery)) {
    code = code.replace(oldMainGallery, newMainGallery);
    console.log('  ✔ Added Next & Prev skip arrows to gallery markup');
  } else {
    // If spacing differs, use regex
    code = code.replace(
      /<div class="wf-gallery-main">[\s\S]*?<img id="wf-main-img"[^>]*>[\s\S]*?<span class="wf-gallery-badge">50% OFF TODAY<\/span>\s*<\/div>/,
      newMainGallery
    );
    console.log('  ✔ Replaced gallery main via regex');
  }

  // 2. Add CSS for .wf-gallery-arrow
  const galleryArrowCss = `
  /* Gallery Arrows & Navigation */
  .wf-gallery-main {
    cursor: pointer;
  }
  .wf-gallery-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(0, 0, 0, 0.12);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
    color: #231f20;
    z-index: 4;
    transition: all 0.2s ease;
    user-select: none;
    padding: 0 0 2px 0;
  }
  .wf-gallery-arrow:hover {
    background: #ffffff;
    color: #8a2c13;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  }
  .wf-gallery-arrow:active {
    transform: translateY(-50%) scale(0.95);
  }
  .wf-gallery-arrow.prev {
    left: 10px;
  }
  .wf-gallery-arrow.next {
    right: 10px;
  }
  .wf-thumb {
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 8px;
    transition: all 0.18s ease;
  }
  .wf-thumb:hover {
    opacity: 0.9;
  }
  .wf-thumb.active {
    border-color: #8a2c13 !important;
    box-shadow: 0 0 0 1px #8a2c13 !important;
  }
`;

  if (!code.includes('.wf-gallery-arrow')) {
    code = code.replace('.wf-gallery-main {', galleryArrowCss + '\n  .wf-gallery-main {');
    console.log('  ✔ Injected gallery arrow CSS');
  }

  // 3. Fix the entire <script> section (Fixing line 2314 syntax error, adding skipWfGallery, touch swipe, and submitWfDirectCheckout)
  const scriptRegex = /<script>[\s\S]*?<\/script>\s*{%\s*schema\s*%}/;

  const newScriptContent = `<script>
  let wfSelectedVariantId = '67953654300857'; // default 3 pack
  let wfSelectedPrice = 119.99;
  let wfSelectedOldPrice = 269.94;
  let wfCurrentQty = 1;
  let wfCurrentGalleryIndex = 0;

  function normalizeUrl(url) {
    if (!url) return '';
    return url.split('?')[0].replace(/^https?:/, '').replace(/^\\/\\//, '/');
  }

  function switchWfGallery(src, clickedIndex) {
    const main = document.getElementById('wf-main-img');
    const thumbs = Array.from(document.querySelectorAll('.wf-thumb'));
    
    if (main && src) {
      main.style.opacity = '0.35';
      setTimeout(() => {
        main.src = src;
        main.style.opacity = '1';
      }, 70);
    }

    const normTarget = normalizeUrl(src);

    thumbs.forEach((t, i) => {
      const normThumb = normalizeUrl(t.src || t.getAttribute('src'));
      const isMatch = (clickedIndex !== undefined) 
        ? (i === clickedIndex) 
        : (normThumb === normTarget || (normTarget && normThumb && normTarget.includes(normThumb)) || (normTarget && normThumb && normThumb.includes(normTarget)));

      if (isMatch) {
        t.classList.add('active');
        wfCurrentGalleryIndex = i;
        try {
          t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } catch (e) {}
      } else {
        t.classList.remove('active');
      }
    });
  }

  function skipWfGallery(direction) {
    const thumbs = Array.from(document.querySelectorAll('.wf-thumb'));
    if (!thumbs || thumbs.length === 0) return;
    wfCurrentGalleryIndex = (wfCurrentGalleryIndex + direction + thumbs.length) % thumbs.length;
    const targetThumb = thumbs[wfCurrentGalleryIndex];
    if (targetThumb) {
      const src = targetThumb.src || targetThumb.getAttribute('src');
      switchWfGallery(src, wfCurrentGalleryIndex);
    }
  }

  function selectWfBundle(variantId, price, oldPrice, elementId, imgSrc) {
    wfSelectedVariantId = variantId;
    wfSelectedPrice = parseFloat(price);
    wfSelectedOldPrice = oldPrice ? parseFloat(oldPrice) : (wfSelectedPrice * 1.8);

    document.querySelectorAll('.wf-bundle-card').forEach(c => c.classList.remove('selected'));
    const el = document.getElementById(elementId);
    if (el) el.classList.add('selected');

    if (imgSrc) {
      switchWfGallery(imgSrc);
      const stickyImg = document.getElementById('wf-sticky-img');
      if (stickyImg) stickyImg.src = imgSrc;
    }

    let titleText = '$119.99 (3 Pack)';
    if (variantId === '67930179436729') titleText = '$89.99 (2 Pack)';
    else if (variantId === '67930179403961') titleText = '$49.99 (1 Pack)';
    const stickyPriceVal = document.getElementById('wf-sticky-price-val');
    if (stickyPriceVal) stickyPriceVal.textContent = titleText;

    updateWfTotal();
  }

  function adjustWfQty(delta) {
    let input = document.getElementById('wf-qty-input');
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val = Math.max(1, Math.min(10, val + delta));
    input.value = val;
    wfCurrentQty = val;
    updateWfTotal();
  }

  function updateWfTotal() {
    const total = (wfSelectedPrice * wfCurrentQty).toFixed(2);
    const compTotal = (wfSelectedOldPrice * wfCurrentQty).toFixed(2);
    const disp = document.getElementById('wf-total-display');
    const compDisp = document.getElementById('wf-total-compare');
    if (disp) disp.textContent = '$' + total;
    if (compDisp) compDisp.textContent = '$' + compTotal;
  }

  async function submitWfDirectCheckout() {
    const btn = document.getElementById('wf-main-shopnow-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Proceeding to Checkout...</span>';
    }
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: wfSelectedVariantId,
            quantity: wfCurrentQty
          }]
        })
      });
      window.location.href = '/checkout';
    } catch (e) {
      window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
    }
  }

  async function submitWfOrder() {
    const btn = document.getElementById('wf-main-atc-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Processing Secure Order...</span>';
    }

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: wfSelectedVariantId,
            quantity: wfCurrentQty
          }]
        })
      });

      if (res.ok) {
        window.location.href = '/checkout';
      } else {
        window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
      }
    } catch (e) {
      console.error(e);
      window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
    }
  }

  // Touch swipe & keyboard arrow navigation
  document.addEventListener('DOMContentLoaded', function() {
    const mainWrap = document.querySelector('.wf-gallery-main');
    if (mainWrap) {
      let touchStartX = 0;
      let touchStartY = 0;
      mainWrap.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      mainWrap.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        // Check if horizontal swipe was dominant
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
          if (diffX < 0) {
            skipWfGallery(1); // Swipe left -> Next image
          } else {
            skipWfGallery(-1); // Swipe right -> Previous image
          }
        }
      }, { passive: true });
    }

    // Keyboard navigation (Left / Right keys when viewing page)
    document.addEventListener('keydown', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') skipWfGallery(1);
      if (e.key === 'ArrowLeft') skipWfGallery(-1);
    });
  });

  // Sticky bottom bar trigger on scroll past ATC
  window.addEventListener('scroll', function() {
    const atc = document.getElementById('wf-main-atc-btn');
    const sticky = document.getElementById('wf-sticky-bar');
    if (!atc || !sticky) return;

    const rect = atc.getBoundingClientRect();
    if (rect.bottom < 0) {
      sticky.classList.add('visible');
    } else {
      sticky.classList.remove('visible');
    }
  }, { passive: true });
</script>

{% schema %}`;

  code = code.replace(scriptRegex, newScriptContent);
  console.log('  ✔ Cleaned up and replaced JavaScript logic');

  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', code);
  const token = await getAccessToken();
  await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', code);
}

fixGallery().catch(console.error);
