import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const THEME_ID = '187736654009'; // Unpublished Development Theme

const sectionLiquid = `{% comment %}
  ZAVELYN BOTANAROOTS — DEDICATED BOGO LANDING PAGE MAIN SECTION
  Scoped strictly to: /pages/botanaroots-bogo-offer
  Theme Asset: sections/botanaroots-bogo-main.liquid
  Dedicated BOGO Product Handle: zavelyn-botanaroots-bogo-special
{% endcomment %}

{{ 'botanaroots-bogo.css' | asset_url | stylesheet_tag }}

<div class="zv-bogo-landing-page" id="zvBogoLandingPage">

  <!-- Top Announcement Bar -->
  <div class="announcement-bar">
    🌿 EXCLUSIVE LIMITED-TIME OFFER: <span>BUY 4 GET 4 FREE</span> &middot; 4 FREE BOTTLES DELIVERED
  </div>

  <div class="main-wrap">
    <!-- Breadcrumb / Header Tag -->
    <div style="margin-bottom: 16px;">
      <span class="badge-test-mode">EXCLUSIVE BOGO PROMOTION &middot; 100% PURE RAW HONDURAN BATANA</span>
    </div>

    <!-- Product Grid: Gallery (Left) + Buybox Info (Right) -->
    <div class="pdp-grid">

      <!-- Gallery Column -->
      <div class="gallery-col">
        <div class="gallery-main-img-wrap">
          <img 
            id="zvBogoMainImg"
            src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/zavelyn-botana-asset-1.jpg?v=1792936448" 
            alt="Zavelyn BotanaRoots Pure Raw Batana Hair Growth Oil"
            class="gallery-main-img"
            width="600"
            height="600"
            loading="eager"
          >
        </div>

        <div class="gallery-thumbs">
          <button type="button" class="thumb-btn active" data-full-img="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/zavelyn-botana-asset-1.jpg?v=1792936448" aria-label="View product main photo">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/zavelyn-botana-asset-1.jpg?v=1792936448" alt="Thumbnail 1">
          </button>
          <button type="button" class="thumb-btn" data-full-img="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/zavelyn-botana-asset-2.jpg?v=1792936448" aria-label="View product label">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/zavelyn-botana-asset-2.jpg?v=1792936448" alt="Thumbnail 2">
          </button>
          <button type="button" class="thumb-btn" data-full-img="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-3.png?v=1792936261" aria-label="View product application">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-3.png?v=1792936261" alt="Thumbnail 3">
          </button>
          <button type="button" class="thumb-btn" data-full-img="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-6.png?v=1792936270" aria-label="View before and after results">
            <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-6.png?v=1792936270" alt="Thumbnail 4">
          </button>
        </div>

        <!-- Trust Badges Under Gallery -->
        <div style="display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 130px; background: #F8FAF8; border: 1px solid #E1EBE2; border-radius: 8px; padding: 10px; text-align: center;">
            <div style="font-size: 16px;">🌱</div>
            <div style="font-size: 11px; font-weight: 800; color: #17433C; margin-top: 4px;">100% Wildcrafted</div>
            <div style="font-size: 10px; color: #666;">Native Honduran Nut</div>
          </div>
          <div style="flex: 1; min-width: 130px; background: #F8FAF8; border: 1px solid #E1EBE2; border-radius: 8px; padding: 10px; text-align: center;">
            <div style="font-size: 16px;">🛡️</div>
            <div style="font-size: 11px; font-weight: 800; color: #17433C; margin-top: 4px;">30-Day Guarantee</div>
            <div style="font-size: 10px; color: #666;">Easy Returns</div>
          </div>
          <div style="flex: 1; min-width: 130px; background: #F8FAF8; border: 1px solid #E1EBE2; border-radius: 8px; padding: 10px; text-align: center;">
            <div style="font-size: 16px;">📦</div>
            <div style="font-size: 11px; font-weight: 800; color: #17433C; margin-top: 4px;">Fast Tracked</div>
            <div style="font-size: 10px; color: #666;">7-15 Day Delivery</div>
          </div>
        </div>
      </div>

      <!-- Info & Buybox Column -->
      <div class="info-col">
        <div class="eyebrow">HONOURING ANCIENT HONDURAN BEAUTY TRADITION</div>
        <h1 class="product-title">Zavelyn BotanaRoots™ Organic Batana Hair Growth Oil</h1>

        <!-- Rating Row -->
        <div class="reviews-badge-row" style="margin-bottom: 16px;">
          <div class="stars">★★★★★</div>
          <div class="reviews-score">4.95 / 5.0</div>
          <div class="reviews-count">(1,480+ Verified Customer Reviews)</div>
        </div>

        <!-- Formula Callout -->
        <div style="background: #F3F4F6; border-radius: 8px; padding: 10px 14px; margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 12px; font-weight: 700; color: #17433C;">FORMULA:</span>
          <span style="font-size: 12px; font-weight: 800; color: #15803D; background: #FFFFFF; padding: 3px 10px; border-radius: 20px; border: 1px solid #D1D5DB;">100% Pure Raw Honduran Batana</span>
        </div>

        <!-- Key Benefits -->
        <ul class="bullet-benefits" style="list-style: none; margin-bottom: 22px; display: flex; flex-direction: column; gap: 8px;">
          <li style="display: flex; gap: 8px; font-size: 13.5px; color: #374151;">
            <span style="color: #15803D; font-weight: 900;">✓</span>
            <span><strong>Reactivates Dormant Follicles:</strong> Stimulates stalled roots back into active anagen growth.</span>
          </li>
          <li style="display: flex; gap: 8px; font-size: 13.5px; color: #374151;">
            <span style="color: #15803D; font-weight: 900;">✓</span>
            <span><strong>Halts Postpartum & Stress Shedding:</strong> Reduces shower and brush hair fall within 14 days.</span>
          </li>
          <li style="display: flex; gap: 8px; font-size: 13.5px; color: #374151;">
            <span style="color: #15803D; font-weight: 900;">✓</span>
            <span><strong>100% Wildcrafted Batana:</strong> Zero chemicals, mineral oils, silicones, sulfates, or artificial parabens.</span>
          </li>
        </ul>

        <!-- ================================================================= -->
        <!-- BOGO COMPONENT COMPONENT (SCOPED) -->
        <!-- ================================================================= -->
        <div class="zv-botana-bogo-container" id="zvBotanaBogoComponent">

          <div class="zv-bundle-section-header">
            <div class="zv-bundle-header-title-wrap">
              <span class="zv-bundle-header-label">CHOOSE YOUR QUANTITY:</span>
            </div>
            <div class="zv-bundle-header-guarantee-wrap">
              <span class="zv-bundle-header-guarantee" title="30-Day Return Policy">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
                <span>30-Day Returns</span>
              </span>
            </div>
          </div>

          <!-- BUNDLE CARDS (ORDER: BUY 4 GET 4 -> BUY 2 GET 2 -> BUY 1) -->
          <div class="zv-bundle-cards-group" role="radiogroup" aria-label="Select BOGO quantity offer">

            <!-- CARD 1: BUY 4 GET 4 FREE (HERO / DEFAULT SELECTED) -->
            <div 
              class="zv-bundle-card zv-card-buy4 selected" 
              data-bundle="buy4get4" 
              id="zvCardBuy4"
              tabindex="0"
              role="radio"
              aria-checked="true"
            >
              <div class="zv-card-banner zv-banner-best-value">
                <svg class="zv-icon-crown" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                </svg>
                <span>BEST VALUE &middot; FREE SHIPPING &middot; 4 FREE BOTTLES</span>
              </div>

              <div class="zv-card-content">
                <div class="zv-card-main-row">
                  <div class="zv-card-radio">
                    <span class="zv-radio-circle"></span>
                  </div>

                  <div class="zv-card-img-wrap">
                    {% if section.settings.bundle_img_8pk != blank %}
                      <img src="{{ section.settings.bundle_img_8pk | image_url: width: 320 }}" alt="Buy 4 Get 4 Free" width="115" height="92" class="zv-card-img">
                    {% else %}
                      <img src="{{ 'botana-bundle-buy3.webp' | asset_url }}" alt="Buy 4 Get 4 Free Bottles" width="115" height="92" class="zv-card-img">
                    {% endif %}
                  </div>

                  <div class="zv-card-info">
                    <div class="zv-card-title-row">
                      <h3 class="zv-card-title">Buy 4 Get 4 FREE</h3>
                    </div>
                    <div class="zv-card-bottles">
                      8 &times; 60ml Bottles
                    </div>
                    <div class="zv-card-supply">8-Month Full Course &middot; 4 Paid + 4 Free</div>
                  </div>

                  <div class="zv-card-pricing">
                    <div class="zv-card-total-price">$159.96</div>
                    <div class="zv-card-unit-price zv-unit-pill-warm">$20.00 / bottle</div>
                  </div>
                </div>

                <div class="zv-card-badges-row">
                  <span class="zv-badge zv-badge-free-shipping">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/>
                    </svg>
                    FREE SHIPPING
                  </span>
                  <span class="zv-badge zv-badge-extra-off">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    4 FREE BOTTLES
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD 2: BUY 2 GET 2 FREE -->
            <div 
              class="zv-bundle-card zv-card-buy2" 
              data-bundle="buy2get2" 
              id="zvCardBuy2"
              tabindex="0"
              role="radio"
              aria-checked="false"
            >
              <div class="zv-card-banner zv-banner-most-popular">
                <span>🔥 MOST POPULAR &middot; 2 FREE BOTTLES</span>
              </div>

              <div class="zv-card-content">
                <div class="zv-card-main-row">
                  <div class="zv-card-radio">
                    <span class="zv-radio-circle"></span>
                  </div>

                  <div class="zv-card-img-wrap">
                    {% if section.settings.bundle_img_4pk != blank %}
                      <img src="{{ section.settings.bundle_img_4pk | image_url: width: 280 }}" alt="Buy 2 Get 2 Free" width="105" height="88" class="zv-card-img">
                    {% else %}
                      <img src="{{ 'botana-bundle-buy2.webp' | asset_url }}" alt="Buy 2 Get 2 Free Bottles" width="105" height="88" class="zv-card-img">
                    {% endif %}
                  </div>

                  <div class="zv-card-info">
                    <div class="zv-card-title-row">
                      <h3 class="zv-card-title">Buy 2 Get 2 FREE</h3>
                    </div>
                    <div class="zv-card-bottles">
                      4 &times; 60ml Bottles
                    </div>
                    <div class="zv-card-supply">4-Month Supply &middot; 2 Paid + 2 Free</div>
                  </div>

                  <div class="zv-card-pricing">
                    <div class="zv-card-total-price">$79.98</div>
                    <div class="zv-card-unit-price zv-unit-pill-warm">$20.00 / bottle</div>
                  </div>
                </div>

                <div class="zv-card-badges-row">
                  <span class="zv-badge zv-badge-extra-off">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    2 FREE BOTTLES
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD 3: BUY 1 -->
            <div 
              class="zv-bundle-card zv-card-buy1" 
              data-bundle="buy1" 
              id="zvCardBuy1"
              tabindex="0"
              role="radio"
              aria-checked="false"
            >
              <div class="zv-card-content">
                <div class="zv-card-main-row">
                  <div class="zv-card-radio">
                    <span class="zv-radio-circle"></span>
                  </div>

                  <div class="zv-card-img-wrap">
                    {% if section.settings.bundle_img_1pk != blank %}
                      <img src="{{ section.settings.bundle_img_1pk | image_url: width: 260 }}" alt="Buy 1 Bottle" width="95" height="85" class="zv-card-img">
                    {% else %}
                      <img src="{{ 'botana-bundle-buy1.webp' | asset_url }}" alt="Buy 1 Bottle" width="95" height="85" class="zv-card-img">
                    {% endif %}
                  </div>

                  <div class="zv-card-info">
                    <div class="zv-card-title-row">
                      <h3 class="zv-card-title">Buy 1</h3>
                    </div>
                    <div class="zv-card-bottles">
                      1 &times; 60ml Bottle
                    </div>
                    <div class="zv-card-supply">30-Day Starter Supply</div>
                  </div>

                  <div class="zv-card-pricing">
                    <div class="zv-card-total-price">$39.99</div>
                    <div class="zv-card-unit-price zv-unit-pill-warm">$39.99 / bottle</div>
                  </div>
                </div>

                <div class="zv-card-badges-row">
                  <span class="zv-badge zv-badge-shipping-fee">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/>
                    </svg>
                    Shipping +$4.95
                  </span>
                </div>
              </div>
            </div>

          </div>

          <!-- SIZE UPSELL CARD (60ml -> 120ml) -->
          <div class="zv-size-upsell-section">
            <div class="zv-upsell-header">
              <span class="zv-upsell-title">UPGRADE YOUR BOTTLE SIZE</span>
              <span class="zv-upsell-badge">SPECIAL OFFER</span>
            </div>

            <label class="zv-upsell-card" id="zvUpsellCard" for="zvSizeUpgradeCheck">
              <div class="zv-upsell-checkbox-wrap">
                <input type="checkbox" id="zvSizeUpgradeCheck" class="zv-upsell-checkbox">
                <span class="zv-custom-check">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
              </div>

              <div class="zv-upsell-img-wrap">
                {% if section.settings.size_upgrade_img != blank %}
                  <img src="{{ section.settings.size_upgrade_img | image_url: width: 360 }}" alt="Size Upgrade" width="135" height="90" class="zv-upsell-img">
                {% else %}
                  <img src="{{ 'botana-bundle-upgrade-size.webp' | asset_url }}" alt="60ml to 120ml Upgrade" width="135" height="90" class="zv-upsell-img">
                {% endif %}
              </div>

              <div class="zv-upsell-copy">
                <div class="zv-upsell-main-title">Double the Size!</div>
                <div class="zv-upsell-desc">Upgrade every bottle from 60ml to 120ml.</div>
                <div class="zv-upsell-deal">Just +$10 per bottle</div>
              </div>

              <div class="zv-upsell-pricing">
                <div class="zv-upsell-delta" id="zvUpsellDelta">+ $80.00</div>
                <div class="zv-upsell-per-bottle">($10 per bottle)</div>
              </div>
            </label>
          </div>

          <!-- SUMMARY BOX -->
          <div class="zv-summary-box">
            <div class="zv-summary-left">
              <div class="zv-summary-label">YOUR PACKAGE</div>
              <div class="zv-summary-package-val" id="zvSummaryPackage">8 &times; 60ml (4 Paid + 4 Free)</div>
            </div>

            <div class="zv-summary-right">
              <div class="zv-summary-label">TOTAL</div>
              <div class="zv-summary-total-row">
                <span class="zv-summary-total-val" id="zvSummaryTotal">$159.96</span>
                <span class="zv-summary-unit-pill zv-unit-pill-warm" id="zvSummaryUnitPill">$20.00 / bottle</span>
              </div>
              <div class="zv-summary-shipping" id="zvSummaryShipping">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/>
                </svg>
                <span>Free Standard Shipping (7–15 Business Days)</span>
              </div>
            </div>
          </div>

          <!-- DUAL CTA BUTTONS -->
          <div class="zv-cta-buttons-wrap" style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
            <!-- Button 1: CLAIM OFFER (Adds to Cart) -->
            <button type="button" class="zv-cta-button zv-btn-primary" id="zvCtaClaimOffer">
              <span class="zv-cta-text">CLAIM OFFER</span>
              <span class="zv-cta-sep">&mdash;</span>
              <span class="zv-cta-price" id="zvCtaPrice">$159.96</span>
            </button>

            <!-- Button 2: BUY NOW (Direct Checkout) -->
            <button type="button" class="zv-cta-button zv-btn-secondary" id="zvCtaBuyNow" style="background: #17433C; color: #FFFFFF; border: 2px solid #17433C;">
              <span class="zv-cta-text">⚡ BUY NOW &middot; DIRECT CHECKOUT</span>
            </button>
          </div>

          <!-- Official Payment Icons Row -->
          <div class="zv-payment-icons-wrapper" role="region" aria-label="Accepted payment methods" style="margin-top: 16px; text-align: center;">
            <div class="zv-payment-icons-row" style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
              {% assign payment_types = 'visa,master,american_express,paypal,apple_pay,google_pay,shopify_pay' | split: ',' %}
              {% for type in payment_types %}
                <span class="zv-payment-icon" title="{{ type | replace: '_', ' ' | capitalize }}">
                  {{ type | payment_type_svg_tag: class: 'zv-pay-svg' }}
                </span>
              {% endfor %}
            </div>
            <div style="font-size: 11px; color: #6B7280; margin-top: 6px;">
              🔒 Guaranteed 256-Bit Encrypted Checkout
            </div>
          </div>

        </div>
        <!-- END BOGO COMPONENT -->

      </div>
    </div>

    <!-- =================================================================== -->
    <!-- LOWER BODY: STORYTELLING, TIMELINE, BEFORE/AFTER, FAQ, REVIEWS -->
    <!-- =================================================================== -->

    <!-- Hero Highlight Banner -->
    <div style="background: linear-gradient(135deg, #1b382b 0%, #2e5a44 100%); color: #fff; padding: 25px 30px; border-radius: 12px; margin-bottom: 35px; box-shadow: 0 8px 24px rgba(27,56,43,0.15);">
      <span style="background: #e8a838; color: #1b382b; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 4px; display: inline-block; margin-bottom: 10px;">HONDURAN MIRACLE OIL</span>
      <h2 style="font-size: 26px; font-weight: 800; margin: 0 0 10px 0; color: #ffffff; line-height: 1.25;">Wake Up Sleeping Follicles &amp; Regrow Thicker, Fuller Hair Naturally</h2>
      <p style="font-size: 15px; margin: 0; opacity: 0.95; line-height: 1.5;">Wildcrafted 100% pure cold-pressed Batana oil harvested from native American palm nuts. Clinically recognized for revitalizing thinning edges, reversing hormonal shedding, and locking in deep scalp moisture.</p>
    </div>

    <!-- Key Benefits Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 35px;">
      <div style="background: #f8faf8; border: 1px solid #e1ebe2; border-radius: 10px; padding: 20px;">
        <div style="font-size: 24px; margin-bottom: 8px;">🌱</div>
        <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: #1b382b;">100% Pure Wildcrafted Batana</h3>
        <p style="font-size: 13px; color: #555; margin: 0;">Unrefined, zero parabens, sulfates, silicones, or mineral oils. Rich in omega-6 and phytosterols that feed hair bulbs directly.</p>
      </div>
      <div style="background: #f8faf8; border: 1px solid #e1ebe2; border-radius: 10px; padding: 20px;">
        <div style="font-size: 24px; margin-bottom: 8px;">🔬</div>
        <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: #1b382b;">Reactivates Dormant Follicles</h3>
        <p style="font-size: 13px; color: #555; margin: 0;">Stimulates micro-circulation at the root level, helping push stalled follicles back into the active anagen growth phase.</p>
      </div>
      <div style="background: #f8faf8; border: 1px solid #e1ebe2; border-radius: 10px; padding: 20px;">
        <div style="font-size: 24px; margin-bottom: 8px;">🛡️</div>
        <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: #1b382b;">Strengthens &amp; Seals Split Ends</h3>
        <p style="font-size: 13px; color: #555; margin: 0;">Coats brittle hair fibers with natural carotenoids, preventing breakage and restoring glass-like shine from root to tip.</p>
      </div>
    </div>

    <!-- Visual Feature Banner -->
    <div style="margin-bottom: 40px; text-align: center;">
      <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-3.png?v=1792936261" alt="Zavelyn BotanaRoots Application" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
    </div>

    <!-- Botanical Science Deep Dive -->
    <div style="background: #fdfaf6; border-left: 4px solid #b37d2b; padding: 24px; border-radius: 0 10px 10px 0; margin-bottom: 40px;">
      <h3 style="color: #4a3418; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 12px;">The Secret of the Miskito People: "Tawira" (The People of Beautiful Hair)</h3>
      <p style="font-size: 14px; color: #554332; line-height: 1.6; margin-bottom: 12px;">
        For generations, the indigenous Miskito communities of Honduras have been renowned for having the longest, thickest, and healthiest dark hair on Earth. Their only secret? <strong>Batana Oil</strong> (Elaeis Oleifera), handcrafted through time-honored artisanal roasting and cold-pressing.
      </p>
      <p style="font-size: 14px; color: #554332; line-height: 1.6; margin: 0;">
        Unlike drugstore serums loaded with drying alcohol and heavy silicones that choke hair follicles, <strong>Zavelyn BotanaRoots™</strong> mimics your scalp's natural sebum, absorbing instantaneously without greasy residue.
      </p>
    </div>

    <!-- Infographics -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px;">
      <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-4.png?v=1792936264" alt="100% Pure Natural Formula" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
      <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-5.png?v=1792936267" alt="Nourishes and Restores Follicles" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
    </div>

    <!-- 90-Day Hair Restoration Timeline -->
    <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 28px; margin-bottom: 40px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
      <h3 style="text-align: center; font-size: 22px; font-weight: 800; color: #1b382b; margin-top: 0; margin-bottom: 24px;">Your 90-Day Hair Transformation Journey</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
        <div style="border-top: 3px solid #2e5a44; padding-top: 14px;">
          <span style="font-weight: 800; color: #2e5a44; font-size: 13px; text-transform: uppercase;">Days 1 – 14</span>
          <h4 style="font-size: 16px; margin: 6px 0; color: #1b382b;">Scalp Detox &amp; Less Shedding</h4>
          <p style="font-size: 13px; color: #666; margin: 0;">Dry flaking stops, itchy scalp soothes instantly, and daily shower shedding drops significantly.</p>
        </div>
        <div style="border-top: 3px solid #b37d2b; padding-top: 14px;">
          <span style="font-weight: 800; color: #b37d2b; font-size: 13px; text-transform: uppercase;">Days 15 – 45</span>
          <h4 style="font-size: 16px; margin: 6px 0; color: #1b382b;">Baby Hairs &amp; Edge Revival</h4>
          <p style="font-size: 13px; color: #666; margin: 0;">Noticeable vellus hairs sprout along hairline edges, temples, and previously widening hair parts.</p>
        </div>
        <div style="border-top: 3px solid #1b382b; padding-top: 14px;">
          <span style="font-weight: 800; color: #1b382b; font-size: 13px; text-transform: uppercase;">Days 46 – 90</span>
          <h4 style="font-size: 16px; margin: 6px 0; color: #1b382b;">Full Density &amp; Thicker Shafts</h4>
          <p style="font-size: 13px; color: #666; margin: 0;">New strands mature into dense, thick terminal hairs. Overall ponytail volume and shine dramatically restored.</p>
        </div>
      </div>
    </div>

    <!-- Before & After Proof -->
    <div style="margin-bottom: 40px; text-align: center;">
      <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-6.png?v=1792936270" alt="Zavelyn BotanaRoots Before and After" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
    </div>

    <!-- 3 Easy Ways to Incorporate -->
    <div style="background: #f8faf8; border-radius: 12px; padding: 28px; margin-bottom: 40px;">
      <h3 style="font-size: 20px; font-weight: 800; color: #1b382b; margin-top: 0; margin-bottom: 20px;">3 Easy Ways to Incorporate BotanaRoots™ into Your Routine</h3>
      <div style="margin-bottom: 16px;">
        <strong style="color: #1b382b; font-size: 15px;">1. Daily Follicle Activation (2 mins):</strong>
        <p style="font-size: 13px; color: #555; margin: 4px 0 0 0;">Fill dropper 1/2 full. Apply directly to thinning areas (hairline, crown, part). Massage gently in circular motions with fingertips for 2 minutes. Do not rinse.</p>
      </div>
      <div style="margin-bottom: 16px;">
        <strong style="color: #1b382b; font-size: 15px;">2. Deep Nourishing Overnight Hair Mask:</strong>
        <p style="font-size: 13px; color: #555; margin: 4px 0 0 0;">Apply 1-2 full pipettes across the entire scalp and distribute through mid-lengths to ends. Cover with a satin bonnet or towel overnight. Wash out in the morning with gentle shampoo.</p>
      </div>
      <div>
        <strong style="color: #1b382b; font-size: 15px;">3. Anti-Frizz &amp; Split-End Sealant:</strong>
        <p style="font-size: 13px; color: #555; margin: 4px 0 0 0;">Rub 2-3 drops between your palms and smooth over dry ends to tame flyaways, lock in hydration, and add a luminous botanical glow.</p>
      </div>
    </div>

    <!-- Doorstep Delivery Section -->
    <div id="zv-doorstep-delivery" style="background: #FAF7F2; border-radius: 12px; padding: 28px; margin-bottom: 40px; border: 1px solid #EBE4DA;">
      <h3 style="font-size: 20px; font-weight: 800; color: #17433C; margin-top: 0; margin-bottom: 8px; text-align: center;">Direct Doorstep Delivery &amp; Guarantee</h3>
      <p style="text-align: center; color: #666; font-size: 13px; margin-bottom: 20px;">Every order is processed within 48 hours and shipped directly with full tracking.</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
        <div style="background: #FFFFFF; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB;">
          <div style="font-size: 20px; margin-bottom: 6px;">🚚</div>
          <strong style="font-size: 14px; color: #17433C;">Standard Delivery (7–15 Days)</strong>
          <p style="font-size: 12px; color: #666; margin: 4px 0 0;">Real-time tracking updates sent directly to your email.</p>
        </div>
        <div style="background: #FFFFFF; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB;">
          <div style="font-size: 20px; margin-bottom: 6px;">🛡️</div>
          <strong style="font-size: 14px; color: #17433C;">30-Day Happiness Guarantee</strong>
          <p style="font-size: 12px; color: #666; margin: 4px 0 0;">Try it with peace of mind. Full return support if not completely satisfied.</p>
        </div>
        <div style="background: #FFFFFF; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB;">
          <div style="font-size: 20px; margin-bottom: 6px;">🌿</div>
          <strong style="font-size: 14px; color: #17433C;">Fresh Artisanal Small Batches</strong>
          <p style="font-size: 12px; color: #666; margin: 4px 0 0;">Roasted and cold-pressed fresh to guarantee high botanical potency.</p>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div style="margin-bottom: 40px;">
      <h3 style="font-size: 22px; font-weight: 800; color: #1b382b; margin-bottom: 18px; text-align: center;">Frequently Asked Questions</h3>
      
      <div class="zv-faq-item" style="border-bottom: 1px solid #e0e0e0; padding: 16px 0; cursor: pointer;">
        <div class="zv-faq-q" style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: #17433C; font-size: 15px;">
          <span>How does the BOGO offer work and how many bottles will I receive?</span>
          <span style="font-size: 18px;">+</span>
        </div>
        <div class="zv-faq-a" style="margin-top: 8px; font-size: 13.5px; color: #555; line-height: 1.5;">
          When you select the <strong>Buy 4 Get 4 FREE</strong> offer, you receive <strong>8 physical bottles</strong> delivered right to your door. When you choose <strong>Buy 2 Get 2 FREE</strong>, you receive <strong>4 bottles</strong>. Our fulfillment team prepares your package according to the selected offer.
        </div>
      </div>

      <div class="zv-faq-item" style="border-bottom: 1px solid #e0e0e0; padding: 16px 0; cursor: pointer;">
        <div class="zv-faq-q" style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: #17433C; font-size: 15px;">
          <span>Can I use this on color-treated or chemically processed hair?</span>
          <span style="font-size: 18px;">+</span>
        </div>
        <div class="zv-faq-a" style="margin-top: 8px; font-size: 13.5px; color: #555; line-height: 1.5;">
          Yes! Zavelyn BotanaRoots™ is 100% natural, sulfate-free, and color-safe. It actually helps repair damage caused by bleaching, hot styling tools, and tight braids.
        </div>
      </div>

      <div class="zv-faq-item" style="border-bottom: 1px solid #e0e0e0; padding: 16px 0; cursor: pointer;">
        <div class="zv-faq-q" style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: #17433C; font-size: 15px;">
          <span>How soon will I notice visible results?</span>
          <span style="font-size: 18px;">+</span>
        </div>
        <div class="zv-faq-a" style="margin-top: 8px; font-size: 13.5px; color: #555; line-height: 1.5;">
          Most customers report a noticeable drop in daily shedding within 10–14 days. Visible new baby hair growth and thickening of sparse areas typically appears between 4 to 8 weeks of daily application.
        </div>
      </div>

      <div class="zv-faq-item" style="border-bottom: 1px solid #e0e0e0; padding: 16px 0; cursor: pointer;">
        <div class="zv-faq-q" style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: #17433C; font-size: 15px;">
          <span>Is it suitable for both men and women?</span>
          <span style="font-size: 18px;">+</span>
        </div>
        <div class="zv-faq-a" style="margin-top: 8px; font-size: 13.5px; color: #555; line-height: 1.5;">
          Absolutely. BotanaRoots™ is universally effective for all hair types (Type 1 straight to Type 4 coily) and works equally well on receding men's hairlines and thinning women's crowns.
        </div>
      </div>
    </div>

    <!-- Verified Customer Reviews Section -->
    <div style="background: #fafafa; border: 1px solid #eee; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #1b382b;">Verified Customer Reviews</h3>
          <div style="color: #ffb800; font-size: 15px; margin-top: 4px;">★★★★★ <span style="color: #666; font-size: 13px; font-weight: 600;">4.95 out of 5 based on 1,480+ reviews</span></div>
        </div>
        <span style="background: #e8f5e9; color: #2e7d32; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px;">✓ 100% Verified Purchases</span>
      </div>

      <!-- Review 1 -->
      <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <strong style="font-size: 14px; color: #222;">Camilla R. — New York, NY</strong>
          <span style="font-size: 12px; color: #888;">2 days ago</span>
        </div>
        <div style="color: #ffb800; font-size: 12px; margin-bottom: 6px;">★★★★★ <span style="color: #2e7d32; font-size: 11px; font-weight: 600;">Verified Buyer</span></div>
        <p style="font-size: 13px; color: #444; margin: 0; line-height: 1.5;">"My postpartum shedding was out of control. Within 3 weeks of using Zavelyn BotanaRoots, the shedding stopped dead in its tracks. Now at week 6, my temples are filled with new dark baby hairs! Getting the Buy 4 Get 4 Free package is an absolute no-brainer."</p>
      </div>

      <!-- Review 2 -->
      <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <strong style="font-size: 14px; color: #222;">Marcus D. — Austin, TX</strong>
          <span style="font-size: 12px; color: #888;">5 days ago</span>
        </div>
        <div style="color: #ffb800; font-size: 12px; margin-bottom: 6px;">★★★★★ <span style="color: #2e7d32; font-size: 11px; font-weight: 600;">Verified Buyer</span></div>
        <p style="font-size: 13px; color: #444; margin: 0; line-height: 1.5;">"I was skeptical about Batana oil because minoxidil always irritated my scalp. This pure oil feels amazing, has a warm earthy aroma, and my crown looks noticeably denser. 10/10."</p>
      </div>

      <!-- Review 3 -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <strong style="font-size: 14px; color: #222;">Aaliyah M. — Atlanta, GA</strong>
          <span style="font-size: 12px; color: #888;">1 week ago</span>
        </div>
        <div style="color: #ffb800; font-size: 12px; margin-bottom: 6px;">★★★★★ <span style="color: #2e7d32; font-size: 11px; font-weight: 600;">Verified Buyer</span></div>
        <p style="font-size: 13px; color: #444; margin: 0; line-height: 1.5;">"Traction alopecia from tight braids ruined my edges. BotanaRoots pure oil is the only thing that actually re-sprouted my edges. Thicker, shinier, and healthy again."</p>
      </div>
    </div>

  </div>

</div>

<script src="{{ 'botanaroots-bogo.js' | asset_url }}" defer></script>

{% schema %}
{
  "name": "BotanaRoots BOGO Main",
  "settings": [
    {
      "type": "image_picker",
      "id": "bundle_img_1pk",
      "label": "1 Bottle Bundle Image"
    },
    {
      "type": "image_picker",
      "id": "bundle_img_4pk",
      "label": "4 Bottles Bundle Image (Buy 2 Get 2 Free)"
    },
    {
      "type": "image_picker",
      "id": "bundle_img_8pk",
      "label": "8 Bottles Bundle Image (Buy 4 Get 4 Free)"
    },
    {
      "type": "image_picker",
      "id": "size_upgrade_img",
      "label": "Size Upgrade Image (60ml to 120ml)"
    }
  ],
  "presets": [
    {
      "name": "BotanaRoots BOGO Main"
    }
  ]
}
{% endschema %}
`;

async function uploadBogoSection() {
  const token = await getAccessToken();
  console.log(`Uploading sections/botanaroots-bogo-main.liquid (${sectionLiquid.length} chars) to Theme ${THEME_ID}...`);

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/botanaroots-bogo-main.liquid',
        value: sectionLiquid
      }
    })
  });
  const data = await res.json();
  if (data.asset?.key) {
    console.log(`✔ Successfully uploaded sections/botanaroots-bogo-main.liquid to Theme ${THEME_ID}`);
  } else {
    console.error('Upload Error:', JSON.stringify(data));
  }
}

uploadBogoSection().catch(console.error);
