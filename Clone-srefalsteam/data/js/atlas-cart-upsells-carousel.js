class UpsellProductsCarouselHandler {
  constructor(cartDrawerInstance, formatMoneyFn, config) {
    this.cartDrawer = cartDrawerInstance; // To access config, drawer, methods etc.
    this.formatMoney = formatMoneyFn;
    this.swiperInstance = null;
    this.config = config;
    this.manualUpsellProductConfig = config?.manual_upsell_product_config;
    this.numProductsToShow = 0;
    this.currentFetchedProductData = [];
    this.currentUpsellProductsToShow = [];

    // Swiper library loading will be initiated by AtlasUpsellCartDrawer
  }

  loadSwiperLibrary() {
    // Check if Swiper is already loaded
    if (typeof Swiper !== "undefined") {
      this.initializeSwiper();
      return;
    }
  }

  initializeSwiper() {
    // Wait for DOM to be ready
    setTimeout(() => {
      // Swiper initialization is now handled in renderCarouselInItemsContainer
      // This ensures the carousel is initialized after it's placed correctly
      this.renderCarouselInItemsContainer(); // Just load the carousel products
    }, 100);
  }

  renderCarouselProducts() {
    // This method is now just responsible for triggering a re-render
    // The actual carousel rendering happens in renderCarouselInItemsContainer
    if (this.cartDrawer.cart && this.cartDrawer.cart.items) {
      // This will trigger renderCartItems in AtlasUpsellCartDrawer,
      // which in turn will call this.renderCarouselInItemsContainer if needed.
      this.cartDrawer.renderCartItems();
    }
  }

  async fetchCarouselProductsData() {
    console.log("Starting fetchCarouselProductsData");

    if (this.config?.use_ai_recommended_products) {
      console.log("Using AI recommended products logic");

      if (this.cartDrawer.cart.items.length === 0) {
        console.log("Cart is empty, returning empty product data");
        this.currentFetchedProductData = [];
        return { fetchedProducts: [], upsellProductsToShow: [] };
      }

      const productIdsInCart = this.cartDrawer.cart.items.map(
        (item) => item.product_id
      );
      console.log("Product IDs in cart:", productIdsInCart);

      const intent =
        this.config?.recommendation_algorithm === "related"
          ? "related"
          : "complementary";
      console.log("Intent:", intent);
      const recommendationPromises = productIdsInCart.map((productId) =>
        fetch(
          `${this.cartDrawer.localeUrlBase}recommendations/products.json?product_id=${productId}&limit=8&intent=${intent}`
        )
          .then(async (res) => {
            if (!res.ok) {
              console.error(
                `Failed to fetch recommendations for product ${productId}: ${res.status} ${res.statusText}`
              );
              return { products: [] }; // Return empty on error
            }
            const responseText = await res.text();
            try {
              const json = JSON.parse(responseText);
              if (!json.products || json.products.length === 0) {
                console.log(
                  `No products in recommendation response for ${productId}. Response: ${responseText}`
                );
              }
              return json;
            } catch (e) {
              console.error(
                `Failed to parse JSON for recommendations for product ${productId}. Response text: ${responseText}`,
                e
              );
              return { products: [] };
            }
          })
          .catch((error) => {
            console.error(
              `Error fetching recommendations for product ${productId}:`,
              error
            );
            return { products: [] }; // Return empty on error to not break Promise.all
          })
      );

      const recommendationResults = await Promise.all(recommendationPromises);
      console.log("Recommendation results:", recommendationResults);

      let recommendedProducts = recommendationResults.flatMap(
        (result) => result?.products || []
      );

      // Deduplicate products
      const uniqueRecommendedProducts = Array.from(
        new Map(recommendedProducts.map((p) => [p.id, p])).values()
      );
      console.log("Unique recommended products:", uniqueRecommendedProducts);

      if (!this.config?.upsell_products_show_if_already_in_cart) {
        const cartProductHandles = new Set(
          this.cartDrawer.cart.items.map((item) => item.handle)
        );
        recommendedProducts = uniqueRecommendedProducts.filter(
          (product) => !cartProductHandles.has(product.handle)
        );
        console.log("Filtered recommended products:", recommendedProducts);
      } else {
        recommendedProducts = uniqueRecommendedProducts;
      }

      const newProductHandles = recommendedProducts.map((p) => p.handle);
      const curProdHandles = this.currentFetchedProductData.map(
        (p) => p.handle
      );

      const hasDifferentProducts =
        curProdHandles.length !== newProductHandles.length ||
        !curProdHandles.every((handle) => newProductHandles.includes(handle));

      console.log("Has different products:", hasDifferentProducts);

      if (!hasDifferentProducts) {
        // Return cached data if recommendations are the same
        console.log("Returning cached data as recommendations are the same");
        return Promise.resolve({
          fetchedProducts: this.currentFetchedProductData,
          upsellProductsToShow: this.currentUpsellProductsToShow,
        });
      }

      this.currentFetchedProductData = recommendedProducts;

      const upsellProductsToShow = recommendedProducts.map((p) => ({
        handle: p.handle,
        product_id: `gid://shopify/Product/${p.id}`,
        variant_ids: p.variants.map(
          (v) => `gid://shopify/ProductVariant/${v.id}`
        ),
      }));

      this.currentUpsellProductsToShow = upsellProductsToShow;

      console.log("Returning new fetched products and upsell products to show");
      return {
        fetchedProducts: recommendedProducts,
        upsellProductsToShow: upsellProductsToShow,
      };
    }

    console.log("Using manual upsell product configuration");

    let upsellProductsToShow = [];

    const pushAllTriggeredUpsellElements = (upsellElements) => {
      upsellElements.forEach((upsellElement) => {
        upsellProductsToShow.push(upsellElement);
      });
    };

    this.manualUpsellProductConfig.forEach((el) => {
      if (el.trigger_selection_type === "all_products") {
        console.log("Triggering upsell for all products");
        pushAllTriggeredUpsellElements(el.upsell_products);
      } else if (el.trigger_selection_type === "specific_products") {
        console.log("Triggering upsell for specific products");
        el.trigger_products.forEach((triggerProduct) => {
          let triggerProductIsInCart = false;
          triggerProduct?.variant_ids?.forEach((triggerProductVariantId) => {
            this.cartDrawer?.cart?.items?.forEach((cartItem) => {
              if (
                this.stringIdToInt(cartItem.product_id) ===
                  this.stringIdToInt(triggerProduct.product_id) &&
                this.stringIdToInt(cartItem.variant_id) ===
                  this.stringIdToInt(triggerProductVariantId)
              ) {
                triggerProductIsInCart = true;
                return;
              }
            });
          });
          if (triggerProductIsInCart) {
            pushAllTriggeredUpsellElements(el.upsell_products);
          }
        });
      }
    });

    if (!this.config?.upsell_products_show_if_already_in_cart) {
      // remove products that are already in the cart
      console.log("Removing products already in the cart from upsell list");
      upsellProductsToShow = upsellProductsToShow.filter((product) => {
        return !this?.cartDrawer?.cart?.items?.some((cartItem) => {
          return cartItem?.handle === product?.handle;
        });
      });
    }

    // Merge/consolidate upsellProductsToShow so each product id appears only once, and each product has unique variant_ids
    const mergedUpsellProductsMap = new Map();
    upsellProductsToShow.forEach((product) => {
      const productId = product.product_id;
      if (!mergedUpsellProductsMap.has(productId)) {
        // Clone the product object to avoid mutating the original
        mergedUpsellProductsMap.set(productId, {
          ...product,
          variant_ids: Array.isArray(product.variant_ids)
            ? [...product.variant_ids]
            : [],
        });
      } else {
        // Merge variant_ids, ensuring uniqueness
        const existing = mergedUpsellProductsMap.get(productId);
        const existingVariantIds = Array.isArray(existing.variant_ids)
          ? existing.variant_ids
          : [];
        const newVariantIds = Array.isArray(product.variant_ids)
          ? product.variant_ids
          : [];
        const mergedVariantIds = Array.from(
          new Set([...existingVariantIds, ...newVariantIds])
        );
        existing.variant_ids = mergedVariantIds;
        mergedUpsellProductsMap.set(productId, existing);
      }
    });
    upsellProductsToShow = Array.from(mergedUpsellProductsMap.values())?.sort(
      (a, b) =>
        this.stringIdToInt(a?.product_id) - this.stringIdToInt(b?.product_id)
    );

    console.log("Merged upsell products to show:", upsellProductsToShow);

    const newProductHandles = upsellProductsToShow.map((p) => p?.handle);
    const curProdHandles = this.currentFetchedProductData.map((p) => p?.handle);

    // Check if new upsell products contain any product not present in the previous list.
    const hasDifferentProducts =
      curProdHandles.length !== newProductHandles.length ||
      !curProdHandles.every((handle) => newProductHandles.includes(handle));

    console.log("Has different products:", hasDifferentProducts);

    if (hasDifferentProducts) {
      console.log("Fetching new product data for upsell products");
      const fetchProductPromises = upsellProductsToShow.map((item) => {
        if (item.handle) {
          return fetch(
            `${this.cartDrawer.localeUrlBase}products/${item.handle}.js`
          )
            .then((res) => {
              if (!res.ok) {
                console.error(
                  `Failed to fetch product ${item.handle}: ${res.status} ${res.statusText}`
                );
                return null; // Return null to allow Promise.all to succeed for other fetches
              }
              return res.json();
            })
            .catch((error) => {
              console.error(
                `Error fetching product data for ${item.handle}:`,
                error
              );
              return null; // Ensure Promise.all continues even if a fetch fails
            });
        }
      });

      // Return both the fetched product data (as a promise) and the upsellProductsToShow array.
      return Promise.all(fetchProductPromises).then((fetchedProducts) => {
        const validFetchedProducts = fetchedProducts.filter((p) => p !== null); // Ensure only valid products
        this.currentFetchedProductData = validFetchedProducts; // Update the instance property
        console.log("Fetched product data:", validFetchedProducts);
        return {
          fetchedProducts: validFetchedProducts, // Return the filtered list
          upsellProductsToShow,
        };
      });
    } else {
      console.log(
        "Returning cached product data as upsell products are unchanged"
      );
      // Return the current product data and the current upsellProductsToShow (which is unchanged)
      return Promise.resolve({
        fetchedProducts: this.currentFetchedProductData,
        upsellProductsToShow,
      });
    }
  }

  // Escape catalog and merchant text before it goes into slide markup (DEV-626).
  // A method rather than a top-level const: this file is a classic script, so a
  // global binding could clash with a theme's own escapeHtml and stop it loading.
  _escapeHtml(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
          char
        ]
    );
  }

  _getPriceHtml(price, compareAtPrice) {
    let compareAtPriceHtml = "";
    if (
      this.config?.upsell_products_show_compare_at_price &&
      compareAtPrice &&
      compareAtPrice > price
    ) {
      compareAtPriceHtml = `<span class="atlas-upsell-cart-slide-compare-at-price" style="text-decoration: line-through; margin-right: 5px; color: rgb(109, 113, 117);">${this.formatMoney(
        {
          cents: compareAtPrice,
          format: this.cartDrawer.moneyFormat,
        }
      )}</span>`;
    }
    const priceHtml = `<span>${this.formatMoney({
      cents: price || 0,
      format: this.cartDrawer.moneyFormat,
    })}</span>`;

    return `${compareAtPriceHtml}${priceHtml}`;
  }

  // This method is called by AtlasUpsellCartDrawer.renderCartItems
  renderCarouselInItemsContainer(container, position = "below_items") {
    if (!container) return;

    console.log("Rendering carousel in items container");

    this.fetchCarouselProductsData()
      .then((productFetchResults) => {
        console.log("Product fetch results:", productFetchResults);
        const { fetchedProducts, upsellProductsToShow } = productFetchResults;
        const fetchedProductsData = [];
        fetchedProducts?.forEach((productData) => {
          if (productData) {
            fetchedProductsData.push(productData);
          }
        });

        if (fetchedProductsData.length > 0) {
          this.numProductsToShow = fetchedProductsData.length;
          handleRender(fetchedProductsData, upsellProductsToShow);
        }
      })
      .catch((error) => {
        console.error("Error loading or processing carousel products:", error);
      });

    const handleRender = (fetchedProductsData, upsellProductsToShow) => {
      this.currentUpsellProductsToShow = upsellProductsToShow || [];

      let existingCarousel = container.querySelector(
        ".atlas-upsell-cart-carousel-container"
      );

      if (!existingCarousel) {
        const carouselHtml = `
              <div class="atlas-upsell-cart-carousel-container" style="display: none;">
                <div class="atlas-upsell-cart-carousel-title-container" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-left: 20px; padding-right: 20px;">
                  <div class="atlas-upsell-cart-carousel-title" style="font-size: 18px; font-weight: 600; text-align: left; color: var(--cart_drawer_text_color);">${this._escapeHtml(this.config?.upsell_products_section_title)}</div>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <div class="swiper-button-prev-custom" style="background-color: rgba(255, 255, 255, 0.93); border: 1px solid #e1e3e5; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; color: #000;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                      </svg>
                    </div>
                    <div class="swiper-button-next-custom" style="background-color: rgba(255, 255, 255, 0.93); border: 1px solid #e1e3e5; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; color: #000;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="swiper atlas-upsell-cart-swiper">
                  <div class="swiper-wrapper" id="atlas-upsell-cart-carousel-wrapper">
                    <!-- Carousel items will be dynamically inserted here -->
                  </div>
                </div>
              </div>
            `;
        if (position === "above_items") {
          container.insertAdjacentHTML("afterbegin", carouselHtml);
        } else {
          container.insertAdjacentHTML("beforeend", carouselHtml);
        }
        existingCarousel = container.querySelector(
          ".atlas-upsell-cart-carousel-container"
        );
      }

      const carouselWrapper = existingCarousel.querySelector(
        "#atlas-upsell-cart-carousel-wrapper"
      );
      if (carouselWrapper && carouselWrapper.children.length === 0) {
        // Only render if not already populated
        upsellProductsToShow.forEach((product) => {
          const foundFullProductData = fetchedProductsData.find(
            (p) => p.handle === product.handle
          );
          console.log("foundFullProductData", foundFullProductData);
          const slide = document.createElement("div");
          slide.className = "swiper-slide";
          slide.dataset.productId = this.stringIdToInt(product.product_id);
          slide.dataset.variantId = product.variant_ids?.[0]
            ? this.stringIdToInt(product.variant_ids?.[0])
            : "";
          const hasVariants = !(
            foundFullProductData?.variants?.length === 0 ||
            (foundFullProductData?.variants?.length === 1 &&
              foundFullProductData?.variants?.[0]?.title)
          );

          const variantImageSrc =
            foundFullProductData?.variants?.[0]?.featured_image?.src;
          const featuredImageSrc = foundFullProductData?.featured_image
            ? `https:${foundFullProductData?.featured_image?.replace("https:", "")}`
            : "";
          const imageSrc =
            hasVariants && variantImageSrc ? variantImageSrc : featuredImageSrc;

          const selectedVariantsAsIntIds = product?.variant_ids?.map((id) =>
            this.stringIdToInt(id)
          );
          const variantsToShow = hasVariants
            ? foundFullProductData?.variants?.filter((v) =>
                selectedVariantsAsIntIds.includes(this.stringIdToInt(v.id))
              )
            : [];

          const buttonText =
            this.config?.upsell_products_add_button_text || "Add"; // Default text
          const buttonStyle = this.config?.upsell_products_add_button_style;
          const buttonBgColor = this.config?.upsell_products_add_button_bg_color;
          const buttonTextColor = this.config?.upsell_products_add_button_text_color;

          let price;
          let compareAtPrice;
          if (hasVariants) {
            price = variantsToShow?.[0]?.price;
            compareAtPrice = variantsToShow?.[0]?.compare_at_price;
          } else {
            price = foundFullProductData?.price;
            compareAtPrice = foundFullProductData?.compare_at_price;
          }

          const cartAddIconSvg = `
            <svg width="21" height="23" viewBox="0 0 21 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.46063 14.1064L1.82623 12.0329C2.25833 9.58234 2.47438 8.35704 3.32997 7.63158C4.18556 6.90612 5.41459 6.90612 7.87264 6.90612H12.9429C15.401 6.90612 16.63 6.90612 17.4856 7.63158C18.3412 8.35704 18.5573 9.58234 18.9894 12.0329L19.355 14.1064C19.9529 17.4974 20.2519 19.193 19.3312 20.3065C18.4106 21.4201 16.7099 21.4201 13.3085 21.4201H7.50705C4.10565 21.4201 2.40496 21.4201 1.48434 20.3065C0.563731 19.193 0.862698 17.4974 1.46063 14.1064Z"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="M5.90625 6.90579L6.07423 4.89003C6.26218 2.63474 8.14753 0.9 10.4107 0.9C12.6738 0.9 14.5592 2.63474 14.7471 4.89003L14.9151 6.90579"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="M13.4141 9.90886C13.2839 11.3233 11.9783 12.4113 10.4111 12.4113C8.84389 12.4113 7.5383 11.3233 7.40815 9.90886"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          `;

          const textButtonHtml = `
            <button class="atlas-upsell-cart-slide-add-button swiper-no-swiping" style="background-color: ${buttonBgColor}; color: ${buttonTextColor};">
              <span class="button-text">${this._escapeHtml(buttonText)}</span>
              <span class="atlas-upsell-product-add-spinner"></span>
            </button>
          `;

          const iconButtonHtml = `
            <button class="atlas-upsell-cart-slide-add-button atlas-upsell-cart-slide-add-button-icon swiper-no-swiping" style="background-color: ${buttonBgColor}; color: ${buttonTextColor}; border-radius: 100%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.11); flex-shrink: 0; min-width: 50px;">
              <span class="button-text">${cartAddIconSvg}</span>
              <span class="atlas-upsell-product-add-spinner"></span>
            </button>
          `;

          slide.innerHTML = `
                  <div class="atlas-upsell-cart-slide-content-wrapper">
                    <div class="atlas-upsell-cart-slide-left">
                      <img class="atlas-upsell-cart-slide-image"
                           src="${this._escapeHtml(imageSrc)}"
                           alt="${this._escapeHtml(foundFullProductData.title)}">
                    </div>
                    <div class="atlas-upsell-cart-slide-right">
                      <div class="atlas-upsell-cart-slide-title">${this._escapeHtml(foundFullProductData.title)}</div>
                      <div class="atlas-upsell-cart-slide-price">
                        ${this._getPriceHtml(price, compareAtPrice)}
                      </div>
                      <div class="atlas-upsell-cart-slide-actions">
                        ${hasVariants ? `<select class="atlas-cart-upsell-product-variant-selector">${variantsToShow.map((variant) => `<option value="${variant.id}">${this._escapeHtml(variant.title)}</option>`).join("")}</select>` : ""}
                        ${buttonStyle === "text" || !buttonStyle ? textButtonHtml : ""}
                      </div>
                    </div>
                    ${buttonStyle === "icon" ? iconButtonHtml : ""}
                  </div>
                `;

          const addButton = slide.querySelector(
            ".atlas-upsell-cart-slide-add-button"
          );
          const variantId = hasVariants
            ? variantsToShow?.[0]?.id
            : foundFullProductData?.variants?.[0]?.id;

          if (addButton) {
            if (variantId) {
              addButton.dataset.variantId = variantId;
            } else {
              addButton.disabled = true;
            }
          }
          carouselWrapper.appendChild(slide);
        });

        // Clear previous listeners from carouselWrapper to prevent duplicates if re-rendered
        // A more robust way for full re-renders would be to store the listener and remove it by reference.
        // For simplicity here, we'll re-attach. If this leads to multiple firings, we'd need to refine.
        const newCarouselWrapper = carouselWrapper.cloneNode(true);
        carouselWrapper.parentNode.replaceChild(
          newCarouselWrapper,
          carouselWrapper
        );
        // Now use newCarouselWrapper for attaching the listener

        newCarouselWrapper.addEventListener("click", (event) => {
          let targetButton = event.target;
          // Check if the clicked target is the button itself or a child of the button
          if (
            !targetButton.classList.contains(
              "atlas-upsell-cart-slide-add-button"
            )
          ) {
            targetButton = targetButton.closest(
              ".atlas-upsell-cart-slide-add-button"
            );
          }

          if (targetButton && !targetButton.disabled) {
            const slideElement = targetButton.closest(".swiper-slide");
            let variantIdToAdd;

            if (slideElement) {
              const variantSelector = slideElement.querySelector(
                ".atlas-cart-upsell-product-variant-selector"
              );
              if (variantSelector && variantSelector.value) {
                variantIdToAdd = variantSelector.value;
              } else {
                // Fallback to the button's data-variant-id if no selector or no selection
                variantIdToAdd = targetButton.dataset.variantId;
              }
            } else {
              // Fallback if slideElement couldn't be found, though unlikely with targetButton
              variantIdToAdd = targetButton.dataset.variantId;
            }

            if (variantIdToAdd) {
              console.log(
                "Delegated addButton clicked for variantId:",
                variantIdToAdd
              );
              event.preventDefault();
              event.stopImmediatePropagation();
              this.addCarouselProductToCart(variantIdToAdd, targetButton);
            }
          }
        });

        newCarouselWrapper.addEventListener("change", (event) => {
          const targetSelector = event.target;
          if (
            targetSelector.classList.contains(
              "atlas-cart-upsell-product-variant-selector"
            )
          ) {
            console.log(
              "Delegated variantSelector changed to:",
              targetSelector.value
            ); // For debugging
            const slideElement = targetSelector.closest(".swiper-slide");
            if (slideElement) {
              const selectedVariantId = parseInt(targetSelector.value, 10);
              const addButton = slideElement.querySelector(
                ".atlas-upsell-cart-slide-add-button"
              );
              if (addButton) {
                addButton.dataset.variantId = selectedVariantId;
              }

              const productIdOnSlide = parseInt(
                slideElement.dataset.productId,
                10
              );
              // Ensure this.currentFetchedProductData is populated from the fetch operation
              const productData = this.currentFetchedProductData.find(
                (p) => p.id === productIdOnSlide
              );

              if (productData && productData.variants) {
                const selectedVariant = productData.variants.find(
                  (v) => v.id === selectedVariantId
                );
                console.log("productData", productData);
                console.log("selectedVariant", selectedVariant);
                if (selectedVariant) {
                  // Update image
                  const imageElement = slideElement.querySelector(
                    ".atlas-upsell-cart-slide-image"
                  );
                  if (imageElement) {
                    if (
                      selectedVariant.featured_image &&
                      selectedVariant.featured_image.src
                    ) {
                      imageElement.src = selectedVariant.featured_image.src;
                      imageElement.alt =
                        selectedVariant.featured_image.alt || productData.title;
                    } else if (productData.featured_image) {
                      // Fallback to product's main image if variant has none
                      imageElement.src = productData?.featured_image
                        ? `https:${productData?.featured_image?.replace("https:", "")}`
                        : "";
                      imageElement.alt = productData.title;
                    }
                  }

                  // Update price
                  const priceElement = slideElement.querySelector(
                    ".atlas-upsell-cart-slide-price"
                  );
                  if (priceElement) {
                    priceElement.innerHTML = this._getPriceHtml(
                      selectedVariant.price,
                      selectedVariant.compare_at_price
                    );
                  }
                }
              }
            }
          }
        });
      }

      // Ensure the carousel is displayed
      existingCarousel.style.display = "block";

      const swiperElement = existingCarousel.querySelector(
        ".atlas-upsell-cart-swiper"
      );
      if (swiperElement && typeof Swiper !== "undefined") {
        if (this.swiperInstance) {
          this.swiperInstance.destroy(true, true); // Destroy and clean up
        }
        this.swiperInstance = new Swiper(swiperElement, {
          autoHeight: true,
          slidesPerView: 1,
          slidesPerGroup: 1,
          // centeredSlides: true,
          slideToClickedSlide: false,
          spaceBetween: 10,
          loop: this.numProductsToShow > 1, // Only loop if multiple products
          watchOverflow: true,
          navigation:
            this.numProductsToShow > 1
              ? {
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }
              : false,
        });

        const navNextButton = existingCarousel.querySelector(
          ".swiper-button-next-custom"
        );
        const navPrevButton = existingCarousel.querySelector(
          ".swiper-button-prev-custom"
        );

        if (navNextButton && navPrevButton) {
          if (this.numProductsToShow <= 1) {
            navNextButton.style.display = "none";
            navPrevButton.style.display = "none";
          } else {
            navNextButton.style.display = "flex";
            navPrevButton.style.display = "flex";
          }
        }

        // Minor delay to ensure Swiper updates layout if container visibility changed
        setTimeout(() => {
          if (this.swiperInstance && !this.swiperInstance.destroyed) {
            this.swiperInstance.update();
          }
        }, 50);
      }
    };
  }

  addCarouselProductToCart(variantId, buttonElement) {
    if (!variantId) return;

    const originalButtonText =
      this.config?.upsell_products_add_button_text || "Add"; // Get original text from config

    buttonElement.classList.add("loading"); // New: Add loading class
    buttonElement.disabled = true;

    const slide = buttonElement.closest(".swiper-slide");
    if (slide) {
      slide.style.opacity = "0.6";
      slide.style.pointerEvents = "none"; // Keep this to prevent multiple clicks on the slide area
    }

    fetch(`${this.cartDrawer.localeUrlBase}cart/add.js`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        items: [{ id: variantId, quantity: 1, properties: {
          _upsell_product: true,
        } }],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.description || "Failed to add product");
          });
        }
        return response.json();
      })
      .then((data) => {
        // data here is the response from cart/add.js
        // Fetch updated cart. The original fetch hook will also trigger an update,
        // but fetching explicitly here ensures UI updates promptly based on this action.
        return fetch(`${this.cartDrawer.localeUrlBase}cart.js`).then((res) =>
          res.json()
        );
      })
      .then((cart) => {
        // Write atlas_source cart attribute for attribution tracking
        const existing = cart.attributes?.atlas_source || '';
        const sources = existing ? existing.split(',').map(s => s.trim()) : [];
        if (!sources.includes('cart')) {
          sources.push('cart');
          fetch(`${this.cartDrawer.localeUrlBase}cart/update.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attributes: { atlas_source: sources.join(',') } }),
          }).catch(err => console.warn('Error writing atlas_source attribute:', err));
        }

        this.cartDrawer.updateCartItems(cart); // Update the main cart
        this.cartDrawer.updateHeaderCartIconQuantityBubble(); // Update header bubble

        if (slide) {
          slide.style.opacity = "1";
          slide.style.pointerEvents = "auto";
        }
        buttonElement.classList.remove("loading"); // New: Remove loading class
        setTimeout(() => {
          buttonElement.textContent = originalButtonText;
          buttonElement.disabled = false;
        }, 2000);
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
        if (slide) {
          slide.style.opacity = "1";
          slide.style.pointerEvents = "auto";
        }
        buttonElement.classList.remove("loading"); // New: Remove loading class
        buttonElement.disabled = false; // Re-enable button on error
        setTimeout(() => {
          const buttonTextSpan = buttonElement.querySelector(".button-text");
          if (buttonTextSpan) {
            buttonTextSpan.textContent = originalButtonText;
          }
        }, 3000);
      });
  }

  destroySwiper() {
    if (this.swiperInstance && !this.swiperInstance.destroyed) {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }
  }

  stringIdToInt(stringShopifyId) {
    if (typeof stringShopifyId !== "string") {
      return stringShopifyId;
    }
    return parseInt(stringShopifyId.split("/").pop());
  }
}
