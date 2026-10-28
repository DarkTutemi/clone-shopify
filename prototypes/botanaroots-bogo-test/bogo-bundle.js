/**
 * ZAVELYN BOTANAROOTS — BOGO OFFER A/B TEST BUNDLE LOGIC
 * Architecture: Isolated, stateful DTC controller
 * Handles all 6 combinations with real-time UI/pricing synchronization
 */

(function() {
  'use strict';

  const BUNDLE_DATA = {
    buy4get4: {
      key: 'buy4get4',
      name: 'Buy 4 Get 4 FREE',
      tagline: 'BEST VALUE · FREE SHIPPING · 4 FREE BOTTLES',
      deliveredBottles: 8,
      paidBottles: 4,
      freeBottles: 4,
      price60: 159.96,
      unit60: 20.00,
      upgradeDelta: 80.00, // 8 bottles * $10
      price120: 239.96,
      unit120: 30.00,
      shippingText: 'Free Express US Shipping Included ($0.00)',
      shippingCost: 0,
      badgeText: 'BEST VALUE · FREE SHIPPING · 4 FREE BOTTLES',
      shopifyMapping: {
        status: 'REQUIRES_BOGO_DISCOUNT_FUNCTION_OR_BUNDLE_VARIANT',
        note: 'Requires Shopify Functions Automatic Discount (Buy 4 Batana Oil, Get 4 Free at $159.96) or dedicated bundle SKU.'
      }
    },
    buy2get2: {
      key: 'buy2get2',
      name: 'Buy 2 Get 2 FREE',
      tagline: 'MOST POPULAR · 2 FREE BOTTLES',
      deliveredBottles: 4,
      paidBottles: 2,
      freeBottles: 2,
      price60: 79.98,
      unit60: 20.00,
      upgradeDelta: 40.00, // 4 bottles * $10
      price120: 119.98,
      unit120: 30.00,
      shippingText: 'Free Standard Shipping (Orders Over $49)',
      shippingCost: 0,
      badgeText: 'MOST POPULAR · 2 FREE BOTTLES',
      shopifyMapping: {
        status: 'REQUIRES_BOGO_DISCOUNT_FUNCTION_OR_BUNDLE_VARIANT',
        note: 'Requires Shopify Functions Automatic Discount (Buy 2 Batana Oil, Get 2 Free at $79.98) or dedicated bundle SKU.'
      }
    },
    buy1: {
      key: 'buy1',
      name: 'Buy 1',
      tagline: '30-Day Starter Supply',
      deliveredBottles: 1,
      paidBottles: 1,
      freeBottles: 0,
      price60: 39.99,
      unit60: 39.99,
      upgradeDelta: 10.00, // 1 bottle * $10
      price120: 49.99,
      unit120: 49.99,
      shippingText: 'Standard Tracked Shipping (+$4.95 calculated at checkout)',
      shippingCost: 4.95,
      badgeText: 'Shipping +$4.95',
      shopifyMapping: {
        status: 'MATCHES_EXISTING_VARIANT',
        variantId: '67980643598521',
        note: 'Maps to live 60ml starter variant ID 67980643598521 ($39.00 / $39.99).'
      }
    }
  };

  function initBogoBundle() {
    const root = document.getElementById('zvBotanaBogoComponent');
    if (!root) return;

    // State
    let currentBundleKey = 'buy4get4'; // Default selected
    let isSizeUpgraded = false;

    // Elements
    const cards = root.querySelectorAll('.zv-bundle-card');
    const upsellCard = document.getElementById('zvUpsellCard');
    const upsellCheck = document.getElementById('zvSizeUpgradeCheck');
    const upsellDeltaElem = document.getElementById('zvUpsellDelta');
    const summaryPackageElem = document.getElementById('zvSummaryPackage');
    const summaryTotalElem = document.getElementById('zvSummaryTotal');
    const summaryUnitElem = document.getElementById('zvSummaryUnitPill');
    const summaryShippingElem = document.getElementById('zvSummaryShipping');
    const ctaPrimaryBtn = document.getElementById('zvCtaClaimOffer');
    const ctaPrimaryPrice = document.getElementById('zvCtaPrice');
    const ctaSecondaryBtn = document.getElementById('zvCtaBuyNow');

    // Modal elements
    const payloadModal = document.getElementById('zvPayloadModal');
    const modalBackdrop = document.getElementById('zvModalBackdrop');
    const modalCloseBtn = document.getElementById('zvModalCloseBtn');
    const modalConfirmBtn = document.getElementById('zvModalConfirmBtn');
    const modalActionTitle = document.getElementById('zvModalActionTitle');
    const payloadJsonElem = document.getElementById('zvPayloadJson');

    function getCurrentState() {
      const bundle = BUNDLE_DATA[currentBundleKey];
      const bottleVolume = isSizeUpgraded ? '120ml' : '60ml';
      const basePrice = bundle.price60;
      const upgradeFee = isSizeUpgraded ? bundle.upgradeDelta : 0;
      const finalPrice = isSizeUpgraded ? bundle.price120 : bundle.price60;
      const unitPrice = isSizeUpgraded ? bundle.unit120 : bundle.unit60;

      return {
        bundleKey: currentBundleKey,
        bundleName: bundle.name,
        deliveredBottles: bundle.deliveredBottles,
        bottleVolume,
        isSizeUpgraded,
        basePrice,
        upgradeFee,
        finalPrice,
        unitPrice,
        shippingText: bundle.shippingText,
        shippingCost: bundle.shippingCost,
        shopifyMapping: bundle.shopifyMapping
      };
    }

    function render() {
      const state = getCurrentState();

      // 1. Update Bundle Cards
      cards.forEach(card => {
        const key = card.getAttribute('data-bundle');
        const isSelected = (key === state.bundleKey);
        card.classList.toggle('selected', isSelected);
        card.setAttribute('aria-checked', isSelected ? 'true' : 'false');

        const cardData = BUNDLE_DATA[key];
        if (!cardData) return;

        // Update bottles count description
        const bottlesElem = card.querySelector('.zv-card-bottles');
        if (bottlesElem) {
          bottlesElem.textContent = `${cardData.deliveredBottles} × ${state.bottleVolume} Bottles`;
        }

        // Update card pricing
        const priceElem = card.querySelector('.zv-card-total-price');
        if (priceElem) {
          const p = state.isSizeUpgraded ? cardData.price120 : cardData.price60;
          priceElem.textContent = `$${p.toFixed(2)}`;
        }

        // Update card unit price pill
        const unitElem = card.querySelector('.zv-card-unit-price');
        if (unitElem) {
          const u = state.isSizeUpgraded ? cardData.unit120 : cardData.unit60;
          unitElem.textContent = `$${u.toFixed(2)} / bottle`;
        }
      });

      // 2. Update Size Upgrade Card
      if (upsellCard && upsellCheck) {
        upsellCard.classList.toggle('active', state.isSizeUpgraded);
        upsellCheck.checked = state.isSizeUpgraded;
      }
      if (upsellDeltaElem) {
        const bundle = BUNDLE_DATA[state.bundleKey];
        upsellDeltaElem.textContent = `+ $${bundle.upgradeDelta.toFixed(2)}`;
      }

      // 3. Update Dynamic Order Summary Box
      if (summaryPackageElem) {
        summaryPackageElem.textContent = `${state.deliveredBottles} × ${state.bottleVolume} Bottles`;
      }
      if (summaryTotalElem) {
        summaryTotalElem.textContent = `$${state.finalPrice.toFixed(2)}`;
      }
      if (summaryUnitElem) {
        summaryUnitElem.textContent = `$${state.unitPrice.toFixed(2)} / bottle`;
      }
      if (summaryShippingElem) {
        summaryShippingElem.innerHTML = `
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
          <span>${state.shippingText}</span>
        `;
        summaryShippingElem.style.color = (state.shippingCost === 0) ? '#15803D' : '#C2410C';
      }

      // 4. Update CTAs
      if (ctaPrimaryPrice) {
        ctaPrimaryPrice.textContent = `$${state.finalPrice.toFixed(2)}`;
      }

      // Expose state globally for headless testing & CDP inspection
      window.__BOTANA_BOGO_STATE__ = state;
    }

    // Modal Inspection Function
    function openPayloadModal(actionType) {
      const state = getCurrentState();
      if (!payloadModal || !payloadJsonElem) return;

      const payload = {
        action: actionType, // 'CLAIM_OFFER_CART_ADD' or 'BUY_NOW_DIRECT_CHECKOUT'
        timestamp: new Date().toISOString(),
        productHandle: 'zavelyn-botanaroots-organic-batana-hair-growth-oil',
        landingPage: '/pages/botanaroots-bogo-offer',
        selection: {
          bundle: state.bundleName,
          bottlesDelivered: state.deliveredBottles,
          bottleVolume: state.bottleVolume,
          is120mlUpgradeActive: state.isSizeUpgraded
        },
        pricingBreakdown: {
          baseBundlePrice: `$${state.basePrice.toFixed(2)}`,
          upgradeFee: `$${state.upgradeFee.toFixed(2)}`,
          finalTotalPrice: `$${state.finalPrice.toFixed(2)}`,
          effectiveUnitPrice: `$${state.unitPrice.toFixed(2)} / bottle`,
          shippingStatus: state.shippingText
        },
        simulatedShopifyCartPayload: {
          items: [
            {
              id: state.shopifyMapping.variantId || 'PENDING_BOGO_VARIANT_ID',
              quantity: state.deliveredBottles,
              properties: {
                _bundle_tier: state.bundleName,
                _bottle_volume: state.bottleVolume,
                _pricing_model: 'BOGO_SPECIAL_OFFER',
                _is_upgrade: String(state.isSizeUpgraded)
              }
            }
          ],
          requiresShopifyDiscountFunction: (state.bundleKey !== 'buy1' || state.isSizeUpgraded)
        },
        productionStatus: state.shopifyMapping.status,
        recommendation: state.shopifyMapping.note
      };

      if (modalActionTitle) {
        modalActionTitle.textContent = (actionType === 'CLAIM_OFFER_CART_ADD')
          ? '🛒 Simulated Action: Claim Offer (Cart Addition)'
          : '⚡ Simulated Action: Buy Now (Direct Checkout)';
      }

      payloadJsonElem.textContent = JSON.stringify(payload, null, 2);
      payloadModal.style.display = 'flex';
    }

    function closeModal() {
      if (payloadModal) payloadModal.style.display = 'none';
    }

    // Event Listeners: Card clicks
    cards.forEach(card => {
      card.addEventListener('click', function() {
        const key = this.getAttribute('data-bundle');
        if (key && BUNDLE_DATA[key]) {
          currentBundleKey = key;
          render();
        }
      });

      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Event Listeners: Upsell Toggle
    if (upsellCard) {
      upsellCard.addEventListener('click', function(e) {
        if (e.target !== upsellCheck) {
          e.preventDefault();
          isSizeUpgraded = !isSizeUpgraded;
          render();
        }
      });
    }

    if (upsellCheck) {
      upsellCheck.addEventListener('change', function() {
        isSizeUpgraded = this.checked;
        render();
      });
    }

    // Event Listeners: CTA Buttons
    if (ctaPrimaryBtn) {
      ctaPrimaryBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openPayloadModal('CLAIM_OFFER_CART_ADD');
      });
    }

    if (ctaSecondaryBtn) {
      ctaSecondaryBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openPayloadModal('BUY_NOW_DIRECT_CHECKOUT');
      });
    }

    // Modal Close Listeners
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', closeModal);

    // Initial Render
    render();
  }

  // Auto-init on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBogoBundle);
  } else {
    initBogoBundle();
  }
})();
