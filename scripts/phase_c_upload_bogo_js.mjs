import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const THEME_ID = '187736654009'; // Unpublished Development Theme

const bogoJsContent = `/**
 * ZAVELYN BOTANAROOTS — EXCLUSIVE BOGO LANDING PAGE CONTROLLER
 * Scoped strictly to: /pages/botanaroots-bogo-offer
 * Dedicated Product ID: 15469942145209 (Handle: zavelyn-botanaroots-bogo-special)
 * Dedicated Variants:
 *  - Buy 4 Get 4 FREE (60ml):  68035793158329 | $159.96 | SKU: ZAV-BTR-BOGO-8X60-PURE
 *  - Buy 4 Get 4 FREE (120ml): 68035795058873 | $239.96 | SKU: ZAV-BTR-BOGO-8X120-PURE
 *  - Buy 2 Get 2 FREE (60ml):  68035795091641 | $79.98  | SKU: ZAV-BTR-BOGO-4X60-PURE
 *  - Buy 2 Get 2 FREE (120ml): 68035795124409 | $119.98 | SKU: ZAV-BTR-BOGO-4X120-PURE
 *  - Buy 1 (60ml):             68035795157177 | $39.99  | SKU: ZAV-BTR-BOGO-1X60-PURE
 *  - Buy 1 (120ml):            68035795189945 | $49.99  | SKU: ZAV-BTR-BOGO-1X120-PURE
 */

(function() {
  'use strict';

  const BOGO_CONFIG = {
    buy4get4: {
      key: 'buy4get4',
      name: 'Buy 4 Get 4 FREE',
      deliveredBottles: 8,
      paidBottles: 4,
      freeBottles: 4,
      variants: {
        '60ml': { id: '68035793158329', price: 159.96, unit: 20.00, sku: 'ZAV-BTR-BOGO-8X60-PURE' },
        '120ml': { id: '68035795058873', price: 239.96, unit: 30.00, sku: 'ZAV-BTR-BOGO-8X120-PURE' }
      },
      shipping: { free: true, text: 'Free Standard Shipping (7–15 Business Days)', cost: 0 },
      upgradeDelta: 80.00 // 8 * $10
    },
    buy2get2: {
      key: 'buy2get2',
      name: 'Buy 2 Get 2 FREE',
      deliveredBottles: 4,
      paidBottles: 2,
      freeBottles: 2,
      variants: {
        '60ml': { id: '68035795091641', price: 79.98, unit: 20.00, sku: 'ZAV-BTR-BOGO-4X60-PURE' },
        '120ml': { id: '68035795124409', price: 119.98, unit: 30.00, sku: 'ZAV-BTR-BOGO-4X120-PURE' }
      },
      shipping: { free: true, text: 'Free Standard Shipping on Orders Over $49', cost: 0 },
      upgradeDelta: 40.00 // 4 * $10
    },
    buy1: {
      key: 'buy1',
      name: 'Buy 1',
      deliveredBottles: 1,
      paidBottles: 1,
      freeBottles: 0,
      variants: {
        '60ml': { id: '68035795157177', price: 39.99, unit: 39.99, sku: 'ZAV-BTR-BOGO-1X60-PURE' },
        '120ml': { id: '68035795189945', price: 49.99, unit: 49.99, sku: 'ZAV-BTR-BOGO-1X120-PURE' }
      },
      shipping: {
        '60ml': { free: false, text: 'Standard Shipping +$4.95 (Calculated at checkout)', cost: 4.95 },
        '120ml': { free: true, text: 'Free Standard Shipping Unlocked ($49.99 reaches $49 threshold)', cost: 0 }
      },
      upgradeDelta: 10.00 // 1 * $10
    }
  };

  function initController() {
    const root = document.getElementById('zvBotanaBogoComponent');
    if (!root) return;

    let selectedOffer = 'buy4get4'; // Default selected: Buy 4 Get 4 Free
    let isSizeUpgrade = false;
    let isSubmitting = false;

    // DOM Elements
    const cards = root.querySelectorAll('.zv-bundle-card');
    const upsellCard = document.getElementById('zvUpsellCard');
    const upsellCheck = document.getElementById('zvSizeUpgradeCheck');
    const upsellDeltaElem = document.getElementById('zvUpsellDelta');
    const summaryPackageElem = document.getElementById('zvSummaryPackage');
    const summaryTotalElem = document.getElementById('zvSummaryTotal');
    const summaryUnitElem = document.getElementById('zvSummaryUnitPill');
    const summaryShippingElem = document.getElementById('zvSummaryShipping');
    const ctaClaimOfferBtn = document.getElementById('zvCtaClaimOffer');
    const ctaPriceElem = document.getElementById('zvCtaPrice');
    const ctaBuyNowBtn = document.getElementById('zvCtaBuyNow');

    function getResolvedData() {
      const offer = BOGO_CONFIG[selectedOffer];
      const sizeKey = isSizeUpgrade ? '120ml' : '60ml';
      const variant = offer.variants[sizeKey];
      let shippingInfo = offer.shipping;
      if (selectedOffer === 'buy1') {
        shippingInfo = offer.shipping[sizeKey];
      }

      return {
        offerKey: selectedOffer,
        offerName: offer.name,
        sizeKey: sizeKey,
        bottleVolume: isSizeUpgrade ? '120ml' : '60ml',
        variantId: variant.id,
        sku: variant.sku,
        totalPrice: variant.price,
        unitPrice: variant.unit,
        deliveredBottles: offer.deliveredBottles,
        paidBottles: offer.paidBottles,
        freeBottles: offer.freeBottles,
        shipping: shippingInfo,
        upgradeDelta: offer.upgradeDelta
      };
    }

    function renderUI() {
      const data = getResolvedData();

      // Sync Upgrade Card Active State & Checkbox
      if (upsellCard) {
        upsellCard.classList.toggle('active', isSizeUpgrade);
      }
      if (upsellCheck) {
        upsellCheck.checked = isSizeUpgrade;
      }

      // 1. Update Cards Active State & displayed prices
      cards.forEach(card => {
        const key = card.getAttribute('data-bundle');
        const isCurrent = (key === selectedOffer);
        card.classList.toggle('selected', isCurrent);
        card.setAttribute('aria-checked', isCurrent ? 'true' : 'false');

        // Update bottle label text (e.g. 8 x 60ml vs 8 x 120ml)
        const bottlesElem = card.querySelector('.zv-card-bottles');
        if (bottlesElem) {
          const count = (key === 'buy4get4') ? '8' : (key === 'buy2get2') ? '4' : '1';
          bottlesElem.innerHTML = count + ' &times; ' + data.bottleVolume + ' Bottle' + (count === '1' ? '' : 's');
        }

        // Update card price
        const priceElem = card.querySelector('.zv-card-total-price');
        const unitElem = card.querySelector('.zv-card-unit-price');
        if (priceElem && unitElem) {
          const cardOffer = BOGO_CONFIG[key];
          const cardVariant = cardOffer.variants[data.sizeKey];
          priceElem.textContent = '$' + cardVariant.price.toFixed(2);
          unitElem.textContent = '$' + cardVariant.unit.toFixed(2) + ' / bottle';
        }

        // Update Buy 1 badge dynamically based on size
        if (key === 'buy1') {
          const badgeElem = card.querySelector('.zv-badge-shipping-fee');
          if (badgeElem) {
            if (isSizeUpgrade) {
              badgeElem.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/></svg> FREE SHIPPING';
              badgeElem.style.background = '#ECFDF5';
              badgeElem.style.color = '#047857';
            } else {
              badgeElem.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/></svg> Shipping +$4.95';
              badgeElem.style.background = '#F3F4F6';
              badgeElem.style.color = '#4B5563';
            }
          }
        }
      });

      // 2. Update Upgrade Card Delta
      if (upsellDeltaElem) {
        upsellDeltaElem.textContent = '+ $' + data.upgradeDelta.toFixed(2);
      }

      // 3. Update Summary Box
      if (summaryPackageElem) {
        summaryPackageElem.innerHTML = data.deliveredBottles + ' &times; ' + data.bottleVolume + ' <span class="zv-sub-note">(' + data.paidBottles + ' Paid + ' + data.freeBottles + ' Free)</span>';
      }
      if (summaryTotalElem) {
        summaryTotalElem.textContent = '$' + data.totalPrice.toFixed(2);
      }
      if (summaryUnitElem) {
        summaryUnitElem.textContent = '$' + data.unitPrice.toFixed(2) + ' / bottle';
      }
      if (summaryShippingElem) {
        summaryShippingElem.innerHTML = '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg> <span>' + data.shipping.text + '</span>';
      }

      // 4. Update CTA Buttons
      if (ctaPriceElem) {
        ctaPriceElem.textContent = '$' + data.totalPrice.toFixed(2);
      }
    }

    // Bind Cards Click
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const key = card.getAttribute('data-bundle');
        if (key && BOGO_CONFIG[key]) {
          selectedOffer = key;
          renderUI();
        }
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const key = card.getAttribute('data-bundle');
          if (key && BOGO_CONFIG[key]) {
            selectedOffer = key;
            renderUI();
          }
        }
      });
    });

    // Bind Size Upgrade Checkbox & Label Interaction
    if (upsellCard && upsellCheck) {
      upsellCheck.addEventListener('change', (e) => {
        isSizeUpgrade = e.target.checked;
        renderUI();
      });

      upsellCard.addEventListener('click', (e) => {
        // If clicking anywhere on the card other than the direct input, toggle state cleanly
        if (e.target !== upsellCheck) {
          e.preventDefault();
          isSizeUpgrade = !isSizeUpgrade;
          renderUI();
        }
      });
    }

    // Build Payload for Cart
    function buildOrderPayload() {
      const data = getResolvedData();
      return {
        id: parseInt(data.variantId, 10),
        quantity: 1,
        properties: {
          'Offer': data.offerName,
          'Formula': '100% Pure Raw Honduran Batana',
          'Bottle Size': data.bottleVolume,
          'Bottles to Ship': String(data.deliveredBottles),
          'Paid Bottles': String(data.paidBottles),
          'Free Bottles': String(data.freeBottles),
          'Offer Source': 'BotanaRoots BOGO Test'
        }
      };
    }

    // Set Manual Fulfillment Order Note safely
    async function updateOrderNote(data) {
      try {
        const noteText = 'MANUAL FULFILLMENT — BOTANAROOTS BOGO. Deliver ' + data.deliveredBottles + ' bottles of ' + data.bottleVolume + ' Pure Raw Batana Oil. Paid ' + data.paidBottles + ', Free ' + data.freeBottles + '. Verify quantity and size before marking fulfilled.';
        await fetch('/cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ note: noteText })
        });
      } catch (err) {
        console.warn('Note update skipped:', err);
      }
    }

    // Add to Cart Handler (Claim Offer)
    async function handleClaimOffer(e) {
      if (e) e.preventDefault();
      if (isSubmitting) return;
      isSubmitting = true;

      const data = getResolvedData();
      const payload = buildOrderPayload();

      const btn = ctaClaimOfferBtn;
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="zv-spinner"></span> ADDING TO CART...';
      btn.style.opacity = '0.85';

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ items: [payload] })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.description || 'Could not add to cart.');
        }

        // Update human readable order note
        await updateOrderNote(data);

        // Open cart drawer or redirect to /cart
        btn.innerHTML = '✔ ADDED TO CART!';
        btn.style.background = '#15803D';
        btn.style.color = '#FFFFFF';

        // Dispatch theme cart refresh events
        document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
        document.dispatchEvent(new CustomEvent('cart:open', { bubbles: true }));

        setTimeout(() => {
          const drawer = document.querySelector('cart-drawer, #cart-drawer, .cart-drawer, [data-cart-drawer]');
          if (drawer && typeof drawer.open === 'function') {
            drawer.open();
          } else if (drawer && drawer.classList) {
            drawer.classList.add('active', 'is-open');
          } else {
            window.location.href = '/cart';
          }
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
          btn.style.opacity = '1';
          isSubmitting = false;
        }, 600);

      } catch (err) {
        console.error('Add to Cart Error:', err);
        alert('Notice: ' + err.message);
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        isSubmitting = false;
      }
    }

    // Buy Now Handler (Direct Checkout)
    async function handleBuyNow(e) {
      if (e) e.preventDefault();
      if (isSubmitting) return;
      isSubmitting = true;

      const data = getResolvedData();
      const payload = buildOrderPayload();

      const btn = ctaBuyNowBtn;
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="zv-spinner"></span> SECURING CHECKOUT...';
      btn.style.opacity = '0.85';

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ items: [payload] })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.description || 'Could not initiate checkout.');
        }

        // Update note
        await updateOrderNote(data);

        // Direct redirect to checkout
        window.location.href = '/checkout';

      } catch (err) {
        console.error('Buy Now Error:', err);
        alert('Notice: ' + err.message);
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        isSubmitting = false;
      }
    }

    // Bind CTA Events
    if (ctaClaimOfferBtn) {
      ctaClaimOfferBtn.addEventListener('click', handleClaimOffer);
    }
    if (ctaBuyNowBtn) {
      ctaBuyNowBtn.addEventListener('click', handleBuyNow);
    }

    // Initial render
    renderUI();
  }

  // Gallery Thumbnail Switcher
  function initGallery() {
    const mainImg = document.getElementById('zvBogoMainImg');
    const thumbs = document.querySelectorAll('.thumb-btn');
    if (!mainImg || !thumbs.length) return;

    thumbs.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetSrc = btn.getAttribute('data-full-img');
        if (targetSrc) {
          mainImg.src = targetSrc;
          thumbs.forEach(t => t.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });
  }

  // FAQ Accordion
  function initFaq() {
    const faqItems = document.querySelectorAll('.zv-faq-item');
    faqItems.forEach(item => {
      const header = item.querySelector('.zv-faq-q');
      if (header) {
        header.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');
          faqItems.forEach(i => i.classList.remove('active'));
          if (!isOpen) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initController();
      initGallery();
      initFaq();
    });
  } else {
    initController();
    initGallery();
    initFaq();
  }
})();
`;

async function uploadBogoJs() {
  const token = await getAccessToken();
  console.log(`Uploading updated assets/botanaroots-bogo.js to Theme ${THEME_ID}...`);

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key: 'assets/botanaroots-bogo.js',
        value: bogoJsContent
      }
    })
  });
  const data = await res.json();
  if (data.asset?.key) {
    console.log(`✔ Successfully updated assets/botanaroots-bogo.js on Theme ${THEME_ID}`);
  } else {
    console.error('Upload Error:', JSON.stringify(data));
  }
}

uploadBogoJs().catch(console.error);
