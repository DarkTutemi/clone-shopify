# Zavelyn Hair Care — Storefront Build & Architecture Report

## 1. Homepage Construction (Core Modules)

The new Zavelyn Hair Care homepage (`templates/index.json` on Draft Theme `189127983289`) has been constructed and sanitized according to strict DTC beauty standards and compliance rules:

1. **SECTION 01 — ANNOUNCEMENT BAR (`zvhc-announcement-bar.liquid`):**
   - Message: `✨ FREE US SHIPPING ON ORDERS OVER $50 • 30-DAY SATISFACTION GUARANTEE • PURE BOTANICAL HAIR CARE`
   - Dark cocoa bar with high-contrast text and responsive padding. Single instance in layout (no double rendering).
2. **SECTION 02 — PREMIUM HEADER (`zvhc-header.liquid`):**
   - Brand lockup: `ZAVELYN` with refined serif typography and `HAIR CARE` sub-badge in warm gold.
   - Menu navigation: Batana Hair Routine, Shop by Concern, 4-Step Ritual, Ingredients, Real Results, FAQ.
   - Shopping bag icon with real-time AJAX item counter and smooth drawer open trigger.
3. **SECTION 03 — EDITORIAL HERO (`zvhc-hero.liquid`):**
   - Split layout: 55% typography and value proposition on left, 45% high-res Batana apothecary bottle on right.
   - Headline: *Transform Thinning Strands Into Strong, Luscious Hair*.
   - CTAs: Primary `SHOP THE BATANA ROUTINE` & Secondary `EXPLORE THE RITUAL`.
   - Social proof row: `★★★★★ BOTANICAL HAIR RITUAL · Pure Plant-Powered Scalp & Strand Care`.
4. **SECTION 04 — SHOP BY CONCERN (`zvhc-shop-by-concern.liquid`):**
   - 4 targeted cards: Thinning Edges & Temples, Breakage & Split Ends, Dry Sensitive Scalp, Instant Hair Density.
5. **SECTION 05 — BEST SELLERS / COLLECTION SHOWCASE (`zvhc-shop-by-concern.liquid` & PDP links):**
   - Direct cards pointing to Batana Oil, Hair Fibers, and Scalp Balm.
6. **SECTION 06 — FEATURED ROUTINE / HOW IT WORKS (`zvhc-pdp-how-it-works.liquid`):**
   - 4-step ritual: Warm & Activate -> Scalp Massage -> Coat Lengths & Ends -> Rest & Nourish.
7. **SECTION 07 — UGC & VERIFIED PROOF (`zvhc-pdp-reviews.liquid`):**
   - Compliant customer experiences with verified buyer badges focusing on shine, texture, scalp comfort, and breakage reduction.
8. **SECTION 08 — MARQUEE TICKER (`zvhc-marquee.liquid`):**
   - Continuous marquee: Pure Botanical Batana Formula, 100% Cruelty-Free, Zero Parabens/Mineral Oil, Reliable Tracked US Shipping, 30-Day Satisfaction Guarantee.
9. **SECTION 09 — INGREDIENT EDUCATION / PACKAGE (`zvhc-pdp-package.liquid`):**
   - Breakdown of cold-pressed Elaeis Oleifera, rosemary leaf extract, natural tocopherol, and UV-protective amber glass.
10. **SECTION 10 — CUSTOMER REVIEWS WIDGET (`zvhc-pdp-reviews.liquid`):**
    - Genuine experiences covering postpartum hairline care, reduced brush breakage, and defined 4C curls.
11. **SECTION 11 — FAQ ACCORDION (`zvhc-pdp-faq.liquid`):**
    - 5 beauty DTC FAQs with smooth toggle animation.
12. **SECTION 12 — CART DRAWER (`zvhc-cart-drawer.liquid`):**
    - Slide-out luxury shopping bag, $50 USD free shipping progress bar, and 1-click in-cart scalp massager upsell ($9.99).
13. **SECTION 13 — BRAND FOOTER (`zvhc-footer.liquid`):**
    - Brand mission statement, treatment rituals, customer care & policies, newsletter subscription, and Dallas TX support details.

---

## 2. Product Landing Page Architecture (`templates/product.zvhc-*.json`)

- **Main Buy Box (`zvhc-pdp-main.liquid`):**
  - Sticky image gallery with thumbnail switcher.
  - Review stars + honest customer feedback label (unverified live viewer counters removed).
  - Formula selector: Pure Raw Batana vs Batana + Rosemary Scalp Infusion.
  - Kaching-style bundle tiers with honest mathematics:
    - 1 Bottle: $39.99 (Reg. $49.99) — Starter supply
    - 2 Bottles: $69.99 ($35.00/bottle — Save 30% vs Reg. $99.98) — Duo Care Course + Free Shipping + Scalp Brush Gift
    - 3 Bottles: $89.99 ($30.00/bottle — Save 40% vs Reg. $149.97) — Trio Course + Free Shipping + 2 Free Gifts
  - 2-line CTA button: `ADD TO CART — $69.99` + `🔒 30-DAY SATISFACTION GUARANTEE`.
  - 3-step delivery stepper: Order Confirmed -> Fulfillment -> Tracked Shipping.
