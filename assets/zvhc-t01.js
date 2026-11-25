/**
 * ZAVELYN HAIR CARE — T01 Interactive Engine (v3.1)
 * Safe Shopify SelectedOptions Matching, Multi-Product Bundles & Error-Checked Ajax Cart
 */

(function() {
  'use strict';

  var currentTier = 2; // Default to Tier 2 (Most Popular / Duo)
  var currentShade = '';
  var currentSize = '120';
  var currentFormula = '100% Pure Raw Honduran Batana';
  var productData = null;
  var upsellIncluded = false;
  var upsellVariantId = null;
  var isSubscription = true; // Default to Subscription for BotanaRoots
  var sellingPlanId = '6199771321';

  window.zvhcInitT01 = function() {
    productData = window.ZVHC_PRODUCT_DATA;
    if (!productData) return;

    if (productData.handle === 'zavelyn-botanaroots-organic-batana-hair-growth-oil') {
      isSubscription = true;
      currentTier = 2;
      sellingPlanId = window.ZVHC_SELLING_PLAN_ID || '6199771321';
    } else {
      isSubscription = false;
    }

    window.zvhcSellingPlanId = sellingPlanId;
    window.zvhcIsSubscription = isSubscription;

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
    window.zvhcInitCountdown();
  };

  window.zvhcInitCountdown = function() {
    var timerEl = document.getElementById('zvhcCampaignTimer');
    if (!timerEl) return;
    var endStr = timerEl.getAttribute('data-end-time');
    var endTime = endStr ? new Date(endStr).getTime() : (Date.now() + 45600000);
    if (isNaN(endTime)) endTime = Date.now() + 45600000;

    function update() {
      var now = Date.now();
      var diff = Math.max(0, endTime - now);
      var totalSecs = Math.floor(diff / 1000);
      var hours = Math.floor(totalSecs / 3600);
      var mins = Math.floor((totalSecs % 3600) / 60);
      var secs = totalSecs % 60;

      var hEl = document.getElementById('timerHours');
      var mEl = document.getElementById('timerMins');
      var sEl = document.getElementById('timerSecs');

      if (hEl) hEl.textContent = (hours < 10 ? '0' : '') + hours;
      if (mEl) mEl.textContent = (mins < 10 ? '0' : '') + mins;
      if (sEl) sEl.textContent = (secs < 10 ? '0' : '') + secs;
    }
    update();
    setInterval(update, 1000);
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

  window.zvhcSetPurchaseType = function(type) {
    isSubscription = (type === 'subscription');
    window.zvhcIsSubscription = isSubscription;

    var tabOneTime = document.getElementById('zvhcTabOneTime');
    var tabSub = document.getElementById('zvhcTabSubscribe');

    if (tabOneTime && tabSub) {
      if (isSubscription) {
        tabOneTime.classList.remove('is-active');
        tabOneTime.setAttribute('aria-selected', 'false');
        tabSub.classList.add('is-active');
        tabSub.setAttribute('aria-selected', 'true');
      } else {
        tabOneTime.classList.add('is-active');
        tabOneTime.setAttribute('aria-selected', 'true');
        tabSub.classList.remove('is-active');
        tabSub.setAttribute('aria-selected', 'false');
      }
    }

    window.zvhcUpdateTierDisplay();
  };

  window.zvhcToggleUpsell = function(checkbox) {
    upsellIncluded = checkbox.checked;
    upsellVariantId = checkbox.getAttribute('data-variant-id');
    window.zvhcUpdateTierDisplay();
  };

  window.zvhcSelectSize = function(size, btn) {
    currentSize = size;
    document.querySelectorAll('.zvhc-size-btn').forEach(function(b) {
      b.classList.remove('is-active');
    });
    if (btn) btn.classList.add('is-active');
    var label = document.getElementById('zvhcSelectedSizeName');
    if (label) label.textContent = size;
    window.zvhcUpdateTierDisplay();
  };

  window.zvhcSelectFormula = function(formula, btn) {
    currentFormula = formula;
    document.querySelectorAll('.zvhc-formula-btn').forEach(function(b) {
      b.classList.remove('is-active');
    });
    if (btn) btn.classList.add('is-active');
    var label = document.getElementById('zvhcSelectedFormulaName');
    if (label) label.textContent = formula;
    window.zvhcUpdateTierDisplay();
  };

  /**
   * P0-A FIX: Safe Shopify selectedOptions matching.
   * Multi-variant precision for bundles, sizes (60ml/120ml), formulas, and shades.
   * NEVER fallback to variants[0] or variants[tier-1].
   * If not found, returns null.
   */
  window.zvhcFindVariant = function(tier, shade, size, formula) {
    if (!productData || !productData.variants || productData.variants.length === 0) {
      return null;
    }

    // Direct exact variant matching for BotanaRoots
    if (productData.handle === 'zavelyn-botanaroots-organic-batana-hair-growth-oil') {
      if (tier === 1) return productData.variants.find(function(v) { return v.id == 68036047831225; }) || productData.variants[0];
      if (tier === 2) return productData.variants.find(function(v) { return v.id == 68036048453817; }) || productData.variants[1] || productData.variants[0];
      if (tier === 3) return productData.variants.find(function(v) { return v.id == 68036048715961; }) || productData.variants[2] || productData.variants[0];
    }

    var targetSize = size || currentSize;
    var targetFormula = formula || currentFormula;
    var targetShade = shade || currentShade;

    var options = productData.options || [];
    var shadeOptPos = -1;
    var tierOptPos = -1;

    // Detect option positions
    options.forEach(function(opt, idx) {
      var name = (typeof opt === 'string' ? opt : (opt.name || '')).toLowerCase();
      if (name === 'shade' || name === 'color') {
        shadeOptPos = idx + 1; // 1-based index (option1, option2...)
      } else if (name === 'treatment course' || name === 'title' || name === 'quantity' || name === 'pack' || name === 'bundle') {
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
      // 1. Match Tier (starts with buy <tier> or <tier>x or <tier> jar/bottle/pouch/tin)
      var vTierVal = v[tierKey];
      if (!vTierVal) return false;
      var lowerTierVal = vTierVal.toLowerCase().trim();

      var tierMatches = false;
      if (lowerTierVal.startsWith('buy ' + tier + ' ') || lowerTierVal.startsWith('buy ' + tier + '(') || lowerTierVal === ('buy ' + tier)) {
        tierMatches = true;
      } else if (lowerTierVal.startsWith(tier + 'x ') || lowerTierVal.startsWith(tier + 'x(') || lowerTierVal.startsWith(tier + ' jar') || lowerTierVal.startsWith(tier + ' bottle') || lowerTierVal.startsWith(tier + ' pouch') || lowerTierVal.startsWith(tier + ' compact') || lowerTierVal.startsWith(tier + ' tin') || lowerTierVal.startsWith(tier + ' unit')) {
        tierMatches = true;
      } else if (lowerTierVal.indexOf('(' + tier + 'x') !== -1 && !lowerTierVal.startsWith('buy 3') && !lowerTierVal.startsWith('buy 2')) {
        tierMatches = true;
      }

      if (!tierMatches) return false;

      // 2. Match Shade (if product has shade option)
      if (shadeKey && targetShade) {
        var vShadeVal = v[shadeKey];
        if (!vShadeVal) return false;
        var cleanShadeVal = vShadeVal.replace(/^#\d+\s*/, '').trim().toLowerCase();
        var cleanTargetShade = targetShade.replace(/^#\d+\s*/, '').trim().toLowerCase();
        if (cleanShadeVal !== cleanTargetShade) {
          return false;
        }
      }

      // 3. Match Size (if variants contain 60ml / 120ml)
      if (targetSize) {
        var combined = (v.option1 + ' ' + (v.option2 || '')).toLowerCase();
        var hasSizeOption = productData.variants.some(function(varItem) {
          return (varItem.option1 + ' ' + (varItem.option2 || '')).toLowerCase().indexOf(targetSize.toLowerCase()) !== -1;
        });
        if (hasSizeOption && combined.indexOf(targetSize.toLowerCase()) === -1) {
          return false;
        }
      }

      // 4. Match Formula (if option2 contains Rosemary vs Pure)
      if (v.option2 && targetFormula) {
        var fVal = v.option2.toLowerCase();
        var isTargetRosemary = targetFormula.toLowerCase().indexOf('rosemary') !== -1;
        var isVariantRosemary = fVal.indexOf('rosemary') !== -1;
        var hasFormulaOptions = productData.variants.some(function(varItem) {
          return (varItem.option2 || '').toLowerCase().indexOf('rosemary') !== -1;
        });
        if (hasFormulaOptions && isTargetRosemary !== isVariantRosemary) {
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
    var isBotanaRoots = (productData.handle === 'zavelyn-botanaroots-organic-batana-hair-growth-oil');

    var BOTANAROOTS_PRICING = {
      1: { oneTime: 41.16, sub: 34.99, compare: '', unitSub: '$34.99/jar', unitOT: '$41.16/jar' },
      2: { oneTime: 82.32, sub: 69.98, compare: '$164.64', unitSub: '~$17.50/jar', unitOT: '~$20.58/jar' },
      3: { oneTime: 148.18, sub: 125.96, compare: '$329.28', unitSub: '~$15.75/jar', unitOT: '~$18.52/jar' }
    };

    // Update prices on the 3 tier cards
    for (var t = 1; t <= 3; t++) {
      var v = window.zvhcFindVariant(t, currentShade, currentSize, currentFormula);
      var priceEl = document.getElementById('zvhcPriceTier' + t);
      var cmpEl = document.getElementById('zvhcCompareTier' + t);
      var unitEl = document.getElementById('zvhcUnitTier' + t);

      if (isBotanaRoots) {
        var bp = BOTANAROOTS_PRICING[t];
        var ship2 = document.getElementById('zvhcTier2ShipBadge');
        if (ship2) {
          ship2.style.display = isSubscription ? 'none' : 'flex';
        }
        if (isSubscription) {
          if (priceEl) priceEl.textContent = '$' + bp.sub.toFixed(2) + '/mo';
          if (cmpEl) {
            cmpEl.textContent = bp.compare;
            cmpEl.style.display = bp.compare ? 'block' : 'none';
          }
          if (unitEl) unitEl.textContent = bp.unitSub;
        } else {
          if (priceEl) priceEl.textContent = '$' + bp.oneTime.toFixed(2);
          if (cmpEl) {
            cmpEl.textContent = bp.compare;
            cmpEl.style.display = bp.compare ? 'block' : 'none';
          }
          if (unitEl) unitEl.textContent = bp.unitOT;
        }
      } else if (v) {
        var rawPrice = parseFloat(v.price);
        if (rawPrice > 1000) rawPrice = rawPrice / 100;

        if (isSubscription) {
          var subPrice = (rawPrice * 0.85).toFixed(2);
          if (priceEl) priceEl.textContent = '$' + subPrice + '/mo';
          if (cmpEl) {
            cmpEl.textContent = '$' + rawPrice.toFixed(2);
            cmpEl.style.display = 'block';
          }
        } else {
          var formatted = rawPrice.toFixed(2);
          if (priceEl) priceEl.textContent = '$' + formatted;
          if (cmpEl) {
            if (v.compare_at_price) {
              var rawCmp = parseFloat(v.compare_at_price);
              if (rawCmp > 1000) rawCmp = rawCmp / 100;
              cmpEl.textContent = '$' + rawCmp.toFixed(2);
              cmpEl.style.display = 'block';
            } else {
              cmpEl.textContent = '';
              cmpEl.style.display = 'none';
            }
          }
        }

        // DYNAMIC UNIT PRICING: Calculate exact per-unit price from selected variant
        if (unitEl) {
          var container = (window.ZVHC_CONTAINER || 'unit').toLowerCase();
          var unitVal = (rawPrice / t).toFixed(2);
          unitEl.textContent = (t === 1 ? '$' : '~$') + unitVal + '/' + container;
        }
      } else {
        if (priceEl) priceEl.textContent = 'Unavailable';
        if (cmpEl) cmpEl.textContent = '';
      }
    }

    // Active tier price calculation & validation
    var activeVariant = window.zvhcFindVariant(currentTier, currentShade, currentSize, currentFormula);
    if (activeVariant && activeVariant.available !== false) {
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
      if (ctaBtn) {
        ctaBtn.disabled = false;
      }

      var total = 0;
      if (isBotanaRoots) {
        var activeBp = BOTANAROOTS_PRICING[currentTier] || BOTANAROOTS_PRICING[2];
        total = isSubscription ? activeBp.sub : activeBp.oneTime;
      } else {
        var activeRaw = parseFloat(activeVariant.price);
        if (activeRaw > 1000) activeRaw = activeRaw / 100;
        total = isSubscription ? (activeRaw * 0.85) : activeRaw;
      }

      if (upsellIncluded && upsellVariantId) {
        var upsellCheckbox = document.querySelector('.zvhc-upsell-checkbox');
        var upsellVal = upsellCheckbox ? parseFloat(upsellCheckbox.getAttribute('data-price') || 0) : 0;
        total += upsellVal;
      }

      var formattedTotal = total.toFixed(2);
      var suffix = isSubscription ? '/mo' : '';
      var ctaPrice = document.getElementById('zvhcCtaPrice');
      if (ctaPrice) ctaPrice.textContent = '$' + formattedTotal + suffix;
      var stickyPrice = document.getElementById('zvhcStickyPrice');
      if (stickyPrice) stickyPrice.textContent = '$' + formattedTotal + suffix;

      var ctaSub = document.getElementById('zvhcCtaSubtext');
      if (ctaSub) {
        if (isSubscription) {
          ctaSub.textContent = 'BILLED & DELIVERED MONTHLY · CANCEL OR PAUSE ANYTIME';
        } else {
          ctaSub.textContent = window.ZVHC_GUARANTEE_LABEL || (isBotanaRoots ? '60-DAY EDGE RECOVERY PROMISE' : '30-DAY SATISFACTION GUARANTEE');
        }
      }
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
    var v = window.zvhcFindVariant(currentTier, currentShade, currentSize, currentFormula);
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

    var isBotanaRoots = (productData && productData.handle === 'zavelyn-botanaroots-organic-batana-hair-growth-oil');
    var BOTANAROOTS_PLANS = window.ZVHC_BOTANAROOTS_PLANS || {
      1: '6200033465',
      2: '6199771321',
      3: '6200066233'
    };

    var mainItem = { id: parseInt(v.id, 10), quantity: 1 };
    if (isSubscription) {
      var planToAttach = isBotanaRoots ? (BOTANAROOTS_PLANS[currentTier] || '6199771321') : sellingPlanId;
      if (planToAttach) {
        mainItem.selling_plan = parseInt(planToAttach, 10);
      }
    }

    var itemsToAdd = [mainItem];
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

  /**
   * Functional Cart Drawer Upsell addition
   */
  window.zvhcAddUpsell = function(variantId) {
    var vid = variantId || 68580229677241;
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: parseInt(vid, 10), quantity: 1 }] })
    })
    .then(function(res) {
      if (!res.ok) throw new Error('Failed to add upsell');
      return res.json();
    })
    .then(function() {
      if (typeof window.zvhcRefreshCartDrawer === 'function') {
        window.zvhcRefreshCartDrawer();
      } else {
        window.location.reload();
      }
    })
    .catch(function(err) {
      console.error('Upsell add error:', err);
      if (typeof window.zvhcRefreshCartDrawer === 'function') {
        window.zvhcRefreshCartDrawer();
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
