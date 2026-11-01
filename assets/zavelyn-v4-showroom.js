/**
 * ZAVELYN IMMERSIVE COMMERCE THEME V4.1
 * POSITIONAL ZOOM ENGINE & 2.5D SHOWROOM CONTROLLER
 * 
 * Replaces traditional screen-centered popup modals with authentic spatial
 * inspection anchored directly to the selected product's physical shelf position.
 */

(function() {
  'use strict';

  function initSpatialShowroom() {
    const stage = document.getElementById('zvShowroomStage');
    const viewBtns = document.querySelectorAll('.zv-view-btn');

    // 1. View Switcher Mode (Showroom 2.5D vs Grid)
    if (stage && viewBtns.length > 0) {
      const savedMode = localStorage.getItem('zv_showroom_view') || 'shelf';
      applyStageMode(savedMode);

      viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          const mode = this.getAttribute('data-view-mode');
          applyStageMode(mode);
          localStorage.setItem('zv_showroom_view', mode);
        });
      });
    }

    function applyStageMode(mode) {
      if (!stage) return;
      viewBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-view-mode') === mode));
      if (mode === 'grid') {
        stage.classList.add('grid-mode');
      } else {
        stage.classList.remove('grid-mode');
      }
    }

    // 2. Spatial Inspection Bay Elements (Desktop Positional Zoom)
    const inspectBay = document.getElementById('zvSpatialInspectBay');
    const inspectBackdrop = document.getElementById('zvInspectBackdrop');
    const inspectStageWrap = document.getElementById('zvInspectStageWrap');
    const inspectFocalFrame = document.getElementById('zvInspectFocalFrame');
    const inspectFocalImg = document.getElementById('zvInspectFocalImg');
    const inspectCloseBtn = document.getElementById('zvInspectCloseBtn');
    const inspectTitle = document.getElementById('zvInspectTitle');
    const inspectPriceCurr = document.getElementById('zvInspectPriceCurr');
    const inspectPriceOld = document.getElementById('zvInspectPriceOld');
    const inspectSaveBadge = document.getElementById('zvInspectSaveBadge');
    const inspectVariants = document.getElementById('zvInspectVariants');
    const inspectAtcBtn = document.getElementById('zvInspectAtcBtn');
    const inspectPdpLink = document.getElementById('zvInspectPdpLink');

    // 3. Mobile Bottom Sheet Elements (< 768px Viewports)
    const mobileOverlay = document.getElementById('zvMobileSheetOverlay');
    const mobileClose = document.getElementById('zvMobileSheetClose');
    const mobileTitle = document.getElementById('zvMobileSheetTitle');
    const mobilePrice = document.getElementById('zvMobileSheetPrice');
    const mobileCompare = document.getElementById('zvMobileSheetCompare');
    const mobileSave = document.getElementById('zvMobileSheetSave');
    const mobileImg = document.getElementById('zvMobileSheetImg');
    const mobileVariants = document.getElementById('zvMobileSheetVariants');
    const mobileAtcBtn = document.getElementById('zvMobileSheetAtcBtn');
    const mobilePdpLink = document.getElementById('zvMobileSheetPdpLink');

    let currentProduct = null;
    let selectedVariantId = null;
    let lastActiveItem = null;

    function formatMoney(cents) {
      return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    // 4. Attach Positional Inspection to All Shelf Items
    const shelfItems = document.querySelectorAll('.zv-shelf-item');

    shelfItems.forEach(item => {
      // Click interaction
      item.addEventListener('click', function(e) {
        // Allow direct clicking if specifically targeted an explicit direct link
        if (e.target.closest('a') && !e.target.closest('.zv-tag-inspect-prompt')) {
          return;
        }
        e.preventDefault();
        lastActiveItem = this;

        if (window.innerWidth < 768) {
          openMobileSheet(this);
        } else {
          openSpatialInspect(this);
        }
      });

      // Accessible Keyboard Enter / Space trigger
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // =========================================================================
    // DESKTOP: POSITIONAL ZOOM SPATIAL INSPECTION
    // =========================================================================
    function openSpatialInspect(itemElem) {
      const rawJson = itemElem.getAttribute('data-product-json');
      if (!rawJson) {
        const fallbackUrl = itemElem.getAttribute('data-product-url');
        if (fallbackUrl) window.location.href = fallbackUrl;
        return;
      }

      try {
        currentProduct = JSON.parse(rawJson);
      } catch (err) {
        console.error('Failed to parse product JSON', err);
        return;
      }

      // Step A: Dim all other shelf items
      shelfItems.forEach(si => {
        if (si !== itemElem) {
          si.classList.add('zv-dimmed');
        }
      });

      // Step B: Determine Anchored Direction (Left vs Right of Product)
      const mediaWrap = itemElem.querySelector('.zv-merch-display') || itemElem;
      const rect = mediaWrap.getBoundingClientRect();
      const isLeftHalf = (rect.left + rect.width / 2) < (window.innerWidth / 2);

      if (inspectStageWrap) {
        if (isLeftHalf) {
          inspectStageWrap.style.flexDirection = 'row'; // Product Left, Info Right
        } else {
          inspectStageWrap.style.flexDirection = 'row-reverse'; // Info Left, Product Right
        }
      }

      // Step C: Set Initial Selected Variant & Imagery
      const v0 = currentProduct.variants[0];
      selectedVariantId = v0.id;

      if (inspectFocalImg) {
        const imgSrc = currentProduct.featured_image || (v0.featured_image ? v0.featured_image.src : '');
        inspectFocalImg.src = imgSrc;
        inspectFocalImg.alt = currentProduct.title;
      }

      // Step D: Populate Identity & Pricing
      if (inspectTitle) inspectTitle.textContent = currentProduct.title;
      updateDesktopPricing(v0);

      if (inspectPdpLink) {
        inspectPdpLink.href = '/products/' + currentProduct.handle + '?view=showroom';
      }

      // Step E: Render Interactive Variant Pills
      if (inspectVariants) {
        inspectVariants.innerHTML = '';
        if (currentProduct.variants.length > 1) {
          const vHeader = document.createElement('div');
          vHeader.style.fontSize = '12px';
          vHeader.style.fontWeight = '800';
          vHeader.style.letterSpacing = '0.8px';
          vHeader.style.color = 'var(--zv-muted)';
          vHeader.style.textTransform = 'uppercase';
          vHeader.style.marginBottom = '8px';
          vHeader.textContent = 'Select Configuration:';
          inspectVariants.appendChild(vHeader);

          const pillsRow = document.createElement('div');
          pillsRow.style.display = 'flex';
          pillsRow.style.flexWrap = 'wrap';
          pillsRow.style.gap = '8px';

          currentProduct.variants.forEach((v, idx) => {
            const pill = document.createElement('button');
            pill.type = 'button';
            pill.className = 'zv-btn ' + (idx === 0 ? 'zv-btn-primary' : 'zv-btn-outline');
            pill.style.padding = '6px 14px';
            pill.style.fontSize = '12.5px';
            pill.style.borderRadius = 'var(--zv-radius-full)';
            pill.textContent = v.title;

            pill.addEventListener('click', () => {
              pillsRow.querySelectorAll('button').forEach(b => {
                b.className = 'zv-btn zv-btn-outline';
              });
              pill.className = 'zv-btn zv-btn-primary';
              selectedVariantId = v.id;
              if (v.featured_image && inspectFocalImg) {
                inspectFocalImg.src = v.featured_image.src;
              }
              updateDesktopPricing(v);
            });

            pillsRow.appendChild(pill);
          });
          inspectVariants.appendChild(pillsRow);
        }
      }

      // Step F: Activate Spatial Stage
      if (inspectBay) {
        inspectBay.classList.add('active');
        inspectBay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    function updateDesktopPricing(variant) {
      if (inspectPriceCurr) inspectPriceCurr.textContent = formatMoney(variant.price);
      if (inspectPriceOld) {
        if (variant.compare_at_price > variant.price) {
          inspectPriceOld.textContent = formatMoney(variant.compare_at_price);
          inspectPriceOld.style.display = 'inline';
          if (inspectSaveBadge) {
            const pct = Math.round((variant.compare_at_price - variant.price) * 100 / variant.compare_at_price);
            inspectSaveBadge.textContent = 'SAVE ' + pct + '%';
            inspectSaveBadge.style.display = 'inline-block';
          }
        } else {
          inspectPriceOld.style.display = 'none';
          if (inspectSaveBadge) inspectSaveBadge.style.display = 'none';
        }
      }
    }

    function closeSpatialInspect() {
      if (inspectBay) {
        inspectBay.classList.remove('active');
        inspectBay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }

      // Restore dimming of shelf items
      shelfItems.forEach(si => {
        si.classList.remove('zv-dimmed');
      });

      if (lastActiveItem) {
        lastActiveItem.focus();
      }
    }

    // Close Listeners for Desktop Positional Zoom
    if (inspectCloseBtn) inspectCloseBtn.addEventListener('click', closeSpatialInspect);
    if (inspectBackdrop) inspectBackdrop.addEventListener('click', closeSpatialInspect);

    // =========================================================================
    // MOBILE: ACCESSIBLE BOTTOM SHEET (< 768px Viewports)
    // =========================================================================
    function openMobileSheet(itemElem) {
      const rawJson = itemElem.getAttribute('data-product-json');
      if (!rawJson) return;

      try {
        currentProduct = JSON.parse(rawJson);
      } catch (err) {
        console.error('Failed to parse mobile product JSON', err);
        return;
      }

      const v0 = currentProduct.variants[0];
      selectedVariantId = v0.id;

      if (mobileTitle) mobileTitle.textContent = currentProduct.title;
      if (mobilePrice) mobilePrice.textContent = formatMoney(v0.price);
      if (mobileCompare) {
        if (v0.compare_at_price > v0.price) {
          mobileCompare.textContent = formatMoney(v0.compare_at_price);
          mobileCompare.style.display = 'inline';
          if (mobileSave) {
            const pct = Math.round((v0.compare_at_price - v0.price) * 100 / v0.compare_at_price);
            mobileSave.textContent = 'SAVE ' + pct + '%';
            mobileSave.style.display = 'inline-block';
          }
        } else {
          mobileCompare.style.display = 'none';
          if (mobileSave) mobileSave.style.display = 'none';
        }
      }

      if (mobileImg) {
        mobileImg.src = currentProduct.featured_image || (v0.featured_image ? v0.featured_image.src : '');
        mobileImg.alt = currentProduct.title;
      }

      if (mobilePdpLink) {
        mobilePdpLink.href = '/products/' + currentProduct.handle + '?view=showroom';
      }

      if (mobileVariants) {
        mobileVariants.innerHTML = '';
        if (currentProduct.variants.length > 1) {
          const wrap = document.createElement('div');
          wrap.style.display = 'flex';
          wrap.style.flexWrap = 'wrap';
          wrap.style.gap = '6px';
          wrap.style.marginTop = '10px';

          currentProduct.variants.forEach((v, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'zv-btn ' + (idx === 0 ? 'zv-btn-primary' : 'zv-btn-outline');
            btn.style.padding = '6px 12px';
            btn.style.fontSize = '12px';
            btn.style.borderRadius = 'var(--zv-radius-full)';
            btn.textContent = v.title;

            btn.addEventListener('click', () => {
              wrap.querySelectorAll('button').forEach(b => {
                b.className = 'zv-btn zv-btn-outline';
              });
              btn.className = 'zv-btn zv-btn-primary';
              selectedVariantId = v.id;
              if (v.featured_image && mobileImg) mobileImg.src = v.featured_image.src;
              if (mobilePrice) mobilePrice.textContent = formatMoney(v.price);
            });
            wrap.appendChild(btn);
          });
          mobileVariants.appendChild(wrap);
        }
      }

      if (mobileOverlay) {
        mobileOverlay.classList.add('active');
        mobileOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeMobileSheet() {
      if (mobileOverlay) {
        mobileOverlay.classList.remove('active');
        mobileOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }

    if (mobileClose) mobileClose.addEventListener('click', closeMobileSheet);
    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', function(e) {
        if (e.target === this) closeMobileSheet();
      });
    }

    // =========================================================================
    // SHOPIFY COMMERCE: DIRECT ADD TO CART & WILLA CART DRAWER SYNC
    // =========================================================================
    async function handleAddToCart(buttonElem) {
      if (!selectedVariantId) return;

      const originalHtml = buttonElem.innerHTML;
      buttonElem.disabled = true;
      buttonElem.innerHTML = '<span>ADDING TO CART...</span>';

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedVariantId,
            quantity: 1
          })
        });

        if (!response.ok) {
          throw new Error('Failed to add item to cart');
        }

        const cartItem = await response.json();
        console.log('✓ Added to cart:', cartItem);

        // Success state
        buttonElem.innerHTML = '<span>✓ ADDED!</span>';

        setTimeout(() => {
          closeSpatialInspect();
          closeMobileSheet();
          buttonElem.disabled = false;
          buttonElem.innerHTML = originalHtml;

          // Dispatch standard cart events
          document.dispatchEvent(new CustomEvent('cart:updated'));
          document.dispatchEvent(new CustomEvent('willa:cart:refresh'));

          // Trigger Willa Cart Drawer if loaded
          if (window.willaCart && typeof window.willaCart.open === 'function') {
            window.willaCart.open();
          } else {
            const drawerToggle = document.querySelector('[data-cart-drawer-toggle], .willa-cart-trigger, [aria-controls="CartDrawer"]');
            if (drawerToggle) drawerToggle.click();
          }
        }, 350);

      } catch (err) {
        console.error('Cart error:', err);
        buttonElem.disabled = false;
        buttonElem.innerHTML = '<span>ERROR - TRY AGAIN</span>';
        setTimeout(() => { buttonElem.innerHTML = originalHtml; }, 2000);
      }
    }

    if (inspectAtcBtn) {
      inspectAtcBtn.addEventListener('click', function() {
        handleAddToCart(this);
      });
    }

    if (mobileAtcBtn) {
      mobileAtcBtn.addEventListener('click', function() {
        handleAddToCart(this);
      });
    }

    // Keyboard ESC Listener
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSpatialInspect();
        closeMobileSheet();
      }
    });

  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpatialShowroom);
  } else {
    initSpatialShowroom();
  }

})();
