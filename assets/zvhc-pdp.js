/**
 * ZAVELYN HAIR CARE — PDP Interactive Engine (v2.0)
 * Scoped under window.ZvhcPdp
 * Handles dynamic shade selection, 1/2/3 bundle card pricing, variant mapping, and cart actions
 */

(function() {
  'use strict';

  var currentTier = 2; // Default to Tier 2 (Duo - Most Popular)
  var currentShade = '';
  var productData = null;

  window.zvhcInitPdp = function() {
    productData = window.ZVHC_PRODUCT_DATA;
    if (!productData) return;

    // Detect if product has shades
    var hasShades = false;
    if (productData.options) {
      for (var i = 0; i < productData.options.length; i++) {
        var opt = productData.options[i];
        if (typeof opt === 'string' && opt.toLowerCase() === 'shade') hasShades = true;
        if (opt.name && opt.name.toLowerCase() === 'shade') hasShades = true;
      }
    }

    if (hasShades) {
      var firstShadeBtn = document.querySelector('.zvhc-shade-btn');
      if (firstShadeBtn) {
        currentShade = firstShadeBtn.getAttribute('data-shade') || 'Black';
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
      t.style.borderColor = 'rgba(1,93,71,0.12)';
    });
    el.style.borderColor = 'var(--zvhc-orange)';
  };

  window.zvhcSelectShade = function(shade, btn) {
    currentShade = shade;
    document.querySelectorAll('.zvhc-shade-btn').forEach(function(b) {
      b.style.borderColor = 'rgba(0,0,0,0.1)';
      b.classList.remove('is-active');
    });
    btn.style.borderColor = 'var(--zvhc-orange)';
    btn.classList.add('is-active');

    var label = document.getElementById('zvhcSelectedShadeName');
    if (label) label.textContent = shade;

    window.zvhcUpdateTierDisplay();
  };

  window.zvhcSelectTier = function(tier) {
    currentTier = tier;
    document.querySelectorAll('.zvhc-bundle-card').forEach(function(card) {
      var cardTier = parseInt(card.getAttribute('data-tier'), 10);
      var dot = card.querySelector('.zvhc-radio-dot');
      var circle = card.querySelector('.zvhc-radio-circle');
      if (cardTier === tier) {
        card.style.borderColor = 'var(--zvhc-orange)';
        card.style.borderWidth = '2.5px';
        if (dot) dot.style.display = 'block';
        if (circle) circle.style.borderColor = 'var(--zvhc-green)';
      } else {
        card.style.borderColor = 'rgba(1,93,71,0.12)';
        card.style.borderWidth = '2px';
        if (dot) dot.style.display = 'none';
        if (circle) circle.style.borderColor = '#CCC';
      }
    });

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
        var unitEl = document.getElementById('zvhcUnitTier' + t);
        var price = (parseFloat(v.price) / 100).toFixed(2);
        if (v.price > 1000) {
          price = (parseFloat(v.price) / 100).toFixed(2);
        } else {
          price = parseFloat(v.price).toFixed(2);
        }
        if (priceEl) priceEl.textContent = '$' + price;
        if (cmpEl && v.compare_at_price) {
          var cmp = parseFloat(v.compare_at_price).toFixed(2);
          if (v.compare_at_price > 1000) cmp = (parseFloat(v.compare_at_price) / 100).toFixed(2);
          cmpEl.textContent = '$' + cmp;
        }
        if (unitEl) {
          var container = (window.ZVHC_CONTAINER || 'unit').toLowerCase();
          var rawVal = parseFloat(price);
          var unitVal = (rawVal / t).toFixed(2);
          unitEl.textContent = (t === 1 ? '$' : '~$') + unitVal + '/' + container;
        }
      }
    }

    // Update active tier CTA and sticky dock
    var activeVariant = window.zvhcFindVariant(currentTier, currentShade);
    if (activeVariant) {
      var activePrice = parseFloat(activeVariant.price).toFixed(2);
      if (activeVariant.price > 1000) activePrice = (parseFloat(activeVariant.price) / 100).toFixed(2);
      var ctaPrice = document.getElementById('zvhcCtaPrice');
      if (ctaPrice) ctaPrice.textContent = '$' + activePrice;
      var stickyPrice = document.getElementById('zvhcStickyPrice');
      if (stickyPrice) stickyPrice.textContent = '$' + activePrice;
    }
  };

  window.zvhcExecuteAddToCart = function() {
    var v = window.zvhcFindVariant(currentTier, currentShade);
    if (!v || !v.id) {
      alert('Please choose a variant option.');
      return;
    }

    var btn = document.getElementById('zvhcAddToCartBtn');
    if (btn) {
      btn.textContent = 'ADDING TO CART...';
      btn.disabled = true;
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: v.id,
        quantity: 1
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(item) {
      if (btn) {
        btn.innerHTML = 'ADDED! <span id="zvhcCtaPrice">✓</span>';
        setTimeout(function() {
          btn.disabled = false;
          window.zvhcUpdateTierDisplay();
        }, 1500);
      }
      // Update header bag count
      fetch('/cart.js')
        .then(function(r) { return r.json(); })
        .then(function(cart) {
          var badge = document.getElementById('zvhcHeaderBagCount');
          if (badge) badge.textContent = cart.item_count;
        });

      // Open drawer if available
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
    document.addEventListener('DOMContentLoaded', window.zvhcInitPdp);
  } else {
    window.zvhcInitPdp();
  }
})();
