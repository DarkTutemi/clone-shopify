# Zavelyn Hair Care — Seven Products Import & Catalog Status

## 1. Catalog Architecture & Integration Summary

In accordance with Shopify draft data safety rules:
- **NO active public products have been added or modified on the live store.**
- The existing live Batana product (ID: `15461545935033`) remains completely untouched in its original state.
- All seven AliExpress candidates have been created as **unpublished DRAFT product records** in Shopify Admin via Admin API (`status: "draft"`), ensuring zero public visibility on live sales channels until launch approval.
- All 7 products have dedicated templates (`templates/product.zvhc-*.json`) uploaded to Draft Theme `189127983289`.

---

## 2. Product Records Breakdown (Shopify Admin Verified)

### Product 01: Zavelyn BotanaRoots Pure Batana Scalp & Hair Oil (60ml)
- **Source Item ID:** `3256807907799249`
- **Shopify Product ID:** `15542795731129`
- **Shopify Handle:** `zvhc-batana-hair-growth-oil`
- **Product Status:** `draft` (Unpublished)
- **Assigned Template:** `templates/product.zvhc-batana.json`
- **Bundle Strategy:** 1 Bottle ($39.99), 2 Bottles Duo ($69.99 - Save 30%), 3 Bottles Trio ($89.99 - Save 40%)
- **Harvested Media:** 6 High-Res Assets (Hero, Dropper Dispense, Real Results, Routine, Certification, Ingredients)

### Product 02: Zavelyn Instant Hair Density Keratin Building Fibers (100g)
- **Source Item ID:** `3256811885406846`
- **Shopify Product ID:** `15542795763897`
- **Shopify Handle:** `zvhc-keratin-hair-building-fibers`
- **Product Status:** `draft` (Unpublished)
- **Assigned Template:** `templates/product.zvhc-fibers.json`
- **Bundle Strategy:** 1 Pack 100g ($34.99), 2 Packs Duo ($59.99 - Save 30%), 3 Packs Trio ($79.99 - Save 40%)
- **Harvested Media:** 6 High-Res Assets (Hero, Before/After, Keratin Bond, Wind/Waterproof, Applicator, Shade Guide)

### Product 03: Zavelyn Root-Lift Volumizing & Mattifying Styling Powder (10g)
- **Source Item ID:** `3256810605010511`
- **Shopify Product ID:** `15542795796665`
- **Shopify Handle:** `zvhc-root-lift-styling-powder`
- **Product Status:** `draft` (Unpublished)
- **Assigned Template:** `templates/product.zvhc-powder.json`
- **Bundle Strategy:** 1 Unit ($19.99), 2 Units Duo ($34.99 - Save 30%), 3 Units Trio ($44.99 - Save 40%)
- **Harvested Media:** 6 High-Res Assets (Hero, Root Lift Demo, Texture Macro, Pump Action, Oil Absorption, Styling)

### Product 04: Zavelyn Precision Hairline Shadow & Root Concealer Compact (4g)
- **Source Item ID:** `3256808781854155`
- **Shopify Product ID:** `15542795862201`
- **Shopify Handle:** `zvhc-precision-hairline-compact`
- **Product Status:** `draft` (Unpublished)
- **Assigned Template:** `templates/product.zvhc-hairline.json`
- **Bundle Strategy:** 1 Compact ($24.99), 2 Compacts ($42.99 - Save 30%), 3 Compacts ($54.99 - Save 40%)
- **Harvested Media:** 6 High-Res Assets (Hero, Temple Touchup, Compact Opened, Waterproof Test, Sponge Puff, Shades)

### Product 05: Zavelyn Raw Unrefined Batana Scalp & Cuticle Balm (20g)
- **Source Item ID:** `3256807671072569`
- **Shopify Product ID:** `15542795894969`
- **Shopify Handle:** `zvhc-raw-batana-scalp-balm`
- **Product Status:** `draft` (Unpublished)
- **Assigned Template:** `templates/product.zvhc-balm.json`
- **Bundle Strategy:** 1 Tin ($19.99), 2 Tins ($34.99 - Save 30%), 3 Tins ($44.99 - Save 40%)
- **Harvested Media:** 6 High-Res Assets (Hero, Melting Texture, Overnight Mask, Split End Seal, Raw Nut, Tin Macro)

### Product 06: Zavelyn Botanical Curl Defining & Frizz-Shield Cream (100ml)
- **Source Item ID:** `3256811372233630`
- **Shopify Product ID:** `15542795927737`
- **Shopify Handle:** `zvhc-botanical-curl-cream`
- **Product Status:** `draft` (Unpublished)
- **Assigned Template:** `templates/product.zvhc-curl.json`
- **Bundle Strategy:** 1 Bottle ($29.99), 2 Bottles ($49.99 - Save 30%), 3 Bottles ($64.99 - Save 40%)
- **Harvested Media:** 6 High-Res Assets (Hero, 4C Curl Definition, Argan Moisture, Anti-Frizz Humidity Shield, Application, Texture)

### Product 07: Zavelyn 7-in-1 Botanical Multi-Oil Scalp & Growth Elixir (60ml)
- **Source Item ID:** `3256811903160451`
- **Shopify Product ID:** `15542795960505`
- **Shopify Handle:** `zvhc-7-in-1-growth-elixir`
- **Product Status:** `draft` (Unpublished)
- **Assigned Template:** `templates/product.zvhc-7in1.json`
- **Bundle Strategy:** 1 Bottle ($39.99), 2 Bottles ($69.99 - Save 30%), 3 Bottles ($89.99 - Save 40%)
- **Harvested Media:** 6 High-Res Assets (Hero, Dropper Texture, 7 Oils Breakdown, Scalp Application, Length Strength, Bottle Close-up)

---

## 3. Preservation of Legacy Products
- `zavelyn-botanaroots-organic-batana-hair-growth-oil` (ID: `15461545935033`) remains completely untouched in its active status and default template.
- All legacy ad landing pages (`breakout-2-0-holster`, `zavelyn-rehabilitation-glove`, `babiguard-head-protector`, `the-yeoman-sweep`) are registered in the protected legacy list and retain their original headers, footers, carts, and styling.
