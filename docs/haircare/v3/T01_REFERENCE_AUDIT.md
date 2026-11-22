# SHOPSIDEK T01 — COMPREHENSIVE REFERENCE AUDIT

**Target Reference URL:** `https://shopsidek.com/templates/t01/`  
**Audit Tool:** Headless Chrome via Chrome DevTools Protocol (CDP) at 1440px (Desktop) & 390px (Mobile)  
**Date of Audit:** November 22, 2026  
**Status:** 100% Extracted from Rendered Live Reference

---

## 1. EXECUTIVE SUMMARY & DESIGN PHILOSOPHY

The ShopSideK T01 reference represents a premier, high-converting Direct-to-Consumer (DTC) beauty & wellness product layout. Rather than aggressive saturated primary tones, T01 uses an editorial, high-trust, sophisticated aesthetic built on:

- **Canvas & Backgrounds:** Muted, elegant warm mauve/ivory neutral canvas (`#E9E4E6`) paired with alternating warm blush sections (`#FBEDE8`) and clean pure white card containers (`#FFFFFF`).
- **Typography:** Editorial high-end editorial serif (`Fraunces, Georgia, serif`) for all prominent headings, paired with crisp, clean sans-serif (`Inter, system-ui, -apple-system, sans-serif`) for product specs, prices, and interactive buybox components.
- **Deep Berry Accent CTA:** The primary action button is an authoritative, luxurious deep berry / burgundy plum (`#6B1E46`) with a soft glow shadow (`rgba(107, 30, 70, 0.7) 0px 10px 24px -10px`), providing commanding visual weight without harshness.
- **Card Geometry & Proportions:** Rounded 14px card radii with 1px delicate borders (`#EAD7DD`), soft radio selection dots, and refined badge pills (`#B0476E` active border, `#FDF2F6` active fill).

---

## 2. COMPUTED STYLES & TOKEN AUDIT

### 2.1 Color Tokens

| Token Name | Computed Value | Hex Code | Visual Usage |
|---|---|---|---|
| `--zvhc-t01-bg` | `rgb(233, 228, 230)` | `#E9E4E6` | Main page background / canvas |
| `--zvhc-t01-bg-alt` | `rgb(251, 237, 232)` | `#FBEDE8` | Alternating section background |
| `--zvhc-t01-bg-card` | `rgb(255, 255, 255)` | `#FFFFFF` | Card & buy box component background |
| `--zvhc-t01-text-main` | `rgb(43, 27, 36)` | `#2B1B24` | Primary text, titles, headings |
| `--zvhc-t01-text-muted`| `rgb(90, 70, 81)` | `#5A4651` | Subtitles, product descriptions, secondary copy |
| `--zvhc-t01-header-bg` | `rgb(27, 20, 24)` | `#1B1418` | Top header toolbar background |
| `--zvhc-t01-cta-bg` | `rgb(107, 30, 70)` | `#6B1E46` | Primary Add to Cart button |
| `--zvhc-t01-cta-hover`| `rgb(82, 22, 54)` | `#521636` | Primary button hover state |
| `--zvhc-t01-accent-rose`| `rgb(176, 71, 110)` | `#B0476E` | Active card border, "Most Popular" badge |
| `--zvhc-t01-pill-bg` | `rgb(248, 228, 235)` | `#F8E4EB` | Savings pills, offer tags |
| `--zvhc-t01-card-sel-bg`| `rgb(253, 242, 246)`| `#FDF2F6` | Selected bundle card background |
| `--zvhc-t01-border` | `rgb(234, 215, 221)` | `#EAD7DD` | Default border for cards, accordions, inputs |
| `--zvhc-t01-star-gold` | `rgb(224, 163, 58)` | `#E0A33A` | Star ratings & verification stars |
| `--zvhc-t01-trust-green`| `rgb(63, 143, 107)` | `#3F8F6B` | Free shipping & checkmark trust accents |

---

### 2.2 Typography Scale

- **Heading Font Family:** `'Fraunces', Georgia, serif`
  - H1 (Product Title): `38px` / `line-height: 1.15` / `font-weight: 600`
  - H2 (Section Headings): `42px` / `line-height: 1.2` / `font-weight: 600`
  - H3 (Card / Block Titles): `20px` - `24px` / `font-weight: 600`
- **Body Font Family:** `'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`
  - Body Regular: `16px` / `line-height: 1.5` / `font-weight: 400`
  - Subtext / Meta: `13px` - `14px` / `line-height: 1.4`
  - Button Typography: `16px` / `font-weight: 700` / `letter-spacing: 0.04em` / Uppercase
  - Badge / Pill Typography: `11px` - `12px` / `font-weight: 800` / Uppercase

---

### 2.3 Component Geometry & Spacing

- **Container Maximum Width:** `1180px` (with `20px` padding on mobile/desktop)
- **Primary CTA Button:**
  - Height: `56px`
  - Border Radius: `12px`
  - Box Shadow: `rgba(107, 30, 70, 0.7) 0px 10px 24px -10px`
  - Full width in Buy Box
- **Bundle Cards (`kc-tier`):**
  - Border Radius: `14px`
  - Default Border: `1px solid #EAD7DD`
  - Selected Border: `2px solid #B0476E`
  - Selected Fill: `#FDF2F6`
  - Vertical Margin: `8px`
- **Product Gallery:**
  - Ratio: `1:1` square featured image with rounded corners (`16px`)
  - Sticky left column on Desktop (`min-width: 992px`)
- **Section Sequencing in Reference:**
  1. Top Announcement Bar
  2. Minimal Header (Logo, Nav, Cart Bag)
  3. Main Product Buy Box & Gallery
  4. Benefit Ticker Marquee
  5. UGC Video Carousel (Real customer stories)
  6. Visual Problem/Solution Editorial Block (Hair Tie / Part line)
  7. Science & Active Ingredients Breakdown
  8. Customer Timeline (Day 30 / Day 60 / Day 90)
  9. Verified Customer Reviews Widget
  10. Guarantee & Hassle-Free Returns
  11. Frequently Asked Questions Accordion
  12. Final Closing Call-to-Action
  13. Brand Footer

---

## 3. EVIDENCE RECORD

- **Desktop Viewport Screenshot:** `scratch/t01_reference/t01_desktop_hero.png`
- **Mobile Viewport Screenshot:** `scratch/t01_reference/t01_mobile_hero.png`
- **Extracted JSON Audit Data:** `scratch/t01_reference/t01_audit_data.json`
- **Detailed Component Audit Data:** `scratch/t01_reference/t01_detailed_audit.json`
