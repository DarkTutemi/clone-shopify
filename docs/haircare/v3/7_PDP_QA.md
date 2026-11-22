# ZAVELYN HAIR CARE V3 — 7 PRODUCT PAGES (PDP) AUDIT & QA REPORT

**Date:** 2026-11-22  
**Draft Theme ID:** `189127983289`  
**Status:** All 7 PDP Templates Successfully Deployed to Draft Theme  

---

## 1. 7 Product Merchandising & Template Mapping

All seven AliExpress-sourced products have been verified, mapped to dedicated Shopify draft products, assigned high-resolution imagery, and paired with custom liquid PDP templates following the ShopSideK T01 buy-box architecture.

| # | Product Name | Shopify Product ID | Handle | Template | Variants | Key Attributes |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Batana Hair Growth Oil (60ml)** | `15542795731129` | `zvhc-batana-hair-growth-oil` | `zvhc-batana` | 3 (1x, 2x, 3x) | 100% Pure Raw Cold-Pressed Honduran Batana |
| 2 | **Keratin Hair Building Fibers** | `15542795763897` | `zvhc-keratin-hair-building-fibers` | `zvhc-fibers` | 9 (3 tiers × 3 shades) | Shades: Black, Dark Brown, Medium Brown |
| 3 | **Root Lift Styling & Volumizing Powder** | `15542795796665` | `zvhc-root-lift-styling-powder` | `zvhc-powder` | 3 (1x, 2x, 3x) | Instant matte texture & root volume |
| 4 | **Precision Hairline Powder Compact** | `15542795862201` | `zvhc-precision-hairline-compact` | `zvhc-hairline` | 9 (3 tiers × 3 shades) | Shades: Black, Dark Brown, Medium Brown |
| 5 | **Raw Batana Scalp Recovery Balm** | `15542795894969` | `zvhc-raw-batana-scalp-balm` | `zvhc-balm` | 3 (1x, 2x, 3x) | Intensive follicle repair & barrier moisture |
| 6 | **Botanical Curl Defining Cream** | `15542795927737` | `zvhc-botanical-curl-cream` | `zvhc-curl` | 3 (1x, 2x, 3x) | Argan + Batana moisture lock for curls |
| 7 | **7-in-1 Botanical Growth Elixir** | `15542795960505` | `zvhc-7in1-growth-elixir` | `zvhc-7in1` | 3 (1x, 2x, 3x) | Multi-peptide scalp activation serum |

---

## 2. ShopSideK T01 Buy-Box Implementation Details

Each PDP features the exact ShopSideK T01 layout structure:

### 2.1 Sticky 1:1 Gallery Layout
- Large primary image viewport with 1:1 square aspect ratio.
- 5 thumbnail slides arranged beneath the viewport with active border indicator (`#B0476E`).
- Responsive swipe carousel on mobile viewport (390px).

### 2.2 Header & Social Proof
- Brand kicker: `ZAVELYN CLINICAL BOTANICALS` (`#B0476E`).
- Fraunces serif product title with verified customer review badge (5 gold stars `#E0A33A`, "4.9/5 · 2,480+ Reviews").

### 2.3 3-Tier Multi-Pack Bundle Selector (`.zvhc-bundle-card`)
- **Tier 1 (1 Pack / Starter):** Single bottle/unit. Baseline price (e.g. $29.95).
- **Tier 2 (2 Pack / Most Popular):** 2 units at 20% discount (e.g. $47.95). Includes "👑 MOST POPULAR" ribbon and "Save 20%" discount pill.
- **Tier 3 (3 Pack / Ultimate Recovery):** 3 units at 35% discount (e.g. $64.95). Includes "🔥 BEST VALUE" ribbon and "Save 35%" discount pill.
- Active card state: `#B0476E` 2px border, `#FDF2F6` blush background, filled radio bullet.

### 2.4 Shade Swatch Selector (For Hair Fibers & Hairline Compact)
- Interactive color swatches for **Black**, **Dark Brown**, and **Medium Brown**.
- Visual swatch circles with exact hex representation:
  - Black: `#1A1A1A`
  - Dark Brown: `#3B2219`
  - Medium Brown: `#6A4A3A`
- Real-time binding: Selecting a shade updates the selected variant ID across all active tiers.

### 2.5 Cross-Sell / Upsell Add-on Box
- Seamless one-click add-on card (e.g. Scalp Massaging Shampoo Brush +$9.95 or Derma Roller +$12.95).
- Checkbox toggle dynamically increments checkout total and bundles into the cart submission.

### 2.6 Dynamic Pricing & Checkout CTA
- Live reactive total calculation (`$XX.XX`).
- Large primary CTA button (`#6B1E46`, radius 12px) with glow shadow.
- Trust badge row beneath button:
  - 🛡️ 30-Day Money-Back Guarantee
  - 🚚 Free US Shipping on 2+ Packs
  - 🔒 256-Bit SSL Encrypted Checkout

### 2.7 Sticky Mobile Action Bar
- On mobile viewports (<= 768px), as the user scrolls past the buy box, a sleek dock slides into view from the bottom displaying product thumbnail, selected tier price, and direct "Add to Cart" button.
