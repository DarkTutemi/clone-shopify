/**
 * ZAVELYN IMMERSIVE COMMERCE THEME V4.0
 * 2.5D PHYSICAL RETAIL SHOWROOM & CINEMATIC ZOOM QUICK VIEW
 */

(function() {
  'use strict';

  function initShowroom() {
    const stage = document.getElementById('zvShowroomStage');
    const viewBtns = document.querySelectorAll('.zv-view-btn');
    const qvOverlay = document.getElementById('zvQvOverlay');
    const qvModal = document.getElementById('zvQvModal');
    const qvClose = document.getElementById('zvQvClose');
    
    // View Switcher (Shelf vs Grid)
    if (stage && viewBtns.length > 0) {
      const savedMode = localStorage.getItem('zv_showroom_view') || 'shelf';
      setStageMode(savedMode);

      viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          const mode = this.getAttribute('data-view-mode');
          setStageMode(mode);
          localStorage.setItem('zv_showroom_view', mode);
        });
      });
    }

    function setStageMode(mode) {
      if (!stage) return;
      viewBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-view-mode') === mode));
      if (mode === 'grid') {
        stage.classList.add('grid-mode');
      } else {
        stage.classList.remove('grid-mode');
      }
    }

    // Quick View Elements
    const qvImg = document.getElementById('zvQvImg');
    const qvTitle = document.getElementById('zvQvTitle');
    const qvPrice = document.getElementById('zvQvPrice');
    const qvCompare = document.getElementById('zvQvCompare');
    const qvSave = document.getElementById('zvQvSave');
    const qvPdpLink = document.getElementById('zvQvPdpLink');
    const qvAtcBtn = document.getElementById('zvQvAtcBtn');
    const qvQtyMinus = document.getElementById('zvQvQtyMinus');
    const qvQtyPlus = document.getElementById('zvQvQtyPlus');
    const qvQtyDisplay = document.getElementById('zvQvQtyDisplay');
    const qvVariantsWrap = document.getElementById('zvQvVariantsWrap');

    let currentQvProduct = null;
    let selectedVariantId = null;
    let selectedQty = 1;
    let lastActiveElement = null;

    // Attach Click to All Shelf Items
    const shelfItems = document.querySelectorAll('.zv-shelf-item');
    shelfItems.forEach(item => {
      item.addEventListener('click', function(e) {
        // Prevent opening if user specifically clicked a direct link
        if (e.target.closest('a') && !e.target.closest('.zv-shelf-quickbuy-btn')) {
          return;
        }
        e.preventDefault();
        lastActiveElement = this;
        openQuickView(this);
      });
    });

    function formatMoney(cents) {
      return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    function openQuickView(itemElem) {
      const pDataRaw = itemElem.getAttribute('data-product-json');
      if (!pDataRaw) {
        // Fallback: navigate directly to product
        const url = itemElem.getAttribute('data-product-url');
        if (url) window.location.href = url;
        return;
      }

      try {
        currentQvProduct = JSON.parse(pDataRaw);
      } catch (err) {
        console.error('Failed to parse product data', err);
        return;
      }

      selectedQty = 1;
      if (qvQtyDisplay) qvQtyDisplay.textContent = '1';
      if (qvQtyMinus) qvQtyMinus.disabled = true;

      const v0 = currentQvProduct.variants[0];
      selectedVariantId = v0.id;

      // Populate Quick View fields
      if (qvTitle) qvTitle.textContent = currentQvProduct.title;
      if (qvImg) {
        qvImg.src = currentQvProduct.featured_image || (v0.featured_image ? v0.featured_image.src : '');
        qvImg.alt = currentQvProduct.title;
      }

      updatePricing(v0);

      if (qvPdpLink) {
        qvPdpLink.href = '/products/' + currentQvProduct.handle;
      }

      // Render Variants if multi-variant
      if (qvVariantsWrap) {
        qvVariantsWrap.innerHTML = '';
        if (currentQvProduct.variants.length > 1) {
          const varLabel = document.createElement('div');
          varLabel.style.fontSize = '12px';
          varLabel.style.fontWeight = '700';
          varLabel.style.marginBottom = '6px';
          varLabel.textContent = 'Select Option:';
          qvVariantsWrap.appendChild(varLabel);

          const pillsWrap = document.createElement('div');
          pillsWrap.style.display = 'flex';
          pillsWrap.style.flexWrap = 'wrap';
          pillsWrap.style.gap = '8px';
          pillsWrap.style.marginBottom = '14px';

          currentQvProduct.variants.forEach((v, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'zv-btn zv-btn-outline' + (idx === 0 ? ' active' : '');
            btn.style.padding = '6px 14px';
            btn.style.fontSize = '12.5px';
            btn.style.borderRadius = '999px';
            if (idx === 0) {
              btn.style.background = 'var(--zv-primary)';
              btn.style.color = '#FFFFFF';
            }
            btn.textContent = v.title;
            btn.addEventListener('click', () => {
              pillsWrap.querySelectorAll('button').forEach(b => {
                b.style.background = 'transparent';
                b.style.color = 'var(--zv-primary)';
              });
              btn.style.background = 'var(--zv-primary)';
              btn.style.color = '#FFFFFF';
              selectedVariantId = v.id;
              if (v.featured_image && qvImg) qvImg.src = v.featured_image.src;
              updatePricing(v);
            });
            pillsWrap.appendChild(btn);
          });
          qvVariantsWrap.appendChild(pillsWrap);
        }
      }

      // Show Modal
      if (qvOverlay) {
        qvOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function updatePricing(variant) {
      if (qvPrice) qvPrice.textContent = formatMoney(variant.price);
      if (qvCompare) {
        if (variant.compare_at_price > variant.price) {
          qvCompare.textContent = formatMoney(variant.compare_at_price);
          qvCompare.style.display = 'inline';
          if (qvSave) {
            const pct = Math.round((variant.compare_at_price - variant.price) * 100 / variant.compare_at_price);
            qvSave.textContent = 'SAVE ' + pct + '%';
            qvSave.style.display = 'inline';
          }
        } else {
          qvCompare.style.display = 'none';
          if (qvSave) qvSave.style.display = 'none';
        }
      }
    }

    function closeQuickView() {
      if (qvOverlay) {
        qvOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (lastActiveElement) {
        lastActiveElement.focus();
      }
    }

    if (qvClose) qvClose.addEventListener('click', closeQuickView);
    if (qvOverlay) {
      qvOverlay.addEventListener('click', function(e) {
        if (e.target === qvOverlay) closeQuickView();
      });
    }

    // Keyboard Escape support
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && qvOverlay && qvOverlay.classList.contains('active')) {
        closeQuickView();
      }
    });

    // Quantity Stepper
    if (qvQtyPlus) {
      qvQtyPlus.addEventListener('click', () => {
        selectedQty++;
        if (qvQtyDisplay) qvQtyDisplay.textContent = selectedQty;
        if (qvQtyMinus) qvQtyMinus.disabled = false;
      });
    }
    if (qvQtyMinus) {
      qvQtyMinus.addEventListener('click', () => {
        if (selectedQty > 1) {
          selectedQty--;
          if (qvQtyDisplay) qvQtyDisplay.textContent = selectedQty;
          if (selectedQty === 1) qvQtyMinus.disabled = true;
        }
      });
    }

    // Quick View Add to Cart
    if (qvAtcBtn) {
      qvAtcBtn.addEventListener('click', async function() {
        if (!selectedVariantId) return;

        const originalText = qvAtcBtn.innerHTML;
        qvAtcBtn.disabled = true;
        qvAtcBtn.innerHTML = '<span>ADDING TO CART...</span>';

        try {
          const res = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              items: [{
                id: selectedVariantId,
                quantity: selectedQty
              }]
            })
          });

          if (!res.ok) {
            throw new Error('Failed to add to cart');
          }

          // Close Quick View
          closeQuickView();

          // Trigger Willa / Zavelyn Cart Drawer
          if (typeof window.willaRefreshCart === 'function') {
            await window.willaRefreshCart();
          }
          if (typeof window.willaOpenCartDrawer === 'function') {
            window.willaOpenCartDrawer();
          } else {
            const drawer = document.getElementById('willaCartDrawer');
            const overlay = document.getElementById('willaCartOverlay');
            if (drawer) {
              drawer.classList.add('active');
              if (overlay) overlay.classList.add('active');
            } else {
              window.location.href = '/cart';
            }
          }
        } catch (err) {
          console.error(err);
          alert('Could not add to cart. Please try again.');
        } finally {
          qvAtcBtn.disabled = false;
          qvAtcBtn.innerHTML = originalText;
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShowroom);
  } else {
    initShowroom();
  }
})();
