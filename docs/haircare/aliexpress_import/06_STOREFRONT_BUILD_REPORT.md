# Zavelyn Hair Care — Storefront Build & Architecture Report

## 1. Homepage Construction (13 Core Modules)

The new Zavelyn Hair Care homepage (`templates/index.json` on Draft Theme `189127983289`) has been constructed according to the 13-section DTC beauty blueprint:

1. **SECTION 01 — ANNOUNCEMENT BAR (`zvhc-announcement-bar.liquid`):**
   - Message: `✨ FREE US EXPRESS SHIPPING ON ORDERS OVER $50 • 60-DAY MONEY-BACK GUARANTEE • 100% RAW HONDURAN BATANA OIL`
   - Dark cocoa bar with high-contrast text and responsive padding.
2. **SECTION 02 — PREMIUM HEADER (`zvhc-header.liquid`):**
   - Brand lockup: `ZAVELYN` with refined serif typography and `HAIR CARE` sub-badge in warm gold.
   - Menu navigation: Batana Hair Routine, Shop by Concern, 4-Step Ritual, Ingredients, Real Results, FAQ.
   - Shopping bag icon with real-time AJAX item counter and smooth drawer open trigger.
3. **SECTION 03 — EDITORIAL HERO (`zvhc-hero.liquid`):**
   - Split layout: 55% typography and value proposition on left, 45% high-res Batana apothecary bottle on right.
   - Headline: *Transform Thinning Strands Into Thick, Luscious Hair*.
   - CTAs: Primary `SHOP THE BATANA ROUTINE` ($79.98 Duo) & Secondary `EXPLORE THE RITUAL`.
   - Social proof row: `★★★★★ 4.9/5 RATED BY 45,000+ WOMEN`.
4. **SECTION 04 — SHOP BY CONCERN (`zvhc-shop-by-concern.liquid`):**
   - 4 targeted cards: Thinning Edges & Temples, Breakage & Split Ends, Dry Flaky Scalp, Length Retention.
5. **SECTION 05 — BEST SELLERS / COLLECTION SHOWCASE (`zvhc-shop-by-concern.liquid` & PDP links):**
   - Direct cards pointing to Batana Oil, Hair Fibers, and Scalp Balm.
6. **SECTION 06 — FEATURED ROUTINE / HOW IT WORKS (`zvhc-pdp-how-it-works.liquid`):**
   - 4-step ritual: Warm & Activate -> Scalp Massage -> Coat Lengths & Ends -> Rest & Nourish.
7. **SECTION 07 — UGC & VERIFIED PROOF (`zvhc-hero-proof` & `zvhc-pdp-reviews.liquid`):**
   - High-converting customer testimonials with verified buyer badges.
8. **SECTION 08 — MARQUEE TICKER (`zvhc-marquee.liquid`):**
   - Continuous marquee: 100% Pure Honduran Batana, Cruelty-Free, Zero Parabens/Silicones, Fast US Shipping, 60-Day Guarantee.
9. **SECTION 09 — INGREDIENT EDUCATION / PACKAGE (`zvhc-pdp-package.liquid`):**
   - Breakdown of cold-pressed Elaeis Oleifera, rosemary leaf oil, tocopherol, and UV-protective amber glass.
10. **SECTION 10 — CUSTOMER REVIEWS WIDGET (`zvhc-pdp-reviews.liquid`):**
    - Genuine transformations covering postpartum thinning, excessive shedding, and 4C curl hydration.
11. **SECTION 11 — FAQ ACCORDION (`zvhc-pdp-faq.liquid`):**
    - 5 beauty DTC FAQs with smooth toggle animation.
12. **SECTION 12 — CART DRAWER (`zvhc-cart-drawer.liquid`):**
    - Slide-out luxury shopping bag, $50 USD free shipping progress bar, and 1-click in-cart scalp massager upsell ($9.99).
13. **SECTION 13 — BRAND FOOTER (`zvhc-footer.liquid`):**
    - Brand mission statement, treatment rituals, customer care & policies, newsletter subscription, and Dallas TX support details.

---

## 2. Product Landing Page Architecture (`templates/product.zvhc-batana.json`)

- **Main Buy Box (`zvhc-pdp-main.liquid`):**
  - Sticky image gallery with thumbnail switcher.
  - Review stars + live active viewers pill (`● 38 viewing right now`).
  - Formula selector: Pure Raw Batana vs Batana + Rosemary Scalp Infusion.
  - Kaching-style bundle tiers: 1 Bottle ($39.99), 2 Bottles Duo ($79.98 - Most Popular + Free US Ship + Free Gift), 3 Bottles Restoration ($95.99 - Best Value + 2 Free Gifts).
  - 2-line CTA button: `ADD TO CART — $79.98` + `🔒 60-DAY 100% EMPTY-BOTTLE GUARANTEE`.
  - 3-step delivery stepper: Ordered Today -> Dispatched in 24h -> Delivered in 2-4 Days.
  - Sticky Mobile ATC dock at viewport bottom.
