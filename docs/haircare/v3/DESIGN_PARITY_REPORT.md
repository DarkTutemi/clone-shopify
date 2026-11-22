# ZAVELYN HAIR CARE V3 — SHOPSIDEK T01 DESIGN PARITY REPORT

**Date:** 2026-11-22  
**Target Store:** `dsdujr-vn.myshopify.com` (`tryzavelyn.com`)  
**Draft Theme ID:** `189127983289`  
**Reference Design:** [ShopSideK T01](https://shopsidek.com/templates/t01/)  
**Brand:** Zavelyn Hair Care  

---

## 1. Executive Summary & Design Pivot

Following explicit owner feedback rejecting the previous V2 "Bold Botanical" orange (`#FD550A`), green (`#015D47`), and lime (`#E0F354`) palette, Zavelyn Hair Care has undergone a **complete V3 design reset**.

The new storefront architecture is built upon pixel-close fidelity to **ShopSideK T01**, a refined, high-converting luxury beauty and clinical wellness design system.

All bold botanical elements have been stripped and replaced with the sophisticated T01 aesthetic: soft warm taupe canvas, muted blush editorial sections, deep wine primary CTAs, refined serif headings (`Fraunces`), and crisp modern sans-serif body typography (`Inter`).

---

## 2. Design Token Parity Matrix

| Token Name | CSS Custom Property | ShopSideK T01 Reference | Zavelyn Hair Care V3 | Parity Status |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `--zvhc-bg` | `#E9E4E6` (`rgb(233, 228, 230)`) | `#E9E4E6` | **100% Match** |
| **Editorial Background**| `--zvhc-bg-subtle` | `#FBEDE8` (`rgb(251, 237, 232)`) | `#FBEDE8` | **100% Match** |
| **Card / Surface Fill** | `--zvhc-surface` | `#FFFFFF` (`rgb(255, 255, 255)`) | `#FFFFFF` | **100% Match** |
| **Primary Text** | `--zvhc-text` | `#2B1B24` (`rgb(43, 27, 36)`) | `#2B1B24` | **100% Match** |
| **Muted / Subtitle Text**| `--zvhc-text-muted` | `#5A4651` (`rgb(90, 70, 81)`) | `#5A4651` | **100% Match** |
| **Header / Nav Bar** | `--zvhc-nav-bg` | `#1B1418` (`rgb(27, 20, 24)`) | `#1B1418` | **100% Match** |
| **Primary CTA Button** | `--zvhc-primary` | `#6B1E46` (`rgb(107, 30, 70)`) | `#6B1E46` | **100% Match** |
| **Primary CTA Hover** | `--zvhc-primary-hover`| `#551636` | `#551636` | **100% Match** |
| **Selected Card Border**| `--zvhc-selected-border`| `#B0476E` (`rgb(176, 71, 110)`) | `#B0476E` | **100% Match** |
| **Selected Card Tint** | `--zvhc-selected-tint` | `#FDF2F6` (`rgb(253, 242, 246)`) | `#FDF2F6` | **100% Match** |
| **Discount Pill Fill** | `--zvhc-pill-bg` | `#F8E4EB` (`rgb(248, 228, 235)`) | `#F8E4EB` | **100% Match** |
| **Default Border** | `--zvhc-border` | `#EAD7DD` (`rgb(234, 215, 221)`) | `#EAD7DD` | **100% Match** |
| **Star Rating Gold** | `--zvhc-star` | `#E0A33A` (`rgb(224, 163, 58)`) | `#E0A33A` | **100% Match** |
| **Trust Green** | `--zvhc-trust` | `#3F8F6B` (`rgb(63, 143, 107)`) | `#3F8F6B` | **100% Match** |
| **Heading Font** | `--zvhc-font-heading` | `'Fraunces', Georgia, serif` | `'Fraunces', Georgia, serif` | **100% Match** |
| **Body Font** | `--zvhc-font-body` | `'Inter', sans-serif` | `'Inter', sans-serif` | **100% Match** |
| **Button Radius** | `--zvhc-btn-radius` | `12px` | `12px` | **100% Match** |
| **Card Radius** | `--zvhc-card-radius` | `14px` | `14px` | **100% Match** |
| **Container Width** | `--zvhc-container-max`| `1180px` | `1180px` | **100% Match** |

---

## 3. Section Architecture & Parity Breakdown

### 3.1 Announcement Bar & Header Toolbar
- **Reference:** T01 top pill-style navigation toolbar `#1B1418` with subtle border, centered logo, clean text navigation links, currency selector, and cart bag icon with active count badge.
- **Implementation:** `sections/zvhc-announcement-bar.liquid` and `sections/zvhc-header.liquid`.
- **Styling:** Strict `#1B1418` dark background, white navigation typography, subtle `#3A2D34` bottom border.

### 3.2 Hero Banner
- **Reference:** Editorial split layout with soft `#E9E4E6` background, luxury serif headline (`Fraunces`), social proof stars (`#E0A33A`), customer count badge, dual CTA (`Shop The Ritual` and `Take Scalp Quiz`), and high-res lifestyle hero photography with floating benefit badges.
- **Implementation:** `sections/zvhc-hero.liquid`.

### 3.3 Dynamic Benefit Marquee
- **Reference:** Endless loop ribbon displaying 5 core brand pillars separated by gold star icons.
- **Implementation:** `sections/zvhc-marquee.liquid` and `sections/zvhc-pdp-marquee.liquid`.
- **Pillars:** 100% Pure Batana Oil • Cold-Pressed Extraction • Dermatologist Formulated • Sulfate & Paraben Free • 30-Day Money-Back Guarantee.

### 3.4 Shop By Concern Grid
- **Reference:** 4-column card grid categorizing hair and scalp needs.
- **Implementation:** `sections/zvhc-shop-by-concern.liquid`.
- **Categories:** Thinning & Receding Edges, Damaged & Dry Scalp, Texture & Curl Definition, Hairline & Part Concealment.

### 3.5 Complete 7-Product Merchandising Grid
- **Reference:** Clean 4-column desktop / 2-column mobile card grid featuring star ratings, pricing, discount badges, and instant Add-to-Bag buttons.
- **Implementation:** `sections/zvhc-all-products.liquid`.
- **Products:** All 7 AliExpress-sourced Zavelyn Hair Care SKUs with accurate pricing and imagery.

### 3.6 Botana 4-Step Hair Wellness Ritual
- **Reference:** Alternating `#FBEDE8` background section guiding users through Prep, Treat, Style, and Protect.
- **Implementation:** `sections/zvhc-botana-routine.liquid`.

### 3.7 Video UGC Social Proof Carousel
- **Reference:** 4-card 9:16 vertical video ratio gallery displaying real customer transformations and unboxing clips.
- **Implementation:** `sections/zvhc-video-ugc.liquid`.

### 3.8 Zavelyn vs. Traditional Haircare Comparison Table
- **Reference:** Crisp side-by-side benchmark matrix comparing Zavelyn Botanical Formulas with Conventional Drugstore Brands.
- **Implementation:** `sections/zvhc-comparison.liquid`.

### 3.9 Clinical Ingredient Deep Dive
- **Reference:** Educational editorial cards highlighting Raw Honduran Batana Oil, Plant Keratin Fibers, Moroccan Argan Oil, and Rosemary Leaf Extract.
- **Implementation:** `sections/zvhc-ingredient-education.liquid`.

### 3.10 High-AOV Value Bundles
- **Reference:** Multi-tier bundle cards with Most Popular badges, free gift callouts, and pre-calculated percentage savings.
- **Implementation:** `sections/zvhc-bundles.liquid`.
- **Bundles:** Starter Growth Trio ($69.95, Save 30%), Complete Hair Transformation System ($99.95, Save 45%), Precision Styling Duo ($49.95, Save 25%).

### 3.11 Accordion FAQ & Clinical Trust Badges
- **Reference:** Clean expandable FAQ accordion and 4-column trust guarantee strip.
- **Implementation:** `sections/zvhc-faq-trust.liquid`.

### 3.12 Luxury Dark Footer
- **Reference:** `#1B1418` dark footer with newsletter signup, SSL security trustmarks, quick links, and legal disclaimer.
- **Implementation:** `sections/zvhc-footer.liquid`.
