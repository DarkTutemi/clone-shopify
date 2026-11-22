/**
 * ZAVELYN HAIR CARE — T01 Interactive Engine (v3.0)
 * Scoped controller matching ShopSideK T01 behavior
 */

(function() {
  'use strict';

  var currentTier = 2; // Default to Tier 2 (Most Popular / Duo)
  var currentShade = '';
  var productData = null;
  var upsellIncluded = false;
  var upsellVariantId = null;

  window.zvhcInitT01 = function() {
    productData = window.ZVHC_PRODUCT_DATA;
    if (!productData) return;

    // Detect if product has shades
    var hasShades = false;
    if (productData.options) {
      for (var i = 0; i < productData.options.length; i++) {
        var opt = productData.options[i];
        if (typeof opt === 'string' && opt.toLowerCase() === 'shade') hasShades = true;
        if (opt && opt.name && opt.name.toLowerCase() === 'shade') hasShades = true;
      }
    }

    if (hasShades) {
      var firstSwatch = document.querySelector('.zvhc-swatch-btn');
      if (firstSwatch) {
        currentShade = firstSwatch.getAttribute('data-shade') || 'Black';
      } else {
        currentShade = 'Black';
      }
    }

    window.zvhcUpdateTierDisplay();
    window.zvhcInitStickyObserver();
  };

  window.zvhcSelectThumb = function(el, url) {
    var mainImg = document.getElementById('zvhcMainImg');
    if (mainImg) mainImg.src = url;
    document.querySelectorAll('.zvhc-thumb-item').forEach(function(t) {
      t.classList.remove('is-active');
    });
    el.classList.add('is-active');
  };

  window.zvhcSelectShade = function(shade, btn) {
    currentShade = shade;
    document.querySelectorAll('.zvhc-swatch-btn').forEach(function(b) {
      b.classList.remove('is-active');
    });
    btn.classList.add('is-active');

    var label = document.getElementById('zvhcSelectedShadeName');
    if (label) label.textContent = shade;

    window.zvhcUpdateTierDisplay();
  };

  window.zvhcSelectTier = function(tier) {
    currentTier = tier;
    document.querySelectorAll('.zvhc-bundle-card').forEach(function(card) {
      var cardTier = parseInt(card.getAttribute('data-tier'), 10);
      if (cardTier === tier) {
        card.classList.add('is-selected');
      } else {
        card.classList.remove('is-selected');
      }
    });

    window.zvhcUpdateTierDisplay();
  };

  window.zvhcToggleUpsell = function(checkbox) {
    upsellIncluded = checkbox.checked;
    upsellVariantId = checkbox.getAttribute('data-variant-id');
    window.zvhcUpdateTierDisplay();
  };

  window.zvhcFindVariant = function(tier, shade) {
    if (!productData || !productData.variants) return null;
    var variants = productData.variants;

    if (variants.length === 9) {
      // 3 shades x 3 bundles
      return variants.find(function(v) {
        var matchShade = shade ? (v.option1 === shade || v.option1.indexOf(shade) !== -1 || (shade.indexOf('Black') !== -1 && v.option1.indexOf('Black') !== -1)) : true;
        var matchTier = v.option2 ? (v.option2.indexOf(tier + 'x') !== -1 || v.option2.indexOf(tier + ' ') !== -1) : false;
        return matchShade && matchTier;
      }) || variants[tier - 1] || variants[0];
    } else {
      // 3 bundles (single option)
      return variants[tier - 1] || variants[0];
    }
  };

  window.zvhcUpdateTierDisplay = function() {
    if (!productData) return;

    // Update prices on the 3 tier cards
    for (var t = 1; t <= 3; t++) {
      var v = window.zvhcFindVariant(t, currentShade);
      if (v) {
        var priceEl = document.getElementById('zvhcPriceTier' + t);
        var cmpEl = document.getElementById('zvhcCompareTier' + t);
        var rawPrice = parseFloat(v.price);
        if (rawPrice > 1000) rawPrice = rawPrice / 100;
        var formatted = rawPrice.toFixed(2);

        if (priceEl) priceEl.textContent = '$' + formatted;
        if (cmpEl && v.compare_at_price) {
          var rawCmp = parseFloat(v.compare_at_price);
          if (rawCmp > 1000) rawCmp = rawCmp / 100;
          cmpEl.textContent = '$' + rawCmp.toFixed(2);
        }
      }
    }

    // Active tier price calculation
    var activeVariant = window.zvhcFindVariant(currentTier, currentShade);
    if (activeVariant) {
      var activeRaw = parseFloat(activeVariant.price);
      if (activeRaw > 1000) activeRaw = activeRaw / 100;

      var total = activeRaw;
      if (upsellIncluded && upsellVariantId) {
        var upsellPriceEl = document.getElementById('zvhcUpsellPriceVal');
        var upsellVal = upsellPriceEl ? parseFloat(upsellPriceEl.getAttribute('data-price')) : 0;
        total += upsellVal;
      }

      var formattedTotal = total.toFixed(2);
      var ctaPrice = document.getElementById('zvhcCtaPrice');
      if (ctaPrice) ctaPrice.textContent = '$' + formattedTotal;
      var stickyPrice = document.getElementById('zvhcStickyPrice');
      if (stickyPrice) stickyPrice.textContent = '$' + formattedTotal;
    }
  };

  window.zvhcExecuteAddToCart = function() {
    var v = window.zvhcFindVariant(currentTier, currentShade);
    if (!v || !v.id) {
      alert('Please select an option.');
      return;
    }

    var btn = document.getElementById('zvhcAddToCartBtn');
    if (btn) {
      btn.textContent = 'ADDING TO CART...';
      btn.disabled = true;
    }

    var itemsToAdd = [{ id: v.id, quantity: 1 }];
    if (upsellIncluded && upsellVariantId) {
      itemsToAdd.push({ id: parseInt(upsellVariantId, 10), quantity: 1 });
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: itemsToAdd })
    })
    .then(function(res) { return res.json(); })
    .then(function(resData) {
      if (btn) {
        btn.textContent = 'ADDED TO CART ✓';
        setTimeout(function() {
          btn.disabled = false;
          window.zvhcUpdateTierDisplay();
        }, 1500);
      }

      // Update header bag count
      fetch('/cart.js')
        .then(function(r) { return r.json(); })
        .then(function(cart) {
          var badges = document.querySelectorAll('.zvhc-t01-bag-count, #zvhcHeaderBagCount');
          badges.forEach(function(b) { b.textContent = cart.item_count; });
        });

      // Open drawer
      if (window.openZvhcCart) {
        window.openZvhcCart();
      } else if (window.openWillaCart) {
        window.openWillaCart();
      } else {
        window.location.href = '/cart';
      }
    })
    .catch(function(err) {
      console.error(err);
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'TRY AGAIN';
      }
    });
  };

  window.zvhcInitStickyObserver = function() {
    var cta = document.getElementById('zvhcAddToCartBtn');
    var dock = document.getElementById('zvhcStickyDock');
    if (!cta || !dock) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            dock.style.display = 'block';
          } else {
            dock.style.display = 'none';
          }
        });
      }, { threshold: 0.1 });
      observer.observe(cta);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.zvhcInitT01);
  } else {
    window.zvhcInitT01();
  }
})();
