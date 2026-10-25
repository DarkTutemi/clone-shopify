/**
 * Progressive Gift Monitor for Default Shopify Cart
 * Runs when Atlas Cart Upsells drawer is disabled but progressive gifts are enabled.
 *
 * This handles:
 * - Converting gifts to regular items when bundle is removed or qty drops below threshold
 * - Adding gifts when user qualifies for new tiers
 * - Displaying free shipping line in cart drawer
 * - Styling gift items (disabling +/- buttons)
 */
(function() {
  // Prevent running twice if loaded from both app embed and bundler.liquid
  if (window.__atlasProgressiveGiftMonitorLoaded) {
    return;
  }
  window.__atlasProgressiveGiftMonitorLoaded = true;

  // Check if Atlas Cart Upsells drawer is actually rendered and active in the DOM
  const checkAtlasCartDrawerActive = () => {
    const atlasDrawerElement = document.getElementById('atlas-upsell-cart-drawer-main-container');
    if (atlasDrawerElement) return true;
    const atlasOverlay = document.querySelector('.atlas-upsell-cart-drawer-overlay');
    if (atlasOverlay) return true;
    return false;
  };

  // Wait for Atlas Cart Drawer to potentially initialize, then check DOM
  setTimeout(() => {
    if (checkAtlasCartDrawerActive()) {
      console.log('[Atlas Gift Monitor Standalone] Atlas Cart Drawer is active in DOM, skipping');
      return;
    }

    console.log('[Atlas Gift Monitor Standalone] Initializing for default Shopify cart (Atlas Cart Drawer not found in DOM)');

    const localeUrlBase = window?.Shopify?.routes?.root || "/";
    let isProcessing = false;
    let lastCartState = null;
    let currentCart = null;
    let validateDebounceTimer = null;
    let isInitialLoad = true;
    let isUpdatingDOM = false;
    let lastStyleTime = 0;

    // Generate a hash of cart state to detect changes
    const getCartStateHash = (cart) => {
      if (!cart || !cart.items) return '';
      return cart.items.map(item => `${item.key}:${item.quantity}`).sort().join('|');
    };

    // Extract numeric ID from Shopify GID format
    const extractNumericId = (id) => {
      if (!id) return null;
      const idStr = String(id);
      if (/^\d+$/.test(idStr)) return idStr;
      if (idStr.includes('gid://shopify/')) {
        const parts = idStr.split('/');
        return parts[parts.length - 1];
      }
      return idStr;
    };

    // Get bundle config from Atlas bundler or sessionStorage
    const getBundleConfig = () => {
      // First try window.Atlas.bundler.bundle (set on product pages with bundler)
      if (window?.Atlas?.bundler?.bundle) {
        // Save to sessionStorage for use on /cart page
        try {
          sessionStorage.setItem('atlasBundleConfig', JSON.stringify(window.Atlas.bundler.bundle));
        } catch (e) {}
        return window.Atlas.bundler.bundle;
      }

      // Fallback to sessionStorage (for /cart page)
      try {
        const stored = sessionStorage.getItem('atlasBundleConfig');
        if (stored) {
          console.log('[Atlas Gift Monitor Standalone] Using bundle config from sessionStorage');
          return JSON.parse(stored);
        }
      } catch (e) {}

      return null;
    };

    // Debounced validate function
    const debouncedValidateGifts = (delay = 800) => {
      if (validateDebounceTimer) clearTimeout(validateDebounceTimer);
      validateDebounceTimer = setTimeout(() => validateGifts(), delay);
    };

    // Refresh Shopify's default cart drawer after cart changes
    const refreshShopifyCartDrawer = async () => {
      try {
        const cartDrawer = document.querySelector('cart-drawer');
        if (!cartDrawer) {
          console.log('[Atlas Gift Monitor Standalone] No cart-drawer found');
          return;
        }

        const sectionId = cartDrawer.closest('[id^="shopify-section"]')?.id?.replace('shopify-section-', '') || 'cart-drawer';

        const [cartResponse, sectionsResponse] = await Promise.all([
          fetch(`${localeUrlBase}cart.js`),
          fetch(`${localeUrlBase}?sections=${sectionId}`)
        ]);

        if (!sectionsResponse.ok) throw new Error('Failed to fetch sections');

        const cartData = await cartResponse.json();
        const sectionsData = await sectionsResponse.json();

        if (!sectionsData[sectionId]) throw new Error('Section data not found');

        // Method 1: Try Dawn's native renderContents
        if (typeof cartDrawer.renderContents === 'function') {
          try {
            cartDrawer.renderContents({ items: cartData.items, sections: sectionsData });
            console.log('[Atlas Gift Monitor Standalone] Refreshed via renderContents (smooth)');
            return;
          } catch (e) {
            console.log('[Atlas Gift Monitor Standalone] renderContents failed:', e.message);
          }
        }

        // Method 2: Update innerHTML only
        const parser = new DOMParser();
        const doc = parser.parseFromString(sectionsData[sectionId], 'text/html');
        const newDrawer = doc.querySelector('cart-drawer');

        if (newDrawer) {
          const currentClasses = Array.from(cartDrawer.classList);
          const wasOpen = cartDrawer.hasAttribute('open');
          cartDrawer.innerHTML = newDrawer.innerHTML;
          currentClasses.forEach(cls => cartDrawer.classList.add(cls));
          if (wasOpen) cartDrawer.setAttribute('open', '');
          console.log('[Atlas Gift Monitor Standalone] Refreshed via innerHTML update (no blink)');
          return;
        }

        // Method 3: Fallback to events
        document.dispatchEvent(new CustomEvent('cart:refresh'));
        document.dispatchEvent(new CustomEvent('cart:updated'));
        console.log('[Atlas Gift Monitor Standalone] Used event dispatch fallback');

      } catch (e) {
        console.log('[Atlas Gift Monitor Standalone] Cart drawer refresh failed:', e.message);
        document.dispatchEvent(new CustomEvent('cart:refresh'));
      }
    };

    // Refresh /cart page sections via AJAX (no page reload)
    const refreshCartPage = async () => {
      try {
        // Find the cart sections on the page
        const mainCartItems = document.getElementById('main-cart-items');
        const mainCartFooter = document.getElementById('main-cart-footer');

        if (!mainCartItems) {
          console.log('[Atlas Gift Monitor Standalone] No main-cart-items found, falling back to reload');
          window.location.reload();
          return;
        }

        // Get section IDs
        const sections = [];
        if (mainCartItems?.dataset?.id) sections.push(mainCartItems.dataset.id);
        if (mainCartFooter?.dataset?.id) sections.push(mainCartFooter.dataset.id);
        sections.push('cart-icon-bubble');

        const sectionsParam = sections.join(',');
        const sectionsResponse = await fetch(`${window.location.pathname}?sections=${sectionsParam}`);

        if (!sectionsResponse.ok) {
          throw new Error('Failed to fetch cart sections');
        }

        const sectionsData = await sectionsResponse.json();
        const parser = new DOMParser();

        // Update main-cart-items section
        if (mainCartItems?.dataset?.id && sectionsData[mainCartItems.dataset.id]) {
          const doc = parser.parseFromString(sectionsData[mainCartItems.dataset.id], 'text/html');
          const newContent = doc.querySelector('.js-contents');
          const existingContent = mainCartItems.querySelector('.js-contents');
          if (existingContent && newContent) {
            existingContent.innerHTML = newContent.innerHTML;
          }
        }

        // Update main-cart-footer section
        if (mainCartFooter?.dataset?.id && sectionsData[mainCartFooter.dataset.id]) {
          const doc = parser.parseFromString(sectionsData[mainCartFooter.dataset.id], 'text/html');
          const newContent = doc.querySelector('.js-contents');
          const existingContent = mainCartFooter.querySelector('.js-contents');
          if (existingContent && newContent) {
            existingContent.innerHTML = newContent.innerHTML;
          }
        }

        // Update cart icon bubble
        if (sectionsData['cart-icon-bubble']) {
          const cartIconBubble = document.getElementById('cart-icon-bubble');
          if (cartIconBubble) {
            const doc = parser.parseFromString(sectionsData['cart-icon-bubble'], 'text/html');
            const newContent = doc.querySelector('.shopify-section');
            if (newContent) {
              cartIconBubble.innerHTML = newContent.innerHTML;
            }
          }
        }

        // Check if cart is empty and update body class
        const cartItems = document.querySelector('cart-items');
        const cartResponse = await fetch(`${localeUrlBase}cart.js`);
        const cartData = await cartResponse.json();
        if (cartItems) {
          cartItems.classList.toggle('is-empty', cartData.item_count === 0);
        }

        console.log('[Atlas Gift Monitor Standalone] Refreshed cart page sections via AJAX');

      } catch (e) {
        console.error('[Atlas Gift Monitor Standalone] Cart page refresh failed:', e.message);
        // Fallback to page reload
        window.location.reload();
      }
    };

    // Validate and manage gifts when cart changes
    const validateGifts = async () => {
      const bundleConfig = getBundleConfig();
      if (!bundleConfig || !bundleConfig.progressive_gift || !bundleConfig.progressive_gift.enabled) {
        const hasExistingGiftStyling = document.querySelector('.atlas-progressive-gift-item');
        const hasExistingFreeShippingLine = document.querySelector('#atlas-standalone-free-shipping-line');

        if (hasExistingGiftStyling || hasExistingFreeShippingLine) {
          try {
            const cart = await fetch(`${localeUrlBase}cart.js`).then(res => res.json());
            styleGiftItems(cart);
            updateFreeShippingLine(cart);
          } catch (e) {
            // Ignore errors when progressive gifts disabled
          }
        }
        return;
      }

      if (isProcessing) {
        console.log('[Atlas Gift Monitor Standalone] Already processing, skipping');
        return;
      }
      isProcessing = true;

      try {
        const cart = await fetch(`${localeUrlBase}cart.js`).then(res => res.json());
        currentCart = cart;

        const currentStateHash = getCartStateHash(cart);
        const stateChanged = currentStateHash !== lastCartState;
        const previousState = lastCartState;
        lastCartState = currentStateHash;

        console.log('[Atlas Gift Monitor Standalone] validateGifts called', {
          stateChanged,
          previousItemCount: previousState?.split('|').length || 0,
          newItemCount: cart.items?.length,
          isInitialLoad
        });

        if (isInitialLoad) {
          isInitialLoad = false;
          console.log('[Atlas Gift Monitor Standalone] Initial load - styling gifts only');
          styleGiftItems(cart);
          updateFreeShippingLine(cart);
          isProcessing = false;
          return;
        }

        if (!stateChanged && previousState !== null) {
          console.log('[Atlas Gift Monitor Standalone] Cart state unchanged, styling only');
          styleGiftItems(cart);
          updateFreeShippingLine(cart);
          isProcessing = false;
          return;
        }

        console.log('[Atlas Gift Monitor Standalone] Cart changed! Processing conversion logic...');

        const cartItems = cart.items || [];
        const bundleConfig = getBundleConfig();

        // Group bundle items by bundle_id (excluding gifts)
        const bundleGroups = {};
        cartItems.forEach(item => {
          const bundleId = item.properties?._bundle;
          const isGift = item.properties?._progressive_gift === "true" || item.properties?._progressive_gift === true;
          if (bundleId && !isGift) {
            if (!bundleGroups[bundleId]) bundleGroups[bundleId] = { items: [], totalQuantity: 0 };
            bundleGroups[bundleId].items.push(item);
            bundleGroups[bundleId].totalQuantity += item.quantity || 0;
          }
        });

        // Find progressive gifts in cart
        const progressiveGifts = cartItems.filter(item =>
          item.properties?._progressive_gift === "true" || item.properties?._progressive_gift === true
        );

        console.log('[Atlas Gift Monitor Standalone] Cart analysis', {
          totalItems: cartItems.length,
          bundleGroups: Object.keys(bundleGroups),
          progressiveGifts: progressiveGifts.length
        });

        // Track gifts to convert to regular items
        const giftsToConvert = [];

        progressiveGifts.forEach(gift => {
          const giftBundleId = gift.properties?._bundle;
          const minQuantityRequired = parseInt(gift.properties?._min_quantity_required || gift.properties?._unlock_tier || "1", 10);
          const bundleGroup = bundleGroups[giftBundleId];

          console.log('[Atlas Gift Monitor Standalone] Checking gift', {
            title: gift.product_title,
            giftBundleId,
            bundleExists: !!bundleGroup,
            bundleQty: bundleGroup?.totalQuantity,
            minRequired: minQuantityRequired
          });

          if (!bundleGroup) {
            console.log('[Atlas Gift Monitor Standalone] Bundle removed, will convert gift:', gift.product_title);
            giftsToConvert.push(gift);
          } else if (bundleGroup.totalQuantity < minQuantityRequired) {
            console.log('[Atlas Gift Monitor Standalone] Below min qty, will convert gift:', gift.product_title);
            giftsToConvert.push(gift);
          }
        });

        // Check if free shipping should be revoked
        const freeShippingToRevoke = [];
        if (cart.attributes) {
          for (const [key, value] of Object.entries(cart.attributes)) {
            if (key.startsWith('_atlas_free_shipping_') && !key.includes('_min_qty_') && value === 'true') {
              const attrBundleId = key.replace('_atlas_free_shipping_', '');
              const bundleGroup = bundleGroups[attrBundleId];

              if (!bundleGroup) {
                freeShippingToRevoke.push(attrBundleId);
              } else {
                let stillQualifiesForFreeShipping = false;

                if (bundleConfig && String(bundleConfig.id) === attrBundleId) {
                  const giftItems = bundleConfig.progressive_gift?.gift_items || [];
                  const bundleOffers = bundleConfig.bundle_offers || [];
                  const currentQuantity = bundleGroup.totalQuantity;

                  for (const giftItem of giftItems) {
                    if (giftItem.gift_type === 'free_shipping') {
                      const unlockTier = giftItem.unlock_tier || 1;
                      const unlockAtIndex = unlockTier - 1;
                      let minQtyRequired = 1;
                      if (bundleOffers[unlockAtIndex]) {
                        const unlockOffer = bundleOffers[unlockAtIndex].offer || bundleOffers[unlockAtIndex];
                        if (unlockOffer.pricing_type === "Buy X get Y %") {
                          minQtyRequired = (unlockOffer.quantity || 1) + (unlockOffer.discount || 0);
                        } else {
                          minQtyRequired = unlockOffer.quantity || 1;
                        }
                      }
                      if (currentQuantity >= minQtyRequired) {
                        stillQualifiesForFreeShipping = true;
                        break;
                      }
                    }
                  }
                } else {
                  const minQtyKey = `_atlas_free_shipping_min_qty_${attrBundleId}`;
                  const minQty = parseInt(cart.attributes[minQtyKey] || "0", 10);
                  if (minQty > 0 && bundleGroup.totalQuantity >= minQty) {
                    stillQualifiesForFreeShipping = true;
                  }
                }

                if (!stillQualifiesForFreeShipping) {
                  freeShippingToRevoke.push(attrBundleId);
                }
              }
            }
          }
        }

        let cartUpdated = false;

        // Convert gifts to regular items
        if (giftsToConvert.length > 0) {
          console.log('[Atlas Gift Monitor Standalone] Converting', giftsToConvert.length, 'gift items to regular items');
          for (const gift of giftsToConvert) {
            try {
              const giftItemId = gift.properties?._progressive_gift_item_id || "";
              await fetch(`${localeUrlBase}cart/change.js`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                  id: gift.key,
                  properties: {
                    _progressive_gift: "",
                    _bundle: "",
                    _bundle_offer: "",
                    _progressive_gift_item_id: "",
                    _unlock_tier: "",
                    _min_quantity_required: "",
                    _was_progressive_gift: "true",
                    _was_progressive_gift_item_id: giftItemId
                  }
                }),
              });
              cartUpdated = true;
            } catch (e) {
              console.error('[Atlas Gift Monitor Standalone] Failed to convert gift:', e);
            }
          }
        }

        // Revoke free shipping if needed
        if (freeShippingToRevoke.length > 0) {
          console.log('[Atlas Gift Monitor Standalone] Revoking free shipping for bundles:', freeShippingToRevoke);
          const attributesToUpdate = {};
          freeShippingToRevoke.forEach(bundleId => {
            attributesToUpdate[`_atlas_free_shipping_${bundleId}`] = "";
          });
          try {
            await fetch(`${localeUrlBase}cart/update.js`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify({ attributes: attributesToUpdate }),
            });
            cartUpdated = true;
          } catch (e) {
            console.error('[Atlas Gift Monitor Standalone] Failed to revoke free shipping:', e);
          }
        }

        // Check and add missing progressive gifts
        let newGiftsAdded = false;
        if (giftsToConvert.length === 0 && freeShippingToRevoke.length === 0) {
          const addedGifts = await checkAndAddMissingGifts(bundleGroups, progressiveGifts, cartItems);
          if (addedGifts) {
            cartUpdated = true;
            newGiftsAdded = true;
          }
        }

        // Refresh cart data if updated
        if (cartUpdated) {
          console.log('[Atlas Gift Monitor Standalone] Cart was updated', { newGiftsAdded, giftsConverted: giftsToConvert.length });
          const updatedCart = await fetch(`${localeUrlBase}cart.js`).then(res => res.json());
          currentCart = updatedCart;
          lastCartState = getCartStateHash(updatedCart);

          document.dispatchEvent(new CustomEvent('atlas-cart:gifts-updated'));

          if (window.location.pathname.includes('/cart')) {
            // Use AJAX refresh on /cart page instead of full page reload
            // Note: cart.js now handles progressive gifts directly, but this serves as a fallback
            console.log('[Atlas Gift Monitor Standalone] Refreshing cart page via AJAX...');
            setTimeout(() => refreshCartPage(), 200);
          } else if (newGiftsAdded || giftsToConvert.length > 0) {
            console.log('[Atlas Gift Monitor Standalone] Refreshing drawer...', { newGiftsAdded, giftsConverted: giftsToConvert.length });
            setTimeout(() => refreshShopifyCartDrawer(), 200);
          }
        }

        styleGiftItems(currentCart);
        updateFreeShippingLine(currentCart);

      } catch (e) {
        console.error('[Atlas Gift Monitor Standalone] Error:', e);
      } finally {
        isProcessing = false;
      }
    };

    // Check and add missing progressive gifts when user increases quantity
    const checkAndAddMissingGifts = async (bundleGroups, existingProgressiveGifts, cartItems) => {
      const bundleConfig = getBundleConfig();
      if (!bundleConfig || !bundleConfig.progressive_gift || !bundleConfig.progressive_gift.enabled) {
        return false;
      }

      const progressiveGiftConfig = bundleConfig.progressive_gift;
      const giftItems = progressiveGiftConfig.gift_items || [];
      const bundleOffers = bundleConfig.bundle_offers || [];
      const bundleId = String(bundleConfig.id);

      console.log('[Atlas Gift Monitor Standalone] Bundle config gift items:', {
        totalGiftItems: giftItems.length,
        gifts: giftItems.map(g => ({
          id: g.id,
          type: g.gift_type,
          unlockTier: g.unlock_tier,
          productTitle: g.product?.title
        })),
        bundleOffers: bundleOffers.map((o, i) => ({
          tier: i + 1,
          quantity: o.offer?.quantity || o.quantity
        }))
      });

      const bundleGroup = bundleGroups[bundleId];
      if (!bundleGroup) return false;

      const currentQuantity = bundleGroup.totalQuantity;
      const firstBundleItem = bundleGroup.items[0];
      const offerId = firstBundleItem?.properties?._bundle_offer;

      if (!offerId) return false;

      const existingGiftItemIds = new Set();
      const existingGiftVariantIds = new Set();
      existingProgressiveGifts.forEach(gift => {
        if (gift.properties?._progressive_gift_item_id) {
          existingGiftItemIds.add(String(gift.properties._progressive_gift_item_id));
        }
        existingGiftVariantIds.add(String(gift.variant_id));
      });

      console.log('[Atlas Gift Monitor Standalone] Existing gifts tracking', {
        byItemId: Array.from(existingGiftItemIds),
        byVariantId: Array.from(existingGiftVariantIds)
      });

      const giftsToAdd = [];
      const giftsToConvertBack = [];
      let shouldHaveFreeShipping = false;
      let freeShippingMinQty = 0;

      giftItems.forEach(giftItem => {
        console.log('[Atlas Gift Monitor Standalone] Processing gift config:', {
          id: giftItem.id,
          type: giftItem.gift_type,
          unlockTier: giftItem.unlock_tier,
          variantId: giftItem.variant_id,
          productTitle: giftItem.product?.title
        });

        if (existingGiftItemIds.has(String(giftItem.id))) {
          console.log('[Atlas Gift Monitor Standalone] Skipping - already in cart by gift item ID:', giftItem.id);
          return;
        }

        let variantId = giftItem.variant_id;
        if (!variantId && giftItem.product?.variants?.[0]?.id) {
          variantId = giftItem.product.variants[0].id;
        }
        variantId = extractNumericId(variantId);

        if (variantId && existingGiftVariantIds.has(String(variantId))) {
          console.log('[Atlas Gift Monitor Standalone] Skipping - already in cart by variant ID:', variantId);
          return;
        }

        const unlockTier = giftItem.unlock_tier || 1;
        const unlockAtIndex = unlockTier - 1;

        let minQuantityRequired = 1;
        if (bundleOffers[unlockAtIndex]) {
          const unlockOffer = bundleOffers[unlockAtIndex].offer || bundleOffers[unlockAtIndex];
          if (unlockOffer.pricing_type === "Buy X get Y %") {
            minQuantityRequired = (unlockOffer.quantity || 1) + (unlockOffer.discount || 0);
          } else {
            minQuantityRequired = unlockOffer.quantity || 1;
          }
        }

        const qualifiesForGift = currentQuantity >= minQuantityRequired;

        console.log('[Atlas Gift Monitor Standalone] Gift qualification check:', {
          giftId: giftItem.id,
          unlockTier,
          minQuantityRequired,
          currentQuantity,
          qualifies: qualifiesForGift
        });

        if (giftItem.gift_type === 'free_shipping') {
          if (qualifiesForGift) {
            shouldHaveFreeShipping = true;
            freeShippingMinQty = minQuantityRequired;
          }
          return;
        }

        if (giftItem.gift_type !== 'free_gift') return;

        const isGiftDeclined = currentCart?.attributes?.[`_atlas_declined_gift_${giftItem.id}`] === "true";

        if (isGiftDeclined) {
          console.log('[Atlas Gift Monitor Standalone] Gift is declined, skipping:', giftItem.id, giftItem.product?.title);
        }

        if (qualifiesForGift && !isGiftDeclined) {
          console.log('[Atlas Gift Monitor Standalone] Gift qualifies and not declined, variant ID:', variantId);

          if (variantId) {
            let productId = giftItem.product_id || giftItem.product?.id;
            if (!productId && giftItem.product?.variants?.[0]) {
              const fullVariantId = giftItem.product.variants[0].id;
              if (typeof fullVariantId === 'string' && fullVariantId.includes('/')) {
                productId = fullVariantId.split('/').slice(0, -2).join('/') + '/Product/' + fullVariantId.split('/')[4];
              }
            }

            const giftItemIdStr = String(giftItem.id);

            let existingRegularItem = cartItems.find(item => {
              const wasThisGift = item.properties?._was_progressive_gift === "true" &&
                item.properties?._was_progressive_gift_item_id === giftItemIdStr;
              return wasThisGift;
            });

            if (!existingRegularItem) {
              existingRegularItem = cartItems.find(item => {
                const wasAnyGift = item.properties?._was_progressive_gift === "true";
                return wasAnyGift && String(item.variant_id) === String(variantId);
              });
            }

            if (!existingRegularItem && productId) {
              existingRegularItem = cartItems.find(item => {
                const wasAnyGift = item.properties?._was_progressive_gift === "true";
                return wasAnyGift && String(item.product_id) === String(productId);
              });
            }

            if (existingRegularItem) {
              giftsToConvertBack.push({
                key: existingRegularItem.key,
                properties: {
                  _progressive_gift: "true",
                  _bundle: bundleId,
                  _bundle_offer: offerId,
                  _progressive_gift_item_id: String(giftItem.id),
                  _unlock_tier: String(giftItem.unlock_tier || 1),
                  _min_quantity_required: String(minQuantityRequired),
                  _was_progressive_gift: "",
                  _was_progressive_gift_item_id: ""
                }
              });
            } else {
              const variantAlreadyInCart = cartItems.some(item => String(item.variant_id) === String(variantId));
              if (variantAlreadyInCart) {
                console.log('[Atlas Gift Monitor Standalone] Variant already in cart, skipping add:', variantId);
              } else {
                giftsToAdd.push({
                  id: variantId,
                  quantity: 1,
                  properties: {
                    _progressive_gift: "true",
                    _bundle: bundleId,
                    _bundle_offer: offerId,
                    _progressive_gift_item_id: giftItem.id,
                    _unlock_tier: giftItem.unlock_tier || 1,
                    _min_quantity_required: String(minQuantityRequired),
                  },
                });
              }
            }
          }
        }
      });

      let hasChanges = false;

      // Convert existing items back to progressive gifts
      for (const giftToConvert of giftsToConvertBack) {
        try {
          await fetch(`${localeUrlBase}cart/change.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              id: giftToConvert.key,
              properties: giftToConvert.properties,
            }),
          });
          hasChanges = true;
          console.log('[Atlas Gift Monitor Standalone] Converted item back to gift');
        } catch (error) {
          console.error('[Atlas Gift Monitor Standalone] Failed to convert item back to gift:', error);
        }
      }

      // Add new gift items
      if (giftsToAdd.length > 0) {
        console.log('[Atlas Gift Monitor Standalone] Attempting to add gifts:', giftsToAdd);
        try {
          const addResponse = await fetch(`${localeUrlBase}cart/add.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ items: giftsToAdd }),
          });

          if (addResponse.ok) {
            hasChanges = true;
            console.log('[Atlas Gift Monitor Standalone] Successfully added', giftsToAdd.length, 'missing gifts');
          } else {
            const errorData = await addResponse.json().catch(() => ({}));
            console.error('[Atlas Gift Monitor Standalone] Failed to add gifts - Status:', addResponse.status, 'Error:', errorData);
            if (addResponse.status === 422) {
              console.log('[Atlas Gift Monitor Standalone] 422 error - checking if items need different handling');
            }
          }
        } catch (error) {
          console.error('[Atlas Gift Monitor Standalone] Failed to add gifts:', error);
        }
      }

      // Grant free shipping if qualified
      const currentFreeShippingAttr = currentCart?.attributes?.[`_atlas_free_shipping_${bundleId}`];
      if (shouldHaveFreeShipping && currentFreeShippingAttr !== 'true') {
        const attributes = {};
        attributes[`_atlas_free_shipping_${bundleId}`] = "true";
        attributes[`_atlas_free_shipping_min_qty_${bundleId}`] = String(freeShippingMinQty);

        try {
          await fetch(`${localeUrlBase}cart/update.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ attributes }),
          });
          hasChanges = true;
          console.log('[Atlas Gift Monitor Standalone] Granted free shipping');
        } catch (error) {
          console.error('[Atlas Gift Monitor Standalone] Failed to grant free shipping:', error);
        }
      }

      return hasChanges;
    };

    // Get cart upsell configuration from session storage
    const getCartUpsellConfig = () => {
      try {
        const data = sessionStorage.getItem('atlasCartUpsellData');
        if (data) {
          const parsed = JSON.parse(data);
          return parsed?.cart_upsell_configuration || null;
        }
      } catch (e) {}
      return null;
    };

    // Update free shipping line visibility in default Shopify cart
    const updateFreeShippingLine = (cart) => {
      if (!cart || !cart.attributes) return;

      let hasFreeShipping = false;
      for (const [key, value] of Object.entries(cart.attributes)) {
        if (key.startsWith('_atlas_free_shipping_') && !key.includes('_min_qty_') && value === 'true') {
          hasFreeShipping = true;
          break;
        }
      }

      const existingLine = document.getElementById('atlas-standalone-free-shipping-line');

      if (hasFreeShipping) {
        if (!existingLine) {
          const cartUpsellConfig = getCartUpsellConfig();
          const labelText = cartUpsellConfig?.cart_drawer_free_shipping_label_text || 'Shipping';
          const valueText = cartUpsellConfig?.cart_drawer_free_shipping_value_text || 'FREE';

          const totalsContainer = document.querySelector('.cart-drawer__footer .totals, .cart__footer .totals, .totals');

          if (totalsContainer) {
            const freeShippingLine = document.createElement('div');
            freeShippingLine.id = 'atlas-standalone-free-shipping-line';
            freeShippingLine.className = 'totals';
            freeShippingLine.setAttribute('role', 'status');
            freeShippingLine.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 0; margin-bottom: 8px;';
            // textContent, not innerHTML: both labels are merchant settings (DEV-626)
            const labelEl = document.createElement('h2');
            labelEl.className = 'totals__subtotal';
            labelEl.style.cssText = 'margin: 0; font-size: inherit; font-weight: 400;';
            labelEl.textContent = labelText;
            const valueEl = document.createElement('p');
            valueEl.className = 'totals__subtotal-value';
            valueEl.style.cssText = 'margin: 0; font-weight: 600;';
            valueEl.textContent = valueText;
            freeShippingLine.append(labelEl, valueEl);

            totalsContainer.parentElement.insertBefore(freeShippingLine, totalsContainer);
            console.log('[Atlas Gift Monitor Standalone] Added free shipping line above subtotal', { labelText, valueText });
          }
        }
      } else {
        if (existingLine) {
          existingLine.remove();
          console.log('[Atlas Gift Monitor Standalone] Removed free shipping line');
        }
      }
    };

    // Handle gift item deletion - mark as declined
    const handleGiftDeletion = async (itemKey) => {
      if (!currentCart) return;

      const itemToDelete = currentCart.items?.find(item => item.key === itemKey);
      if (!itemToDelete) return;

      const isProgressiveGift = itemToDelete.properties?._progressive_gift === "true" || itemToDelete.properties?._progressive_gift === true;
      const progressiveGiftItemId = itemToDelete.properties?._progressive_gift_item_id;

      if (isProgressiveGift && progressiveGiftItemId) {
        console.log('[Atlas Gift Monitor Standalone] Marking gift as declined:', progressiveGiftItemId);
        const attributes = {};
        attributes[`_atlas_declined_gift_${progressiveGiftItemId}`] = "true";

        try {
          await fetch(`${localeUrlBase}cart/update.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ attributes }),
          });
        } catch (e) {
          console.error('[Atlas Gift Monitor Standalone] Failed to mark gift as declined:', e);
        }
      }
    };

    // Style gift items in default cart
    const styleGiftItems = (cart) => {
      const now = Date.now();
      if (now - lastStyleTime < 1000) return;
      lastStyleTime = now;
      isUpdatingDOM = true;

      const cartItems = cart?.items || [];
      const giftItems = cartItems.filter(item =>
        item.properties?._progressive_gift === "true" || item.properties?._progressive_gift === true
      );

      // Add CSS if not already added
      if (!document.getElementById('atlas-gift-standalone-styles')) {
        const style = document.createElement('style');
        style.id = 'atlas-gift-standalone-styles';
        style.textContent = `
          /* Only disable +/- buttons, NOT the delete/trash button */
          .atlas-progressive-gift-item button[name="minus"],
          .atlas-progressive-gift-item button[name="plus"],
          .atlas-progressive-gift-item .quantity__button:not(.cart-remove-button):not([aria-label*="Remove"]) {
            pointer-events: none !important;
            opacity: 0.3 !important;
            cursor: not-allowed !important;
          }
          /* Dim the quantity input but keep delete button visible */
          .atlas-progressive-gift-item quantity-input input,
          .atlas-progressive-gift-item .quantity__input,
          .atlas-progressive-gift-item input[name="updates[]"] {
            pointer-events: none !important;
            opacity: 0.5 !important;
          }
          /* Ensure delete/remove button stays clickable */
          .atlas-progressive-gift-item cart-remove-button,
          .atlas-progressive-gift-item .cart-remove-button,
          .atlas-progressive-gift-item button[aria-label*="Remove"],
          .atlas-progressive-gift-item a[href*="/cart/change"],
          .atlas-progressive-gift-item .remove,
          .atlas-progressive-gift-item [data-cart-remove] {
            pointer-events: auto !important;
            opacity: 1 !important;
            cursor: pointer !important;
          }
          #atlas-standalone-free-shipping-line {
            animation: fadeIn 0.3s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }

      // Remove styling from items that are no longer gifts
      document.querySelectorAll('.atlas-progressive-gift-item').forEach(el => {
        const itemKey = el.dataset?.key || el.dataset?.id || el.querySelector('[data-key]')?.dataset?.key;
        const isStillGift = giftItems.some(g => g.key === itemKey || String(g.variant_id) === el.dataset?.variantId);
        if (!isStillGift) {
          el.classList.remove('atlas-progressive-gift-item');

          // Re-enable quantity buttons
          const buttons = el.querySelectorAll('button[name="minus"], button[name="plus"]');
          buttons.forEach(btn => {
            btn.disabled = false;
            btn.style.pointerEvents = '';
            btn.style.opacity = '';
          });

          // Re-enable quantity input
          const qtyInput = el.querySelector('input[name="updates[]"], .quantity__input, quantity-input input');
          if (qtyInput) {
            qtyInput.style.pointerEvents = '';
            qtyInput.style.opacity = '';
          }
        }
      });

      if (giftItems.length === 0) return;

      // Style each gift item
      giftItems.forEach(giftItem => {
        const variantId = giftItem.variant_id;
        const itemKey = giftItem.key;

        const selectors = [
          `[data-key="${itemKey}"]`, `[data-id="${itemKey}"]`,
          `[data-variant-id="${variantId}"]`, `cart-item[data-key="${itemKey}"]`,
          `[data-line-item-key="${itemKey}"]`
        ];

        let itemElement = null;
        for (const sel of selectors) {
          itemElement = document.querySelector(sel);
          if (itemElement) break;
        }

        if (!itemElement && giftItem.handle) {
          const link = document.querySelector(`a[href*="${giftItem.handle}"]`);
          if (link) {
            itemElement = link.closest('cart-item, .cart-item, .cart__item, [data-cart-item], .line-item');
          }
        }

        if (itemElement && !itemElement.classList.contains('atlas-progressive-gift-item')) {
          itemElement.classList.add('atlas-progressive-gift-item');

          // Only disable +/- buttons, leave delete/trash button enabled
          const qtyButtons = itemElement.querySelectorAll('button[name="minus"], button[name="plus"]');
          qtyButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.3';
          });

          // Dim quantity input
          const qtyInput = itemElement.querySelector('input[name="updates[]"], .quantity__input, quantity-input input');
          if (qtyInput) {
            qtyInput.style.pointerEvents = 'none';
            qtyInput.style.opacity = '0.5';
          }

          console.log('[Atlas Gift Monitor Standalone] Styled gift item:', giftItem.product_title);
        }
      });

      setTimeout(() => { isUpdatingDOM = false; }, 200);
    };

    // Intercept fetch for cart changes and handle gift deletion
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      const urlStr = typeof url === 'string' ? url : url?.url || '';

      if (urlStr.includes('/cart/change') || urlStr.includes('/cart/update')) {
        try {
          const options = args[1];
          if (options?.body) {
            const body = JSON.parse(options.body);
            if (body.quantity === 0 && body.id) {
              handleGiftDeletion(body.id);
            }
          }
        } catch (e) {}
      }

      return originalFetch.apply(this, args).then(response => {
        if (urlStr.includes('/cart/') && (urlStr.includes('change') || urlStr.includes('update') || urlStr.includes('add'))) {
          // Only trigger validation if progressive gifts are enabled
          const bundleConfig = getBundleConfig();
          if (bundleConfig?.progressive_gift?.enabled) {
            debouncedValidateGifts(1000);
          }
        }
        return response;
      });
    };

    // Save bundle config to sessionStorage if available (for use on /cart page later)
    const saveBundleConfigToSession = () => {
      if (window?.Atlas?.bundler?.bundle) {
        try {
          sessionStorage.setItem('atlasBundleConfig', JSON.stringify(window.Atlas.bundler.bundle));
          console.log('[Atlas Gift Monitor Standalone] Saved bundle config to sessionStorage');
        } catch (e) {}
      }
    };

    // Check periodically for bundle config (it may load after this script)
    const checkForBundleConfig = setInterval(() => {
      if (window?.Atlas?.bundler?.bundle) {
        saveBundleConfigToSession();
        clearInterval(checkForBundleConfig);
      }
    }, 500);

    // Stop checking after 10 seconds
    setTimeout(() => clearInterval(checkForBundleConfig), 10000);

    // Initial validation - only run if progressive gifts might be enabled
    setTimeout(() => {
      const bundleConfig = getBundleConfig();
      if (bundleConfig?.progressive_gift?.enabled) {
        validateGifts();
      }
    }, 1500);

  }, 2500); // Wait for Atlas Cart Drawer to potentially initialize
})();
