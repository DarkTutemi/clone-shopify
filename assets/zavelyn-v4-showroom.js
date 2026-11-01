/**
 * ZAVELYN IMMERSIVE COMMERCE THEME V4.2
 * POSITIONAL ZOOM ENGINE & ADAPTIVE VARIANT CONTROLLER (P0 FIXES 2 & 3)
 * 
 * Implements:
 * 1. True Spatial Positional Zoom (FLIP animation directly from shelf position)
 * 2. Adaptive Variant Selector (Compact pills for <=4 options, custom dropdown for >4 options)
 * 3. Viewport-Constrained Anchored Details Panel (No offscreen overflow)
 * 4. Seamless Willa Cart Drawer Integration
 */

(function() {
  'use strict';

  function initSpatialShowroom() {
    const stage = document.getElementById('zvShowroomStage');
    const viewBtns = document.querySelectorAll('.zv-view-btn');

    // 1. Stage Mode Toggle (Showroom 2.5D vs Grid)
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

    // 2. Spatial Elements (Desktop FLIP Positional Zoom)
    const inspectBay = document.getElementById('zvSpatialInspectBay');
    const inspectBackdrop = document.getElementById('zvInspectBackdrop');
    const inspectStageWrap = document.getElementById('zvInspectStageWrap');
    const inspectFocalFrame = document.getElementById('zvInspectFocalFrame');
    const inspectFocalImg = document.getElementById('zvInspectFocalImg');
    const inspectCloseBtn = document.getElementById('zvInspectCloseBtn');
    const inspectAnchoredPanel = document.getElementById('zvInspectAnchoredPanel');
    const inspectTitle = document.getElementById('zvInspectTitle');
    const inspectPriceCurr = document.getElementById('zvInspectPriceCurr');
    const inspectPriceOld = document.getElementById('zvInspectPriceOld');
    const inspectSaveBadge = document.getElementById('zvInspectSaveBadge');
    const inspectVariants = document.getElementById('zvInspectVariants');
    const inspectAtcBtn = document.getElementById('zvInspectAtcBtn');
    const inspectPdpLink = document.getElementById('zvInspectPdpLink');

    // 3. Mobile Elements (< 768px Viewports)
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
    let activeShelfItem = null;
    let activeMerchRect = null;
    let isZoomActive = false;

    function formatMoney(cents) {
      return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    // 4. Attach Positional Inspection to All Shelf Items
    const shelfItems = document.querySelectorAll('.zv-shelf-item');

    shelfItems.forEach(item => {
      item.addEventListener('click', function(e) {
        // Disallow zoom if explicitly clicking a secondary anchor tag
        if (e.target.closest('a') && !e.target.closest('.zv-tag-inspect-prompt')) {
          return;
        }
        e.preventDefault();

        if (window.innerWidth < 768) {
          openMobileSheet(this);
        } else {
          openSpatialPositionalZoom(this);
        }
      });

      // Accessible Keyboard Enter / Space
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // =========================================================================
    // BUG 3 FIX: TRUE SPATIAL POSITIONAL PRODUCT ZOOM (DESKTOP)
    // =========================================================================
    function openSpatialPositionalZoom(itemElem) {
      if (isZoomActive) return;

      const rawJson = itemElem.getAttribute('data-product-json');
      if (!rawJson) {
        const fallbackUrl = itemElem.getAttribute('data-product-url');
        if (fallbackUrl) window.location.href = fallbackUrl;
        return;
      }

      try {
        currentProduct = JSON.parse(rawJson);
      } catch (err) {
        console.error('Failed to parse product data', err);
        return;
      }

      activeShelfItem = itemElem;
      const merchDisplay = itemElem.querySelector('.zv-merch-display') || itemElem;
      activeMerchRect = merchDisplay.getBoundingClientRect();

      // Step A: Dim surrounding shelf items (shelf remains visible in background)
      shelfItems.forEach(si => {
        if (si !== itemElem) {
          si.classList.add('zv-shelf-dimmed');
        }
      });

      // Step B: Set Initial Variant & Image
      const v0 = currentProduct.variants[0];
      selectedVariantId = v0.id;

      // Check if product has custom transparent cutout override
      const cutoutImg = itemElem.getAttribute('data-cutout-src');
      const baseImg = cutoutImg || currentProduct.featured_image || (v0.featured_image ? v0.featured_image.src : '');

      if (inspectFocalImg) {
        inspectFocalImg.src = baseImg;
        inspectFocalImg.alt = currentProduct.title;
      }

      // Step C: Populate Identity & Pricing
      if (inspectTitle) inspectTitle.textContent = currentProduct.title;
      updateDesktopPricing(v0);

      if (inspectPdpLink) {
        inspectPdpLink.href = '/products/' + currentProduct.handle + '?view=showroom';
      }

      // Step D: Render Adaptive Variant Selector (BUG 2 FIX)
      renderAdaptiveVariantSelector(currentProduct, inspectVariants, function(variant) {
        selectedVariantId = variant.id;
        if (variant.featured_image && inspectFocalImg && !cutoutImg) {
          inspectFocalImg.src = variant.featured_image.src;
        }
        updateDesktopPricing(variant);
      });

      // Step E: Positional FLIP Geometry & Anchored Card Placement
      const rect = activeMerchRect;
      const targetScale = 1.45;
      const panelWidth = 380;
      const margin = 28;

      // Determine horizontal side: Is product on Left or Right of viewport?
      const isLeft = (rect.left + rect.width / 2) < (window.innerWidth / 2);

      let deltaX = 0;
      let cardLeft = 0;

      if (isLeft) {
        // Place Anchored Card to the RIGHT of the product
        deltaX = Math.max(-20, Math.min(10, (window.innerWidth * 0.26) - rect.left));
        cardLeft = rect.left + deltaX + (rect.width * targetScale) + margin;
        // Viewport clamp
        if (cardLeft + panelWidth > window.innerWidth - 20) {
          cardLeft = window.innerWidth - panelWidth - 20;
        }
      } else {
        // Place Anchored Card to the LEFT of the product
        deltaX = Math.min(20, Math.max(-10, (window.innerWidth * 0.74) - (rect.left + rect.width)));
        cardLeft = rect.left + deltaX - panelWidth - margin;
        // Viewport clamp
        if (cardLeft < 20) {
          cardLeft = 20;
        }
      }

      // Vertical placement clamped inside viewport
      const cardHeightEst = 460;
      const cardTop = Math.max(24, Math.min(rect.top - 20, window.innerHeight - cardHeightEst - 24));

      // Step F: Position Focal Frame initially exactly over the shelf item
      if (inspectFocalFrame) {
        inspectFocalFrame.style.position = 'fixed';
        inspectFocalFrame.style.left = `${rect.left}px`;
        inspectFocalFrame.style.top = `${rect.top}px`;
        inspectFocalFrame.style.width = `${rect.width}px`;
        inspectFocalFrame.style.height = `${rect.height}px`;
        inspectFocalFrame.style.transformOrigin = 'center center';
        inspectFocalFrame.style.transform = 'translate(0px, 0px) scale(1)';
        inspectFocalFrame.style.transition = 'none';
      }

      if (inspectAnchoredPanel) {
        inspectAnchoredPanel.style.position = 'fixed';
        inspectAnchoredPanel.style.left = `${cardLeft}px`;
        inspectAnchoredPanel.style.top = `${cardTop}px`;
        inspectAnchoredPanel.style.opacity = '0';
        inspectAnchoredPanel.style.transform = isLeft ? 'translateX(-20px) scale(0.96)' : 'translateX(20px) scale(0.96)';
        inspectAnchoredPanel.style.transition = 'none';
      }

      // Activate Stage
      if (inspectBay) {
        inspectBay.classList.add('active');
        inspectBay.setAttribute('aria-hidden', 'false');
      }

      // Trigger FLIP Transition on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (inspectFocalFrame) {
            inspectFocalFrame.style.transition = 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 380ms ease';
            inspectFocalFrame.style.transform = `translate(${deltaX}px, -24px) scale(${targetScale})`;
          }
          if (inspectAnchoredPanel) {
            inspectAnchoredPanel.style.transition = 'opacity 320ms ease, transform 350ms cubic-bezier(0.16, 1, 0.3, 1)';
            inspectAnchoredPanel.style.opacity = '1';
            inspectAnchoredPanel.style.transform = 'translateX(0) scale(1)';
          }
          isZoomActive = true;
        });
      });
    }

    // Smooth Positional Zoom Close
    function closeSpatialPositionalZoom() {
      if (!isZoomActive) return;

      if (inspectFocalFrame) {
        inspectFocalFrame.style.transition = 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)';
        inspectFocalFrame.style.transform = 'translate(0px, 0px) scale(1)';
      }

      if (inspectAnchoredPanel) {
        inspectAnchoredPanel.style.transition = 'opacity 250ms ease, transform 250ms ease';
        inspectAnchoredPanel.style.opacity = '0';
        inspectAnchoredPanel.style.transform = 'scale(0.96)';
      }

      setTimeout(() => {
        if (inspectBay) {
          inspectBay.classList.remove('active');
          inspectBay.setAttribute('aria-hidden', 'true');
        }
        shelfItems.forEach(si => si.classList.remove('zv-shelf-dimmed'));
        isZoomActive = false;

        if (activeShelfItem) {
          activeShelfItem.focus();
        }
      }, 320);
    }

    if (inspectCloseBtn) inspectCloseBtn.addEventListener('click', closeSpatialPositionalZoom);
    if (inspectBackdrop) inspectBackdrop.addEventListener('click', closeSpatialPositionalZoom);

    // =========================================================================
    // BUG 2 FIX: ADAPTIVE VARIANT SELECTOR ENGINE
    // =========================================================================
    function renderAdaptiveVariantSelector(product, container, onSelectCallback) {
      if (!container) return;
      container.innerHTML = '';

      if (!product.variants || product.variants.length <= 1) return;

      const titleLabel = document.createElement('div');
      titleLabel.style.fontSize = '12px';
      titleLabel.style.fontWeight = '800';
      titleLabel.style.letterSpacing = '0.8px';
      titleLabel.style.color = 'var(--zv-muted, #717A75)';
      titleLabel.style.textTransform = 'uppercase';
      titleLabel.style.marginBottom = '8px';
      titleLabel.textContent = `Select Option (${product.variants.length} options):`;
      container.appendChild(titleLabel);

      // A) IF VARIANTS <= 4: COMPACT PILLS
      if (product.variants.length <= 4) {
        const pillsWrap = document.createElement('div');
        pillsWrap.style.display = 'flex';
        pillsWrap.style.flexWrap = 'wrap';
        pillsWrap.style.gap = '8px';

        product.variants.forEach((v, idx) => {
          const pill = document.createElement('button');
          pill.type = 'button';
          pill.className = 'zv-btn ' + (idx === 0 ? 'zv-btn-primary' : 'zv-btn-outline');
          pill.style.padding = '5px 12px';
          pill.style.fontSize = '12px';
          pill.style.borderRadius = '999px';
          pill.textContent = v.title;

          pill.addEventListener('click', () => {
            pillsWrap.querySelectorAll('button').forEach(b => b.className = 'zv-btn zv-btn-outline');
            pill.className = 'zv-btn zv-btn-primary';
            onSelectCallback(v);
          });
          pillsWrap.appendChild(pill);
        });
        container.appendChild(pillsWrap);
      }
      // B) IF VARIANTS > 4: SLEEK COMPACT DROPDOWN (Prevents vertical blowout!)
      else {
        const selectWrap = document.createElement('div');
        selectWrap.style.position = 'relative';

        const select = document.createElement('select');
        select.className = 'zv-variant-dropdown';
        select.style.width = '100%';
        select.style.padding = '10px 14px';
        select.style.fontSize = '13px';
        select.style.fontWeight = '600';
        select.style.color = 'var(--zv-heading, #17231E)';
        select.style.background = '#FFFFFF';
        select.style.border = '1.5px solid var(--zv-primary, #17352B)';
        select.style.borderRadius = '8px';
        select.style.cursor = 'pointer';
        select.style.outline = 'none';

        product.variants.forEach((v, idx) => {
          const opt = document.createElement('option');
          opt.value = v.id;
          opt.textContent = `${v.title} — ${formatMoney(v.price)}`;
          if (idx === 0) opt.selected = true;
          select.appendChild(opt);
        });

        select.addEventListener('change', () => {
          const chosen = product.variants.find(v => String(v.id) === String(select.value));
          if (chosen) onSelectCallback(chosen);
        });

        selectWrap.appendChild(select);
        container.appendChild(selectWrap);
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

    // =========================================================================
    // MOBILE: ACCESSIBLE BOTTOM SHEET (< 768px Viewports)
    // =========================================================================
    function openMobileSheet(itemElem) {
      const rawJson = itemElem.getAttribute('data-product-json');
      if (!rawJson) return;

      try {
        currentProduct = JSON.parse(rawJson);
      } catch (err) {
        console.error('Failed to parse mobile product data', err);
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

      const cutoutImg = itemElem.getAttribute('data-cutout-src');
      if (mobileImg) {
        mobileImg.src = cutoutImg || currentProduct.featured_image || (v0.featured_image ? v0.featured_image.src : '');
        mobileImg.alt = currentProduct.title;
      }

      if (mobilePdpLink) {
        mobilePdpLink.href = '/products/' + currentProduct.handle + '?view=showroom';
      }

      renderAdaptiveVariantSelector(currentProduct, mobileVariants, function(variant) {
        selectedVariantId = variant.id;
        if (variant.featured_image && mobileImg && !cutoutImg) {
          mobileImg.src = variant.featured_image.src;
        }
        if (mobilePrice) mobilePrice.textContent = formatMoney(variant.price);
      });

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

        buttonElem.innerHTML = '<span>✓ ADDED!</span>';

        setTimeout(() => {
          closeSpatialPositionalZoom();
          closeMobileSheet();
          buttonElem.disabled = false;
          buttonElem.innerHTML = originalHtml;

          // Dispatch cart events
          document.dispatchEvent(new CustomEvent('cart:updated'));
          document.dispatchEvent(new CustomEvent('willa:cart:refresh'));

          // Trigger Willa Cart Drawer
          if (window.willaCart && typeof window.willaCart.open === 'function') {
            window.willaCart.open();
          } else {
            const drawerToggle = document.querySelector('[data-cart-drawer-toggle], .willa-cart-trigger, [aria-controls="CartDrawer"]');
            if (drawerToggle) drawerToggle.click();
          }
        }, 300);

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
        closeSpatialPositionalZoom();
        closeMobileSheet();
      }
    });

  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpatialShowroom);
  } else {
    initSpatialShowroom();
  }

})();
