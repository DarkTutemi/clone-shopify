/**
 * ZAVELYN BOTANAROOTS — REFINED DTC BUNDLE & SIZE UPSELL JS
 * Scoped strictly to: zavelyn-botanaroots-organic-batana-hair-growth-oil
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
          '1': { id: '67980643598521', price: 3900, sku: 'ZAV-BOTANA-1PK-PURE' },
          '2': { id: '67980643664057', price: 6900, sku: 'ZAV-BOTANA-2PK-PURE' },
          '3': { id: '67980643729593', price: 8900, sku: 'ZAV-BOTANA-3PK-PURE' }
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
        console.warn('BotanaRoots: Could not parse custom variant data, using fallback.', e);
      }
    }

    // State: Buy 3 default, 60ml default
    let selectedBundle = 3;
    let isSizeUpgraded = false;
    const selectedFormula = 'pure';

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

    // Modal elements
    const previewModal = document.getElementById('zvPreviewModal');
    const modalBackdrop = document.getElementById('zvModalBackdrop');
    const modalClose = document.getElementById('zvModalClose');
    const modalMsg = document.getElementById('zvModalMsg');

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
            ? `$${cardPricing['120ml'].toFixed(2)}` 
            : `$${cardPricing['60ml'].toFixed(2)}`;
        }
        if (unitElem && cardPricing) {
          const unitVal = isSizeUpgraded ? cardPricing['unit120'] : cardPricing['unit60'];
          unitElem.textContent = `$${unitVal.toFixed(2)} / bottle`;
        }
      });

      // 2. Update Upsell Card
      if (upsellCard && upsellCheck) {
        upsellCard.classList.toggle('active', isSizeUpgraded);
        upsellCheck.checked = isSizeUpgraded;
      }
      if (upsellDelta) {
        upsellDelta.textContent = `+ $${pricing.delta.toFixed(2)}`;
      }

      // 3. Update Summary Box
      const totalAmount = isSizeUpgraded ? pricing['120ml'] : pricing['60ml'];
      const unitAmount = isSizeUpgraded ? pricing['unit120'] : pricing['unit60'];
      const bottleVolume = isSizeUpgraded ? '120ml' : '60ml';

      if (summaryPackage) {
        summaryPackage.innerHTML = `${selectedBundle} &times; ${bottleVolume}`;
      }
      if (summaryTotal) {
        summaryTotal.textContent = `$${totalAmount.toFixed(2)}`;
      }
      if (summaryUnitPill) {
        summaryUnitPill.textContent = `$${unitAmount.toFixed(2)} / bottle`;
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

      // 4. Update CTA Button
      if (ctaPrice) {
        ctaPrice.textContent = `$${totalAmount.toFixed(2)}`;
      }

      // 5. Synchronize Sticky ATC if present
      syncStickyAtc(totalAmount);
    }

    function syncStickyAtc(totalAmount) {
      const stickyBtn = document.getElementById('zvStickyAtcBtn');
      if (stickyBtn) {
        const priceSpan = stickyBtn.querySelector('.zv-sticky-price');
        if (priceSpan) {
          priceSpan.textContent = `$${totalAmount.toFixed(2)}`;
        }
      }
    }

    // Modal Helpers
    function showModal(msg) {
      if (modalMsg) modalMsg.innerHTML = msg;
      if (previewModal) previewModal.style.display = 'flex';
    }

    function closeModal() {
      if (previewModal) previewModal.style.display = 'none';
    }

    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);

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

    // Event Listener: Upsell Checkbox & Card
    if (upsellCheck) {
      upsellCheck.addEventListener('change', function() {
        isSizeUpgraded = this.checked;
        renderState();
      });
    }

    if (upsellCard) {
      upsellCard.addEventListener('click', function(e) {
        if (e.target !== upsellCheck) {
          e.preventDefault();
          if (upsellCheck) {
            upsellCheck.checked = !upsellCheck.checked;
            isSizeUpgraded = upsellCheck.checked;
            renderState();
          }
        }
      });
    }

    // CTA Add-to-Cart Action
    async function handleAddToCart(e) {
      if (e) e.preventDefault();

      const pricing = variantData.pricingMatrix[String(selectedBundle)];
      const currentPrice = isSizeUpgraded ? pricing['120ml'] : pricing['60ml'];

      if (isSizeUpgraded) {
        showModal(
          `You selected <strong>Buy ${selectedBundle} &times; 120ml</strong> ($${currentPrice.toFixed(2)}).<br><br>` +
          `<em>[Shopify Admin Notice]</em>: The 120ml bottle upgrade requires creating 120ml variants in Shopify Admin before live checkout routing.<br><br>` +
          `To proceed with actual checkout today, please select the <strong>60ml Bottles</strong> option.`
        );
        return;
      }

      // For 60ml, get actual Shopify Variant ID
      const variantGroup = variantData.variants[selectedFormula] || variantData.variants.pure;
      const targetVariant = variantGroup[String(selectedBundle)];

      if (!targetVariant || !targetVariant.id) {
        console.error('Target variant not found for bundle:', selectedBundle);
        window.location.href = `/cart`;
        return;
      }

      const originalText = ctaBtn.innerHTML;
      ctaBtn.disabled = true;
      ctaBtn.innerHTML = `<span>ADDING TO CART...</span>`;

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [{
              id: targetVariant.id,
              quantity: 1
            }]
          })
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
            window.location.href = '/cart';
          }
        } else {
          window.location.href = `/cart/${targetVariant.id}:1`;
        }
      } catch (err) {
        console.error('Add to cart error:', err);
        window.location.href = `/cart/${targetVariant.id}:1`;
      } finally {
        ctaBtn.disabled = false;
        ctaBtn.innerHTML = originalText;
        renderState();
      }
    }

    if (ctaBtn) {
      ctaBtn.addEventListener('click', handleAddToCart);
    }

    const stickyAtcBtn = document.getElementById('zvStickyAtcBtn');
    if (stickyAtcBtn) {
      stickyAtcBtn.addEventListener('click', handleAddToCart);
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
