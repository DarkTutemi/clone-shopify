(() => {
  // Atlas Cart Upsells bundle js file
  // API Base URL - will be set during initialization
  let ATLAS_API_BASE_URL = "https://atlas-ai-shopify-app.herokuapp.com";

  let atlasUpsellCartDrawerInstance = null;
  let originalThemeCartOpen = null;
  let originalThemeCartClose = null;
  let themeOverridesActive = false; // Tracks if our overrides are currently active
  let cartApiHooksInstalled = false;
  let cartIconInterceptionInstalled = false;
  let themeDrawerNeutralized = false;

  const formatMoney = function ({ cents, format }) {
    if (typeof cents == "string") {
      cents = cents.replace(".", "");
    }
    var value = "";
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || this.money_format;

    function defaultOption(opt, def) {
      return typeof opt == "undefined" ? def : opt;
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ",");
      decimal = defaultOption(decimal, ".");

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split("."),
        dollars = parts[0].replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g,
          "$1" + thousands
        ),
        cents = parts[1] ? decimal + parts[1] : "";

      return dollars + cents;
    }

    // All 8 money_format placeholders Shopify supports. Markets whose currency
    // uses a space or apostrophe separator (SEK, CHF, PLN, ...) need the lower half.
    switch (formatString.match(placeholderRegex)[1]) {
      case "amount":
        value = formatWithDelimiters(cents, 2);
        break;
      case "amount_no_decimals":
        value = formatWithDelimiters(cents, 0);
        break;
      case "amount_with_comma_separator":
        value = formatWithDelimiters(cents, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        value = formatWithDelimiters(cents, 0, ".", ",");
        break;
      case "amount_with_apostrophe_separator":
        value = formatWithDelimiters(cents, 2, "'", ".");
        break;
      case "amount_no_decimals_with_space_separator":
        value = formatWithDelimiters(cents, 0, " ", ".");
        break;
      case "amount_with_space_separator":
        value = formatWithDelimiters(cents, 2, " ", ",");
        break;
      case "amount_with_period_and_space_separator":
        value = formatWithDelimiters(cents, 2, " ", ".");
        break;
      // An unrecognised token must still render an amount. Falling through
      // used to leave value as "" and emit the bare currency suffix.
      default:
        value = formatWithDelimiters(cents, 2);
        break;
    }

    return formatString.replace(placeholderRegex, value);
  };

  // Every cart, catalog and merchant text value goes through this before it is
  // interpolated into markup. Line item properties come from the store's public
  // /cart/add, so anyone can set them (DEV-626). The merchant editor previews
  // these settings as plain text, so the storefront must too.
  const escapeHtml = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
          char
        ]
    );

  /* #region Cart Drawer html & css */

  const deleteIcon = `<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 3.5H12C12 2.96957 11.7893 2.46086 11.4142 2.08579C11.0391 1.71071 10.5304 1.5 10 1.5C9.46957 1.5 8.96086 1.71071 8.58579 2.08579C8.21071 2.46086 8 2.96957 8 3.5ZM6.5 3.5C6.5 3.04037 6.59053 2.58525 6.76642 2.16061C6.94231 1.73597 7.20012 1.35013 7.52513 1.02513C7.85013 0.700121 8.23597 0.442313 8.66061 0.266422C9.08525 0.0905302 9.54037 0 10 0C10.4596 0 10.9148 0.0905302 11.3394 0.266422C11.764 0.442313 12.1499 0.700121 12.4749 1.02513C12.7999 1.35013 13.0577 1.73597 13.2336 2.16061C13.4095 2.58525 13.5 3.04037 13.5 3.5H19.25C19.4489 3.5 19.6397 3.57902 19.7803 3.71967C19.921 3.86032 20 4.05109 20 4.25C20 4.44891 19.921 4.63968 19.7803 4.78033C19.6397 4.92098 19.4489 5 19.25 5H17.93L16.76 17.111C16.6702 18.039 16.238 18.9002 15.5477 19.5268C14.8573 20.1534 13.9583 20.5004 13.026 20.5H6.974C6.04186 20.5001 5.1431 20.153 4.45295 19.5265C3.7628 18.8999 3.33073 18.0388 3.241 17.111L2.07 5H0.75C0.551088 5 0.360322 4.92098 0.21967 4.78033C0.0790175 4.63968 0 4.44891 0 4.25C0 4.05109 0.0790175 3.86032 0.21967 3.71967C0.360322 3.57902 0.551088 3.5 0.75 3.5H6.5ZM8.5 8.25C8.5 8.05109 8.42098 7.86032 8.28033 7.71967C8.13968 7.57902 7.94891 7.5 7.75 7.5C7.55109 7.5 7.36032 7.57902 7.21967 7.71967C7.07902 7.86032 7 8.05109 7 8.25V15.75C7 15.9489 7.07902 16.1397 7.21967 16.2803C7.36032 16.421 7.55109 16.5 7.75 16.5C7.94891 16.5 8.13968 16.421 8.28033 16.2803C8.42098 16.1397 8.5 15.9489 8.5 15.75V8.25ZM12.25 7.5C12.4489 7.5 12.6397 7.57902 12.7803 7.71967C12.921 7.86032 13 8.05109 13 8.25V15.75C13 15.9489 12.921 16.1397 12.7803 16.2803C12.6397 16.421 12.4489 16.5 12.25 16.5C12.0511 16.5 11.8603 16.421 11.7197 16.2803C11.579 16.1397 11.5 15.9489 11.5 15.75V8.25C11.5 8.05109 11.579 7.86032 11.7197 7.71967C11.8603 7.57902 12.0511 7.5 12.25 7.5ZM4.734 16.967C4.78794 17.5236 5.04724 18.0403 5.46137 18.4161C5.87549 18.792 6.41475 19.0001 6.974 19H13.026C13.5853 19.0001 14.1245 18.792 14.5386 18.4161C14.9528 18.0403 15.2121 17.5236 15.266 16.967L16.424 5H3.576L4.734 16.967Z" fill="currentColor"/>
  </svg>
  `;

  const getCartDrawerStyles = (config) => {
    return `
      #atlas-upsell-cart-drawer-variable-definitions {
        --cart_drawer_background_color: ${config?.cart_drawer_background_color};
        --cart_drawer_accent_color: ${config?.cart_drawer_accent_color};
        --cart_drawer_text_color: ${config?.cart_drawer_text_color};
        --cart_drawer_saving_text_color: ${config?.cart_drawer_saving_text_color};
        --cart_drawer_saving_background_color: ${config?.cart_drawer_saving_background_color || "#F6F6F6"};
        --cart_drawer_saving_background_gradient: ${config?.cart_drawer_saving_background_gradient};
        --cart_drawer_use_saving_background_gradient: ${config?.cart_drawer_use_saving_background_gradient};
        --cart_drawer_button_color: ${config?.cart_drawer_button_color};
        --cart_drawer_button_text_color: ${config?.cart_drawer_button_text_color};
        --cart_drawer_close_button_color: ${config?.cart_drawer_close_button_color};
        --cart_drawer_button_corner_radius: ${config?.cart_drawer_button_corner_radius}px;

        --announcement_size: ${Number.isFinite(config?.announcement_size) ? config.announcement_size : 12}px;
        --announcement_font_size: ${config?.announcement_font_size}px;
        --announcement_background_color: ${config?.announcement_background_color};
        --announcement_border_color: ${config?.announcement_border_color};
        --announcement_text_color: ${config?.announcement_text_color};
        --announcement_use_gradient_background: ${config?.announcement_use_gradient_background};
        --announcement_gradient_background: ${config?.announcement_gradient_background};
        --shipping_protection_heading_color: ${config?.shipping_protection_heading_color};
        --shipping_protection_text_color: ${config?.shipping_protection_text_color};
        --shipping_protection_switch_color: ${config?.shipping_protection_switch_color};

        --cart_drawer_quantity_button_background_color: ${config?.cart_drawer_quantity_button_background_color || "#F6F6F7"};
        --cart_drawer_quantity_text_background_color: ${config?.cart_drawer_quantity_text_background_color || "#FFFFFF"};
        --cart_drawer_discount_tag_background_color: ${config?.cart_drawer_discount_tag_background_color || "#F3F3F3"};
        --cart_drawer_discount_tag_text_color: ${config?.cart_drawer_discount_tag_text_color || "#000000"};
        --cart_drawer_discount_icon_tag_color: ${config?.cart_drawer_discount_icon_tag_color || "#000000"};
        --cart_drawer_variant_text_color: ${config?.cart_drawer_variant_text_color || "#6D7175"};
        --cart_drawer_compare_at_price_color: ${config?.cart_drawer_compare_at_price_color || "#6D7175"};

        --upsell_products_section_bg_color: ${config?.upsell_products_section_bg_color || "#FFFFFF"};
        --upsell_products_carousel_card_bg_color: ${config?.upsell_products_carousel_card_bg_color || "#a7a7a7"};
        --upsell_products_add_button_bg_color: ${config?.upsell_products_add_button_bg_color || "#000000"};
        --upsell_products_add_button_text_color: ${config?.upsell_products_add_button_text_color || "#FFFFFF"};

        --discount_code_input_background_color: ${config?.discount_code_input_background_color || "#FFFFFF"};
        --discount_code_button_background_color: ${config?.discount_code_button_background_color || "#000000"};
        --discount_code_input_text_color: ${config?.discount_code_input_text_color || "#000000"};
        --discount_code_button_text_color: ${config?.discount_code_button_text_color || "#FFFFFF"};
        --discount_code_success_message_color: ${config?.discount_code_success_message_color || "#059669"};
        --discount_code_success_background_color: ${config?.discount_code_success_background_color || "#F3F4F6"};
        --discount_code_error_message_color: ${config?.discount_code_error_message_color || "#DC2626"};
      }

      @keyframes atlas-skeleton-pulse {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      @media (prefers-reduced-motion: reduce) {
        .atlas-cart-loading-skeleton * {
          animation: none !important;
        }
      }

      .atlas-sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;
  };

  // Helper function to render title text with {qty} wrapped in a gray circle
  const renderTitleWithQuantityBadge = (text, qty) => {
    if (!text) return "";
    // Remove parentheses around {qty} placeholder (e.g., "({qty})" becomes "{qty}")
    const cleanedText = escapeHtml(text).replace(/\(({qty})\)/g, "{qty}");
    const parts = cleanedText.split("{qty}");
    if (parts.length === 1) return cleanedText;

    let result = "";
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) {
        result += parts[i];
      }
      if (i < parts.length - 1) {
        result += `<span style="display: inline-flex; align-items: center; justify-content: center; background-color: rgba(21,21,21,0.1); border-radius: 50%; width: 32px; height: 32px; padding: 0; font-size: 16px; font-weight: 600; margin-left: 4px; margin-right: 4px; vertical-align: middle; line-height: 1; aspect-ratio: 1;">${qty}</span>`;
      }
    }
    return result;
  };

  const getCartDrawerInnerHtmlForReact = (config) => {
    // console.log(config);

    let processedAnnouncementText = escapeHtml(config.announcement_text);

    if (config.announcement_text?.includes("{TIMER}")) {
      let initialTimerStr = "{TIMER}"; // Default fallback
      // Use parseInt for minutes and seconds here for robust initial display
      const parsedMinutes = parseInt(config.announcement_timer_minutes, 10);
      const parsedSeconds = parseInt(config.announcement_timer_seconds, 10);
      // Use Number.isNaN for a stricter check after parsing
      if (
        !Number.isNaN(parsedMinutes) &&
        !Number.isNaN(parsedSeconds) &&
        parsedMinutes >= 0 &&
        parsedSeconds >= 0 &&
        parsedMinutes <= 99 && // Added a reasonable upper limit for minutes
        parsedSeconds < 60
      ) {
        initialTimerStr = `${String(parsedMinutes).padStart(2, "0")}:${String(parsedSeconds).padStart(2, "0")}`;
      }
      processedAnnouncementText = processedAnnouncementText.replace(
        "{TIMER}",
        ` <span id="atlas-announcement-timer-value">${initialTimerStr}</span>`
      );
    }

    const announcementBackgroundStyle =
      config.announcement_use_gradient_background
        ? `background: var(--announcement_gradient_background);`
        : `background-color: var(--announcement_background_color); border-top: 1px solid var(--announcement_border_color); border-bottom: 1px solid var(--announcement_border_color);`;

    const announcementHtml = `
   ${
     config.announcement_enabled
       ? `
        <div class="atlas-upsell-cart-announcement" style="${announcementBackgroundStyle}">
          ${processedAnnouncementText}
        </div>`
       : ""
   }
  `;

    const iconType = config.shipping_protection_icon_type ?? "1";
    const iconImageUrl =
      iconType === "1"
        ? "https://app.helloatlas.io/shield.png"
        : "https://app.helloatlas.io/shipment-with-padlock.webp";

    const shippingProtectionHtml = `
   ${
     config.shipping_protection_enabled
       ? `
        <div class="atlas-upsell-cart-shipping-protection-container" style="display: none;">
          <div
            style="
              display: flex;
              padding-bottom: 20px;
              background-color: #F9F9F9;
              flex-direction: column;
              width: 100%;
              background-color: transparent;
            "
          >
            <div style="display: flex; align-items: flex-start; gap: 12px;">
              <div
                style="
                  width: 44px;
                  height: 44px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                "
              >
                <img
                  id="atlas-upsell-cart-shipping-protection-image"
                  src="${iconImageUrl}"
                  alt="Shipping Protection"
                  style="width: 44px; height: 44px; object-fit: contain"
                />
              </div>
              <div style="flex: 1 1 0%">
                <span style="font-weight: 500; font-size: 15px; color: var(--shipping_protection_heading_color);">
                  ${escapeHtml(config.shipping_protection_title)}
                </span>
                <div style="font-size: 13px; color: var(--shipping_protection_text_color); max-width: 220px">
                  ${escapeHtml(config.shipping_protection_description)}
                </div>
              </div>
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: flex-end;
                  justify-content: center;
                  height: 100%;
                "
              >
                <span id="atlas-upsell-cart-shipping-protection-price" style="font-weight: 500; font-size: 14px; color: var(--shipping_protection_heading_color);"></span>
                <div style="margin-top: 8px; position: relative;">
                  <label
                    style="
                      display: inline-block;
                      width: 46px;
                      height: 26px;
                      position: relative;
                      vertical-align: middle;
                    "
                    >
                    <input
                      id="atlas-upsell-cart-shipping-protection-switch"
                      type="checkbox"
                      style="opacity: 0; width: 0px; height: 0px"
                    />
                    <span>
                      <span></span>
                    </span>
                  </label>
                  <div
                    class="atlas-upsell-cart-shipping-protection-switch-loading-spinner"
                    style="
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      display: none;
                      pointer-events: none;
                    "
                  >
                    <div
                      style="
                          width: 13px;
                          height: 13px;
                          border: 1.8px solid #ffffff;
                          border-top: 1.8px solid transparent;
                          border-radius: 50%;
                          animation: atlas-cart-upsell-loading-spinner-spin 1.5s linear infinite;
                      "
                    >&nbsp;</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        `
       : ""
   }
  `;

    const getSubtotalLineHtml = () => {
      if (config.cart_drawer_enable_subtotal_line) {
        return `
          <div id="atlas-upsell-cart-free-shipping-line" style="
            display: none;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 5px;
            font-size: 15.5px;
          ">
            <div>${escapeHtml(config.cart_drawer_free_shipping_label_text || "Shipping")}</div>
            <div style="font-weight: 600;">${escapeHtml(config.cart_drawer_free_shipping_value_text || "FREE")}</div>
          </div>
          <div style="
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: center;
            padding-bottom: 16px;
            font-size: ${config?.cart_drawer_subtotal_size ? config?.cart_drawer_subtotal_size : 15.5}px;
            font-weight: 600;
          ">
            <div>${escapeHtml(config.cart_drawer_subtotal_text)}</div>
            <div id="atlas-upsell-cart-subtotal-line-price-span">$0.00</div>
          </div>
          <div id="atlas-upsell-cart-order-discount-container" style="display: none;">
            <span id="atlas-upsell-cart-order-discount-amount-span"></span>
            <!-- Order-level discount will be dynamically inserted here -->
          </div>
      `;
      }
      return "";
    };

    const getDiscountCodeSectionHtml = () => {
      if (config.discount_codes_enabled) {
        return `
          <div class="atlas-discount-code-section" style="padding-bottom: 16px;">
            <div class="atlas-discount-code-input-wrapper" style="display: flex; gap: 8px; align-items: stretch;">
              <input
                type="text"
                id="atlas-discount-code-input"
                class="atlas-discount-code-input"
                placeholder="${config.discount_code_input_placeholder || "Discount code"}"
                style="
                  flex: 1;
                  padding: 12px 14px;
                  border: 1px solid #D1D5DB;
                  border-radius: 4px;
                  font-size: 14px;
                  background-color: var(--discount_code_input_background_color);
                  color: var(--discount_code_input_text_color);
                  outline: none;
                  transition: border-color 0.2s;
                "
              />
              <button
                id="atlas-discount-code-apply-btn"
                class="atlas-discount-code-apply-btn"
                style="
                  padding: 12px 20px;
                  border: none;
                  border-radius: 4px;
                  font-size: 14px;
                  font-weight: 500;
                  background-color: var(--discount_code_button_background_color);
                  color: var(--discount_code_button_text_color);
                  cursor: pointer;
                  white-space: nowrap;
                  transition: opacity 0.2s;
                  min-width: 80px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <span class="atlas-discount-btn-text">${escapeHtml(config.discount_code_apply_button_text || "Apply")}</span>
                <div class="atlas-discount-btn-spinner" style="display: none; width: 16px; height: 16px; border: 2px solid var(--discount_code_button_text_color); border-top-color: transparent; border-radius: 50%; animation: atlas-spin 0.6s linear infinite;"></div>
              </button>
            </div>
            <div id="atlas-discount-code-message" class="atlas-discount-code-message" style="margin-top: 8px; font-size: 13px; display: none;"></div>
            <div id="atlas-discount-code-applied" class="atlas-discount-code-applied" style="margin-top: 8px; display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background-color: var(--discount_code_success_background_color); border: 1px solid #E5E7EB; border-radius: 6px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3334 7.33333V4C13.3334 3.64638 13.1929 3.30724 12.9429 3.05719C12.6928 2.80714 12.3537 2.66667 12.0001 2.66667H4.00008C3.64646 2.66667 3.30732 2.80714 3.05727 3.05719C2.80722 3.30724 2.66675 3.64638 2.66675 4V12C2.66675 12.3536 2.80722 12.6928 3.05727 12.9428C3.30732 13.1929 3.64646 13.3333 4.00008 13.3333H7.33341" stroke="var(--discount_code_success_message_color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 9.33333L11.3333 10.6667L14 8" stroke="var(--discount_code_success_message_color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span id="atlas-discount-code-name" style="font-weight: 500; color: var(--discount_code_success_message_color); font-size: 14px;"></span>
                </div>
                <button
                  id="atlas-discount-code-remove-btn"
                  style="background: none; border: none; color: #6B7280; cursor: pointer; font-size: 13px; padding: 4px; text-decoration: none; display: flex; align-items: center; justify-content: center;"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div id="atlas-discount-amount-line" style="display: none; justify-content: space-between; align-items: center; padding-bottom: 8px; font-size: 14px; color: var(--discount_code_success_message_color);">
              <div id="atlas-discount-amount-label">Discount</div>
              <div id="atlas-discount-amount-value">-$0.00</div>
            </div>
          </div>
        `;
      }
      return "";
    };

    const emptyCartHtml = `
    <div id="atlas-upsell-cart-empty-cart-container" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px;">
      <div style="padding: 20px; text-align: center;">${escapeHtml(config.cart_drawer_empty_message_text)}</div>
      <button id="atlas-upsell-cart-continue-shopping-button" class="atlas-checkout-button-styles">${escapeHtml(config.cart_drawer_empty_button_text)}</button>
    </div>
  `;

    // Payment icons HTML
    const paymentIconsHtml = () => {
      if (
        config.cart_drawer_payment_icons_enabled &&
        config.cart_drawer_selected_payment_icons
      ) {
        let selectedIcons = config.cart_drawer_selected_payment_icons;
        if (typeof selectedIcons === "string") {
          selectedIcons = selectedIcons
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        } else if (!Array.isArray(selectedIcons)) {
          selectedIcons = [];
        }

        const paymentIconMap = window.atlasCartUpsellsPaymentIcons || {};
        if (selectedIcons.length > 0) {
          return `<div class="atlas-cart-payment-icons-container" style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 16px;">
            ${selectedIcons
              .map((iconId) => {
                const icon = paymentIconMap[iconId];
                if (!icon) return "";
                return `<img src="${icon.url}" alt="${icon.label}" title="${icon.label}" style="width: 40px; height: 28px; object-fit: contain;" />`;
              })
              .join("")}
          </div>`;
        }
      }

      return "";
    };

    const notEmptyCartHtml = `
      <div id="atlas-upsell-cart-not-empty-cart-container" style="display: flex; flex-direction: column; position: absolute; top: 0px; bottom: 0px; right: 0px; left: 0px;">
          <div class="atlas-upsell-cart-header" style="${config.announcement_enabled && (!config.announcement_position || config.announcement_position === "above_items") ? "border-bottom: none;" : "border-bottom: 1px solid rgba(0, 0, 0, 0.1);"}">
            <h2 class="atlas-upsell-cart-drawer-header-h2">${renderTitleWithQuantityBadge(config.cart_drawer_title_text, "0")}</h2>
            <button class="atlas-upsell-cart-close">&times;</button>
          </div>

          ${config.announcement_enabled && (!config.announcement_position || config.announcement_position === "above_items") ? announcementHtml : ""}

          <div class="atlas-upsell-cart-progress-reward-container" style="display: none;"></div>

          <div class="atlas-upsell-cart-items-container">&nbsp;</div>

          ${config.announcement_enabled && config.announcement_position === "below_items" ? announcementHtml : ""}

          <div class="atlas-upsell-cart-footer">
            ${shippingProtectionHtml}
            ${getDiscountCodeSectionHtml()}
            ${getSubtotalLineHtml()}
            <a id="atlas-upsell-cart-checkout-button-anchor" href="/checkout" style="text-decoration: none; color: inherit;">
              <button id="atlas-upsell-cart-checkout-button" class="atlas-checkout-button-styles">
                <span id="atlas-upsell-cart-checkout-button-text-span" style="visibility: visible;">
                ${escapeHtml(config.cart_drawer_checkout_button_text).replaceAll("{total}", `<span class="atlas-upsell-cart-subtotal-amount-span"> $0.00</span>`)}
                </span>

                <div class="atlas-upsell-cart-checkout-button-loading-container" style="display: none;">
                  <div class="atlas-upsell-cart-checkout-button-spinner">&nbsp;</div>
                </div>
              </button>
            </a>
            ${paymentIconsHtml()}
          </div>
        </div>
    `;

    return `
      ${emptyCartHtml}
      ${notEmptyCartHtml}
    `;
  };

  const getCartDrawerHtml = (config) => {
    return `
    <div id="atlas-upsell-cart-drawer-variable-definitions">
      <div id="atlas-upsell-cart-drawer-main-container">
        <div class="atlas-upsell-cart-drawer-overlay">&nbsp;</div>

        <div class="atlas-upsell-cart-drawer-content">
          ${getCartDrawerInnerHtmlForReact(config)}
        </div>

      </div>
    </div>
  `;
  };
  /* #endregion */

  class AtlasUpsellCartDrawer {
    //

    /* #region - Constructor & Initial Setup Functions - */
    constructor(config, baseUrl) {
      this.config = config;
      // Default to text style when unset to avoid null-driven regressions
      this.config.upsell_products_add_button_style =
        this.config?.upsell_products_add_button_style || "text";
      this.baseUrl = baseUrl || "https://app.helloatlas.io";
      this.localeUrlBase = window?.Shopify?.routes?.root || "/"; // for testing
      this.moneyFormat = window?.atlasCartUpsellsMoneyFormat || "${{amount}}";

      this.cart = { items: [] };
      this.deleteCartItemLoadingKeys = new Set();
      this.quantityPlusLoadingKeys = new Set();
      this.quantityMinusLoadingKeys = new Set();
      this.shippingProtectionSwitchLoading = false;
      this.isAdjustingProgressiveGifts = false; // Prevent infinite loops
      this.isBxgyConverting = false; // Prevent debounced cart updates during BXGY conversion
      this.isWaitingForCartData = false; // Prevent skeleton from being hidden prematurely
      this.cartLoaded = false; // Flips true after the first updateCartItems; distinguishes "not fetched yet" from "fetched and empty"
      window.__atlas_cart_drawer_handles_bxgy = true; // Let bundle.js interceptor know the drawer handles BXGY cleanup

      // Subscription upgrades
      this.sellingPlansByProduct = {}; // Store selling plans by product ID
      this.sellingPlansLoading = false;

      this.drawer = this.injectCartDrawerHtmlIntoBody();
      if (
        this.config.upsell_products_enabled &&
        typeof UpsellProductsCarouselHandler !== "undefined"
      ) {
        this.carouselHandler = new UpsellProductsCarouselHandler(
          this,
          formatMoney,
          this.config
        );
        this.carouselHandler.loadSwiperLibrary();
      }
      this.setupEventListeners();
      this.fetchInitialCartItems();
      this.fetchShippingProtectionImage();
      this.setCartAttribute(true);

      // Reset checkout button loading state when user navigates back (bfcache).
      // Registered here (not in setupEventListeners) so it runs exactly once per instance.
      window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
          this.resetCheckoutButtonLoading();
        }
      });

      console.log("this.config");
      console.log(this.config);
    }

    updateConfigAndRefreshUI(config) {
      // should only be called if an instance of AtlasUpsellCartDrawer already exists.
      // console.log("updateConfigAndRefreshUI");
      this.config = config;
      this.config.upsell_products_add_button_style =
        this.config?.upsell_products_add_button_style || "text";
      const wasOpen = this.drawer && this.drawer.classList.contains("is-open");

      // update html/css:
      // Add styles if not already added
      const styleTag = document.getElementById("atlas-upsell-cart-styles");
      if (styleTag) {
        const newStyles = getCartDrawerStyles(config);
        styleTag.textContent = newStyles;
      }

      // Update inner content instead of removing the whole drawer
      const contentArea = this.drawer
        ? this.drawer.querySelector(".atlas-upsell-cart-drawer-content")
        : null;
      if (contentArea) {
        contentArea.innerHTML = getCartDrawerInnerHtmlForReact(this.config);
      } else {
        // If the content area isn't found, we log an error.
        // A full rebuild (which would close it) is avoided to stick to the minimal change for "keep open".
        console.error(
          ".atlas-upsell-cart-drawer-content not found. Cart content will not update."
        );
      }

      // If it was open, ensure it remains visually open, for case when user has cart open when config gets updated
      if (wasOpen && this.drawer) {
        this.drawer.classList.add("is-open");
        document.body.classList.add("atlas-no-scroll-for-cart-drawer");
      }
      // this.drawer itself is not reassigned as its main element isn't being replaced.

      this.setupEventListeners(); // Re-bind event listeners to the new inner DOM
      this.fetchInitialCartItems();
      this.fetchShippingProtectionImage();

      // Reinitialize Swiper via CarouselHandler
      if (this.carouselHandler) {
        // Check if carouselHandler exists before trying to use it
        if (this.config.upsell_products_enabled) {
          this.carouselHandler.destroySwiper();
          this.carouselHandler.loadSwiperLibrary();
        } else {
          this.carouselHandler.destroySwiper(); // Destroy if it exists but is no longer enabled
        }
      } else if (
        this.config.upsell_products_enabled &&
        typeof UpsellProductsCarouselHandler !== "undefined"
      ) {
        // If it didn't exist but is now enabled, initialize it
        this.carouselHandler = new UpsellProductsCarouselHandler(
          this,
          formatMoney,
          this.config
        );
        this.carouselHandler.loadSwiperLibrary();
      }
    }

    setupEventListeners() {
      // Event listeners
      document
        .querySelector(".atlas-upsell-cart-drawer-overlay")
        .addEventListener("click", this.close.bind(this));

      document
        .querySelector(".atlas-upsell-cart-close")
        .addEventListener("click", this.close.bind(this));

      document.addEventListener("keyup", (evt) => {
        if (evt.code === "Escape") this.close();
      });

      document
        .querySelector("#atlas-upsell-cart-checkout-button")
        ?.addEventListener("click", (e) => {
          e.preventDefault(); // Prevent anchor tag default behavior
          // The cart carries its own discount codes, so checkout inherits them.
          window.location.href = "/checkout";
          this.setCheckoutButtonLoading();
        });

      document
        .querySelector("#atlas-upsell-cart-checkout-button-anchor")
        ?.addEventListener("click", (e) => {
          e.preventDefault(); // Prevent default anchor navigation
          this.setCheckoutButtonLoading();
        });

      // continue shopping button (empty cart state):
      document
        .querySelector("#atlas-upsell-cart-continue-shopping-button")
        .addEventListener("click", this.close.bind(this));

      // shipping protection toggle switch:
      if (
        this?.config?.shipping_protection_enabled &&
        this.config.shipping_protection_product_variant_id
      ) {
        this.drawer
          .querySelector("#atlas-upsell-cart-shipping-protection-switch")
          .addEventListener("click", (evt) => {
            // console.log("Checkbox clicked event:", evt);
            evt.preventDefault();
            const newCheckedState = evt.target.checked;
            // console.log(this.cart);

            const alreadyInCart = this.cart.items.some(
              (item) =>
                item.id ===
                parseInt(
                  this.config.shipping_protection_product_variant_id.replace(
                    "gid://shopify/ProductVariant/",
                    ""
                  )
                )
            );
            // console.log("alreadyInCart", alreadyInCart);

            if (
              newCheckedState &&
              !alreadyInCart &&
              !this.shippingProtectionSwitchLoading
            ) {
              // add shipping protection product to cart
              // console.log("Should add shipping protection");

              this.shippingProtectionSwitchLoading = true;
              let addFailed = false;
              const loadingSpinner = document.querySelector(
                ".atlas-upsell-cart-shipping-protection-switch-loading-spinner"
              );
              loadingSpinner.style.display = "block";
              loadingSpinner.style.transform = "translate(25%, -50%)"; // when toggle is off.

              fetch(`${this.localeUrlBase}cart/add.js`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({
                  items: [
                    {
                      id: this.config.shipping_protection_product_variant_id.replace(
                        "gid://shopify/ProductVariant/",
                        ""
                      ),
                      quantity: 1,
                      properties: {
                        _shipping_protection: true,
                        _bundle_product_id: "shipping_protection",
                      },
                    },
                  ],
                }),
              })
                .then(async (res) => {
                  if (!res.ok) {
                    addFailed = true;
                    const errorData = await res.json().catch(() => ({}));
                    console.error("Failed to add shipping protection:", errorData.message || res.statusText);
                    return;
                  }

                  // Fetch updated cart and re-render
                  const cart = await fetch(`${this.localeUrlBase}cart.js`).then((r) => r.json());
                  this.updateCartItems(cart);

                  // Write atlas_source cart attribute for attribution tracking
                  const existing = cart.attributes?.atlas_source || '';
                  const sources = existing ? existing.split(',').map((s) => s.trim()) : [];
                  if (!sources.includes('cart')) {
                    sources.push('cart');
                    fetch(`${this.localeUrlBase}cart/update.js`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ attributes: { atlas_source: sources.join(',') } }),
                    }).catch((err) => console.warn('Error writing atlas_source attribute:', err));
                  }
                })
                .finally(() => {
                  this.shippingProtectionSwitchLoading = false;
                  loadingSpinner.style.display = "none";
                  document.querySelector(
                    "#atlas-upsell-cart-shipping-protection-switch"
                  ).checked = addFailed ? false : newCheckedState;
                });
            } else if (
              !newCheckedState &&
              alreadyInCart &&
              !this.shippingProtectionSwitchLoading
            ) {
              // remove shipping protection product from cart
              this.shippingProtectionSwitchLoading = true;
              let removeFailed = false;

              const loadingSpinner = document.querySelector(
                ".atlas-upsell-cart-shipping-protection-switch-loading-spinner"
              );
              loadingSpinner.style.display = "block";
              loadingSpinner.style.transform = "translate(-125%, -50%)"; // when toggle is on.

              fetch(`${this.localeUrlBase}cart/change.js`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({
                  id: this.config.shipping_protection_product_variant_id.replace(
                    "gid://shopify/ProductVariant/",
                    ""
                  ),
                  quantity: 0,
                }),
              })
                .then(async (res) => {
                  if (!res.ok) {
                    removeFailed = true;
                    const errorData = await res.json().catch(() => ({}));
                    console.error("Failed to remove shipping protection:", errorData.message || res.statusText);
                    return;
                  }

                  // Fetch updated cart and re-render
                  const cart = await fetch(`${this.localeUrlBase}cart.js`).then(
                    (r) => r.json()
                  );
                  this.updateCartItems(cart);
                })
                .finally(() => {
                  this.shippingProtectionSwitchLoading = false;
                  loadingSpinner.style.display = "none";
                  document.querySelector(
                    "#atlas-upsell-cart-shipping-protection-switch"
                  ).checked = removeFailed ? true : newCheckedState;
                });
            }
          });
      }

      // Discount code event listeners
      if (this?.config?.discount_codes_enabled) {
        const applyBtn = document.querySelector(
          "#atlas-discount-code-apply-btn"
        );
        const input = document.querySelector("#atlas-discount-code-input");
        const removeBtn = document.querySelector(
          "#atlas-discount-code-remove-btn"
        );

        if (applyBtn && input) {
          // Apply button click
          applyBtn.addEventListener("click", () => {
            const code = input.value.trim();
            if (code) {
              this.applyDiscountCode(code);
            }
          });

          // Enter key on input
          input.addEventListener("keypress", (evt) => {
            if (evt.key === "Enter") {
              const code = input.value.trim();
              if (code) {
                this.applyDiscountCode(code);
              }
            }
          });
        }

        if (removeBtn) {
          removeBtn.addEventListener("click", () => {
            this.removeDiscountCode();
          });
        }
      }
    }

    setCheckoutButtonLoading() {
      const checkoutButtonTextSpan = document.querySelector(
        "#atlas-upsell-cart-checkout-button-text-span"
      );
      if (checkoutButtonTextSpan && checkoutButtonTextSpan.style) {
        checkoutButtonTextSpan.style.visibility = "hidden";
      }

      const checkoutButtonLoadingSpinnerContainer = document.querySelector(
        ".atlas-upsell-cart-checkout-button-loading-container"
      );
      if (
        checkoutButtonLoadingSpinnerContainer &&
        checkoutButtonLoadingSpinnerContainer.style
      ) {
        checkoutButtonLoadingSpinnerContainer.style.display = "block";
      }
    }

    resetCheckoutButtonLoading() {
      const checkoutButtonTextSpan = document.querySelector(
        "#atlas-upsell-cart-checkout-button-text-span"
      );
      if (checkoutButtonTextSpan && checkoutButtonTextSpan.style) {
        checkoutButtonTextSpan.style.visibility = "visible";
      }

      const checkoutButtonLoadingSpinnerContainer = document.querySelector(
        ".atlas-upsell-cart-checkout-button-loading-container"
      );
      if (
        checkoutButtonLoadingSpinnerContainer &&
        checkoutButtonLoadingSpinnerContainer.style
      ) {
        checkoutButtonLoadingSpinnerContainer.style.display = "none";
      }
    }

    // Discount code methods
    setDiscountButtonLoading(isLoading) {
      const applyBtn = document.querySelector("#atlas-discount-code-apply-btn");
      const btnText = applyBtn?.querySelector(".atlas-discount-btn-text");
      const btnSpinner = applyBtn?.querySelector(".atlas-discount-btn-spinner");

      if (applyBtn && btnText && btnSpinner) {
        if (isLoading) {
          btnText.style.display = "none";
          btnSpinner.style.display = "block";
          applyBtn.disabled = true;
        } else {
          btnText.style.display = "block";
          btnSpinner.style.display = "none";
          applyBtn.disabled = false;
        }
      }
    }

    showDiscountMessage(message, isError = false) {
      const messageEl = document.querySelector("#atlas-discount-code-message");
      if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = isError
          ? "atlas-discount-code-message error"
          : "atlas-discount-code-message success";
        messageEl.style.display = "block";

        // Hide after 5 seconds
        setTimeout(() => {
          messageEl.style.display = "none";
        }, 5000);
      }
    }

    updateDiscountUI(cart) {
      const input = document.querySelector("#atlas-discount-code-input");
      const inputWrapper = document.querySelector(
        "#atlas-discount-code-input"
      ).parentElement;
      const appliedContainer = document.querySelector(
        "#atlas-discount-code-applied"
      );
      const discountCodeName = document.querySelector(
        "#atlas-discount-code-name"
      );
      const discountAmountLine = document.querySelector(
        "#atlas-discount-amount-line"
      );
      const discountAmountLabel = document.querySelector(
        "#atlas-discount-amount-label"
      );
      const discountAmountValue = document.querySelector(
        "#atlas-discount-amount-value"
      );

      // Shopify's own record is the only source of truth for what is applied.
      // Reading our cart attribute instead made link-applied codes look unapplied.
      const appliedDiscount = (cart.discount_codes || []).find(
        (d) => d.applicable
      );
      const discountCode = appliedDiscount?.code;

      if (
        discountCode &&
        discountCodeName &&
        appliedContainer &&
        inputWrapper
      ) {
        // Show applied state
        discountCodeName.textContent = discountCode;
        inputWrapper.style.display = "none";
        appliedContainer.style.display = "block";

        if (discountAmountLine && discountAmountLabel && discountAmountValue) {
          // total_discount counts line-level allocations, which is where
          // product-scoped discounts land. The cart-level applications list is
          // empty for those, and looking only there is what used to send this
          // off to the estimator.
          const discountAmount = cart.total_discount || 0;

          if (discountAmount > 0) {
            // The chip directly above already names the code, so this line says
            // what the shopper actually cares about rather than repeating it.
            discountAmountLabel.textContent = "You saved";
            discountAmountValue.style.fontSize = "14px";
            discountAmountValue.innerHTML = formatMoney({
              cents: discountAmount,
              format: this.moneyFormat,
            });
          } else {
            // Free-shipping codes take nothing off the cart itself.
            discountAmountLabel.textContent = "Discount";
            discountAmountValue.style.fontSize = "13px";
            discountAmountValue.textContent = "Applied at checkout";
          }

          discountAmountLine.style.display = "flex";
        }
      } else if (inputWrapper && appliedContainer) {
        // A pre-deploy cart may still hold its code in an attribute; apply it for real.
        this.migrateLegacyDiscountAttribute(cart);

        // Show input state
        inputWrapper.style.display = "flex";
        appliedContainer.style.display = "none";
        if (input) {
          input.value = "";
        }
        // Hide discount amount line
        if (discountAmountLine) {
          discountAmountLine.style.display = "none";
        }
      }
    }

    // Shopify owns the discount code set. Posting a value replaces the whole set;
    // an empty string clears it. Returns the updated cart.
    async setCartDiscounts(discount) {
      const response = await fetch(`${this.localeUrlBase}cart/update.js`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ discount }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart discounts");
      }

      return response.json();
    }

    // Carts predating real discount application carry the code in a cart attribute
    // and used to receive it through ?discount= at checkout. Apply it for real once
    // so those shoppers keep their discount, then drop the attribute. Fire and
    // forget: the caller renders the input state immediately and the re-render
    // below corrects it if the code still applies.
    migrateLegacyDiscountAttribute(cart) {
      const legacyCode = cart.attributes?.discount_code;

      if (
        !legacyCode ||
        this.hasMigratedLegacyDiscount ||
        !this.config?.discount_codes_enabled
      ) {
        return;
      }

      // Once per page load - updateDiscountUI runs on every cart render.
      this.hasMigratedLegacyDiscount = true;

      (async () => {
        try {
          await this.setCartDiscounts(legacyCode);
          const cleared = await this.clearLegacyDiscountAttribute();
          this.updateCartItems(cleared);
        } catch (error) {
          console.error("Error migrating legacy discount attribute:", error);
        }
      })();
    }

    async clearLegacyDiscountAttribute() {
      const response = await fetch(`${this.localeUrlBase}cart/update.js`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ attributes: { discount_code: "" } }),
      });

      if (!response.ok) {
        throw new Error("Failed to clear legacy discount attribute");
      }

      return response.json();
    }

    // Shopify answers 200 with applicable:false and no reason attached, so ask the
    // backend which rule the code fell foul of - expired, not yet active, usage
    // limit reached, or unknown.
    async discountRejectionReason(code) {
      const generic = "This code can't be applied to your cart";

      try {
        const response = await fetch(
          `${this.baseUrl}/api/validate_discount_code`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ code: code, shop: window.Shopify?.shop }),
          }
        );

        const result = await response.json();

        // A code the backend calls valid was still refused, so the reason is
        // cart-specific - most often a code that cannot combine with an
        // automatic bundle or upsell discount.
        return result.valid ? generic : result.message || generic;
      } catch (error) {
        console.error("Error fetching discount rejection reason:", error);
        return generic;
      }
    }

    async applyDiscountCode(code) {
      const trimmed = (code || "").trim();

      if (trimmed === "") {
        this.showDiscountMessage("Please enter a discount code", true);
        return;
      }

      this.setDiscountButtonLoading(true);

      // Shopify replaces the entire code set on every update, so submitting a bad
      // code would silently destroy a working one. Snapshot and restore on failure.
      const previousCodes = (this.cart?.discount_codes || [])
        .filter((d) => d.applicable)
        .map((d) => d.code);

      try {
        const cart = await this.setCartDiscounts(trimmed);

        // Shopify echoes the merchant's canonical casing, so compare loosely.
        const applied = (cart.discount_codes || []).find(
          (d) => d.applicable && d.code.toLowerCase() === trimmed.toLowerCase()
        );

        if (applied) {
          // updateCartItems sets this.cart and re-renders the discount UI itself.
          // The chip and the savings line are the confirmation, so a toast on top
          // of them only says the same thing again and then disappears.
          this.updateCartItems(cart);
          return;
        }

        // Put the previous codes back first, so the cart never sits holding a
        // rejected code while we go and ask what was wrong with it.
        const restored = await this.setCartDiscounts(previousCodes.join(","));
        this.updateCartItems(restored);
        this.showDiscountMessage(await this.discountRejectionReason(trimmed), true);
      } catch (error) {
        console.error("Error applying discount code:", error);
        this.showDiscountMessage(
          "Failed to apply discount code. Please try again.",
          true
        );
      } finally {
        this.setDiscountButtonLoading(false);
      }
    }

    async removeDiscountCode() {
      this.setDiscountButtonLoading(true);

      try {
        const cart = await this.setCartDiscounts("");
        this.updateCartItems(cart);
        this.showDiscountMessage("Discount code removed", false);
      } catch (error) {
        console.error("Error removing discount code:", error);
        this.showDiscountMessage(
          "Failed to remove discount code. Please try again.",
          true
        );
      } finally {
        this.setDiscountButtonLoading(false);
      }
    }

    injectCartDrawerHtmlIntoBody() {
      // Add styles if not already added
      if (!document.querySelector("#atlas-upsell-cart-styles")) {
        const styles = getCartDrawerStyles(this.config);
        const styleSheet = document.createElement("style");
        styleSheet.id = "atlas-upsell-cart-styles";
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
      }
      const drawerHTML = getCartDrawerHtml(this.config);
      // Insert drawer HTML into document if it doesn't exist
      let drawer = document.getElementById(
        "atlas-upsell-cart-drawer-main-container"
      );
      if (!drawer) {
        document.body.insertAdjacentHTML("beforeend", drawerHTML);
        drawer = document.getElementById(
          "atlas-upsell-cart-drawer-main-container"
        );
      }

      return drawer;
    }

    fetchInitialCartItems() {
      // Fetch initial cart items and update cart items state
      console.log("loading initial cart items (after config loaded)");
      fetch(`${this.localeUrlBase}cart.js`)
        .then((res) => {
          return res.json();
        })
        .then((cart) => {
          this.updateCartItems(cart);

          // ensure shipping protection switch is toggled on if it's already in the cart:
          if (this?.config?.shipping_protection_product_variant_id) {
            const shippingProtectionItemAlreadyInCart = cart.items.some(
              (item) =>
                item.id ===
                parseInt(
                  this.config.shipping_protection_product_variant_id.replace(
                    "gid://shopify/ProductVariant/",
                    ""
                  )
                )
            );
            if (shippingProtectionItemAlreadyInCart) {
              document.querySelector(
                "#atlas-upsell-cart-shipping-protection-switch"
              ).checked = true;
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

    fetchShippingProtectionImage() {
      if (
        this.config?.shipping_protection_enabled &&
        this.config?.shipping_protection_product_handle
      ) {
        fetch(`/products/${this.config.shipping_protection_product_handle}.js`)
          .then((res) => res.json())
          .then((product) => {
            if (typeof product?.price === "number") {
              const shippingProtectionPriceSpan = document.querySelector(
                "#atlas-upsell-cart-shipping-protection-price"
              );
              if (shippingProtectionPriceSpan) {
                shippingProtectionPriceSpan.innerHTML = formatMoney({
                  cents: product.price,
                  format: this.moneyFormat,
                });
              }
            }
            if (product.featured_image) {
              const shippingProtectionImage = document.querySelector(
                "#atlas-upsell-cart-shipping-protection-image"
              );
              if (shippingProtectionImage) {
                if (
                  !shippingProtectionImage.src ||
                  shippingProtectionImage.src ===
                    "https://app.helloatlas.io/shield.png"
                ) {
                  shippingProtectionImage.src = `https://${product.featured_image}`;
                }
              } else {
                console.warn(
                  "#atlas-upsell-cart-shipping-protection-image element not found in DOM when trying to update src."
                );
              }
            }
          })
          .catch((error) => {
            console.error(
              "Error fetching or processing shipping protection product image:",
              error
            );
          });
      }
    }

    fetchSellingPlansForCartItems() {
      // Only fetch if subscription upgrades are enabled
      if (!this.config?.subscription_upgrades_enabled) {
        return;
      }

      // Get unique product IDs from cart items
      const productIds = [
        ...new Set(
          this.cart.items.map(
            (item) => `gid://shopify/Product/${item.product_id}`
          )
        ),
      ];

      if (productIds.length === 0) {
        return;
      }

      this.sellingPlansLoading = true;
      const shopDomain = window.Shopify?.shop;

      fetch(`${this.baseUrl}/api/get_cart_item_selling_plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop: shopDomain,
          product_ids: productIds,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((sellingPlansByProduct) => {
          console.log("Fetched selling plans:", sellingPlansByProduct);
          this.sellingPlansByProduct = sellingPlansByProduct || {};
          this.sellingPlansLoading = false;
          // Re-render cart items to show subscription upgrade UI
          this.renderCartItems();
        })
        .catch((error) => {
          console.error("Error fetching selling plans:", error);
          this.sellingPlansLoading = false;
          this.sellingPlansByProduct = {};
        });
    }

    generateSubscriptionUpgradeHtml(item) {
      // Check if subscription upgrades are enabled
      if (!this.config?.subscription_upgrades_enabled) {
        return "";
      }

      // Get product ID and check if we have selling plans for this product
      const productGid = `gid://shopify/Product/${item.product_id}`;
      const sellingPlanGroups = this.sellingPlansByProduct?.[productGid];

      // If no selling plans available for this product, don't show UI
      if (!sellingPlanGroups || sellingPlanGroups.length === 0) {
        return "";
      }

      // Check if item already has a subscription (selling_plan_allocation)
      const hasSubscription = !!item.selling_plan_allocation;

      // Build dropdown options HTML
      let dropdownOptionsHtml = "";

      // Add one-time purchase option (only if not preventing downgrades)
      if (!this.config?.subscription_upgrade_prevent_downgrades) {
        const oneTimeText =
          this.config?.subscription_upgrade_one_time_text ||
          "One-time purchase";
        dropdownOptionsHtml += `
          <div class="atlas-subscription-upgrade-option" data-cart-item-key="${item.key}" data-selling-plan-id="" data-is-one-time="true">
            ${escapeHtml(oneTimeText)}
          </div>
        `;
      }

      // Add subscription options from selling plan groups
      sellingPlanGroups.forEach((group) => {
        const groupName = group.name;

        group.sellingPlans.forEach((plan) => {
          // Replace variables in dropdown text template
          let dropdownText =
            this.config?.subscription_upgrade_dropdown_text ||
            "{selling_plan_group_name} / {selling_plan_name}";
          dropdownText = dropdownText
            .replace(/{selling_plan_group_name}/g, groupName)
            .replace(/{selling_plan_name}/g, plan.name);

          // Check if this is the currently selected plan
          const isSelected =
            hasSubscription &&
            item.selling_plan_allocation?.selling_plan?.id === plan.id;

          dropdownOptionsHtml += `
            <div class="atlas-subscription-upgrade-option ${isSelected ? "atlas-subscription-upgrade-option-selected" : ""}"
                 data-cart-item-key="${item.key}"
                 data-selling-plan-id="${plan.id}"
                 data-selling-plan-name="${escapeHtml(plan.name)}"
                 data-selling-plan-group-name="${escapeHtml(groupName)}">
              ${escapeHtml(dropdownText)}
            </div>
          `;
        });
      });

      // Generate button text
      let buttonText =
        this.config?.subscription_upgrade_button_text ||
        "Upgrade to {selling_plan_group_name}";

      // If item has subscription, use the current plan's group name
      if (hasSubscription && item.selling_plan_allocation?.selling_plan) {
        const currentPlanName = item.selling_plan_allocation.selling_plan.name;
        buttonText = buttonText.replace(
          /{selling_plan_group_name}/g,
          currentPlanName
        );
      } else {
        // Use the first group's name as placeholder
        const firstGroupName = sellingPlanGroups[0]?.name || "Subscription";
        buttonText = buttonText.replace(
          /{selling_plan_group_name}/g,
          firstGroupName
        );
      }

      // Generate the complete HTML
      return `
        <div class="atlas-subscription-upgrade-container" data-cart-item-key="${item.key}" style="margin-top: 10px; position: relative;">
          <button class="atlas-subscription-upgrade-button" data-cart-item-key="${item.key}"
                  style="background-color: var(--cart_drawer_button_color);
                         color: var(--cart_drawer_button_text_color);
                         border: none;
                         padding: 8px 16px;
                         border-radius: var(--cart_drawer_button_corner_radius, 4px);
                         cursor: pointer;
                         font-size: 14px;
                         font-weight: 500;
                         width: 100%;
                         text-align: left;
                         display: flex;
                         justify-content: space-between;
                         align-items: center;">
            <span>${escapeHtml(buttonText)}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style="transition: transform 0.2s;">
              <path d="M6 9L1 4h10z"/>
            </svg>
          </button>
          <div class="atlas-subscription-upgrade-dropdown"
               data-cart-item-key="${item.key}"
               style="display: none;
                      position: absolute;
                      top: 100%;
                      left: 0;
                      right: 0;
                      background: var(--cart_drawer_background_color);
                      border: 1px solid #e1e3e5;
                      border-radius: 4px;
                      margin-top: 4px;
                      max-height: 200px;
                      overflow-y: auto;
                      z-index: 1000;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            ${dropdownOptionsHtml}
          </div>
        </div>
      `;
    }
    /* #endregion */

    /* #region - Cart Drawer Open/Close Functions - */
    _skeletonHtml = `
      <div class="atlas-cart-loading-skeleton" aria-hidden="true" style="display: none; padding: 16px;">
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <div style="width: 64px; height: 64px; border-radius: 8px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: atlas-skeleton-pulse 1.5s ease-in-out infinite;"></div>
          <div style="flex: 1;">
            <div style="height: 14px; width: 70%; border-radius: 4px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: atlas-skeleton-pulse 1.5s ease-in-out infinite; margin-bottom: 8px;"></div>
            <div style="height: 12px; width: 40%; border-radius: 4px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: atlas-skeleton-pulse 1.5s ease-in-out infinite;"></div>
          </div>
        </div>
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <div style="width: 64px; height: 64px; border-radius: 8px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: atlas-skeleton-pulse 1.5s ease-in-out infinite;"></div>
          <div style="flex: 1;">
            <div style="height: 14px; width: 60%; border-radius: 4px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: atlas-skeleton-pulse 1.5s ease-in-out infinite; margin-bottom: 8px;"></div>
            <div style="height: 12px; width: 35%; border-radius: 4px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: atlas-skeleton-pulse 1.5s ease-in-out infinite;"></div>
          </div>
        </div>
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <div style="width: 64px; height: 64px; border-radius: 8px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: atlas-skeleton-pulse 1.5s ease-in-out infinite;"></div>
          <div style="flex: 1;">
            <div style="height: 14px; width: 65%; border-radius: 4px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: atlas-skeleton-pulse 1.5s ease-in-out infinite; margin-bottom: 8px;"></div>
            <div style="height: 12px; width: 45%; border-radius: 4px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: atlas-skeleton-pulse 1.5s ease-in-out infinite;"></div>
          </div>
        </div>
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <div style="width: 64px; height: 64px; border-radius: 8px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: atlas-skeleton-pulse 1.5s ease-in-out infinite;"></div>
          <div style="flex: 1;">
            <div style="height: 14px; width: 55%; border-radius: 4px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: atlas-skeleton-pulse 1.5s ease-in-out infinite; margin-bottom: 8px;"></div>
            <div style="height: 12px; width: 30%; border-radius: 4px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: atlas-skeleton-pulse 1.5s ease-in-out infinite;"></div>
          </div>
        </div>
      </div>
      <span role="status" class="atlas-sr-only">Loading cart items...</span>
    `;

    showLoadingSkeleton() {
      const container = this.drawer?.querySelector('.atlas-upsell-cart-items-container');
      const emptyCart = this.drawer?.querySelector('#atlas-upsell-cart-empty-cart-container');
      if (!container) return;
      // Re-inject skeleton if it was wiped by innerHTML = ""
      let skeleton = container.querySelector('.atlas-cart-loading-skeleton');
      if (!skeleton) {
        container.insertAdjacentHTML('afterbegin', this._skeletonHtml);
        skeleton = container.querySelector('.atlas-cart-loading-skeleton');
      }
      if (skeleton) {
        skeleton.style.display = 'block';
        skeleton.style.visibility = 'visible';
      }
      // Force container visible (it's display:none when cart is empty)
      container.style.display = 'block';
      container.style.visibility = 'visible';
      container.style.minHeight = '180px';
      if (emptyCart) emptyCart.style.display = 'none';
    }

    hideLoadingSkeleton() {
      const skeleton = this.drawer?.querySelector('.atlas-cart-loading-skeleton');
      if (skeleton) skeleton.style.display = 'none';
      // Reset container overrides
      const container = this.drawer?.querySelector('.atlas-upsell-cart-items-container');
      if (container) {
        container.style.display = '';
        container.style.visibility = '';
        container.style.minHeight = '';
      }
    }

    // Newest Horizon "pushes" page content aside by adding `page-wrapper--drawer-open`
    // to `.page-wrapper` (margin-right: var(--theme-drawer-width)) when its cart trigger
    // fires. Since we open our own overlay on top and neutralize the theme's dialog, that
    // push is never wanted and the theme's own close never removes it. The class can be
    // applied synchronously during the same click that opens us, so callers strip it both
    // immediately and on the next frame. No-op on themes without this class (old Horizon, Dawn…).
    //
    // Horizon also persists the open drawer in `sessionStorage["theme-drawer-open"]` so it
    // survives reloads/navigation; on reload it re-applies the push from that flag. Since the
    // theme's own close never runs, clear the flag too (only when it points at the cart drawer,
    // so a persisted menu/search drawer state is left untouched).
    clearHorizonDrawerPush() {
      const clear = () => {
        document
          .querySelector(".page-wrapper--drawer-open")
          ?.classList.remove("page-wrapper--drawer-open");
        try {
          if (sessionStorage.getItem("theme-drawer-open") === "cart-drawer") {
            sessionStorage.removeItem("theme-drawer-open");
          }
        } catch (e) {
          /* sessionStorage may be unavailable (privacy mode) — ignore */
        }
      };
      clear();
      requestAnimationFrame(clear);
    }

    open() {
      if (this.drawer) {
        // Only show skeleton when the cart hasn't been fetched yet — not when it's loaded and genuinely empty
        if (!this.cartLoaded) {
          this.showLoadingSkeleton();
        }
        this.drawer.classList.add("is-open");
        document.body.classList.add("atlas-no-scroll-for-cart-drawer");
        this.setDrawerVisibilityState(true);
        this.clearHorizonDrawerPush();

        // Track cart impression
        this.trackCartImpression();
      }
    }

    trackCartImpression() {
      // Only track once per session to avoid duplicate impressions
      const sessionKey = `atlas_cart_impression_tracked_${this.config?.id || "default"}`;
      if (sessionStorage.getItem(sessionKey)) {
        return;
      }

      const baseUrl = ATLAS_API_BASE_URL;
      const shopDomain =
        typeof Shopify !== "undefined" && Shopify?.shop ? Shopify.shop : null;

      if (!shopDomain) {
        console.warn(
          "Atlas Cart: Unable to track impression - shop domain not found"
        );
        return;
      }

      // Generate or get session ID
      let sessionId = sessionStorage.getItem("atlas_session_id");
      if (!sessionId) {
        sessionId =
          "session_" +
          Date.now() +
          "_" +
          Math.random().toString(36).substring(7);
        sessionStorage.setItem("atlas_session_id", sessionId);
      }

      fetch(`${baseUrl}/api/track_cart_impression`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop: shopDomain,
          session_id: sessionId,
          cart_upsell_configuration_id: this.config?.id,
        }),
      })
        .then((response) => {
          if (response.ok) {
            // Mark as tracked for this session
            sessionStorage.setItem(sessionKey, "true");
          }
        })
        .catch((error) => {
          console.warn("Atlas Cart: Failed to track impression", error);
        });
    }

    close() {
      if (this.drawer) {
        this.drawer.classList.remove("is-open");
        document.body.classList.remove("atlas-no-scroll-for-cart-drawer");
        this.setDrawerVisibilityState(false);

        // Clean up scroll locks that the host theme may have added
        // (e.g. Horizon adds scroll-lock attr after its dialog.showModal() call,
        //  Dawn adds overflow-hidden class)
        document.body.classList.remove('overflow-hidden');
        document.body.removeAttribute('scroll-lock');
        document.documentElement.removeAttribute('scroll-lock');
        ['overflow', 'position', 'top', 'left', 'right', 'width', 'height'].forEach(prop => {
          if (document.body.style[prop] === 'hidden' || document.body.style[prop] === 'fixed') {
            document.body.style.removeProperty(prop);
          }
        });

        // Strip the newest-Horizon page push (see clearHorizonDrawerPush) so content
        // returns to full width after we close. No-op on themes without that class.
        this.clearHorizonDrawerPush();
      }
    }

    setDrawerVisibilityState(isOpen) {
      // Force visibility state via inline `!important` so merchant theme rules
      // (which may set `visibility: visible !important` or kill transitions via
      // `transition: none`) can't desync the drawer from its `is-open` class
      // state. Without these writes, affected themes leave the container
      // `visibility: visible / pointer-events: auto` after close, creating an
      // invisible viewport-covering click trap.
      const v = isOpen ? "visible" : "hidden";
      const o = isOpen ? "1" : "0";
      const p = isOpen ? "auto" : "none";
      this.drawer.style.setProperty("visibility", v, "important");
      this.drawer.style.setProperty("opacity", o, "important");
      this.drawer.style.setProperty("pointer-events", p, "important");
      const overlay = this.drawer.querySelector(".atlas-upsell-cart-drawer-overlay");
      if (overlay) overlay.style.setProperty("pointer-events", p, "important");
    }
    /* #endregion */

    /* #region - Update Cart & UI functions */
    updateCartItems(cart) {
      this.cart = cart;
      this.cartLoaded = true;
      this.renderCartItems();

      // Fetch selling plans for subscription upgrades
      if (this.config?.subscription_upgrades_enabled && cart.items.length > 0) {
        this.fetchSellingPlansForCartItems();
      }

      // display or hide shipping protection
      if (this.config?.shipping_protection_enabled && cart.items.length > 0) {
        this.showShippingProtection();
      } else {
        this.hideShippingProtection();
      }

      // update announcement bar
      if (this.config?.announcement_text?.includes("{TIMER}")) {
        if (cart.items.length > 0) {
          this.showAnnouncementBar();
          this.startAnnouncementTimer();
        } else {
          this.hideAnnouncementBar();
          this.stopAnnouncementTimer();
        }
      }

      // update progress reward bar
      if (this.config?.progress_reward_enabled && cart.items.length > 0) {
        this.renderProgressReward(cart.items_subtotal_price);
      } else {
        this.hideProgressReward();
      }

      // Check for free shipping from bundle progressive gifts (cart attributes)
      // This runs separately from progress rewards since they're different features
      if (cart.items.length > 0) {
        this.updateFreeShippingFromBundleGifts();
      }

      // Update discount code UI
      if (this.config?.discount_codes_enabled) {
        this.updateDiscountUI(cart);
      }

      const checkoutButtonAnchor = this.drawer.querySelector(
        "#atlas-upsell-cart-checkout-button-anchor"
      );
      if (checkoutButtonAnchor) {
        checkoutButtonAnchor.setAttribute("href", "/checkout");
      }

      // Smart tier adjustment for progressive gifts
      this.adjustProgressiveGiftsByBundleTier();
    }

    async adjustProgressiveGiftsByBundleTier() {
      if (this.isAdjustingProgressiveGifts) {
        return;
      }
      this.isAdjustingProgressiveGifts = true;

      try {
        if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
          return;
        }

        const cartItems = this.cart.items;

        // Group bundle items by bundle_id and calculate total quantity
        const bundleGroups = {};
        cartItems.forEach((item) => {
          const bundleId = item.properties?._bundle;
          const isGift =
            item.properties?._progressive_gift === "true" ||
            item.properties?._progressive_gift === true;

          // Skip progressive gifts when grouping bundle items
          if (bundleId && !isGift) {
            if (!bundleGroups[bundleId]) {
              bundleGroups[bundleId] = {
                items: [],
                totalQuantity: 0,
              };
            }
            bundleGroups[bundleId].items.push(item);
            bundleGroups[bundleId].totalQuantity += item.quantity || 0;
          }
        });

        // Find progressive gifts in cart
        const progressiveGifts = cartItems.filter(
          (item) =>
            item.properties?._progressive_gift === "true" ||
            item.properties?._progressive_gift === true
        );

        // Track gifts to convert to regular items (keep in cart with original price)
        const giftsToConvert = [];

        progressiveGifts.forEach((gift) => {
          const giftBundleId = gift.properties?._bundle;
          const giftUnlockTier = parseInt(
            gift.properties?._unlock_tier || "1",
            10
          );
          const minQuantityRequired = parseInt(
            gift.properties?._min_quantity_required ||
              gift.properties?._unlock_tier ||
              "1",
            10
          );

          // Check if the bundle for this gift still exists in cart
          const bundleGroup = bundleGroups[giftBundleId];

          if (!bundleGroup) {
            // Bundle was removed, convert gift to regular item (keep with original price)
            giftsToConvert.push(gift);
          } else {
            // Get the total quantity of bundle items in cart
            const currentQuantity = bundleGroup.totalQuantity;

            // Convert gift to regular item if current quantity is less than the minimum required
            if (currentQuantity < minQuantityRequired) {
              giftsToConvert.push(gift);
            }
          }
        });

        const freeShippingToRevoke = [];
        // Check if free shipping should be revoked based on bundle config (more reliable than stored min_qty)
        const bundleConfig = window?.Atlas?.bundler?.bundle;
        if (this.cart && this.cart.attributes) {
          for (const [key, value] of Object.entries(this.cart.attributes)) {
            if (
              key.startsWith("_atlas_free_shipping_") &&
              !key.includes("_min_qty_") &&
              value === "true"
            ) {
              const attrBundleId = key.replace("_atlas_free_shipping_", "");

              const bundleGroup = bundleGroups[attrBundleId];
              if (!bundleGroup) {
                // Bundle not in cart, revoke free shipping
                freeShippingToRevoke.push(attrBundleId);
              } else {
                // Check if user still qualifies for free shipping based on bundle config
                let stillQualifiesForFreeShipping = false;

                if (bundleConfig && String(bundleConfig.id) === attrBundleId) {
                  const giftItems =
                    bundleConfig.progressive_gift?.gift_items || [];
                  const bundleOffers = bundleConfig.bundle_offers || [];
                  const currentQuantity = bundleGroup.totalQuantity;

                  for (const giftItem of giftItems) {
                    if (giftItem.gift_type === "free_shipping") {
                      const unlockTier = giftItem.unlock_tier || 1;
                      const unlockAtIndex = unlockTier - 1;

                      let minQuantityRequired = 1;
                      if (bundleOffers[unlockAtIndex]) {
                        const unlockOffer =
                          bundleOffers[unlockAtIndex].offer ||
                          bundleOffers[unlockAtIndex];
                        if (unlockOffer.pricing_type === "Buy X get Y %") {
                          minQuantityRequired =
                            (unlockOffer.quantity || 1) +
                            (unlockOffer.discount || 0);
                        } else {
                          minQuantityRequired = unlockOffer.quantity || 1;
                        }
                      }

                      if (currentQuantity >= minQuantityRequired) {
                        stillQualifiesForFreeShipping = true;
                        break;
                      }
                    }
                  }
                } else {
                  // Fallback to stored min_qty for other bundles
                  const minQtyKey = `_atlas_free_shipping_min_qty_${attrBundleId}`;
                  const minQty = parseInt(
                    this.cart.attributes[minQtyKey] || "0",
                    10
                  );
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

        // Convert gifts to regular items and/or revoke free shipping
        if (giftsToConvert.length > 0 || freeShippingToRevoke.length > 0) {
          // Convert gifts to regular items by clearing progressive gift properties
          // This keeps the item in cart but removes the discount (shows original price)
          for (const gift of giftsToConvert) {
            try {
              // Keep a marker to identify this item was previously a progressive gift
              // This helps when converting back to a gift when user increases quantity
              const giftItemId =
                gift.properties?._progressive_gift_item_id || "";
              await fetch(`${this.localeUrlBase}cart/change.js`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
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
                    _was_progressive_gift_item_id: giftItemId,
                  },
                }),
              });
            } catch (error) {
              console.error(
                "[Progressive Gifts] Failed to convert gift to regular item:",
                error
              );
            }
          }

          // Prepare attributes update for free shipping revocation
          const attributesToUpdate = {};
          freeShippingToRevoke.forEach((bundleId) => {
            attributesToUpdate[`_atlas_free_shipping_${bundleId}`] = "";
          });

          // Revoke free shipping if any
          if (freeShippingToRevoke.length > 0) {
            const attrResponse = await fetch(
              `${this.localeUrlBase}cart/update.js`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({ attributes: attributesToUpdate }),
              }
            );

            if (!attrResponse.ok) {
              console.error(
                "[Progressive Gifts] Failed to revoke free shipping"
              );
            }
          }

          // Fetch updated cart
          const updatedCart = await fetch(`${this.localeUrlBase}cart.js`).then(
            (res) => res.json()
          );

          // Update cart without triggering another adjustment (prevent infinite loop)
          this.cart = updatedCart;
          this.renderCartItems();

          // Update free shipping UI if applicable
          if (freeShippingToRevoke.length > 0) {
            this.updateFreeShippingFromBundleGifts();
          }
        } else {
          await this.checkAndAddMissingProgressiveGifts(
            bundleGroups,
            progressiveGifts
          );
        }

      } catch (error) {
        console.error("[Progressive Gifts] Error adjusting gifts:", error);
      } finally {
        this.isAdjustingProgressiveGifts = false;
      }
    }


    async checkAndAddMissingProgressiveGifts(
      bundleGroups,
      existingProgressiveGifts
    ) {
      const bundleConfig = window?.Atlas?.bundler?.bundle;
      if (
        !bundleConfig ||
        !bundleConfig.progressive_gift ||
        !bundleConfig.progressive_gift.enabled
      ) {
        return;
      }

      const progressiveGiftConfig = bundleConfig.progressive_gift;
      const giftItems = progressiveGiftConfig.gift_items || [];
      const bundleOffers = bundleConfig.bundle_offers || [];
      const bundleId = String(bundleConfig.id);

      const bundleGroup = bundleGroups[bundleId];
      if (!bundleGroup) {
        return; // Bundle not in cart
      }

      const currentQuantity = bundleGroup.totalQuantity;

      const firstBundleItem = bundleGroup.items[0];
      const offerId = firstBundleItem?.properties?._bundle_offer;

      if (!offerId) {
        return;
      }

      const existingGiftItemIds = new Set();
      existingProgressiveGifts.forEach((gift) => {
        if (gift.properties?._progressive_gift_item_id) {
          existingGiftItemIds.add(
            String(gift.properties._progressive_gift_item_id)
          );
        }
      });

      const giftsToAdd = [];
      const giftsToConvertBack = []; // Track items that need to be converted back to progressive gifts
      const declinedGiftsToReset = []; // Track declined gifts that user no longer qualifies for

      // Get all cart items for checking if gift products are already in cart as regular items
      const cartItems = this.cart?.items || [];

      giftItems.forEach((giftItem) => {
        if (existingGiftItemIds.has(String(giftItem.id))) {
          return;
        }

        if (giftItem.gift_type !== "free_gift") {
          return;
        }

        const unlockTier = giftItem.unlock_tier || 1;
        const unlockAtIndex = unlockTier - 1;

        let minQuantityRequired = 1;
        if (bundleOffers[unlockAtIndex]) {
          const unlockOffer =
            bundleOffers[unlockAtIndex].offer || bundleOffers[unlockAtIndex];
          if (unlockOffer.pricing_type === "Buy X get Y %") {
            minQuantityRequired =
              (unlockOffer.quantity || 1) + (unlockOffer.discount || 0);
          } else {
            minQuantityRequired = unlockOffer.quantity || 1;
          }
        }

        // Check if user has declined this gift
        const isGiftDeclined =
          this.cart?.attributes?.[`_atlas_declined_gift_${giftItem.id}`] ===
          "true";

        if (currentQuantity >= minQuantityRequired) {
          // User qualifies for gift - only add if not declined
          if (!isGiftDeclined) {
            let variantId = giftItem.variant_id;
            if (!variantId && giftItem.product?.variants?.[0]?.id) {
              variantId = giftItem.product.variants[0].id;
            }
            if (variantId) {
              variantId = String(variantId);
              if (variantId.includes("gid://shopify/ProductVariant/")) {
                const idParts = variantId.split("/");
                variantId = idParts[idParts.length - 1];
              }
            }

            if (variantId) {
              // Also get product_id for fallback matching
              let productId = giftItem.product_id || giftItem.product?.id;
              if (productId) {
                productId = String(productId);
                if (productId.includes("gid://shopify/Product/")) {
                  const idParts = productId.split("/");
                  productId = idParts[idParts.length - 1];
                }
              }

              const giftItemIdStr = String(giftItem.id);

              // First, try to find an item that was previously this exact progressive gift (most reliable)
              let existingRegularItem = cartItems.find((item) => {
                const wasThisGift =
                  item.properties?._was_progressive_gift === "true" &&
                  item.properties?._was_progressive_gift_item_id ===
                    giftItemIdStr;
                return wasThisGift;
              });

              // Second, try to find any item that was a progressive gift with matching variant
              if (!existingRegularItem) {
                existingRegularItem = cartItems.find((item) => {
                  const wasAnyGift =
                    item.properties?._was_progressive_gift === "true";
                  const itemVariantId = String(item.variant_id);
                  return wasAnyGift && itemVariantId === variantId;
                });
              }

              // Third, try to find any item that was a progressive gift with matching product
              if (!existingRegularItem && productId) {
                existingRegularItem = cartItems.find((item) => {
                  const wasAnyGift =
                    item.properties?._was_progressive_gift === "true";
                  const itemProductId = String(item.product_id);
                  return wasAnyGift && itemProductId === productId;
                });
              }

              // Fourth, fallback to matching by variant_id or product_id for items that might not have marker
              if (!existingRegularItem) {
                existingRegularItem = cartItems.find((item) => {
                  const itemVariantId = String(item.variant_id);
                  const itemProductId = String(item.product_id);
                  // Check if item is not a progressive gift (either no property or empty/false)
                  const isNotProgressiveGift =
                    !item.properties?._progressive_gift ||
                    item.properties._progressive_gift === "" ||
                    item.properties._progressive_gift === "false";

                  // Match by variant_id OR product_id (for cases where variant might differ)
                  const variantMatches = itemVariantId === variantId;
                  const productMatches =
                    productId && itemProductId === productId;

                  return (
                    (variantMatches || productMatches) && isNotProgressiveGift
                  );
                });
              }

              if (existingRegularItem) {
                // Convert existing item back to progressive gift
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
                    _was_progressive_gift_item_id: "",
                  },
                });
              } else {
                // Add new gift item
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
        } else {
          // User no longer qualifies - clear declined status so they can get it again if they add more items
          if (isGiftDeclined) {
            declinedGiftsToReset.push(giftItem.id);
          }
        }
      });

      // Clear declined status for gifts user no longer qualifies for
      if (declinedGiftsToReset.length > 0) {
        const resetAttributes = {};
        declinedGiftsToReset.forEach((giftId) => {
          resetAttributes[`_atlas_declined_gift_${giftId}`] = "";
        });
        try {
          await fetch(`${this.localeUrlBase}cart/update.js`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ attributes: resetAttributes }),
          });
        } catch (e) {
          console.error(
            "[Progressive Gifts] Failed to reset declined gift status",
            e
          );
        }
      }

      let shouldHaveFreeShipping = false;
      let freeShippingMinQty = 0;

      giftItems.forEach((giftItem) => {
        if (giftItem.gift_type === "free_shipping") {
          const unlockTier = giftItem.unlock_tier || 1;
          const unlockAtIndex = unlockTier - 1;

          let minQuantityRequired = 1;
          if (bundleOffers[unlockAtIndex]) {
            const unlockOffer =
              bundleOffers[unlockAtIndex].offer || bundleOffers[unlockAtIndex];
            if (unlockOffer.pricing_type === "Buy X get Y %") {
              minQuantityRequired =
                (unlockOffer.quantity || 1) + (unlockOffer.discount || 0);
            } else {
              minQuantityRequired = unlockOffer.quantity || 1;
            }
          }

          if (currentQuantity >= minQuantityRequired) {
            shouldHaveFreeShipping = true;
            freeShippingMinQty = minQuantityRequired;
          }
        }
      });

      if (
        giftsToAdd.length > 0 ||
        giftsToConvertBack.length > 0 ||
        shouldHaveFreeShipping
      ) {
        try {
          // Convert existing items back to progressive gifts
          for (const giftToConvert of giftsToConvertBack) {
            try {
              await fetch(`${this.localeUrlBase}cart/change.js`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({
                  id: giftToConvert.key,
                  properties: giftToConvert.properties,
                }),
              });
            } catch (error) {
              console.error(
                "[Progressive Gifts] Failed to convert item back to gift:",
                error
              );
            }
          }

          // Add new gift items
          if (giftsToAdd.length > 0) {
            const addResponse = await fetch(
              `${this.localeUrlBase}cart/add.js`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({ items: giftsToAdd }),
              }
            );

            if (!addResponse.ok) {
              console.error("[Progressive Gifts] Failed to add missing gifts");
            }
          }

          const currentFreeShippingAttr =
            this.cart?.attributes?.[`_atlas_free_shipping_${bundleId}`];
          if (shouldHaveFreeShipping && currentFreeShippingAttr !== "true") {
            const attributes = {};
            attributes[`_atlas_free_shipping_${bundleId}`] = "true";
            attributes[`_atlas_free_shipping_min_qty_${bundleId}`] =
              String(freeShippingMinQty);

            await fetch(`${this.localeUrlBase}cart/update.js`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({ attributes }),
            });
          }

          const updatedCart = await fetch(`${this.localeUrlBase}cart.js`).then(
            (res) => res.json()
          );
          this.cart = updatedCart;
          this.renderCartItems();
          this.updateFreeShippingFromBundleGifts();
        } catch (error) {
          console.error(
            "[Progressive Gifts] Error adding missing gifts:",
            error
          );
        }
      }
    }

    renderCartItems() {
      // Don't hide skeleton or render stale items while waiting for fresh cart data
      if (this.isWaitingForCartData) return;
      this.hideLoadingSkeleton();
      const container = this.drawer.querySelector(
        ".atlas-upsell-cart-items-container"
      );
      if (!container) return;

      let filteredCartItems = this.cart.items;

      if (
        this.config?.shipping_protection_enabled &&
        this.config.shipping_protection_product_variant_id
      ) {
        filteredCartItems = this.cart.items.filter(
          (item) =>
            item.id !==
            parseInt(
              this.config.shipping_protection_product_variant_id.replace(
                "gid://shopify/ProductVariant/",
                ""
              )
            )
        );
      }

      const emptyCartContentElement = this.drawer.querySelector(
        "#atlas-upsell-cart-empty-cart-container"
      );
      const notEmptyCartContentElement = this.drawer.querySelector(
        "#atlas-upsell-cart-not-empty-cart-container"
      );
      const progressRewardContainer = this.drawer.querySelector(
        ".atlas-upsell-cart-progress-reward-container"
      );
      const itemsContainer = this.drawer.querySelector(
        // This is the same as 'container' variable above
        ".atlas-upsell-cart-items-container"
      );
      const footerElement = this.drawer.querySelector(
        ".atlas-upsell-cart-footer"
      );
      const headerElement = this.drawer.querySelector(
        ".atlas-upsell-cart-header"
      );
      const announcementElement = this.drawer.querySelector(
        ".atlas-upsell-cart-announcement"
      );

      if (filteredCartItems.length === 0) {
        if (emptyCartContentElement) {
          emptyCartContentElement.style.display = "flex";
        }
        if (notEmptyCartContentElement) {
          notEmptyCartContentElement.style.display = "flex"; // Keep this visible for the header
          notEmptyCartContentElement.style.pointerEvents = "none";
        }

        if (headerElement) {
          headerElement.style.pointerEvents = "auto";
        }

        if (announcementElement) {
          announcementElement.style.pointerEvents = "auto";
        }

        // Hide specific content sections within notEmptyCartContentElement
        if (progressRewardContainer) {
          progressRewardContainer.style.display = "none";
        }
        if (itemsContainer) {
          itemsContainer.innerHTML = ""; // Clear items
          itemsContainer.style.display = "none";
        }
        if (footerElement) {
          footerElement.style.display = "none";
        }

        // The carouselHandler.renderCarouselInItemsContainer call below will be skipped.
      } else {
        if (emptyCartContentElement) {
          emptyCartContentElement.style.display = "none";
        }
        if (notEmptyCartContentElement) {
          notEmptyCartContentElement.style.display = "flex";
          notEmptyCartContentElement.style.pointerEvents = ""; // Reset pointer events
        }
        if (headerElement) {
          headerElement.style.pointerEvents = ""; // Reset pointer events
        }
        if (announcementElement) {
          announcementElement.style.pointerEvents = ""; // Reset pointer events
        }

        // Show specific content sections
        if (progressRewardContainer) {
          if (this.config?.progress_reward_enabled) {
            progressRewardContainer.style.display = "";
          } else {
            progressRewardContainer.style.display = "none";
          }
        }

        // Clear previous items from the itemsContainer before populating
        if (itemsContainer) {
          itemsContainer.style.display = ""; // Revert to default/CSS display
          itemsContainer.innerHTML = "";
        }

        if (footerElement) {
          footerElement.style.display = ""; // Revert to default/CSS display
        }

        const actualItemsWrapper = document.createElement("div"); // Create wrapper for actual cart items

        let itemsHtml = ""; // Accumulate HTML for all cart items
        filteredCartItems.forEach((item) => {
          const deleteItemIsLoading = this.deleteCartItemLoadingKeys.has(
            item.key
          );

          const quantityMinusLoading = this.quantityMinusLoadingKeys.has(
            item.key
          );

          const quantityPlusLoading = this.quantityPlusLoadingKeys.has(
            item.key
          );

          let optionsWithValues = "";
          item?.options_with_values?.forEach((option) => {
            if (!item?.product_has_only_default_variant) {
              optionsWithValues += `<div style="font-size: 13px; color: var(--cart_drawer_variant_text_color);">${escapeHtml(option.name)}: <span style="font-weight: 500;">${escapeHtml(option.value)}</span></div>`;
            }
          });

          let sellingPlansHtml = "";
          if (item?.selling_plan_allocation?.selling_plan) {
            const sellingPlan = item?.selling_plan_allocation?.selling_plan;
            if (sellingPlan) {
              const displayText = sellingPlan.name || "";

              if (displayText) {
                sellingPlansHtml = `
                  <div style="font-size: 13px; color: var(--cart_drawer_variant_text_color);">
                    ${escapeHtml(displayText)}
                  </div>
                `;
              }
            }
          }

          const isProgressiveGift =
            item.properties &&
            (item.properties._progressive_gift === true ||
              item.properties._progressive_gift === "true");

          const isBundleOfferGift =
            item.properties &&
            (item.properties._gift === true ||
              item.properties._gift === "true");

          const isAnyGift = isProgressiveGift || isBundleOfferGift;

          let itemImageUrl = item.image
            ? `${item.image}${"&width=300"}`
            : "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-image.png";
          if (isProgressiveGift && item.properties?._progressive_gift_item_id) {
            const progressiveGiftConfig =
              window?.Atlas?.bundler?.bundle?.progressive_gift;
            if (progressiveGiftConfig?.gift_items) {
              const giftItemId = item.properties._progressive_gift_item_id;
              const giftItem = progressiveGiftConfig.gift_items.find(
                (g) => String(g.id) === String(giftItemId)
              );
              if (giftItem?.custom_image_url) {
                itemImageUrl = giftItem.custom_image_url;
              }
            }
          }

          // /cart.js sends item.title already HTML-escaped; build the alt from the raw fields.
          const itemImageAlt = item.variant_title
            ? `${item.product_title} - ${item.variant_title}`
            : item.product_title;

          let compareAtPriceHtml = "";
          if (this?.config?.cart_drawer_show_strike_prices) {
            compareAtPriceHtml = `<span class="atlas-upsell-cart-item-compare-at-price" data-product-handle="${item.handle}" data-variant-id="${item.variant_id}" data-quantity="${item.quantity}" style="display: none; color: var(--cart_drawer_compare_at_price_color); font-size: ${this.config?.cart_drawer_compare_price_size ? this.config?.cart_drawer_compare_price_size : 14}px; text-decoration: line-through;">&nbsp;</span>`;
          }

          let discountTagHtml = ``;
          // Only show discount tag if there's a line-level discount (not order-level) AND not a progressive gift
          if (
            !isAnyGift &&
            item?.line_level_discount_allocations?.[0]?.amount > 0 &&
            item?.line_level_discount_allocations?.[0]?.discount_application
              ?.title
          ) {
            discountTagHtml = `
            <div style="display: flex; margin-top: 6px;">
              <div style="display: flex; align-items: center; gap: 4.5px; background-color: var(--cart_drawer_discount_tag_background_color); padding: 1.5px 6px; border-radius: 4px;">
                <svg class="" style="margin-top: 2px; color: var(--cart_drawer_discount_icon_tag_color);" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z"></path>
                </svg>
                <div style="color: var(--cart_drawer_discount_tag_text_color); font-size: 12.5px; font-weight: 500; display: inline-block;">
                  ${escapeHtml(item?.line_level_discount_allocations?.[0]?.discount_application?.title)}
                </div>
              </div>
            </div>
            `;
          }

          // Shopify reports original_line_price already selling-plan-adjusted;
          // for subscription lines use the allocation's one-time price so the
          // strikethrough and savings reflect the full discount (plan + offer).
          const lineOriginalPrice = item?.selling_plan_allocation
            ?.compare_at_price
            ? item.selling_plan_allocation.compare_at_price * item.quantity
            : item?.original_line_price;
          const totalDiscount = lineOriginalPrice - item?.final_line_price;
          const savingBackground = this.config
            ?.cart_drawer_use_saving_background_gradient
            ? this.config?.cart_drawer_saving_background_gradient
            : this.config?.cart_drawer_saving_background_color;
          let totalSavedOnLineHtml = `<div class="atlas-upsell-cart-item-total-saved-on-line" style="color: var(--cart_drawer_saving_text_color); font-size: 12px; font-weight: 500; display: none; justify-content: flex-end; text-align: right; padding: ${this.config?.cart_drawer_saving_background_color || (this.config?.cart_drawer_saving_background_gradient && this.config?.cart_drawer_use_saving_background_gradient) ? "1.5px 6px" : "0px"}; border-radius: 4px; background: ${savingBackground}; width: fit-content;" data-line-original-price="${lineOriginalPrice}" data-line-final-price="${item.final_line_price}">&nbsp;</div>`;

          // Always create mobile version element (will be shown/hidden via CSS and updated dynamically)
          let totalSavedOnLineHtmlMobile = `<div class="atlas-upsell-cart-item-total-saved-on-line-mobile" style="color: var(--cart_drawer_saving_text_color); font-size: 12px; font-weight: 500; display: none; justify-content: flex-start; text-align: left; padding: ${this.config?.cart_drawer_saving_background_color || (this.config?.cart_drawer_saving_background_gradient && this.config?.cart_drawer_use_saving_background_gradient) ? "1.5px 6px" : "0px"}; border-radius: 4px; background: ${savingBackground}; margin-top: 8px;" data-line-original-price="${lineOriginalPrice}" data-line-final-price="${item.final_line_price}"></div>`;

          if (
            !this?.config?.cart_drawer_show_strike_prices &&
            totalDiscount > 0
          ) {
            const saveText = this.formatSaveAmountText(
              totalDiscount,
              lineOriginalPrice
            );
            totalSavedOnLineHtml = `<div class="atlas-upsell-cart-item-total-saved-on-line" style="color: var(--cart_drawer_saving_text_color); font-size: 12px; font-weight: 500; display: flex; justify-content: flex-end; text-align: right; padding: ${this.config?.cart_drawer_saving_background_color || (this.config?.cart_drawer_saving_background_gradient && this.config?.cart_drawer_use_saving_background_gradient) ? "1.5px 6px" : "0px"}; border-radius: 4px; background: ${savingBackground};" data-line-original-price="${lineOriginalPrice}" data-line-final-price="${item.final_line_price}">
              <div style="word-wrap: break-word;">
                ${saveText}
              </div>
            </div>`;
            totalSavedOnLineHtmlMobile = `<div class="atlas-upsell-cart-item-total-saved-on-line-mobile" style="color: var(--cart_drawer_saving_text_color); font-size: 12px; font-weight: 500; display: flex; justify-content: flex-start; text-align: left; padding: ${this.config?.cart_drawer_saving_background_color || (this.config?.cart_drawer_saving_background_gradient && this.config?.cart_drawer_use_saving_background_gradient) ? "1.5px 6px" : "0px"}; border-radius: 4px; background: ${savingBackground}; margin-top: 8px;" data-line-original-price="${lineOriginalPrice}" data-line-final-price="${item.final_line_price}">
              <div style="word-wrap: break-word;">
                ${saveText}
              </div>
            </div>`;
          }

          let lineItemPropertiesHtml = ``;
          if (
            item.properties &&
            typeof item.properties === "object" &&
            Object.keys(item.properties).length > 0
          ) {
            lineItemPropertiesHtml = `
              <div class="atlas-upsell-cart-item-properties" style="font-size: 13px; color: var(--cart_drawer_variant_text_color); padding-right: 5px;">
                ${Object.entries(item.properties)
                  .filter(
                    ([key, value]) =>
                      key &&
                      value &&
                      typeof value === "string" &&
                      value.trim() !== "" &&
                      !key.startsWith("_") &&
                      key !== "is_progressive_gift"
                  )
                  .map(
                    ([key, value]) =>
                      `<div>${escapeHtml(key)}: ${escapeHtml(value)}</div>`
                  )
                  .join("")}
              </div>
            `;
          }

          itemsHtml += `
            <div class="atlas-upsell-cart-item-outer-container">
              <div class="atlas-upsell-cart-item">
                <img src="${escapeHtml(itemImageUrl)}" alt="${escapeHtml(itemImageAlt)}" />
                <div style="flex-grow: 1;">

                  <div style="font-weight: 500; font-size: 16px; margin-right: 24px; color: var(--cart_drawer_text_color);">
                    ${escapeHtml(item.product_title)}
                  </div>

                  <div class="atlas-upsell-cart-item-info-container">
                      <div style="display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                          ${optionsWithValues}
                          ${sellingPlansHtml}
                        </div>
                        <div class="atlas-upsell-cart-item-properties">
                          ${lineItemPropertiesHtml}
                        </div>

                        ${discountTagHtml}

                        <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                          <div class="atlas-upsell-cart-item-quantity-container">
                            <button class="atlas-upsell-cart-item-quantity-down" data-cart-item-key="${item.key}" data-current-quantity="${item.quantity}" ${quantityMinusLoading || quantityPlusLoading || isAnyGift ? "disabled" : ""} ${isAnyGift ? 'style="opacity: 0.3; cursor: not-allowed;"' : ""}>
                              ${quantityMinusLoading ? `<div class="atlas-upsell-cart-item-quantity-button-loading-spinner">&nbsp;</div>` : `-`}
                            </button>
                            <div class="atlas-upsell-cart-item-quantity-amount">${item.quantity}</div>
                            <button class="atlas-upsell-cart-item-quantity-up" data-cart-item-key="${item.key}" data-current-quantity="${item.quantity}" ${quantityMinusLoading || quantityPlusLoading || isAnyGift ? "disabled" : ""} ${isAnyGift ? 'style="opacity: 0.3; cursor: not-allowed;"' : ""}>
                              ${quantityPlusLoading ? `<div class="atlas-upsell-cart-item-quantity-button-loading-spinner">&nbsp;</div>` : `+`}
                            </button>
                          </div>

                          <div class="atlas-upsell-cart-item-delete-icon-container"><button style="margin-top: 6px;" data-cart-item-key="${item.key}">${deleteIcon}</button></div>
                        </div>
                        ${totalSavedOnLineHtmlMobile}
                      </div>


                    <div class="atlas-upsell-cart-item-price-container">
                        <div class="atlas-upsell-cart-item-price-inner-container">
                          <span style="font-size: ${this.config?.cart_drawer_price_size ? this.config?.cart_drawer_price_size : 16}px; font-weight: 600;">
                            ${formatMoney({
                              cents: item.final_line_price,
                              format: this.moneyFormat,
                            })}
                          </span>
                          ${compareAtPriceHtml}
                        </div>
                        ${totalSavedOnLineHtml}
                      </div>
                  </div>
                </div>
              </div>
              ${this.generateSubscriptionUpgradeHtml(item)}
              ${
                deleteItemIsLoading
                  ? `
                <div class="atlas-upsell-cart-item-loading-overlay">
                  <div class="atlas-upsell-cart-spinner">&nbsp;</div>
                </div>
              `
                  : ""
              }
            </div>
          `;
        });
        actualItemsWrapper.innerHTML = itemsHtml;
        container.appendChild(actualItemsWrapper);

        // Add spacer div that will push the carousel down if there's space
        const spacer = document.createElement("div");
        spacer.style.flexGrow = "1";
        spacer.style.minHeight = "0px"; // Ensures it collapses if no space
        container.appendChild(spacer);
      }

      // Add carousel after cart items (and spacer) if applicable
      // The carousel is added to 'container' (which is itemsContainer).
      // It will be the last child, appearing after the spacer.
      if (
        this.config.upsell_products_enabled &&
        filteredCartItems.length > 0 &&
        this.carouselHandler
      ) {
        this.carouselHandler.renderCarouselInItemsContainer(
          container,
          this.config.upsell_position
        );
      }

      // Update subtotal
      const subtotalSpan = document.querySelector(
        ".atlas-upsell-cart-subtotal-amount-span"
      );
      if (subtotalSpan) {
        // subtotalSpan.textContent = `\u0020 ${(this.cart.total_price / 100).toFixed(2)}`;
        subtotalSpan.innerHTML = `\u0020 ${formatMoney({ cents: this.cart.items_subtotal_price, format: this.moneyFormat })}`;
      }

      const subtotalLinePriceSpan = document.querySelector(
        "#atlas-upsell-cart-subtotal-line-price-span"
      );
      if (subtotalLinePriceSpan) {
        subtotalLinePriceSpan.innerHTML = `${formatMoney({
          cents: this.cart.items_subtotal_price,
          format: this.moneyFormat,
        })}`;
      }

      /* #region  Update order-level discount display */
      const orderDiscountContainer = document.querySelector(
        "#atlas-upsell-cart-order-discount-container"
      );

      const cartLevelDiscountApplications =
        this.cart?.cart_level_discount_applications;
      // The discount-code row already reports every applied code, so this row is
      // for automatic discounts only - bundle and upsell discounts, which carry no
      // code. Without this an order-level CODE reported the same money twice.
      const appliedCodes = (this.cart?.discount_codes || [])
        .filter((d) => d.applicable)
        .map((d) => (d.code || "").toLowerCase());
      const firstDiscountApplication = (
        cartLevelDiscountApplications || []
      ).find((a) => !appliedCodes.includes((a.title || "").toLowerCase()));

      const cartLevelDiscountTitle = firstDiscountApplication?.title;
      const cartLevelDiscountAmount =
        firstDiscountApplication?.total_allocated_amount;

      if (orderDiscountContainer) {
        if (cartLevelDiscountAmount > 0 && cartLevelDiscountTitle) {
          // Style the container to layout title and amount
          orderDiscountContainer.style.display = "flex";
          orderDiscountContainer.style.justifyContent = "space-between";
          orderDiscountContainer.style.alignItems = "center";
          // Match styling of the subtotal line for consistency
          orderDiscountContainer.style.paddingBottom = "5px";
          orderDiscountContainer.style.fontSize = "15.5px";

          const titleHtml = `<span>${escapeHtml(cartLevelDiscountTitle)}</span>`;
          const amountHtml = `<span>-${formatMoney({
            // Using a green color for the discount amount
            cents: cartLevelDiscountAmount,
            format: this.moneyFormat,
          })}</span>`;

          // Set the innerHTML of the container with both title and amount
          orderDiscountContainer.innerHTML = `${titleHtml}${amountHtml}`;
        } else {
          orderDiscountContainer.style.display = "none";
          orderDiscountContainer.innerHTML = ""; // Clear any previous content
        }
      }

      /* #endregion */

      // Update checkout button total (should show final price after discounts)
      const checkoutTotalSpan = document.querySelector(
        ".atlas-upsell-cart-subtotal-amount-span"
      );
      if (checkoutTotalSpan) {
        checkoutTotalSpan.innerHTML = `\u0020 ${formatMoney({ cents: this.cart.total_price, format: this.moneyFormat })}`;
      }

      // Add event listeners to delete buttons
      container
        .querySelectorAll(
          ".atlas-upsell-cart-item-delete-icon-container button"
        )
        .forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const key = btn.getAttribute("data-cart-item-key");
            this.deleteCartItem(key);
          });
        });

      // Add event listeners to quantity buttons
      container
        .querySelectorAll(".atlas-upsell-cart-item-quantity-down")
        .forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const key = btn.getAttribute("data-cart-item-key");
            const currentQuantity = parseInt(
              btn.getAttribute("data-current-quantity")
            );
            if (!isNaN(currentQuantity) && 0 <= currentQuantity) {
              this.plusMinusButtonChangeCartItemQuantity(
                key,
                currentQuantity - 1,
                "minus"
              );
            }
          });
        });

      container
        .querySelectorAll(".atlas-upsell-cart-item-quantity-up")
        .forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const key = btn.getAttribute("data-cart-item-key");
            const currentQuantity = parseInt(
              btn.getAttribute("data-current-quantity")
            );
            if (!isNaN(currentQuantity) && 0 <= currentQuantity) {
              this.plusMinusButtonChangeCartItemQuantity(
                key,
                currentQuantity + 1,
                "plus"
              );
            }
          });
        });

      // Add event listeners for subscription upgrade buttons and dropdowns
      if (this.config?.subscription_upgrades_enabled) {
        // Toggle dropdown visibility when button is clicked
        container
          .querySelectorAll(".atlas-subscription-upgrade-button")
          .forEach((btn) => {
            btn.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();

              const itemKey = btn.getAttribute("data-cart-item-key");
              const dropdown = container.querySelector(
                `.atlas-subscription-upgrade-dropdown[data-cart-item-key="${itemKey}"]`
              );

              if (dropdown) {
                // Close all other dropdowns first
                container
                  .querySelectorAll(".atlas-subscription-upgrade-dropdown")
                  .forEach((d) => {
                    if (d !== dropdown) {
                      d.style.display = "none";
                    }
                  });

                // Toggle current dropdown
                dropdown.style.display =
                  dropdown.style.display === "none" ? "block" : "none";
              }
            });
          });

        // Handle subscription option selection
        container
          .querySelectorAll(".atlas-subscription-upgrade-option")
          .forEach((option) => {
            option.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();

              const itemKey = option.getAttribute("data-cart-item-key");
              const sellingPlanId = option.getAttribute("data-selling-plan-id");
              const isOneTime =
                option.getAttribute("data-is-one-time") === "true";

              // Close the dropdown
              const dropdown = container.querySelector(
                `.atlas-subscription-upgrade-dropdown[data-cart-item-key="${itemKey}"]`
              );
              if (dropdown) {
                dropdown.style.display = "none";
              }

              // Update the cart with the selected subscription option
              this.updateCartItemSubscription(
                itemKey,
                isOneTime ? null : sellingPlanId
              );
            });
          });

        // Close dropdown when clicking outside
        const closeDropdowns = (e) => {
          if (!e.target.closest(".atlas-subscription-upgrade-container")) {
            container
              .querySelectorAll(".atlas-subscription-upgrade-dropdown")
              .forEach((dropdown) => {
                dropdown.style.display = "none";
              });
          }
        };

        // Remove existing listener if any to avoid duplicates
        document.removeEventListener(
          "click",
          this.subscriptionDropdownClickHandler
        );
        this.subscriptionDropdownClickHandler = closeDropdowns;
        document.addEventListener(
          "click",
          this.subscriptionDropdownClickHandler
        );
      }

      this.updateQuantityInDrawerHeaderTitle(filteredCartItems);
      if (this.config?.cart_drawer_show_strike_prices) {
        this.getAndRenderCompareAtPrices();
      }
      // Notify external integrations that Atlas cart UI has changed
      try {
        document.dispatchEvent(
          new CustomEvent("atlas-cart:changed", { detail: { source: "atlas" } })
        );
      } catch (e) {
        // no-op
      }
    }

    async deleteCartItem(key) {
      try {
        const itemToDelete = this.cart?.items?.find((item) => item.key === key);

        // Check if the item being deleted is a progressive gift
        const isProgressiveGift =
          itemToDelete?.properties?._progressive_gift === "true" ||
          itemToDelete?.properties?._progressive_gift === true;
        const progressiveGiftItemId =
          itemToDelete?.properties?._progressive_gift_item_id;

        // Check if the item being deleted is a paid BXGY bundle item
        const isBundleItem = !!itemToDelete?.properties?._bundle;
        const isBxgyFree =
          itemToDelete?.properties?._bundle_bxgy_free === "true" ||
          itemToDelete?.properties?._bundle_bxgy_free === true;
        let bxgyFreeItemsToConvert = [];

        if (isBundleItem && !isBxgyFree) {
          const bundleId = itemToDelete.properties._bundle;
          const offerId = itemToDelete.properties._bundle_offer;

          // Find BXGY free items in the same bundle/offer that need conversion
          bxgyFreeItemsToConvert = (this.cart?.items || []).filter(
            (item) =>
              item.key !== key &&
              item.properties?._bundle === bundleId &&
              item.properties?._bundle_offer === offerId &&
              (item.properties?._bundle_bxgy_free === "true" ||
                item.properties?._bundle_bxgy_free === true)
          );
        }

        // Show loading on BOTH the item being deleted AND any BXGY free items being converted
        this.deleteCartItemLoadingKeys.add(key);
        bxgyFreeItemsToConvert.forEach((f) =>
          this.deleteCartItemLoadingKeys.add(f.key)
        );
        this.renderCartItems();

        // Delete the item
        await fetch(`${this.localeUrlBase}cart/change.js`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ id: key, quantity: 0 }),
        });

        // Convert BXGY free items to subscription items BEFORE fetching/rendering
        let bxgyFinalCart = null;
        if (bxgyFreeItemsToConvert.length > 0) {
          this.isBxgyConverting = true;
          try {
            // Fetch current cart to get fresh keys after the paid item was removed
            const midCart = await fetch(`${this.localeUrlBase}cart.js`).then(
              (r) => r.json()
            );

            for (const origFreeItem of bxgyFreeItemsToConvert) {
              const sellingPlanId =
                origFreeItem.properties?._bundle_bxgy_selling_plan || null;
              if (!sellingPlanId) continue;

              // Find the free item in the updated cart by matching properties
              const currentFreeItem = midCart.items.find(
                (item) =>
                  (item.properties?._bundle_bxgy_free === "true" ||
                    item.properties?._bundle_bxgy_free === true) &&
                  item.properties?._bundle === origFreeItem.properties._bundle &&
                  item.properties?._bundle_offer ===
                    origFreeItem.properties._bundle_offer
              );

              if (currentFreeItem) {
                const resp = await fetch(
                  `${this.localeUrlBase}cart/change.js`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    },
                    body: JSON.stringify({
                      id: currentFreeItem.key,
                      quantity: currentFreeItem.quantity,
                      selling_plan: parseInt(sellingPlanId, 10),
                    }),
                  }
                );
                if (resp.ok) {
                  // Use the cart/change.js response directly as the final cart
                  bxgyFinalCart = await resp.json();
                } else {
                  console.error(
                    "[BXGY] cart/change.js failed:",
                    resp.status,
                    await resp.text()
                  );
                }
              }
            }
          } catch (error) {
            console.error("[BXGY] Failed to convert free item:", error);
            this.isBxgyConverting = false;
          }
        }

        // If deleting a progressive gift, mark it as declined so it won't be re-added
        if (isProgressiveGift && progressiveGiftItemId) {
          const attributes = {};
          attributes[`_atlas_declined_gift_${progressiveGiftItemId}`] = "true";
          await fetch(`${this.localeUrlBase}cart/update.js`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ attributes }),
          });
        }

        this.updateHeaderCartIconQuantityBubble();

        // Use the BXGY cart response directly if available, otherwise fetch fresh
        const cart = bxgyFinalCart ||
          (await fetch(`${this.localeUrlBase}cart.js`).then((res) =>
            res.json()
          ));
        this.deleteCartItemLoadingKeys.delete(key);
        bxgyFreeItemsToConvert.forEach((f) =>
          this.deleteCartItemLoadingKeys.delete(f.key)
        );

        // After BXGY conversion, skip adjustProgressiveGiftsByBundleTier to prevent
        // an intermediate re-render that briefly shows the wrong price
        if (bxgyFinalCart) {
          this.isAdjustingProgressiveGifts = true;
        }
        this.updateCartItems(cart);
        if (bxgyFinalCart) {
          this.isAdjustingProgressiveGifts = false;
          this.isBxgyConverting = false;
        }
      } catch (e) {
        // Optionally handle error
        console.error("Failed to delete cart item", e);
      }
    }

    async plusMinusButtonChangeCartItemQuantity(key, newQuantity, type) {
      try {
        if (type === "minus") {
          this.quantityMinusLoadingKeys.add(key);
        } else if (type === "plus") {
          this.quantityPlusLoadingKeys.add(key);
        }
        this.renderCartItems();
        await fetch(`${this.localeUrlBase}cart/change.js`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ id: key, quantity: newQuantity }),
        });

        this.updateHeaderCartIconQuantityBubble();

        // Fetch updated cart and re-render
        const cart = await fetch(`${this.localeUrlBase}cart.js`).then((res) =>
          res.json()
        );
        if (type === "minus") {
          this.quantityMinusLoadingKeys.delete(key);
        } else if (type === "plus") {
          this.quantityPlusLoadingKeys.delete(key);
        }
        this.updateCartItems(cart);
      } catch (e) {
        console.error("Failed to change cart item quantity", e);
      }
    }

    async updateCartItemSubscription(itemKey, sellingPlanId) {
      try {
        // Add loading state for this item
        this.deleteCartItemLoadingKeys.add(itemKey);
        this.renderCartItems();

        // Find the item in the current cart to get its quantity
        const currentItem = this.cart.items.find(
          (item) => item.key === itemKey
        );
        if (!currentItem) {
          console.error("Item not found in cart:", itemKey);
          return;
        }

        // Prepare the update payload
        const payload = {
          id: itemKey,
          quantity: currentItem.quantity,
        };

        // Add selling plan if provided, otherwise remove it
        if (sellingPlanId) {
          // Extract numeric ID from GID (e.g., "gid://shopify/SellingPlan/123" -> "123")
          const numericId = sellingPlanId.split("/").pop();
          payload.selling_plan = numericId;
        } else {
          // To remove a selling plan, set it to null or empty string
          payload.selling_plan = null;
        }

        // Update the cart item
        const response = await fetch(`${this.localeUrlBase}cart/change.js`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to update subscription");
        }

        // Fetch updated cart and re-render
        const cart = await fetch(`${this.localeUrlBase}cart.js`).then((res) =>
          res.json()
        );

        this.deleteCartItemLoadingKeys.delete(itemKey);
        this.updateCartItems(cart);
      } catch (e) {
        console.error("Failed to update cart item subscription", e);
        // Remove loading state on error
        this.deleteCartItemLoadingKeys.delete(itemKey);
        this.renderCartItems();
      }
    }

    updateHeaderCartIconQuantityBubble() {
      // Find the cart bubble element (Dawn: #cart-icon-bubble, Horizon: .cart-bubble)
      const bubble = document.querySelector('#cart-icon-bubble')
        || document.querySelector('.cart-bubble')
        || document.querySelector('[data-cart-count]');
      if (!bubble) return;

      // Find the Shopify section that wraps this bubble
      const sectionEl = bubble.closest('[id^="shopify-section-"]');
      if (!sectionEl) return;

      const sectionId = sectionEl.id.replace('shopify-section-', '');

      // Use Section Rendering API to get fresh HTML from Shopify
      fetch(`${window?.Shopify?.routes?.root || "/"}?section_id=${sectionId}`)
        .then((res) => res.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const newBubble = doc.querySelector('#cart-icon-bubble')
            || doc.querySelector('.cart-bubble')
            || doc.querySelector('[data-cart-count]');
          if (newBubble) {
            bubble.replaceWith(newBubble);
          }
        })
        .catch((error) => {
          console.error("Failed to update cart drawer bubble", error);
        });
    }

    updateQuantityInDrawerHeaderTitle(filteredCartItems) {
      const headerH2 = this.drawer.querySelector(
        ".atlas-upsell-cart-drawer-header-h2"
      );
      if (headerH2 && this.config) {
        const qty = filteredCartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        headerH2.innerHTML = renderTitleWithQuantityBadge(
          this.config.cart_drawer_title_text,
          qty
        );
      }
    }
    /* #endregion */

    /* #region - Progress Reward Bar Functions - */
    renderProgressReward(items_subtotal_price) {
      const container = this.drawer.querySelector(
        ".atlas-upsell-cart-progress-reward-container"
      );
      if (!container || !this.config.progress_rewards) return;

      container.style.display = "";
      container.style.height = "100px";

      const progressRewards = this.config.progress_rewards;

      // Find the next unachieved reward to show progress towards
      const getNextUnachievedReward = () => {
        // Ensure rewards are sorted by minimum_amount ascending
        const sortedRewards = [...progressRewards].sort(
          (a, b) => parseFloat(a.minimum_amount) - parseFloat(b.minimum_amount)
        );
        for (let i = 0; i < sortedRewards.length; i++) {
          const reward = sortedRewards[i];
          const minAmount = parseFloat(reward.minimum_amount);
          if (!isNaN(minAmount)) {
            let minAmountInShopCurrencyCents = Math.round(minAmount * 100);
            let minAmountInPresentmentCurrencyCents =
              minAmountInShopCurrencyCents;

            // Currency conversion
            if (window?.Shopify?.currency?.rate) {
              const conversionRate = parseFloat(window.Shopify.currency.rate);
              if (!isNaN(conversionRate)) {
                minAmountInPresentmentCurrencyCents =
                  minAmountInShopCurrencyCents * conversionRate;
              }
            }

            if (items_subtotal_price < minAmountInPresentmentCurrencyCents) {
              return {
                reward,
                threshold: minAmountInPresentmentCurrencyCents,
                index: i,
              };
            }
          }
        }

        // If all rewards are achieved, show the last one's "after achieved" text
        const lastReward = sortedRewards[sortedRewards.length - 1];
        const lastMinAmount = parseFloat(lastReward.minimum_amount);
        let lastThreshold = Math.round(lastMinAmount * 100);

        if (window?.Shopify?.currency?.rate) {
          const conversionRate = parseFloat(window.Shopify.currency.rate);
          if (!isNaN(conversionRate)) {
            lastThreshold = lastThreshold * conversionRate;
          }
        }

        // Return index as sortedRewards.length - 1 for consistency with React preview
        return {
          reward: lastReward,
          threshold: lastThreshold,
          index: sortedRewards.length - 1,
        };
      };

      // Find the highest achieved reward
      const getHighestAchievedReward = () => {
        // Ensure rewards are sorted by minimum_amount ascending
        const sortedRewards = [...progressRewards].sort(
          (a, b) => parseFloat(a.minimum_amount) - parseFloat(b.minimum_amount)
        );
        let highestAchieved = null;

        for (let i = 0; i < sortedRewards.length; i++) {
          const reward = sortedRewards[i];
          const minAmount = parseFloat(reward.minimum_amount);
          if (!isNaN(minAmount)) {
            let minAmountInShopCurrencyCents = Math.round(minAmount * 100);
            let minAmountInPresentmentCurrencyCents =
              minAmountInShopCurrencyCents;

            // Currency conversion
            if (window?.Shopify?.currency?.rate) {
              const conversionRate = parseFloat(window.Shopify.currency.rate);
              if (!isNaN(conversionRate)) {
                minAmountInPresentmentCurrencyCents =
                  minAmountInShopCurrencyCents * conversionRate;
              }
            }

            if (items_subtotal_price >= minAmountInPresentmentCurrencyCents) {
              highestAchieved = {
                reward,
                threshold: minAmountInPresentmentCurrencyCents,
                index: i,
              };
            }
          }
        }

        return highestAchieved;
      };

      const nextRewardData = getNextUnachievedReward();
      const highestAchievedData = getHighestAchievedReward();

      // Use highest achieved reward for display if available, otherwise use next unachieved
      const displayReward = highestAchievedData || nextRewardData;
      const nextReward = nextRewardData.reward;
      const threshold = nextRewardData.threshold;

      // Calculate progress
      let amountAwayCents = 0;

      if (threshold > 0) {
        amountAwayCents = Math.max(0, threshold - items_subtotal_price);
      }

      const amountAwayFormatted = formatMoney({
        cents: amountAwayCents,
        format: this.moneyFormat,
      });

      // Generate progress text - show highest achieved reward if available
      let progressText = "";
      if (
        highestAchievedData &&
        highestAchievedData.index === progressRewards.length - 1
      ) {
        // If the highest achieved reward is the last one, show its after_achieved_text
        progressText = escapeHtml(highestAchievedData.reward.after_achieved_text);
      } else {
        // Show progress toward next unachieved reward
        progressText = escapeHtml(nextReward.before_achieved_text)
          .replace("{AMOUNT}", amountAwayFormatted)
          .replace("{{AMOUNT}}", amountAwayFormatted);
      }

      // Generate progress bar HTML with multiple segments
      const progressBarHtml = this.generateMultiRewardProgressBar(
        items_subtotal_price,
        progressRewards
      );

      const progressRewardHtml = `
      ${
        this.config?.progress_reward_enabled
          ? `
        <div class="atlas-upsell-cart-progress-reward-text">
          ${progressText}
        </div>
        <div class="atlas-upsell-cart-progress-reward-bar-container" style="height: 50px; padding-right: 20px;">
          ${progressBarHtml}
        </div>
        `
          : ""
      }
    `;
      container.innerHTML = progressRewardHtml; // insert html into container

      // Check if any Free Shipping reward is achieved and update the shipping line visibility
      this.updateFreeShippingLineVisibility(
        items_subtotal_price,
        progressRewards
      );
    }

    // Update the free shipping line visibility based on achieved rewards or cart attributes
    updateFreeShippingLineVisibility(items_subtotal_price, progressRewards) {
      const freeShippingLine = document.querySelector(
        "#atlas-upsell-cart-free-shipping-line"
      );
      if (!freeShippingLine) return;

      // Check if any Free Shipping reward is achieved (progress rewards bar)
      let freeShippingAchieved = false;

      if (progressRewards && progressRewards.length > 0) {
        for (const reward of progressRewards) {
          if (reward.type === "Free Shipping") {
            const minAmount = parseFloat(reward.minimum_amount);
            if (!isNaN(minAmount)) {
              let minAmountInShopCurrencyCents = Math.round(minAmount * 100);
              let minAmountInPresentmentCurrencyCents =
                minAmountInShopCurrencyCents;

              // Currency conversion
              if (window?.Shopify?.currency?.rate) {
                const conversionRate = parseFloat(window.Shopify.currency.rate);
                if (!isNaN(conversionRate)) {
                  minAmountInPresentmentCurrencyCents =
                    minAmountInShopCurrencyCents * conversionRate;
                }
              }

              if (items_subtotal_price >= minAmountInPresentmentCurrencyCents) {
                freeShippingAchieved = true;
                break;
              }
            }
          }
        }
      }

      // Also check cart attributes for progressive gift free shipping (bundle tiers)
      if (!freeShippingAchieved && this.cart && this.cart.attributes) {
        // Check for any _atlas_free_shipping_* attribute set to "true"
        for (const [key, value] of Object.entries(this.cart.attributes)) {
          if (key.startsWith("_atlas_free_shipping_") && value === "true") {
            freeShippingAchieved = true;
            break;
          }
        }
      }

      // Show or hide the free shipping line
      freeShippingLine.style.display = freeShippingAchieved ? "flex" : "none";
    }

    // Check for free shipping from bundle progressive gifts (cart attributes only)
    updateFreeShippingFromBundleGifts() {
      const freeShippingLine = document.querySelector(
        "#atlas-upsell-cart-free-shipping-line"
      );
      if (!freeShippingLine) return;

      // Check cart attributes for progressive gift free shipping
      let freeShippingAchieved = false;
      if (this.cart && this.cart.attributes) {
        for (const [key, value] of Object.entries(this.cart.attributes)) {
          if (
            key.startsWith("_atlas_free_shipping_") &&
            !key.includes("_min_qty_") &&
            value === "true"
          ) {
            freeShippingAchieved = true;
            break;
          }
        }
      }

      // Show or hide the free shipping line based on bundle gift eligibility
      if (freeShippingAchieved) {
        freeShippingLine.style.display = "flex";
      } else {
        // Only hide if this was shown by bundle gifts (not by progress rewards)
        // Check if progress rewards would show free shipping
        const progressRewards = this.config?.progress_rewards || [];
        const hasFreeShippingReward = progressRewards.some(
          (r) => r.type === "Free Shipping"
        );
        const subtotal = this.cart?.items_subtotal_price || 0;
        let progressFreeShippingAchieved = false;

        if (hasFreeShippingReward) {
          for (const reward of progressRewards) {
            if (reward.type === "Free Shipping") {
              let thresholdCents = Math.round(
                parseFloat(reward.minimum_amount || 0) * 100
              );
              if (window?.Shopify?.currency?.rate) {
                thresholdCents =
                  thresholdCents * parseFloat(window.Shopify.currency.rate);
              }
              if (subtotal >= thresholdCents) {
                progressFreeShippingAchieved = true;
                break;
              }
            }
          }
        }

        // Only hide if progress rewards don't qualify for free shipping either
        if (!progressFreeShippingAchieved) {
          freeShippingLine.style.display = "none";
        }
      }
    }

    // Generate multi-reward progress bar with segments and icons
    generateMultiRewardProgressBar(items_subtotal_price, progressRewards) {
      if (!progressRewards || progressRewards.length === 0) {
        return '<div class="atlas-upsell-cart-progress-reward-bar-background"></div>';
      }

      // Sort rewards by minimum amount to ensure proper order
      const sortedRewards = [...progressRewards].sort(
        (a, b) => parseFloat(a.minimum_amount) - parseFloat(b.minimum_amount)
      );

      // Calculate max threshold for positioning
      const maxThreshold = Math.max(
        ...sortedRewards.map((r) => parseFloat(r.minimum_amount) || 100)
      );
      let maxThresholdCents = Math.round(maxThreshold * 100);

      if (window?.Shopify?.currency?.rate) {
        const conversionRate = parseFloat(window.Shopify.currency.rate);
        if (!isNaN(conversionRate)) {
          maxThresholdCents = maxThresholdCents * conversionRate;
        }
      }

      // Generate icons and labels
      let icons = "";
      let labels = "";
      let progressSegments = "";

      // Calculate equal segment width
      const segmentWidth = 100 / sortedRewards.length;

      // Generate progress segments for each tier
      sortedRewards.forEach((reward, index) => {
        const minAmount = parseFloat(reward.minimum_amount);
        if (isNaN(minAmount)) return;

        let thresholdCents = Math.round(minAmount * 100);
        if (window?.Shopify?.currency?.rate) {
          const conversionRate = parseFloat(window.Shopify.currency.rate);
          if (!isNaN(conversionRate)) {
            thresholdCents = thresholdCents * conversionRate;
          }
        }

        // Calculate position for icons and labels (at end of each equal segment)
        const iconPositionPercent = (index + 1) * segmentWidth;

        // Generate icon
        const isAchieved = items_subtotal_price >= thresholdCents;
        const iconBgColor = isAchieved
          ? reward.bar_color || "#93D3FF"
          : "white";
        const iconBorder = isAchieved ? "none" : "3px solid #e1e3e5";

        icons += `
          <div class="atlas-upsell-cart-progress-icon"
               style="position: absolute; left: ${iconPositionPercent}%; transform: translateX(-50%); z-index: 2; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; border: ${iconBorder}; background-color: ${iconBgColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${this.generateRewardIcon(reward, isAchieved)}
          </div>
        `;

        // Generate label (only if multiple rewards)
        if (sortedRewards.length > 1) {
          const thresholdFormatted = formatMoney({
            cents: thresholdCents,
            format: this.moneyFormat,
          });

          labels += `
            <div class="atlas-upsell-cart-progress-label"
                 style="position: absolute; left: ${iconPositionPercent}%; transform: translateX(-50%); text-align: center; min-width: 40px; font-size: 11px; color: var(--cart_drawer_text_color); opacity: 0.8;">
              ${thresholdFormatted}
            </div>
          `;
        }

        // Generate progress segment for this tier (equally distributed)
        const segmentStart = index * segmentWidth;
        const segmentEnd = (index + 1) * segmentWidth;

        // Check if this tier is achieved
        if (items_subtotal_price >= thresholdCents) {
          // Fully fill this segment
          progressSegments += `
            <div style="position: absolute; top: 50%; left: calc(8px + ${segmentStart}%); transform: translateY(-50%); height: 4px; width: ${segmentWidth}%; background-color: ${reward.bar_color}; border-radius: 4px; transition: width 0.3s ease;"></div>
          `;
        } else if (index > 0) {
          // Check if we're in progress toward this tier
          const prevReward = sortedRewards[index - 1];
          const prevThresholdCents = Math.round(
            parseFloat(prevReward.minimum_amount) * 100
          );
          let adjustedPrevThresholdCents = prevThresholdCents;
          if (window?.Shopify?.currency?.rate) {
            const conversionRate = parseFloat(window.Shopify.currency.rate);
            if (!isNaN(conversionRate)) {
              adjustedPrevThresholdCents = prevThresholdCents * conversionRate;
            }
          }

          if (items_subtotal_price > adjustedPrevThresholdCents) {
            // Partially fill this segment based on progress toward this tier
            const progressInTier =
              (items_subtotal_price - adjustedPrevThresholdCents) /
              (thresholdCents - adjustedPrevThresholdCents);
            const fillWidth = segmentWidth * Math.min(1, progressInTier);

            if (fillWidth > 0) {
              progressSegments += `
                <div style="position: absolute; top: 50%; left: calc(8px + ${segmentStart}%); transform: translateY(-50%); height: 4px; width: ${fillWidth}%; background-color: ${reward.bar_color}; border-radius: 4px; transition: width 0.3s ease;"></div>
              `;
            }
          }
        } else if (index === 0 && items_subtotal_price > 0) {
          // First tier - partially fill based on progress toward first threshold
          const progressInTier = items_subtotal_price / thresholdCents;
          const fillWidth = segmentWidth * Math.min(1, progressInTier);

          if (fillWidth > 0) {
            progressSegments += `
              <div style="position: absolute; top: 50%; left: calc(8px + ${segmentStart}%); transform: translateY(-50%); height: 4px; width: ${fillWidth}%; background-color: ${reward.bar_color}; border-radius: 4px; transition: width 0.3s ease;"></div>
            `;
          }
        }
      });

      // Generate background segments for each tier
      let backgroundSegments = "";
      sortedRewards.forEach((reward, index) => {
        const segmentStart = index * segmentWidth;
        backgroundSegments += `
          <div style="position: absolute; top: 50%; left: calc(8px + ${segmentStart}%); transform: translateY(-50%); height: 4px; width: ${segmentWidth}%; background-color: ${reward.bar_background_color}; border-radius: 4px;"></div>
        `;
      });

      return `
        <div class="atlas-upsell-cart-progress-reward-bar">
          <!-- Background segments -->
          ${backgroundSegments}

          <!-- Progress segments -->
          ${progressSegments}

          <!-- Icons -->
          ${icons}
        </div>
        ${sortedRewards.length > 1 ? `<div class="atlas-upsell-cart-progress-labels" style="display: flex; justify-content: space-between; margin-top: 4px; position: relative; overflow: hidden;">${labels}</div>` : ""}
      `;
    }

    // Generate reward icon based on type
    generateRewardIcon(reward, isAchieved) {
      const iconColor = isAchieved ? "white" : "#6d7175";

      if (reward.type === "Discount") {
        return `
          <svg width="24" height="24" viewBox="0 0 20 20" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));">
            <circle cx="10" cy="10" r="6" fill="transparent"/>
            <g transform="translate(10, 10) scale(0.9) translate(-10, -10)">
              <path d="M13 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="${iconColor}"></path>
              <path fill-rule="evenodd" d="M11.276 3.5a3.75 3.75 0 0 0-2.701 1.149l-4.254 4.417a2.75 2.75 0 0 0 .036 3.852l2.898 2.898a2.5 2.5 0 0 0 3.502.033l4.747-4.571a3.25 3.25 0 0 0 .996-2.341v-2.187a3.25 3.25 0 0 0-3.25-3.25h-1.974Zm-1.62 2.19a2.25 2.25 0 0 1 1.62-.69h1.974c.966 0 1.75.784 1.75 1.75v2.187c0 .475-.194.93-.536 1.26l-4.747 4.572a1 1 0 0 1-1.401-.014l-2.898-2.898a1.25 1.25 0 0 1-.016-1.75l4.253-4.418Z" fill="${iconColor}"></path>
            </g>
          </svg>
        `;
      }

      if (reward.type === "Free Shipping") {
        return `
          <svg width="24" height="24" viewBox="0 0 20 20" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));">
            <circle cx="10" cy="10" r="6" fill="transparent"/>
            <g transform="translate(10, 10) scale(0.9) translate(-10, -10)">
              <path fill-rule="evenodd" d="M4 5.25a.75.75 0 0 1 .75-.75h6.991a2.75 2.75 0 0 1 2.645 1.995l.427 1.494a.25.25 0 0 0 .18.173l1.681.421a1.75 1.75 0 0 1 1.326 1.698v1.219a1.75 1.75 0 0 1-1.032 1.597 2.5 2.5 0 1 1-4.955.153h-3.025a2.5 2.5 0 1 1-4.78-.75h-.458a.75.75 0 0 1 0-1.5h2.5c.03 0 .06.002.088.005a2.493 2.493 0 0 1 1.947.745h4.43a2.493 2.493 0 0 1 1.785-.75c.698 0 1.33.286 1.783.748a.25.25 0 0 0 .217-.248v-1.22a.25.25 0 0 0-.19-.242l-1.682-.42a1.75 1.75 0 0 1-1.258-1.217l-.427-1.494a1.25 1.25 0 0 0-1.202-.907h-6.991a.75.75 0 0 1-.75-.75Zm2.5 9.25a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="${iconColor}"></path>
              <path d="M3.25 8a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5h-5Z" fill="${iconColor}"></path>
            </g>
          </svg>
        `;
      }

      // Default checkmark for other reward types
      return isAchieved
        ? `
        <svg width="24" height="24" viewBox="0 0 20 20" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));">
          <circle cx="10" cy="10" r="6" fill="transparent"/>
          <path d="M7 10L9 12L13 8" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `
        : `
        <svg width="24" height="24" viewBox="0 0 20 20" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));">
          <circle cx="10" cy="10" r="6" fill="transparent"/>
        </svg>
      `;
    }

    hideProgressReward() {
      const container = this.drawer.querySelector(
        ".atlas-upsell-cart-progress-reward-container"
      );
      if (!container) return;
      container.style.display = "none";

      // Also hide the free shipping line when progress rewards are hidden
      const freeShippingLine = document.querySelector(
        "#atlas-upsell-cart-free-shipping-line"
      );
      if (freeShippingLine) {
        freeShippingLine.style.display = "none";
      }
    }
    /* #endregion */

    /* #region - Announcement Bar Functions - */
    showAnnouncementBar() {
      const announcementBar = this.drawer.querySelector(
        ".atlas-upsell-cart-announcement"
      );
      if (announcementBar) {
        announcementBar.style.display = ""; // Reset to default display
      }
    }

    hideAnnouncementBar() {
      const announcementBar = this.drawer.querySelector(
        ".atlas-upsell-cart-announcement"
      );
      if (announcementBar) {
        announcementBar.style.display = "none";
      }
    }

    stopAnnouncementTimer() {
      // console.log("stopAnnouncementTimer called.");
      if (this.announcementTimerInterval) {
        clearInterval(this.announcementTimerInterval);
        this.announcementTimerInterval = null;
      }
    }

    startAnnouncementTimer() {
      // console.log(
      //   "startAnnouncementTimer called. Configured minutes:",
      //   this.config?.announcement_timer_minutes,
      //   "seconds:",
      //   this.config?.announcement_timer_seconds
      // );
      this.stopAnnouncementTimer(); // Clear any existing timer

      if (!this.config || !this.config.announcement_text?.includes("{TIMER}")) {
        return;
      }

      const announcementBar = this.drawer.querySelector(
        ".atlas-upsell-cart-announcement"
      );
      if (!announcementBar) return;

      this.showAnnouncementBar();

      const timerSpan = document.getElementById(
        "atlas-announcement-timer-value"
      );
      if (!timerSpan) {
        console.warn("Timer span not found in announcement bar.");
        return;
      }

      let minutes = parseInt(this.config.announcement_timer_minutes, 10);
      let seconds = parseInt(this.config.announcement_timer_seconds, 10);

      if (
        isNaN(minutes) ||
        isNaN(seconds) ||
        minutes < 0 ||
        seconds < 0 ||
        seconds >= 60
      ) {
        console.error(
          "Invalid timer minutes or seconds in config for starting timer. Minutes:",
          minutes,
          "Seconds:",
          seconds
        );
        timerSpan.textContent = "{TIMER}"; // Show placeholder if config is bad
        return;
      }

      let totalSeconds = minutes * 60 + seconds;
      // console.log("Initial totalSeconds:", totalSeconds);

      const updateDisplay = () => {
        const displayMinutes = Math.floor(totalSeconds / 60);
        const displaySeconds = totalSeconds % 60;
        const timerValue = `${String(displayMinutes).padStart(2, "0")}:${String(displaySeconds).padStart(2, "0")}`;
        timerSpan.textContent = timerValue;
        // console.log(
        //   "updateDisplay called. Updating timer to:",
        //   timerValue
        // );
      };

      if (totalSeconds < 0) {
        // Should ideally not happen with validated minutes/seconds
        this.hideAnnouncementBar();
        return;
      }

      updateDisplay(); // Initial display

      this.announcementTimerInterval = setInterval(() => {
        // console.log(
        //   "Timer tick. totalSeconds before decrement:",
        //   totalSeconds
        // );
        totalSeconds--;
        if (totalSeconds < 0) {
          this.stopAnnouncementTimer();
          this.hideAnnouncementBar();
        } else {
          updateDisplay();
        }
      }, 1000);
    }
    /* #endregion */

    /* #region - Shipping Protection Functions - */

    /*  Shipping Protection Config:

      "shipping_protection_enabled": false,
      "shipping_protection_title": "Shipping Protection",
      "shipping_protection_description": "Protect your order from damage, loss, or theft...",
      "shipping_protection_price": "2.50",
      "shipping_protection_heading_color": "#202223",
      "shipping_protection_text_color": "#6D7175",
      "shipping_protection_switch_color": "#008060",
    */

    showShippingProtection() {
      const shippingProtectionContainer = this.drawer.querySelector(
        ".atlas-upsell-cart-shipping-protection-container"
      );

      if (shippingProtectionContainer) {
        shippingProtectionContainer.style.display = ""; // Reset to default display
      }
    }

    hideShippingProtection() {
      const shippingProtectionContainer = this.drawer.querySelector(
        ".atlas-upsell-cart-shipping-protection-container"
      );
      if (shippingProtectionContainer) {
        shippingProtectionContainer.style.display = "none";
      }
    }
    /* #endregion */

    /* #region - Compare At Price Functions - */

    getCachedCompareAtPrices() {
      let compareAtPricesCache = {};
      try {
        const cachedData = sessionStorage.getItem(
          "atlas_cart_upsells_compare_at_prices"
        );
        if (cachedData) {
          compareAtPricesCache = JSON.parse(cachedData);
        }
      } catch (e) {
        console.error("Error parsing compare at prices cache:", e);
        compareAtPricesCache = {};
      }
      return compareAtPricesCache;
    }

    getAndRenderCompareAtPrices() {
      const priceContainers = document.querySelectorAll(
        ".atlas-upsell-cart-item-price-container"
      );
      // console.log("priceContainers");
      // console.log(priceContainers);

      const compareAtPricesCache = this.getCachedCompareAtPrices();

      priceContainers.forEach((priceContainer) => {
        const compareAtDiv = priceContainer.querySelector(
          ".atlas-upsell-cart-item-compare-at-price"
        );
        if (compareAtDiv) {
          // console.log("getAndRenderCompareAtPrices div");
          // console.log(compareAtDiv);
          const productHandle = compareAtDiv.getAttribute(
            "data-product-handle"
          );
          const variantId = compareAtDiv.getAttribute("data-variant-id");
          let quantity = compareAtDiv.getAttribute("data-quantity");
          quantity = quantity ? parseInt(quantity) : 1;

          const handleRenderNotUsingProductCompareAtPrice = () => {
            const amountSavedDiv = priceContainer.querySelector(
              ".atlas-upsell-cart-item-total-saved-on-line"
            );
            const originalPrice =
              parseInt(
                amountSavedDiv.getAttribute("data-line-original-price")
              ) || 0;

            const finalPrice =
              parseInt(amountSavedDiv.getAttribute("data-line-final-price")) ||
              0;

            const amountSaved = originalPrice - finalPrice;
            if (amountSaved > 0) {
              // a discount is being applied to this line. We must render the amount saved on AND a compare price.
              if (this.config?.cart_drawer_show_save_amount) {
                const saveText = this.formatSaveAmountText(
                  amountSaved,
                  originalPrice
                );
                amountSavedDiv.innerHTML = `<div style="word-wrap: break-word;">${saveText}</div>`;
                amountSavedDiv.style.display = "flex";
                amountSavedDiv.style.justifyContent = "flex-end";

                // Also update mobile version
                const amountSavedDivMobile = priceContainer
                  .closest(".atlas-upsell-cart-item-outer-container")
                  ?.querySelector(
                    ".atlas-upsell-cart-item-total-saved-on-line-mobile"
                  );
                if (amountSavedDivMobile) {
                  amountSavedDivMobile.innerHTML = `<div style="word-wrap: break-word;">${saveText}</div>`;
                  amountSavedDivMobile.style.display = "flex";
                }
              }

              compareAtDiv.innerHTML = `${formatMoney({
                cents: originalPrice,
                format: this.moneyFormat,
              })}`;
              compareAtDiv.style.display = "";
            }
          };
          const useProductCompareAtPrice =
            this.config?.cart_drawer_use_product_compare_at;

          // Check if the variant price is in the cache
          if (!useProductCompareAtPrice) {
            handleRenderNotUsingProductCompareAtPrice();
          } else if (compareAtPricesCache?.[variantId]) {
            const compareAmountInCents =
              compareAtPricesCache[variantId] * quantity;

            // console.log("compareAtPricesCache[variantId]");
            // console.log(compareAtPricesCache[variantId]);

            if (compareAmountInCents > 0) {
              compareAtDiv.innerHTML = `${formatMoney({
                cents: compareAmountInCents,
                format: this.moneyFormat,
              })}`;
              compareAtDiv.style.display = "";
              this.renderAmountSaved(priceContainer, compareAmountInCents);
            }
          } else if (
            productHandle &&
            variantId &&
            compareAtPricesCache?.[variantId] !== null // is null if product has no compare at price
          ) {
            // fetch the compare at price from the product handle and variant id
            fetch(`/products/${productHandle}.js`)
              .then((res) => res.json())
              .then((product) => {
                // console.log("getAndRenderCompareAtPrices product");
                // console.log(product);

                const compareAtPrice = product.variants.find(
                  (variant) => `${variant.id}` === variantId
                ).compare_at_price;

                // Update the cache object and save it back to session storage
                const latestCache = this.getCachedCompareAtPrices(); // get the latest cache becaue it may have been updated while fetching
                latestCache[variantId] = compareAtPrice;
                sessionStorage.setItem(
                  "atlas_cart_upsells_compare_at_prices",
                  JSON.stringify(latestCache)
                );

                const compareAmountInCents = compareAtPrice * quantity;

                if (compareAmountInCents > 0) {
                  compareAtDiv.innerHTML = `${formatMoney({
                    cents: compareAmountInCents,
                    format: this.moneyFormat,
                  })}`;
                  compareAtDiv.style.display = "";

                  this.renderAmountSaved(priceContainer, compareAmountInCents);
                }
              })
              .catch((error) => {
                console.error("Error fetching compare at price:", error);
              });
          } else if (compareAtPricesCache?.[variantId] === null) {
            // now we know that this product has no compare-at price.
            // If a discount is being applied, we need to render the amount saved on line:
            handleRenderNotUsingProductCompareAtPrice();
          }
        }
      });
    }
    /* #endregion */

    formatSaveAmountText(amountCents, originalCents) {
      const template =
        this.config.cart_drawer_save_amount_text || "(Save {amount})";
      const formattedAmount = formatMoney({
        cents: amountCents,
        format: this.moneyFormat,
      });
      const percentageSaved =
        originalCents > 0 ? (amountCents / originalCents) * 100 : 0;
      return escapeHtml(template)
        .replace("{amount}", formattedAmount)
        .replace("{percentage}", `${percentageSaved.toFixed(0)}%`);
    }

    renderAmountSaved(priceContainer, compareAtPrice) {
      if (!this.config?.cart_drawer_show_save_amount) {
        return;
      }
      const amountSavedDiv = priceContainer.querySelector(
        ".atlas-upsell-cart-item-total-saved-on-line"
      );
      if (amountSavedDiv) {
        const finalPrice =
          parseInt(amountSavedDiv.getAttribute("data-line-final-price")) || 0;
        if (compareAtPrice > 0 && finalPrice > 0) {
          const savingsAmount = compareAtPrice - finalPrice;
          if (savingsAmount > 0) {
            const saveText = this.formatSaveAmountText(
              savingsAmount,
              compareAtPrice
            );
            amountSavedDiv.innerHTML = `
              <div style="word-wrap: break-word;">${saveText}</div>
            `;

            amountSavedDiv.style.display = "";

            // Also update mobile version
            const amountSavedDivMobile = priceContainer
              .closest(".atlas-upsell-cart-item-outer-container")
              ?.querySelector(
                ".atlas-upsell-cart-item-total-saved-on-line-mobile"
              );
            if (amountSavedDivMobile) {
              amountSavedDivMobile.innerHTML = `<div style="word-wrap: break-word;">${saveText}</div>`;
              amountSavedDivMobile.style.display = "flex";
            }
          }
        }
      }
    }

    /* #region - Cart Attribute Functions - */
    setCartAttribute(active) {
      fetch(`${this.localeUrlBase}cart.js`)
        .then((res) => res.json())
        .then((cart) => {
          const attributeKey = "atlas-cart-drawer-active";
          const configurationAttributeKey =
            "atlas-cart-upsell-configuration-id";
          const sessionAttributeKey = "atlas_session_id";
          const attributes = cart.attributes || {};
          const attributeSet = attributes[attributeKey] === "true";
          const currentConfigId = attributes[configurationAttributeKey];
          const desiredConfigId =
            this.config && this.config.id ? String(this.config.id) : null;

          // Get or generate session ID for conversion tracking
          let sessionId = sessionStorage.getItem("atlas_session_id");
          if (!sessionId) {
            sessionId =
              "session_" +
              Date.now() +
              "_" +
              Math.random().toString(36).substring(7);
            sessionStorage.setItem("atlas_session_id", sessionId);
          }

          const currentSessionId = attributes[sessionAttributeKey];
          const attributesMatch =
            (!active && !attributeSet && !currentConfigId) ||
            (active && attributeSet && currentConfigId === desiredConfigId && currentSessionId === sessionId);

          if (attributesMatch) {
            return;
          }

          if (active) {
            fetch(`${this.localeUrlBase}cart/update.js`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                attributes: {
                  [attributeKey]: "true",
                  [sessionAttributeKey]: sessionId,
                  ...(desiredConfigId
                    ? { [configurationAttributeKey]: desiredConfigId }
                    : {}),
                },
              }),
            });
          } else {
            fetch(`${this.localeUrlBase}cart/update.js`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                attributes: {
                  [attributeKey]: null,
                  [configurationAttributeKey]: null,
                },
              }),
            });
          }
        })
        .catch((error) => {
          console.error("Error setting cart attribute:", error);
        });
    }
    /* #endregion */
  }

  /* #region - Theme-Agnostic Cart Drawer Functions - */

  /**
   * Neutralize the host theme's cart drawer at the JS level.
   * Patches CartDrawer.prototype (Dawn, Refresh, Sense) and dialog.showModal (Horizon).
   * Idempotent — safe to call multiple times (re-run catches late-loading scripts).
   */
  const neutralizeThemeCartDrawer = () => {
    // --- A) Patch CartDrawer prototype (Dawn, Refresh, Sense, etc.) ---
    if (typeof CartDrawer !== 'undefined' && CartDrawer.prototype) {
      if (!themeOverridesActive) {
        originalThemeCartOpen = CartDrawer.prototype.open;
        originalThemeCartClose = CartDrawer.prototype.close;
      }
      CartDrawer.prototype.open = function (...args) {
        if (atlasUpsellCartDrawerInstance) {
          atlasUpsellCartDrawerInstance.open();
        } else if (originalThemeCartOpen) {
          originalThemeCartOpen.apply(this, args);
        }
      };
      CartDrawer.prototype.close = function (...args) {
        if (atlasUpsellCartDrawerInstance) {
          atlasUpsellCartDrawerInstance.close();
        } else if (originalThemeCartClose) {
          originalThemeCartClose.apply(this, args);
        }
      };
      themeOverridesActive = true;
    }

    // --- B) Patch existing <dialog> instances used as cart drawers (Horizon, etc.) ---
    const cartDialogs = document.querySelectorAll(
      'dialog.cart-drawer__dialog, cart-drawer-component dialog, dialog[aria-labelledby*="cart" i]'
    );
    cartDialogs.forEach(dialog => {
      if (dialog.__atlasNeutralized) return;
      dialog.__atlasNeutralized = true;

      // Close if currently open (removes from browser top layer)
      if (dialog.open) {
        try { dialog.close(); } catch (e) { /* ignore */ }
        dialog.removeAttribute('open');
      }

      // Patch showModal/show so theme can never re-open it
      dialog.showModal = function () {
        if (atlasUpsellCartDrawerInstance) {
          atlasUpsellCartDrawerInstance.open();
        }
      };
      dialog.show = function () {
        if (atlasUpsellCartDrawerInstance) {
          atlasUpsellCartDrawerInstance.open();
        }
      };
    });

    // --- C) One-time cleanup of any scroll lock left by theme drawer ---
    if (!themeDrawerNeutralized) {
      document.body.classList.remove('overflow-hidden');
      document.body.removeAttribute('scroll-lock');
      document.documentElement.removeAttribute('scroll-lock');
      ['overflow', 'position', 'top', 'left', 'right', 'width', 'height'].forEach(prop => {
        if (document.body.style[prop] === 'hidden' || document.body.style[prop] === 'fixed') {
          document.body.style.removeProperty(prop);
        }
      });
    }

    themeDrawerNeutralized = true;
  };

  /**
   * Intercept Shopify AJAX Cart API calls (fetch wrapper).
   * Auto-opens the Atlas drawer on /cart/add. Updates drawer contents on any cart mutation.
   * Idempotent — only installs once.
   */
  const setupCartApiHooks = () => {
    if (cartApiHooksInstalled) return;
    cartApiHooksInstalled = true;

    const originalFetch = window.fetch;
    let cartUpdateDebounceTimer = null;
    let lastCartUpdateFromEvent = 0;
    // Timestamp of the last add-to-cart that our window.fetch wrapper actually
    // handled. Another app (e.g. FastBundle) can capture window.fetch before us,
    // which bypasses our wrapper entirely — in that case this stays stale and the
    // atlas:cart-updated listener below drives the open/render instead.
    let lastAddHandledByFetchHook = 0;

    // Listen for cart updates dispatched directly by bundle.js. This event is
    // emitted regardless of which app owns window.fetch, so it is the reliable
    // open/render trigger when our fetch wrapper has been bypassed by another
    // app that captured window.fetch before us (load-order race). Without this,
    // the bundle adds to the cart server-side but the drawer never opens — the
    // items only appear on a page reload.
    document.addEventListener('atlas:cart-updated', (e) => {
      lastCartUpdateFromEvent = e.detail?.timestamp || Date.now();
      if (cartUpdateDebounceTimer) {
        clearTimeout(cartUpdateDebounceTimer);
        cartUpdateDebounceTimer = null;
      }

      const inst = atlasUpsellCartDrawerInstance;
      if (!inst) return;

      // If our window.fetch wrapper just handled this add (it runs and stamps the
      // flag before bundle.js dispatches this event), it is already opening and
      // rendering the drawer. Don't duplicate that work — at most apply the full
      // cart object if bundle.js sent one.
      if (Date.now() - lastAddHandledByFetchHook < 1000) {
        if (e.detail?.cart?.token) inst.updateCartItems(e.detail.cart);
        return;
      }

      // Fetch wrapper was bypassed — drive the open + render from this event.
      // Open immediately (with a skeleton) for instant feedback, then fetch a
      // full cart so line items, discounts and totals render correctly. Use the
      // localized root so titles come back in the active market's language.

      // Dedup: if a previous fallback fetch is still in flight the drawer is
      // already opening over its skeleton — don't kick off a second fetch/render
      // (e.g. when bundle.js dispatches atlas:cart-updated more than once per add).
      if (inst.isWaitingForCartData) return;
      inst.isWaitingForCartData = true;
      if (inst.drawer && !inst.drawer.classList.contains('is-open')) {
        // Match the fetch-hook path: kill the transition and force a reflow so the
        // skeleton shows instantly (no fade-in). Restored once the cart renders.
        inst.drawer.style.setProperty('transition', 'none', 'important');
        inst.drawer.offsetHeight; // force reflow
        if (typeof inst.showLoadingSkeleton === 'function') inst.showLoadingSkeleton();
        inst.open();
      }
      originalFetch(`${inst.localeUrlBase}cart.js`)
        .then((res) => res.json())
        .then((cart) => {
          inst.isWaitingForCartData = false;
          // Restore transitions for subsequent open/close animations.
          if (inst.drawer) inst.drawer.style.removeProperty('transition');
          inst.updateCartItems(cart);
          if (typeof inst.updateHeaderCartIconQuantityBubble === 'function') {
            inst.updateHeaderCartIconQuantityBubble();
          }
        })
        .catch((error) => {
          console.error('Error fetching cart in atlas:cart-updated fallback:', error);
          // Clear the skeleton even on failure so it can't be stranded.
          inst.isWaitingForCartData = false;
          if (inst.drawer) inst.drawer.style.removeProperty('transition');
          if (typeof inst.renderCartItems === 'function') inst.renderCartItems();
        });
    });

    // Debounced function to fetch cart and update drawer
    const debouncedCartUpdate = () => {
      if (cartUpdateDebounceTimer) {
        clearTimeout(cartUpdateDebounceTimer);
      }
      cartUpdateDebounceTimer = setTimeout(() => {
        if (Date.now() - lastCartUpdateFromEvent < 500) {
          cartUpdateDebounceTimer = null;
          return;
        }
        // Skip debounced update during BXGY conversion to prevent intermediate renders
        if (atlasUpsellCartDrawerInstance?.isBxgyConverting) {
          cartUpdateDebounceTimer = null;
          return;
        }
        if (atlasUpsellCartDrawerInstance) {
          // Use the localized root (e.g. /en-gb/) so cart line-item titles come
          // back in the active market's language. A bare /cart.js falls back to
          // the store's primary language until the next full page reload.
          fetch(`${atlasUpsellCartDrawerInstance.localeUrlBase}cart.js`)
            .then((res) => res.json())
            .then((cart) => {
              atlasUpsellCartDrawerInstance.updateCartItems(cart);
              atlasUpsellCartDrawerInstance.updateHeaderCartIconQuantityBubble();
            })
            .catch((error) => {
              console.error('Error fetching cart after update in AJAX hook:', error);
            });
        }
        cartUpdateDebounceTimer = null;
      }, 300);
    };

    window.fetch = async function (...args) {
      const response = await originalFetch.apply(this, args);
      try {
        let url = '';
        if (typeof args[0] === 'string') url = args[0];
        else if (args[0] instanceof Request) url = args[0].url;

        const isCartAdd = url.includes('/cart/add');
        const isCartMutation = isCartAdd || url.includes('/cart/update') || url.includes('/cart/change');

        if (isCartMutation && atlasUpsellCartDrawerInstance) {
          if (isCartAdd) {
            // Record that our wrapper saw this add so the atlas:cart-updated
            // listener knows it doesn't need to drive the open/render itself.
            lastAddHandledByFetchHook = Date.now();
            // For add-to-cart: fetch cart immediately (no debounce) and open drawer
            // only after items are rendered to avoid the empty cart flash.
            if (cartUpdateDebounceTimer) {
              clearTimeout(cartUpdateDebounceTimer);
              cartUpdateDebounceTimer = null;
            }
            if (Date.now() - lastCartUpdateFromEvent < 500) {
              // bundle.js already sent fresh cart data via atlas:cart-updated event,
              // so just open the drawer — items are already rendered.
              if (!atlasUpsellCartDrawerInstance.drawer?.classList.contains('is-open')) {
                atlasUpsellCartDrawerInstance.open();
              }
            } else {
              // Show skeleton loading and open drawer immediately for instant feedback
              // Block renderCartItems from hiding skeleton until we have correct data
              atlasUpsellCartDrawerInstance.isWaitingForCartData = true;
              const drw = atlasUpsellCartDrawerInstance.drawer;
              // Kill CSS transitions so the skeleton appears instantly without
              // a fade-in. open() handles visibility/opacity/pointer-events.
              drw.style.setProperty('transition', 'none', 'important');
              // Force a reflow so the browser applies the no-transition style
              drw.offsetHeight;
              atlasUpsellCartDrawerInstance.showLoadingSkeleton();
              if (!drw.classList.contains('is-open')) {
                atlasUpsellCartDrawerInstance.open();
              }
              // Debug
              const sk = drw.querySelector('.atlas-cart-loading-skeleton');
              const cont = drw.querySelector('.atlas-upsell-cart-items-container');
              // Delay cart.js fetch slightly to let bundle.js finish all cart mutations
              // (e.g. cart/update.js for attributes) before we render
              setTimeout(() => {
                const fetchAndRender = () => {
                  // Localized root keeps add-to-cart titles in the market language.
                  originalFetch(`${atlasUpsellCartDrawerInstance.localeUrlBase}cart.js`)
                    .then((res) => res.json())
                    .then((cart) => {
                      atlasUpsellCartDrawerInstance.isWaitingForCartData = false;
                      // Restore CSS transitions for subsequent open/close animations.
                      // visibility/opacity stay owned by open()/close().
                      atlasUpsellCartDrawerInstance.drawer.style.removeProperty('transition');
                      atlasUpsellCartDrawerInstance.updateCartItems(cart);
                      atlasUpsellCartDrawerInstance.updateHeaderCartIconQuantityBubble();
                    })
                    .catch((error) => {
                      console.error('Error fetching cart after add-to-cart:', error);
                      atlasUpsellCartDrawerInstance.isWaitingForCartData = false;
                      atlasUpsellCartDrawerInstance.drawer.style.removeProperty('transition');
                      // Even on failure, clear the skeleton so it can't be stranded
                      // (render the last-known cart rather than a permanent loader).
                      atlasUpsellCartDrawerInstance.renderCartItems();
                    });
                };
                // Always fetch fresh cart data and render. We previously skipped
                // this when bundle.js had fired `atlas:cart-updated` within the last
                // 500ms, assuming the drawer was already rendered. But renderCartItems()
                // is a no-op while `isWaitingForCartData` is true (set above to gate the
                // skeleton), so that event's render was dropped — stranding the loading
                // skeleton on top of an empty/stale cart. Rendering unconditionally here
                // guarantees the skeleton clears. /cart.js returns in ~200-600ms.
                fetchAndRender();
              }, 150);
            }
          } else {
            // For update/change mutations: keep the debounced approach (drawer is already open)
            debouncedCartUpdate();
          }
        }
      } catch (e) {
        console.error('Error in Shopify AJAX Cart API Hook:', e);
      }
      return response;
    };
  };

  /**
   * Intercept cart icon clicks in the header area via capture-phase listener.
   * Opens Atlas drawer instead of navigating to /cart or opening theme drawer.
   * Idempotent — only installs once.
   */
  const setupCartIconInterception = () => {
    if (cartIconInterceptionInstalled) return;
    cartIconInterceptionInstalled = true;

    const isCartLink = (href) => {
      if (!href) return false;
      try {
        const url = new URL(href, window.location.origin);
        return /^(\/[a-z]{2}(-[a-z]{2,4})?)?\/cart\/?$/i.test(url.pathname);
      } catch { return false; }
    };

    const isInHeaderArea = (el) => {
      return !!el.closest('header, .header, .shopify-section-header, [data-section-type="header"], .header-wrapper, #shopify-section-header, .site-header');
    };

    const hasCartIndicator = (el) => {
      const ariaLabel = el.getAttribute('aria-label') || '';
      if (/cart/i.test(ariaLabel)) return true;
      if (el.matches('[class*="cart-icon"], [class*="cart-count"], #cart-icon-bubble, .cart-link')) return true;
      const svg = el.querySelector('svg');
      if (svg && /cart|basket|bag/i.test(svg.getAttribute('aria-label') || svg.getAttribute('class') || '')) return true;
      return false;
    };

    document.addEventListener('click', (e) => {
      // Never intercept clicks inside our own drawer
      if (e.target.closest('#atlas-upsell-cart-drawer-main-container')) return;
      if (!atlasUpsellCartDrawerInstance) return;

      const anchor = e.target.closest('a[href]');
      const clickTarget = e.target.closest('button, summary, a, [role="button"]') || e.target;

      let shouldIntercept = false;

      // Strategy 1: Anchor with /cart href in header area
      if (anchor && isCartLink(anchor.href) && isInHeaderArea(anchor)) {
        shouldIntercept = true;
      }

      // Strategy 2: Element with cart indicator in header area
      if (!shouldIntercept && isInHeaderArea(clickTarget) && hasCartIndicator(clickTarget)) {
        shouldIntercept = true;
      }

      // Strategy 3: Check parent interactive element for cart indicators
      if (!shouldIntercept && isInHeaderArea(clickTarget)) {
        const parentInteractive = clickTarget.closest('button, a, summary, [role="button"]');
        if (parentInteractive && (hasCartIndicator(parentInteractive) || (parentInteractive.href && isCartLink(parentInteractive.href)))) {
          shouldIntercept = true;
        }
      }

      if (shouldIntercept) {
        e.preventDefault();
        e.stopPropagation();
        atlasUpsellCartDrawerInstance.open();
      }
    }, true); // capture phase
  };

  /* #endregion */

  /** @deprecated Kept for backward compatibility — delegates to setupCartApiHooks() */
  const overrideThemeDefaults = () => {
    setupCartApiHooks();
  };

  /**
   * Orchestrate all theme-agnostic cart drawer functions.
   * Called after Atlas drawer instance is created.
   */
  const ensureCartDrawerOverrides = () => {
    // 1. Install fetch hooks (idempotent)
    setupCartApiHooks();

    // 2. Install cart icon click interception (idempotent)
    setupCartIconInterception();

    // 3. Neutralize theme's cart drawer immediately
    neutralizeThemeCartDrawer();

    // 4. Re-neutralize after 2s (catches late-loading theme scripts)
    setTimeout(() => {
      neutralizeThemeCartDrawer();
    }, 2000);
  };

  const atlasCartDrawerInit = () => {
    const DEV_URL = "https://gnat-happy-barely.ngrok-free.app"; // dev
    const STAGING_URL = `https://shopify-dropshipt-staging-a7146a2f286d.herokuapp.com`; // staging
    const PROD_URL = `https://app.helloatlas.io`;
    const baseUrl = PROD_URL; // prod
    ATLAS_API_BASE_URL = baseUrl; // Update global for cart impression tracking

    try {
      const dataFromSessionStorage = sessionStorage.getItem(
        "atlasCartUpsellData"
      );
      if (dataFromSessionStorage) {
        const data = JSON.parse(dataFromSessionStorage);
        if (
          data?.cart_upsell_configuration?.cart_enabled &&
          data?.has_eligible_subscription
        ) {
          atlasUpsellCartDrawerInstance = new AtlasUpsellCartDrawer(
            data.cart_upsell_configuration,
            baseUrl
          );
          ensureCartDrawerOverrides();
        }
      }
    } catch (error) {
      console.error(
        "Error parsing atlas cart upsell data from session storage:",
        error
      );
    }
    if (Shopify?.shop) {
      // /api/get_cart_upsell_config?shop=conor-dev.myshopify.com
      // Include served_config_id for A/B testing session consistency
      const servedConfigId = sessionStorage.getItem("atlas_served_config_id");
      const configUrl = servedConfigId
        ? `${baseUrl}/api/get_cart_upsell_config?shop=${Shopify?.shop}&served_config_id=${servedConfigId}`
        : `${baseUrl}/api/get_cart_upsell_config?shop=${Shopify?.shop}`;
      fetch(configUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data?.cart_upsell_configuration) {
            // update the session storage with the new config
            sessionStorage.setItem("atlasCartUpsellData", JSON.stringify(data));
            // Store the served config ID for A/B testing session consistency
            sessionStorage.setItem(
              "atlas_served_config_id",
              String(data.cart_upsell_configuration.id)
            );
          } else {
            // API call was successful but no cart_upsell_configuration was returned.
            // Update session storage to reflect this state.
            sessionStorage.removeItem("atlasCartUpsellData");
            sessionStorage.removeItem("atlas_served_config_id");
          }

          if (
            data?.cart_upsell_configuration?.cart_enabled &&
            data?.has_eligible_subscription
          ) {
            if (atlasUpsellCartDrawerInstance) {
              atlasUpsellCartDrawerInstance.updateConfigAndRefreshUI(
                data.cart_upsell_configuration
              );
            } else {
              atlasUpsellCartDrawerInstance = new AtlasUpsellCartDrawer(
                data.cart_upsell_configuration,
                baseUrl
              );
            }
            ensureCartDrawerOverrides();
          } else {
            // API indicates cart should be disabled
            if (atlasUpsellCartDrawerInstance) {
              // If an instance exists (e.g., from session storage), remove its UI and nullify
              const drawerVariableDefinitionsDiv = document.getElementById(
                "atlas-upsell-cart-drawer-variable-definitions"
              );
              if (drawerVariableDefinitionsDiv) {
                drawerVariableDefinitionsDiv.remove();
              }
              const styleElement = document.getElementById(
                "atlas-upsell-cart-styles"
              );
              if (styleElement) {
                styleElement.remove();
              }

              // Destroy swiper instance in carousel handler
              if (atlasUpsellCartDrawerInstance.carouselHandler) {
                atlasUpsellCartDrawerInstance.carouselHandler.destroySwiper();
              }
              atlasUpsellCartDrawerInstance.setCartAttribute(false);
              atlasUpsellCartDrawerInstance = null; // set the instance to null

              // Restore original theme cart functions if they were overridden
              if (
                typeof CartDrawer !== "undefined" &&
                CartDrawer.prototype &&
                originalThemeCartOpen &&
                originalThemeCartClose &&
                themeOverridesActive
              ) {
                CartDrawer.prototype.open = originalThemeCartOpen;
                CartDrawer.prototype.close = originalThemeCartClose;
                themeOverridesActive = false; // Mark that our overrides are no longer active
                console.log("Restored original theme cart drawer functions.");
              }
              console.log(
                "Atlas Cart Upsell Drawer instance and UI removed as per API config."
              );
            } else {
              // No instance exists, but we must ensure the attribute is not set.
              const localeUrlBase = window?.Shopify?.routes?.root || "/";
              fetch(`${localeUrlBase}cart.js`)
                .then((res) => res.json())
                .then((cart) => {
                  const attributeKey = "atlas-cart-drawer-active";
                  if (
                    cart.attributes &&
                    cart.attributes[attributeKey] === "true"
                  ) {
                    fetch(`${localeUrlBase}cart/update.js`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                      },
                      body: JSON.stringify({
                        attributes: { [attributeKey]: null },
                      }),
                    });
                  }
                });
            }
          }
        })
        .catch((error) => {
          console.log(
            `Failed api call to ${baseUrl}/api/get_cart_upsell_config?shop=${Shopify?.shop}`
          );
          console.error(
            "Failed to initialize/update atlasCartDrawerInit from API",
            error
          );
        });
    }
  };

  // External integration: refresh cart when FG Gifts updates the cart
  const renderCart = async () => {
    try {
      if (atlasUpsellCartDrawerInstance) {
        const localeUrlBase = window?.Shopify?.routes?.root || "/";
        const cart = await fetch(`${localeUrlBase}cart.js`).then((res) =>
          res.json()
        );
        atlasUpsellCartDrawerInstance.updateCartItems(cart);
      }
    } catch (e) {
      console.error(
        "Atlas Cart: Failed to render cart after fg-gifts update:",
        e
      );
    }
  };

  document.addEventListener("fg-gifts:updated", async () => {
    renderCart();
  });

  // Generic, vendor-neutral refresh event for any external app
  document.addEventListener("atlas-cart:refresh-cart", () => {
    renderCart();
  });

  atlasCartDrawerInit();
})();
