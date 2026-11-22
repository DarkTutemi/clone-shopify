/**
 * ZAVELYN HAIR CARE — T01 Interactive Engine (v3.1)
 * Safe Shopify SelectedOptions Matching, Multi-Product Bundles & Error-Checked Ajax Cart
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
        var name = (typeof opt === 'string' ? opt : (opt.name || '')).toLowerCase();
        if (name === 'shade' || name === 'color') {
          hasShades = true;
          break;
        }
      }
    }

    if (hasShades) {
      var firstSwatch = document.querySelector('.zvhc-swatch-btn.is-active') || document.querySelector('.zvhc-swatch-btn');
      if (firstSwatch) {
        currentShade = firstSwatch.getAttribute('data-shade') || 'Black';
      } else {
        currentShade = 'Black';
      }
      var label = document.getElementById('zvhcSelectedShadeName');
      if (label) label.textContent = currentShade;
    }

    // Initialize initial tier selection from markup or default
    var initialSelected = document.querySelector('.zvhc-bundle-card.is-selected');
    if (initialSelected) {
      currentTier = parseInt(initialSelected.getAttribute('data-tier'), 10) || 2;
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

  /**
   * P0-A FIX: Safe Shopify selectedOptions matching.
   * NEVER fallback to variants[0] or variants[tier-1].
   * If not found, returns null.
   */
  window.zvhcFindVariant = function(tier, shade) {
    if (!productData || !productData.variants || productData.variants.length === 0) {
      return null;
    }

    var options = productData.options || [];
    var shadeOptPos = -1;
    var tierOptPos = -1;

    // Detect option positions
    options.forEach(function(opt, idx) {
      var name = (typeof opt === 'string' ? opt : (opt.name || '')).toLowerCase();
      if (name === 'shade' || name === 'color') {
        shadeOptPos = idx + 1; // 1-based index (option1, option2...)
      } else if (name === 'treatment course' || name === 'title' || name === 'quantity' || name === 'pack') {
        tierOptPos = idx + 1;
      }
    });

    // If tierOptPos not identified by name, assign based on presence of shade
    if (tierOptPos === -1) {
      tierOptPos = (shadeOptPos === 1) ? 2 : 1;
    }

    var tierKey = 'option' + tierOptPos;
    var shadeKey = (shadeOptPos !== -1) ? ('option' + shadeOptPos) : null;

    var matched = productData.variants.find(function(v) {
      // 1. Match Tier
      var vTierVal = v[tierKey];
      if (!vTierVal) return false;

      var tierMatches = false;
      var tierPrefix1 = tier + 'x'; // "1x 100g", "2x 100g", "3x 100g"
      var tierPrefix2 = 'buy ' + tier; // "Buy 1", "Buy 2", "Buy 3"
      var tierPrefix3 = tier + ' ';
      var lowerTierVal = vTierVal.toLowerCase();

      if (lowerTierVal.indexOf(tierPrefix1.toLowerCase()) !== -1 ||
          lowerTierVal.indexOf(tierPrefix2.toLowerCase()) !== -1 ||
          lowerTierVal.indexOf(tierPrefix3.toLowerCase()) !== -1 ||
          lowerTierVal.indexOf('(' + tier + 'x') !== -1) {
        tierMatches = true;
      }

      if (!tierMatches) return false;

      // 2. Match Shade (if product has shade option)
      if (shadeKey && shade) {
        var vShadeVal = v[shadeKey];
        if (!vShadeVal) return false;
        var cleanShadeVal = vShadeVal.replace(/^#\d+\s*/, '').trim().toLowerCase();
        var cleanTargetShade = shade.replace(/^#\d+\s*/, '').trim().toLowerCase();
        if (cleanShadeVal !== cleanTargetShade) {
          return false;
        }
      }

      return true;
    });

    return matched || null; // Strictly returns matched or null. NO FALLBACK SKU.
  };

  window.zvhcUpdateTierDisplay = function() {
    if (!productData) return;

    var errorEl = document.getElementById('zvhcVariantError');
    var ctaBtn = document.getElementById('zvhcAddToCartBtn');

    // Update prices on the 3 tier cards
    for (var t = 1; t <= 3; t++) {
      var v = window.zvhcFindVariant(t, currentShade);
      var priceEl = document.getElementById('zvhcPriceTier' + t);
      var cmpEl = document.getElementById('zvhcCompareTier' + t);

      if (v) {
        var rawPrice = parseFloat(v.price);
        if (rawPrice > 1000) rawPrice = rawPrice / 100;
        var formatted = rawPrice.toFixed(2);

        if (priceEl) priceEl.textContent = '$' + formatted;
        if (cmpEl && v.compare_at_price) {
          var rawCmp = parseFloat(v.compare_at_price);
          if (rawCmp > 1000) rawCmp = rawCmp / 100;
          cmpEl.textContent = '$' + rawCmp.toFixed(2);
        }
      } else {
        if (priceEl) priceEl.textContent = 'Unavailable';
        if (cmpEl) cmpEl.textContent = '';
      }
    }

    // Active tier price calculation & validation
    var activeVariant = window.zvhcFindVariant(currentTier, currentShade);
    if (activeVariant && activeVariant.available !== false) {
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
      if (ctaBtn) {
        ctaBtn.disabled = false;
      }

      var activeRaw = parseFloat(activeVariant.price);
      if (activeRaw > 1000) activeRaw = activeRaw / 100;

      var total = activeRaw;
      if (upsellIncluded && upsellVariantId) {
        var upsellCheckbox = document.querySelector('.zvhc-upsell-checkbox');
        var upsellVal = upsellCheckbox ? parseFloat(upsellCheckbox.getAttribute('data-price') || 0) : 0;
        total += upsellVal;
      }

      var formattedTotal = total.toFixed(2);
      var ctaPrice = document.getElementById('zvhcCtaPrice');
      if (ctaPrice) ctaPrice.textContent = '$' + formattedTotal;
      var stickyPrice = document.getElementById('zvhcStickyPrice');
      if (stickyPrice) stickyPrice.textContent = '$' + formattedTotal;
    } else {
      // Combination unavailable - disable CTA & show accessible error
      if (ctaBtn) {
        ctaBtn.disabled = true;
      }
      var ctaPriceEl = document.getElementById('zvhcCtaPrice');
      if (ctaPriceEl) ctaPriceEl.textContent = 'UNAVAILABLE';
      var stickyPriceEl = document.getElementById('zvhcStickyPrice');
      if (stickyPriceEl) stickyPriceEl.textContent = 'UNAVAILABLE';

      if (errorEl) {
        errorEl.textContent = 'The selected combination is currently unavailable. Please choose another option.';
        errorEl.style.display = 'block';
      }
    }
  };

  /**
   * P0-F FIX: Checked AJAX Cart execution with response.ok validation
   */
  window.zvhcExecuteAddToCart = function() {
    var v = window.zvhcFindVariant(currentTier, currentShade);
    var errorEl = document.getElementById('zvhcVariantError');
    var btn = document.getElementById('zvhcAddToCartBtn');

    if (!v || !v.id || v.available === false) {
      if (errorEl) {
        errorEl.textContent = 'Please select an available option before adding to cart.';
        errorEl.style.display = 'block';
      }
      return;
    }

    if (btn) {
      btn.dataset.originalHtml = btn.innerHTML;
      btn.innerHTML = '<span style="font-size: 0.95rem; font-weight: 700;">ADDING TO CART...</span>';
      btn.disabled = true;
    }

    var itemsToAdd = [{ id: parseInt(v.id, 10), quantity: 1 }];
    if (upsellIncluded && upsellVariantId) {
      itemsToAdd.push({ id: parseInt(upsellVariantId, 10), quantity: 1 });
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: itemsToAdd })
    })
    .then(async function(res) {
      var data = await res.json();
      if (!res.ok) {
        var msg = data.description || data.message || 'Error adding item to cart. Please try again.';
        throw new Error(msg);
      }
      return data;
    })
    .then(function(resData) {
      if (btn) {
        btn.innerHTML = '<span style="font-size: 0.95rem; font-weight: 700; color: #FFF;">ADDED TO CART ✓</span>';
        setTimeout(function() {
          btn.disabled = false;
          window.zvhcUpdateTierDisplay();
          if (btn.dataset.originalHtml) {
            btn.innerHTML = btn.dataset.originalHtml;
          }
        }, 1500);
      }

      window.zvhcRefreshCartDrawer();
    })
    .catch(function(err) {
      console.error('Add to cart failed:', err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span style="font-size: 0.95rem; font-weight: 700;">TRY AGAIN</span>';
      }
      if (errorEl) {
        errorEl.textContent = err.message || 'Error adding to cart. Please try again.';
        errorEl.style.display = 'block';
      } else {
        alert(err.message || 'Error adding to cart. Please try again.');
      }
    });
  };

  /**
   * P0-D FIX: Functional multi-product routine bundle addition
   */
  window.zvhcAddBundleToCart = function(variantIds, btnEl, errorTargetId) {
    if (!variantIds || variantIds.length === 0) return;

    var originalText = btnEl ? btnEl.textContent : '';
    if (btnEl) {
      btnEl.disabled = true;
      btnEl.textContent = 'ADDING BUNDLE...';
    }

    var itemsToAdd = variantIds.map(function(id) {
      return { id: parseInt(id, 10), quantity: 1 };
    });

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: itemsToAdd })
    })
    .then(async function(res) {
      var data = await res.json();
      if (!res.ok) {
        var msg = data.description || data.message || 'Failed to add bundle to cart.';
        throw new Error(msg);
      }
      return data;
    })
    .then(function(resData) {
      if (btnEl) {
        btnEl.textContent = 'BUNDLE ADDED ✓';
        setTimeout(function() {
          btnEl.disabled = false;
          btnEl.textContent = originalText;
        }, 1800);
      }
      window.zvhcRefreshCartDrawer();
    })
    .catch(function(err) {
      console.error('Bundle add failed:', err);
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.textContent = 'TRY AGAIN';
      }
      var errEl = errorTargetId ? document.getElementById(errorTargetId) : null;
      if (errEl) {
        errEl.textContent = err.message || 'Could not add bundle to cart.';
        errEl.style.display = 'block';
      } else {
        alert(err.message || 'Could not add bundle to cart.');
      }
    });
  };

  // Bundle 1: Scalp & Edge Care Duo
  window.zvhcAddDuoBundle = function(btn) {
    var shadeSelect = document.getElementById('zvhcBundleDuoShade');
    var compactVid = shadeSelect ? shadeSelect.value : '68580492705977'; // default #01 Black
    var batanaVid = '68580229218489'; // Batana Oil 60ml 1-Pack
    window.zvhcAddBundleToCart([batanaVid, compactVid], btn, 'zvhcBundleDuoError');
  };

  // Bundle 2: Instant Density 3-Piece Kit
  window.zvhcAddTrioBundle = function(btn) {
    var fiberShadeSelect = document.getElementById('zvhcBundleTrioFiberShade');
    var compactShadeSelect = document.getElementById('zvhcBundleTrioCompactShade');
    var fiberVid = fiberShadeSelect ? fiberShadeSelect.value : '68580492312761'; // default Black 1-Pack
    var powderVid = '68580229415097'; // Root Lift Powder 1-Pack
    var compactVid = compactShadeSelect ? compactShadeSelect.value : '68580492705977'; // default #01 Black 1-Pack
    window.zvhcAddBundleToCart([fiberVid, powderVid, compactVid], btn, 'zvhcBundleTrioError');
  };

  // Bundle 3: Wash-to-Style 4-Piece Routine
  window.zvhcAddRoutineBundle = function(btn) {
    var balmVid = '68580229677241'; // Raw Balm 20g 1-Pack
    var oilVid = '68580229218489';  // Batana Oil 60ml 1-Pack
    var curlVid = '68580229775545'; // Curl Cream 100ml 1-Pack
    var elixirVid = '68580229873849'; // 7-in-1 Elixir 60ml 1-Pack
    window.zvhcAddBundleToCart([balmVid, oilVid, curlVid, elixirVid], btn, 'zvhcBundleRoutineError');
  };

  window.zvhcRefreshCartDrawer = function() {
    var previewParam = '';
    if (window.location.search.indexOf('preview_theme_id=') !== -1) {
      var match = window.location.search.match(/preview_theme_id=(\d+)/);
      if (match) previewParam = '&preview_theme_id=' + match[1];
    }
    fetch('/?sections=zvhc-cart-drawer' + previewParam)
      .then(function(r) { return r.json(); })
      .then(function(sections) {
        var html = sections && sections['zvhc-cart-drawer'];
        if (html) {
          var container = document.getElementById('shopify-section-zvhc-cart-drawer');
          if (container) {
            container.outerHTML = html;
          }
        }
        return fetch('/cart.js');
      })
      .then(function(r) { return r.json(); })
      .then(function(cart) {
        var badges = document.querySelectorAll('.zvhc-t01-bag-count, #zvhcHeaderBagCount');
        badges.forEach(function(b) { b.textContent = cart.item_count; });

        if (window.openZvhcCart) {
          window.openZvhcCart();
        } else {
          var drawer = document.getElementById('zvhcCartDrawer') || document.querySelector('.zvhc-cart-drawer');
          if (drawer) {
            drawer.classList.add('is-open');
          }
        }
      })
      .catch(function(err) {
        console.error('Cart refresh error:', err);
        if (window.openZvhcCart) window.openZvhcCart();
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
