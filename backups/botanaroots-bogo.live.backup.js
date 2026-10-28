/**
 * ZAVELYN BOTANAROOTS — EXCLUSIVE BOGO LANDING PAGE CONTROLLER
 * Scoped strictly to: /pages/botanaroots-bogo-offer
 * Theme Asset: assets/botanaroots-bogo.js
 * 100% Native Shopify Checkout with Dedicated BOGO Product Variants
 */

(function() {
  'use strict';

  function initBotanaBogoBundle() {
    const root = document.getElementById('zvBotanaBogoComponent');
    if (!root) return;

    let selectedBundle = 'buy4get4'; // Default selected: Buy 4 Get 4 Free
    let isSizeUpgraded = false;
    let isSubmitting = false;

    // Load Variant Data Matrix
    let variantData = null;
    const dataScript = document.getElementById('zvBotanaBogoVariantData');
    if (dataScript) {
      try {
        variantData = JSON.parse(dataScript.textContent);
      } catch (e) {
        console.error('Failed to parse BOGO variant data:', e);
      }
    }

    // Fallback Matrix if script tag is missing
    const FALLBACK_MATRIX = {
      variants: {
        pure: {
          buy4get4: {
            '60ml': { id: '68035793158329', price: 159.96, unit: 20.00, sku: 'ZAV-BTR-BOGO-8X60-PURE', bottles: 8, paid: 4, free: 4, delta: 80.00 },
            '120ml': { id: '68035795058873', price: 239.96, unit: 30.00, sku: 'ZAV-BTR-BOGO-8X120-PURE', bottles: 8, paid: 4, free: 4, delta: 80.00 }
          },
          buy2get2: {
            '60ml': { id: '68035795091641', price: 79.98, unit: 20.00, sku: 'ZAV-BTR-BOGO-4X60-PURE', bottles: 4, paid: 2, free: 2, delta: 40.00 },
            '120ml': { id: '68035795124409', price: 119.98, unit: 30.00, sku: 'ZAV-BTR-BOGO-4X120-PURE', bottles: 4, paid: 2, free: 2, delta: 40.00 }
          },
          buy1: {
            '60ml': { id: '68035795157177', price: 39.99, unit: 39.99, sku: 'ZAV-BTR-BOGO-1X60-PURE', bottles: 1, paid: 1, free: 0, delta: 10.00 },
            '120ml': { id: '68035795189945', price: 49.99, unit: 49.99, sku: 'ZAV-BTR-BOGO-1X120-PURE', bottles: 1, paid: 1, free: 0, delta: 10.00 }
          }
        }
      }
    };

    const matrix = (variantData && variantData.variants) ? variantData.variants.pure : FALLBACK_MATRIX.variants.pure;

    // DOM Elements
    const cards = root.querySelectorAll('.zv-bundle-card');
    const upsellCard = document.getElementById('zvUpsellCard');
    const upsellCheck = document.getElementById('zvSizeUpgradeCheck');
    const upsellDeltaElem = document.getElementById('zvUpsellDelta');
    const summaryPackage = document.getElementById('zvSummaryPackage');
    const summaryTotal = document.getElementById('zvSummaryTotal');
    const summaryUnitPill = document.getElementById('zvSummaryUnitPill');
    const summaryShipping = document.getElementById('zvSummaryShipping');
    const shippingText = document.getElementById('zvShippingText');
    const ctaBtn = document.getElementById('zvBotanaCtaBtn');
    const buyNowBtn = document.getElementById('zvBotanaBuyNowBtn');
    const buy1Badge = document.getElementById('zvBuy1ShippingBadge');

    function getCurrentInfo() {
      const sizeKey = isSizeUpgraded ? '120ml' : '60ml';
      const offer = matrix[selectedBundle];
      const variant = offer ? offer[sizeKey] : null;
      return {
        bundle: selectedBundle,
        sizeKey: sizeKey,
        bottleVolume: sizeKey,
        variant: variant
      };
    }

    function renderState() {
      const info = getCurrentInfo();
      const variant = info.variant;
      if (!variant) return;

      // 1. Update Bundle Cards Selection & Pricing
      cards.forEach(card => {
        const bundleKey = card.getAttribute('data-bundle');
        const isSelected = (bundleKey === selectedBundle);
        card.classList.toggle('selected', isSelected);
        card.setAttribute('aria-checked', isSelected ? 'true' : 'false');

        const cardData = matrix[bundleKey] ? matrix[bundleKey][info.sizeKey] : null;
        if (cardData) {
          const priceElem = card.querySelector('.zv-card-total-price');
          const unitElem = card.querySelector('.zv-card-unit-price');
          const bottlesElem = card.querySelector('.zv-card-bottles');

          if (priceElem) priceElem.textContent = '$' + cardData.price.toFixed(2);
          if (unitElem) unitElem.textContent = '$' + cardData.unit.toFixed(2) + ' / bottle';
          if (bottlesElem) {
            const defaultTxt = bottlesElem.getAttribute('data-default');
            const upgradedTxt = bottlesElem.getAttribute('data-upgraded');
            bottlesElem.textContent = isSizeUpgraded ? (upgradedTxt || defaultTxt) : (defaultTxt || upgradedTxt);
          }
        }
      });

      // 2. Update Buy 1 Shipping Badge
      if (buy1Badge) {
        if (isSizeUpgraded) {
          buy1Badge.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg> FREE SHIPPING';
          buy1Badge.style.background = '#ECFDF5';
          buy1Badge.style.color = '#047857';
        } else {
          buy1Badge.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg> Shipping +$4.95';
          buy1Badge.style.background = '#F3F4F6';
          buy1Badge.style.color = '#4B5563';
        }
      }

      // 3. Update Upgrade Card Active State & Delta
      if (upsellCard) {
        upsellCard.classList.toggle('active', isSizeUpgraded);
        upsellCard.setAttribute('aria-checked', isSizeUpgraded ? 'true' : 'false');
      }
      if (upsellCheck) {
        upsellCheck.checked = isSizeUpgraded;
      }
      if (upsellDeltaElem) {
        upsellDeltaElem.textContent = '+ $' + variant.delta.toFixed(2);
      }

      // 4. Update Live Summary Box
      if (summaryPackage) {
        const bottleNoun = (variant.bottles === 1) ? 'Bottle' : 'Bottles';
        const freePart = (variant.free > 0) ? (' (' + variant.paid + ' Paid + ' + variant.free + ' FREE)') : '';
        summaryPackage.innerHTML = variant.bottles + ' &times; ' + info.bottleVolume + ' ' + bottleNoun + '<span class="zv-sub-note">' + freePart + '</span>';
      }
      if (summaryTotal) {
        summaryTotal.textContent = '$' + variant.price.toFixed(2);
      }
      if (summaryUnitPill) {
        summaryUnitPill.textContent = '$' + variant.unit.toFixed(2) + ' / bottle';
      }
      if (shippingText) {
        if (selectedBundle === 'buy1' && !isSizeUpgraded) {
          shippingText.textContent = 'Standard shipping +$4.95 (at checkout)';
        } else {
          shippingText.textContent = 'Free standard shipping included';
        }
      }

      // 5. Update CTA Button Price (Safely find #zvCtaPrice without wiping outer DOM)
      const ctaPrice = document.getElementById('zvCtaPrice');
      if (ctaPrice) {
        ctaPrice.textContent = '$' + variant.price.toFixed(2);
      }
    }

    // Bind Bundle Card Clicks & Keyboard
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const bundleKey = card.getAttribute('data-bundle');
        if (bundleKey && matrix[bundleKey]) {
          selectedBundle = bundleKey;
          renderState();
        }
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const bundleKey = card.getAttribute('data-bundle');
          if (bundleKey && matrix[bundleKey]) {
            selectedBundle = bundleKey;
            renderState();
          }
        }
      });
    });

    // Toggle Size Upgrade (Deterministic single event)
    function toggleSizeUpgrade(e) {
      if (e) e.preventDefault();
      isSizeUpgraded = !isSizeUpgraded;
      renderState();
    }

    if (upsellCard) {
      upsellCard.addEventListener('click', toggleSizeUpgrade);
      upsellCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggleSizeUpgrade(e);
        }
      });
    }

    // Build Payload with Full Manual Fulfillment Details
    function buildLineItemPayload() {
      const info = getCurrentInfo();
      const variant = info.variant;
      const offerNames = {
        buy4get4: 'BUY 4 GET 4 FREE',
        buy2get2: 'BUY 2 GET 2 FREE',
        buy1: 'BUY 1'
      };

      const offerName = offerNames[selectedBundle] || 'BOGO Offer';
      const manualInstruction = 'SHIP ' + variant.bottles + ' × ' + info.bottleVolume + ' BOTTLES (' + variant.paid + ' Paid + ' + variant.free + ' Free)';

      return {
        id: parseInt(variant.id, 10),
        quantity: 1,
        properties: {
          'Offer': offerName,
          'Formula': 'Pure Raw',
          'Bottle Size': info.bottleVolume,
          'Bottles to Ship': String(variant.bottles),
          'Paid Bottles': String(variant.paid),
          'Free Bottles': String(variant.free),
          'Manual Fulfillment': manualInstruction
        }
      };
    }

    // Safely update Cart Order Note for manual fulfillment backup
    async function updateOrderNote() {
      try {
        const info = getCurrentInfo();
        const variant = info.variant;
        const noteText = 'MANUAL FULFILLMENT — BOTANAROOTS BOGO: Ship ' + variant.bottles + ' × ' + info.bottleVolume + ' Pure Raw Batana Oil bottles (' + variant.paid + ' Paid + ' + variant.free + ' Free).';
        await fetch('/cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ note: noteText })
        });
      } catch (err) {
        console.warn('Note update skipped:', err);
      }
    }

    // CTA 1: CLAIM OFFER (Adds to Cart & Opens Cart Drawer)
    async function handleClaimOffer(e) {
      if (e) e.preventDefault();
      if (isSubmitting) return;
      isSubmitting = true;

      const payload = buildLineItemPayload();
      const textSpan = ctaBtn ? ctaBtn.querySelector('.zv-cta-text') : null;
      const originalText = textSpan ? textSpan.textContent : 'CLAIM OFFER';

      if (textSpan) textSpan.textContent = 'ADDING TO CART...';
      if (ctaBtn) ctaBtn.disabled = true;

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ items: [payload] })
        });

        if (response.ok) {
          await updateOrderNote();

          // Dispatch theme cart refresh events
          document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
          document.dispatchEvent(new CustomEvent('cart:open', { bubbles: true }));

          if (typeof window.willaOpenCartDrawer === 'function') {
            window.willaOpenCartDrawer();
          } else if (typeof window.openWillaCart === 'function') {
            window.openWillaCart();
          } else {
            const drawer = document.querySelector('cart-drawer, #cart-drawer, .cart-drawer, [data-cart-drawer], willa-cart-drawer, zavelyn-cart-drawer');
            if (drawer && typeof drawer.open === 'function') {
              if (typeof drawer.refresh === 'function') await drawer.refresh();
              drawer.open();
            } else {
              window.location.href = '/cart';
            }
          }
        } else {
          // If 422 or error, graceful fallback
          window.location.href = '/cart/' + payload.id + ':1';
        }
      } catch (err) {
        console.error('Add to Cart Error:', err);
        window.location.href = '/cart/' + payload.id + ':1';
      } finally {
        if (textSpan) textSpan.textContent = originalText;
        if (ctaBtn) ctaBtn.disabled = false;
        isSubmitting = false;
        renderState();
      }
    }

    // CTA 2: BUY NOW (Direct 1-Click Checkout)
    async function handleBuyNow(e) {
      if (e) e.preventDefault();
      if (isSubmitting) return;
      isSubmitting = true;

      const payload = buildLineItemPayload();
      const originalText = buyNowBtn ? buyNowBtn.textContent : '⚡ BUY NOW (1-CLICK CHECKOUT)';
      if (buyNowBtn) {
        buyNowBtn.disabled = true;
        buyNowBtn.textContent = '⚡ SECURING CHECKOUT...';
      }

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ items: [payload] })
        });

        if (response.ok) {
          await updateOrderNote();
          window.location.href = '/checkout';
        } else {
          window.location.href = '/checkout';
        }
      } catch (err) {
        console.error('Buy Now Error:', err);
        window.location.href = '/checkout';
      } finally {
        if (buyNowBtn) {
          buyNowBtn.disabled = false;
          buyNowBtn.textContent = originalText;
        }
        isSubmitting = false;
      }
    }

    // Attach Listeners
    if (ctaBtn) {
      ctaBtn.addEventListener('click', handleClaimOffer);
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', handleBuyNow);
    }

    // Mobile sticky bar integration
    const stickyBtn = document.getElementById('zvStickyBtn') || document.getElementById('zvStickyAtcBtn');
    if (stickyBtn) {
      const cloned = stickyBtn.cloneNode(true);
      stickyBtn.parentNode.replaceChild(cloned, stickyBtn);
      cloned.addEventListener('click', handleClaimOffer);
    }

    // Initial render
    renderState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBotanaBogoBundle);
  } else {
    initBotanaBogoBundle();
  }
})();
