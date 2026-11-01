/**
 * ZAVELYN IMMERSIVE COMMERCE THEME V4.0
 * DYNAMIC PDP BUNDLE ENGINE & CRO INTERACTION (INSPIRED BY SHOPSIDEK T01)
 */

(function() {
  'use strict';

  function initPdpEngine() {
    const buyBox = document.getElementById('zvBuyBox');
    if (!buyBox) return;

    // Elements
    const priceActiveEl = document.getElementById('zvPriceActive');
    const priceCompareEl = document.getElementById('zvPriceCompare');
    const priceSavingsEl = document.getElementById('zvPriceSavings');
    const giftUnlockBox = document.getElementById('zvGiftUnlock');
    const giftStatusBadge = document.getElementById('zvGiftStatusBadge');
    const giftTitle = document.getElementById('zvGiftTitle');
    const giftSub = document.getElementById('zvGiftSub');

    const claimBtn = document.getElementById('zvBtnClaim');
    const buyNowBtn = document.getElementById('zvBtnBuyNow');
    const stickyBar = document.getElementById('zvStickyBar');
    const stickyBtn = document.getElementById('zvStickyBtn');
    const stickyPrice = document.getElementById('zvStickyPrice');
    const mainImg = document.getElementById('zvMainImg');

    const bundleCards = buyBox.querySelectorAll('.zv-bundle-card');
    const thumbBtns = buyBox.querySelectorAll('.zv-pdp-thumb');

    let activeVariantId = buyBox.getAttribute('data-initial-variant-id');
    let activeQty = 1;
    let basePriceCents = parseInt(buyBox.getAttribute('data-initial-price'), 10) || 0;
    let baseCompareCents = parseInt(buyBox.getAttribute('data-initial-compare'), 10) || 0;

    function formatMoney(cents) {
      return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    // 1. Gallery Thumbnail Switching
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        thumbBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const src = this.getAttribute('data-src');
        if (src && mainImg) {
          mainImg.src = src;
        }
      });
    });

    // 1b. Adaptive Variant Selection (Pills & Dropdown)
    const variantPills = buyBox.querySelectorAll('.zv-variant-pill-btn');
    const variantDropdown = document.getElementById('zvVariantDropdown');
    const variantLabel = document.getElementById('zvSelectedVariantLabel');

    function onVariantSelected(variantId, priceCents, compareCents, title, imgSrc) {
      activeVariantId = variantId;
      basePriceCents = priceCents;
      baseCompareCents = compareCents;

      if (variantLabel) variantLabel.textContent = title;
      if (imgSrc && mainImg) mainImg.src = imgSrc;

      // Update prices on all bundle cards
      bundleCards.forEach(card => {
        const tierQty = parseInt(card.getAttribute('data-qty'), 10) || 1;
        card.setAttribute('data-price-cents', basePriceCents * tierQty);
        card.setAttribute('data-compare-cents', baseCompareCents * tierQty);
        const totalEl = card.querySelector('.zv-bundle-card-total');
        if (totalEl) totalEl.textContent = formatMoney(basePriceCents * tierQty);
      });

      // Update active price for currently selected bundle card
      const selectedCard = buyBox.querySelector('.zv-bundle-card.selected');
      if (selectedCard) {
        const tierQty = parseInt(selectedCard.getAttribute('data-qty'), 10) || 1;
        const currentPrice = basePriceCents * tierQty;
        const comparePrice = baseCompareCents * tierQty;

        if (priceActiveEl) priceActiveEl.textContent = formatMoney(currentPrice);
        if (stickyPrice) stickyPrice.textContent = formatMoney(currentPrice);

        if (priceCompareEl) {
          if (comparePrice > currentPrice) {
            priceCompareEl.textContent = formatMoney(comparePrice);
            priceCompareEl.style.display = 'inline';
            if (priceSavingsEl) {
              const savePct = Math.round((comparePrice - currentPrice) * 100 / comparePrice);
              priceSavingsEl.textContent = 'SAVE ' + savePct + '%';
              priceSavingsEl.style.display = 'inline';
            }
          } else {
            priceCompareEl.style.display = 'none';
            if (priceSavingsEl) priceSavingsEl.style.display = 'none';
          }
        }
      }
    }

    variantPills.forEach(pill => {
      pill.addEventListener('click', function() {
        variantPills.forEach(p => {
          p.classList.remove('active');
          p.style.background = '#FFFFFF';
          p.style.color = 'var(--zv-heading)';
          p.style.borderColor = 'var(--zv-border)';
        });
        this.classList.add('active');
        this.style.background = 'var(--zv-primary)';
        this.style.color = '#FFFFFF';
        this.style.borderColor = 'var(--zv-primary)';

        const vId = this.getAttribute('data-variant-id');
        const vPrice = parseInt(this.getAttribute('data-variant-price'), 10);
        const vCompare = parseInt(this.getAttribute('data-variant-compare'), 10);
        const vTitle = this.getAttribute('data-variant-title');
        const vImg = this.getAttribute('data-variant-img');

        onVariantSelected(vId, vPrice, vCompare, vTitle, vImg);
      });
    });

    if (variantDropdown) {
      variantDropdown.addEventListener('change', function() {
        const opt = this.options[this.selectedIndex];
        if (!opt) return;
        const vId = opt.value;
        const vPrice = parseInt(opt.getAttribute('data-variant-price'), 10);
        const vCompare = parseInt(opt.getAttribute('data-variant-compare'), 10);
        const vTitle = opt.getAttribute('data-variant-title');
        const vImg = opt.getAttribute('data-variant-img');

        onVariantSelected(vId, vPrice, vCompare, vTitle, vImg);
      });
    }

    // 2. Bundle Card Click Handler
    bundleCards.forEach(card => {
      card.addEventListener('click', function() {
        bundleCards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');

        const tierQty = parseInt(this.getAttribute('data-qty'), 10) || 1;
        const mappedVariantId = this.getAttribute('data-variant-id');
        const cardPriceCents = parseInt(this.getAttribute('data-price-cents'), 10);
        const cardCompareCents = parseInt(this.getAttribute('data-compare-cents'), 10);

        if (mappedVariantId) {
          // Native bundle variant (e.g. Storage Bins 6-pack, Dentures 3-pack)
          activeVariantId = mappedVariantId;
          activeQty = 1;
        } else {
          // Multiplier on base variant
          activeQty = tierQty;
        }

        // Calculate and render price
        let currentPrice = cardPriceCents || (basePriceCents * activeQty);
        let comparePrice = cardCompareCents || (baseCompareCents * activeQty);

        if (priceActiveEl) priceActiveEl.textContent = formatMoney(currentPrice);
        if (stickyPrice) stickyPrice.textContent = formatMoney(currentPrice);

        if (priceCompareEl) {
          if (comparePrice > currentPrice) {
            priceCompareEl.textContent = formatMoney(comparePrice);
            priceCompareEl.style.display = 'inline';
            if (priceSavingsEl) {
              const savePct = Math.round((comparePrice - currentPrice) * 100 / comparePrice);
              priceSavingsEl.textContent = 'SAVE ' + savePct + '%';
              priceSavingsEl.style.display = 'inline';
            }
          } else {
            priceCompareEl.style.display = 'none';
            if (priceSavingsEl) priceSavingsEl.style.display = 'none';
          }
        }

        // Update Gift Unlock Progression Bar
        updateGiftProgression(tierQty);
      });
    });

    function updateGiftProgression(qty) {
      if (!giftUnlockBox) return;

      if (qty >= 3) {
        giftUnlockBox.classList.add('unlocked');
        if (giftStatusBadge) {
          giftStatusBadge.textContent = 'UNLOCKED';
        }
        if (giftTitle) giftTitle.textContent = '🎁 FREE Mystery Gift & Priority Shipping';
        if (giftSub) giftSub.textContent = 'You unlocked the maximum tier bundle perks!';
      } else if (qty === 2) {
        giftUnlockBox.classList.add('unlocked');
        if (giftStatusBadge) {
          giftStatusBadge.textContent = 'UNLOCKED';
        }
        if (giftTitle) giftTitle.textContent = '🚚 FREE Tracked US Shipping Unlocked';
        if (giftSub) giftSub.textContent = 'Order 3 to also unlock a Free Mystery Gift!';
      } else {
        giftUnlockBox.classList.remove('unlocked');
        if (giftStatusBadge) {
          giftStatusBadge.textContent = 'LOCKED';
        }
        if (giftTitle) giftTitle.textContent = 'Add 1 More to Unlock FREE US Shipping';
        if (giftSub) giftSub.textContent = 'Orders over $49 qualify for fast tracked delivery';
      }
    }

    // 3. Add To Cart Execution
    async function executeAddToCart(goToCheckout = false) {
      if (!activeVariantId) return;

      const btn = goToCheckout ? buyNowBtn : claimBtn;
      const originalText = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>PROCESSING...</span>';
      }

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            items: [{
              id: activeVariantId,
              quantity: activeQty
            }]
          })
        });

        if (!res.ok) {
          throw new Error('Failed to add item to cart');
        }

        if (goToCheckout) {
          window.location.href = '/checkout';
          return;
        }

        // Open Cart Drawer
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
        alert('Could not complete order. Please try again.');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      }
    }

    if (claimBtn) {
      claimBtn.addEventListener('click', () => executeAddToCart(false));
    }
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => executeAddToCart(true));
    }
    if (stickyBtn) {
      stickyBtn.addEventListener('click', () => executeAddToCart(false));
    }

    // 4. Sticky Bar Scroll Trigger
    if (stickyBar && buyBox) {
      window.addEventListener('scroll', function() {
        const rect = buyBox.getBoundingClientRect();
        if (rect.bottom < 100) {
          stickyBar.classList.add('visible');
        } else {
          stickyBar.classList.remove('visible');
        }
      });
    }

    // 5. Interactive Explainer Tabs (if present in story sections)
    const explainerTabs = document.querySelectorAll('.zv-explainer-tab');
    const explainerPanels = document.querySelectorAll('.zv-explainer-panel');
    explainerTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        explainerTabs.forEach(t => t.classList.remove('active'));
        explainerPanels.forEach(p => p.classList.remove('active'));

        this.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPdpEngine);
  } else {
    initPdpEngine();
  }
})();
