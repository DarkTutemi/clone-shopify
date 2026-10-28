/**
 * ZAVELYN BOTANAROOTS — REFINED DTC BUNDLE & SIZE UPSELL JS
 * Scoped strictly to: zavelyn-botanaroots-organic-batana-hair-growth-oil
 * Supports: Buy 1/2/3, 60ml/120ml upgrade, Claim Offer (Cart Drawer) & Buy Now (Checkout)
 */

(function() {
  'use strict';

  function initBotanaBundle() {
    const root = document.getElementById('zvBotanaBundleComponent');
    if (!root) return;

    // Load variant and pricing data
    let variantData = {
      variants: {
        pure: {
          '60ml': {
            '1': { id: '67980643598521', price: 3999, sku: 'ZAV-BOTANA-1PK-PURE' },
            '2': { id: '67980643664057', price: 7998, sku: 'ZAV-BOTANA-2PK-PURE' },
            '3': { id: '67980643729593', price: 9599, sku: 'ZAV-BOTANA-3PK-PURE' }
          },
          '120ml': {
            '1': { id: '68036047831225', price: 4999, sku: 'ZAV-BOTANA-1PK-PURE-120ML' },
            '2': { id: '68036048453817', price: 9998, sku: 'ZAV-BOTANA-2PK-PURE-120ML' },
            '3': { id: '68036048715961', price: 12599, sku: 'ZAV-BOTANA-3PK-PURE-120ML' }
          }
        },
        rosemary: {
          '60ml': {
            '1': { id: '67980643631289', price: 3999, sku: 'ZAV-BOTANA-1PK-ROSE' },
            '2': { id: '67980643696825', price: 7998, sku: 'ZAV-BOTANA-2PK-ROSE' },
            '3': { id: '67980643762361', price: 9599, sku: 'ZAV-BOTANA-3PK-ROSE' }
          },
          '120ml': {
            '1': { id: '68036048257209', price: 4999, sku: 'ZAV-BOTANA-1PK-ROSE-120ML' },
            '2': { id: '68036048584889', price: 9998, sku: 'ZAV-BOTANA-2PK-ROSE-120ML' },
            '3': { id: '68036048912569', price: 12599, sku: 'ZAV-BOTANA-3PK-ROSE-120ML' }
          }
        }
      },
      pricingMatrix: {
        '1': { '60ml': 39.99, '120ml': 49.99, 'unit60': 39.99, 'unit120': 49.99, 'delta': 10.00 },
        '2': { '60ml': 79.98, '120ml': 99.98, 'unit60': 39.99, 'unit120': 49.99, 'delta': 20.00 },
        '3': { '60ml': 95.99, '120ml': 125.99, 'unit60': 32.00, 'unit120': 42.00, 'delta': 30.00 }
      }
    };

    const dataScript = document.getElementById('zvBotanaVariantData');
    if (dataScript) {
      try {
        const parsed = JSON.parse(dataScript.textContent);
        if (parsed.variants && parsed.pricingMatrix) {
          variantData = parsed;
        }
      } catch (e) {
        console.warn('BotanaRoots: Using built-in variant mapping matrix.', e);
      }
    }

    // State: Buy 3 default, 60ml default, Pure default
    let selectedBundle = 3;
    let isSizeUpgraded = false;
    const selectedFormula = 'pure';
    let isSubmitting = false;

    // Elements
    const bundleCards = root.querySelectorAll('.zv-bundle-card');
    const upsellCard = document.getElementById('zvUpsellCard');
    const upsellCheck = document.getElementById('zvSizeUpgradeCheck');
    const upsellDelta = document.getElementById('zvUpsellDelta');
    const summaryPackage = document.getElementById('zvSummaryPackage');
    const summaryTotal = document.getElementById('zvSummaryTotal');
    const summaryUnitPill = document.getElementById('zvSummaryUnitPill');
    const summaryShipping = document.getElementById('zvSummaryShipping');
    const shippingText = document.getElementById('zvShippingText');
    const ctaBtn = document.getElementById('zvBotanaCtaBtn');
    const ctaPrice = document.getElementById('zvCtaPrice');
    const buyNowBtn = document.getElementById('zvBotanaBuyNowBtn');

    // Get Active Variant ID
    function getActiveVariantId() {
      const sizeKey = isSizeUpgraded ? '120ml' : '60ml';
      const formulaGroup = variantData.variants[selectedFormula] || variantData.variants.pure;
      const sizeGroup = formulaGroup[sizeKey] || formulaGroup['60ml'];
      const v = sizeGroup[String(selectedBundle)];
      return v ? v.id : null;
    }

    // Build Line Item Payload with Manual Fulfillment Details
    function buildLineItemPayload() {
      const variantId = getActiveVariantId();
      const sizeStr = isSizeUpgraded ? '120ml' : '60ml';
      const offerStr = 'Buy ' + selectedBundle;
      const bottleCount = String(selectedBundle);
      const formulaStr = (selectedFormula === 'rosemary') ? 'Batana + Rosemary Scalp Infusion' : '100% Pure Raw Honduran Batana';
      const fulfillmentMsg = 'SHIP ' + selectedBundle + ' × ' + sizeStr.toUpperCase() + ' BOTTLES';

      return {
        id: variantId,
        quantity: 1,
        properties: {
          'Offer': offerStr,
          'Bottle Size': sizeStr,
          'Bottles to Ship': bottleCount,
          'Formula': formulaStr,
          'Manual Fulfillment': fulfillmentMsg
        }
      };
    }

    // Synchronize UI
    function renderState() {
      const bundleStr = String(selectedBundle);
      const pricing = variantData.pricingMatrix[bundleStr] || variantData.pricingMatrix['3'];

      // 1. Update Bundle Cards: toggle .selected and update inner contents
      bundleCards.forEach(card => {
        const b = parseInt(card.getAttribute('data-bundle'), 10);
        const isSelected = (b === selectedBundle);
        card.classList.toggle('selected', isSelected);
        card.setAttribute('aria-checked', isSelected ? 'true' : 'false');

        // Update bottle count description based on size upgrade
        const bottleElem = card.querySelector('.zv-card-bottles');
        if (bottleElem) {
          bottleElem.innerHTML = isSizeUpgraded 
            ? bottleElem.getAttribute('data-upgraded')
            : bottleElem.getAttribute('data-default');
        }

        // Update pricing display
        const priceElem = card.querySelector('.zv-card-total-price');
        const unitElem = card.querySelector('.zv-card-unit-price');
        const cardPricing = variantData.pricingMatrix[String(b)];
        if (priceElem && cardPricing) {
          priceElem.textContent = isSizeUpgraded 
            ? '$' + cardPricing['120ml'].toFixed(2) 
            : '$' + cardPricing['60ml'].toFixed(2);
        }
        if (unitElem && cardPricing) {
          const unitVal = isSizeUpgraded ? cardPricing['unit120'] : cardPricing['unit60'];
          unitElem.textContent = '$' + unitVal.toFixed(2) + ' / bottle';
        }
      });

      // 2. Update Upsell Card
      if (upsellCard) {
        upsellCard.classList.toggle('active', isSizeUpgraded);
        upsellCard.setAttribute('aria-checked', isSizeUpgraded ? 'true' : 'false');
      }
      if (upsellCheck) {
        upsellCheck.checked = isSizeUpgraded;
      }
      if (upsellDelta) {
        upsellDelta.textContent = '+ $' + pricing.delta.toFixed(2);
      }

      // 3. Update Summary Box
      const totalAmount = isSizeUpgraded ? pricing['120ml'] : pricing['60ml'];
      const unitAmount = isSizeUpgraded ? pricing['unit120'] : pricing['unit60'];
      const bottleVolume = isSizeUpgraded ? '120ml' : '60ml';

      if (summaryPackage) {
        summaryPackage.innerHTML = selectedBundle + ' &times; ' + bottleVolume;
      }
      if (summaryTotal) {
        summaryTotal.textContent = '$' + totalAmount.toFixed(2);
      }
      if (summaryUnitPill) {
        summaryUnitPill.textContent = '$' + unitAmount.toFixed(2) + ' / bottle';
      }

      // Shipping line indicator
      if (summaryShipping && shippingText) {
        if (selectedBundle === 3) {
          shippingText.textContent = 'Free standard shipping included';
          summaryShipping.style.color = '#15803D';
        } else if (selectedBundle === 2) {
          shippingText.textContent = 'Free standard shipping included (Order over $49)';
          summaryShipping.style.color = '#15803D';
        } else {
          shippingText.textContent = 'Standard shipping calculated at checkout (+$4.95)';
          summaryShipping.style.color = '#C2410C';
        }
      }

      // 4. Update CTA Price
      if (ctaPrice) {
        ctaPrice.textContent = '$' + totalAmount.toFixed(2);
      }

      // 5. Synchronize Sticky ATC if present
      syncStickyAtc(totalAmount);
    }

    function syncStickyAtc(totalAmount) {
      const stickyPrice = document.getElementById('zvStickyPrice');
      if (stickyPrice) {
        stickyPrice.textContent = '$' + totalAmount.toFixed(2);
      }
      const stickyBtn = document.getElementById('zvStickyBtn') || document.getElementById('zvStickyAtcBtn');
      if (stickyBtn) {
        const pSpan = stickyBtn.querySelector('.zv-sticky-price');
        if (pSpan) pSpan.textContent = '$' + totalAmount.toFixed(2);
      }
    }

    // Event Listeners: Bundle Selection
    bundleCards.forEach(card => {
      card.addEventListener('click', function() {
        const b = parseInt(this.getAttribute('data-bundle'), 10);
        if (b && b !== selectedBundle) {
          selectedBundle = b;
          renderState();
        }
      });

      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Helper to toggle size upgrade deterministically
    function toggleSizeUpgrade() {
      isSizeUpgraded = !isSizeUpgraded;
      renderState();
    }

    // Event Listener: Upsell Checkbox & Card
    if (upsellCard) {
      upsellCard.addEventListener('click', function(e) {
        if (e.target !== upsellCheck) {
          e.preventDefault();
        }
        toggleSizeUpgrade();
      });

      upsellCard.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSizeUpgrade();
        }
      });
    }

    if (upsellCheck) {
      upsellCheck.addEventListener('change', function(e) {
        isSizeUpgraded = this.checked;
        renderState();
      });
    }

    // CTA 1: CLAIM OFFER (Adds to Cart & Opens Cart Drawer)
    async function handleClaimOffer(e) {
      if (e) e.preventDefault();
      if (isSubmitting) return;
      isSubmitting = true;

      const payload = buildLineItemPayload();
      if (!payload.id) {
        console.error('Target variant not found for selection:', selectedBundle, isSizeUpgraded);
        window.location.href = '/cart';
        return;
      }

      const originalText = ctaBtn ? ctaBtn.innerHTML : '';
      if (ctaBtn) {
        ctaBtn.disabled = true;
        ctaBtn.innerHTML = '<span>ADDING TO CART...</span>';
      }

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ items: [payload] })
        });

        if (response.ok) {
          // Trigger Willa / Zavelyn Cart Drawer
          if (typeof window.willaRefreshCart === 'function') {
            await window.willaRefreshCart();
          }
          if (typeof window.willaOpenCartDrawer === 'function') {
            window.willaOpenCartDrawer();
          } else if (typeof window.openWillaCart === 'function') {
            window.openWillaCart();
          } else {
            const zavelynDrawer = document.querySelector('zavelyn-cart-drawer');
            if (zavelynDrawer && typeof zavelynDrawer.open === 'function') {
              if (typeof zavelynDrawer.refresh === 'function') await zavelynDrawer.refresh();
              zavelynDrawer.open();
            } else {
              window.location.href = '/cart';
            }
          }
        } else {
          window.location.href = '/cart/' + payload.id + ':1';
        }
      } catch (err) {
        console.error('Add to cart error:', err);
        window.location.href = '/cart/' + payload.id + ':1';
      } finally {
        if (ctaBtn) {
          ctaBtn.disabled = false;
          ctaBtn.innerHTML = originalText;
        }
        isSubmitting = false;
        renderState();
      }
    }

    // CTA 2: BUY NOW (Adds to Cart & Direct Checkout Redirect)
    async function handleBuyNow(e) {
      if (e) e.preventDefault();
      if (isSubmitting) return;
      isSubmitting = true;

      const payload = buildLineItemPayload();
      if (!payload.id) {
        console.error('Target variant not found for selection:', selectedBundle, isSizeUpgraded);
        window.location.href = '/checkout';
        return;
      }

      const btn = buyNowBtn || document.getElementById('zvBotanaBuyNowBtn');
      const originalText = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>⚡ SECURING CHECKOUT...</span>';
      }

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ items: [payload] })
        });

        if (response.ok) {
          window.location.href = '/checkout';
        } else {
          window.location.href = '/checkout';
        }
      } catch (err) {
        console.error('Buy Now error:', err);
        window.location.href = '/checkout';
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
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

    // Intercept mobile sticky button to ensure correct bundle/size payload
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
    document.addEventListener('DOMContentLoaded', initBotanaBundle);
  } else {
    initBotanaBundle();
  }
})();
